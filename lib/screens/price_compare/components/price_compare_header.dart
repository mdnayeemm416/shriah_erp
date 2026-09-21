import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

class PriceCompareHeader extends StatelessWidget {
  final TextEditingController searchController;
  final ValueChanged<String>? onSearchChanged;
  final VoidCallback onScanBarcode;
  final VoidCallback onAddProduct;

  const PriceCompareHeader({
    super.key,
    required this.searchController,
    this.onSearchChanged,
    required this.onScanBarcode,
    required this.onAddProduct,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? AppColors.borderDark : const Color(0xFFE8ECEF),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'PRICE COMPARE',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.8,
              color: isDark ? AppColors.mutedFgDark : Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Find & compare product prices',
            style: TextStyle(
              fontSize: 19,
              fontWeight: FontWeight.bold,
              color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 16),

          // Search Field
          Container(
            height: 48,
            decoration: BoxDecoration(
              color: isDark ? AppColors.inputDark : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
              ),
            ),
            child: TextField(
              controller: searchController,
              onChanged: onSearchChanged,
              style: TextStyle(
                color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                fontSize: 14,
              ),
              decoration: InputDecoration(
                hintText: 'Search by name or barcode...',
                hintStyle: TextStyle(
                  color: isDark ? AppColors.mutedFgDark : const Color(0xFF94A3B8),
                  fontSize: 14,
                ),
                prefixIcon: Icon(
                  LucideIcons.search,
                  size: 18,
                  color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Action Buttons
          Row(
            children: [
              // Scan Barcode Button
              Expanded(
                child: SizedBox(
                  height: 44,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                      foregroundColor: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                      side: BorderSide(
                        color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(22),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                    ),
                    onPressed: onScanBarcode,
                    icon: Icon(
                      LucideIcons.scan,
                      size: 16,
                      color: isDark ? AppColors.fgDark : const Color(0xFF334155),
                    ),
                    label: Text(
                      'Scan Barcode',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Add Product Button
              Expanded(
                child: SizedBox(
                  height: 44,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF23B386),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(22),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                    ),
                    onPressed: onAddProduct,
                    icon: const Icon(LucideIcons.plus, size: 16, color: Colors.white),
                    label: const Text(
                      'Add Product',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
