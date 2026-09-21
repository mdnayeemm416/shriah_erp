import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/price_compare_models.dart';
import '../../common_widgets/smart_image_widget.dart';
import '../price_compare_details_screen.dart';

class PriceCompareProductCard extends StatelessWidget {
  final PriceCompareProductModel product;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onTap;

  const PriceCompareProductCard({
    super.key,
    required this.product,
    this.onEdit,
    this.onDelete,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Best / lowest price entry or latest entry
    final lowest = product.lowestPurchasePrice;
    final displayPrice = lowest != null && lowest > 0 ? lowest : product.sellingPrice;

    // First or best vendor
    final bestEntry = product.history.isNotEmpty
        ? product.history.reduce((a, b) => a.purchasePrice < b.purchasePrice ? a : b)
        : null;

    final vendorName = bestEntry?.vendorName ??
        (product.analysis?.vendorBreakdown.isNotEmpty == true
            ? product.analysis!.vendorBreakdown.first.vendorName
            : (product.category ?? ''));

    final dateStr = bestEntry?.purchaseDate ??
        product.updatedAt ??
        product.createdAt ??
        '';

    return GestureDetector(
      onTap: onTap ??
          () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => PriceCompareDetailsScreen(productId: product.id),
              ),
            );
          },
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.02),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Product Avatar / Box Icon Container
            Container(
              width: 58,
              height: 58,
              decoration: BoxDecoration(
                color: isDark ? AppColors.accentDark : const Color(0xFFE8F1F5),
                borderRadius: BorderRadius.circular(18),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: (product.productImageUrl != null && product.productImageUrl!.isNotEmpty)
                    ? SmartImageWidget(
                        imageUrl: product.productImageUrl!,
                        width: 58,
                        height: 58,
                        fit: BoxFit.cover,
                        fallbackWidget: Center(
                          child: Icon(
                            LucideIcons.box,
                            color: isDark ? AppColors.accentFgDark : const Color(0xFF334155),
                            size: 28,
                          ),
                        ),
                      )
                    : Center(
                        child: Icon(
                          LucideIcons.box,
                          color: isDark ? AppColors.accentFgDark : const Color(0xFF334155),
                          size: 28,
                        ),
                      ),
              ),
            ),
            const SizedBox(width: 14),

            // Middle: Name, Price, Vendor, Date
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.productName,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),

                  // Green/Teal Price
                  Text(
                    'SAR ${displayPrice.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: isDark ? const Color(0xFF2DD4BF) : const Color(0xFF0D9488),
                    ),
                  ),

                  if (vendorName.isNotEmpty) ...[
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        Icon(
                          LucideIcons.building2,
                          size: 12,
                          color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                        ),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            vendorName,
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],

                  if (dateStr.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Icon(
                          LucideIcons.calendar,
                          size: 12,
                          color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          dateStr,
                          style: TextStyle(
                            fontSize: 11.5,
                            color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),

            // Top Right: User tag or category
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      LucideIcons.user,
                      size: 13,
                      color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      product.category != null && product.category!.isNotEmpty
                          ? product.category!
                          : 'Test User',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
