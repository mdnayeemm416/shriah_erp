import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/company_transaction_model.dart';

class CompanyTransactionRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<CompanyTransactionModel>> getTransactions() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.companyTransactions);
    if (remoteList != null) {
      final list = <CompanyTransactionModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final t = CompanyTransactionModel.fromJson(item);
          if (!t.isDeleted) list.add(t);
        }
      }
      list.sort((a, b) => b.txnDate.compareTo(a.txnDate));
      return list;
    }
    return [];
  }

  Future<void> saveTransaction(CompanyTransactionModel transaction) async {
    await _apiClient.postMap(
        ApiEndpoints.companyTransactions, transaction.toJson());
  }

  Future<void> deleteTransaction(String id) async {
    await _apiClient
        .deleteBool(ApiEndpoints.companyTransactionById(id));
  }
}
