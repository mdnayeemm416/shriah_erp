import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_colors.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../models/product_model.dart';
import '../../../repositories/product_repository.dart';
import 'add_product_dialog.dart';
import 'adjust_stock_dialog.dart';

class ViewProductDialog extends StatelessWidget {
  final ProductModel product;

  const ViewProductDialog({super.key, required this.product});

  void _showEditDialog(BuildContext context) {
    Navigator.pop(context); // Close view dialog
    showDialog(
      context: context,
      builder: (ctx) => AddProductDialog(product: product),
    );
  }

  void _showAdjustStock(BuildContext context) {
    Navigator.pop(context); // Close view dialog
    showDialog(
      context: context,
      builder: (ctx) => AdjustStockDialog(product: product),
    );
  }

  void _showDeleteConfirm(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(LucideIcons.trash2, color: Colors.red, size: 20),
            SizedBox(width: 8),
            Text('Delete Product'),
          ],
        ),
        content: Text('Are you sure you want to delete "${product.name}"? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              await context.read<ProductRepository>().deleteProduct(product.id);
              if (ctx.mounted) {
                context.read<WholesaleCubit>().loadAllData();
                Navigator.pop(ctx); // Pop delete dialog
                Navigator.pop(context); // Pop view dialog
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Product "${product.name}" deleted.')),
                );
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bgColor = isDark ? AppColors.cardDark : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF111827) : Colors.white;
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final borderColor = isDark ? const Color(0xFF1F2937) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    final isLow = product.stock <= product.minStock;
    final isZero = product.stock == 0;
    final isNegative = product.stock < 0;

    Color stockColor = primaryColor;
    String stockStatus = 'In Stock';
    if (isNegative) {
      stockColor = Colors.red;
      stockStatus = 'Negative Stock';
    } else if (isZero) {
      stockColor = Colors.red;
      stockStatus = 'Out of Stock';
    } else if (isLow) {
      stockColor = Colors.orange;
      stockStatus = 'Low Stock';
    }

    final images = product.images ?? (product.imageUrl != null ? [product.imageUrl!] : []);

    final margin = product.price - product.purchasePrice;
    final marginPercent = product.price > 0 ? ((margin / product.price) * 100).toStringAsFixed(1) : '0.0';

    return Dialog(
      backgroundColor: bgColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 540),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      product.name,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.x, color: labelColor, size: 20),
                    onPressed: () => Navigator.pop(context),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 1),

            // Scrollable Content
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Image Banner / Gallery
                    if (images.isNotEmpty) ...[
                      SizedBox(
                        height: 160,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: images.length,
                          itemBuilder: (ctx, idx) {
                            final imgPath = images[idx];
                            final isFile = File(imgPath).existsSync();
                            return Container(
                              width: 160,
                              margin: const EdgeInsets.only(right: 12),
                              decoration: BoxDecoration(
                                color: cardBg,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: borderColor),
                                image: DecorationImage(
                                  image: isFile
                                      ? FileImage(File(imgPath)) as ImageProvider
                                      : NetworkImage(imgPath),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 16),
                    ] else ...[
                      Container(
                        width: double.infinity,
                        height: 100,
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: borderColor),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(LucideIcons.package, size: 36, color: labelColor),
                            const SizedBox(height: 4),
                            Text('No image uploaded', style: TextStyle(color: labelColor, fontSize: 12)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Stock Status Card
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: stockColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: stockColor.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            isLow ? LucideIcons.alertTriangle : LucideIcons.checkCircle2,
                            color: stockColor,
                            size: 20,
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '$stockStatus: ${product.stock.toInt()} units',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: stockColor,
                                ),
                              ),
                              Text(
                                'Min stock threshold: ${product.minStock.toInt()} units',
                                style: TextStyle(fontSize: 11, color: labelColor),
                              ),
                            ],
                          ),
                          const Spacer(),
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: stockColor),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            onPressed: () => _showAdjustStock(context),
                            icon: Icon(LucideIcons.sliders, size: 12, color: stockColor),
                            label: Text(
                              'Adjust Stock',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: stockColor),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Multi-language Titles Section
                    _buildSectionHeader('Product Names', labelColor),
                    const SizedBox(height: 6),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: borderColor),
                      ),
                      child: Column(
                        children: [
                          _buildDetailRow('English', product.name, textColor, labelColor),
                          if (product.nameBn != null && product.nameBn!.isNotEmpty) ...[
                            const Divider(height: 16),
                            _buildDetailRow('Bengali', product.nameBn!, textColor, labelColor),
                          ],
                          if (product.nameAr != null && product.nameAr!.isNotEmpty) ...[
                            const Divider(height: 16),
                            _buildDetailRow('Arabic', product.nameAr!, textColor, labelColor),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Codes & Identifiers Section
                    _buildSectionHeader('Codes & Barcode', labelColor),
                    const SizedBox(height: 6),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: borderColor),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _buildDetailRow('Barcode / SKU', product.barcode ?? product.itemCode ?? 'N/A', textColor, labelColor),
                              ),
                              if (product.barcode != null && product.barcode!.isNotEmpty)
                                IconButton(
                                  icon: const Icon(LucideIcons.copy, size: 16),
                                  onPressed: () {
                                    Clipboard.setData(ClipboardData(text: product.barcode!));
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Barcode copied to clipboard.')),
                                    );
                                  },
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Pricing Breakdown Card
                    _buildSectionHeader('Pricing & Profitability', labelColor),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: borderColor),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _buildStatItem('Sale Price', '${product.price.toStringAsFixed(2)} SAR', primaryColor, labelColor),
                              ),
                              Expanded(
                                child: _buildStatItem('Purchase Cost', '${product.purchasePrice.toStringAsFixed(2)} SAR', textColor, labelColor),
                              ),
                            ],
                          ),
                          const Divider(height: 20),
                          Row(
                            children: [
                              Expanded(
                                child: _buildStatItem(
                                  'Profit Margin',
                                  '${margin.toStringAsFixed(2)} SAR ($marginPercent%)',
                                  margin >= 0 ? primaryColor : Colors.red,
                                  labelColor,
                                ),
                              ),
                              Expanded(
                                child: _buildStatItem(
                                  'Tax Rate',
                                  '${product.taxRate ?? 15.0}% VAT',
                                  textColor,
                                  labelColor,
                                ),
                              ),
                            ],
                          ),
                          if (product.comparePrice != null && product.comparePrice! > 0) ...[
                            const Divider(height: 20),
                            _buildDetailRow(
                              'Other Company Price',
                              '${product.comparePrice!.toStringAsFixed(2)} SAR',
                              labelColor,
                              labelColor,
                              strikeThrough: true,
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Categories Chip Box
                    if (product.categoryIds != null && product.categoryIds!.isNotEmpty) ...[
                      _buildSectionHeader('Categories', labelColor),
                      const SizedBox(height: 6),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: product.categoryIds!.map((cat) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: primaryColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: primaryColor.withValues(alpha: 0.3)),
                            ),
                            child: Text(
                              cat,
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: primaryColor),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Description
                    if (product.description != null && product.description!.isNotEmpty) ...[
                      _buildSectionHeader('Description', labelColor),
                      const SizedBox(height: 6),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: borderColor),
                        ),
                        child: Text(
                          product.description!,
                          style: TextStyle(fontSize: 13, color: textColor, height: 1.4),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Visibility Toggles
                    _buildSectionHeader('Visibility & Status', labelColor),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        _buildStatusBadge('Website', product.isVisibleOnWebsite, isDark),
                        const SizedBox(width: 8),
                        _buildStatusBadge('Featured', product.isFeatured, isDark),
                        const SizedBox(width: 8),
                        _buildStatusBadge('Show Stock', product.showStock, isDark),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Footer Action Bar (Edit, Adjust, Delete)
            const Divider(height: 1, thickness: 1),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: const BorderSide(color: Colors.red),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => _showDeleteConfirm(context),
                      icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.red),
                      label: const Text('Delete', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: BorderSide(color: borderColor),
                        backgroundColor: cardBg,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => _showAdjustStock(context),
                      icon: Icon(LucideIcons.sliders, size: 16, color: textColor),
                      label: Text('Adjust Stock', style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        backgroundColor: primaryColor,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => _showEditDialog(context),
                      icon: const Icon(LucideIcons.pencil, size: 16, color: Colors.white),
                      label: const Text('Edit', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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

  Widget _buildSectionHeader(String title, Color color) {
    return Text(
      title,
      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color),
    );
  }

  Widget _buildDetailRow(String label, String value, Color textColor, Color labelColor, {bool strikeThrough = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 12, color: labelColor)),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: textColor,
            decoration: strikeThrough ? TextDecoration.lineThrough : null,
          ),
        ),
      ],
    );
  }

  Widget _buildStatItem(String label, String value, Color valueColor, Color labelColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 11, color: labelColor)),
        const SizedBox(height: 2),
        Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: valueColor)),
      ],
    );
  }

  Widget _buildStatusBadge(String label, bool active, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        decoration: BoxDecoration(
          color: active
              ? const Color(0xFF24B489).withValues(alpha: 0.12)
              : (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9)),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: active ? const Color(0xFF24B489) : Colors.transparent,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              active ? LucideIcons.check : LucideIcons.x,
              size: 12,
              color: active ? const Color(0xFF24B489) : Colors.grey,
            ),
            const SizedBox(width: 4),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: active ? const Color(0xFF24B489) : Colors.grey,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
