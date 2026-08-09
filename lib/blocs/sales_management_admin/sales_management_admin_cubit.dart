import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../../repositories/sales_visit_repository.dart';
import 'sales_management_admin_state.dart';

class SalesManagementAdminCubit extends Cubit<SalesManagementAdminState> {
  final SalesVisitRepository salesVisitRepository;

  SalesManagementAdminCubit({required this.salesVisitRepository}) : super(SalesManagementAdminState.initial());

  Future<void> loadAdminDashboard() async {
    emit(state.copyWith(loading: true, error: ''));
    try {
      final dateStr = DateFormat('yyyy-MM-dd').format(state.selectedDate);
      
      final visits = await salesVisitRepository.getSalesVisits(
        date: dateStr,
        salesmanName: state.salesmanFilter,
        paymentType: state.paymentTypeFilter,
      );

      final summary = await salesVisitRepository.getDailyVisitSummary(date: dateStr);
      final breakdown = await salesVisitRepository.getSalesmenBreakdown(date: dateStr);
      
      final salesmenList = await salesVisitRepository.getSalesmen();
      final salesmenDropdown = ['All Salesmen', ...salesmenList];

      emit(state.copyWith(
        visitRecords: visits,
        summaryMetrics: summary,
        salesmenBreakdown: breakdown,
        salesmenDropdown: salesmenDropdown,
        loading: false,
      ));
    } catch (e) {
      emit(state.copyWith(
        loading: false,
        error: e.toString().replaceFirst('Exception: ', ''),
      ));
    }
  }

  void selectDate(DateTime date) {
    emit(state.copyWith(selectedDate: date));
    loadAdminDashboard();
  }

  void resetAndLoad() {
    emit(state.copyWith(
      selectedDate: DateTime.now(),
      paymentTypeFilter: 'All payment types',
      customerFilter: 'All customers',
      salesmanFilter: 'All Salesmen',
      searchQuery: '',
    ));
    loadAdminDashboard();
  }

  void setSearchQuery(String query) {
    emit(state.copyWith(searchQuery: query));
  }

  void setPaymentTypeFilter(String type) {
    emit(state.copyWith(paymentTypeFilter: type));
    loadAdminDashboard();
  }

  void setCustomerFilter(String customer) {
    emit(state.copyWith(customerFilter: customer));
  }

  void setSalesmanFilter(String salesman) {
    emit(state.copyWith(salesmanFilter: salesman));
    loadAdminDashboard();
  }

  Future<void> deleteVisitRecord(String id) async {
    emit(state.copyWith(loading: true, error: ''));
    try {
      final success = await salesVisitRepository.deleteSalesVisit(id);
      if (success) {
        await loadAdminDashboard();
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

  void clearError() {
    emit(state.copyWith(error: ''));
  }
}
