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
                      Icon(LucideIcons.info, size: 11, color: subtextColor),
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
                      Icon(LucideIcons.info, size: 11, color: subtextColor),
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
}
