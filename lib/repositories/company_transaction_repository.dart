import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/company_transaction_model.dart';

class CompanyTransactionRepository {
  static const String _boxName = 'company_transactions';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    final adapter = CompanyTransactionModelAdapter();
    if (!Hive.isAdapterRegistered(adapter.typeId)) {
      Hive.registerAdapter(adapter);
    }
    await Hive.openBox<CompanyTransactionModel>(_boxName);
  }

  Future<List<CompanyTransactionModel>> getTransactions() async {
    final box = Hive.box<CompanyTransactionModel>(_boxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.companyTransactions);
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final t = CompanyTransactionModel.fromJson(item);
            if (t.id.isNotEmpty) {
              await box.put(t.id, t);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((t) => !t.isDeleted).toList()
      ..sort((a, b) => b.txnDate.compareTo(a.txnDate));
  }

  Future<void> saveTransaction(CompanyTransactionModel transaction) async {
    final box = Hive.box<CompanyTransactionModel>(_boxName);
    await box.put(transaction.id, transaction);
    try {
      await _apiClient.postMap(ApiEndpoints.companyTransactions, transaction.toJson());
    } catch (_) {}
  }

  Future<void> deleteTransaction(String id) async {
    final box = Hive.box<CompanyTransactionModel>(_boxName);
    final txn = box.get(id);
    if (txn != null) {
      await box.put(id, txn.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteBool(ApiEndpoints.companyTransactionById(id));
    } catch (_) {}
  }
}
