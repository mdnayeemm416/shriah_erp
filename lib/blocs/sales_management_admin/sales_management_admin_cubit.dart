import 'package:flutter_bloc/flutter_bloc.dart';
import '../sales_management/sales_management_state.dart';
import 'sales_management_admin_state.dart';

class SalesManagementAdminCubit extends Cubit<SalesManagementAdminState> {
  SalesManagementAdminCubit() : super(SalesManagementAdminState.initial());

  void selectDate(DateTime date) {
    emit(state.copyWith(selectedDate: date));
  }

  void setSearchQuery(String query) {
    emit(state.copyWith(searchQuery: query));
  }

  void setPaymentTypeFilter(String type) {
    emit(state.copyWith(paymentTypeFilter: type));
  }

  void setCustomerFilter(String customer) {
    emit(state.copyWith(customerFilter: customer));
  }

  void setSalesmanFilter(String salesman) {
    emit(state.copyWith(salesmanFilter: salesman));
  }

  void addVisitRecord(VisitRecord record) {
    final updated = List<VisitRecord>.from(state.visitRecords)..add(record);
    emit(state.copyWith(visitRecords: updated));
  }
}
