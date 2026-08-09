import 'package:flutter_bloc/flutter_bloc.dart';
import 'sales_management_state.dart';

class SalesManagementCubit extends Cubit<SalesManagementState> {
  SalesManagementCubit() : super(SalesManagementState.initial());

  void filterCustomers(String query) {
    final q = query.trim().toLowerCase();
    
    final List<StaticCustomer> filtered;
    if (q.isEmpty) {
      filtered = List.from(state.customers);
    } else {
      filtered = state.customers
          .where((c) =>
              c.name.toLowerCase().contains(q) ||
              (c.shopName?.toLowerCase().contains(q) ?? false) ||
              c.mobile.contains(q) ||
              (c.address?.toLowerCase().contains(q) ?? false))
          .toList();
    }

    emit(state.copyWith(
      searchQuery: query,
      filteredCustomers: filtered,
    ));
  }

  void addCustomer(StaticCustomer customer) {
    final updatedCustomers = List<StaticCustomer>.from(state.customers)..add(customer);
    emit(state.copyWith(
      customers: updatedCustomers,
    ));
    // Trigger filter again with current query to keep autocomplete synchronized
    filterCustomers(state.searchQuery);
  }

  void clearFilteredCustomers() {
    emit(state.copyWith(
      filteredCustomers: [],
    ));
  }

  void addVisitRecord(VisitRecord record) {
    final updatedRecords = List<VisitRecord>.from(state.visitRecords)..add(record);
    emit(state.copyWith(
      visitRecords: updatedRecords,
    ));
  }

  void selectDate(DateTime date) {
    emit(state.copyWith(
      selectedDate: date,
    ));
  }
}
