import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';

import '../../blocs/price_compare/price_compare_cubit.dart';
import '../../core/theme/app_colors.dart';

class PriceCompareScreen extends StatefulWidget {
  const PriceCompareScreen({super.key});

  @override
  State<PriceCompareScreen> createState() => _PriceCompareScreenState();
}

class _PriceCompareScreenState extends State<PriceCompareScreen> {
  final TextEditingController _searchController = TextEditingController();
  final _productFormKey = GlobalKey<FormState>();
  final _recordFormKey = GlobalKey<FormState>();
  
  // New Product Controllers
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _barcodeController = TextEditingController();
  final TextEditingController _brandController = TextEditingController();
  final TextEditingController _salePriceController = TextEditingController();

  // New Record Controllers
  final TextEditingController _supplierController = TextEditingController();
  final TextEditingController _purchasePriceController = TextEditingController();
  final TextEditingController _recordNoteController = TextEditingController();
  DateTime _recordDate = DateTime.now();

  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    context.read<PriceCompareCubit>().loadProducts();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    _barcodeController.dispose();
    _brandController.dispose();
    _salePriceController.dispose();
    _supplierController.dispose();
    _purchasePriceController.dispose();
    _recordNoteController.dispose();
    super.dispose();
  }

  void _showAddProductDialog(BuildContext context) {
    _nameController.clear();
    _barcodeController.clear();
    _brandController.clear();
    _salePriceController.clear();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add Tracked Product'),
        content: Form(
          key: _productFormKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(labelText: 'Product Name'),
                  validator: (val) => val == null || val.isEmpty ? 'Enter name' : null,
                ),
                TextFormField(
                  controller: _brandController,
                  decoration: const InputDecoration(labelText: 'Brand / Maker'),
                ),
                TextFormField(
                  controller: _barcodeController,
                  decoration: const InputDecoration(labelText: 'Barcode'),
                ),
                TextFormField(
                  controller: _salePriceController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    labelText: 'Selling Price *',
                    prefixText: 'SAR ',
                  ),
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) return 'Enter selling price';
                    if (double.tryParse(val.trim()) == null) return 'Enter a valid number';
                    return null;
                  },
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              if (_productFormKey.currentState!.validate()) {
                final price = double.tryParse(_salePriceController.text) ?? 0.0;
                context.read<PriceCompareCubit>().addProduct(
                      _nameController.text,
                      _barcodeController.text.isEmpty ? null : _barcodeController.text,
                      _brandController.text.isEmpty ? null : _brandController.text,
                      price,
                    );
                Navigator.pop(ctx);
              }
            },
            child: const Text('Add Product'),
          ),
        ],
      ),
    );
  }

  void _showAddRecordDialog(BuildContext context) {
    _supplierController.clear();
    _purchasePriceController.clear();
    _recordNoteController.clear();
    _recordDate = DateTime.now();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add Purchase Record'),
        content: StatefulBuilder(
          builder: (ctx, setState) {
            return Form(
              key: _recordFormKey,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextFormField(
                      controller: _supplierController,
                      decoration: const InputDecoration(labelText: 'Supplier Name'),
                      validator: (val) => val == null || val.isEmpty ? 'Enter supplier' : null,
                    ),
                    TextFormField(
                      controller: _purchasePriceController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      decoration: const InputDecoration(
                        labelText: 'Purchase Price',
                        prefixText: 'SAR ',
                      ),
                      validator: (val) {
                        if (val == null || val.isEmpty) return 'Enter price';
                        if (double.tryParse(val) == null) return 'Enter a valid number';
                        return null;
                      },
                    ),
                    TextFormField(
                      controller: _recordNoteController,
                      decoration: const InputDecoration(labelText: 'Notes / Variation detail'),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Purchase Date: ${DateFormat('yyyy-MM-dd').format(_recordDate)}'),
                        TextButton(
                          onPressed: () async {
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: _recordDate,
                              firstDate: DateTime(2020),
                              lastDate: DateTime(2030),
                            );
                            if (picked != null) {
                              setState(() => _recordDate = picked);
                            }
                          },
                          child: const Text('Change'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              if (_recordFormKey.currentState!.validate()) {
                final price = double.parse(_purchasePriceController.text);
                context.read<PriceCompareCubit>().addRecord(
                      _supplierController.text,
                      price,
                      _recordDate,
                      _recordNoteController.text.isEmpty ? null : _recordNoteController.text,
                    );
                Navigator.pop(ctx);
              }
            },
            child: const Text('Add Record'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sarFormatter = NumberFormat.currency(symbol: 'SAR');

    return BlocBuilder<PriceCompareCubit, PriceCompareState>(
      builder: (context, state) {
        if (state.loading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final selected = state.selectedProduct;

        return Scaffold(
          body: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            if (selected != null)
                              IconButton(
                                icon: const Icon(LucideIcons.arrowLeft),
                                onPressed: () {
                                  context.read<PriceCompareCubit>().selectProduct(null);
                                },
                              ),
                            const Text(
                              'Price Compare',
                              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, letterSpacing: -0.5),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          selected == null
                              ? 'Track and trace product cost logs across market suppliers.'
                              : 'Cost breakdown variance for ${selected.name}',
                          style: TextStyle(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[600]),
                        ),
                      ],
                    ),
                    if (selected == null)
                      ElevatedButton.icon(
                        onPressed: () => _showAddProductDialog(context),
                        icon: const Icon(LucideIcons.plus, size: 16),
                        label: const Text('Track Product'),
                      )
                    else
                      Row(
                        children: [
                          ElevatedButton.icon(
                            onPressed: () => _showAddRecordDialog(context),
                            icon: const Icon(LucideIcons.plus, size: 16),
                            label: const Text('Add cost record'),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(LucideIcons.trash2, color: Colors.red),
                            onPressed: () {
                              showDialog(
                                context: context,
                                builder: (ctx) => AlertDialog(
                                  title: const Text('Stop Tracking Product?'),
                                  content: const Text('Are you sure you want to delete this tracked product and all associated cost records?'),
                                  actions: [
                                    TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                                    TextButton(
                                      onPressed: () {
                                        context.read<PriceCompareCubit>().deleteProduct();
                                        Navigator.pop(ctx);
                                      },
                                      child: const Text('Delete', style: TextStyle(color: Colors.red)),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                  ],
                ),
                const SizedBox(height: 20),

                // Main Content
                if (selected == null) ...[
                  // fuzzy search
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _searchController,
                          decoration: const InputDecoration(
                            hintText: 'Search products by name, brand, or barcode...',
                            prefixIcon: Icon(LucideIcons.search, size: 18),
                          ),
                          onChanged: (val) {
                            setState(() {
                              _searchQuery = val.trim().toLowerCase();
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      IconButton(
                        icon: const Icon(LucideIcons.scanLine),
                        onPressed: () async {
                          // Mock barcode scanner trigger
                          final code = await showDialog<String>(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              title: const Text('Simulate Barcode Scan'),
                              content: const Text('Input a simulated barcode to lookup tracked items (e.g. 6281001122).'),
                              actions: [
                                TextFormField(
                                  autofocus: true,
                                  onFieldSubmitted: (val) => Navigator.pop(ctx, val),
                                ),
                              ],
                            ),
                          );
                          if (code != null && code.isNotEmpty && context.mounted) {
                            context.read<PriceCompareCubit>().scanBarcode(code);
                          }
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Products List
                  Expanded(
                    child: Builder(
                      builder: (context) {
                        final filtered = state.products.where((p) {
                          if (_searchQuery.isEmpty) return true;
                          return p.name.toLowerCase().contains(_searchQuery) ||
                              (p.brand != null && p.brand!.toLowerCase().contains(_searchQuery)) ||
                              (p.barcode != null && p.barcode!.contains(_searchQuery));
                        }).toList();

                        if (filtered.isEmpty) {
                          return const Center(child: Text('No tracked products found.', style: TextStyle(color: Colors.grey)));
                        }

                        return ListView.separated(
                          itemCount: filtered.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            final p = filtered[index];
                            return ListTile(
                              leading: CircleAvatar(
                                backgroundColor: AppColors.primary.withOpacity(0.1),
                                child: const Icon(LucideIcons.package, color: AppColors.primary),
                              ),
                              title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text('${p.brand ?? 'No Brand'} · ${p.barcode ?? 'No Barcode'}'),
                              trailing: const Icon(LucideIcons.chevronRight),
                              onTap: () {
                                context.read<PriceCompareCubit>().selectProduct(p);
                              },
                            );
                          },
                        );
                      },
                    ),
                  ),
                ] else ...[
                  // Details Header statistics
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.cardDark : Colors.white,
                      border: Border.all(color: isDark ? Colors.grey[850]! : Colors.grey[200]!),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              selected.brand ?? 'No Brand Specified',
                              style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold),
                            ),
                            if (state.deltaPercentage != 0.0)
                              Row(
                                children: [
                                  Icon(
                                    state.deltaPercentage < 0 ? LucideIcons.arrowDown : LucideIcons.arrowUp,
                                    size: 14,
                                    color: state.deltaPercentage < 0 ? Colors.green : Colors.red,
                                  ),
                                  Text(
                                    '${state.deltaPercentage.toStringAsFixed(1)}% vs last purchase',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: state.deltaPercentage < 0 ? Colors.green : Colors.red,
                                    ),
                                  ),
                                ],
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          selected.name,
                          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        GridView.count(
                          crossAxisCount: 4,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisSpacing: 10,
                          childAspectRatio: 1.5,
                          children: [
                            _buildMiniPill('Latest', sarFormatter.format(state.latestPrice), Colors.blue),
                            _buildMiniPill('Lowest', sarFormatter.format(state.lowestPrice), Colors.green),
                            _buildMiniPill('Highest', sarFormatter.format(state.highestPrice), Colors.red),
                            _buildMiniPill('Average', sarFormatter.format(state.averagePrice), Colors.amber),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Filter Presets & Supplier drop down
                  Row(
                    children: [
                      DropdownButton<String>(
                        value: state.filterPreset,
                        items: ['all', 'today', 'week', 'month'].map((p) {
                          return DropdownMenuItem(
                            value: p,
                            child: Text(p == 'all' ? 'All dates' : (p == 'today' ? 'Today' : (p == 'week' ? 'This Week' : 'This Month'))),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) {
                            context.read<PriceCompareCubit>().changeFilters(preset: val);
                          }
                        },
                      ),
                      const SizedBox(width: 16),
                      if (state.suppliers.isNotEmpty)
                        DropdownButton<String>(
                          value: state.filterSupplier ?? 'all',
                          items: [
                            const DropdownMenuItem(value: 'all', child: Text('All Suppliers')),
                            ...state.suppliers.map((s) => DropdownMenuItem(value: s, child: Text(s))),
                          ],
                          onChanged: (val) {
                            if (val != null) {
                              context.read<PriceCompareCubit>().changeFilters(supplier: val);
                            }
                          },
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Historical Ledger Table
                  Expanded(
                    child: state.filteredRecords.isEmpty
                        ? const Center(child: Text('No comparison purchase records found.', style: TextStyle(color: Colors.grey)))
                        : ListView.separated(
                            itemCount: state.filteredRecords.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 10),
                            itemBuilder: (context, index) {
                              final r = state.filteredRecords[index];
                              
                              // Calculate local delta
                              double localDelta = 0.0;
                              if (index < state.filteredRecords.length - 1) {
                                final prevPrice = state.filteredRecords[index + 1].purchasePrice;
                                if (prevPrice > 0) {
                                  localDelta = ((r.purchasePrice - prevPrice) / prevPrice) * 100;
                                }
                              }

                              return Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.cardDark : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: isDark ? Colors.grey[850]! : Colors.grey[200]!),
                                ),
                                child: Row(
                                  children: [
                                    CircleAvatar(
                                      backgroundColor: Colors.indigo.withOpacity(0.1),
                                      child: const Icon(LucideIcons.shoppingBag, color: Colors.indigo),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            r.supplier,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            '${DateFormat('yyyy-MM-dd').format(r.recordDate)} ${r.note != null ? '· ${r.note}' : ''}',
                                            style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ],
                                      ),
                                    ),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.end,
                                      children: [
                                        Text(
                                          sarFormatter.format(r.purchasePrice),
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                        ),
                                        if (localDelta != 0.0)
                                          Row(
                                            children: [
                                              Icon(
                                                localDelta < 0 ? LucideIcons.arrowDown : LucideIcons.arrowUp,
                                                size: 10,
                                                color: localDelta < 0 ? Colors.green : Colors.red,
                                              ),
                                              Text(
                                                '${localDelta.toStringAsFixed(1)}%',
                                                style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.bold,
                                                  color: localDelta < 0 ? Colors.green : Colors.red,
                                                ),
                                              ),
                                            ],
                                          ),
                                      ],
                                    ),
                                    const SizedBox(width: 8),
                                    IconButton(
                                      icon: const Icon(LucideIcons.trash2, color: Colors.red, size: 18),
                                      onPressed: () {
                                        showDialog(
                                          context: context,
                                          builder: (ctx) => AlertDialog(
                                            title: const Text('Delete Cost Record?'),
                                            content: const Text('Are you sure you want to delete this historical purchase entry?'),
                                            actions: [
                                              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                                              TextButton(
                                                onPressed: () {
                                                  context.read<PriceCompareCubit>().deleteRecord(r.id);
                                                  Navigator.pop(ctx);
                                                },
                                                child: const Text('Delete', style: TextStyle(color: Colors.red)),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMiniPill(String label, String val, Color color) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: TextStyle(fontSize: 10, color: color.withOpacity(0.8), fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(
            val,
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
