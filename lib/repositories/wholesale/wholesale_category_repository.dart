import 'package:flutter/foundation.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleCategoryRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<WholesaleCategoryModel>> getCategories() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.wholesaleCategories);
    if (remoteList != null) {
      final list = <WholesaleCategoryModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final cat = WholesaleCategoryModel.fromJson(item);
          if (cat.id.isNotEmpty) {
            list.add(cat);
          }
        }
      }
      return list..sort((a, b) => a.sortOrder.compareTo(b.sortOrder));
    }
    return [];
  }

  Future<void> saveCategory(WholesaleCategoryModel category) async {
    try {
      final isExisting = category.id.isNotEmpty &&
          !category.id.startsWith('cat-') &&
          !category.id.startsWith('temp-');
      if (isExisting) {
        await _apiClient.putMap(
            ApiEndpoints.wholesaleCategoryById(category.id),
            category.toJson());
      } else {
        await _apiClient.postMap(
            ApiEndpoints.wholesaleCategories, category.toJson());
      }
    } catch (e) {
      debugPrint('WholesaleCategoryRepository saveCategory error: $e');
      rethrow;
    }
  }

  Future<void> deleteCategory(String categoryId) async {
    await _apiClient
        .deleteBool(ApiEndpoints.wholesaleCategoryById(categoryId));
  }
}
