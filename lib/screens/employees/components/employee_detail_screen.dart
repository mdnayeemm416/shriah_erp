import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import 'package:intl/intl.dart';
import '../models/employee_view_model.dart';
import 'add_employee_bottom_sheet.dart';
import 'give_receive_money_dialog.dart';
import 'new_wallet_entry_bottom_sheet.dart';

class EmployeeDetailScreen extends StatefulWidget {
  final EmployeeItem employee;
  final List<WalletTransactionItem> walletTransactions;
  final Function(EmployeeItem) onUpdateEmployee;
  final VoidCallback onDeleteEmployee;
  final Function(WalletTransactionItem) onAddWalletTransaction;

  const EmployeeDetailScreen({
    super.key,
    required this.employee,
    required this.walletTransactions,
    required this.onUpdateEmployee,
    required this.onDeleteEmployee,
    required this.onAddWalletTransaction,
  });

  static void navigate(
    BuildContext context, {
    required EmployeeItem employee,
    required List<WalletTransactionItem> walletTransactions,
    required Function(EmployeeItem) onUpdateEmployee,
    required VoidCallback onDeleteEmployee,
    required Function(WalletTransactionItem) onAddWalletTransaction,
  }) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (ctx) => EmployeeDetailScreen(
          employee: employee,
          walletTransactions: walletTransactions,
          onUpdateEmployee: onUpdateEmployee,
          onDeleteEmployee: onDeleteEmployee,
          onAddWalletTransaction: onAddWalletTransaction,
        ),
      ),
    );
  }

  @override
  State<EmployeeDetailScreen> createState() => _EmployeeDetailScreenState();
}

class _EmployeeDetailScreenState extends State<EmployeeDetailScreen> {
  late EmployeeItem _currentEmployee;
  late List<WalletTransactionItem> _employeeWalletTransactions;

  static const Color _mintColor = Color(0xFF24B489);
  static const Color _roseColor = Color(0xFFEF4444);
  static const Color _greenColor = Color(0xFF10B981);
  static const Color _tealColor = Color(0xFF0D9488);
  static const Color _borderColor = Color(0xFFE2E8F0);
  static const Color _darkBorderColor = Color(0xFF334155);

  @override
  void initState() {
    super.initState();
    _currentEmployee = widget.employee;
    _employeeWalletTransactions = widget.walletTransactions
        .where((t) => t.employeeId == widget.employee.id)
        .toList();
  }

  double get _empDeposit {
    return _employeeWalletTransactions
        .where((t) => t.type == 'deposit')
        .fold(0.0, (sum, item) => sum + item.amount);
  }

  double get _empExpense {
    return _employeeWalletTransactions
        .where((t) => t.type == 'expense')
        .fold(0.0, (sum, item) => sum + item.amount);
  }

  double get _empWalletBalance => _empDeposit - _empExpense;

  void _shareHistory() {
    final buffer = StringBuffer();
    buffer.writeln('📋 *Employee Statement: ${_currentEmployee.name}*');
    buffer.writeln('🏢 Shop/Branch: ${_currentEmployee.shopName ?? 'Main'}');
    buffer.writeln('📱 Mobile: ${_currentEmployee.mobile}');
    buffer.writeln('💳 Current Balance: SAR ${_currentEmployee.outstanding.toStringAsFixed(2)}');
    buffer.writeln('🔴 Total Given: SAR ${_currentEmployee.totalGiven.toStringAsFixed(2)}');
    buffer.writeln('🟢 Total Received: SAR ${_currentEmployee.totalReceived.toStringAsFixed(2)}');
    buffer.writeln('');
    buffer.writeln('👛 *Wallet Summary*');
    buffer.writeln('• Deposit: SAR ${_empDeposit.toStringAsFixed(2)}');
    buffer.writeln('• Expense: SAR ${_empExpense.toStringAsFixed(2)}');
    buffer.writeln('• Net Balance: SAR ${_empWalletBalance.toStringAsFixed(2)}');

    if (_employeeWalletTransactions.isNotEmpty) {
      buffer.writeln('\n--- Recent Wallet Entries ---');
      for (final t in _employeeWalletTransactions.take(5)) {
        final sign = t.type == 'deposit' ? '+' : '-';
        buffer.writeln('• $sign SAR ${t.amount.toStringAsFixed(2)} (${t.category}) - ${DateFormat('dd MMM').format(t.date)}');
      }
    }

    Share.share(buffer.toString(), subject: 'Employee Statement - ${_currentEmployee.name}');
  }

  void _editEmployee() {
    AddEmployeeBottomSheet.show(
      context,
      employeeToEdit: _currentEmployee,
      onSave: (updated) {
        setState(() {
          _currentEmployee = updated;
        });
        widget.onUpdateEmployee(updated);
      },
    );
  }

  void _deleteEmployee() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Delete Employee'),
        content: Text('Are you sure you want to delete ${_currentEmployee.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              widget.onDeleteEmployee();
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: _roseColor),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _giveMoney() {
    GiveReceiveMoneyDialog.show(
      context,
      employee: _currentEmployee,
      actionType: 'give',
      onConfirm: (type, amount, notes, mode, date) {
        setState(() {
          _currentEmployee = _currentEmployee.copyWith(
            totalGiven: _currentEmployee.totalGiven + amount,
          );
        });
        widget.onUpdateEmployee(_currentEmployee);

        final newTxn = WalletTransactionItem(
          id: 'wt_${DateTime.now().millisecondsSinceEpoch}',
          employeeId: _currentEmployee.id,
          employeeName: _currentEmployee.name,
          type: 'deposit',
          amount: amount,
          date: date,
          category: 'Cash Given',
          notes: notes,
          paymentMode: mode,
        );

        setState(() {
          _employeeWalletTransactions.insert(0, newTxn);
        });
        widget.onAddWalletTransaction(newTxn);
      },
    );
  }

  void _receiveMoney() {
    GiveReceiveMoneyDialog.show(
      context,
      employee: _currentEmployee,
      actionType: 'receive',
      onConfirm: (type, amount, notes, mode, date) {
        setState(() {
          _currentEmployee = _currentEmployee.copyWith(
            totalReceived: _currentEmployee.totalReceived + amount,
          );
        });
        widget.onUpdateEmployee(_currentEmployee);

        final newTxn = WalletTransactionItem(
          id: 'wt_${DateTime.now().millisecondsSinceEpoch}',
          employeeId: _currentEmployee.id,
          employeeName: _currentEmployee.name,
          type: 'expense',
          amount: amount,
          date: date,
          category: 'Cash Received',
          notes: notes,
          paymentMode: mode,
        );

        setState(() {
          _employeeWalletTransactions.insert(0, newTxn);
        });
        widget.onAddWalletTransaction(newTxn);
      },
    );
  }

  void _addWalletEntry(String type) {
    NewWalletEntryBottomSheet.show(
      context,
      employee: _currentEmployee,
      initialType: type,
      onSave: (newTxn) {
        setState(() {
          _employeeWalletTransactions.insert(0, newTxn);
        });
        widget.onAddWalletTransaction(newTxn);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xFF0F172A);
    final textSecondary = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? _darkBorderColor : _borderColor;

    final outstanding = _currentEmployee.outstanding;
    final isSettled = outstanding == 0;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leadingWidth: 140,
        leading: TextButton.icon(
          onPressed: () => Navigator.of(context).pop(),
          icon: Icon(Icons.arrow_back, size: 16, color: textPrimary),
          label: Text(
            'All employees',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: textPrimary,
            ),
          ),
        ),
        actions: [
          // Share History Pill Button (Matching Image 1)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: OutlinedButton.icon(
              onPressed: _shareHistory,
              icon: const Icon(LucideIcons.messageSquare, size: 14, color: _tealColor),
              label: const Text(
                'Share History',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: _tealColor),
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF99F6E4)),
                backgroundColor: const Color(0xFFF0FDFA),
                padding: const EdgeInsets.symmetric(horizontal: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Edit Button
          TextButton.icon(
            onPressed: _editEmployee,
            icon: Icon(LucideIcons.edit2, size: 14, color: textPrimary),
            label: Text(
              'Edit',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
            ),
          ),
          const SizedBox(width: 4),

          // Delete Button
          IconButton(
            onPressed: _deleteEmployee,
            icon: const Icon(LucideIcons.trash2, size: 18, color: _roseColor),
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Employee Header Card (Matching Image 1)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: const Color(0xFFCCFBF1), width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF14B8A6).withValues(alpha: 0.05),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Avatar + Name + Shop
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: _mintColor,
                        child: Text(
                          _currentEmployee.name.isNotEmpty
                              ? _currentEmployee.name[0].toUpperCase()
                              : 'T',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _currentEmployee.name,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: textPrimary,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Row(
                              children: [
                                Icon(LucideIcons.store, size: 13, color: textSecondary),
                                const SizedBox(width: 4),
                                Text(
                                  _currentEmployee.shopName ?? 'Branch',
                                  style: TextStyle(fontSize: 12, color: textSecondary),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Current Balance Label
                  Text(
                    'CURRENT BALANCE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: textSecondary,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // SAR Big Amount
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        'SAR ',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: textSecondary,
                        ),
                      ),
                      Text(
                        outstanding.abs().toStringAsFixed(0),
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: textPrimary,
                          letterSpacing: -1,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),

                  // Settlement Status
                  Text(
                    isSettled
                        ? 'FULLY SETTLED'
                        : (outstanding > 0 ? 'PAYMENT OUTSTANDING' : 'ADVANCE RECEIVED'),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isSettled ? _tealColor : (outstanding > 0 ? _roseColor : _greenColor),
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Two Sub-cards: TOTAL GIVEN & TOTAL RECEIVED
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: borderColor),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'TOTAL GIVEN',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: textSecondary,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Text('SAR ', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: textSecondary)),
                                  Text(
                                    _currentEmployee.totalGiven.toStringAsFixed(2),
                                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: _roseColor),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: borderColor),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'TOTAL RECEIVED',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: textSecondary,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Text('SAR ', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: textSecondary)),
                                  Text(
                                    _currentEmployee.totalReceived.toStringAsFixed(2),
                                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: _greenColor),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 2. Primary Action Buttons Row (↑ Money Given | ↓ Money Received)
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: _giveMoney,
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFFFECDD3), width: 1.5),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.arrow_upward_rounded, size: 18, color: _roseColor),
                          SizedBox(width: 8),
                          Text(
                            'Money Given',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: _roseColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: InkWell(
                    onTap: _receiveMoney,
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFFA7F3D0), width: 1.5),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.arrow_downward_rounded, size: 18, color: _mintColor),
                          SizedBox(width: 8),
                          Text(
                            'Money Received',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: _mintColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // 3. Embedded Employee Wallet Section Card (Matching Image 1)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: const Color(0xFFCCFBF1), width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Wallet Header & Action Buttons
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Employee Wallet',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: textPrimary,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Tracking only — does not affect company accounting.',
                              style: TextStyle(
                                fontSize: 11,
                                color: textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      // + Expense Pill Button
                      OutlinedButton.icon(
                        onPressed: () => _addWalletEntry('expense'),
                        icon: const Icon(Icons.add, size: 14, color: Color(0xFF334155)),
                        label: const Text(
                          'Expense',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: borderColor),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                      ),
                      const SizedBox(width: 6),
                      // + Deposit Pill Button
                      OutlinedButton.icon(
                        onPressed: () => _addWalletEntry('deposit'),
                        icon: const Icon(Icons.add, size: 14, color: Color(0xFF334155)),
                        label: const Text(
                          'Deposit',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: borderColor),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // 3 Wallet Metric Cards
                  Row(
                    children: [
                      Expanded(
                        child: _buildWalletMiniCard('BALANCE', _empWalletBalance.toStringAsFixed(2), _tealColor, isDark, borderColor, textSecondary),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildWalletMiniCard('DEPOSIT', _empDeposit.toStringAsFixed(2), _mintColor, isDark, borderColor, textSecondary),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildWalletMiniCard('EXPENSE', _empExpense.toStringAsFixed(2), _roseColor, isDark, borderColor, textSecondary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Transactions list or "No wallet entries yet."
                  if (_employeeWalletTransactions.isEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 24),
                      child: Center(
                        child: Text(
                          'No wallet entries yet.',
                          style: TextStyle(
                            fontSize: 13,
                            color: textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    )
                  else
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _employeeWalletTransactions.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (ctx, idx) {
                        final t = _employeeWalletTransactions[idx];
                        final isDep = t.type == 'deposit';
                        final amtColor = isDep ? _mintColor : _roseColor;

                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: borderColor),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                isDep ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                                size: 16,
                                color: amtColor,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      t.category,
                                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: textPrimary),
                                    ),
                                    if (t.notes.isNotEmpty)
                                      Text(
                                        t.notes,
                                        style: TextStyle(fontSize: 11, color: textSecondary),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                  ],
                                ),
                              ),
                              Text(
                                '${isDep ? '+' : '-'} SAR ${t.amount.toStringAsFixed(2)}',
                                style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: amtColor),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                ],
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildWalletMiniCard(String label, String value, Color valueColor, bool isDark, Color borderColor, Color textSecondary) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.bold,
              color: textSecondary,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Text('SAR ', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: textSecondary)),
              Expanded(
                child: Text(
                  value,
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: valueColor),
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
}
