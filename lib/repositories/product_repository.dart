import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/product_model.dart';

class ProductRepository {
  static const String _boxName = 'products';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(10)) {
      Hive.registerAdapter(ProductModelAdapter());
    }
    await Hive.openBox<ProductModel>(_boxName);
  }

  Future<List<ProductModel>> getProducts() async {
    final box = Hive.box<ProductModel>(_boxName);
    
    try {
      final remoteData = await _apiClient.getList(ApiEndpoints.products);
      await box.clear();
      if (remoteData != null) {
        final list = <ProductModel>[];
        for (final item in remoteData) {
          if (item is Map<String, dynamic>) {
            final p = ProductModel.fromJson(item);
            if (p.id.isNotEmpty && !p.isDeleted) {
              await box.put(p.id, p);
              list.add(p);
            }
          }
        }
        return list;
      }
    } catch (e) {
      debugPrint('ProductRepository getProducts error: $e');
      await box.clear();
    }

    return [];
  }

  Future<List<ProductModel>> getLowStockProducts() async {
    final products = await getProducts();
    return products.where((p) => p.stock <= p.minStock).toList();
  }

  Future<ProductModel?> getProductByBarcode(String barcode) async {
    final products = await getProducts();
    try {
      return products.firstWhere((p) => p.barcode == barcode);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveProduct(ProductModel product) async {
    final box = Hive.box<ProductModel>(_boxName);
    final isExisting = product.id.isNotEmpty && box.containsKey(product.id);

    try {
      final payload = {
        'name': product.name,
        'price': product.price,
        'purchase_price': product.purchasePrice,
        'stock': product.stock,
        ...product.toJson(),
      };
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.productById(product.id), payload);
      } else {
        await _apiClient.postMap(ApiEndpoints.products, payload);
      }
      await box.put(product.id, product);
    } catch (e) {
      debugPrint('ProductRepository saveProduct error: $e');
      rethrow;
    }
  }

  Future<void> updateStock(String id, double newStock) async {
    final box = Hive.box<ProductModel>(_boxName);
    final p = box.get(id);
    if (p != null) {
      final updated = p.copyWith(stock: newStock);
      try {
        final payload = {
          'name': updated.name,
          'price': updated.price,
          'purchase_price': updated.purchasePrice,
          'stock': updated.stock,
          ...updated.toJson(),
        };
        await _apiClient.putMap(ApiEndpoints.productById(id), payload);
        await box.put(id, updated);
      } catch (e) {
        debugPrint('ProductRepository updateStock error: $e');
      }
    }
  }

  Future<void> deleteProduct(String id) async {
    final box = Hive.box<ProductModel>(_boxName);
    await box.delete(id);
    try {
      await _apiClient.deleteBool(ApiEndpoints.productById(id));
    } catch (e) {
      debugPrint('ProductRepository deleteProduct error: $e');
    }
  }
}
