import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';

import '../../blocs/wholesale/wholesale_cubit.dart';
import '../../models/wholesale_models.dart';
import '../../models/product_model.dart';
import '../../repositories/product_repository.dart';
import '../../core/theme/app_colors.dart';

class WholesaleTransactionDialog extends StatefulWidget {
  final String kind; // 'sale' or 'purchase'
  final WholesaleOrderModel? initialOrder;

  const WholesaleTransactionDialog({
    super.key,
    required this.kind,
    this.initialOrder,
  });

  @override
  State<WholesaleTransactionDialog> createState() => _WholesaleTransactionDialogState();
}

class _WholesaleTransactionDialogState extends State<WholesaleTransactionDialog> {
  final _formKey = GlobalKey<FormState>();
  int _activeStep = 0;

  String? _customerId;
  String _customerName = 'Walk-in Customer';
  String _customerMobile = '';
  String _supplierName = '';

  List<WholesaleSaleItemModel> _items = [];
  double _discount = 0.0;
  double _amountPaid = 0.0;
  String _paymentMethod = 'cash'; // 'cash', 'pos', 'bank', 'due', 'mixed'

  final _searchController = TextEditingController();
  final _discountController = TextEditingController(text: '0.0');
  final _paidController = TextEditingController(text: '0.0');
  final _barcodeController = TextEditingController();

  // Cached controllers for cart items to prevent focus loss during rebuilds
  final Map<String, TextEditingController> _priceControllers = {};
  final Map<String, TextEditingController> _qtyControllers = {};

  List<ProductModel> _allProducts = [];
  List<ProductModel> _filteredProducts = [];
  List<WholesaleCustomerModel> _customers = [];

  @override
  void initState() {
    super.initState();
    final state = context.read<WholesaleCubit>().state;
    _allProducts = state.products;
    _filteredProducts = _allProducts;
    _customers = state.customers;

    if (widget.initialOrder != null) {
      final order = widget.initialOrder!;
      _customerName = order.customerName;
      _customerMobile = order.customerMobile;
      _items = List.from(order.items);
      _paidController.text = '0.0';
      _amountPaid = 0.0;
      _paymentMethod = 'due';

      // Check if customer already exists
      try {
        final existing = _customers.firstWhere(
          (c) => c.mobile == order.customerMobile || c.name.toLowerCase() == order.customerName.toLowerCase(),
        );
        _customerId = existing.id;
      } catch (_) {}

      // Prepopulate controllers
      for (final item in _items) {
        _priceControllers[item.productId] = TextEditingController(text: item.price.toString());
        _qtyControllers[item.productId] = TextEditingController(text: item.qty.toString());
      }
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    _discountController.dispose();
    _paidController.dispose();
    _barcodeController.dispose();
    for (final c in _priceControllers.values) {
      c.dispose();
    }
    for (final c in _qtyControllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  double get _subtotal {
    return _items.fold(0.0, (sum, item) => sum + (item.qty * item.price));
  }

  double get _total {
    return (_subtotal - _discount).clamp(0.0, double.infinity);
  }

  double get _dueAmount {
    if (_paymentMethod == 'due') {
      return _total;
    } else if (_paymentMethod == 'cash' || _paymentMethod == 'pos' || _paymentMethod == 'bank') {
      return 0.0;
    } else {
      // Mixed
      return (_total - _amountPaid).clamp(0.0, double.infinity);
    }
  }

  void _filterProducts(String query) {
    setState(() {
      if (query.trim().isEmpty) {
        _filteredProducts = _allProducts;
      } else {
        final q = query.toLowerCase();
        _filteredProducts = _allProducts.where((p) {
          return p.name.toLowerCase().contains(q) ||
              (p.nameAr?.toLowerCase().contains(q) ?? false) ||
              (p.nameBn?.toLowerCase().contains(q) ?? false) ||
              (p.itemCode?.toLowerCase().contains(q) ?? false) ||
              (p.barcode?.toLowerCase().contains(q) ?? false);
        }).toList();
      }
    });
  }

  void _scanOrSearchBarcode() async {
    final code = _barcodeController.text.trim();
    if (code.isEmpty) return;

    ProductModel? matched;
    try {
      matched = _allProducts.firstWhere((p) => p.barcode == code || p.itemCode == code);
    } catch (_) {
      // Tolerant numeric matching
      if (RegExp(r'^\d+$').hasMatch(code)) {
        try {
          matched = _allProducts.firstWhere((p) {
            final cleanB = p.barcode?.replaceAll(RegExp(r'\D'), '') ?? '';
            final cleanI = p.itemCode?.replaceAll(RegExp(r'\D'), '') ?? '';
            return cleanB == code || cleanI == code;
          });
        } catch (_) {}
      }
    }

    if (matched != null) {
      _addItem(matched);
      _barcodeController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Added ${matched.name} to checkout'),
          duration: const Duration(seconds: 1),
          backgroundColor: AppColors.primary,
        ),
      );
    } else {
      // Product not found -> show quick add dialog
      _showQuickAddDialog(code);
    }
  }

  void _addItem(ProductModel product) {
    setState(() {
      final index = _items.indexWhere((item) => item.productId == product.id);
      final itemPrice = widget.kind == 'sale' ? product.price : product.purchasePrice;
      
      if (index >= 0) {
        final currentItem = _items[index];
        final newQty = currentItem.qty + 1.0;
        _items[index] = WholesaleSaleItemModel(
          productId: product.id,
          name: product.name,
          qty: newQty,
          price: currentItem.price, // Keep currently edited price
          purchasePrice: product.purchasePrice,
        );
        _qtyControllers[product.id]?.text = newQty.toString();
      } else {
        _items.add(WholesaleSaleItemModel(
          productId: product.id,
          name: product.name,
          qty: 1.0,
          price: itemPrice,
          purchasePrice: product.purchasePrice,
        ));
        _priceControllers[product.id] = TextEditingController(text: itemPrice.toString());
        _qtyControllers[product.id] = TextEditingController(text: '1.0');
      }
    });
  }

  void _updateQty(int index, double delta) {
    setState(() {
      final current = _items[index];
      final newQty = current.qty + delta;
      if (newQty <= 0.0) {
        _removeItem(index);
      } else {
        _items[index] = WholesaleSaleItemModel(
          productId: current.productId,
          name: current.name,
          qty: newQty,
          price: current.price,
          purchasePrice: current.purchasePrice,
        );
        _qtyControllers[current.productId]?.text = newQty.toString();
      }
    });
  }

  void _updateQtyDirectly(int index, double newQty) {
    setState(() {
      final current = _items[index];
      _items[index] = WholesaleSaleItemModel(
        productId: current.productId,
        name: current.name,
        qty: newQty.clamp(0.0, double.infinity),
        price: current.price,
        purchasePrice: current.purchasePrice,
      );
    });
  }

  void _updatePrice(int index, double newPrice) {
    setState(() {
      final current = _items[index];
      _items[index] = WholesaleSaleItemModel(
        productId: current.productId,
        name: current.name,
        qty: current.qty,
        price: newPrice,
        purchasePrice: current.purchasePrice,
      );
    });
  }

  void _removeItem(int index) {
    setState(() {
      final item = _items[index];
      _items.removeAt(index);
      _priceControllers[item.productId]?.dispose();
      _qtyControllers[item.productId]?.dispose();
      _priceControllers.remove(item.productId);
      _qtyControllers.remove(item.productId);
    });
  }

  void _showQuickAddDialog(String code) {
    final titleController = TextEditingController();
    final priceController = TextEditingController();
    final costController = TextEditingController();
    final stockController = TextEditingController(text: '10.0');

    showDialog(
      context: context,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          backgroundColor: isDark ? AppColors.cardDark : AppColors.cardLight,
          title: Text(
            code.isEmpty ? 'Quick Add New Product' : 'Product Not Found: $code',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (code.isNotEmpty) ...[
                  Text(
                    'No item in database matches barcode "$code". Enter details below to quick-create this product.',
                    style: const TextStyle(fontSize: 9.5, color: Colors.grey),
                  ),
                  const SizedBox(height: 12),
                ],
                TextField(
                  controller: titleController,
                  style: const TextStyle(fontSize: 12),
                  decoration: InputDecoration(
                    labelText: 'Product Name',
                    labelStyle: const TextStyle(fontSize: 11),
                    hintText: 'e.g. Almarai Milk 1L',
                    hintStyle: const TextStyle(fontSize: 10, color: Colors.grey),
                    prefixIcon: const Icon(LucideIcons.package, size: 14),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: priceController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(fontSize: 12),
                        decoration: InputDecoration(
                          labelText: 'Sale Price',
                          labelStyle: const TextStyle(fontSize: 11),
                          hintText: 'SAR',
                          hintStyle: const TextStyle(fontSize: 10, color: Colors.grey),
                          prefixIcon: const Icon(LucideIcons.tag, size: 13),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          isDense: true,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: costController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(fontSize: 12),
                        decoration: InputDecoration(
                          labelText: 'Purchase Cost',
                          labelStyle: const TextStyle(fontSize: 11),
                          hintText: 'SAR',
                          hintStyle: const TextStyle(fontSize: 10, color: Colors.grey),
                          prefixIcon: const Icon(LucideIcons.coins, size: 13),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          isDense: true,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: stockController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  style: const TextStyle(fontSize: 12),
                  decoration: InputDecoration(
                    labelText: 'Initial Warehouse Stock',
                    labelStyle: const TextStyle(fontSize: 11),
                    hintText: 'e.g. 50.0',
                    hintStyle: const TextStyle(fontSize: 10, color: Colors.grey),
                    prefixIcon: const Icon(LucideIcons.database, size: 14),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () async {
                final name = titleController.text.trim();
                final price = double.tryParse(priceController.text) ?? 0.0;
                final cost = double.tryParse(costController.text) ?? 0.0;
                final stock = double.tryParse(stockController.text) ?? 0.0;

                if (name.isNotEmpty) {
                  final newProd = ProductModel(
                    id: const Uuid().v4(),
                    name: name,
                    barcode: code.isEmpty ? const Uuid().v4().substring(0, 8) : code,
                    itemCode: code.isEmpty ? const Uuid().v4().substring(0, 8) : code,
                    price: price,
                    purchasePrice: cost,
                    stock: stock,
                    createdAt: DateTime.now(),
                  );
                  await context.read<ProductRepository>().saveProduct(newProd);
                  context.read<WholesaleCubit>().loadAllData();

                  setState(() {
                    _allProducts.add(newProd);
                    _filterProducts('');
                    _addItem(newProd);
                  });

                  Navigator.pop(context);
                  _barcodeController.clear();
                }
              },
              child: const Text('Save & Add'),
            ),
          ],
        );
      },
    );
  }

  void _submit() {
    if (_items.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please add at least one item to checkout.'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    if (widget.kind == 'sale') {
      // Check low stock validation
      final lowStockItems = <String>[];
      for (final item in _items) {
        final prod = _allProducts.cast<ProductModel?>().firstWhere(
              (p) => p != null && p.id == item.productId,
              orElse: () => null,
            );
        if (prod != null && prod.stock < item.qty) {
          lowStockItems.add('${prod.name} (Available: ${prod.stock.toInt()}, Cart: ${item.qty.toInt()})');
        }
      }

      if (lowStockItems.isNotEmpty) {
        showDialog(
          context: context,
          builder: (context) {
            final isDark = Theme.of(context).brightness == Brightness.dark;
            return AlertDialog(
              backgroundColor: isDark ? AppColors.cardDark : AppColors.cardLight,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: Row(
                children: [
                  Icon(LucideIcons.alertTriangle, color: Colors.orange.shade600),
                  const SizedBox(width: 8),
                  const Text('Low Stock Warning', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('The following products do not have enough stock in the warehouse:'),
                  const SizedBox(height: 10),
                  ...lowStockItems.map((text) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 3.0),
                        child: Text('• $text', style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 12)),
                      )),
                  const SizedBox(height: 12),
                  const Text('Do you still want to force this wholesale sale?'),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                  onPressed: () {
                    Navigator.pop(context); // Close warning dialog
                    _executeSale();
                  },
                  child: const Text('Force Sale'),
                ),
              ],
            );
          },
        );
      } else {
        _executeSale();
      }
    } else {
      _executePurchase();
    }
  }

  void _executeSale() {
    if (widget.initialOrder != null) {
      context.read<WholesaleCubit>().convertOrderToSale(
            order: widget.initialOrder!,
            paymentMethod: _paymentMethod,
            discount: _discount,
            dueAmount: _dueAmount,
          );
    } else {
      context.read<WholesaleCubit>().createSale(
            customerId: _customerId,
            customerName: _customerName,
            customerMobile: _customerMobile,
            items: _items,
            total: _total,
            discount: _discount,
            dueAmount: _dueAmount,
            paymentMethod: _paymentMethod,
          );
    }
    Navigator.pop(context);
  }

  void _executePurchase() {
    context.read<WholesaleCubit>().createPurchase(
          supplierName: _supplierName.isEmpty ? 'General Supplier' : _supplierName,
          items: _items,
          total: _total,
          notes: 'Purchase order checkout',
        );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Dialog(
      insetPadding: const EdgeInsets.all(12),
      backgroundColor: isDark ? AppColors.bgDark : AppColors.bgLight,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isMobile = constraints.maxWidth < 850;

          // Catalog Pane Widget (Left)
          Widget buildCatalogPane() {
            int gridCols = 3;
            double aspect = 2.0;
            if (constraints.maxWidth < 450) {
              gridCols = 1;
              aspect = 4.2;
            } else if (constraints.maxWidth < 650) {
              gridCols = 2;
              aspect = 2.0;
            } else if (constraints.maxWidth < 850) {
              gridCols = 2;
              aspect = 2.2;
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Row
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        widget.kind == 'sale' ? 'Wholesale Catalog' : 'Replenish Inventory',
                        style: TextStyle(
                          fontSize: 16, 
                          fontWeight: FontWeight.bold, 
                          color: isDark ? Colors.white : Colors.black87,
                          letterSpacing: -0.4,
                        ),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () => _showQuickAddDialog(''),
                      icon: const Icon(LucideIcons.plus, size: 14),
                      label: const Text('Add Product', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      style: TextButton.styleFrom(
                        foregroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                    ),
                    if (isMobile) ...[
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(LucideIcons.x, size: 18),
                        onPressed: () => Navigator.pop(context),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 10),

                // Search and Barcode
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _searchController,
                        style: const TextStyle(fontSize: 12),
                        decoration: InputDecoration(
                          hintText: 'Search products...',
                          prefixIcon: const Icon(LucideIcons.search, size: 14),
                          contentPadding: const EdgeInsets.symmetric(vertical: 8),
                          filled: true,
                          fillColor: isDark ? Colors.white.withOpacity(0.04) : Colors.black.withOpacity(0.03),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        onChanged: _filterProducts,
                      ),
                    ),
                    const SizedBox(width: 8),
                    SizedBox(
                      width: isMobile ? 110 : 150,
                      child: TextField(
                        controller: _barcodeController,
                        style: const TextStyle(fontSize: 12),
                        decoration: InputDecoration(
                          hintText: 'Scan / Code',
                          prefixIcon: const Icon(LucideIcons.scanLine, size: 14),
                          contentPadding: const EdgeInsets.symmetric(vertical: 8),
                          filled: true,
                          fillColor: isDark ? Colors.white.withOpacity(0.04) : Colors.black.withOpacity(0.03),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        onSubmitted: (_) => _scanOrSearchBarcode(),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Products Grid
                Expanded(
                  child: _filteredProducts.isEmpty
                      ? const Center(child: Text('No products match search.', style: TextStyle(color: Colors.grey, fontSize: 12)))
                      : GridView.builder(
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: gridCols,
                            childAspectRatio: aspect,
                            crossAxisSpacing: 8,
                            mainAxisSpacing: 8,
                          ),
                          itemCount: _filteredProducts.length,
                          itemBuilder: (context, index) {
                            final p = _filteredProducts[index];
                            final isLow = p.stock <= p.minStock;
                            
                            // Find qty in current cart
                            final cartIdx = _items.indexWhere((item) => item.productId == p.id);
                            final inCartQty = cartIdx >= 0 ? _items[cartIdx].qty : 0.0;

                            return Card(
                              elevation: 0,
                              color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                                side: BorderSide(
                                  color: inCartQty > 0
                                      ? AppColors.primary.withOpacity(0.4)
                                      : (isDark ? Colors.white10 : Colors.black12),
                                  width: inCartQty > 0 ? 1.2 : 1,
                                ),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                child: Row(
                                  children: [
                                    // Product Details
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            p.name,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold, 
                                              fontSize: 12,
                                              color: isDark ? Colors.white : Colors.black87,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              Text(
                                                widget.kind == 'sale'
                                                    ? '${p.price.toStringAsFixed(2)} SAR'
                                                    : '${p.purchasePrice.toStringAsFixed(2)} SAR',
                                                style: const TextStyle(
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.bold,
                                                  color: AppColors.primary,
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                                decoration: BoxDecoration(
                                                  color: isLow
                                                      ? Colors.orange.withOpacity(0.1)
                                                      : Colors.green.withOpacity(0.1),
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: Text(
                                                  'Stock: ${p.stock.toInt()}',
                                                  style: TextStyle(
                                                    fontSize: 8,
                                                    fontWeight: FontWeight.bold,
                                                    color: isLow ? Colors.orange : Colors.green,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          )
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    // Controls (Plus / Increment / Decrement)
                                    if (inCartQty == 0)
                                      IconButton(
                                        icon: const Icon(LucideIcons.plusCircle, size: 20, color: AppColors.primary),
                                        onPressed: () => _addItem(p),
                                        constraints: const BoxConstraints(),
                                        padding: EdgeInsets.zero,
                                      )
                                    else
                                      Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          // Decrement to remove
                                          IconButton(
                                            icon: Icon(
                                              inCartQty <= 1.0 ? LucideIcons.trash2 : LucideIcons.minusCircle, 
                                              size: 18, 
                                              color: inCartQty <= 1.0 ? Colors.redAccent : (isDark ? Colors.white30 : Colors.black38),
                                            ),
                                            onPressed: () {
                                              if (cartIdx >= 0) {
                                                _updateQty(cartIdx, -1.0);
                                              }
                                            },
                                            constraints: const BoxConstraints(),
                                            padding: const EdgeInsets.all(4),
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            inCartQty.toInt().toString(),
                                            style: TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                              color: isDark ? Colors.white : Colors.black87,
                                            ),
                                          ),
                                          const SizedBox(width: 4),
                                          // Increment
                                          IconButton(
                                            icon: const Icon(LucideIcons.plusCircle, size: 18, color: AppColors.primary),
                                            onPressed: () => _addItem(p),
                                            constraints: const BoxConstraints(),
                                            padding: const EdgeInsets.all(4),
                                          ),
                                        ],
                                      ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                ),
                if (isMobile) ...[
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: _items.isEmpty
                          ? null
                          : () {
                              setState(() {
                                _activeStep = 1;
                              });
                            },
                      icon: const Icon(LucideIcons.shoppingCart, size: 14, color: Colors.white),
                      label: Text(
                        'Proceed to Checkout (${_items.fold(0.0, (sum, i) => sum + i.qty).toInt()} items)',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                  ),
                ]
              ],
            );
          }

          // Checkout Pane Widget (Right)
          Widget buildCheckoutPane() {
            return Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (isMobile) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton.icon(
                          onPressed: () {
                            setState(() {
                              _activeStep = 0;
                            });
                          },
                          icon: const Icon(LucideIcons.arrowLeft, size: 13),
                          label: const Text('Back to Catalog', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          style: TextButton.styleFrom(foregroundColor: AppColors.primary),
                        ),
                        IconButton(
                          icon: const Icon(LucideIcons.x, size: 18),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                  ],
                  Text(
                    widget.kind == 'sale' ? 'Wholesale Invoice Checkout' : 'Purchase Order Checkout',
                    style: TextStyle(
                      fontSize: 14, 
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Customer Details / Supplier Details
                  if (widget.kind == 'sale') ...[
                    DropdownButtonFormField<String>(
                      value: _customerId,
                      decoration: InputDecoration(
                        labelText: 'Wholesale Customer',
                        labelStyle: const TextStyle(fontSize: 11),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      hint: const Text('Walk-in Customer', style: TextStyle(fontSize: 12)),
                      items: [
                        const DropdownMenuItem<String>(
                          value: null,
                          child: Text('Walk-in Customer', style: TextStyle(fontSize: 12)),
                        ),
                        ..._customers.map((c) => DropdownMenuItem(
                              value: c.id,
                              child: Text('${c.name} (${c.mobile})', style: const TextStyle(fontSize: 12)),
                            )),
                      ],
                      onChanged: (val) {
                        setState(() {
                          _customerId = val;
                          if (val != null) {
                            final cust = _customers.firstWhere((c) => c.id == val);
                            _customerName = cust.name;
                            _customerMobile = cust.mobile;
                          } else {
                            _customerName = 'Walk-in Customer';
                            _customerMobile = '';
                          }
                        });
                      },
                    ),
                  ] else ...[
                    TextFormField(
                      style: const TextStyle(fontSize: 12),
                      decoration: InputDecoration(
                        labelText: 'Supplier Name',
                        hintText: 'e.g. Almarai Distribution Co',
                        hintStyle: const TextStyle(fontSize: 11),
                        labelStyle: const TextStyle(fontSize: 11),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onChanged: (val) => _supplierName = val,
                    ),
                  ],
                  const SizedBox(height: 10),

                  // Cart Items List
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Cart Items (${_items.length})', 
                        style: TextStyle(
                          fontWeight: FontWeight.bold, 
                          fontSize: 12,
                          color: isDark ? Colors.white70 : Colors.black87,
                        ),
                      ),
                      if (_items.isNotEmpty)
                        TextButton(
                          onPressed: () {
                            setState(() {
                              for (final item in _items) {
                                _priceControllers[item.productId]?.dispose();
                                _qtyControllers[item.productId]?.dispose();
                              }
                              _priceControllers.clear();
                              _qtyControllers.clear();
                              _items.clear();
                            });
                          },
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.redAccent,
                            padding: EdgeInsets.zero,
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: const Text('Clear All', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  
                  // Selected Cart Items List
                  Expanded(
                    child: _items.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(LucideIcons.shoppingBag, size: 28, color: isDark ? Colors.white24 : Colors.black12),
                                const SizedBox(height: 6),
                                const Text(
                                  'Cart is empty. Select items from Catalog.',
                                  style: TextStyle(fontSize: 11, color: Colors.grey),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            itemCount: _items.length,
                            itemBuilder: (context, idx) {
                              final item = _items[idx];
                              
                              // Retrieve or create cache controllers
                              final priceCtrl = _priceControllers[item.productId] ??= TextEditingController(text: item.price.toString());
                              final qtyCtrl = _qtyControllers[item.productId] ??= TextEditingController(text: item.qty.toString());

                              return Container(
                                padding: const EdgeInsets.symmetric(vertical: 6.0),
                                decoration: BoxDecoration(
                                  border: Border(
                                    bottom: BorderSide(
                                      color: isDark ? Colors.white10 : Colors.black12,
                                      width: 0.5,
                                    ),
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item.name,
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 11.5,
                                        color: isDark ? Colors.white : Colors.black87,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 6),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        // Price Text Field
                                        Row(
                                          children: [
                                            Text(
                                              'Price:',
                                              style: TextStyle(
                                                fontSize: 9.5,
                                                color: isDark ? Colors.white60 : Colors.black54,
                                              ),
                                            ),
                                            const SizedBox(width: 4),
                                            SizedBox(
                                              width: 75,
                                              height: 26,
                                              child: TextFormField(
                                                controller: priceCtrl,
                                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                                                decoration: InputDecoration(
                                                  contentPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                                                  isDense: true,
                                                  suffixText: 'SAR',
                                                  suffixStyle: const TextStyle(fontSize: 8, color: Colors.grey),
                                                  filled: true,
                                                  fillColor: isDark ? Colors.white.withOpacity(0.03) : Colors.black.withOpacity(0.02),
                                                  border: OutlineInputBorder(
                                                    borderRadius: BorderRadius.circular(6),
                                                    borderSide: BorderSide.none,
                                                  ),
                                                ),
                                                onChanged: (val) {
                                                  final p = double.tryParse(val) ?? 0.0;
                                                  _updatePrice(idx, p);
                                                },
                                              ),
                                            ),
                                          ],
                                        ),

                                        // Quantity Controls (Minus, Input, Plus)
                                        Row(
                                          children: [
                                            Text(
                                              'Qty:',
                                              style: TextStyle(
                                                fontSize: 9.5,
                                                color: isDark ? Colors.white60 : Colors.black54,
                                              ),
                                            ),
                                            const SizedBox(width: 4),
                                            // Minus Button
                                            InkWell(
                                              onTap: () => _updateQty(idx, -1.0),
                                              child: Container(
                                                padding: const EdgeInsets.all(3),
                                                decoration: BoxDecoration(
                                                  color: isDark ? Colors.white10 : Colors.black12,
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: const Icon(LucideIcons.minus, size: 10),
                                              ),
                                            ),
                                            // Quantity text field
                                            Container(
                                              width: 42,
                                              height: 26,
                                              margin: const EdgeInsets.symmetric(horizontal: 4),
                                              child: TextFormField(
                                                controller: qtyCtrl,
                                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                                textAlign: TextAlign.center,
                                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                                                decoration: InputDecoration(
                                                  contentPadding: EdgeInsets.zero,
                                                  isDense: true,
                                                  filled: true,
                                                  fillColor: isDark ? Colors.white.withOpacity(0.03) : Colors.black.withOpacity(0.02),
                                                  border: OutlineInputBorder(
                                                    borderRadius: BorderRadius.circular(6),
                                                    borderSide: BorderSide.none,
                                                  ),
                                                ),
                                                onChanged: (val) {
                                                  final q = double.tryParse(val) ?? 0.0;
                                                  _updateQtyDirectly(idx, q);
                                                },
                                              ),
                                            ),
                                            // Plus Button
                                            InkWell(
                                              onTap: () => _updateQty(idx, 1.0),
                                              child: Container(
                                                padding: const EdgeInsets.all(3),
                                                decoration: BoxDecoration(
                                                  color: isDark ? Colors.white10 : Colors.black12,
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: const Icon(LucideIcons.plus, size: 10),
                                              ),
                                            ),
                                          ],
                                        ),

                                        // Remove Item
                                        IconButton(
                                          icon: const Icon(LucideIcons.trash2, size: 14, color: Colors.redAccent),
                                          onPressed: () => _removeItem(idx),
                                          constraints: const BoxConstraints(),
                                          padding: const EdgeInsets.all(4),
                                          splashRadius: 14,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),

                  // Financial Calculations Panel
                  const Divider(height: 12, thickness: 0.5),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: isDark ? Colors.white.withOpacity(0.02) : Colors.black.withOpacity(0.01),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Subtotal:', style: TextStyle(fontSize: 11, color: Colors.grey)),
                            Text('${_subtotal.toStringAsFixed(2)} SAR', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: isDark ? Colors.white : Colors.black87)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Discount (SAR):', style: TextStyle(fontSize: 11, color: Colors.grey)),
                            SizedBox(
                              width: 80,
                              height: 24,
                              child: TextField(
                                controller: _discountController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                textAlign: TextAlign.right,
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                                decoration: const InputDecoration(
                                  contentPadding: EdgeInsets.zero,
                                  isDense: true,
                                  border: UnderlineInputBorder(),
                                ),
                                onChanged: (val) {
                                  setState(() {
                                    _discount = double.tryParse(val) ?? 0.0;
                                  });
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Total Bill:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            Text('${_total.toStringAsFixed(2)} SAR', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primary)),
                          ],
                        ),

                        // Payment Methods
                        if (widget.kind == 'sale') ...[
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Payment Mode:', style: TextStyle(fontSize: 11, color: Colors.grey)),
                              DropdownButton<String>(
                                value: _paymentMethod,
                                style: TextStyle(fontSize: 11.5, color: isDark ? Colors.white : Colors.black87, fontWeight: FontWeight.bold),
                                underline: const SizedBox(),
                                items: const [
                                  DropdownMenuItem(value: 'cash', child: Text('Cash')),
                                  DropdownMenuItem(value: 'pos', child: Text('POS Card')),
                                  DropdownMenuItem(value: 'bank', child: Text('Bank Transfer')),
                                  DropdownMenuItem(value: 'due', child: Text('On Credit (Due)')),
                                  DropdownMenuItem(value: 'mixed', child: Text('Mixed Payment')),
                                ],
                                onChanged: (val) {
                                  setState(() {
                                    _paymentMethod = val ?? 'cash';
                                    if (_paymentMethod != 'mixed') {
                                      _paidController.text = _paymentMethod == 'due' ? '0.0' : _total.toString();
                                      _amountPaid = _paymentMethod == 'due' ? 0.0 : _total;
                                    }
                                  });
                                },
                              ),
                            ],
                          ),
                          if (_paymentMethod == 'mixed') ...[
                            const SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Paid Amount (SAR):', style: TextStyle(fontSize: 11, color: Colors.grey)),
                                SizedBox(
                                  width: 80,
                                  height: 24,
                                  child: TextField(
                                    controller: _paidController,
                                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                    textAlign: TextAlign.right,
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                                    decoration: const InputDecoration(
                                      contentPadding: EdgeInsets.zero,
                                      isDense: true,
                                      border: UnderlineInputBorder(),
                                    ),
                                    onChanged: (val) {
                                      setState(() {
                                        _amountPaid = double.tryParse(val) ?? 0.0;
                                      });
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ],
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Remaining Due:', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 11.5)),
                              Text('${_dueAmount.toStringAsFixed(2)} SAR', style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 11.5)),
                            ],
                          ),
                        ]
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Actions Dialog
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      OutlinedButton(
                        onPressed: () => Navigator.pop(context),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                          side: BorderSide(color: isDark ? Colors.white24 : Colors.black26),
                        ),
                        child: const Text('Cancel', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                        ),
                        onPressed: _submit,
                        child: Text(
                          widget.kind == 'sale' ? 'Save Sale' : 'Save Purchase',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }

          // Step Progress Bar for mobile
          Widget buildStepIndicator() {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => setState(() => _activeStep = 0),
                      borderRadius: BorderRadius.circular(8),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: _activeStep == 0 
                              ? (isDark ? AppColors.primary : Colors.white) 
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: _activeStep == 0 
                              ? [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 4,
                                    offset: const Offset(0, 1),
                                  )
                                ] 
                              : null,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              LucideIcons.package, 
                              size: 13, 
                              color: _activeStep == 0 
                                  ? (isDark ? Colors.white : AppColors.primary) 
                                  : Colors.grey,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              '1. Catalog',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: _activeStep == 0 
                                    ? (isDark ? Colors.white : Colors.black87) 
                                    : Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: InkWell(
                      onTap: _items.isEmpty ? null : () => setState(() => _activeStep = 1),
                      borderRadius: BorderRadius.circular(8),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: _activeStep == 1 
                              ? (isDark ? AppColors.primary : Colors.white) 
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: _activeStep == 1 
                              ? [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 4,
                                    offset: const Offset(0, 1),
                                  )
                                ] 
                              : null,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              LucideIcons.shoppingCart, 
                              size: 13, 
                              color: _activeStep == 1 
                                  ? (isDark ? Colors.white : AppColors.primary) 
                                  : Colors.grey,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              '2. Checkout (${_items.fold(0.0, (sum, i) => sum + i.qty).toInt()})',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: _activeStep == 1 
                                    ? (isDark ? Colors.white : Colors.black87) 
                                    : Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }

          // Container & Layout Switcher
          return Container(
            width: isMobile ? MediaQuery.of(context).size.width : MediaQuery.of(context).size.width * 0.9,
            height: isMobile ? MediaQuery.of(context).size.height : MediaQuery.of(context).size.height * 0.95,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            child: isMobile
                ? Column(
                    children: [
                      buildStepIndicator(),
                      Expanded(
                        child: _activeStep == 0 ? buildCatalogPane() : buildCheckoutPane(),
                      ),
                    ],
                  )
                : Row(
                    children: [
                      Expanded(flex: 5, child: buildCatalogPane()),
                      VerticalDivider(width: 24, thickness: 0.5, color: isDark ? Colors.white10 : Colors.black12),
                      Expanded(flex: 4, child: buildCheckoutPane()),
                    ],
                  ),
          );
        },
      ),
    );
  }
}
