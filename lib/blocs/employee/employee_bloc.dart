import 'package:flutter_bloc/flutter_bloc.dart';
import 'employee_event.dart';
import 'employee_state.dart';
import '../../repositories/employee_repository.dart';

class EmployeeBloc extends Bloc<EmployeeEvent, EmployeeState> {
  final EmployeeRepository employeeRepository;

  EmployeeBloc(this.employeeRepository) : super(EmployeeInitial()) {
    on<LoadEmployeesList>(_onLoadEmployeesList);
    on<AddEmployee>(_onAddEmployee);
    on<LoadEmployeeLedger>(_onLoadEmployeeLedger);
    on<AddEmployeeEntry>(_onAddEmployeeEntry);
    on<DeleteEmployeeEntry>(_onDeleteEmployeeEntry);
  }

  Future<void> _onLoadEmployeesList(LoadEmployeesList event, Emitter<EmployeeState> emit) async {
    emit(EmployeeLoading());
    try {
      final employees = await employeeRepository.getEmployees(shopId: event.shopId);
      if (employees.isNotEmpty) {
        final selected = employees.first;
        final ledger = await employeeRepository.getEntries(employeeId: selected.id);
        emit(EmployeeLoaded(
          employees: employees,
          selectedEmployee: selected,
          ledger: ledger,
        ));
      } else {
        emit(EmployeeLoaded(employees: const []));
      }
    } catch (e) {
      emit(EmployeeErrorState('Failed to load employees: ${e.toString()}'));
    }
  }

  Future<void> _onAddEmployee(AddEmployee event, Emitter<EmployeeState> emit) async {
    final currentState = state;
    if (currentState is EmployeeLoaded) {
      try {
        await employeeRepository.saveEmployee(event.employee);
        final employees = await employeeRepository.getEmployees();
        emit(currentState.copyWith(employees: employees));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to add employee: ${e.toString()}'));
      }
    }
  }

  Future<void> _onLoadEmployeeLedger(LoadEmployeeLedger event, Emitter<EmployeeState> emit) async {
    final currentState = state;
    if (currentState is EmployeeLoaded) {
      emit(currentState.copyWith(isLoadingLedger: true));
      try {
        final selected = currentState.employees.firstWhere((e) => e.id == event.employeeId);
        final ledger = await employeeRepository.getEntries(employeeId: event.employeeId);
        emit(currentState.copyWith(
          selectedEmployee: selected,
          ledger: ledger,
          isLoadingLedger: false,
        ));
      } catch (e) {
        emit(currentState.copyWith(isLoadingLedger: false, error: e.toString()));
      }
    }
  }

  Future<void> _onAddEmployeeEntry(AddEmployeeEntry event, Emitter<EmployeeState> emit) async {
    final currentState = state;
    if (currentState is EmployeeLoaded && currentState.selectedEmployee != null) {
      try {
        await employeeRepository.saveEntry(event.entry);
        final ledger = await employeeRepository.getEntries(employeeId: currentState.selectedEmployee!.id);
        emit(currentState.copyWith(ledger: ledger));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to add entry: ${e.toString()}'));
      }
    }
  }

  Future<void> _onDeleteEmployeeEntry(DeleteEmployeeEntry event, Emitter<EmployeeState> emit) async {
    final currentState = state;
    if (currentState is EmployeeLoaded) {
      try {
        await employeeRepository.deleteEntry(event.entryId);
        final ledger = await employeeRepository.getEntries(employeeId: event.employeeId);
        emit(currentState.copyWith(ledger: ledger));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to delete entry: ${e.toString()}'));
      }
    }
  }
}
