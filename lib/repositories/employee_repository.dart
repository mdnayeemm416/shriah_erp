import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/employee_model.dart';
import '../models/employee_entry_model.dart';

class EmployeeRepository {
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // No local storage — all data comes from API
  }

  // --- CRUD for Employees ---
  Future<List<EmployeeModel>> getEmployees({String? shopId}) async {
    final remoteList = await _apiClient.getList(ApiEndpoints.employees);
    if (remoteList != null) {
      final list = <EmployeeModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final emp = EmployeeModel.fromJson(item);
          if (!emp.isDeleted) {
            list.add(emp);
          }
        }
      }
      if (shopId != null) {
        return list.where((e) => e.shopId == shopId).toList();
      }
      return list;
    }
    return [];
  }

  Future<void> saveEmployee(EmployeeModel employee) async {
    await _apiClient.postMap(ApiEndpoints.employees, employee.toJson());
  }

  // --- CRUD for Entries ---
  Future<List<EmployeeEntryModel>> getEntries({String? employeeId}) async {
    final remoteList = await _apiClient.getList(ApiEndpoints.employeeEntries);
    if (remoteList != null) {
      final list = <EmployeeEntryModel>[];
      for (final item in remoteList) {
        if (item is Map<String, dynamic>) {
          final entry = EmployeeEntryModel.fromJson(item);
          if (!entry.isDeleted) {
            list.add(entry);
          }
        }
      }
      if (employeeId != null) {
        return list
            .where((e) => e.employeeId == employeeId)
            .toList()
          ..sort((a, b) => b.txnDate.compareTo(a.txnDate));
      }
      return list..sort((a, b) => b.txnDate.compareTo(a.txnDate));
    }
    return [];
  }

  Future<void> saveEntry(EmployeeEntryModel entry) async {
    await _apiClient.postMap(ApiEndpoints.employeeEntries, entry.toJson());
  }

  Future<void> deleteEntry(String id) async {
    await _apiClient.deleteBool('${ApiEndpoints.employeeEntries}/$id');
  }
}
