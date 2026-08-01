import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleOrderRepository {
  static const String _ordersBoxName = 'wholesale_orders';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(19)) Hive.registerAdapter(WholesaleOrderModelAdapter());
    await Hive.openBox<WholesaleOrderModel>(_ordersBoxName);
  }

  Future<List<WholesaleOrderModel>> getOrders() async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesaleOrders);
      await box.clear();
      if (remoteList != null) {
        final list = <WholesaleOrderModel>[];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final o = WholesaleOrderModel.fromJson(item);
            if (o.id.isNotEmpty && !o.isDeleted) {
              await box.put(o.id, o);
              list.add(o);
            }
          }
        }
        return list;
      }
    } catch (e) {
      debugPrint('WholesaleOrderRepository getOrders error: $e');
      await box.clear();
    }
    return [];
  }

  Future<void> saveOrder(WholesaleOrderModel order) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    final isExisting = order.id.isNotEmpty && box.containsKey(order.id);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesaleOrderById(order.id), order.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesaleOrders, order.toJson());
      }
      await box.put(order.id, order);
    } catch (e) {
      debugPrint('WholesaleOrderRepository saveOrder error: $e');
      rethrow;
    }
  }

  Future<void> updateOrderStatus(String orderId, String status) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    final order = box.get(orderId);
    if (order != null) {
      await box.put(orderId, order.copyWith(status: status));
    }
    try {
      await _apiClient.postMap(ApiEndpoints.wholesaleOrderStatus(orderId), {'status': status});
    } catch (e) {
      debugPrint('WholesaleOrderRepository updateOrderStatus error: $e');
    }
  }

  Future<void> deleteOrder(String orderId) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    await box.delete(orderId);
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleOrderById(orderId));
    } catch (e) {
      debugPrint('WholesaleOrderRepository deleteOrder error: $e');
    }
  }
}
