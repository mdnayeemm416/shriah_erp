import 'package:hive_flutter/hive_flutter.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/employee_expense_model.dart';

class EmployeeExpenseRepository {
  static const String _boxName = 'employee_expenses';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    final adapter = EmployeeExpenseModelAdapter();
    if (!Hive.isAdapterRegistered(adapter.typeId)) {
      Hive.registerAdapter(adapter);
    }
    await Hive.openBox<EmployeeExpenseModel>(_boxName);
  }

  Future<List<EmployeeExpenseModel>> getExpensesForEmployee(String employeeId) async {
    final expenses = await getAllExpenses();
    return expenses.where((e) => e.employeeId == employeeId).toList();
  }

  Future<List<EmployeeExpenseModel>> getAllExpenses() async {
    final box = Hive.box<EmployeeExpenseModel>(_boxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.employeeExpenses);
      if (remoteList != null && remoteList.isNotEmpty) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final exp = EmployeeExpenseModel.fromJson(item);
            await box.put(exp.id, exp);
          }
        }
      }
    } catch (_) {}
    final list = box.values.where((e) => !e.isDeleted).toList();
    list.sort((a, b) => b.txnDate.compareTo(a.txnDate));
    return list;
  }

  Future<void> saveExpense(EmployeeExpenseModel expense) async {
    final box = Hive.box<EmployeeExpenseModel>(_boxName);
    await box.put(expense.id, expense);
    try {
      await _apiClient.postMap(ApiEndpoints.employeeExpenses, expense.toJson());
    } catch (_) {}
  }

  Future<void> deleteExpense(String id) async {
    final box = Hive.box<EmployeeExpenseModel>(_boxName);
    final expense = box.get(id);
    if (expense != null) {
      await box.put(id, expense.copyWith(isDeleted: true));
    }
  }

  Future<void> verifyDeposit(String id, String verifierId) async {
    final box = Hive.box<EmployeeExpenseModel>(_boxName);
    final expense = box.get(id);
    if (expense != null && expense.kind == 'deposit') {
      await box.put(
        id,
        expense.copyWith(
          status: 'verified',
        ),
      );
    }
  }
}
