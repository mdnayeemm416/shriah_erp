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
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final cat = WholesaleCategoryModel.fromJson(item);
            if (cat.id.isNotEmpty) {
              await box.put(cat.id, cat);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.toList()..sort((a, b) => a.sortOrder.compareTo(b.sortOrder));
  }

  Future<void> saveCategory(WholesaleCategoryModel category) async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    final isExisting = box.containsKey(category.id);
    await box.put(category.id, category);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesaleCategoryById(category.id), category.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesaleCategories, category.toJson());
      }
    } catch (_) {}
  }

  Future<void> deleteCategory(String categoryId) async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    await box.delete(categoryId);
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleCategoryById(categoryId));
    } catch (_) {}
  }
}
