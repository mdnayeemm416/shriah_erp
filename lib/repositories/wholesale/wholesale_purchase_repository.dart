import 'package:hive_flutter/hive_flutter.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesalePurchaseRepository {
  static const String _purchasesBoxName = 'wholesale_purchases';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(18)) Hive.registerAdapter(WholesalePurchaseModelAdapter());
    await Hive.openBox<WholesalePurchaseModel>(_purchasesBoxName);
  }

  Future<List<WholesalePurchaseModel>> getPurchases() async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesalePurchases);
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final p = WholesalePurchaseModel.fromJson(item);
            if (p.id.isNotEmpty) {
              await box.put(p.id, p);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((p) => !p.isDeleted).toList();
  }

  Future<void> savePurchase(WholesalePurchaseModel purchase) async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    final isExisting = box.containsKey(purchase.id);
    await box.put(purchase.id, purchase);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesalePurchaseById(purchase.id), purchase.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesalePurchases, purchase.toJson());
      }
    } catch (_) {}
  }

  Future<void> deletePurchase(String purchaseId) async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    final purchase = box.get(purchaseId);
    if (purchase != null) {
      await box.put(purchaseId, purchase.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesalePurchaseById(purchaseId));
    } catch (_) {}
  }
}
