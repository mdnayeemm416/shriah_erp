import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../../models/shop_entry_model.dart';

class RecentEntriesSection extends StatelessWidget {
  final String activeShopName;
  final int totalEntriesCount;
  final double netTotalAmount;
  final List<ShopEntryModel> entries;
  final Set<String> activeFilters;
  final bool isDark;
  final Function(String filterKey) onFilterToggled;
  final VoidCallback onClearFilters;
  final Function(ShopEntryModel entry) onEditEntry;
  final Function(ShopEntryModel entry) onDeleteEntry;

  const RecentEntriesSection({
    super.key,
    required this.activeShopName,
    required this.totalEntriesCount,
    required this.netTotalAmount,
    required this.entries,
    required this.activeFilters,
    required this.isDark,
    required this.onFilterToggled,
    required this.onClearFilters,
    required this.onEditEntry,
    required this.onDeleteEntry,
  });

  @override
  Widget build(BuildContext context) {
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryTeal = Color(0xFF24B489);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title Header with Count Badge
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(
                  '$activeShopName · Recent Entries',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: borderColor),
                  ),
                  child: Text(
                    '$totalEntriesCount',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: subtextColor,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Category Filter Chips Row
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildCategoryChip('All', 'all'),
              const SizedBox(width: 6),
              _buildCategoryChip('POS Sale', 'pos_sale'),
              const SizedBox(width: 6),
              _buildCategoryChip('Cash Sale', 'cash_sale'),
              const SizedBox(width: 6),
              _buildCategoryChip('Bank Sale', 'bank_sale'),
              const SizedBox(width: 6),
              _buildCategoryChip('Credit Sale', 'credit_sale'),
              const SizedBox(width: 6),
              _buildCategoryChip('Purchase', 'purchase'),
              const SizedBox(width: 6),
              _buildCategoryChip('Expense', 'expense'),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // NET TOTAL Banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: primaryTeal.withValues(alpha: 0.3),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'NET TOTAL (ALL ENTRIES)',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                  color: Color(0xFF0D9488),
                ),
              ),
              Text(
                'SAR ${netTotalAmount.toStringAsFixed(netTotalAmount.truncateToDouble() == netTotalAmount ? 0 : 2)}',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0D9488),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Entries List or Empty State
        if (entries.isEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              children: [
                Icon(LucideIcons.fileText, size: 36, color: subtextColor.withValues(alpha: 0.5)),
                const SizedBox(height: 10),
                Text(
                  'No transactions recorded yet',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Tap + button below to record your first shop entry',
                  style: TextStyle(fontSize: 12, color: subtextColor),
                ),
              ],
            ),
          )
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: entries.length,
            separatorBuilder: (context, index) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final entry = entries[index];
              return _ShopEntryCard(
                entry: entry,
                isDark: isDark,
                onEdit: () => onEditEntry(entry),
                onDelete: () => onDeleteEntry(entry),
              );
            },
          ),
      ],
    );
  }

  Widget _buildCategoryChip(String label, String key) {
    final active = key == 'all' ? activeFilters.isEmpty : activeFilters.contains(key);
    const primaryTeal = Color(0xFF24B489);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    return InkWell(
      onTap: () => onFilterToggled(key),
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: active ? primaryTeal : cardBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: active ? primaryTeal : borderColor,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: active ? FontWeight.bold : FontWeight.w600,
            color: active
                ? Colors.white
                : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569)),
          ),
        ),
      ),
    );
  }
}

class _ShopEntryCard extends StatelessWidget {
  final ShopEntryModel entry;
  final bool isDark;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _ShopEntryCard({
    required this.entry,
    required this.isDark,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    final isSale = entry.entryType == 'sale';
    final amount = isSale ? entry.calculateTotalSale() : (entry.purchaseAmount + entry.expenseAmount + entry.withdrawAmount);
    final formattedDate = DateFormat('MMM dd, yyyy').format(entry.txnDate);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: (isSale ? const Color(0xFF24B489) : Colors.amber.shade700).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  isSale ? LucideIcons.shoppingCart : LucideIcons.arrowUpRight,
                  size: 18,
                  color: isSale ? const Color(0xFF24B489) : Colors.amber.shade700,
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.entryType.toUpperCase(),
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    formattedDate,
                    style: TextStyle(fontSize: 11, color: subtextColor),
                  ),
                ],
              ),
            ],
          ),
          Row(
            children: [
              Text(
                'SAR ${amount.toStringAsFixed(amount.truncateToDouble() == amount ? 0 : 2)}',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: isSale ? const Color(0xFF24B489) : textColor,
                ),
              ),
              const SizedBox(width: 8),
              PopupMenuButton<String>(
                icon: Icon(LucideIcons.moreVertical, size: 16, color: subtextColor),
                onSelected: (val) {
                  if (val == 'edit') onEdit();
                  if (val == 'delete') onDelete();
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(value: 'edit', child: Text('Edit Entry')),
                  const PopupMenuItem(value: 'delete', child: Text('Delete Entry')),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
