import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../common_widgets/smart_image_widget.dart';
import '../models/price_compare_models.dart';

class PriceCompareProductCard extends StatelessWidget {
  final PriceCompareProduct product;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const PriceCompareProductCard({
    super.key,
    required this.product,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final lowest = product.lowestPurchasePrice;
    final highest = product.highestPurchasePrice;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Row: Product Info & Selling Price
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product Avatar
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F7F2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: (product.imagePath != null && product.imagePath!.isNotEmpty)
                      ? SmartImageWidget(
                          imageUrl: product.imagePath!,
                          width: 48,
                          height: 48,
                          fit: BoxFit.cover,
                          fallbackWidget: const Center(
                            child: Icon(LucideIcons.box, color: Color(0xFF23B386), size: 24),
                          ),
                        )
                      : const Center(
                          child: Icon(LucideIcons.box, color: Color(0xFF23B386), size: 24),
                        ),
                ),
              ),
              const SizedBox(width: 12),

              // Name & Barcode
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    if (product.barcode.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(LucideIcons.scan, size: 13, color: Color(0xFF94A3B8)),
                          const SizedBox(width: 4),
                          Text(
                            product.barcode,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              // Sale Price
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'Sale Price',
                    style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                  ),
                  Text(
                    'SAR ${product.salePrice.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF23B386),
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Divider
          if (product.purchases.isNotEmpty) ...[
            const SizedBox(height: 14),
            const Divider(height: 1, color: Color(0xFFF1F5F9)),
            const SizedBox(height: 12),

            // Company Prices List
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'COMPARED COMPANIES (${product.purchases.length})',
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                    color: Color(0xFF64748B),
                  ),
                ),
                if (lowest != null && highest != null && lowest != highest)
                  Text(
                    'Diff: SAR ${(highest - lowest).toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFFEF4444),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),

            ...product.purchases.map((purchase) {
              final isLowest = lowest != null && purchase.purchasePrice == lowest;
              final isHighest = highest != null && purchase.purchasePrice == highest && highest != lowest;

              return Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: isLowest
                      ? const Color(0xFFF0FDF4)
                      : isHighest
                          ? const Color(0xFFFEF2F2)
                          : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isLowest
                        ? const Color(0xFFBBF7D0)
                        : isHighest
                            ? const Color(0xFFFECACA)
                            : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        purchase.companyName,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                    ),
                    if (isLowest) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF22C55E),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'Best Price',
                          style: TextStyle(color: Colors.white, fontSize: 9.5, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      'SAR ${purchase.purchasePrice.toStringAsFixed(2)}',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: isLowest ? const Color(0xFF15803D) : const Color(0xFF0F172A),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ],
      ),
    );
  }
}
