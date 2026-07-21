import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/product_model.dart';
import '../../../repositories/product_repository.dart';
import 'adjust_stock_dialog.dart';
import 'add_product_dialog.dart';
import 'view_product_dialog.dart';
import 'bulk_adjust_stock_dialog.dart';
import 'vyapar_import_dialog.dart';
import 'print_price_list_dialog.dart';

class InventoryTab extends StatefulWidget {
  const InventoryTab({super.key});

  @override
  State<InventoryTab> createState() => _InventoryTabState();
}

class _InventoryTabState extends State<InventoryTab> {
  final _searchController = TextEditingController();
  String _inventoryFilter = 'all';
  bool _isSelectMode = false;
  final Set<String> _selectedProductIds = {};

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showViewProductDialog(ProductModel product) {
    showDialog(
      context: context,
      builder: (context) => ViewProductDialog(product: product),
    );
  }

  void _showEditProductDialog(ProductModel product) {
    showDialog(
      context: context,
      builder: (context) => AddProductDialog(product: product),
    );
  }

  void _showAdjustStockDialog(ProductModel product) {
    showDialog(
      context: context,
      builder: (context) => AdjustStockDialog(product: product),
    );
  }

  void _showSingleDeleteConfirmDialog(ProductModel product) {
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
              if (mounted) {
                context.read<WholesaleCubit>().loadAllData();
                Navigator.pop(ctx);
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

  void _showAddProductDialog() {
    showDialog(
      context: context,
      builder: (context) => const AddProductDialog(),
    );
  }

  void _showBulkAdjustStockDialog() {
    showDialog(
      context: context,
      builder: (context) => BulkAdjustStockDialog(
        selectedProductIds: _selectedProductIds,
        onSuccess: () {
          setState(() {
            _isSelectMode = false;
            _selectedProductIds.clear();
          });
        },
      ),
    );
  }

  void _showVyaparImportDialog() {
    showDialog(
      context: context,
      builder: (context) => const VyaparImportDialog(),
    );
  }

  void _showPrintPriceList() {
    showDialog(
      context: context,
      builder: (context) => const PrintPriceListDialog(),
    );
  }

  void _showBulkDeleteConfirmDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Selected Products'),
        content: Text(
          'Are you sure you want to delete ${_selectedProductIds.length} products? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              for (final id in _selectedProductIds) {
                await context.read<ProductRepository>().deleteProduct(id);
              }
              if (mounted) {
                context.read<WholesaleCubit>().loadAllData();
                setState(() {
                  _isSelectMode = false;
                  _selectedProductIds.clear();
                });
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Selected products deleted.')),
                );
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  Widget _buildStockChip(String label, String key, int count, bool isDark) {
    final active = _inventoryFilter == key;
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: ChoiceChip(
        label: Text(
          '$label ($count)',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: active
                ? Colors.white
                : (isDark ? Colors.grey[300] : const Color(0xFF475569)),
          ),
        ),
        selected: active,
        onSelected: (selected) {
          if (selected) {
            setState(() {
              _inventoryFilter = key;
            });
          }
        },
        selectedColor:
            isDark ? const Color(0xFF10B981) : const Color(0xFF0D9488),
        backgroundColor:
            isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide.none,
        ),
        showCheckmark: false,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        final isDark = Theme.of(context).brightness == Brightness.dark;

        int countAll = state.products.length;
        int countInStock = 0;
        int countLow = 0;
        int countZero = 0;
        int countNegative = 0;

        for (final p in state.products) {
          final st = p.stock;
          final min = p.minStock;
          if (st < 0) {
            countNegative++;
          } else if (st == 0) {
            countZero++;
          } else if (min > 0 && st <= min) {
            countLow++;
          } else {
            countInStock++;
          }
        }

        final query = _searchController.text.toLowerCase().trim();
        final filteredProducts = state.products.where((p) {
          final st = p.stock;
          final min = p.minStock;
          if (_inventoryFilter == 'in' &&
              !(st > 0 && !(min > 0 && st <= min))) return false;
          if (_inventoryFilter == 'low' &&
              !(min > 0 && st > 0 && st <= min)) return false;
          if (_inventoryFilter == 'zero' && st != 0) return false;
          if (_inventoryFilter == 'negative' && st >= 0) return false;

          if (query.isNotEmpty) {
            final name = p.name.toLowerCase();
            final code = (p.itemCode ?? '').toLowerCase();
            final barcode = (p.barcode ?? '').toLowerCase();
            if (!name.contains(query) &&
                !code.contains(query) &&
                !barcode.contains(query)) {
              return false;
            }
          }
          return true;
        }).toList();

        return LayoutBuilder(
          builder: (context, constraints) {
            return Scaffold(
              backgroundColor: isDark
                  ? const Color(0xFF0F172A)
                  : const Color(0xFFF8FAFC),
              body: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF1E293B)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(28),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.02),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: TextField(
                              controller: _searchController,
                              onChanged: (val) => setState(() {}),
                              decoration: InputDecoration(
                                hintText: 'Search name, barcode, SKU...',
                                hintStyle: TextStyle(
                                  color: isDark
                                      ? Colors.grey[400]
                                      : const Color(0xFF64748B),
                                ),
                                prefixIcon: Icon(
                                  Icons.search,
                                  color: isDark
                                      ? Colors.grey[400]
                                      : const Color(0xFF64748B),
                                ),
                                suffixIcon: _searchController.text.isNotEmpty
                                    ? IconButton(
                                        icon: const Icon(Icons.clear),
                                        onPressed: () {
                                          _searchController.clear();
                                          setState(() {});
                                        },
                                      )
                                    : null,
                                border: InputBorder.none,
                                contentPadding:
                                    const EdgeInsets.symmetric(vertical: 12),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        PopupMenuButton<String>(
                          icon: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isDark
                                  ? const Color(0xFF1E293B)
                                  : Colors.white,
                              border: Border.all(
                                color: isDark
                                    ? Colors.white10
                                    : Colors.black.withValues(alpha: 0.04),
                              ),
                            ),
                            child: Icon(
                              Icons.more_vert,
                              color: isDark
                                  ? Colors.white
                                  : const Color(0xFF64748B),
                            ),
                          ),
                          onSelected: (value) {
                            if (value == 'new') {
                              _showAddProductDialog();
                            } else if (value == 'bulk') {
                              setState(() {
                                _isSelectMode = !_isSelectMode;
                                _selectedProductIds.clear();
                              });
                            } else if (value == 'import') {
                              _showVyaparImportDialog();
                            } else if (value == 'print') {
                              _showPrintPriceList();
                            }
                          },
                          itemBuilder: (context) => [
                            const PopupMenuItem(
                              value: 'new',
                              child: Row(
                                children: [
                                  Icon(Icons.add_box_outlined, size: 18),
                                  SizedBox(width: 8),
                                  Text('New Product'),
                                ],
                              ),
                            ),
                            PopupMenuItem(
                              value: 'bulk',
                              child: Row(
                                children: [
                                  Icon(
                                    _isSelectMode
                                        ? Icons.close
                                        : Icons.checklist,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    _isSelectMode
                                        ? 'Cancel Bulk Mode'
                                        : 'Select / Bulk',
                                  ),
                                ],
                              ),
                            ),
                            const PopupMenuItem(
                              value: 'import',
                              child: Row(
                                children: [
                                  Icon(Icons.file_upload_outlined, size: 18),
                                  SizedBox(width: 8),
                                  Text('Import'),
                                ],
                              ),
                            ),
                            const PopupMenuItem(
                              value: 'print',
                              child: Row(
                                children: [
                                  Icon(Icons.print_outlined, size: 18),
                                  SizedBox(width: 8),
                                  Text('Print Product List'),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Row(
                        children: [
                          _buildStockChip('All', 'all', countAll, isDark),
                          _buildStockChip('In stock', 'in', countInStock, isDark),
                          _buildStockChip('Low', 'low', countLow, isDark),
                          _buildStockChip('Zero', 'zero', countZero, isDark),
                          _buildStockChip(
                            'Negative',
                            'negative',
                            countNegative,
                            isDark,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    Expanded(
                      child: filteredProducts.isEmpty
                          ? Center(
                              child: Container(
                                margin: const EdgeInsets.all(16),
                                padding: const EdgeInsets.all(24),
                                width: double.infinity,
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? const Color(0xFF1E293B)
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(
                                    color: isDark
                                        ? Colors.white10
                                        : Colors.black.withValues(alpha: 0.04),
                                    width: 1,
                                  ),
                                ),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 72,
                                      height: 72,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: isDark
                                            ? const Color(0xFF334155)
                                            : const Color(0xFFF1F5F9),
                                      ),
                                      child: Icon(
                                        LucideIcons.package,
                                        size: 32,
                                        color: isDark
                                            ? Colors.grey[400]
                                            : const Color(0xFF64748B),
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    const Text(
                                      'No products yet',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Add your first product to get started.',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: isDark
                                            ? Colors.grey[400]
                                            : const Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                          : ListView.separated(
                              itemCount: filteredProducts.length,
                              physics: const BouncingScrollPhysics(),
                              separatorBuilder: (_, __) =>
                                  const SizedBox(height: 8),
                              itemBuilder: (context, index) {
                                final product = filteredProducts[index];
                                final isLow =
                                    product.stock <= product.minStock;
                                final isSelected = _selectedProductIds
                                    .contains(product.id);

                                return Card(
                                  elevation: 0,
                                  margin: EdgeInsets.zero,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                    side: BorderSide(
                                      color: isSelected
                                          ? (isDark
                                              ? const Color(0xFF10B981)
                                              : const Color(0xFF0F9D58))
                                          : (isDark
                                              ? Colors.white10
                                              : Colors.black.withValues(
                                                  alpha: 0.04)),
                                      width: isSelected ? 1.5 : 1,
                                    ),
                                  ),
                                  color: isDark
                                      ? const Color(0xFF1E293B)
                                      : Colors.white,
                                  child: InkWell(
                                     onTap: _isSelectMode
                                         ? () {
                                             setState(() {
                                               if (isSelected) {
                                                 _selectedProductIds
                                                     .remove(product.id);
                                               } else {
                                                 _selectedProductIds
                                                     .add(product.id);
                                               }
                                             });
                                           }
                                         : () => _showViewProductDialog(product),
                                     borderRadius: BorderRadius.circular(16),
                                     child: Padding(
                                       padding: const EdgeInsets.symmetric(
                                         horizontal: 14.0,
                                         vertical: 12.0,
                                       ),
                                       child: Row(
                                         children: [
                                           if (_isSelectMode) ...[
                                             Checkbox(
                                               activeColor:
                                                   const Color(0xFF0F9D58),
                                               value: isSelected,
                                               onChanged: (val) {
                                                 setState(() {
                                                   if (val == true) {
                                                     _selectedProductIds
                                                         .add(product.id);
                                                   } else {
                                                     _selectedProductIds
                                                         .remove(product.id);
                                                   }
                                                 });
                                               },
                                             ),
                                             const SizedBox(width: 8),
                                           ],
                                           CircleAvatar(
                                             radius: 20,
                                             backgroundColor: (isLow
                                                     ? Colors.orange
                                                     : const Color(0xFF0F9D58))
                                                 .withValues(alpha: 0.1),
                                             child: Icon(
                                               LucideIcons.package,
                                               color: isLow
                                                   ? Colors.orange
                                                   : const Color(0xFF0D9488),
                                               size: 18,
                                             ),
                                           ),
                                           const SizedBox(width: 12),
                                           Expanded(
                                             child: Column(
                                               crossAxisAlignment:
                                                   CrossAxisAlignment.start,
                                               children: [
                                                 Text(
                                                   product.name,
                                                   style: const TextStyle(
                                                     fontWeight:
                                                         FontWeight.bold,
                                                     fontSize: 14,
                                                   ),
                                                   maxLines: 2,
                                                   overflow:
                                                       TextOverflow.ellipsis,
                                                 ),
                                                 const SizedBox(height: 4),
                                                 Text(
                                                   'SKU: ${product.itemCode ?? 'N/A'}  •  Barcode: ${product.barcode ?? 'N/A'}',
                                                   style: const TextStyle(
                                                     fontSize: 10,
                                                     color: Colors.grey,
                                                   ),
                                                 ),
                                                 const SizedBox(height: 2),
                                                 Text(
                                                   'Price: ${product.price.toStringAsFixed(2)} SAR  •  Cost: ${product.purchasePrice.toStringAsFixed(2)} SAR',
                                                   style: TextStyle(
                                                     fontSize: 11,
                                                     fontWeight: FontWeight.w500,
                                                     color: isDark
                                                         ? Colors.grey[300]
                                                         : const Color(
                                                             0xFF475569),
                                                   ),
                                                 ),
                                               ],
                                             ),
                                           ),
                                           const SizedBox(width: 8),
                                           Column(
                                             crossAxisAlignment:
                                                 CrossAxisAlignment.end,
                                             children: [
                                               Row(
                                                 children: [
                                                   if (isLow) ...[
                                                     const Icon(
                                                       LucideIcons.alertTriangle,
                                                       color: Colors.orange,
                                                       size: 12,
                                                     ),
                                                     const SizedBox(width: 4),
                                                   ],
                                                   Text(
                                                     'Stock: ${product.stock.toInt()}',
                                                     style: TextStyle(
                                                       fontWeight:
                                                           FontWeight.bold,
                                                       fontSize: 13,
                                                       color: isLow
                                                           ? Colors.orange
                                                           : Colors.green,
                                                     ),
                                                   ),
                                                 ],
                                               ),
                                               const SizedBox(height: 6),
                                               if (!_isSelectMode)
                                                 Row(
                                                   mainAxisSize: MainAxisSize.min,
                                                   children: [
                                                     InkWell(
                                                       onTap: () => _showViewProductDialog(product),
                                                       borderRadius: BorderRadius.circular(12),
                                                       child: Container(
                                                         padding: const EdgeInsets.all(6),
                                                         decoration: BoxDecoration(
                                                           color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                                           borderRadius: BorderRadius.circular(12),
                                                         ),
                                                         child: Icon(LucideIcons.eye, size: 14, color: isDark ? Colors.white : const Color(0xFF475569)),
                                                       ),
                                                     ),
                                                     const SizedBox(width: 4),
                                                     InkWell(
                                                       onTap: () => _showEditProductDialog(product),
                                                       borderRadius: BorderRadius.circular(12),
                                                       child: Container(
                                                         padding: const EdgeInsets.all(6),
                                                         decoration: BoxDecoration(
                                                           color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                                           borderRadius: BorderRadius.circular(12),
                                                         ),
                                                         child: Icon(LucideIcons.pencil, size: 14, color: isDark ? Colors.white : const Color(0xFF475569)),
                                                       ),
                                                     ),
                                                     const SizedBox(width: 4),
                                                     InkWell(
                                                       onTap: () => _showAdjustStockDialog(product),
                                                       borderRadius: BorderRadius.circular(12),
                                                       child: Container(
                                                         padding: const EdgeInsets.all(6),
                                                         decoration: BoxDecoration(
                                                           color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                                           borderRadius: BorderRadius.circular(12),
                                                         ),
                                                         child: Icon(LucideIcons.sliders, size: 14, color: isDark ? Colors.white : const Color(0xFF475569)),
                                                       ),
                                                     ),
                                                     const SizedBox(width: 4),
                                                     InkWell(
                                                       onTap: () => _showSingleDeleteConfirmDialog(product),
                                                       borderRadius: BorderRadius.circular(12),
                                                       child: Container(
                                                         padding: const EdgeInsets.all(6),
                                                         decoration: BoxDecoration(
                                                           color: Colors.red.withValues(alpha: 0.1),
                                                           borderRadius: BorderRadius.circular(12),
                                                         ),
                                                         child: const Icon(LucideIcons.trash2, size: 14, color: Colors.red),
                                                       ),
                                                     ),
                                                   ],
                                                 ),
                                             ],
                                           ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
              ),
              bottomNavigationBar:
                  (_isSelectMode && _selectedProductIds.isNotEmpty)
                      ? Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: isDark
                                ? const Color(0xFF1E293B)
                                : Colors.white,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.05),
                                blurRadius: 10,
                                offset: const Offset(0, -4),
                              ),
                            ],
                            border: Border(
                              top: BorderSide(
                                color: isDark
                                    ? Colors.white10
                                    : Colors.black.withValues(alpha: 0.04),
                              ),
                            ),
                          ),
                          child: SafeArea(
                            child: Row(
                              children: [
                                Text(
                                  '${_selectedProductIds.length} Selected',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const Spacer(),
                                ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 8,
                                    ),
                                  ),
                                  onPressed: _showBulkAdjustStockDialog,
                                  icon: const Icon(Icons.edit_note, size: 16),
                                  label: const Text(
                                    'Bulk Adjust',
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 8,
                                    ),
                                  ),
                                  onPressed: _showBulkDeleteConfirmDialog,
                                  icon: const Icon(
                                    Icons.delete_outline,
                                    size: 16,
                                  ),
                                  label: const Text(
                                    'Delete',
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )
                      : null,
            );
          },
        );
      },
    );
  }
}
