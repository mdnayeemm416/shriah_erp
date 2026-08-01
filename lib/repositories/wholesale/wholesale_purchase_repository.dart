import 'package:flutter/foundation.dart';
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
      await box.clear();
      if (remoteList != null) {
        final list = <WholesalePurchaseModel>[];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final p = WholesalePurchaseModel.fromJson(item);
            if (p.id.isNotEmpty && !p.isDeleted) {
              await box.put(p.id, p);
              list.add(p);
            }
          }
        }
        return list;
      }
    } catch (e) {
      debugPrint('WholesalePurchaseRepository getPurchases error: $e');
      await box.clear();
    }
    return [];
  }

  Future<WholesalePurchaseModel> getPurchaseById(String id) async {
    try {
      final responseMap = await _apiClient.getMap(ApiEndpoints.wholesalePurchaseById(id));
      if (responseMap != null) {
        return WholesalePurchaseModel.fromJson(responseMap);
      }
      throw Exception('Server returned empty data for purchase $id');
    } catch (e) {
      debugPrint('WholesalePurchaseRepository getPurchaseById error: $e');
      rethrow;
    }
  }

  Future<void> savePurchase(WholesalePurchaseModel purchase) async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    final isExisting = purchase.id.isNotEmpty && box.containsKey(purchase.id);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesalePurchaseById(purchase.id), purchase.toApiJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesalePurchases, purchase.toApiJson());
      }
      await box.put(purchase.id, purchase);
    } catch (e) {
      debugPrint('WholesalePurchaseRepository savePurchase error: $e');
      rethrow;
    }
  }

  Future<void> deletePurchase(String purchaseId) async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    await box.delete(purchaseId);
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesalePurchaseById(purchaseId));
    } catch (e) {
      debugPrint('WholesalePurchaseRepository deletePurchase error: $e');
    }
  }
}
