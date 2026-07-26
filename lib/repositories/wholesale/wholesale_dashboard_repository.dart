import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';

class WholesaleDashboardRepository {
  final ApiClient _apiClient = ApiClient();

  Future<Map<String, dynamic>?> getDashboardSummary() async {
    return await _apiClient.getMap(ApiEndpoints.wholesaleDashboardSummary);
  }

  Future<List<dynamic>?> getReceivablesBreakdown() async {
    return await _apiClient.getList(ApiEndpoints.wholesaleReceivablesBreakdown);
  }
}
