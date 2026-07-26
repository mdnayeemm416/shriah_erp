import 'package:hive_flutter/hive_flutter.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleCustomerRepository {
  static const String _customersBoxName = 'wholesale_customers';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(14)) Hive.registerAdapter(WholesaleCustomerModelAdapter());
    await Hive.openBox<WholesaleCustomerModel>(_customersBoxName);
  }

  Future<List<WholesaleCustomerModel>> getCustomers() async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesaleCustomers);
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final c = WholesaleCustomerModel.fromJson(item);
            if (c.id.isNotEmpty) {
              await box.put(c.id, c);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((c) => !c.isDeleted).toList();
  }

  Future<void> saveCustomer(WholesaleCustomerModel customer) async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    final isExisting = box.containsKey(customer.id);
    await box.put(customer.id, customer);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesaleCustomerById(customer.id), customer.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesaleCustomers, customer.toJson());
      }
    } catch (_) {}
  }

  Future<void> deleteCustomer(String customerId) async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    final customer = box.get(customerId);
    if (customer != null) {
      await box.put(customerId, customer.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleCustomerById(customerId));
    } catch (_) {}
  }

  Future<Map<String, dynamic>?> getCustomerStatement(String customerId) async {
    return await _apiClient.getMap(ApiEndpoints.wholesaleCustomerStatement(customerId));
  }
}
