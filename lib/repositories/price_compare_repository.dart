import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/price_compare_models.dart';

class PriceCompareRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<Map<String, dynamic>>> getRemotePriceCompares() async {
    final list = <Map<String, dynamic>>[];
    final remoteList =
        await _apiClient.getList(ApiEndpoints.wholesalePriceCompares);
    if (remoteList != null) {
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          list.add(item);
        }
      }
    }
    return list;
  }

  Future<List<PriceCompareProductModel>> getProducts() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.wholesalePriceCompares);
    if (remoteList != null) {
      final list = <PriceCompareProductModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final p = PriceCompareProductModel.fromJson(item);
          if (!p.isDeleted) list.add(p);
        }
      }
      return list;
    }
    return [];
  }

  Future<PriceCompareProductModel?> getProductByBarcode(
      String barcode) async {
    final products = await getProducts();
    try {
      return products.firstWhere((p) => p.barcode == barcode);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveProduct(PriceCompareProductModel product) async {
    await _apiClient.postMap(
        ApiEndpoints.wholesalePriceCompares, product.toJson());
  }

  Future<void> deleteProduct(String id) async {
    await _apiClient
        .deleteBool('${ApiEndpoints.wholesalePriceCompares}/$id');
  }

  Future<List<PriceCompareRecordModel>> getRecords(String productId) async {
    final remoteList = await _apiClient.getList(
        '${ApiEndpoints.wholesalePriceCompares}/$productId/records');
    if (remoteList != null) {
      final list = <PriceCompareRecordModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final r = PriceCompareRecordModel.fromJson(item);
          if (!r.isDeleted) list.add(r);
        }
      }
      list.sort((a, b) => b.recordDate.compareTo(a.recordDate));
      return list;
    }
    return [];
  }

  Future<void> saveRecord(PriceCompareRecordModel record) async {
    await _apiClient.postMap(
      '${ApiEndpoints.wholesalePriceCompares}/${record.productId}/records',
      record.toJson(),
    );
  }

  Future<void> deleteRecord(String id) async {
    await _apiClient.deleteBool(
        '${ApiEndpoints.wholesalePriceCompares}/records/$id');
  }

  Future<List<String>> listSuppliers() async {
    // Suppliers would come from records — fetch all records for all products
    // For now return empty; extend if API supports a dedicated endpoint
    return [];
  }
}
