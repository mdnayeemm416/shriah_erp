import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleSalesReturnRepository {
  final ApiClient _apiClient = ApiClient();

  Future<List<WholesaleSalesReturnModel>> getSalesReturns() async {
    final list = <WholesaleSalesReturnModel>[];
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesaleSalesReturns);
      if (remoteList != null) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            list.add(WholesaleSalesReturnModel.fromJson(item));
          }
        }
      }
    } catch (_) {}
    return list;
  }

  Future<Map<String, dynamic>?> createSalesReturn(WholesaleSalesReturnModel salesReturn) async {
    try {
      return await _apiClient.postMap(ApiEndpoints.wholesaleSalesReturns, salesReturn.toJson());
    } catch (_) {
      return null;
    }
  }
}
