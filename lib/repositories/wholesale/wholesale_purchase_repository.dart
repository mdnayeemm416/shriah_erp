import 'package:flutter/foundation.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesalePurchaseRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<WholesalePurchaseModel>> getPurchases() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.wholesalePurchases);
    if (remoteList != null) {
      final list = <WholesalePurchaseModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final p = WholesalePurchaseModel.fromJson(item);
          if (p.id.isNotEmpty && !p.isDeleted) {
            list.add(p);
          }
        }
      }
      return list;
    }
    return [];
  }

  Future<WholesalePurchaseModel> getPurchaseById(String id) async {
    final responseMap =
        await _apiClient.getMap(ApiEndpoints.wholesalePurchaseById(id));
    if (responseMap != null) {
      return WholesalePurchaseModel.fromJson(responseMap);
    }
    throw Exception('Server returned empty data for purchase $id');
  }

  Future<void> savePurchase(WholesalePurchaseModel purchase) async {
    try {
      final isExisting = purchase.id.isNotEmpty &&
          !purchase.id.startsWith('pur-') &&
          !purchase.id.startsWith('temp-');
      if (isExisting) {
        await _apiClient.putMap(
            ApiEndpoints.wholesalePurchaseById(purchase.id),
            purchase.toApiJson());
      } else {
        await _apiClient.postMap(
            ApiEndpoints.wholesalePurchases, purchase.toApiJson());
      }
    } catch (e) {
      debugPrint('WholesalePurchaseRepository savePurchase error: $e');
      rethrow;
    }
  }

  Future<void> deletePurchase(String purchaseId) async {
    await _apiClient
        .deleteBool(ApiEndpoints.wholesalePurchaseById(purchaseId));
  }
}
