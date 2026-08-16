import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/daily_closing_model.dart';

class DailyClosingRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<DailyClosingModel>> getClosings() async {
    final remoteList = await _apiClient.getList(ApiEndpoints.dailyClosings);
    if (remoteList != null) {
      final list = <DailyClosingModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final c = DailyClosingModel.fromJson(item);
          if (!c.isDeleted) list.add(c);
        }
      }
      list.sort((a, b) => b.closingDate.compareTo(a.closingDate));
      return list;
    }
    return [];
  }

  Future<DailyClosingModel?> getClosingForDate(DateTime date) async {
    final all = await getClosings();
    final dateStr = date.toIso8601String().split('T')[0];
    try {
      return all.firstWhere(
        (c) => c.closingDate.toIso8601String().split('T')[0] == dateStr,
      );
    } catch (_) {
      return null;
    }
  }

  Future<DailyClosingModel?> getPrecedingClosing(DateTime date) async {
    final all = await getClosings();
    final preceding = all.where((c) => c.closingDate.isBefore(date)).toList();
    if (preceding.isEmpty) return null;
    preceding.sort((a, b) => b.closingDate.compareTo(a.closingDate));
    return preceding.first;
  }

  Future<void> saveClosing(DailyClosingModel closing) async {
    await _apiClient.postMap(ApiEndpoints.dailyClosings, closing.toJson());
  }

  Future<void> deleteClosing(String id) async {
    await _apiClient.deleteBool('${ApiEndpoints.dailyClosings}/$id');
  }
}
