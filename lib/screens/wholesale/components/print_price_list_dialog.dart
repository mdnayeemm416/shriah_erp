import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_colors.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../services/pdf_print_service.dart';

class PrintPriceListDialog extends StatefulWidget {
  const PrintPriceListDialog({super.key});

  @override
  State<PrintPriceListDialog> createState() => _PrintPriceListDialogState();
}

class _PrintPriceListDialogState extends State<PrintPriceListDialog> {
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = context.read<WholesaleCubit>().state;

    final filtered = state.products.where((p) {
      final query = _searchQuery.toLowerCase();
      return p.name.toLowerCase().contains(query) ||
          (p.itemCode ?? '').toLowerCase().contains(query) ||
          (p.barcode ?? '').toLowerCase().contains(query);
    }).toList();

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              LucideIcons.printer,
              color: AppColors.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Product Price List',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  '${state.products.length} products registered',
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ),
        ],
      ),
      content: SizedBox(
        width: 500,
        height: 480,
        child: Column(
          children: [
            TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              style: const TextStyle(fontSize: 12),
              decoration: InputDecoration(
                hintText: 'Search by name or code...',
                prefixIcon: const Icon(LucideIcons.search, size: 14),
                isDense: true,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: isDark
                    ? Colors.white.withValues(alpha: 0.04)
                    : Colors.black.withValues(alpha: 0.03),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Row(
                children: [
                  Expanded(
                    child: Text(
                      'Product details',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                      ),
                    ),
                  ),
                  Text(
                    'Unit Price',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 6),
            Expanded(
              child: filtered.isEmpty
                  ? const Center(
                      child: Text(
                        'No products match search.',
                        style:
                            TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    )
                  : ListView.builder(
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final p = filtered[index];
                        final rowBg = index % 2 == 0
                            ? Colors.transparent
                            : (isDark
                                ? Colors.white.withValues(alpha: 0.015)
                                : Colors.black.withValues(alpha: 0.01));

                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: rowBg,
                            border: Border(
                              bottom: BorderSide(
                                color: isDark
                                    ? Colors.white10
                                    : Colors.black12,
                                width: 0.5,
                              ),
                            ),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      p.name,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 13,
                                      ),
                                    ),
                                    const SizedBox(height: 3),
                                    Row(
                                      children: [
                                        if (p.itemCode != null) ...[
                                          Text(
                                            'SKU: ${p.itemCode}',
                                            style: const TextStyle(
                                              fontSize: 10,
                                              color: Colors.grey,
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                        ],
                                        Text(
                                          'Stock: ${p.stock.toInt()}',
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: p.stock <= p.minStock
                                                ? Colors.orange
                                                : Colors.grey,
                                            fontWeight:
                                                p.stock <= p.minStock
                                                    ? FontWeight.bold
                                                    : FontWeight.normal,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                '${p.price.toStringAsFixed(2)} SAR',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: AppColors.primary,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child:
              const Text('Close', style: TextStyle(color: Colors.grey)),
        ),
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            padding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          ),
          onPressed: () async {
            Navigator.pop(context);
            await PdfPrintService.printProductList(
              products: filtered,
              title: _searchQuery.isEmpty
                  ? 'Product Details & Price List'
                  : 'Filtered Product List ("$_searchQuery")',
            );
          },
          icon: const Icon(LucideIcons.printer, size: 14),
          label: const Text('Print PDF'),
        ),
      ],
    );
  }
}
