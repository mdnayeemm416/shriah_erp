import 'package:flutter/foundation.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleOrderRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<WholesaleOrderModel>> getOrders() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.wholesaleOrders);
    if (remoteList != null) {
      final list = <WholesaleOrderModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final o = WholesaleOrderModel.fromJson(item);
          if (o.id.isNotEmpty && !o.isDeleted) {
            list.add(o);
          }
        }
      }
      return list;
    }
    return [];
  }

  Future<void> saveOrder(WholesaleOrderModel order) async {
    try {
      final isExisting = order.id.isNotEmpty &&
          !order.id.startsWith('order-') &&
          !order.id.startsWith('temp-');
      if (isExisting) {
        await _apiClient.putMap(
            ApiEndpoints.wholesaleOrderById(order.id), order.toJson());
      } else {
        await _apiClient.postMap(
            ApiEndpoints.wholesaleOrders, order.toJson());
      }
    } catch (e) {
      debugPrint('WholesaleOrderRepository saveOrder error: $e');
      rethrow;
    }
  }

  Future<void> updateOrderStatus(String orderId, String status) async {
    await _apiClient.postMap(
        ApiEndpoints.wholesaleOrderStatus(orderId), {'status': status});
  }

  Future<void> deleteOrder(String orderId) async {
    await _apiClient
        .deleteBool(ApiEndpoints.wholesaleOrderById(orderId));
  }
}
