import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleSalesReturnRepository {
  final ApiClient _apiClient = ApiClient();

  Future<List<WholesaleSalesReturnModel>> getSalesReturns({
    String? invoiceNumber,
    String? saleId,
  }) async {
    final list = <WholesaleSalesReturnModel>[];
    try {
      final queryParams = <String, dynamic>{};
      if (invoiceNumber != null) {
        queryParams['invoice_number'] = invoiceNumber;
      }
      if (saleId != null) {
        queryParams['sale_id'] = saleId;
      }
      final remoteList = await _apiClient.getList(
        ApiEndpoints.wholesaleSalesReturns,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );
      if (remoteList != null) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            list.add(WholesaleSalesReturnModel.fromJson(item));
          }
        }
      }
    } catch (e) {
      rethrow;
    }
    return list;
  }

  Future<Map<String, dynamic>?> createSalesReturn(WholesaleSalesReturnModel salesReturn) async {
    try {
      return await _apiClient.postMap(ApiEndpoints.wholesaleSalesReturns, salesReturn.toJson());
    } catch (e) {
      rethrow;
    }
  }

  Future<WholesaleInvoiceReturns?> getSaleReturns(String invoiceIdOrNumber) async {
    try {
      final data = await _apiClient.getMap('${ApiEndpoints.wholesaleSales}/$invoiceIdOrNumber/returns');
      if (data != null) {
        return WholesaleInvoiceReturns.fromJson(data);
      }
    } catch (e) {
      rethrow;
    }
    return null;
  }

  Future<WholesaleSalesReturnSummary?> getSalesReturnSummary() async {
    try {
      final data = await _apiClient.getMap('${ApiEndpoints.wholesaleSalesReturns}/summary');
      if (data != null) {
        return WholesaleSalesReturnSummary.fromJson(data);
      }
    } catch (e) {
      rethrow;
    }
    return null;
  }
}
