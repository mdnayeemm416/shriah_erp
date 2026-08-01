import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'shop_models.dart';

class PerShopSummarySection extends StatelessWidget {
  final List<ShopCardSummary> shopSummaries;
  final String? selectedShopId;
  final bool isDark;
  final Function(String shopId) onShopSelected;
  final VoidCallback onRefresh;

  const PerShopSummarySection({
    super.key,
    required this.shopSummaries,
    required this.selectedShopId,
    required this.isDark,
    required this.onShopSelected,
    required this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header Row
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'PER-SHOP SUMMARY',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                  color: subtextColor,
                ),
              ),
              InkWell(
                onTap: onRefresh,
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(LucideIcons.refreshCw, size: 11, color: subtextColor),
                      const SizedBox(width: 4),
                      Text(
                        'Refresh',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: subtextColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Horizontal Shop Summary Cards Carousel
        SizedBox(
          height: 245,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            scrollDirection: Axis.horizontal,
            itemCount: shopSummaries.length,
            separatorBuilder: (context, index) => const SizedBox(width: 14),
            itemBuilder: (context, index) {
              final summary = shopSummaries[index];
              final isSelected = selectedShopId == summary.shop.id;

              return ShopSummaryCard(
                summary: summary,
                isSelected: isSelected,
                isDark: isDark,
                onTap: () => onShopSelected(summary.shop.id),
              );
            },
          ),
        ),
      ],
    );
  }
}

class ShopSummaryCard extends StatelessWidget {
  final ShopCardSummary summary;
  final bool isSelected;
  final bool isDark;
  final VoidCallback onTap;

  const ShopSummaryCard({
    super.key,
    required this.summary,
    required this.isSelected,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cardBg = isSelected
        ? (isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1))
        : (isDark ? const Color(0xFF1E293B) : Colors.white);
    final borderColor = isSelected
        ? const Color(0xFF24B489)
        : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0));
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final innerPillBg = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: 280,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: borderColor,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Header Row: Shop Icon + Title + Status dot
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF24B489).withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        LucideIcons.store,
                        size: 16,
                        color: Color(0xFF24B489),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          summary.shop.name,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        Text(
                          summary.lastDate != null
                              ? 'Active'
                              : 'No activity',
                          style: TextStyle(
                            fontSize: 11,
                            color: subtextColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Color(0xFF24B489),
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Inner Pill 1: SHOP CASH POSITION
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: innerPillBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(
                        'SHOP CASH POSITION',
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.4,
                          color: subtextColor,
                        ),
                      ),
                      const SizedBox(width: 4),
                      GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: () => _showShopCashPositionDetails(context, summary, isDark),
                        child: Padding(
                          padding: const EdgeInsets.all(4),
                          child: Icon(LucideIcons.info, size: 11, color: subtextColor),
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'SAR ${summary.cashPosition.toStringAsFixed(summary.cashPosition.truncateToDouble() == summary.cashPosition ? 0 : 2)}',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: textColor,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Inner Pill 2: EXPECTED BANK BALANCE
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: innerPillBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(
                        'EXPECTED BANK BALANCE',
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.4,
                          color: subtextColor,
                        ),
                      ),
                      const SizedBox(width: 4),
                      GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: () => _showExpectedBankDetails(context, summary, isDark),
                        child: Padding(
                          padding: const EdgeInsets.all(4),
                          child: Icon(LucideIcons.info, size: 11, color: subtextColor),
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'SAR ${summary.expectedBank.toStringAsFixed(summary.expectedBank.truncateToDouble() == summary.expectedBank ? 0 : 2)}',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: textColor,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showShopCashPositionDetails(BuildContext context, ShopCardSummary summary, bool isDark) {
    if (summary.isSimple) {
      _showMetricDetailsDialog(
        context,
        title: 'Shop Cash Position',
        definition: 'Net cash held by this simple cash shop. Total Cash minus Total Cost over the selected period.',
        formula: 'Total Cash - Total Cost = Cash Sale - Expense',
        affectedBy: {
          'Total Cash (Cash Sale)': {
            'value': 'SAR ${summary.primary.toStringAsFixed(2)}',
            'subText': 'Primary cash sales recorded for this simple shop.',
          },
          'Total Cost (Expense)': {
            'value': 'SAR ${summary.secondary.toStringAsFixed(2)}',
            'subText': 'Secondary expenses paid from cash.',
          },
          'Cash Position': {
            'value': 'SAR ${summary.cashPosition.toStringAsFixed(2)}',
            'highlight': true,
          },
        },
        isDark: isDark,
      );
    } else {
      final totalCash = summary.cashSale + summary.withdrawAmount;
      final totalCost = summary.purchaseAmount + summary.expenseAmount;
      _showMetricDetailsDialog(
        context,
        title: 'Shop Cash Position',
        definition: 'Net cash held by this shop. Total Cash minus Total Cost over the selected period.',
        formula: 'Total Cash - Total Cost = (Cash Sale + Bank Withdraw) - (Purchase + Expense)',
        affectedBy: {
          'Total Cash': {
            'value': 'SAR ${totalCash.toStringAsFixed(2)}',
            'subText': 'Cash Sale: SAR ${summary.cashSale.toStringAsFixed(2)} + Bank Withdraw: SAR ${summary.withdrawAmount.toStringAsFixed(2)}',
          },
          'Total Cost': {
            'value': 'SAR ${totalCost.toStringAsFixed(2)}',
            'subText': 'Purchase: SAR ${summary.purchaseAmount.toStringAsFixed(2)} + Expense: SAR ${summary.expenseAmount.toStringAsFixed(2)}',
          },
          'Cash Position': {
            'value': 'SAR ${summary.cashPosition.toStringAsFixed(2)}',
            'highlight': true,
          },
        },
        isDark: isDark,
      );
    }
  }

  void _showExpectedBankDetails(BuildContext context, ShopCardSummary summary, bool isDark) {
    _showMetricDetailsDialog(
      context,
      title: 'Expected Bank Balance',
      definition: 'Net bank position based on bank sales and bank withdrawals.',
      formula: 'Bank Sale - Bank Withdraw',
      affectedBy: {
        'Bank Sale': {
          'value': 'SAR ${summary.bankSale.toStringAsFixed(2)}',
          'subText': 'Sales transactions paid to the bank account.',
        },
        'Bank Withdraw': {
          'value': 'SAR ${summary.withdrawAmount.toStringAsFixed(2)}',
          'subText': 'Cash withdrawals from the bank account.',
        },
        'Expected Bank Balance': {
          'value': 'SAR ${summary.expectedBank.toStringAsFixed(2)}',
          'highlight': true,
        },
      },
      isDark: isDark,
    );
  }

  void _showMetricDetailsDialog(
    BuildContext context, {
    required String title,
    required String definition,
    required String formula,
    required Map<String, Map<String, dynamic>> affectedBy,
    required bool isDark,
  }) {
    showDialog(
      context: context,
      builder: (context) {
        final titleColor = isDark ? Colors.white : const Color(0xFF0F172A);
        final bodyColor = isDark ? const Color(0xFFCBD5E1) : const Color(0xFF334155);
        final sectionHeaderColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
        final codeBgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9);
        final borderCol = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
          titlePadding: const EdgeInsets.fromLTRB(24, 20, 24, 8),
          contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 0),
          actionsPadding: const EdgeInsets.fromLTRB(24, 12, 24, 16),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: titleColor,
                ),
              ),
              IconButton(
                icon: Icon(Icons.close, size: 20, color: sectionHeaderColor),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // WHAT IT MEANS
                Text(
                  'WHAT IT MEANS',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                    color: sectionHeaderColor,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  definition,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.4,
                    color: bodyColor,
                  ),
                ),
                const SizedBox(height: 16),

                // FORMULA
                Text(
                  'FORMULA',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                    color: sectionHeaderColor,
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: codeBgColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: borderCol),
                  ),
                  child: Text(
                    formula,
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      height: 1.3,
                      color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF0284C7),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // AFFECTED BY
                Text(
                  'AFFECTED BY',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                    color: sectionHeaderColor,
                  ),
                ),
                const SizedBox(height: 8),
                ...affectedBy.entries.map((entry) {
                  final isLast = entry.key == affectedBy.keys.last;
                  final Map<String, dynamic> data = entry.value;
                  final highlight = data['highlight'] == true;
                  return Padding(
                    padding: EdgeInsets.only(bottom: isLast ? 0.0 : 8.0),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: highlight
                            ? (isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1))
                            : (isDark ? const Color(0xFF0F172A).withOpacity(0.5) : const Color(0xFFF8FAFC)),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: highlight
                              ? const Color(0xFF24B489).withOpacity(0.5)
                              : borderCol,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                entry.key,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: titleColor,
                                ),
                              ),
                              Text(
                                data['value'] as String,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w800,
                                  color: highlight
                                      ? const Color(0xFF10B981)
                                      : titleColor,
                                ),
                              ),
                            ],
                          ),
                          if (data['subText'] != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              data['subText'] as String,
                              style: TextStyle(
                                fontSize: 11,
                                color: sectionHeaderColor,
                                height: 1.2,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 12),
              ],
            ),
          ),
          actions: [
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                style: TextButton.styleFrom(
                  backgroundColor: const Color(0xFF24B489),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text(
                  'Close',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
