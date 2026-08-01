import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleCategoryRepository {
  static const String _categoriesBoxName = 'wholesale_categories';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(20)) Hive.registerAdapter(WholesaleCategoryModelAdapter());
    await Hive.openBox<WholesaleCategoryModel>(_categoriesBoxName);
  }

  Future<List<WholesaleCategoryModel>> getCategories() async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesaleCategories);
      await box.clear();
      if (remoteList != null) {
        final list = <WholesaleCategoryModel>[];
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final cat = WholesaleCategoryModel.fromJson(item);
            if (cat.id.isNotEmpty) {
              await box.put(cat.id, cat);
              list.add(cat);
            }
          }
        }
        return list..sort((a, b) => a.sortOrder.compareTo(b.sortOrder));
      }
    } catch (e) {
      debugPrint('WholesaleCategoryRepository getCategories error: $e');
      await box.clear();
    }
    return [];
  }

  Future<void> saveCategory(WholesaleCategoryModel category) async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    final isExisting = category.id.isNotEmpty && box.containsKey(category.id);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesaleCategoryById(category.id), category.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesaleCategories, category.toJson());
      }
      await box.put(category.id, category);
    } catch (e) {
      debugPrint('WholesaleCategoryRepository saveCategory error: $e');
      rethrow;
    }
  }

  Future<void> deleteCategory(String categoryId) async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    await box.delete(categoryId);
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleCategoryById(categoryId));
    } catch (e) {
      debugPrint('WholesaleCategoryRepository deleteCategory error: $e');
    }
  }
}
