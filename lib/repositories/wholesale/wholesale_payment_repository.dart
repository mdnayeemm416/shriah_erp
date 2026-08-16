import 'package:flutter/foundation.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesalePaymentRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<WholesalePaymentModel>> getPayments() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.wholesalePayments);
    if (remoteList != null) {
      final list = <WholesalePaymentModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final p = WholesalePaymentModel.fromJson(item);
          if (p.id.isNotEmpty && !p.isDeleted) {
            list.add(p);
          }
        }
      }
      return list;
    }
    return [];
  }

  Future<void> savePayment(WholesalePaymentModel payment) async {
    try {
      final isExisting = payment.id.isNotEmpty &&
          !payment.id.startsWith('pay-') &&
          !payment.id.startsWith('temp-');
      if (isExisting) {
        await _apiClient.putMap(
            ApiEndpoints.wholesalePaymentById(payment.id),
            payment.toJson());
      } else {
        await _apiClient.postMap(
            ApiEndpoints.wholesalePayments, payment.toJson());
      }
    } catch (e) {
      debugPrint('WholesalePaymentRepository savePayment error: $e');
      rethrow;
    }
  }

  Future<void> deletePayment(String paymentId) async {
    await _apiClient
        .deleteBool(ApiEndpoints.wholesalePaymentById(paymentId));
  }
}
