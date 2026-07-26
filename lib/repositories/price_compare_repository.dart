import 'package:hive_flutter/hive_flutter.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/price_compare_models.dart';

class PriceCompareRepository {
  static const String _productsBoxName = 'price_compare_products';
  static const String _recordsBoxName = 'price_compare_records';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    Hive.registerAdapter(PriceCompareProductModelAdapter());
    Hive.registerAdapter(PriceCompareRecordModelAdapter());
    await Hive.openBox<PriceCompareProductModel>(_productsBoxName);
    await Hive.openBox<PriceCompareRecordModel>(_recordsBoxName);
  }

  Future<List<Map<String, dynamic>>> getRemotePriceCompares() async {
    final list = <Map<String, dynamic>>[];
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesalePriceCompares);
      if (remoteList != null) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            list.add(item);
          }
        }
      }
    } catch (_) {}
    return list;
  }

  Future<List<PriceCompareProductModel>> getProducts() async {
    final box = Hive.box<PriceCompareProductModel>(_productsBoxName);
    return box.values.where((p) => !p.isDeleted).toList();
  }

  Future<PriceCompareProductModel?> getProductByBarcode(String barcode) async {
    final box = Hive.box<PriceCompareProductModel>(_productsBoxName);
    try {
      return box.values.firstWhere((p) => !p.isDeleted && p.barcode == barcode);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveProduct(PriceCompareProductModel product) async {
    final box = Hive.box<PriceCompareProductModel>(_productsBoxName);
    await box.put(product.id, product);
  }

  Future<void> deleteProduct(String id) async {
    final box = Hive.box<PriceCompareProductModel>(_productsBoxName);
    final product = box.get(id);
    if (product != null) {
      await box.put(id, product.copyWith(isDeleted: true));
      
      final recordsBox = Hive.box<PriceCompareRecordModel>(_recordsBoxName);
      final associated = recordsBox.values.where((r) => r.productId == id).toList();
      for (final r in associated) {
        await recordsBox.put(r.id, r.copyWith(isDeleted: true));
      }
    }
  }

  Future<List<PriceCompareRecordModel>> getRecords(String productId) async {
    final box = Hive.box<PriceCompareRecordModel>(_recordsBoxName);
    final list = box.values
        .where((r) => r.productId == productId && !r.isDeleted)
        .toList();
    list.sort((a, b) => b.recordDate.compareTo(a.recordDate));
    return list;
  }

  Future<void> saveRecord(PriceCompareRecordModel record) async {
    final box = Hive.box<PriceCompareRecordModel>(_recordsBoxName);
    await box.put(record.id, record);
  }

  Future<void> deleteRecord(String id) async {
    final box = Hive.box<PriceCompareRecordModel>(_recordsBoxName);
    final record = box.get(id);
    if (record != null) {
      await box.put(id, record.copyWith(isDeleted: true));
    }
  }

  Future<List<String>> listSuppliers() async {
    final box = Hive.box<PriceCompareRecordModel>(_recordsBoxName);
    final suppliers = box.values
        .where((r) => !r.isDeleted && r.supplier.isNotEmpty)
        .map((r) => r.supplier)
        .toSet()
        .toList();
    suppliers.sort();
    return suppliers;
  }
}
