import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'components/add_product_bottom_sheet.dart';
import 'components/price_compare_empty_state.dart';
import 'components/price_compare_header.dart';
import 'components/price_compare_product_card.dart';
import 'models/price_compare_models.dart';

class PriceCompareScreen extends StatefulWidget {
  const PriceCompareScreen({super.key});

  @override
  State<PriceCompareScreen> createState() => _PriceCompareScreenState();
}

class _PriceCompareScreenState extends State<PriceCompareScreen> {
  final TextEditingController _searchController = TextEditingController();
  final List<PriceCompareProduct> _products = [];
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _openAddProduct() {
    AddProductBottomSheet.show(
      context,
      onSave: (newProduct) {
        setState(() {
          _products.add(newProduct);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Product "${newProduct.name}" added successfully!'),
            backgroundColor: const Color(0xFF23B386),
          ),
        );
      },
    );
  }

  void _scanBarcode() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening Barcode Scanner...'),
        backgroundColor: Color(0xFF0F172A),
      ),
    );
  }

  List<PriceCompareProduct> get _filteredProducts {
    if (_searchQuery.isEmpty) return _products;
    final query = _searchQuery.toLowerCase();
    return _products.where((p) {
      return p.name.toLowerCase().contains(query) || p.barcode.toLowerCase().contains(query);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredProducts;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Price Compare',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        actions: [
          IconButton(
            onPressed: _scanBarcode,
            icon: const Icon(LucideIcons.scan, size: 20, color: Color(0xFF1E293B)),
            splashRadius: 22,
          ),
          IconButton(
            onPressed: () {
              // Quick action to add sample product or clear
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.white,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                ),
                builder: (ctx) => SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        ListTile(
                          leading: const Icon(LucideIcons.plusCircle, color: Color(0xFF23B386)),
                          title: const Text('Load Demo Compared Product'),
                          onTap: () {
                            Navigator.pop(ctx);
                            setState(() {
                              _products.add(
                                PriceCompareProduct(
                                  id: 'demo_${DateTime.now().millisecondsSinceEpoch}',
                                  name: '15No Shopping Kees Rabea 2Kg',
                                  barcode: '6281001234567',
                                  salePrice: 22.00,
                                  purchases: [
                                    CompanyPurchaseItem(
                                      id: 'comp_1',
                                      companyName: 'Al-Rabea Wholesale Co.',
                                      purchasePrice: 17.50,
                                      memoDate: DateTime.now().subtract(const Duration(days: 3)),
                                    ),
                                    CompanyPurchaseItem(
                                      id: 'comp_2',
                                      companyName: 'Azzouz Trading Est.',
                                      purchasePrice: 18.00,
                                      memoDate: DateTime.now().subtract(const Duration(days: 1)),
                                    ),
                                    CompanyPurchaseItem(
                                      id: 'comp_3',
                                      companyName: 'Makkah Modern Supply',
                                      purchasePrice: 19.20,
                                      memoDate: DateTime.now().subtract(const Duration(days: 7)),
                                    ),
                                  ],
                                ),
                              );
                            });
                          },
                        ),
                        if (_products.isNotEmpty)
                          ListTile(
                            leading: const Icon(LucideIcons.trash2, color: Colors.red),
                            title: const Text('Clear All Products'),
                            onTap: () {
                              Navigator.pop(ctx);
                              setState(() {
                                _products.clear();
                              });
                            },
                          ),
                      ],
                    ),
                  ),
                ),
              );
            },
            icon: const Icon(LucideIcons.moreVertical, size: 20, color: Color(0xFF1E293B)),
            splashRadius: 22,
          ),
          const SizedBox(width: 6),
        ],
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: Color(0xFFE2E8F0)),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Hero Card (PRICE COMPARE)
            PriceCompareHeader(
              searchController: _searchController,
              onSearchChanged: (val) {
                setState(() {
                  _searchQuery = val.trim();
                });
              },
              onScanBarcode: _scanBarcode,
              onAddProduct: _openAddProduct,
            ),
            const SizedBox(height: 24),

            // "All Products" Section Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'All Products',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                Text(
                  '${filtered.length} ${filtered.length == 1 ? "item" : "items"}',
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Empty State or Products List
            if (filtered.isEmpty)
              PriceCompareEmptyState(
                onAddProduct: _openAddProduct,
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: filtered.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final product = filtered[index];
                  return PriceCompareProductCard(
                    product: product,
                    onEdit: () {},
                    onDelete: () {
                      setState(() {
                        _products.removeWhere((p) => p.id == product.id);
                      });
                    },
                  );
                },
              ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
