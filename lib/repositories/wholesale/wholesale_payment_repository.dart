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
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final p = WholesalePaymentModel.fromJson(item);
            if (p.id.isNotEmpty) {
              await box.put(p.id, p);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((p) => !p.isDeleted).toList();
  }

  Future<void> savePayment(WholesalePaymentModel payment) async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    final isExisting = box.containsKey(payment.id);
    await box.put(payment.id, payment);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesalePaymentById(payment.id), payment.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesalePayments, payment.toJson());
      }
    } catch (_) {}
  }

  Future<void> deletePayment(String paymentId) async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    final payment = box.get(paymentId);
    if (payment != null) {
      await box.put(paymentId, payment.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesalePaymentById(paymentId));
    } catch (_) {}
  }
}
