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
      if (remoteData != null) {
        await box.clear();
        for (final item in remoteData) {
          if (item is Map<String, dynamic>) {
            final p = ProductModel.fromJson(item);
            if (p.id.isNotEmpty) {
              await box.put(p.id, p);
            }
          }
        }
      }
    } catch (_) {
      // Remote fetch failed, fallback to cached Hive box
    }

    return box.values.where((p) => !p.isDeleted).toList();
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
    final isExisting = box.containsKey(product.id);
    await box.put(product.id, product);

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
    } catch (_) {
      // Saved locally in Hive
    }
  }

  Future<void> updateStock(String id, double newStock) async {
    final box = Hive.box<ProductModel>(_boxName);
    final p = box.get(id);
    if (p != null) {
      final updated = p.copyWith(stock: newStock);
      await box.put(id, updated);
      try {
        final payload = {
          'name': updated.name,
          'price': updated.price,
          'purchase_price': updated.purchasePrice,
          'stock': updated.stock,
          ...updated.toJson(),
        };
        await _apiClient.putMap(ApiEndpoints.productById(id), payload);
      } catch (_) {}
    }
  }

  Future<void> deleteProduct(String id) async {
    final box = Hive.box<ProductModel>(_boxName);
    final p = box.get(id);
    if (p != null) {
      await box.put(id, p.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteBool(ApiEndpoints.productById(id));
    } catch (_) {}
  }
}
