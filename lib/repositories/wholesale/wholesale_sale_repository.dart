import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleSaleRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<WholesaleSaleModel>> getSales(
      {DateTime? startDate, DateTime? endDate}) async {
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
    return [];
  }

  Future<List<WholesaleSaleModel>> getRecycleBinSales() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.wholesaleSalesRecycleBin);
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
    return [];
  }

  Future<WholesaleSaleModel?> saveSale(WholesaleSaleModel sale) async {
    try {
      final isExisting = sale.id.isNotEmpty &&
          !sale.id.startsWith('sale-') &&
          !sale.id.startsWith('temp-');
      if (isExisting) {
        await _apiClient.putMap(
            ApiEndpoints.wholesaleSaleById(sale.id), sale.toCreateJson());
        return sale;
      } else {
        final res = await _apiClient.postMap(
            ApiEndpoints.wholesaleSales, sale.toCreateJson());
        if (res != null) {
          final data = res['data'];
          if (data is Map<String, dynamic>) {
            final serverId = data['id'] as String?;
            final serverInv = data['invoice_number'] is int
                ? data['invoice_number'] as int
                : (data['invoice_number'] is String
                    ? int.tryParse(data['invoice_number'] as String)
                    : null);
            return sale.copyWith(
              id: (serverId != null && serverId.isNotEmpty)
                  ? serverId
                  : sale.id,
              invoiceNumber: serverInv ?? sale.invoiceNumber,
            );
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
    await _apiClient
        .postMap(ApiEndpoints.wholesaleSaleCancel(saleId), {});
  }

  Future<void> softDeleteSale(String saleId) async {
    await _apiClient
        .deleteBool(ApiEndpoints.wholesaleSaleById(saleId));
  }

  Future<void> restoreSale(String saleId) async {
    await _apiClient
        .postMap(ApiEndpoints.wholesaleSaleRestore(saleId), {});
  }

  Future<void> purgeSale(String saleId) async {
    await _apiClient
        .deleteBool(ApiEndpoints.wholesaleSalePurge(saleId));
  }
}
