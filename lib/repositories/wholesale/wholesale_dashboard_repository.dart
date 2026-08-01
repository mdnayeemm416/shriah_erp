import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleDashboardRepository {
  final ApiClient _apiClient = ApiClient();

  Future<Map<String, dynamic>?> getDashboardSummary() async {
    return await _apiClient.getMap(ApiEndpoints.wholesaleDashboardSummary);
  }

  Future<List<dynamic>?> getReceivablesBreakdown() async {
    return await _apiClient.getList(ApiEndpoints.wholesaleReceivablesBreakdown);
  }

  Future<WholesaleProfitDetailsModel?> getProfitDetails({
    String period = 'monthly',
    String? startDate,
    String? endDate,
  }) async {
    final queryParams = <String, dynamic>{
      'period': period,
    };
    if (startDate != null && startDate.isNotEmpty) {
      queryParams['startDate'] = startDate;
    }
    if (endDate != null && endDate.isNotEmpty) {
      queryParams['endDate'] = endDate;
    }

    final data = await _apiClient.getMap(
      ApiEndpoints.wholesaleProfitDetails,
      queryParameters: queryParams,
    );

    if (data != null) {
      return WholesaleProfitDetailsModel.fromJson(data);
    }
    return null;
  }
}
