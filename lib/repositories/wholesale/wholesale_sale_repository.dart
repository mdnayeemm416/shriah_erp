import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:intl/intl.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleSaleRepository {
  static const String _salesBoxName = 'wholesale_sales';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(17)) Hive.registerAdapter(WholesaleSaleItemModelAdapter());
    if (!Hive.isAdapterRegistered(16)) Hive.registerAdapter(WholesaleSaleModelAdapter());
    await Hive.openBox<WholesaleSaleModel>(_salesBoxName);
  }

  Future<List<WholesaleSaleModel>> getSales({DateTime? startDate, DateTime? endDate}) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    try {
      String endpoint = ApiEndpoints.wholesaleSales;
      final queryParams = <String>[];
      final df = DateFormat('yyyy-MM-dd');

      if (startDate != null) {
        queryParams.add('start_date=${df.format(startDate)}');
      }
      if (endDate != null) {
        queryParams.add('end_date=${df.format(endDate)}');
      }
      if (queryParams.isNotEmpty) {
        endpoint = '$endpoint?${queryParams.join('&')}';
      }

      final remoteList = await _apiClient.getList(endpoint);
      await box.clear(); // Clear local cache to prevent leftover or stale sales from lingering
      if (remoteList != null) {
        final list = <WholesaleSaleModel>[];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final s = WholesaleSaleModel.fromJson(item);
            if (s.id.isNotEmpty) {
              await box.put(s.id, s);
              list.add(s);
            }
          }
        }
        return list;
      }
    } catch (e) {
      debugPrint('WholesaleSaleRepository getSales error: $e');
    }

    final localList = box.values.toList();
    if (startDate != null) {
      final start = DateTime(startDate.year, startDate.month, startDate.day);
      localList.removeWhere((s) => s.createdAt.isBefore(start));
    }
    if (endDate != null) {
      final end = DateTime(endDate.year, endDate.month, endDate.day, 23, 59, 59);
      localList.removeWhere((s) => s.createdAt.isAfter(end));
    }
    localList.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return localList;
  }

  Future<List<WholesaleSaleModel>> getRecycleBinSales() async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesaleSalesRecycleBin);
      if (remoteList != null) {
        final list = <WholesaleSaleModel>[];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final s = WholesaleSaleModel.fromJson(item);
            if (s.id.isNotEmpty) {
              list.add(s);
            }
          }
        }
        return list;
      }
    } catch (e) {
      debugPrint('WholesaleSaleRepository getRecycleBinSales error: $e');
    }

    return box.values.where((s) => s.isDeleted || s.status == 'cancelled').toList();
  }

  Future<WholesaleSaleModel?> saveSale(WholesaleSaleModel sale) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final isExisting = sale.id.isNotEmpty && box.containsKey(sale.id);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesaleSaleById(sale.id), sale.toCreateJson());
        await box.put(sale.id, sale);
        return sale;
      } else {
        final res = await _apiClient.postMap(ApiEndpoints.wholesaleSales, sale.toCreateJson());
        if (res != null) {
          final data = res['data'];
          if (data is Map<String, dynamic>) {
            final serverId = data['id'] as String?;
            final serverInv = data['invoice_number'] is int
                ? data['invoice_number'] as int
                : (data['invoice_number'] is String ? int.tryParse(data['invoice_number'] as String) : null);
            final finalSale = sale.copyWith(
              id: (serverId != null && serverId.isNotEmpty) ? serverId : sale.id,
              invoiceNumber: serverInv ?? sale.invoiceNumber,
            );
            await box.put(finalSale.id, finalSale);
            return finalSale;
          }
        }
      }
    } catch (e) {
      debugPrint('WholesaleSaleRepository saveSale error: $e');
      rethrow;
    }
    return null;
  }



  Future<void> cancelSale(String saleId) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final sale = box.get(saleId);
    if (sale != null) {
      await box.put(saleId, sale.copyWith(status: 'cancelled', isDeleted: true));
    }
    try {
      await _apiClient.postMap(ApiEndpoints.wholesaleSaleCancel(saleId), {});
    } catch (e) {
      debugPrint('WholesaleSaleRepository cancelSale error: $e');
    }
  }

  Future<void> softDeleteSale(String saleId) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final sale = box.get(saleId);
    if (sale != null) {
      await box.put(saleId, sale.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleSaleById(saleId));
    } catch (e) {
      debugPrint('WholesaleSaleRepository softDeleteSale error: $e');
    }
  }

  Future<void> restoreSale(String saleId) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final sale = box.get(saleId);
    if (sale != null) {
      await box.put(saleId, sale.copyWith(isDeleted: false, status: 'completed'));
    }
    try {
      await _apiClient.postMap(ApiEndpoints.wholesaleSaleRestore(saleId), {});
    } catch (e) {
      debugPrint('WholesaleSaleRepository restoreSale error: $e');
    }
  }

  Future<void> purgeSale(String saleId) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    await box.delete(saleId);
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleSalePurge(saleId));
    } catch (e) {
      debugPrint('WholesaleSaleRepository purgeSale error: $e');
    }
  }
}

