import '../../models/employee_model.dart';
import '../../models/employee_entry_model.dart';

abstract class EmployeeState {}

class EmployeeInitial extends EmployeeState {}

class EmployeeLoading extends EmployeeState {}

class EmployeeLoaded extends EmployeeState {
  final List<EmployeeModel> employees;
  final EmployeeModel? selectedEmployee;
  final List<EmployeeEntryModel> ledger;
  final bool isLoadingLedger;
  final String? error;

  EmployeeLoaded({
    required this.employees,
    this.selectedEmployee,
    this.ledger = const [],
    this.isLoadingLedger = false,
    this.error,
  });

  // Calculate dynamic totals for employee wallet cards reactively
  double get totalGiven => ledger
      .where((e) => e.entryType == 'give')
      .fold(0.0, (sum, e) => sum + e.amount);

  double get totalReceived => ledger
      .where((e) => e.entryType == 'receive')
      .fold(0.0, (sum, e) => sum + e.amount);

  double get totalSalaryPaid => ledger
      .where((e) => e.entryType == 'salary')
      .fold(0.0, (sum, e) => sum + e.amount);

  double get totalExpensesClaimed => ledger
      .where((e) => e.entryType == 'expense')
      .fold(0.0, (sum, e) => sum + e.amount);

  // Balance calculations: Payouts/Advances given - Refunds received
  double get currentWalletBalance => totalGiven - totalReceived - totalExpensesClaimed;

  EmployeeLoaded copyWith({
    List<EmployeeModel>? employees,
    EmployeeModel? selectedEmployee,
    List<EmployeeEntryModel>? ledger,
    bool? isLoadingLedger,
    String? error,
  }) {
    return EmployeeLoaded(
      employees: employees ?? this.employees,
      selectedEmployee: selectedEmployee ?? this.selectedEmployee,
      ledger: ledger ?? this.ledger,
      isLoadingLedger: isLoadingLedger ?? this.isLoadingLedger,
      error: error,
    );
  }
}

class EmployeeErrorState extends EmployeeState {
  final String message;
  EmployeeErrorState(this.message);
}
