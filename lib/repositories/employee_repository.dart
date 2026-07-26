import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../core/api/api_client.dart';
import '../models/employee_model.dart';
import '../models/employee_entry_model.dart';

class EmployeeRepository {
  static const String _employeesBoxName = 'employees';
  static const String _entriesBoxName = 'employee_entries';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    Hive.registerAdapter(EmployeeModelAdapter());
    Hive.registerAdapter(EmployeeEntryModelAdapter());
    final employeesBox = await Hive.openBox<EmployeeModel>(_employeesBoxName);
    final entriesBox = await Hive.openBox<EmployeeEntryModel>(_entriesBoxName);

    if (employeesBox.isEmpty) {
      await _seedData(employeesBox, entriesBox);
    }
  }

  Future<void> _seedData(
    Box<EmployeeModel> employeesBox,
    Box<EmployeeEntryModel> entriesBox,
  ) async {
    const uuid = Uuid();

    final emp1 = EmployeeModel(id: 'emp-1', name: 'Faruk Ahmed', shopId: 'shop-1', monthlySalary: 3500.0, createdAt: DateTime.now().subtract(const Duration(days: 60)));
    final emp2 = EmployeeModel(id: 'emp-2', name: 'Mohammad Al-Otaibi', shopId: 'shop-1', monthlySalary: 5500.0, createdAt: DateTime.now().subtract(const Duration(days: 45)));
    final emp3 = EmployeeModel(id: 'emp-3', name: 'Raju Dey', shopId: 'shop-2', monthlySalary: 2800.0, createdAt: DateTime.now().subtract(const Duration(days: 30)));

    await employeesBox.putAll({
      emp1.id: emp1,
      emp2.id: emp2,
      emp3.id: emp3,
    });

    final now = DateTime.now();
    final entries = <EmployeeEntryModel>[];

    entries.add(EmployeeEntryModel(
      id: uuid.v4(),
      employeeId: 'emp-1',
      entryType: 'salary',
      amount: 3500.0,
      kind: 'bank',
      notes: 'Salary payout for last month',
      txnDate: now.subtract(const Duration(days: 20)),
      createdAt: now.subtract(const Duration(days: 20)),
    ));

    entries.add(EmployeeEntryModel(
      id: uuid.v4(),
      employeeId: 'emp-1',
      entryType: 'give',
      amount: 400.0,
      kind: 'cash',
      notes: 'Mid-month cash advance request',
      txnDate: now.subtract(const Duration(days: 5)),
      createdAt: now.subtract(const Duration(days: 5)),
    ));

    for (final e in entries) {
      await entriesBox.put(e.id, e);
    }
  }

  // --- CRUD for Employees ---
  Future<List<EmployeeModel>> getEmployees({String? shopId}) async {
    final box = Hive.box<EmployeeModel>(_employeesBoxName);
    
    try {
      final remoteList = await _apiClient.getEmployees();
      if (remoteList != null && remoteList.isNotEmpty) {
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
      await _apiClient.createEmployee(employee.toJson());
    } catch (_) {}
  }

  // --- CRUD for Entries ---
  Future<List<EmployeeEntryModel>> getEntries({String? employeeId}) async {
    final box = Hive.box<EmployeeEntryModel>(_entriesBoxName);
    var query = box.values.where((e) => !e.isDeleted);
    
    if (employeeId != null) {
      query = query.where((e) => e.employeeId == employeeId);
    }
    
    return query.toList()..sort((a, b) => b.txnDate.compareTo(a.txnDate));
  }

  Future<void> saveEntry(EmployeeEntryModel entry) async {
    final box = Hive.box<EmployeeEntryModel>(_entriesBoxName);
    await box.put(entry.id, entry);
  }

  Future<void> deleteEntry(String id) async {
    final box = Hive.box<EmployeeEntryModel>(_entriesBoxName);
    final entry = box.get(id);
    if (entry != null) {
      await box.put(id, entry.copyWith(isDeleted: true));
    }
  }
}
