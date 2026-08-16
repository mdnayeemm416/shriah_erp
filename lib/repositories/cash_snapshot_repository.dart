import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/cash_holder_model.dart';
import '../models/cash_snapshot_model.dart';

class CashSnapshotRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<CashInHandSnapshotModel>> getSnapshots() async {
    final remoteList = await _apiClient.getList(ApiEndpoints.cashSnapshots);
    if (remoteList != null) {
      final list = <CashInHandSnapshotModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final s = CashInHandSnapshotModel.fromJson(item);
          list.add(s);
        }
      }
      list.sort((a, b) => b.snapshotDate.compareTo(a.snapshotDate));
      return list;
    }
    return [];
  }

  Future<void> saveSnapshot(CashInHandSnapshotModel snapshot) async {
    await _apiClient.postMap(ApiEndpoints.cashSnapshots, snapshot.toJson());
  }

  Future<void> deleteSnapshot(String id) async {
    await _apiClient.deleteBool(ApiEndpoints.cashSnapshotById(id));
  }

  Future<List<CashHolderModel>> getCurrentHolders() async {
    final remoteList = await _apiClient.getList(ApiEndpoints.cashHolders);
    if (remoteList != null && remoteList.isNotEmpty) {
      final list = <CashHolderModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          list.add(CashHolderModel.fromJson(item));
        }
      }
      return list;
    }
    return [CashHolderModel(name: '', amount: 0.0)];
  }

  Future<void> saveCurrentHolders(List<CashHolderModel> holders) async {
    final data = holders.map((h) => h.toJson()).toList();
    await _apiClient.post(ApiEndpoints.cashHolders, data: data);
  }
}
