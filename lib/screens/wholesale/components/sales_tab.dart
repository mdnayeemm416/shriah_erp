import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
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
  DateTime _selectedDate = DateTime.now();

  String _fmt(double val) => 'SAR ${val.toStringAsFixed(2)}';
  String _fmtShort(double val) => 'SAR ${val.toInt() == val ? val.toInt() : val.toStringAsFixed(2)}';
  String _fmtDate(DateTime dt) => DateFormat('M/d/yyyy, h:mm:ss a').format(dt);

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

  void _selectDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
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

        // Filter sales by active tab (Completed vs Cancelled/Recycle Bin)
        final displaySales = allSales.where((s) {
          if (_tabFilter == 'Recycle Bin') {
            return s.status == 'cancelled';
          } else {
            return s.status != 'cancelled';
          }
        }).toList();

        final totalSalesAmount = displaySales.fold(0.0, (sum, s) => sum + s.total);

        return ListView(
          padding: const EdgeInsets.all(12),
          children: [
            // 1. Top Total Sale Banner Card (Matching Image 2)
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
                            if (selected) setState(() => _periodFilter = filter);
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

                  // Date Selection Box
                  InkWell(
                    onTap: () => _selectDate(context),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: borderColor),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            DateFormat('MM/dd/yyyy').format(_selectedDate),
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: textColor,
                            ),
                          ),
                          Icon(LucideIcons.calendar, size: 16, color: labelColor),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // 2. Sales Returns Card (Yellow Card Matching Image 2)
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
                        _buildReturnStat('TODAY', 'SAR 0.00', isDark),
                        _buildReturnStat('THIS MONTH', 'SAR 0.00', isDark),
                        _buildReturnStat('TOTAL', 'SAR 0.00', isDark),
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

            // 5. Sales List Items (Matching Image 2 Card design)
            if (displaySales.isEmpty)
              Padding(
                padding: const EdgeInsets.all(32.0),
                child: Center(
                  child: Text(
                    _tabFilter == 'Recycle Bin' ? 'Recycle bin is empty.' : 'No sales logged yet.',
                    style: TextStyle(color: labelColor, fontSize: 13),
                  ),
                ),
              )
            else
              ...displaySales.map((sale) {
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
                        border: Border.all(color: borderColor),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '#${sale.invoiceNumber}',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: textColor,
                                ),
                              ),
                              Text(
                                _fmt(sale.total),
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w800,
                                  color: textColor,
                                ),
                              ),
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
                                      context.read<WholesaleCubit>().cancelSale(sale.id);
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Sale moved to Recycle Bin.')),
                                      );
                                    },
                                    child: const Padding(
                                      padding: EdgeInsets.all(4.0),
                                      child: Icon(LucideIcons.trash2, size: 18, color: Colors.red),
                                    ),
                                  ),
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
