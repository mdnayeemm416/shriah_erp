import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/employee_expense_model.dart';

class EmployeeExpenseRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  Future<List<EmployeeExpenseModel>> getExpensesForEmployee(
      String employeeId) async {
    final all = await getAllExpenses();
    return all.where((e) => e.employeeId == employeeId).toList();
  }

  Future<List<EmployeeExpenseModel>> getAllExpenses() async {
    final remoteList =
        await _apiClient.getList(ApiEndpoints.employeeExpenses);
    if (remoteList != null) {
      final list = <EmployeeExpenseModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final exp = EmployeeExpenseModel.fromJson(item);
          if (!exp.isDeleted) list.add(exp);
        }
      }
      list.sort((a, b) => b.txnDate.compareTo(a.txnDate));
      return list;
    }
    return [];
  }

  Future<void> saveExpense(EmployeeExpenseModel expense) async {
    await _apiClient.postMap(
        ApiEndpoints.employeeExpenses, expense.toJson());
  }

  Future<void> deleteExpense(String id) async {
    await _apiClient.deleteBool('${ApiEndpoints.employeeExpenses}/$id');
  }

  Future<void> verifyDeposit(String id, String verifierId) async {
    await _apiClient.postMap(
      '${ApiEndpoints.employeeExpenses}/$id/verify',
      {'verifierId': verifierId},
    );
  }
}
