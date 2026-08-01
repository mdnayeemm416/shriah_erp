import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleCustomerRepository {
  static const String _customersBoxName = 'wholesale_customers';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    final adapter = WholesaleCustomerModelAdapter();
    if (!Hive.isAdapterRegistered(adapter.typeId)) {
      Hive.registerAdapter(adapter);
    }
    await Hive.openBox<WholesaleCustomerModel>(_customersBoxName);
  }

  Future<List<WholesaleCustomerModel>> getCustomers() async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesaleCustomers);
      await box.clear(); // Always clear local stale/dummy cache
      if (remoteList != null) {
        final list = <WholesaleCustomerModel>[];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final c = WholesaleCustomerModel.fromJson(item);
            if (c.id.isNotEmpty && !c.isDeleted) {
              await box.put(c.id, c);
              list.add(c);
            }
          }
        }
        return list;
      }
    } catch (e) {
      debugPrint('WholesaleCustomerRepository getCustomers error: $e');
      await box.clear(); // Clear local box on error so local test data is never shown
    }
    return [];
  }

  Future<WholesaleCustomerModel?> saveCustomer(WholesaleCustomerModel customer) async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    final isExisting = customer.id.isNotEmpty && box.containsKey(customer.id);

    try {
      Map<String, dynamic>? res;
      if (isExisting) {
        res = await _apiClient.putMap(ApiEndpoints.wholesaleCustomerById(customer.id), customer.toJson());
      } else {
        final payload = customer.toJson();
        res = await _apiClient.postMap(ApiEndpoints.wholesaleCustomers, payload);
      }

      if (res != null) {
        final saved = WholesaleCustomerModel.fromJson(res);
        if (saved.id.isNotEmpty) {
          await box.put(saved.id, saved);
          return saved;
        } else {
          await box.put(customer.id, customer);
          return customer;
        }
      }
    } catch (e) {
      debugPrint('WholesaleCustomerRepository saveCustomer error: $e');
      rethrow;
    }
    return null;
  }

  Future<void> deleteCustomer(String customerId) async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    await box.delete(customerId);
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleCustomerById(customerId));
    } catch (e) {
      debugPrint('WholesaleCustomerRepository deleteCustomer error: $e');
    }
  }

  Future<Map<String, dynamic>?> getCustomerStatement(String customerId) async {
    return await _apiClient.getMap(ApiEndpoints.wholesaleCustomerStatement(customerId));
  }
}
