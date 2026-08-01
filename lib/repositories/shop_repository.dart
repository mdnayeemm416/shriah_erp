import 'dart:io';
import 'package:dio/dio.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../models/shop_model.dart';
import '../models/cashier_model.dart';
import '../models/shop_entry_model.dart';
import '../models/shop_summary_model.dart';
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
  Future<List<ShopModel>> getShops({
    String? period,
    String? startDate,
    String? endDate,
    String? date,
  }) async {
    try {
      final Map<String, dynamic> params = {};
      if (period != null) params['period'] = period;
      if (startDate != null) params['start_date'] = startDate;
      if (endDate != null) params['end_date'] = endDate;
      if (date != null) params['date'] = date;

      final remoteList = await _apiClient.getList(
        ApiEndpoints.shops,
        queryParameters: params.isNotEmpty ? params : null,
      );
      if (remoteList != null) {
        final List<ShopModel> parsed = [];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            parsed.add(ShopModel.fromJson(item));
          }
        }
        return parsed.where((s) => !s.isDeleted).toList();
      }
    } catch (e) {
      print('Error fetching shops: $e');
    }
    return [];
  }

  Future<void> saveShop(ShopModel shop) async {
    try {
      final Map<String, dynamic> payload = {
        'id': shop.id,
        'name': shop.name,
        'shopType': shop.shopType,
        'openingBalance': shop.openingCash,
      };
      
      // If the ID starts with 'shop-', it's a temporary client ID, meaning it's new.
      final isNew = shop.id.startsWith('shop-');
      if (isNew) {
        await _apiClient.postMap(ApiEndpoints.shops, payload);
      } else {
        await _apiClient.putMap(ApiEndpoints.shopById(shop.id), payload);
      }
    } catch (e) {
      print('Error saving shop: $e');
      rethrow;
    }
  }

  // --- CRUD for Cashiers ---
  Future<List<CashierModel>> getCashiers(String shopId) async {
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.shopCashiers);
      if (remoteList != null) {
        final List<CashierModel> parsed = [];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            parsed.add(CashierModel.fromJson(item));
          }
        }
        return parsed.where((c) => c.shopId == shopId && !c.isDeleted).toList();
      }
    } catch (e) {
      print('Error fetching cashiers: $e');
    }
    return [];
  }

  Future<List<CashierModel>> getAllCashiers() async {
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.shopCashiers);
      if (remoteList != null) {
        final List<CashierModel> parsed = [];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            parsed.add(CashierModel.fromJson(item));
          }
        }
        return parsed.where((c) => !c.isDeleted).toList();
      }
    } catch (e) {
      print('Error fetching all cashiers: $e');
    }
    return [];
  }

  Future<void> saveCashier(CashierModel cashier) async {
    try {
      await _apiClient.postMap(ApiEndpoints.shopCashiers, cashier.toJson());
    } catch (e) {
      print('Error saving cashier: $e');
      rethrow;
    }
  }

  // --- CRUD for Entries ---
  Future<List<ShopEntryModel>> getEntries({
    String? shopId,
    String? period,
    String? startDate,
    String? endDate,
    String? date,
  }) async {
    try {
      final Map<String, dynamic> params = {};
      if (shopId != null && shopId.isNotEmpty && shopId != 'all') {
        params['shop_id'] = shopId;
      }
      if (period != null && period.isNotEmpty) params['period'] = period;
      if (startDate != null && startDate.isNotEmpty) params['start_date'] = startDate;
      if (endDate != null && endDate.isNotEmpty) params['end_date'] = endDate;
      if (date != null && date.isNotEmpty) params['date'] = date;

      final remoteList = await _apiClient.getList(
        ApiEndpoints.shopEntries,
        queryParameters: params.isNotEmpty ? params : null,
      );
      if (remoteList != null) {
        final List<ShopEntryModel> parsed = [];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            parsed.add(ShopEntryModel.fromJson(item));
          }
        }
        return parsed.where((e) => !e.isDeleted).toList()
          ..sort((a, b) => b.txnDate.compareTo(a.txnDate));
      }
    } catch (e) {
      print('Error fetching entries: $e');
      rethrow;
    }
    return [];
  }

  Future<void> saveEntry(ShopEntryModel entry, {bool isUpdate = false}) async {
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
        'difference': entry.difference,
        'dueReceivable': entry.dueReceivable,
        'total': entry.totalSale,
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

      final Response response;
      if (isUpdate) {
        response = await _apiClient.dio.put(
          '${ApiEndpoints.shopEntries}/${entry.id}',
          data: formData,
          options: Options(
            headers: {
              'Content-Type': 'multipart/form-data; boundary=${formData.boundary}',
            },
          ),
        );
      } else {
        response = await _apiClient.dio.post(
          ApiEndpoints.shopEntries,
          data: formData,
          options: Options(
            headers: {
              'Content-Type': 'multipart/form-data; boundary=${formData.boundary}',
            },
          ),
        );
      }

      if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == false) {
          throw Exception(body['message'] ?? 'API request failed');
        }
      } else if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Server returned status code ${response.statusCode}');
      }
    } catch (e) {
      print('Error saving shop entry: $e');
      rethrow;
    }
  }

  Future<void> deleteEntry(String id) async {
    try {
      await _apiClient.deleteBool('${ApiEndpoints.shopEntries}/$id');
    } catch (e) {
      print('Error deleting entry: $e');
      rethrow;
    }
  }

  Future<void> deleteShop(String id) async {
    try {
      await _apiClient.deleteBool('${ApiEndpoints.shops}/$id');
    } catch (e) {
      print('Error deleting shop: $e');
      rethrow;
    }
  }

  Future<void> deleteCashier(String id) async {
    try {
      await _apiClient.deleteBool('${ApiEndpoints.shopCashiers}/$id');
    } catch (e) {
      print('Error deleting cashier: $e');
      rethrow;
    }
  }

  Future<ShopSummaryModel?> getShopSummary({
    String? shopId,
    String? period,
    String? startDate,
    String? endDate,
    String? date,
  }) async {
    try {
      final Map<String, dynamic> params = {};
      if (period != null && period.isNotEmpty) params['period'] = period;
      if (startDate != null && startDate.isNotEmpty) params['start_date'] = startDate;
      if (endDate != null && endDate.isNotEmpty) params['end_date'] = endDate;
      if (date != null && date.isNotEmpty) params['date'] = date;

      final String path = (shopId != null && shopId.isNotEmpty && shopId != 'all')
          ? ApiEndpoints.shopSummaryById(shopId)
          : ApiEndpoints.shopSummary;

      final remoteMap = await _apiClient.getMap(
        path,
        queryParameters: params.isNotEmpty ? params : null,
      );
      if (remoteMap != null) {
        return ShopSummaryModel.fromJson(remoteMap);
      }
    } catch (e) {
      print('Error fetching shop summary: $e');
    }
    return null;
  }
}
