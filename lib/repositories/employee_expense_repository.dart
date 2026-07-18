import 'package:hive_flutter/hive_flutter.dart';
import '../models/employee_expense_model.dart';

class EmployeeExpenseRepository {
  static const String _boxName = 'employee_expenses';

  Future<void> initialize() async {
    Hive.registerAdapter(EmployeeExpenseModelAdapter());
    await Hive.openBox<EmployeeExpenseModel>(_boxName);
  }

  Future<List<EmployeeExpenseModel>> getExpensesForEmployee(String employeeId) async {
    final box = Hive.box<EmployeeExpenseModel>(_boxName);
    final list = box.values
        .where((e) => e.employeeId == employeeId && !e.isDeleted)
        .toList();
    list.sort((a, b) => b.txnDate.compareTo(a.txnDate));
    return list;
  }

  Future<List<EmployeeExpenseModel>> getAllExpenses() async {
    final box = Hive.box<EmployeeExpenseModel>(_boxName);
    final list = box.values.where((e) => !e.isDeleted).toList();
    list.sort((a, b) => b.txnDate.compareTo(a.txnDate));
    return list;
  }

  Future<void> saveExpense(EmployeeExpenseModel expense) async {
    final box = Hive.box<EmployeeExpenseModel>(_boxName);
    await box.put(expense.id, expense);
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
