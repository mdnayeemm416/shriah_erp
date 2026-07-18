import 'package:hive_flutter/hive_flutter.dart';
import '../models/cash_holder_model.dart';
import '../models/cash_snapshot_model.dart';

class CashSnapshotRepository {
  static const String _snapshotsBoxName = 'cash_in_hand_snapshots';
  static const String _holdersBoxName = 'current_cash_holders';

  Future<void> initialize() async {
    Hive.registerAdapter(CashHolderModelAdapter());
    Hive.registerAdapter(CashInHandSnapshotModelAdapter());

    await Hive.openBox<CashInHandSnapshotModel>(_snapshotsBoxName);
    await Hive.openBox<CashHolderModel>(_holdersBoxName);
  }

  Future<List<CashInHandSnapshotModel>> getSnapshots() async {
    final box = Hive.box<CashInHandSnapshotModel>(_snapshotsBoxName);
    final snapshots = box.values.toList();
    // Sort descending by snapshotDate
    snapshots.sort((a, b) => b.snapshotDate.compareTo(a.snapshotDate));
    return snapshots;
  }

  Future<void> saveSnapshot(CashInHandSnapshotModel snapshot) async {
    final box = Hive.box<CashInHandSnapshotModel>(_snapshotsBoxName);
    await box.put(snapshot.id, snapshot);
  }

  Future<void> deleteSnapshot(String id) async {
    final box = Hive.box<CashInHandSnapshotModel>(_snapshotsBoxName);
    await box.delete(id);
  }

  Future<List<CashHolderModel>> getCurrentHolders() async {
    final box = Hive.box<CashHolderModel>(_holdersBoxName);
    if (box.isEmpty) {
      // Default to one empty holder if none exist
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
  }
}
