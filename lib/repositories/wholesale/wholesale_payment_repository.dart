import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesalePaymentRepository {
  static const String _paymentsBoxName = 'wholesale_payments';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(15)) Hive.registerAdapter(WholesalePaymentModelAdapter());
    await Hive.openBox<WholesalePaymentModel>(_paymentsBoxName);
  }

  Future<List<WholesalePaymentModel>> getPayments() async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesalePayments);
      await box.clear();
      if (remoteList != null) {
        final list = <WholesalePaymentModel>[];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final p = WholesalePaymentModel.fromJson(item);
            if (p.id.isNotEmpty && !p.isDeleted) {
              await box.put(p.id, p);
              list.add(p);
            }
          }
        }
        return list;
      }
    } catch (e) {
      debugPrint('WholesalePaymentRepository getPayments error: $e');
      await box.clear();
    }
    return [];
  }

  Future<void> savePayment(WholesalePaymentModel payment) async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    final isExisting = payment.id.isNotEmpty && box.containsKey(payment.id);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesalePaymentById(payment.id), payment.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesalePayments, payment.toJson());
      }
      await box.put(payment.id, payment);
    } catch (e) {
      debugPrint('WholesalePaymentRepository savePayment error: $e');
      rethrow;
    }
  }

  Future<void> deletePayment(String paymentId) async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    await box.delete(paymentId);
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesalePaymentById(paymentId));
    } catch (e) {
      debugPrint('WholesalePaymentRepository deletePayment error: $e');
    }
  }
}
