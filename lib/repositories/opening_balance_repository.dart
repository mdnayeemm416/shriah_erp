import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/opening_balance_model.dart';

class OpeningBalanceRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<OpeningBalanceModel?> getOpeningBalance() async {
    final response = await _apiClient.getMap(ApiEndpoints.openingBalance);
    if (response != null) {
      return OpeningBalanceModel.fromJson(response);
    }
    return null;
  }

  Future<OpeningBalanceModel?> setOpeningBalance({
    required double amount,
    required String date,
    String? notes,
  }) async {
    final payload = <String, dynamic>{
      'amount': amount,
      'date': date,
      if (notes != null && notes.isNotEmpty) 'notes': notes,
    };

    var response =
        await _apiClient.postMap(ApiEndpoints.openingBalance, payload);
    // Fallback to alt endpoint if primary returns null
    response ??=
        await _apiClient.postMap(ApiEndpoints.openingBalanceAlt, payload);

    if (response != null) {
      if (response['data'] is Map) {
        return OpeningBalanceModel.fromJson(
            Map<String, dynamic>.from(response['data'] as Map));
      }
      return OpeningBalanceModel.fromJson(response);
    }

    return null;
  }
}
