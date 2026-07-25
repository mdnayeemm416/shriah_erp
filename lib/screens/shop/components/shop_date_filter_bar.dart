import 'package:flutter/material.dart';

class ShopDateFilterBar extends StatelessWidget {
  final String selectedPeriod;
  final bool isDark;
  final Function(String period) onPeriodSelected;
  final VoidCallback onCustomDateTap;

  const ShopDateFilterBar({
    super.key,
    required this.selectedPeriod,
    required this.isDark,
    required this.onPeriodSelected,
    required this.onCustomDateTap,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          _buildDatePill('Today', 'today'),
          const SizedBox(width: 8),
          _buildDatePill('Yesterday', 'yesterday'),
          const SizedBox(width: 8),
          _buildDatePill('Weekly', 'weekly'),
          const SizedBox(width: 8),
          _buildDatePill('Monthly', 'monthly'),
          const SizedBox(width: 8),
          _buildDatePill('Custom', 'custom', isCustom: true),
        ],
      ),
    );
  }

  Widget _buildDatePill(String label, String key, {bool isCustom = false}) {
    final active = selectedPeriod == key;
    const primaryTeal = Color(0xFF24B489);
    final cardBg = isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    return InkWell(
      onTap: () {
        if (isCustom) {
          onCustomDateTap();
        } else {
          onPeriodSelected(key);
        }
      },
      borderRadius: BorderRadius.circular(24),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        decoration: BoxDecoration(
          color: active ? primaryTeal : cardBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: active ? primaryTeal : borderColor,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
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
