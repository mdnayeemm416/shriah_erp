import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';

import '../../repositories/shop_repository.dart';
import '../../repositories/employee_repository.dart';
import '../../repositories/company_transaction_repository.dart';
import '../../models/shop_model.dart';
import '../../models/employee_model.dart';
import '../../models/company_transaction_model.dart';
import '../../core/theme/app_colors.dart';

class ProfitSummaryScreen extends StatefulWidget {
  const ProfitSummaryScreen({super.key});

  @override
  State<ProfitSummaryScreen> createState() => _ProfitSummaryScreenState();
}

class _ProfitSummaryScreenState extends State<ProfitSummaryScreen> {
  String _scope = 'company'; // 'company' | 'shop'
  String? _selectedShopId;
  String _periodMode = 'month'; // 'month' | 'custom'
  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 30));
  DateTime _toDate = DateTime.now();
  DateTime _selectedMonth = DateTime.now();

  bool _loading = false;
  List<ShopModel> _shops = [];

  // Computed results
  double _totalShopNetProfit = 0.0;
  double _companyNet = 0.0;
  double _finalBusinessProfit = 0.0;
  double _totalSalaries = 0.0;
  double _totalExpenses = 0.0;
  Map<String, double> _expenseBreakdown = {};

  @override
  void initState() {
    super.initState();
    _loadShops();
  }

  Future<void> _loadShops() async {
    setState(() => _loading = true);
    final shopRepo = context.read<ShopRepository>();
    final list = await shopRepo.getShops();
    setState(() {
      _shops = list;
      if (list.isNotEmpty) _selectedShopId = list.first.id;
      _loading = false;
    });
    _calculateReport();
  }

  Future<void> _calculateReport() async {
    setState(() => _loading = true);
    try {
      final shopRepo = context.read<ShopRepository>();
      final empRepo = context.read<EmployeeRepository>();
      final companyRepo = context.read<CompanyTransactionRepository>();

      // Resolve dates
      DateTime start;
      DateTime end;
      if (_periodMode == 'month') {
        start = DateTime(_selectedMonth.year, _selectedMonth.month, 1);
        end = DateTime(_selectedMonth.year, _selectedMonth.month + 1, 0);
      } else {
        start = _fromDate;
        end = _toDate;
      }

      final periodDays = end.difference(start).inDays + 1;

      final startStr = start.toIso8601String().split('T')[0];
      final endStr = end.toIso8601String().split('T')[0];

      // Fetch all entries in date range
      final shopEntries = await shopRepo.getEntries();
      final inRangeShopEntries = shopEntries.where((e) {
        final dateStr = e.txnDate.toIso8601String().split('T')[0];
        return dateStr.compareTo(startStr) >= 0 &&
            dateStr.compareTo(endStr) <= 0;
      }).toList();

      final companyTxns = await companyRepo.getTransactions();
      final inRangeCompanyTxns = companyTxns.where((t) {
        final dateStr = t.txnDate.toIso8601String().split('T')[0];
        return dateStr.compareTo(startStr) >= 0 &&
            dateStr.compareTo(endStr) <= 0;
      }).toList();

      final employees = await empRepo.getEmployees();

      // Filter shops based on scope
      final targetShops = _scope == 'company'
          ? _shops
          : _shops.where((s) => s.id == _selectedShopId).toList();

      double shopsNetTotal = 0.0;
      double salariesTotal = 0.0;
      double expensesTotal = 0.0;
      final Map<String, double> expensesMap = {};

      for (final shop in targetShops) {
        final entries = inRangeShopEntries
            .where((e) => e.shopId == shop.id)
            .toList();
        final isSimple = shop.shopType == 'simple_cash';

        double cashSale = 0.0;
        double withdraw = 0.0;
        double purchase = 0.0;
        double expense = 0.0;

        double simpleCashIn = 0.0;
        double simpleExpense = 0.0;

        for (final e in entries) {
          cashSale += e.cashSale;
          withdraw += e.withdrawAmount;
          purchase += e.purchaseAmount;
          expense += e.expenseAmount;

          if (isSimple) {
            if (e.entryType == 'sale') simpleCashIn += e.cashSale;
            if (e.entryType == 'expense') simpleExpense += e.expenseAmount;
          }

          // Bucket expenses using note text
          if (e.entryType == 'expense' && e.expenseAmount > 0) {
            final key = e.notes?.trim().isNotEmpty == true
                ? e.notes!.trim()
                : 'Other Expense';
            expensesMap[key] = (expensesMap[key] ?? 0.0) + e.expenseAmount;
          }
        }

        final cashPosition = isSimple
            ? simpleCashIn - simpleExpense
            : (cashSale + withdraw) - (purchase + expense);

        final netProfit = cashPosition; // Cash position is net profit per specs
        shopsNetTotal += netProfit;
        expensesTotal += isSimple ? simpleExpense : expense;

        // Salary apportionment
        final shopEmps = employees.where((e) => e.shopId == shop.id).toList();
        for (final emp in shopEmps) {
          final monthly = emp.monthlySalary;
          final calc = (monthly / 30.0) * periodDays;
          salariesTotal += calc;
        }
      }

      // Company transactions
      double companyIncome = 0.0;
      double companyExpense = 0.0;
      for (final t in inRangeCompanyTxns) {
        if (t.txnType == 'in') {
          companyIncome += t.amount;
        } else {
          companyExpense += t.amount;
        }
      }
      final companyNet = companyIncome - companyExpense;

      setState(() {
        _totalShopNetProfit = shopsNetTotal;
        _companyNet = companyNet;
        _totalSalaries = salariesTotal;
        _totalExpenses = expensesTotal;
        _expenseBreakdown = expensesMap;
        _finalBusinessProfit =
            shopsNetTotal +
            companyNet -
            salariesTotal; // Deduct salaries for overall profit
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sarFormatter = NumberFormat.currency(symbol: 'SAR');

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Profit Summary',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Aggregated profit-and-loss reports for shops and company accounts.',
                      style: TextStyle(
                        fontSize: 14,
                        color: isDark ? Colors.grey[400] : Colors.grey[600],
                      ),
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: _calculateReport,
                  icon: const Icon(LucideIcons.refreshCcw, size: 16),
                  label: const Text('Generate Report'),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Controls Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Scope Row
                    Row(
                      children: [
                        const Text(
                          'Scope:',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 16),
                        ChoiceChip(
                          label: const Text('Company (All Shops)'),
                          selected: _scope == 'company',
                          onSelected: (selected) {
                            if (selected) {
                              setState(() => _scope = 'company');
                              _calculateReport();
                            }
                          },
                        ),
                        const SizedBox(width: 8),
                        ChoiceChip(
                          label: const Text('Single Shop'),
                          selected: _scope == 'shop',
                          onSelected: (selected) {
                            if (selected) {
                              setState(() => _scope = 'shop');
                              _calculateReport();
                            }
                          },
                        ),
                        if (_scope == 'shop' && _shops.isNotEmpty) ...[
                          const SizedBox(width: 16),
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              initialValue: _selectedShopId,
                              items: _shops
                                  .map(
                                    (s) => DropdownMenuItem(
                                      value: s.id,
                                      child: Text(s.name),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (val) {
                                if (val != null) {
                                  setState(() => _selectedShopId = val);
                                  _calculateReport();
                                }
                              },
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Date Filters Row
                    Row(
                      children: [
                        const Text(
                          'Period:',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 16),
                        ChoiceChip(
                          label: const Text('Monthly Presets'),
                          selected: _periodMode == 'month',
                          onSelected: (selected) {
                            if (selected) {
                              setState(() => _periodMode = 'month');
                              _calculateReport();
                            }
                          },
                        ),
                        const SizedBox(width: 8),
                        ChoiceChip(
                          label: const Text('Custom Dates'),
                          selected: _periodMode == 'custom',
                          onSelected: (selected) {
                            if (selected) {
                              setState(() => _periodMode = 'custom');
                              _calculateReport();
                            }
                          },
                        ),
                        const Spacer(),
                        if (_periodMode == 'month')
                          TextButton.icon(
                            icon: const Icon(LucideIcons.calendar),
                            label: Text(
                              DateFormat('MMMM yyyy').format(_selectedMonth),
                            ),
                            onPressed: () async {
                              final now = DateTime.now();
                              final month = await showDatePicker(
                                context: context,
                                initialDate: _selectedMonth,
                                firstDate: DateTime(2020),
                                lastDate: DateTime(2030),
                              );
                              if (month != null) {
                                setState(() => _selectedMonth = month);
                                _calculateReport();
                              }
                            },
                          )
                        else ...[
                          TextButton(
                            onPressed: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: _fromDate,
                                firstDate: DateTime(2020),
                                lastDate: DateTime(2030),
                              );
                              if (picked != null) {
                                setState(() => _fromDate = picked);
                                _calculateReport();
                              }
                            },
                            child: Text(
                              'From: ${DateFormat('yyyy-MM-dd').format(_fromDate)}',
                            ),
                          ),
                          const Icon(LucideIcons.arrowRight, size: 14),
                          TextButton(
                            onPressed: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: _toDate,
                                firstDate: DateTime(2020),
                                lastDate: DateTime(2030),
                              );
                              if (picked != null) {
                                setState(() => _toDate = picked);
                                _calculateReport();
                              }
                            },
                            child: Text(
                              'To: ${DateFormat('yyyy-MM-dd').format(_toDate)}',
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            if (_loading)
              const Center(child: CircularProgressIndicator())
            else ...[
              // Business Profit Header Hero Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: _finalBusinessProfit >= 0
                      ? Colors.teal.withOpacity(isDark ? 0.15 : 0.08)
                      : Colors.red.withOpacity(isDark ? 0.15 : 0.08),
                  border: Border.all(
                    color: _finalBusinessProfit >= 0
                        ? Colors.teal.withOpacity(0.3)
                        : Colors.red.withOpacity(0.3),
                    width: 1.5,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'FINAL BUSINESS NET PROFIT',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      sarFormatter.format(_finalBusinessProfit),
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: _finalBusinessProfit >= 0
                            ? Colors.teal
                            : Colors.red,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Includes total retail store profits, company transactions, minus salary wages apportioned for the active date range.',
                      style: TextStyle(
                        fontSize: 13,
                        color: isDark ? Colors.grey[400] : Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Summary Breakdown details
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Left Card: Ledger summary
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Profit & Loss Summary',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            const SizedBox(height: 16),
                            _buildPLRow(
                              'Stores Net Profit',
                              _totalShopNetProfit,
                              sarFormatter,
                            ),
                            _buildPLRow(
                              'Company Level Transactions Net',
                              _companyNet,
                              sarFormatter,
                            ),
                            _buildPLRow(
                              'Apportioned Employee Salaries',
                              -_totalSalaries,
                              sarFormatter,
                            ),
                            const Divider(),
                            _buildPLRow(
                              'Operating Expenses',
                              -_totalExpenses,
                              sarFormatter,
                            ),
                            const Divider(),
                            _buildPLRow(
                              'Final Computed Profit',
                              _finalBusinessProfit,
                              sarFormatter,
                              isBold: true,
                              color: _finalBusinessProfit >= 0
                                  ? Colors.teal
                                  : Colors.red,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 24),

                  // Right Card: Expense breakdowns
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Operating Expenses Breakdown',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            const SizedBox(height: 16),
                            if (_expenseBreakdown.isEmpty)
                              const Padding(
                                padding: EdgeInsets.all(24.0),
                                child: Center(
                                  child: Text(
                                    'No expenses recorded for this range.',
                                    style: TextStyle(color: Colors.grey),
                                  ),
                                ),
                              )
                            else
                              ListView.separated(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: _expenseBreakdown.length,
                                separatorBuilder: (_, __) => const Divider(),
                                itemBuilder: (context, index) {
                                  final entry = _expenseBreakdown.entries
                                      .elementAt(index);
                                  return Padding(
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 4.0,
                                    ),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          entry.key,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        Text(
                                          sarFormatter.format(entry.value),
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Colors.red,
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPLRow(
    String label,
    double val,
    NumberFormat formatter, {
    bool isBold = false,
    Color? color,
  }) {
    final style = TextStyle(
      fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
      fontSize: isBold ? 15 : 14,
      color:
          color ?? (isBold ? null : (val < 0 ? Colors.red : Colors.grey[700])),
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: style),
          Text(formatter.format(val), style: style),
        ],
      ),
    );
  }
}
