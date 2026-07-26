import 'package:hive_flutter/hive_flutter.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../models/wholesale_models.dart';

class WholesaleSaleRepository {
  static const String _salesBoxName = 'wholesale_sales';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(17)) Hive.registerAdapter(WholesaleSaleItemModelAdapter());
    if (!Hive.isAdapterRegistered(16)) Hive.registerAdapter(WholesaleSaleModelAdapter());
    await Hive.openBox<WholesaleSaleModel>(_salesBoxName);
  }

  Future<List<WholesaleSaleModel>> getSales() async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesaleSales);
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final s = WholesaleSaleModel.fromJson(item);
            if (s.id.isNotEmpty) {
              await box.put(s.id, s);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((s) => !s.isDeleted).toList();
  }

  Future<void> saveSale(WholesaleSaleModel sale) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final isExisting = box.containsKey(sale.id);
    await box.put(sale.id, sale);
    try {
      if (isExisting) {
        await _apiClient.putMap(ApiEndpoints.wholesaleSaleById(sale.id), sale.toJson());
      } else {
        await _apiClient.postMap(ApiEndpoints.wholesaleSales, sale.toJson());
      }
    } catch (_) {}
  }

  Future<void> cancelSale(String saleId) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final sale = box.get(saleId);
    if (sale != null) {
      await box.put(saleId, sale.copyWith(status: 'cancelled'));
    }
    try {
      await _apiClient.postMap(ApiEndpoints.wholesaleSaleCancel(saleId), {});
    } catch (_) {}
  }

  Future<void> deleteSale(String saleId) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final sale = box.get(saleId);
    if (sale != null) {
      await box.put(saleId, sale.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteBool(ApiEndpoints.wholesaleSaleById(saleId));
    } catch (_) {}
  }
}
