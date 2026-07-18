import 'package:hive_flutter/hive_flutter.dart';
import '../models/daily_closing_model.dart';

class DailyClosingRepository {
  static const String _boxName = 'daily_closings';

  Future<void> initialize() async {
    Hive.registerAdapter(DailyClosingModelAdapter());
    await Hive.openBox<DailyClosingModel>(_boxName);
  }

  Future<List<DailyClosingModel>> getClosings() async {
    final box = Hive.box<DailyClosingModel>(_boxName);
    final list = box.values.where((c) => !c.isDeleted).toList();
    list.sort((a, b) => b.closingDate.compareTo(a.closingDate));
    return list;
  }

  Future<DailyClosingModel?> getClosingForDate(DateTime date) async {
    final box = Hive.box<DailyClosingModel>(_boxName);
    final dateStr = date.toIso8601String().split('T')[0];
    try {
      return box.values.firstWhere(
        (c) => !c.isDeleted && c.closingDate.toIso8601String().split('T')[0] == dateStr,
      );
    } catch (_) {
      return null;
    }
  }

  Future<DailyClosingModel?> getPrecedingClosing(DateTime date) async {
    final box = Hive.box<DailyClosingModel>(_boxName);
    final list = box.values
        .where((c) => !c.isDeleted && c.closingDate.isBefore(date))
        .toList();
    if (list.isEmpty) return null;
    list.sort((a, b) => b.closingDate.compareTo(a.closingDate));
    return list.first;
  }

  Future<void> saveClosing(DailyClosingModel closing) async {
    final box = Hive.box<DailyClosingModel>(_boxName);
    await box.put(closing.id, closing);
  }

  Future<void> deleteClosing(String id) async {
    final box = Hive.box<DailyClosingModel>(_boxName);
    final closing = box.get(id);
    if (closing != null) {
      await box.put(id, closing.copyWith(isDeleted: true, updatedAt: DateTime.now()));
    }
  }
}
