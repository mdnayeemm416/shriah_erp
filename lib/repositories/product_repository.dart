import 'package:flutter/foundation.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/product_model.dart';

class ProductRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<ProductModel>> getProducts() async {
    final remoteData = await _apiClient.getList(ApiEndpoints.products);
    if (remoteData != null) {
      final list = <ProductModel>[];
      for (final item in remoteData) {
        if (item is Map<String, dynamic>) {
          final p = ProductModel.fromJson(item);
          if (p.id.isNotEmpty && !p.isDeleted) {
            list.add(p);
          }
        }
      }
      return list;
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
    try {
      final payload = {
        'name': product.name,
        'price': product.price,
        'purchase_price': product.purchasePrice,
        'purchasePrice': product.purchasePrice,
        'stock': product.stock,
        ...product.toJson(),
      };
      // Use a simple heuristic: if the product has an existing server-style ID, update; otherwise create
      final isExisting = product.id.isNotEmpty &&
          !product.id.startsWith('prod-') &&
          !product.id.startsWith('temp-');
      if (isExisting) {
        await _apiClient.putMap(
            ApiEndpoints.productById(product.id), payload);
      } else {
        if (payload['id'] == null || (payload['id'] is String && (payload['id'] as String).isEmpty)) {
          payload.remove('id');
        }
        await _apiClient.postMap(ApiEndpoints.products, payload);
      }
    } catch (e) {
      debugPrint('ProductRepository saveProduct error: $e');
      rethrow;
    }
  }

  Future<void> updateStock(String id, double newStock) async {
    // Fetch the current product from API to get full data
    final products = await getProducts();
    final p = products.where((prod) => prod.id == id).firstOrNull;
    if (p != null) {
      final updated = p.copyWith(stock: newStock);
      final payload = {
        'name': updated.name,
        'price': updated.price,
        'purchase_price': updated.purchasePrice,
        'purchasePrice': updated.purchasePrice,
        'stock': updated.stock,
        ...updated.toJson(),
      };
      await _apiClient.putMap(ApiEndpoints.productById(id), payload);
    }
  }

  Future<void> deleteProduct(String id) async {
    try {
      await _apiClient.deleteBool(ApiEndpoints.productById(id));
    } catch (e) {
      debugPrint('ProductRepository deleteProduct error: $e');
      rethrow;
    }
  }
}
