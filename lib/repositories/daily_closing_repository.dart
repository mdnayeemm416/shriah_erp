import 'package:hive_flutter/hive_flutter.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/daily_closing_model.dart';

class DailyClosingRepository {
  static const String _boxName = 'daily_closings';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    final adapter = DailyClosingModelAdapter();
    if (!Hive.isAdapterRegistered(adapter.typeId)) {
      Hive.registerAdapter(adapter);
    }
    await Hive.openBox<DailyClosingModel>(_boxName);
  }

  Future<List<DailyClosingModel>> getClosings() async {
    final box = Hive.box<DailyClosingModel>(_boxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.dailyClosings);
      if (remoteList != null && remoteList.isNotEmpty) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final c = DailyClosingModel.fromJson(item);
            await box.put(c.id, c);
          }
        }
      }
    } catch (_) {}
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
    try {
      await _apiClient.postMap(ApiEndpoints.dailyClosings, closing.toJson());
    } catch (_) {}
  }

  Future<void> deleteClosing(String id) async {
    final box = Hive.box<DailyClosingModel>(_boxName);
    final closing = box.get(id);
    if (closing != null) {
      await box.put(id, closing.copyWith(isDeleted: true, updatedAt: DateTime.now()));
    }
  }
}
