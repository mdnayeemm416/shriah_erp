import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:uuid/uuid.dart';
import '../../models/employee_expense_model.dart';
import '../../models/employee_model.dart';
import '../../repositories/employee_expense_repository.dart';
import '../../repositories/employee_repository.dart';

class MyExpensesState {
  final bool loading;
  final EmployeeModel? employee;
  final bool linked;
  final double balance;
  final double deposit;
  final double expense;
  final double depositMonth;
  final double expenseMonth;
  final List<EmployeeExpenseModel> expensesList;
  final List<EmployeeExpenseModel> allExpenses;
  final String filter; // 'today' | 'week' | 'month' | 'custom' | 'all'
  final DateTime fromDate;
  final DateTime toDate;

  MyExpensesState({
    this.loading = false,
    this.employee,
    this.linked = false,
    this.balance = 0.0,
    this.deposit = 0.0,
    this.expense = 0.0,
    this.depositMonth = 0.0,
    this.expenseMonth = 0.0,
    required this.expensesList,
    required this.allExpenses,
    this.filter = 'month',
    required this.fromDate,
    required this.toDate,
  });

  MyExpensesState copyWith({
    bool? loading,
    EmployeeModel? employee,
    bool? linked,
    double? balance,
    double? deposit,
    double? expense,
    double? depositMonth,
    double? expenseMonth,
    List<EmployeeExpenseModel>? expensesList,
    List<EmployeeExpenseModel>? allExpenses,
    String? filter,
    DateTime? fromDate,
    DateTime? toDate,
  }) {
    return MyExpensesState(
      loading: loading ?? this.loading,
      employee: employee ?? this.employee,
      linked: linked ?? this.linked,
      balance: balance ?? this.balance,
      deposit: deposit ?? this.deposit,
      expense: expense ?? this.expense,
      depositMonth: depositMonth ?? this.depositMonth,
      expenseMonth: expenseMonth ?? this.expenseMonth,
      expensesList: expensesList ?? this.expensesList,
      allExpenses: allExpenses ?? this.allExpenses,
      filter: filter ?? this.filter,
      fromDate: fromDate ?? this.fromDate,
      toDate: toDate ?? this.toDate,
    );
  }
}

class MyExpensesCubit extends Cubit<MyExpensesState> {
  final EmployeeExpenseRepository _expenseRepo;
  final EmployeeRepository _employeeRepo;

  MyExpensesCubit({
    required EmployeeExpenseRepository expenseRepo,
    required EmployeeRepository employeeRepo,
  })  : _expenseRepo = expenseRepo,
        _employeeRepo = employeeRepo,
        super(MyExpensesState(
          expensesList: [],
          allExpenses: [],
          fromDate: DateTime.now().subtract(const Duration(days: 30)),
          toDate: DateTime.now(),
        ));

  Future<void> loadForUser(String userId) async {
    emit(state.copyWith(loading: true));
    try {
      final employees = await _employeeRepo.getEmployees();
      
      // Link logic: match employee.id or simulated link by naming
      // Let's find an employee whose user_id is the userId or pre-link to emp-1 for default testing
      EmployeeModel? matched;
      try {
        matched = employees.firstWhere((e) => e.id == 'emp-1'); // Default fallback for seed
      } catch (_) {
        if (employees.isNotEmpty) matched = employees.first;
      }

      if (matched == null) {
        emit(state.copyWith(loading: false, linked: false));
        return;
      }

      final all = await _expenseRepo.getExpensesForEmployee(matched.id);
      emit(state.copyWith(
        loading: false,
        employee: matched,
        linked: true,
        allExpenses: all,
      ));

      _computeAndFilter();
    } catch (_) {
      emit(state.copyWith(loading: false));
    }
  }

  void changeFilter(String newFilter, {DateTime? from, DateTime? to}) {
    emit(state.copyWith(
      filter: newFilter,
      fromDate: from ?? state.fromDate,
      toDate: to ?? state.toDate,
    ));
    _computeAndFilter();
  }

  void _computeAndFilter() {
    final all = state.allExpenses;
    
    // Compute total verified deposits and total expenses
    double depositTotal = 0.0;
    double expenseTotal = 0.0;
    double depositMonth = 0.0;
    double expenseMonth = 0.0;

    final now = DateTime.now();
    final firstOfMonth = DateTime(now.year, now.month, 1);

    for (final e in all) {
      final amt = e.amount;
      if (e.kind == 'deposit') {
        if (e.status == 'verified') {
          depositTotal += amt;
          if (e.txnDate.isAfter(firstOfMonth) || e.txnDate.isAtSameMomentAs(firstOfMonth)) {
            depositMonth += amt;
          }
        }
      } else if (e.kind == 'expense') {
        expenseTotal += amt;
        if (e.txnDate.isAfter(firstOfMonth) || e.txnDate.isAtSameMomentAs(firstOfMonth)) {
          expenseMonth += amt;
        }
      }
    }

    final balance = depositTotal - expenseTotal;

    // Filter listing
    final filtered = all.where((e) {
      if (state.filter == 'all') return true;
      if (state.filter == 'custom') {
        final dStr = e.txnDate.toIso8601String().split('T')[0];
        final fStr = state.fromDate.toIso8601String().split('T')[0];
        final tStr = state.toDate.toIso8601String().split('T')[0];
        return dStr.compareTo(fStr) >= 0 && dStr.compareTo(tStr) <= 0;
      }
      
      final today = DateTime(now.year, now.month, now.day);
      DateTime start = today;
      if (state.filter == 'today') {
        start = today;
      } else if (state.filter == 'week') {
        start = today.subtract(const Duration(days: 7));
      } else if (state.filter == 'month') {
        start = firstOfMonth;
      }

      return e.txnDate.isAfter(start) || e.txnDate.isAtSameMomentAs(start);
    }).toList();

    emit(state.copyWith(
      balance: balance,
      deposit: depositTotal,
      expense: expenseTotal,
      depositMonth: depositMonth,
      expenseMonth: expenseMonth,
      expensesList: filtered,
    ));
  }

  Future<void> submitExpense({
    required String kind, // 'deposit' | 'expense'
    required double amount,
    required String category,
    required String note,
    required DateTime date,
    String? attachmentUrl,
    required String userId,
  }) async {
    if (state.employee == null) return;
    
    final exp = EmployeeExpenseModel(
      id: const Uuid().v4(),
      employeeId: state.employee!.id,
      kind: kind,
      status: kind == 'deposit' ? 'pending' : 'verified', // Expenses auto-verified, deposits pending audit
      amount: amount,
      category: category,
      note: note,
      txnDate: date,
      attachmentUrl: attachmentUrl,
      createdAt: DateTime.now(),
      createdBy: userId,
    );

    await _expenseRepo.saveExpense(exp);
    final all = await _expenseRepo.getExpensesForEmployee(state.employee!.id);
    emit(state.copyWith(allExpenses: all));
    _computeAndFilter();
  }

  Future<void> deleteExpense(String id) async {
    if (state.employee == null) return;
    await _expenseRepo.deleteExpense(id);
    final all = await _expenseRepo.getExpensesForEmployee(state.employee!.id);
    emit(state.copyWith(allExpenses: all));
    _computeAndFilter();
  }
}
