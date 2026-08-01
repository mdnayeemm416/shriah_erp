import 'package:hive_flutter/hive_flutter.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/cash_holder_model.dart';
import '../models/cash_snapshot_model.dart';

class CashSnapshotRepository {
  static const String _snapshotsBoxName = 'cash_in_hand_snapshots';
  static const String _holdersBoxName = 'current_cash_holders';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    final holderAdapter = CashHolderModelAdapter();
    final snapshotAdapter = CashInHandSnapshotModelAdapter();

    if (!Hive.isAdapterRegistered(holderAdapter.typeId)) {
      Hive.registerAdapter(holderAdapter);
    }
    if (!Hive.isAdapterRegistered(snapshotAdapter.typeId)) {
      Hive.registerAdapter(snapshotAdapter);
    }

    await Hive.openBox<CashInHandSnapshotModel>(_snapshotsBoxName);
    await Hive.openBox<CashHolderModel>(_holdersBoxName);
  }

  Future<List<CashInHandSnapshotModel>> getSnapshots() async {
    final box = Hive.box<CashInHandSnapshotModel>(_snapshotsBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.cashSnapshots);
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final s = CashInHandSnapshotModel.fromJson(item);
            if (s.id.isNotEmpty) {
              await box.put(s.id, s);
            }
          }
        }
      }
    } catch (_) {}
    final snapshots = box.values.toList();
    snapshots.sort((a, b) => b.snapshotDate.compareTo(a.snapshotDate));
    return snapshots;
  }

  Future<void> saveSnapshot(CashInHandSnapshotModel snapshot) async {
    final box = Hive.box<CashInHandSnapshotModel>(_snapshotsBoxName);
    await box.put(snapshot.id, snapshot);
    try {
      await _apiClient.postMap(ApiEndpoints.cashSnapshots, snapshot.toJson());
    } catch (_) {}
  }

  Future<void> deleteSnapshot(String id) async {
    final box = Hive.box<CashInHandSnapshotModel>(_snapshotsBoxName);
    await box.delete(id);
    try {
      await _apiClient.deleteBool(ApiEndpoints.cashSnapshotById(id));
    } catch (_) {}
  }

  Future<List<CashHolderModel>> getCurrentHolders() async {
    final box = Hive.box<CashHolderModel>(_holdersBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.cashHolders);
      if (remoteList != null && remoteList.isNotEmpty) {
        await box.clear();
        for (int i = 0; i < remoteList.length; i++) {
          final item = remoteList[i];
          if (item is Map<String, dynamic>) {
            final h = CashHolderModel.fromJson(item);
            await box.put(i.toString(), h);
          }
        }
      }
    } catch (_) {}

    if (box.isEmpty) {
      return [CashHolderModel(name: '', amount: 0.0)];
    }
    return box.values.toList();
  }

  Future<void> saveCurrentHolders(List<CashHolderModel> holders) async {
    final box = Hive.box<CashHolderModel>(_holdersBoxName);
    await box.clear();
    for (int i = 0; i < holders.length; i++) {
      await box.put(i.toString(), holders[i]);
    }
    try {
      final data = holders.map((h) => h.toJson()).toList();
      await _apiClient.post(ApiEndpoints.cashHolders, data: data);
    } catch (_) {}
  }
}
