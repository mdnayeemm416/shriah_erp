import 'dart:io';
import 'package:dio/dio.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../models/shop_model.dart';
import '../models/cashier_model.dart';
import '../models/shop_entry_model.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';

class ShopRepository {
  static const String _shopsBoxName = 'shops';
  static const String _cashiersBoxName = 'cashiers';
  static const String _entriesBoxName = 'shop_entries';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(11)) Hive.registerAdapter(ShopModelAdapter());
    if (!Hive.isAdapterRegistered(12)) Hive.registerAdapter(CashierModelAdapter());
    if (!Hive.isAdapterRegistered(13)) Hive.registerAdapter(ShopEntryModelAdapter());

    await Hive.openBox<ShopModel>(_shopsBoxName);
    await Hive.openBox<CashierModel>(_cashiersBoxName);
    await Hive.openBox<ShopEntryModel>(_entriesBoxName);
  }

  // --- CRUD for Shops ---
  Future<List<ShopModel>> getShops() async {
    final box = Hive.box<ShopModel>(_shopsBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.shops);
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final s = ShopModel.fromJson(item);
            if (s.id.isNotEmpty) {
              await box.put(s.id, s);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((s) => !s.isDeleted).toList();
  }

  Future<void> saveShop(ShopModel shop) async {
    final box = Hive.box<ShopModel>(_shopsBoxName);
    final isExisting = box.containsKey(shop.id);
    await box.put(shop.id, shop);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.shopById(shop.id), shop.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.shops, shop.toJson());
      }
    } catch (_) {}
  }

  // --- CRUD for Cashiers ---
  Future<List<CashierModel>> getCashiers(String shopId) async {
    final box = Hive.box<CashierModel>(_cashiersBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.shopCashiers);
      if (remoteList != null && remoteList.isNotEmpty) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final c = CashierModel.fromJson(item);
            await box.put(c.id, c);
          }
        }
      }
    } catch (_) {}
    return box.values.where((c) => c.shopId == shopId && !c.isDeleted).toList();
  }

  Future<List<CashierModel>> getAllCashiers() async {
    final box = Hive.box<CashierModel>(_cashiersBoxName);
    return box.values.where((c) => !c.isDeleted).toList();
  }

  Future<void> saveCashier(CashierModel cashier) async {
    final box = Hive.box<CashierModel>(_cashiersBoxName);
    await box.put(cashier.id, cashier);
    try {
      await _apiClient.postMap(ApiEndpoints.shopCashiers, cashier.toJson());
    } catch (_) {}
  }

  // --- CRUD for Entries ---
  Future<List<ShopEntryModel>> getEntries({String? shopId, DateTime? date}) async {
    final box = Hive.box<ShopEntryModel>(_entriesBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.shopEntries);
      if (remoteList != null && remoteList.isNotEmpty) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final e = ShopEntryModel.fromJson(item);
            await box.put(e.id, e);
          }
        }
      }
    } catch (_) {}

    var query = box.values.where((e) => !e.isDeleted);
    
    if (shopId != null) {
      query = query.where((e) => e.shopId == shopId);
    }
    
    if (date != null) {
      final dateStr = date.toIso8601String().split('T')[0];
      query = query.where((e) => e.txnDate.toIso8601String().split('T')[0] == dateStr);
    }
    
    return query.toList()..sort((a, b) => b.txnDate.compareTo(a.txnDate));
  }

  Future<void> saveEntry(ShopEntryModel entry) async {
    final box = Hive.box<ShopEntryModel>(_entriesBoxName);
    
    // Optimistically write to Hive first
    await box.put(entry.id, entry);

    try {
      final attachmentPath = entry.attachmentUrl;
      bool isLocalFile = false;
      if (attachmentPath != null && attachmentPath.isNotEmpty) {
        final file = File(attachmentPath);
        if (await file.exists()) {
          isLocalFile = true;
        }
      }

      final Map<String, dynamic> formMap = {
        'id': entry.id,
        'shopId': entry.shopId,
        'entryType': entry.entryType,
        'posSale': entry.posSale,
        'cashSale': entry.cashSale,
        'bankSale': entry.bankSale,
        'creditSale': entry.creditSale,
        'purchaseAmount': entry.purchaseAmount,
        'expenseAmount': entry.expenseAmount,
        'withdrawAmount': entry.withdrawAmount,
        'txnDate': entry.txnDate.toIso8601String().split('T')[0],
      };

      if (entry.cashierId != null && entry.cashierId!.isNotEmpty) {
        formMap['cashierId'] = entry.cashierId;
      }
      if (entry.notes != null && entry.notes!.isNotEmpty) {
        formMap['notes'] = entry.notes;
      }

      if (isLocalFile && attachmentPath != null) {
        final fileName = attachmentPath.split(Platform.pathSeparator).last;
        formMap['file'] = await MultipartFile.fromFile(
          attachmentPath,
          filename: fileName,
        );
      }

      final formData = FormData.fromMap(formMap);

      final response = await _apiClient.dio.post(
        ApiEndpoints.shopEntries,
        data: formData,
      );

      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] != null) {
          final responseData = Map<String, dynamic>.from(body['data'] as Map);
          final assetUrl = (responseData['assetUrl'] ?? 
                            responseData['attachmentUrl'] ?? 
                            responseData['attachment_url']) as String?;
          if (assetUrl != null) {
            final updatedEntry = entry.copyWith(attachmentUrl: assetUrl);
            await box.put(updatedEntry.id, updatedEntry);
          }
        }
      }
    } catch (e) {
      // In case of error, we log/rethrow so that UI handles it, but local Hive cache remains intact
      print('Error saving shop entry: $e');
      rethrow;
    }
  }

  Future<void> deleteEntry(String id) async {
    final box = Hive.box<ShopEntryModel>(_entriesBoxName);
    final entry = box.get(id);
    if (entry != null) {
      await box.put(id, entry.copyWith(isDeleted: true));
    }
  }
}
