import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';
import 'receivable_breakdown_dialog.dart';
import 'transaction_detail_dialog.dart';
import 'profit_details_dialog.dart';

class DashboardTab extends StatefulWidget {
  final Function(WholesaleCustomerModel) onOpenCustomer;

  const DashboardTab({
    super.key,
    required this.onOpenCustomer,
  });

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  final String _profitPeriod = 'Monthly';
  String _recentEntryFilter = 'All';
  WholesaleProfitDetailsModel? _profitDetails;

  @override
  void initState() {
    super.initState();
    _loadProfitDetails();
  }

  Future<void> _loadProfitDetails() async {
    final res = await context.read<WholesaleCubit>().getProfitDetails(period: 'monthly');
    if (mounted) {
      setState(() {
        _profitDetails = res;
      });
    }
  }

  String _fmt(double val) {
    return '${val.toStringAsFixed(2)} SAR';
  }

  Map<String, dynamic> _getProfitStatsForPeriod(WholesaleState state) {
    final now = DateTime.now();
    final todayStr = now.toIso8601String().split('T')[0];
    final currentMonth = now.month;
    final currentYear = now.year;

    double revenue = 0.0;
    double cost = 0.0;
    double soldItemsCount = 0.0;

    for (final sale in state.sales) {
      if (sale.status == 'cancelled') continue;

      final saleDateStr = sale.createdAt.toIso8601String().split('T')[0];
      final isToday = saleDateStr == todayStr;
      final isThisMonth = sale.createdAt.month == currentMonth && sale.createdAt.year == currentYear;

      bool match = false;
      if (_profitPeriod == 'Daily' && isToday) match = true;
      if (_profitPeriod == 'Monthly' && isThisMonth) match = true;
      if (_profitPeriod == 'All-Time') match = true;

      if (match) {
        revenue += sale.total;
        cost += sale.items.fold(0.0, (sum, item) => sum + (item.qty * item.purchasePrice));
        soldItemsCount += sale.items.fold(0.0, (sum, item) => sum + item.qty);
      }
    }

    final profit = revenue - cost;

    return {
      'profit': profit,
      'revenue': revenue,
      'sold': soldItemsCount.toInt(),
    };
  }

  List<dynamic> _getFilteredRecentEntries(WholesaleState state) {
    final List<dynamic> allEntries = [];

    if (_recentEntryFilter == 'All' || _recentEntryFilter == 'Sale') {
      allEntries.addAll(
        state.sales
            .where((s) => s.status != 'cancelled')
            .toList(),
      );
    }

    if (_recentEntryFilter == 'All' || _recentEntryFilter == 'Purchase') {
      allEntries.addAll(state.purchases);
    }

    if (_recentEntryFilter == 'All' || _recentEntryFilter == 'Payment') {
      allEntries.addAll(state.payments);
    }

    allEntries.sort((a, b) {
      final DateTime dateA = (a is WholesaleSaleModel)
          ? a.createdAt
          : (a is WholesalePurchaseModel)
              ? a.createdAt
              : (a as WholesalePaymentModel).createdAt;
      final DateTime dateB = (b is WholesaleSaleModel)
          ? b.createdAt
          : (b is WholesalePurchaseModel)
              ? b.createdAt
              : (b as WholesalePaymentModel).createdAt;
      return dateB.compareTo(dateA);
    });

    return allEntries;
  }

  void _showProfitDetailsDialog() {
    showDialog(
      context: context,
      builder: (context) => ProfitDetailsDialog(
        initialPeriod: _profitPeriod,
      ),
    );
  }

  void _showChangePeriodSheet() {
    _showProfitDetailsDialog();
  }

  void _showMetricInfoDialog(String metric, WholesaleState state) {
    final currentStock = state.stockValuation;
    final openingDue = state.customers.fold(
      0.0,
      (sum, c) => sum + c.openingDue,
    );
    final salesDue = state.sales
        .where((s) => s.status != 'cancelled')
        .fold(0.0, (sum, s) => sum + s.dueAmount);
    final paidIn = state.payments
        .where((p) => p.kind == 'payment_in')
        .fold(0.0, (sum, p) => sum + p.amount);
    final receivable = (openingDue + salesDue - paidIn).clamp(
      0.0,
      double.infinity,
    );
    final wholesaleValue = currentStock + receivable;
    const openingBalance = 175000.0;
    final convertedToCash = openingBalance - wholesaleValue;

    String title = '';
    Widget body = const SizedBox();

    if (metric == 'warehouse') {
      title = 'Wholesale value';
      body = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFormulaLine('Wholesale Value = Current Stock + Receivable'),
          const SizedBox(height: 12),
          _buildDetailRow('Current Stock', _fmt(currentStock)),
          _buildDetailRow('Receivable', _fmt(receivable)),
          const Divider(),
          _buildDetailRow(
            'Total Wholesale Value',
            _fmt(wholesaleValue),
            isBold: true,
            color: Colors.teal,
          ),
        ],
      );
    } else if (metric == 'stock') {
      title = 'Current stock';
      body = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFormulaLine('Current Stock = Σ(product.stock × purchase_cost)'),
          const SizedBox(height: 12),
          _buildDetailRow(
            'Total stock value',
            _fmt(currentStock),
            isBold: true,
          ),
        ],
      );
    } else if (metric == 'converted') {
      title = 'Converted to cash';
      body = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFormulaLine(
            'Converted To Cash = Opening Balance − Wholesale Value',
          ),
          const SizedBox(height: 12),
          _buildDetailRow('Opening balance', _fmt(openingBalance)),
          _buildDetailRow('Wholesale value', '− ${_fmt(wholesaleValue)}'),
          const Divider(),
          _buildDetailRow(
            'Converted',
            _fmt(convertedToCash),
            isBold: true,
            color: convertedToCash >= 0 ? Colors.green : Colors.red,
          ),
        ],
      );
    }

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            title,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          content: body,
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildFormulaLine(String text) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.blue.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Colors.teal,
        ),
      ),
    );
  }

  Widget _buildDetailRow(
    String label,
    String value, {
    bool isBold = false,
    Color? color,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              fontSize: 13,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
              color: color,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentEntryRow({
    required IconData icon,
    required String title,
    required String subtitle,
    required double amount,
    required bool isPositive,
    required Color color,
    required DateTime date,
    required dynamic entry,
  }) {
    return InkWell(
      onTap: () {
        showDialog(
          context: context,
          builder: (context) => TransactionDetailDialog(entry: entry),
        );
      },
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
        child: Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundColor: color.withValues(alpha: 0.08),
              child: Icon(icon, color: color, size: 14),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '$subtitle • ${DateFormat('MM-dd HH:mm').format(date)}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: Colors.grey, fontSize: 10),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Text(
              '${isPositive ? '+' : '-'} ${_fmt(amount)}',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                color: isPositive ? Colors.green : Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        final profitStats = _getProfitStatsForPeriod(state);
        final double profitVal = _profitDetails?.netProfit ?? profitStats['profit'] ?? 0.0;
        final double revenueVal = _profitDetails?.totalSales ?? profitStats['revenue'] ?? 0.0;
        final int soldCount = _profitDetails?.totalSoldItems.toInt() ?? profitStats['sold'] ?? 0;
        final double marginVal = _profitDetails?.profitMarginPercentage ??
            (revenueVal > 0 ? (profitVal / revenueVal) * 100 : 0.0);

        final currentStock = state.stockValuation;
        final receivable = state.totalCustomerDue;
        final wholesaleValue = currentStock + receivable;
        const double openingBalance = 175000.0;
        final convertedToCash = openingBalance - wholesaleValue;

        final filteredEntries = _getFilteredRecentEntries(state);

        return Scaffold(
          backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
          body: RefreshIndicator(
            onRefresh: () async {
              await Future.wait([
                context.read<WholesaleCubit>().loadAllData(),
                _loadProfitDetails(),
              ]);
            },
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. WHOLESALE VALUE CARD
                Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                    side: BorderSide(
                      color: isDark ? Colors.white10 : Colors.black.withValues(alpha: 0.04),
                      width: 1,
                    ),
                  ),
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      'WHOLESALE VALUE',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 1.0,
                                        color: isDark ? const Color(0xFF10B981) : const Color(0xFF0D9488),
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    InkWell(
                                      onTap: () => _showMetricInfoDialog('warehouse', state),
                                      borderRadius: BorderRadius.circular(12),
                                      child: Icon(
                                        Icons.info_outline,
                                        size: 14,
                                        color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  _fmt(wholesaleValue),
                                  style: TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? Colors.white : Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Stock + Receivable',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                            // Refresh button
                            InkWell(
                              onTap: () {
                                context.read<WholesaleCubit>().loadAllData();
                              },
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.sync,
                                      size: 14,
                                      color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Refresh',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Divider(
                          color: isDark ? Colors.white10 : Colors.black.withValues(alpha: 0.06),
                          height: 1,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // STOCK
                            Expanded(
                              child: InkWell(
                                onTap: () {
                                  context.read<WholesaleCubit>().changeTab(6);
                                },
                                borderRadius: BorderRadius.circular(12),
                                child: Padding(
                                  padding: const EdgeInsets.all(4.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            'STOCK',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                            ),
                                          ),
                                          const SizedBox(width: 4),
                                          InkWell(
                                            onTap: () => _showMetricInfoDialog('stock', state),
                                            child: Icon(
                                              Icons.info_outline,
                                              size: 12,
                                              color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        _fmt(currentStock),
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: isDark ? Colors.white : Colors.black,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            // RECEIVABLE
                            Expanded(
                              child: InkWell(
                                onTap: () {
                                  showDialog(
                                    context: context,
                                    builder: (context) {
                                      return ReceivableBreakdownDialog(
                                        state: state,
                                        onOpenCustomer: widget.onOpenCustomer,
                                      );
                                    },
                                  );
                                },
                                borderRadius: BorderRadius.circular(12),
                                child: Padding(
                                  padding: const EdgeInsets.all(4.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            'RECEIVABLE',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                            ),
                                          ),
                                          const SizedBox(width: 4),
                                          InkWell(
                                            onTap: () {
                                              showDialog(
                                                context: context,
                                                builder: (context) {
                                                  return ReceivableBreakdownDialog(
                                                    state: state,
                                                    onOpenCustomer: widget.onOpenCustomer,
                                                  );
                                                },
                                              );
                                            },
                                            child: Icon(
                                              Icons.info_outline,
                                              size: 12,
                                              color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        _fmt(receivable),
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: isDark ? Colors.white : Colors.black,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            // CONVERTED CASH
                            Expanded(
                              child: InkWell(
                                onTap: () => _showMetricInfoDialog('converted', state),
                                borderRadius: BorderRadius.circular(12),
                                child: Padding(
                                  padding: const EdgeInsets.all(4.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Flexible(
                                            child: Text(
                                              'CONVERTED',
                                              overflow: TextOverflow.ellipsis,
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                                color: isDark ? const Color(0xFF10B981) : const Color(0xFF0F9D58),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 4),
                                          InkWell(
                                            onTap: () => _showMetricInfoDialog('converted', state),
                                            child: Icon(
                                              Icons.info_outline,
                                              size: 12,
                                              color: isDark ? const Color(0xFF10B981) : const Color(0xFF0F9D58),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        _fmt(convertedToCash),
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: isDark ? const Color(0xFF10B981) : const Color(0xFF0D9488),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // 2. PROFIT CARD
                Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                    side: BorderSide(
                      color: isDark ? Colors.white10 : Colors.black.withValues(alpha: 0.04),
                      width: 1,
                    ),
                  ),
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  child: InkWell(
                    onTap: _showProfitDetailsDialog,
                    borderRadius: BorderRadius.circular(24),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    width: 36,
                                    height: 36,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: isDark ? const Color(0xFF1A362D) : const Color(0xFFE6F7F0),
                                    ),
                                    child: const Icon(
                                      Icons.trending_up,
                                      color: Color(0xFF0F9D58),
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'PROFIT • ${_profitPeriod.toUpperCase()}',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        _fmt(profitVal),
                                        style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                          color: isDark ? Colors.white : Colors.black,
                                        ),
                                      ),
                                      if (marginVal > 0) ...[
                                        const SizedBox(height: 2),
                                        Text(
                                          'Margin: ${marginVal.toStringAsFixed(2)}%',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF0F9D58),
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ],
                              ),
                              // Details button
                              Material(
                                color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(20),
                                child: InkWell(
                                  onTap: _showProfitDetailsDialog,
                                  borderRadius: BorderRadius.circular(20),
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                    child: Row(
                                      children: [
                                        Text(
                                          'Details',
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: isDark ? Colors.white : const Color(0xFF475569),
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Icon(
                                          Icons.chevron_right,
                                          size: 14,
                                          color: isDark ? Colors.white : const Color(0xFF475569),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Divider(
                            color: isDark ? Colors.white10 : Colors.black.withValues(alpha: 0.06),
                            height: 1,
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Sold: $soldCount',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.grey[300] : const Color(0xFF475569),
                                ),
                              ),
                              Text(
                                'Sales: ${_fmt(revenueVal)}',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.grey[300] : const Color(0xFF475569),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // 3. RECENT ENTRIES SECTION
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'RECENT ENTRY',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                        color: isDark ? Colors.grey[400] : const Color(0xFF475569),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${filteredEntries.length}',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : const Color(0xFF475569),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: ['All', 'Sale', 'Purchase', 'Payment'].map((filter) {
                      final active = _recentEntryFilter == filter;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(
                            filter,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: active
                                  ? Colors.white
                                  : (isDark ? Colors.grey[300] : const Color(0xFF475569)),
                            ),
                          ),
                          selected: active,
                          onSelected: (selected) {
                            if (selected) {
                              setState(() {
                                _recentEntryFilter = filter;
                              });
                            }
                          },
                          selectedColor: isDark ? const Color(0xFF10B981) : const Color(0xFF0D9488),
                          backgroundColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                            side: BorderSide.none,
                          ),
                          showCheckmark: false,
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 16),

                // Entries List container
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: isDark ? Colors.white10 : Colors.black.withValues(alpha: 0.04),
                    ),
                  ),
                  child: filteredEntries.isEmpty
                      ? const SizedBox(
                          height: 120,
                          child: Center(
                            child: Text(
                              'No entries yet.',
                              style: TextStyle(
                                fontSize: 14,
                                color: Color(0xFF94A3B8),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        )
                      : ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: filteredEntries.length > 10 ? 10 : filteredEntries.length,
                          separatorBuilder: (context, index) => Divider(
                            color: isDark ? Colors.white10 : Colors.black.withValues(alpha: 0.04),
                          ),
                          itemBuilder: (context, index) {
                            final entry = filteredEntries[index];

                            if (entry is WholesaleSaleModel) {
                              return _buildRecentEntryRow(
                                icon: Icons.shopping_bag_outlined,
                                title: entry.customerName.isEmpty ? 'Walk-in Customer' : entry.customerName,
                                subtitle: 'Sale #${entry.id.substring(0, 4).toUpperCase()}',
                                amount: entry.total,
                                isPositive: true,
                                color: const Color(0xFF0D9488),
                                date: entry.createdAt,
                                entry: entry,
                              );
                            } else if (entry is WholesalePurchaseModel) {
                              return _buildRecentEntryRow(
                                icon: Icons.local_shipping_outlined,
                                title: entry.supplierName,
                                subtitle: 'Purchase #${entry.id.substring(0, 4).toUpperCase()}',
                                amount: entry.total,
                                isPositive: false,
                                color: Colors.blue,
                                date: entry.createdAt,
                                entry: entry,
                              );
                            } else if (entry is WholesalePaymentModel) {
                              final isPaymentIn = entry.kind == 'payment_in';
                              final customerName = state.customers
                                  .cast<WholesaleCustomerModel?>()
                                  .firstWhere(
                                    (c) => c != null && c.id == entry.customerId,
                                    orElse: () => null,
                                  )
                                  ?.name ?? 'Customer';
                              return _buildRecentEntryRow(
                                icon: isPaymentIn
                                    ? Icons.account_balance_wallet_outlined
                                    : Icons.outbox_outlined,
                                title: customerName,
                                subtitle: isPaymentIn ? 'Payment In' : 'Payment Out',
                                amount: entry.amount,
                                isPositive: isPaymentIn,
                                color: isPaymentIn ? Colors.teal : Colors.orange,
                                date: entry.createdAt,
                                entry: entry,
                              );
                            }
                            return const SizedBox();
                          },
                        ),
                ),
              ],
            ),
          ),
        ),
        );
      },
    );
  }
}
