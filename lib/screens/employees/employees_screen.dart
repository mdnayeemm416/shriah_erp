import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';

import '../../blocs/employee/employee_bloc.dart';
import '../../blocs/employee/employee_event.dart';
import '../../blocs/employee/employee_state.dart';
import '../../models/employee_model.dart';
import '../../models/employee_entry_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/localization/translate_extension.dart';

class EmployeesScreen extends StatefulWidget {
  const EmployeesScreen({super.key});

  @override
  State<EmployeesScreen> createState() => _EmployeesScreenState();
}

class _EmployeesScreenState extends State<EmployeesScreen> {
  final _employeeNameController = TextEditingController();
  final _salaryController = TextEditingController();

  @override
  void dispose() {
    _employeeNameController.dispose();
    _salaryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = context.watch<EmployeeBloc>().state;

    if (state is EmployeeLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is EmployeeLoaded) {
      final employees = state.employees;
      final selected = state.selectedEmployee;
      final ledger = state.ledger;

      return LayoutBuilder(
        builder: (context, constraints) {
          final isLargeScreen = constraints.maxWidth > 800;

          if (isLargeScreen) {
            // Split view layout for Desktop
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Left side Master: List of Employees
                SizedBox(
                  width: 320,
                  child: _buildEmployeeListPanel(context, employees, selected, isDark),
                ),
                const VerticalDivider(width: 1),
                // Right side Detail: Employee Wallet details
                Expanded(
                  child: selected == null
                      ? const Center(child: Text('Add or select an employee to view details'))
                      : buildEmployeeDetailPanel(context, selected, ledger, state, isDark),
                ),
              ],
            );
          } else {
            // Mobile navigation view (List view by default, clicking pushes detail page)
            return _buildEmployeeListPanel(context, employees, selected, isDark, onSelectMobile: (emp) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => BlocProvider.value(
                    value: BlocProvider.of<EmployeeBloc>(context),
                    child: MobileEmployeeDetailView(employee: emp),
                  ),
                ),
              );
            });
          }
        },
      );
    }

    return const Center(child: Text('No employees found.'));
  }

  Widget _buildEmployeeListPanel(
    BuildContext context,
    List<EmployeeModel> employees,
    EmployeeModel? selected,
    bool isDark, {
    void Function(EmployeeModel)? onSelectMobile,
  }) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                context.t('nav.employees'),
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              IconButton(
                icon: const Icon(LucideIcons.plus, color: AppColors.primary),
                onPressed: () => _showAddEmployeeDialog(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: employees.isEmpty
                ? const Center(child: Text('No employees registered.'))
                : ListView.separated(
                    itemCount: employees.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final emp = employees[index];
                      final isSelected = selected?.id == emp.id;
                      return Card(
                        color: isSelected
                            ? AppColors.primary.withAlpha(20)
                            : (isDark ? AppColors.cardDark : AppColors.cardLight),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: isSelected
                                ? AppColors.primary
                                : (isDark ? AppColors.borderDark : AppColors.borderLight),
                          ),
                        ),
                        child: ListTile(
                          title: Text(emp.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('Salary: ${emp.monthlySalary.toStringAsFixed(2)} SAR'),
                          trailing: const Icon(LucideIcons.chevronRight, size: 16),
                          onTap: () {
                            if (onSelectMobile != null) {
                              onSelectMobile(emp);
                            } else {
                              context.read<EmployeeBloc>().add(LoadEmployeeLedger(emp.id));
                            }
                          },
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showAddEmployeeDialog(BuildContext context) {
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Add Employee'),
          content: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Full Name', style: TextStyle(fontWeight: FontWeight.w500)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _employeeNameController,
                  decoration: const InputDecoration(hintText: 'e.g. Faruk Ahmed'),
                  validator: (val) => (val == null || val.trim().isEmpty) ? 'Enter employee name' : null,
                ),
                const SizedBox(height: 16),
                const Text('Monthly Salary (SAR)', style: TextStyle(fontWeight: FontWeight.w500)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _salaryController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(hintText: 'e.g. 3500.00'),
                  validator: (val) => (val == null || double.tryParse(val) == null) ? 'Enter a valid monthly salary' : null,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (formKey.currentState!.validate()) {
                  final newEmp = EmployeeModel(
                    id: const Uuid().v4(),
                    name: _employeeNameController.text.trim(),
                    monthlySalary: double.parse(_salaryController.text),
                    createdAt: DateTime.now(),
                  );
                  context.read<EmployeeBloc>().add(AddEmployee(newEmp));
                  
                  _employeeNameController.clear();
                  _salaryController.clear();
                  Navigator.pop(context);
                }
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }
}

// Standalone Helper panels to avoid tight coupling inside private State classes
Widget buildEmployeeDetailPanel(
  BuildContext context,
  EmployeeModel employee,
  List<EmployeeEntryModel> ledger,
  EmployeeLoaded state,
  bool isDark,
) {
  return SingleChildScrollView(
    padding: const EdgeInsets.all(24.0),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  employee.name,
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Monthly salary: ${employee.monthlySalary} SAR',
                  style: const TextStyle(color: AppColors.mutedFgLight),
                ),
              ],
            ),
            ElevatedButton.icon(
              onPressed: () => showAddEntryDialog(context, employee.id),
              icon: const Icon(LucideIcons.plus, size: 16),
              label: const Text('Add Log Entry'),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: buildLedgerStatCard(
                'Wallet Balance (Advances)',
                state.currentWalletBalance,
                AppColors.primary,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: buildLedgerStatCard(
                'Salary Payouts Given',
                state.totalSalaryPaid,
                AppColors.primaryGlow,
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        const Text(
          'Ledger History Log',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        ledger.isEmpty
            ? const Padding(
                padding: EdgeInsets.symmetric(vertical: 32.0),
                child: Center(child: Text('No transaction logs recorded for this employee.')),
              )
            : ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: ledger.length,
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final log = ledger[index];
                  final isOut = log.entryType == 'give' || log.entryType == 'salary';
                  
                  Color typeColor = AppColors.primary;
                  if (log.entryType == 'salary') typeColor = AppColors.primaryGlow;
                  if (log.entryType == 'expense') typeColor = AppColors.warning;
                  if (log.entryType == 'receive') typeColor = Colors.purple;

                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(
                      backgroundColor: typeColor.withAlpha(20),
                      child: Icon(
                        isOut ? LucideIcons.arrowUpRight : LucideIcons.arrowDownLeft,
                        color: typeColor,
                        size: 18,
                      ),
                    ),
                    title: Text(
                      log.entryType.toUpperCase(),
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: typeColor),
                    ),
                    subtitle: Text(log.notes ?? 'No notes available'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '${isOut ? '+' : '-'}${log.amount.toStringAsFixed(2)} SAR',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isOut ? AppColors.destructive : AppColors.success,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              DateFormat('yyyy-MM-dd').format(log.txnDate),
                              style: const TextStyle(fontSize: 12, color: AppColors.mutedFgLight),
                            ),
                          ],
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.grey),
                          onPressed: () {
                            context.read<EmployeeBloc>().add(DeleteEmployeeEntry(log.id, employee.id));
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
      ],
    ),
  );
}

Widget buildLedgerStatCard(String label, double amount, Color color) {
  return Card(
    elevation: 0,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(16),
      side: const BorderSide(color: AppColors.borderLight),
    ),
    child: Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.mutedFgLight, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Text(
            '${amount.toStringAsFixed(2)} SAR',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color),
          ),
        ],
      ),
    ),
  );
}

void showAddEntryDialog(BuildContext context, String employeeId) {
  final formKey = GlobalKey<FormState>();
  final amountController = TextEditingController();
  final notesController = TextEditingController();
  String entryType = 'give';
  String kind = 'cash';

  showDialog(
    context: context,
    builder: (diagContext) {
      return AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Record Wallet Transaction'),
        content: Form(
          key: formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Transaction Category', style: TextStyle(fontWeight: FontWeight.w500)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: entryType,
                  items: const [
                    DropdownMenuItem(value: 'give', child: Text('Wallet Give (Advance)')),
                    DropdownMenuItem(value: 'receive', child: Text('Wallet Receive (Refund)')),
                    DropdownMenuItem(value: 'salary', child: Text('Salary Payout')),
                    DropdownMenuItem(value: 'expense', child: Text('Expense Claim')),
                  ],
                  onChanged: (val) => entryType = val!,
                ),
                const SizedBox(height: 16),
                const Text('Payment Channel', style: TextStyle(fontWeight: FontWeight.w500)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: kind,
                  items: const [
                    DropdownMenuItem(value: 'cash', child: Text('Physical Cash')),
                    DropdownMenuItem(value: 'bank', child: Text('Bank Wire Transfer')),
                  ],
                  onChanged: (val) => kind = val!,
                ),
                const SizedBox(height: 16),
                const Text('Amount (SAR)', style: TextStyle(fontWeight: FontWeight.w500)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: amountController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(hintText: '0.00 SAR'),
                  validator: (val) {
                    if (val == null || double.tryParse(val) == null || double.parse(val) <= 0) {
                      return 'Enter positive value';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                const Text('Notes', style: TextStyle(fontWeight: FontWeight.w500)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: notesController,
                  decoration: const InputDecoration(hintText: 'e.g. advance for medical reasons'),
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(diagContext),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                final newEntry = EmployeeEntryModel(
                  id: const Uuid().v4(),
                  employeeId: employeeId,
                  entryType: entryType,
                  amount: double.parse(amountController.text),
                  kind: kind,
                  notes: notesController.text.trim().isEmpty ? null : notesController.text,
                  txnDate: DateTime.now(),
                  createdAt: DateTime.now(),
                );
                context.read<EmployeeBloc>().add(AddEmployeeEntry(newEntry));
                Navigator.pop(diagContext);
              }
            },
            child: const Text('Record'),
          ),
        ],
      );
    },
  );
}

// Mobile Full Screen detail view support
class MobileEmployeeDetailView extends StatelessWidget {
  final EmployeeModel employee;

  const MobileEmployeeDetailView({super.key, required this.employee});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // Trigger loading detail logs
    context.read<EmployeeBloc>().add(LoadEmployeeLedger(employee.id));

    return Scaffold(
      appBar: AppBar(title: Text(employee.name)),
      body: BlocBuilder<EmployeeBloc, EmployeeState>(
        builder: (context, state) {
          if (state is EmployeeLoaded) {
            return buildEmployeeDetailPanel(
              context,
              employee,
              state.ledger,
              state,
              isDark,
            );
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }
}
