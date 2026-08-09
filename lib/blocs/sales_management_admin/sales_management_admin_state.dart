import '../../models/sales_visit_model.dart';

class SalesManagementAdminState {
  final List<VisitRecord> visitRecords;
  final DateTime selectedDate;
  final String searchQuery;
  final String paymentTypeFilter;
  final String customerFilter;
  final String salesmanFilter;
  final DailyVisitSummaryMetrics? summaryMetrics;
  final List<SalesmanPerformanceBreakdown> salesmenBreakdown;
  final List<String> salesmenDropdown;
  final bool loading;
  final String error;

  const SalesManagementAdminState({
    required this.visitRecords,
    required this.selectedDate,
    required this.searchQuery,
    required this.paymentTypeFilter,
    required this.customerFilter,
    required this.salesmanFilter,
    this.summaryMetrics,
    required this.salesmenBreakdown,
    required this.salesmenDropdown,
    this.loading = false,
    this.error = '',
  });

  factory SalesManagementAdminState.initial() {
    return SalesManagementAdminState(
      visitRecords: const [],
      selectedDate: DateTime.now(),
      searchQuery: '',
      paymentTypeFilter: 'All payment types',
      customerFilter: 'All customers',
      salesmanFilter: 'All Salesmen',
      summaryMetrics: null,
      salesmenBreakdown: const [],
      salesmenDropdown: const ['All Salesmen'],
      loading: false,
      error: '',
    );
  }

  SalesManagementAdminState copyWith({
    List<VisitRecord>? visitRecords,
    DateTime? selectedDate,
    String? searchQuery,
    String? paymentTypeFilter,
    String? customerFilter,
    String? salesmanFilter,
    DailyVisitSummaryMetrics? summaryMetrics,
    List<SalesmanPerformanceBreakdown>? salesmenBreakdown,
    List<String>? salesmenDropdown,
    bool? loading,
    String? error,
  }) {
    return SalesManagementAdminState(
      visitRecords: visitRecords ?? this.visitRecords,
      selectedDate: selectedDate ?? this.selectedDate,
      searchQuery: searchQuery ?? this.searchQuery,
      paymentTypeFilter: paymentTypeFilter ?? this.paymentTypeFilter,
      customerFilter: customerFilter ?? this.customerFilter,
      salesmanFilter: salesmanFilter ?? this.salesmanFilter,
      summaryMetrics: summaryMetrics ?? this.summaryMetrics,
      salesmenBreakdown: salesmenBreakdown ?? this.salesmenBreakdown,
      salesmenDropdown: salesmenDropdown ?? this.salesmenDropdown,
      loading: loading ?? this.loading,
      error: error ?? this.error,
    );
  }
}
