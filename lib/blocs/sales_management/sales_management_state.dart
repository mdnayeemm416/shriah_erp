import '../../models/sales_visit_model.dart';

class SalesManagementState {
  final List<SalesCustomerModel> customers;
  final List<SalesCustomerModel> filteredCustomers;
  final String searchQuery;
  final List<VisitRecord> visitRecords;
  final DateTime selectedDate;
  final bool loading;
  final String error;
  final bool loadingCustomers;
  final String customersError;
  final DailyVisitSummaryMetrics? summaryMetrics;

  const SalesManagementState({
    required this.customers,
    required this.filteredCustomers,
    required this.searchQuery,
    required this.visitRecords,
    required this.selectedDate,
    this.loading = false,
    this.error = '',
    this.loadingCustomers = false,
    this.customersError = '',
    this.summaryMetrics,
  });

  factory SalesManagementState.initial() {
    return SalesManagementState(
      customers: const [],
      filteredCustomers: const [],
      searchQuery: '',
      visitRecords: const [],
      selectedDate: DateTime.now(),
      loading: false,
      error: '',
      loadingCustomers: false,
      customersError: '',
      summaryMetrics: null,
    );
  }

  SalesManagementState copyWith({
    List<SalesCustomerModel>? customers,
    List<SalesCustomerModel>? filteredCustomers,
    String? searchQuery,
    List<VisitRecord>? visitRecords,
    DateTime? selectedDate,
    bool? loading,
    String? error,
    bool? loadingCustomers,
    String? customersError,
    DailyVisitSummaryMetrics? summaryMetrics,
  }) {
    return SalesManagementState(
      customers: customers ?? this.customers,
      filteredCustomers: filteredCustomers ?? this.filteredCustomers,
      searchQuery: searchQuery ?? this.searchQuery,
      visitRecords: visitRecords ?? this.visitRecords,
      selectedDate: selectedDate ?? this.selectedDate,
      loading: loading ?? this.loading,
      error: error ?? this.error,
      loadingCustomers: loadingCustomers ?? this.loadingCustomers,
      customersError: customersError ?? this.customersError,
      summaryMetrics: summaryMetrics ?? this.summaryMetrics,
    );
  }
}
