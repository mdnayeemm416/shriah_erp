import 'package:hive_flutter/hive_flutter.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/opening_balance_model.dart';

class OpeningBalanceRepository {
  static const String _boxName = 'opening_balance_settings';
  static const String _amountKey = 'amount';
  static const String _dateKey = 'date';
  static const String _notesKey = 'notes';

  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    await Hive.openBox(_boxName);
  }

  /// Fetch current opening balance from GET API `/settings/opening-balance`
  /// or fallback to local Hive cache if offline/failed.
  Future<OpeningBalanceModel?> getOpeningBalance() async {
    final box = Hive.box(_boxName);
    try {
      final response = await _apiClient.getMap(ApiEndpoints.openingBalance);
      if (response != null) {
        final model = OpeningBalanceModel.fromJson(response);
        await box.put(_amountKey, model.amount);
        await box.put(_dateKey, model.date);
        if (model.notes != null) await box.put(_notesKey, model.notes);
        return model;
      }
    } catch (_) {}

    // Fallback to cached Hive box data
    final cachedAmount = box.get(_amountKey) as double?;
    if (cachedAmount != null) {
      final cachedDate = (box.get(_dateKey) as String?) ??
          DateTime.now().toIso8601String().split('T')[0];
      final cachedNotes = box.get(_notesKey) as String?;
      return OpeningBalanceModel(
        amount: cachedAmount,
        date: cachedDate,
        notes: cachedNotes,
      );
    }
    return null;
  }

  /// Set / Input Opening Balance to POST/PUT API `/settings/opening-balance`
  /// Request Body: { "amount": amount, "date": date, "notes": notes }
  Future<OpeningBalanceModel?> setOpeningBalance({
    required double amount,
    required String date,
    String? notes,
  }) async {
    final payload = <String, dynamic>{
      'amount': amount,
      'date': date,
      if (notes != null && notes.isNotEmpty) 'notes': notes,
    };

    final box = Hive.box(_boxName);
    // Cache locally immediately
    await box.put(_amountKey, amount);
    await box.put(_dateKey, date);
    if (notes != null) await box.put(_notesKey, notes);

    try {
      var response = await _apiClient.postMap(ApiEndpoints.openingBalance, payload);
      // Fallback to alt endpoint if primary returns null
      response ??= await _apiClient.postMap(ApiEndpoints.openingBalanceAlt, payload);

      if (response != null) {
        if (response['data'] is Map) {
          return OpeningBalanceModel.fromJson(
              Map<String, dynamic>.from(response['data'] as Map));
        }
        return OpeningBalanceModel.fromJson(response);
      }
    } catch (_) {}

    return OpeningBalanceModel(amount: amount, date: date, notes: notes);
  }
}
