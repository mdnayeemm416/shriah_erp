import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';

class ProfitDetailsDialog extends StatefulWidget {
  final String initialPeriod;

  const ProfitDetailsDialog({
    super.key,
    this.initialPeriod = 'Monthly',
  });

  @override
  State<ProfitDetailsDialog> createState() => _ProfitDetailsDialogState();
}

class _ProfitDetailsDialogState extends State<ProfitDetailsDialog> {
  late String _selectedPeriod;

  @override
  void initState() {
    super.initState();
    _selectedPeriod = widget.initialPeriod;
  }

  Map<String, dynamic> _calculateStats(WholesaleState state) {
    final now = DateTime.now();
    final todayStr = now.toIso8601String().split('T')[0];
    final currentMonth = now.month;
    final currentYear = now.year;

    double totalSales = 0.0;
    double totalPurchaseCost = 0.0;
    double totalSoldItems = 0.0;

    for (final sale in state.sales) {
      if (sale.status == 'cancelled') continue;

      final saleDateStr = sale.createdAt.toIso8601String().split('T')[0];
      final isToday = saleDateStr == todayStr;
      final isThisMonth =
          sale.createdAt.month == currentMonth && sale.createdAt.year == currentYear;

      bool match = false;
      if (_selectedPeriod == 'Daily' && isToday) match = true;
      if (_selectedPeriod == 'Monthly' && isThisMonth) match = true;
      if (_selectedPeriod == 'All Time' && true) match = true;

      if (match) {
        totalSales += sale.total;
        totalPurchaseCost += sale.items.fold(
          0.0,
          (sum, item) => sum + (item.qty * item.purchasePrice),
        );
        totalSoldItems += sale.items.fold(0.0, (sum, item) => sum + item.qty);
      }
    }

    final netProfit = totalSales - totalPurchaseCost;

    return {
      'soldItems': totalSoldItems.toInt(),
      'totalSales': totalSales,
      'totalPurchaseCost': totalPurchaseCost,
      'netProfit': netProfit,
    };
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC);
    final cardBgColor = isDark ? const Color(0xFF0F172A) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final subtitleColor = isDark ? Colors.grey[400]! : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        final stats = _calculateStats(state);
        final int soldItems = stats['soldItems'] ?? 0;
        final double totalSales = stats['totalSales'] ?? 0.0;
        final double totalPurchaseCost = stats['totalPurchaseCost'] ?? 0.0;
        final double netProfit = stats['netProfit'] ?? 0.0;

        return Dialog(
          backgroundColor: bgColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Container(
            width: 420,
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Profit details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: Icon(
                        LucideIcons.x,
                        color: subtitleColor,
                        size: 20,
                      ),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Divider(height: 1, color: borderColor),
                const SizedBox(height: 20),

                // Period Pills Switcher
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(28),
                  ),
                  child: Row(
                    children: ['Daily', 'Monthly', 'All Time'].map((period) {
                      final isSelected = _selectedPeriod == period;
                      return Expanded(
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedPeriod = period;
                            });
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 180),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? (isDark ? const Color(0xFF1E293B) : Colors.white)
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(24),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.06),
                                        blurRadius: 4,
                                        offset: const Offset(0, 2),
                                      )
                                    ]
                                  : [],
                            ),
                            child: Text(
                              period,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.w500,
                                color: isSelected
                                    ? textColor
                                    : (isDark ? Colors.grey[400] : const Color(0xFF64748B)),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 20),

                // Green Realized Profit Hero Banner
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 16),
                  decoration: BoxDecoration(
                    color: isDark
                        ? const Color(0xFF064E3B).withValues(alpha: 0.5)
                        : const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: const Color(0xFF10B981).withValues(alpha: 0.2),
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'NET REALIZED PROFIT \u2022 ${_selectedPeriod.toUpperCase()}',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.8,
                          color: isDark ? const Color(0xFF34D399) : const Color(0xFF0F766E),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'SAR ${netProfit.toStringAsFixed(0)}',
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F9D58),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '(Sale rate \u2013 Purchase rate) \u00d7 Sold qty',
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Breakdown Card Table
                Container(
                  decoration: BoxDecoration(
                    color: cardBgColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    children: [
                      _buildRow(
                        label: 'TOTAL SOLD ITEMS',
                        value: '$soldItems',
                        textColor: textColor,
                        labelColor: subtitleColor,
                      ),
                      Divider(height: 1, color: borderColor),
                      _buildRow(
                        label: 'TOTAL SALES',
                        value: 'SAR ${totalSales.toStringAsFixed(0)}',
                        textColor: textColor,
                        labelColor: subtitleColor,
                      ),
                      Divider(height: 1, color: borderColor),
                      _buildRow(
                        label: 'TOTAL PURCHASE COST',
                        value: 'SAR ${totalPurchaseCost.toStringAsFixed(0)}',
                        textColor: textColor,
                        labelColor: subtitleColor,
                      ),
                      Divider(height: 1, color: borderColor),
                      _buildRow(
                        label: 'NET REALIZED PROFIT',
                        value: 'SAR ${netProfit.toStringAsFixed(0)}',
                        textColor: const Color(0xFF0F9D58),
                        labelColor: subtitleColor,
                        isBoldValue: true,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildRow({
    required String label,
    required String value,
    required Color textColor,
    required Color labelColor,
    bool isBoldValue = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
              color: labelColor,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: isBoldValue ? FontWeight.bold : FontWeight.w600,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}
