import '../../models/employee_entry_model.dart';
import '../../models/employee_model.dart';

abstract class EmployeeEvent {}

class LoadEmployeesList extends EmployeeEvent {
  final String? shopId;
  LoadEmployeesList({this.shopId});
}

class AddEmployee extends EmployeeEvent {
  final EmployeeModel employee;
  AddEmployee(this.employee);
}

class LoadEmployeeLedger extends EmployeeEvent {
  final String employeeId;
  LoadEmployeeLedger(this.employeeId);
}

class AddEmployeeEntry extends EmployeeEvent {
  final EmployeeEntryModel entry;
  AddEmployeeEntry(this.entry);
}

class DeleteEmployeeEntry extends EmployeeEvent {
  final String entryId;
  final String employeeId;
  DeleteEmployeeEntry(this.entryId, this.employeeId);
}
