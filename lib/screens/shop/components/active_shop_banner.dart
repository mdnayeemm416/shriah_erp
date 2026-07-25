import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class ActiveShopBanner extends StatelessWidget {
  final String shopName;
  final String periodLabel;
  final bool isDark;
  final VoidCallback onClear;

  const ActiveShopBanner({
    super.key,
    required this.shopName,
    required this.periodLabel,
    required this.isDark,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    const primaryTeal = Color(0xFF24B489);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
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
          Row(
            children: [
              const Icon(
                LucideIcons.store,
                size: 16,
                color: primaryTeal,
              ),
              const SizedBox(width: 8),
              Text(
                shopName,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: primaryTeal,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: primaryTeal,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  periodLabel,
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          InkWell(
            onTap: onClear,
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: primaryTeal.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                LucideIcons.x,
                size: 14,
                color: primaryTeal,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
