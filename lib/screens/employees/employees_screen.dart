import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'models/employee_view_model.dart';
import 'components/add_employee_bottom_sheet.dart';
import 'components/employee_wallet_view.dart';
import 'components/give_receive_money_dialog.dart';
import 'components/employee_detail_screen.dart';

class EmployeesScreen extends StatefulWidget {
  const EmployeesScreen({super.key});

  @override
  State<EmployeesScreen> createState() => _EmployeesScreenState();
}

class _EmployeesScreenState extends State<EmployeesScreen> {
  late List<EmployeeItem> _employees;
  late List<WalletTransactionItem> _walletTransactions;

  String _searchQuery = '';
  String? _selectedShopFilter; // null = 'All shops'
  EmployeeItem? _selectedEmployeeForDesktop;

  final TextEditingController _searchController = TextEditingController();

  static const Color _mintColor = Color(0xFF24B489);
  static const Color _roseColor = Color(0xFFEF4444);
  static const Color _greenColor = Color(0xFF10B981);
  static const Color _tealColor = Color(0xFF0D9488);
  static const Color _borderColor = Color(0xFFE2E8F0);
  static const Color _darkBorderColor = Color(0xFF334155);

  @override
  void initState() {
    super.initState();
    _employees = EmployeeDummyData.getInitialEmployees();
    _walletTransactions = EmployeeDummyData.getInitialWalletTransactions();
    if (_employees.isNotEmpty) {
      _selectedEmployeeForDesktop = _employees.first;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // --- Dynamic calculations ---
  double get _totalGiven =>
      _employees.fold(0.0, (sum, item) => sum + item.totalGiven);

  double get _totalReceived =>
      _employees.fold(0.0, (sum, item) => sum + item.totalReceived);

  double get _totalOutstanding => _totalGiven - _totalReceived;

  List<EmployeeItem> get _filteredEmployees {
    return _employees.where((emp) {
      final matchesShop = _selectedShopFilter == null ||
          _selectedShopFilter == 'All shops' ||
          emp.shopName == _selectedShopFilter;

      final q = _searchQuery.trim().toLowerCase();
      final matchesSearch = q.isEmpty ||
          emp.name.toLowerCase().contains(q) ||
          emp.mobile.contains(q) ||
          emp.iqama.contains(q);

      return matchesShop && matchesSearch;
    }).toList();
  }

  void _onAddEmployee() {
    AddEmployeeBottomSheet.show(
      context,
      onSave: (newEmp) {
        setState(() {
          _employees.insert(0, newEmp);
          _selectedEmployeeForDesktop = newEmp;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Employee "${newEmp.name}" added successfully'),
            backgroundColor: _mintColor,
            duration: const Duration(seconds: 2),
          ),
        );
      },
    );
  }

  void _onEditEmployee(EmployeeItem emp) {
    AddEmployeeBottomSheet.show(
      context,
      employeeToEdit: emp,
      onSave: (updatedEmp) {
        setState(() {
          final index = _employees.indexWhere((e) => e.id == emp.id);
          if (index != -1) {
            _employees[index] = updatedEmp;
          }
          if (_selectedEmployeeForDesktop?.id == emp.id) {
            _selectedEmployeeForDesktop = updatedEmp;
          }
        });
      },
    );
  }

  void _onDeleteEmployee(EmployeeItem emp) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Delete Employee'),
        content: Text('Are you sure you want to delete ${emp.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _employees.removeWhere((e) => e.id == emp.id);
                if (_selectedEmployeeForDesktop?.id == emp.id) {
                  _selectedEmployeeForDesktop =
                      _employees.isNotEmpty ? _employees.first : null;
                }
              });
              Navigator.pop(ctx);
            },
            style: ElevatedButton.styleFrom(backgroundColor: _roseColor),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _onGiveMoney(EmployeeItem emp) {
    GiveReceiveMoneyDialog.show(
      context,
      employee: emp,
      actionType: 'give',
      onConfirm: (type, amount, notes, mode, date) {
        setState(() {
          final idx = _employees.indexWhere((e) => e.id == emp.id);
          if (idx != -1) {
            _employees[idx] = emp.copyWith(
              totalGiven: emp.totalGiven + amount,
            );
            if (_selectedEmployeeForDesktop?.id == emp.id) {
              _selectedEmployeeForDesktop = _employees[idx];
            }
          }
          _walletTransactions.insert(
            0,
            WalletTransactionItem(
              id: 'wt_${DateTime.now().millisecondsSinceEpoch}',
              employeeId: emp.id,
              employeeName: emp.name,
              type: 'deposit',
              amount: amount,
              date: date,
              category: 'Cash Given',
              notes: notes,
              paymentMode: mode,
            ),
          );
        });
      },
    );
  }

  void _onReceiveMoney(EmployeeItem emp) {
    GiveReceiveMoneyDialog.show(
      context,
      employee: emp,
      actionType: 'receive',
      onConfirm: (type, amount, notes, mode, date) {
        setState(() {
          final idx = _employees.indexWhere((e) => e.id == emp.id);
          if (idx != -1) {
            _employees[idx] = emp.copyWith(
              totalReceived: emp.totalReceived + amount,
            );
            if (_selectedEmployeeForDesktop?.id == emp.id) {
              _selectedEmployeeForDesktop = _employees[idx];
            }
          }
          _walletTransactions.insert(
            0,
            WalletTransactionItem(
              id: 'wt_${DateTime.now().millisecondsSinceEpoch}',
              employeeId: emp.id,
              employeeName: emp.name,
              type: 'expense',
              amount: amount,
              date: date,
              category: 'Cash Received',
              notes: notes,
              paymentMode: mode,
            ),
          );
        });
      },
    );
  }

  void _openWalletView() {
    EmployeeWalletView.navigate(
      context,
      employees: _employees,
      initialTransactions: _walletTransactions,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xFF0F172A);
    final textSecondary =
        isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final fieldBorder = isDark ? _darkBorderColor : _borderColor;

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 950;

        return Scaffold(
          backgroundColor: bgColor,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 1100),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Top Header (Matching Image 1)
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            height: 46,
                            width: 46,
                            decoration: const BoxDecoration(
                              color: Color(0xFFD1FAE5),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              LucideIcons.users,
                              color: _mintColor,
                              size: 22,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Employees',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: textPrimary,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Track money given, received and live balances.',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),

                      // 2. Action Buttons Row (Employee Wallet | + Add Employee)
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: _openWalletView,
                              style: OutlinedButton.styleFrom(
                                backgroundColor: cardBg,
                                foregroundColor: textPrimary,
                                side: BorderSide(color: fieldBorder),
                                padding:
                                    const EdgeInsets.symmetric(vertical: 13),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(24),
                                ),
                                elevation: 0,
                              ),
                              child: Text(
                                'Employee Wallet',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: textPrimary,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: _onAddEmployee,
                              icon: const Icon(Icons.add,
                                  color: Colors.white, size: 18),
                              label: const Text(
                                'Add Employee',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _mintColor,
                                elevation: 0,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 13),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(24),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // 3. Stat Cards Row (3 Cards: TOTAL GIVEN, TOTAL RECEIVED, OUTSTANDING)
                      Row(
                        children: [
                          Expanded(
                            child: _buildSummaryCard(
                              title: 'TOTAL GIVEN',
                              value: _totalGiven.toStringAsFixed(2),
                              valueColor: _roseColor,
                              cardBg: cardBg,
                              borderColor: fieldBorder,
                              textSecondary: textSecondary,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: _buildSummaryCard(
                              title: 'TOTAL RECEIVED',
                              value: _totalReceived.toStringAsFixed(2),
                              valueColor: _greenColor,
                              cardBg: cardBg,
                              borderColor: fieldBorder,
                              textSecondary: textSecondary,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: _buildSummaryCard(
                              title: 'OUTSTANDING',
                              value: _totalOutstanding.toStringAsFixed(2),
                              valueColor: _tealColor,
                              cardBg: cardBg,
                              borderColor: fieldBorder,
                              textSecondary: textSecondary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),

                      // 4. Search Bar (Matching Image 1)
                      TextField(
                        controller: _searchController,
                        onChanged: (val) => setState(() => _searchQuery = val),
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: InputDecoration(
                          hintText: 'Search by name, mobile, iqama...',
                          hintStyle: TextStyle(
                              fontSize: 13, color: textSecondary),
                          prefixIcon: Icon(Icons.search,
                              size: 20, color: textSecondary),
                          suffixIcon: _searchQuery.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear, size: 16),
                                  onPressed: () {
                                    _searchController.clear();
                                    setState(() => _searchQuery = '');
                                  },
                                )
                              : null,
                          filled: true,
                          fillColor: cardBg,
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide(color: fieldBorder),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide(color: fieldBorder),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(
                                color: _mintColor, width: 1.5),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // 5. Shop Filter Dropdown (Matching Image 1)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: fieldBorder),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _selectedShopFilter,
                            isExpanded: true,
                            hint: Text(
                              'All shops',
                              style: TextStyle(
                                  fontSize: 14, color: textPrimary),
                            ),
                            icon: Icon(Icons.keyboard_arrow_down,
                                color: textSecondary),
                            dropdownColor: cardBg,
                            items: [
                              DropdownMenuItem<String>(
                                value: null,
                                child: Text('All shops',
                                    style: TextStyle(
                                        fontSize: 14, color: textPrimary)),
                              ),
                              ...EmployeeDummyData.shops
                                  .map((s) => DropdownMenuItem<String>(
                                        value: s,
                                        child: Text(s,
                                            style: TextStyle(
                                                fontSize: 14,
                                                color: textPrimary)),
                                      )),
                            ],
                            onChanged: (val) {
                              setState(() => _selectedShopFilter = val);
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // 6. Employees Listing or Empty State
                      if (_filteredEmployees.isEmpty)
                        _buildEmptyState(cardBg, fieldBorder, textSecondary)
                      else
                        _buildEmployeesList(
                            _filteredEmployees, cardBg, fieldBorder, textPrimary, textSecondary, isDesktop),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  // --- Summary Card Widget ---
  Widget _buildSummaryCard({
    required String title,
    required String value,
    required Color valueColor,
    required Color cardBg,
    required Color borderColor,
    required Color textSecondary,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: textSecondary,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                'SAR ',
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  color: textSecondary,
                ),
              ),
              Expanded(
                child: Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: valueColor,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- Empty State (Matching Image 1) ---
  Widget _buildEmptyState(
      Color cardBg, Color borderColor, Color textSecondary) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(
              LucideIcons.users,
              size: 38,
              color: Color(0xFF94A3B8),
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'No employees yet',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Add an employee to start tracking money given and\nreceived.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              color: textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: _onAddEmployee,
            icon: const Icon(Icons.add, color: Colors.white, size: 16),
            label: const Text(
              'Add Employee',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: _mintColor,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- Employees List ---
  Widget _buildEmployeesList(
    List<EmployeeItem> list,
    Color cardBg,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
    bool isDesktop,
  ) {
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: list.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (ctx, idx) {
        final emp = list[idx];
        return InkWell(
          onTap: () {
            EmployeeDetailScreen.navigate(
              context,
              employee: emp,
              walletTransactions: _walletTransactions,
              onUpdateEmployee: (updated) {
                setState(() {
                  final i = _employees.indexWhere((e) => e.id == updated.id);
                  if (i != -1) _employees[i] = updated;
                });
              },
              onDeleteEmployee: () {
                setState(() {
                  _employees.removeWhere((e) => e.id == emp.id);
                });
              },
              onAddWalletTransaction: (newTxn) {
                setState(() {
                  _walletTransactions.insert(0, newTxn);
                });
              },
            );
          },
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
              // Row 1: Avatar, Name, Shop & More Options
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: _mintColor.withValues(alpha: 0.15),
                    child: Text(
                      emp.name.isNotEmpty ? emp.name[0].toUpperCase() : 'E',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: _mintColor,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          emp.name,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: textPrimary,
                          ),
                        ),
                        if (emp.shopName != null && emp.shopName!.isNotEmpty) ...[
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Icon(LucideIcons.store, size: 12, color: textSecondary),
                              const SizedBox(width: 4),
                              Text(
                                emp.shopName!,
                                style: TextStyle(fontSize: 12, color: textSecondary),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                  PopupMenuButton<String>(
                    icon: Icon(Icons.more_vert, size: 20, color: textSecondary),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16)),
                    onSelected: (val) {
                      if (val == 'edit') _onEditEmployee(emp);
                      if (val == 'delete') _onDeleteEmployee(emp);
                    },
                    itemBuilder: (ctx) => [
                      const PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(Icons.edit, size: 16),
                            SizedBox(width: 8),
                            Text('Edit'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete, size: 16, color: _roseColor),
                            SizedBox(width: 8),
                            Text('Delete', style: TextStyle(color: _roseColor)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Row 2: Mobile & Iqama Info
              Row(
                children: [
                  if (emp.mobile.isNotEmpty) ...[
                    Icon(LucideIcons.phone, size: 13, color: textSecondary),
                    const SizedBox(width: 4),
                    Text(
                      emp.mobile,
                      style: TextStyle(fontSize: 12, color: textSecondary),
                    ),
                    const SizedBox(width: 14),
                  ],
                  if (emp.iqama.isNotEmpty) ...[
                    Icon(LucideIcons.creditCard, size: 13, color: textSecondary),
                    const SizedBox(width: 4),
                    Text(
                      'Iqama: ${emp.iqama}',
                      style: TextStyle(fontSize: 12, color: textSecondary),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 14),
              const Divider(height: 1),
              const SizedBox(height: 12),

              // Row 3: Financial mini stats
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildEmployeeMiniStat(
                    'GIVEN',
                    'SAR ${emp.totalGiven.toStringAsFixed(2)}',
                    _roseColor,
                    textSecondary,
                  ),
                  _buildEmployeeMiniStat(
                    'RECEIVED',
                    'SAR ${emp.totalReceived.toStringAsFixed(2)}',
                    _greenColor,
                    textSecondary,
                  ),
                  _buildEmployeeMiniStat(
                    'BALANCE',
                    'SAR ${emp.outstanding.toStringAsFixed(2)}',
                    _tealColor,
                    textSecondary,
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Row 4: Action buttons (+ Give Money | + Receive Money)
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _onGiveMoney(emp),
                      icon: const Icon(Icons.arrow_upward_rounded,
                          size: 15, color: _roseColor),
                      label: const Text(
                        'Give Money',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: _roseColor),
                      ),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(
                            color: _roseColor.withValues(alpha: 0.5)),
                        padding: const EdgeInsets.symmetric(vertical: 9),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _onReceiveMoney(emp),
                      icon: const Icon(Icons.arrow_downward_rounded,
                          size: 15, color: _mintColor),
                      label: const Text(
                        'Receive Money',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: _mintColor),
                      ),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(
                            color: _mintColor.withValues(alpha: 0.5)),
                        padding: const EdgeInsets.symmetric(vertical: 9),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    },
    );
  }

  Widget _buildEmployeeMiniStat(
      String label, String value, Color color, Color textSecondary) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: textSecondary,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
}
