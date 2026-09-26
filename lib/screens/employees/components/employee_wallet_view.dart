import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import 'package:printing/printing.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import '../models/employee_view_model.dart';

class EmployeeWalletView extends StatefulWidget {
  final List<EmployeeItem> employees;
  final List<WalletTransactionItem> initialTransactions;

  const EmployeeWalletView({
    super.key,
    required this.employees,
    required this.initialTransactions,
  });

  static void navigate(BuildContext context, {
    required List<EmployeeItem> employees,
    required List<WalletTransactionItem> initialTransactions,
  }) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (ctx) => EmployeeWalletView(
          employees: employees,
          initialTransactions: initialTransactions,
        ),
      ),
    );
  }

  @override
  State<EmployeeWalletView> createState() => _EmployeeWalletViewState();
}

class _EmployeeWalletViewState extends State<EmployeeWalletView> {
  late List<WalletTransactionItem> _transactions;
  String _selectedPeriod = 'This Month';
  DateTime? _customStart;
  DateTime? _customEnd;

  String? _filterEmployeeId;
  String? _filterType; // null = all, 'deposit', 'expense'

  static const Color _mintColor = Color(0xFF24B489);
  static const Color _roseColor = Color(0xFFEF4444);
  static const Color _tealColor = Color(0xFF0D9488);

  @override
  void initState() {
    super.initState();
    _transactions = List.from(widget.initialTransactions);
  }

  List<WalletTransactionItem> get _filteredTransactions {
    final now = DateTime.now();
    return _transactions.where((t) {
      // Period filter
      bool matchPeriod = true;
      if (_selectedPeriod == 'Today') {
        matchPeriod = t.date.year == now.year && t.date.month == now.month && t.date.day == now.day;
      } else if (_selectedPeriod == 'Yesterday') {
        final yesterday = now.subtract(const Duration(days: 1));
        matchPeriod = t.date.year == yesterday.year &&
            t.date.month == yesterday.month &&
            t.date.day == yesterday.day;
      } else if (_selectedPeriod == 'This Week') {
        final weekAgo = now.subtract(const Duration(days: 7));
        matchPeriod = t.date.isAfter(weekAgo);
      } else if (_selectedPeriod == 'This Month') {
        matchPeriod = t.date.year == now.year && t.date.month == now.month;
      } else if (_selectedPeriod == 'Custom' && _customStart != null && _customEnd != null) {
        matchPeriod = t.date.isAfter(_customStart!.subtract(const Duration(days: 1))) &&
            t.date.isBefore(_customEnd!.add(const Duration(days: 1)));
      }

      // Employee filter
      final matchEmp = _filterEmployeeId == null || t.employeeId == _filterEmployeeId;

      // Type filter
      final matchType = _filterType == null || t.type == _filterType;

      return matchPeriod && matchEmp && matchType;
    }).toList();
  }

  double get _totalDeposit {
    return _filteredTransactions
        .where((t) => t.type == 'deposit')
        .fold(0.0, (sum, item) => sum + item.amount);
  }

  double get _totalExpense {
    return _filteredTransactions
        .where((t) => t.type == 'expense')
        .fold(0.0, (sum, item) => sum + item.amount);
  }

  double get _walletBalance {
    return _totalDeposit - _totalExpense;
  }

  // --- Actions ---

  void _showFiltersBottomSheet() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xFF0F172A);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    String? tempEmpId = _filterEmployeeId;
    String? tempType = _filterType;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) {
          return Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Filter Transactions',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 20),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Filter by Type
                Text('Transaction Type', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildFilterChip('All Types', tempType == null, () {
                      setSheetState(() => tempType = null);
                    }, isDark),
                    const SizedBox(width: 8),
                    _buildFilterChip('Deposits', tempType == 'deposit', () {
                      setSheetState(() => tempType = 'deposit');
                    }, isDark),
                    const SizedBox(width: 8),
                    _buildFilterChip('Expenses', tempType == 'expense', () {
                      setSheetState(() => tempType = 'expense');
                    }, isDark),
                  ],
                ),
                const SizedBox(height: 18),

                // Filter by Employee
                if (widget.employees.isNotEmpty) ...[
                  Text('Employee', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String?>(
                    initialValue: tempEmpId,
                    dropdownColor: cardBg,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
                    ),
                    items: [
                      const DropdownMenuItem(value: null, child: Text('All Employees')),
                      ...widget.employees.map((e) => DropdownMenuItem(value: e.id, child: Text(e.name))),
                    ],
                    onChanged: (val) => setSheetState(() => tempEmpId = val),
                  ),
                  const SizedBox(height: 24),
                ],

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          setState(() {
                            _filterEmployeeId = null;
                            _filterType = null;
                          });
                          Navigator.pop(ctx);
                        },
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Reset Filters'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _filterEmployeeId = tempEmpId;
                            _filterType = tempType;
                          });
                          Navigator.pop(ctx);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _mintColor,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Apply Filters'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected, VoidCallback onTap, bool isDark) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? _mintColor : (isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9)),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? _mintColor : Colors.transparent),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF475569)),
          ),
        ),
      ),
    );
  }

  Future<void> _exportPdf() async {
    final pdf = pw.Document();
    final transactions = _filteredTransactions;
    final totalDep = _totalDeposit;
    final totalExp = _totalExpense;
    final bal = _walletBalance;

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context ctx) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // Header
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('ShRiAh Group ERP', style: pw.TextStyle(fontSize: 20, fontWeight: pw.FontWeight.bold)),
                      pw.Text('Employee Wallet Statement', style: const pw.TextStyle(fontSize: 14, color: PdfColors.grey700)),
                    ],
                  ),
                  pw.Text(DateFormat('dd MMM yyyy, hh:mm a').format(DateTime.now()), style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey600)),
                ],
              ),
              pw.Divider(thickness: 1, height: 24),

              // Summary Box
              pw.Container(
                padding: const pw.EdgeInsets.all(12),
                decoration: pw.BoxDecoration(
                  color: PdfColors.grey100,
                  borderRadius: pw.BorderRadius.circular(8),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceAround,
                  children: [
                    pw.Column(children: [
                      pw.Text('TOTAL DEPOSIT', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColors.grey700)),
                      pw.SizedBox(height: 4),
                      pw.Text('SAR ${totalDep.toStringAsFixed(2)}', style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.bold, color: PdfColors.green700)),
                    ]),
                    pw.Column(children: [
                      pw.Text('TOTAL EXPENSE', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColors.grey700)),
                      pw.SizedBox(height: 4),
                      pw.Text('SAR ${totalExp.toStringAsFixed(2)}', style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.bold, color: PdfColors.red700)),
                    ]),
                    pw.Column(children: [
                      pw.Text('NET BALANCE', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColors.grey700)),
                      pw.SizedBox(height: 4),
                      pw.Text('SAR ${bal.toStringAsFixed(2)}', style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.bold, color: PdfColors.teal700)),
                    ]),
                  ],
                ),
              ),
              pw.SizedBox(height: 20),

              // Table
              pw.Text('Transactions (${transactions.length})', style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 8),
              pw.TableHelper.fromTextArray(
                border: pw.TableBorder.all(color: PdfColors.grey300),
                headerDecoration: const pw.BoxDecoration(color: PdfColors.grey200),
                headerHeight: 25,
                cellHeight: 28,
                headers: ['Date', 'Employee', 'Type', 'Category / Notes', 'Mode', 'Amount (SAR)'],
                data: transactions.map((t) => [
                  DateFormat('yyyy-MM-dd').format(t.date),
                  t.employeeName,
                  t.type.toUpperCase(),
                  t.notes.isNotEmpty ? '${t.category} - ${t.notes}' : t.category,
                  t.paymentMode,
                  (t.type == 'deposit' ? '+' : '-') + t.amount.toStringAsFixed(2),
                ]).toList(),
              ),
            ],
          );
        },
      ),
    );

    await Printing.sharePdf(bytes: await pdf.save(), filename: 'employee_wallet_statement.pdf');
  }

  Future<void> _printReport() async {
    final pdf = pw.Document();
    final transactions = _filteredTransactions;
    final totalDep = _totalDeposit;
    final totalExp = _totalExpense;
    final bal = _walletBalance;

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context ctx) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('ShRiAh Group ERP - Employee Wallet', style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
                  pw.Text(DateFormat('yyyy-MM-dd').format(DateTime.now())),
                ],
              ),
              pw.Divider(height: 20),
              pw.Text('Summary: Deposit = SAR ${totalDep.toStringAsFixed(2)} | Expense = SAR ${totalExp.toStringAsFixed(2)} | Balance = SAR ${bal.toStringAsFixed(2)}'),
              pw.SizedBox(height: 12),
              pw.TableHelper.fromTextArray(
                headers: ['Date', 'Employee', 'Type', 'Category', 'Amount'],
                data: transactions.map((t) => [
                  DateFormat('yyyy-MM-dd').format(t.date),
                  t.employeeName,
                  t.type.toUpperCase(),
                  t.category,
                  'SAR ${t.amount.toStringAsFixed(2)}',
                ]).toList(),
              ),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(onLayout: (format) async => pdf.save());
  }

  void _exportExcel() {
    final buffer = StringBuffer();
    buffer.writeln('Date,Employee,Type,Category,Notes,Payment Mode,Amount (SAR)');
    for (final t in _filteredTransactions) {
      buffer.writeln(
        '"${DateFormat('yyyy-MM-dd HH:mm').format(t.date)}","${t.employeeName}","${t.type}","${t.category}","${t.notes}","${t.paymentMode}","${t.amount.toStringAsFixed(2)}"',
      );
    }
    Share.share(buffer.toString(), subject: 'Employee Wallet Export (CSV)');
  }

  void _shareReport() {
    final buffer = StringBuffer();
    buffer.writeln('📊 *ShRiAh ERP - Employee Wallet Summary*');
    buffer.writeln('📅 Period: $_selectedPeriod');
    buffer.writeln('💰 Total Deposit: SAR ${_totalDeposit.toStringAsFixed(2)}');
    buffer.writeln('💸 Total Expense: SAR ${_totalExpense.toStringAsFixed(2)}');
    buffer.writeln('💵 Net Balance: SAR ${_walletBalance.toStringAsFixed(2)}');
    buffer.writeln('📝 Total Records: ${_filteredTransactions.length}');
    buffer.writeln('');
    buffer.writeln('--- Recent Entries ---');
    for (final t in _filteredTransactions.take(5)) {
      final sign = t.type == 'deposit' ? '+' : '-';
      buffer.writeln('• ${t.employeeName}: $sign SAR ${t.amount.toStringAsFixed(2)} (${t.category})');
    }
    Share.share(buffer.toString());
  }

  void _showAddTransactionDialog({String defaultType = 'deposit'}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final amountCtrl = TextEditingController();
    final notesCtrl = TextEditingController();
    final categoryCtrl = TextEditingController(text: defaultType == 'deposit' ? 'Cash Advance' : 'Expense');
    String type = defaultType;
    String paymentMode = 'Cash';
    String? selectedEmpId = widget.employees.isNotEmpty ? widget.employees.first.id : null;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          final isDep = type == 'deposit';
          final activeColor = isDep ? _mintColor : _roseColor;

          return Dialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(22),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        isDep ? 'Add Wallet Deposit' : 'Add Wallet Expense',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, size: 20),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Type Switcher
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () => setDialogState(() {
                            type = 'deposit';
                            categoryCtrl.text = 'Cash Advance';
                          }),
                          borderRadius: BorderRadius.circular(10),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: isDep ? _mintColor : Colors.transparent,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: _mintColor),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'Deposit',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isDep ? Colors.white : _mintColor,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: InkWell(
                          onTap: () => setDialogState(() {
                            type = 'expense';
                            categoryCtrl.text = 'General Expense';
                          }),
                          borderRadius: BorderRadius.circular(10),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: !isDep ? _roseColor : Colors.transparent,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: _roseColor),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'Expense',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: !isDep ? Colors.white : _roseColor,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Employee selector
                  if (widget.employees.isNotEmpty) ...[
                    const Text('Employee', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    DropdownButtonFormField<String>(
                      initialValue: selectedEmpId,
                      isExpanded: true,
                      dropdownColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      items: widget.employees.map((e) => DropdownMenuItem(
                        value: e.id,
                        child: Text(e.name, style: const TextStyle(fontSize: 13)),
                      )).toList(),
                      onChanged: (val) => setDialogState(() => selectedEmpId = val),
                    ),
                    const SizedBox(height: 12),
                  ],

                  // Amount
                  const Text('Amount (SAR) *', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  TextField(
                    controller: amountCtrl,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    decoration: InputDecoration(
                      hintText: '0.00',
                      prefixText: 'SAR ',
                      filled: true,
                      fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: activeColor, width: 1.5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Notes
                  const Text('Notes', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  TextField(
                    controller: notesCtrl,
                    decoration: InputDecoration(
                      hintText: 'e.g. Fuel receipt, food allowance',
                      hintStyle: const TextStyle(fontSize: 12),
                      filled: true,
                      fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Submit
                  SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: ElevatedButton(
                      onPressed: () {
                        final amt = double.tryParse(amountCtrl.text.trim()) ?? 0.0;
                        if (amt <= 0) return;

                        final empName = widget.employees
                            .firstWhere((e) => e.id == selectedEmpId,
                                orElse: () => EmployeeItem(
                                      id: '',
                                      name: 'General',
                                      mobile: '',
                                      iqama: '',
                                      monthlySalary: 0,
                                      createdAt: DateTime.now(),
                                    ))
                            .name;

                        setState(() {
                          _transactions.insert(
                            0,
                            WalletTransactionItem(
                              id: 'wt_${DateTime.now().millisecondsSinceEpoch}',
                              employeeId: selectedEmpId ?? '',
                              employeeName: empName,
                              type: type,
                              amount: amt,
                              date: DateTime.now(),
                              category: categoryCtrl.text.trim(),
                              notes: notesCtrl.text.trim(),
                              paymentMode: paymentMode,
                            ),
                          );
                        });
                        Navigator.pop(ctx);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: activeColor,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(isDep ? 'Save Deposit' : 'Save Expense'),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Future<void> _pickCustomDateRange() async {
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      initialDateRange: _customStart != null && _customEnd != null
          ? DateTimeRange(start: _customStart!, end: _customEnd!)
          : DateTimeRange(start: DateTime.now().subtract(const Duration(days: 7)), end: DateTime.now()),
    );
    if (picked != null) {
      setState(() {
        _selectedPeriod = 'Custom';
        _customStart = picked.start;
        _customEnd = picked.end;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xFF0F172A);
    final textSecondary = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    final filtered = _filteredTransactions;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: textPrimary),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const SizedBox.shrink(),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Row
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
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: textPrimary,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Tracking only — never affects company accounting.',
                        style: TextStyle(
                          fontSize: 12,
                          color: textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                // Balance & Menu
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'BALANCE',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: textSecondary,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Text(
                          'SAR ',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: textSecondary,
                          ),
                        ),
                        Text(
                          _walletBalance.toStringAsFixed(2),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: _tealColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(width: 8),

                // PopupMenu matching the requested design
                PopupMenuButton<String>(
                  icon: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: cardBg,
                      border: Border.all(color: borderColor),
                    ),
                    child: Icon(Icons.more_vert, size: 18, color: textPrimary),
                  ),
                  color: cardBg,
                  elevation: 8,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  onSelected: (val) {
                    if (val == 'filters') _showFiltersBottomSheet();
                    if (val == 'export_pdf') _exportPdf();
                    if (val == 'export_excel') _exportExcel();
                    if (val == 'share_report') _shareReport();
                    if (val == 'print') _printReport();
                  },
                  itemBuilder: (ctx) => [
                    const PopupMenuItem(
                      enabled: false,
                      height: 24,
                      child: Text(
                        'Actions',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'filters',
                      height: 38,
                      child: Row(
                        children: [
                          Icon(LucideIcons.sliders, size: 16, color: Color(0xFF64748B)),
                          SizedBox(width: 12),
                          Text('Filters', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                    const PopupMenuDivider(height: 8),
                    const PopupMenuItem(
                      value: 'export_pdf',
                      height: 38,
                      child: Row(
                        children: [
                          Icon(LucideIcons.fileText, size: 16, color: Color(0xFF64748B)),
                          SizedBox(width: 12),
                          Text('Export PDF', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'export_excel',
                      height: 38,
                      child: Row(
                        children: [
                          Icon(LucideIcons.sheet, size: 16, color: Color(0xFF64748B)),
                          SizedBox(width: 12),
                          Text('Export Excel', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'share_report',
                      height: 38,
                      child: Row(
                        children: [
                          Icon(LucideIcons.share2, size: 16, color: Color(0xFF64748B)),
                          SizedBox(width: 12),
                          Text('Share Report', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'print',
                      height: 38,
                      child: Row(
                        children: [
                          Icon(LucideIcons.printer, size: 16, color: Color(0xFF64748B)),
                          SizedBox(width: 12),
                          Text('Print', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Period Filter Pills Row
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: ['Today', 'Yesterday', 'This Week', 'This Month', 'Custom'].map((period) {
                  final isSelected = _selectedPeriod == period;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: InkWell(
                      onTap: () {
                        if (period == 'Custom') {
                          _pickCustomDateRange();
                        } else {
                          setState(() => _selectedPeriod = period);
                        }
                      },
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? _mintColor : cardBg,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected ? _mintColor : borderColor,
                          ),
                        ),
                        child: Text(
                          period,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: isSelected ? Colors.white : textSecondary,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 20),

            // Summary Metric Cards (3 cards)
            Row(
              children: [
                Expanded(
                  child: _buildWalletMetricCard(
                    title: 'DEPOSIT',
                    value: _totalDeposit.toStringAsFixed(2),
                    valueColor: _mintColor,
                    cardBg: cardBg,
                    borderColor: borderColor,
                    textSecondary: textSecondary,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildWalletMetricCard(
                    title: 'EXPENSE',
                    value: _totalExpense.toStringAsFixed(2),
                    valueColor: _roseColor,
                    cardBg: cardBg,
                    borderColor: borderColor,
                    textSecondary: textSecondary,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildWalletMetricCard(
                    title: 'RECORDS',
                    value: '${filtered.length}',
                    valueColor: textPrimary,
                    isCurrency: false,
                    cardBg: cardBg,
                    borderColor: borderColor,
                    textSecondary: textSecondary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // All Transactions Header
            Text(
              'ALL TRANSACTIONS (${filtered.length})',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: textSecondary,
                letterSpacing: 0.8,
              ),
            ),
            const SizedBox(height: 12),

            // Transactions Listing or Empty State
            if (filtered.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 20),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(
                        LucideIcons.receipt,
                        size: 32,
                        color: textSecondary,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No transactions match these filters.',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    OutlinedButton.icon(
                      onPressed: () => _showAddTransactionDialog(defaultType: 'deposit'),
                      icon: const Icon(Icons.add, size: 16, color: _mintColor),
                      label: const Text('Add Transaction', style: TextStyle(color: _mintColor, fontSize: 13)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: _mintColor),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                    ),
                  ],
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: filtered.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (ctx, idx) {
                  final t = filtered[idx];
                  final isDep = t.type == 'deposit';
                  final amountColor = isDep ? _mintColor : _roseColor;

                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: borderColor),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: amountColor.withValues(alpha: 0.12),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isDep ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                            color: amountColor,
                            size: 18,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                t.employeeName.isNotEmpty ? t.employeeName : t.category,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: textPrimary,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                '${DateFormat('dd MMM yyyy, hh:mm a').format(t.date)} · ${t.paymentMode}',
                                style: TextStyle(fontSize: 11, color: textSecondary),
                              ),
                              if (t.notes.isNotEmpty) ...[
                                const SizedBox(height: 2),
                                Text(
                                  t.notes,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: textSecondary,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '${isDep ? '+' : '-'} SAR ${t.amount.toStringAsFixed(2)}',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: amountColor,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              t.type.toUpperCase(),
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            const SizedBox(height: 32),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: _mintColor,
        foregroundColor: Colors.white,
        elevation: 2,
        onPressed: () => _showAddTransactionDialog(defaultType: 'deposit'),
        icon: const Icon(Icons.add, size: 20),
        label: const Text('Add Entry', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildWalletMetricCard({
    required String title,
    required String value,
    required Color valueColor,
    bool isCurrency = true,
    required Color cardBg,
    required Color borderColor,
    required Color textSecondary,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
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
              if (isCurrency) ...[
                Text(
                  'SAR ',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    color: textSecondary,
                  ),
                ),
              ],
              Expanded(
                child: Text(
                  value,
                  style: TextStyle(
                    fontSize: 14,
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
}
