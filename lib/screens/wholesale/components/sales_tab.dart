import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';
import '../wholesale_transaction_dialog.dart';
import 'transaction_detail_dialog.dart';
import 'sales_return_dialog.dart';

class SalesTab extends StatefulWidget {
  const SalesTab({super.key});

  @override
  State<SalesTab> createState() => _SalesTabState();
}

class _SalesTabState extends State<SalesTab> {
  String _periodFilter = 'Daily'; // 'Daily', 'Weekly', 'Monthly', 'Custom'
  String _tabFilter = 'Completed Sales'; // 'Completed Sales', 'Recycle Bin'
  DateTime _startDate = DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
  DateTime _endDate = DateTime.now();
  String _searchQuery = '';
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<WholesaleCubit>().loadAllData(
        startDate: _startDate,
        endDate: _endDate,
      );
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  String _fmt(double val) => 'SAR ${val.toStringAsFixed(2)}';
  String _fmtShort(double val) => 'SAR ${val.toInt() == val ? val.toInt() : val.toStringAsFixed(2)}';
  String _fmtDate(DateTime dt) => DateFormat('M/d/yyyy, h:mm a').format(dt);

  Future<void> _shareToWhatsApp(String mobile, String msg) async {
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    if (cleanMobile.isEmpty) return;
    final url = Uri.parse(
      'https://wa.me/$cleanMobile?text=${Uri.encodeComponent(msg)}',
    );
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _applyPeriodPreset(String preset) {
    final now = DateTime.now();
    DateTime start = _startDate;
    DateTime end = now;
    if (preset == 'Daily') {
      start = DateTime(now.year, now.month, now.day);
      end = now;
    } else if (preset == 'Weekly') {
      start = now.subtract(const Duration(days: 7));
      end = now;
    } else if (preset == 'Monthly') {
      start = now.subtract(const Duration(days: 30));
      end = now;
    }
    setState(() {
      _periodFilter = preset;
      _startDate = start;
      _endDate = end;
    });
    context.read<WholesaleCubit>().loadAllData(
      startDate: start,
      endDate: end,
    );
  }

  void _selectStartDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        _startDate = picked;
        _periodFilter = 'Custom';
      });
      context.read<WholesaleCubit>().loadAllData(
        startDate: picked,
        endDate: _endDate,
      );
    }
  }

  void _selectEndDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _endDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        _endDate = picked;
        _periodFilter = 'Custom';
      });
      context.read<WholesaleCubit>().loadAllData(
        startDate: _startDate,
        endDate: picked,
      );
    }
  }

  void _confirmPurge(BuildContext context, WholesaleSaleModel sale) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Purge Sale Permanently', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Text('Are you sure you want to permanently purge Sale #${sale.invoiceNumber}? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              Navigator.pop(ctx);
              context.read<WholesaleCubit>().purgeSale(sale.id);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Sale #${sale.invoiceNumber} permanently purged from database.')),
              );
            },
            child: const Text('Purge Permanently', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final topBannerBg = isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1);
    final yellowBg = isDark ? const Color(0xFF322812) : const Color(0xFFFEFCE8);
    final yellowBorder = isDark ? const Color(0xFF715217) : const Color(0xFFFDE047);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        final allSales = state.sales;

        // Filter sales by active tab, date range & search query
        final displaySales = allSales.where((s) {
          final isRecycle = s.isDeleted || s.status == 'cancelled';
          if (_tabFilter == 'Recycle Bin') {
            if (!isRecycle) return false;
          } else {
            if (isRecycle) return false;
          }

          // Date range filter
          final sDate = DateTime(s.createdAt.year, s.createdAt.month, s.createdAt.day);
          final start = DateTime(_startDate.year, _startDate.month, _startDate.day);
          final end = DateTime(_endDate.year, _endDate.month, _endDate.day, 23, 59, 59);

          final matchesDate = (sDate.isAfter(start) || sDate.isAtSameMomentAs(start)) &&
              (sDate.isBefore(end) || sDate.isAtSameMomentAs(end));
          if (!matchesDate) return false;

          // Text Search filter
          if (_searchQuery.isNotEmpty) {
            final invMatch = s.invoiceNumber.toString().contains(_searchQuery);
            final nameMatch = s.customerName.toLowerCase().contains(_searchQuery);
            final mobileMatch = s.customerMobile.toLowerCase().contains(_searchQuery);
            return invMatch || nameMatch || mobileMatch;
          }

          return true;
        }).toList();

        final totalSalesAmount = displaySales.fold(0.0, (sum, s) => sum + s.total);

        return ListView(
          padding: const EdgeInsets.all(12),
          children: [
            // 1. Top Total Sale Banner Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: topBannerBg,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'TOTAL SALE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                      color: isDark ? const Color(0xFF2DD4BF) : const Color(0xFF0D9488),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _fmtShort(totalSalesAmount),
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Period Chips
                  Row(
                    children: ['Daily', 'Weekly', 'Monthly', 'Custom'].map((filter) {
                      final active = _periodFilter == filter;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(
                            filter,
                            style: TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.bold,
                              color: active
                                  ? Colors.white
                                  : (isDark ? Colors.grey[300] : const Color(0xFF475569)),
                            ),
                          ),
                          selected: active,
                          onSelected: (selected) {
                            if (selected) _applyPeriodPreset(filter);
                          },
                          selectedColor: primaryColor,
                          backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                            side: BorderSide.none,
                          ),
                          showCheckmark: false,
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 12),

                  // Date Range Selection (Start Date & End Date)
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () => _selectStartDate(context),
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: borderColor),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Start Date', style: TextStyle(fontSize: 10, color: labelColor, fontWeight: FontWeight.w600)),
                                const SizedBox(height: 2),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      DateFormat('MM/dd/yyyy').format(_startDate),
                                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textColor),
                                    ),
                                    Icon(LucideIcons.calendar, size: 14, color: labelColor),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: InkWell(
                          onTap: () => _selectEndDate(context),
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: borderColor),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('End Date', style: TextStyle(fontSize: 10, color: labelColor, fontWeight: FontWeight.w600)),
                                const SizedBox(height: 2),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      DateFormat('MM/dd/yyyy').format(_endDate),
                                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textColor),
                                    ),
                                    Icon(LucideIcons.calendar, size: 14, color: labelColor),
                                  ],
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
            const SizedBox(height: 12),

            // 2. Sales Returns Card
            InkWell(
              onTap: () => SalesReturnDialog.show(context),
              borderRadius: BorderRadius.circular(24),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: yellowBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: yellowBorder),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFFEF3C7),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(LucideIcons.undo2, color: Color(0xFFD97706), size: 16),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'SALES RETURNS',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.8,
                                  color: Color(0xFFD97706),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Tap to process a new return',
                                style: TextStyle(
                                  fontSize: 11.5,
                                  color: isDark ? Colors.grey[400] : const Color(0xFF78350F),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(LucideIcons.chevronRight, color: labelColor, size: 18),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildReturnStat(
                          'TODAY',
                          state.salesReturnSummary != null
                              ? '${_fmt(state.salesReturnSummary!.today.amount)} (${state.salesReturnSummary!.today.count})'
                              : 'SAR 0.00 (0)',
                          isDark,
                        ),
                        _buildReturnStat(
                          'THIS MONTH',
                          state.salesReturnSummary != null
                              ? '${_fmt(state.salesReturnSummary!.thisMonth.amount)} (${state.salesReturnSummary!.thisMonth.count})'
                              : 'SAR 0.00 (0)',
                          isDark,
                        ),
                        _buildReturnStat(
                          'TOTAL',
                          state.salesReturnSummary != null
                              ? '${_fmt(state.salesReturnSummary!.total.amount)} (${state.salesReturnSummary!.total.count})'
                              : 'SAR 0.00 (0)',
                          isDark,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            // 3. Filter Toggle Bar (Completed Sales vs Recycle Bin)
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: ['Completed Sales', 'Recycle Bin'].map((tab) {
                  final active = _tabFilter == tab;
                  return Expanded(
                    child: InkWell(
                      onTap: () => setState(() => _tabFilter = tab),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: active ? cardBg : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: active
                              ? [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.05),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ]
                              : [],
                        ),
                        child: Text(
                          tab,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.bold,
                            color: active ? textColor : labelColor,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 14),

            // Search Bar
            Container(
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: borderColor),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Icon(LucideIcons.search, size: 18, color: labelColor),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      style: TextStyle(color: textColor, fontSize: 13.5),
                      decoration: InputDecoration(
                        hintText: 'Search by Invoice, Customer Name or Mobile...',
                        hintStyle: TextStyle(color: labelColor, fontSize: 13.5),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val.toLowerCase().trim();
                        });
                      },
                    ),
                  ),
                  if (_searchQuery.isNotEmpty)
                    GestureDetector(
                      onTap: () {
                        _searchController.clear();
                        setState(() {
                          _searchQuery = '';
                        });
                      },
                      child: Icon(LucideIcons.x, size: 16, color: labelColor),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // 4. Primary Action Buttons (+ New Sale, + New Sales Return)
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const WholesaleTransactionDialog(kind: 'sale'),
                      );
                    },
                    icon: const Icon(LucideIcons.plus, size: 16, color: Colors.white),
                    label: const Text(
                      'New Sale',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    onPressed: () {
                      SalesReturnDialog.show(context);
                    },
                    icon: const Icon(LucideIcons.undo2, size: 16, color: Colors.white),
                    label: const Text(
                      'New Sales Return',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // 5. Sales List Items
            if (displaySales.isEmpty)
              Padding(
                padding: const EdgeInsets.all(32.0),
                child: Center(
                  child: Text(
                    _tabFilter == 'Recycle Bin' ? 'Recycle bin is empty.' : 'No sales found for the selected period.',
                    style: TextStyle(color: labelColor, fontSize: 13),
                  ),
                ),
              )
            else
              ...displaySales.map((sale) {
                final isRecycled = sale.isDeleted || sale.status == 'cancelled';
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10.0),
                  child: InkWell(
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (ctx) => TransactionDetailDialog(entry: sale),
                      );
                    },
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: isRecycled ? Colors.redAccent.withValues(alpha: 0.4) : borderColor),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    '#${sale.invoiceNumber}',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                      color: textColor,
                                    ),
                                  ),
                                  if (isRecycled) ...[
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.red.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(10),
                                        border: Border.all(color: Colors.redAccent.withValues(alpha: 0.3)),
                                      ),
                                      child: const Text(
                                        'RECYCLED',
                                        style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Colors.redAccent),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                              if (sale.totalReturnedAmount != null && sale.totalReturnedAmount! > 0) ...[
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      _fmt(sale.netTotal ?? (sale.total - sale.totalReturnedAmount!)),
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w800,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 1),
                                    Text(
                                      'Ret: -${_fmt(sale.totalReturnedAmount!)}',
                                      style: const TextStyle(
                                        fontSize: 10.5,
                                        color: Colors.redAccent,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                )
                              ] else ...[
                                Text(
                                  _fmt(sale.total),
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: textColor,
                                  ),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            sale.customerName.isEmpty ? 'Walk-in Customer' : sale.customerName,
                            style: TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w600,
                              color: textColor,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${sale.items.length} items · ${_fmtDate(sale.createdAt)}',
                                style: TextStyle(
                                  fontSize: 11.5,
                                  color: labelColor,
                                ),
                              ),
                              Row(
                                children: [
                                  if (!isRecycled) ...[
                                    InkWell(
                                      onTap: () {
                                        final msg =
                                            'Dear Customer, invoice #${sale.invoiceNumber} details:\nTotal: ${sale.total} SAR\nThank you!';
                                        _shareToWhatsApp(sale.customerMobile, msg);
                                      },
                                      child: const Padding(
                                        padding: EdgeInsets.all(4.0),
                                        child: Icon(LucideIcons.messageCircle, size: 18, color: Color(0xFF10B981)),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    InkWell(
                                      onTap: () {
                                        context.read<WholesaleCubit>().softDeleteSale(sale.id);
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('Sale #${sale.invoiceNumber} moved to Recycle Bin.')),
                                        );
                                      },
                                      child: const Padding(
                                        padding: EdgeInsets.all(4.0),
                                        child: Icon(LucideIcons.trash2, size: 18, color: Colors.redAccent),
                                      ),
                                    ),
                                  ] else ...[
                                    // Recycle Bin Actions: Restore & Permanent Purge
                                    OutlinedButton.icon(
                                      style: OutlinedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        side: const BorderSide(color: Color(0xFF24B489)),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                        minimumSize: Size.zero,
                                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      onPressed: () {
                                        context.read<WholesaleCubit>().restoreSale(sale.id);
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(
                                            content: Text('Sale #${sale.invoiceNumber} restored & stock re-deducted successfully.'),
                                            backgroundColor: const Color(0xFF24B489),
                                          ),
                                        );
                                      },
                                      icon: const Icon(LucideIcons.rotateCcw, size: 13, color: Color(0xFF24B489)),
                                      label: const Text(
                                        'Restore',
                                        style: TextStyle(color: Color(0xFF24B489), fontWeight: FontWeight.bold, fontSize: 11),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    OutlinedButton.icon(
                                      style: OutlinedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        side: const BorderSide(color: Colors.redAccent),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                        minimumSize: Size.zero,
                                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      onPressed: () => _confirmPurge(context, sale),
                                      icon: const Icon(LucideIcons.trash2, size: 13, color: Colors.redAccent),
                                      label: const Text(
                                        'Purge',
                                        style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 11),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
          ],
        );
      },
    );
  }

  Widget _buildReturnStat(String label, String value, bool isDark) {
    return Column(
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 9.5,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
            color: isDark ? Colors.grey[400] : const Color(0xFF78350F),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: isDark ? Colors.amber[300] : const Color(0xFF92400E),
          ),
        ),
      ],
    );
  }
}
