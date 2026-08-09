import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'sales_management_state.dart';
import '../../models/sales_visit_model.dart';
import '../../repositories/sales_visit_repository.dart';

class SalesManagementCubit extends Cubit<SalesManagementState> {
  final SalesVisitRepository salesVisitRepository;

  SalesManagementCubit({
    required this.salesVisitRepository,
  }) : super(SalesManagementState.initial());

  void filterCustomers(String query) {
    final q = query.trim().toLowerCase();
    
    final List<SalesCustomerModel> filtered;
    if (q.isEmpty) {
      filtered = List.from(state.customers);
    } else {
      filtered = state.customers
          .where((c) =>
              c.name.toLowerCase().contains(q) ||
              c.mobile.contains(q) ||
              (c.address?.toLowerCase().contains(q) ?? false))
          .toList();
    }

    emit(state.copyWith(
      searchQuery: query,
      filteredCustomers: filtered,
    ));
  }

  Future<void> loadCustomers() async {
    emit(state.copyWith(loadingCustomers: true, customersError: ''));
    try {
      final customers = await salesVisitRepository.getSalesCustomers();
      emit(state.copyWith(
        customers: customers,
        loadingCustomers: false,
      ));
      filterCustomers(state.searchQuery);
    } catch (e) {
      emit(state.copyWith(
        loadingCustomers: false,
        customersError: e.toString().replaceFirst('Exception: ', ''),
      ));
    }
  }

  Future<void> createCustomer(SalesCustomerModel customer) async {
    emit(state.copyWith(loadingCustomers: true, customersError: ''));
    try {
      final saved = await salesVisitRepository.saveSalesCustomer(customer);
      if (saved != null) {
        final customers = await salesVisitRepository.getSalesCustomers();
        emit(state.copyWith(
          customers: customers,
          loadingCustomers: false,
        ));
        filterCustomers(state.searchQuery);
      } else {
        throw Exception('Failed to save customer.');
      }
    } catch (e) {
      emit(state.copyWith(
        loadingCustomers: false,
        customersError: e.toString().replaceFirst('Exception: ', ''),
      ));
      rethrow;
    }
  }

  void clearFilteredCustomers() {
    emit(state.copyWith(
      filteredCustomers: [],
    ));
  }

  Future<void> loadSalesVisits() async {
    emit(state.copyWith(loading: true, error: ''));
    try {
      final dateStr = DateFormat('yyyy-MM-dd').format(state.selectedDate);
      final visits = await salesVisitRepository.getSalesVisits(date: dateStr);
      final summary = await salesVisitRepository.getDailyVisitSummary(date: dateStr);
      emit(state.copyWith(
        visitRecords: visits,
        summaryMetrics: summary,
        loading: false,
      ));
    } catch (e) {
      emit(state.copyWith(
        loading: false,
        error: e.toString().replaceFirst('Exception: ', ''),
      ));
    }
  }

  Future<void> addVisitRecord(VisitRecord record) async {
    emit(state.copyWith(loading: true, error: ''));
    try {
      final savedRecord = await salesVisitRepository.saveSalesVisit(record);
      if (savedRecord != null) {
        final dateStr = DateFormat('yyyy-MM-dd').format(state.selectedDate);
        final visits = await salesVisitRepository.getSalesVisits(date: dateStr);
        final summary = await salesVisitRepository.getDailyVisitSummary(date: dateStr);
        emit(state.copyWith(
          visitRecords: visits,
          summaryMetrics: summary,
          loading: false,
        ));
      } else {
        throw Exception('Failed to save visit record.');
      }
    } catch (e) {
      emit(state.copyWith(
        loading: false,
        error: e.toString().replaceFirst('Exception: ', ''),
      ));
      rethrow;
    }
  }

  Future<void> deleteVisitRecord(String id) async {
    emit(state.copyWith(loading: true, error: ''));
    try {
      final success = await salesVisitRepository.deleteSalesVisit(id);
      if (success) {
        final dateStr = DateFormat('yyyy-MM-dd').format(state.selectedDate);
        final visits = await salesVisitRepository.getSalesVisits(date: dateStr);
        final summary = await salesVisitRepository.getDailyVisitSummary(date: dateStr);
        emit(state.copyWith(
          visitRecords: visits,
          summaryMetrics: summary,
          loading: false,
        ));
      } else {
        throw Exception('Failed to delete visit record.');
      }
    } catch (e) {
      emit(state.copyWith(
        loading: false,
        error: e.toString().replaceFirst('Exception: ', ''),
      ));
      rethrow;
    }
  }

  void selectDate(DateTime date) {
    emit(state.copyWith(selectedDate: date));
    loadSalesVisits();
  }

  void clearError() {
    emit(state.copyWith(error: ''));
  }
}
