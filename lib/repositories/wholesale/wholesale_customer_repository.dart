import 'package:flutter/foundation.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleCustomerRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<WholesaleCustomerModel>> getCustomers() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.wholesaleCustomers);
    if (remoteList != null) {
      final list = <WholesaleCustomerModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final c = WholesaleCustomerModel.fromJson(item);
          if (c.id.isNotEmpty && !c.isDeleted) {
            list.add(c);
          }
        }
      }
      return list;
    }
    return [];
  }

  Future<WholesaleCustomerModel?> saveCustomer(
      WholesaleCustomerModel customer) async {
    try {
      Map<String, dynamic>? res;
      // Determine if this is a new or existing customer
      final isExisting = customer.id.isNotEmpty &&
          !customer.id.startsWith('cust-') &&
          !customer.id.startsWith('temp-');
      if (isExisting) {
        res = await _apiClient.putMap(
            ApiEndpoints.wholesaleCustomerById(customer.id),
            customer.toJson());
      } else {
        res = await _apiClient.postMap(
            ApiEndpoints.wholesaleCustomers, customer.toJson());
      }

      if (res != null) {
        final saved = WholesaleCustomerModel.fromJson(res);
        return saved.id.isNotEmpty ? saved : customer;
      }
    } catch (e) {
      debugPrint('WholesaleCustomerRepository saveCustomer error: $e');
      rethrow;
    }
    return null;
  }

  Future<void> deleteCustomer(String customerId) async {
    await _apiClient
        .deleteBool(ApiEndpoints.wholesaleCustomerById(customerId));
  }

  Future<Map<String, dynamic>?> getCustomerStatement(
      String customerId) async {
    return await _apiClient
        .getMap(ApiEndpoints.wholesaleCustomerStatement(customerId));
  }
}
