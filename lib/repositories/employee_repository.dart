import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/employee_model.dart';
import '../models/employee_entry_model.dart';

class EmployeeRepository {
  static const String _employeesBoxName = 'employees';
  static const String _entriesBoxName = 'employee_entries';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    if (!Hive.isAdapterRegistered(21)) Hive.registerAdapter(EmployeeModelAdapter());
    if (!Hive.isAdapterRegistered(22)) Hive.registerAdapter(EmployeeEntryModelAdapter());
    await Hive.openBox<EmployeeModel>(_employeesBoxName);
    await Hive.openBox<EmployeeEntryModel>(_entriesBoxName);
  }

  // --- CRUD for Employees ---
  Future<List<EmployeeModel>> getEmployees({String? shopId}) async {
    final box = Hive.box<EmployeeModel>(_employeesBoxName);
    
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.employees);
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final emp = EmployeeModel.fromJson(item);
            if (emp.id.isNotEmpty) {
              await box.put(emp.id, emp);
            }
          }
        }
      }
    } catch (_) {}

    var list = box.values.where((e) => !e.isDeleted);
    if (shopId != null) {
      list = list.where((e) => e.shopId == shopId);
    }
    return list.toList();
  }

  Future<void> saveEmployee(EmployeeModel employee) async {
    final box = Hive.box<EmployeeModel>(_employeesBoxName);
    await box.put(employee.id, employee);

    try {
      await _apiClient.postMap(ApiEndpoints.employees, employee.toJson());
    } catch (_) {}
  }

  // --- CRUD for Entries ---
  Future<List<EmployeeEntryModel>> getEntries({String? employeeId}) async {
    final box = Hive.box<EmployeeEntryModel>(_entriesBoxName);
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.employeeEntries);
      if (remoteList != null && remoteList.isNotEmpty) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final entry = EmployeeEntryModel.fromJson(item);
            await box.put(entry.id, entry);
          }
        }
      }
    } catch (_) {}

    var query = box.values.where((e) => !e.isDeleted);
    
    if (employeeId != null) {
      query = query.where((e) => e.employeeId == employeeId);
    }
    
    return query.toList()..sort((a, b) => b.txnDate.compareTo(a.txnDate));
  }

  Future<void> saveEntry(EmployeeEntryModel entry) async {
    final box = Hive.box<EmployeeEntryModel>(_entriesBoxName);
    await box.put(entry.id, entry);
    try {
      await _apiClient.postMap(ApiEndpoints.employeeEntries, entry.toJson());
    } catch (_) {}
  }

  Future<void> deleteEntry(String id) async {
    final box = Hive.box<EmployeeEntryModel>(_entriesBoxName);
    final entry = box.get(id);
    if (entry != null) {
      await box.put(id, entry.copyWith(isDeleted: true));
    }
  }
}
