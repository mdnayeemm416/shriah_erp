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
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final o = WholesaleOrderModel.fromJson(item);
            if (o.id.isNotEmpty) {
              await box.put(o.id, o);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((o) => !o.isDeleted).toList();
  }

  Future<void> saveOrder(WholesaleOrderModel order) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    final isExisting = box.containsKey(order.id);
    await box.put(order.id, order);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesaleOrderById(order.id), order.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesaleOrders, order.toJson());
      }
    } catch (_) {}
  }

  Future<void> updateOrderStatus(String orderId, String status) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    final order = box.get(orderId);
    if (order != null) {
      await box.put(orderId, order.copyWith(status: status));
    }
    try {
      await _apiClient.postMap(ApiEndpoints.wholesaleOrderStatus(orderId), {'status': status});
    } catch (_) {}
  }

  Future<void> deleteOrder(String orderId) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    final order = box.get(orderId);
    if (order != null) {
      await box.put(orderId, order.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleOrderById(orderId));
    } catch (_) {}
  }
}
