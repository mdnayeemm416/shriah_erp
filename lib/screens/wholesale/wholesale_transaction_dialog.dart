import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../blocs/wholesale/wholesale_cubit.dart';
import '../../models/wholesale_models.dart';
import '../../models/product_model.dart';

class WholesaleTransactionDialog extends StatefulWidget {
  final String kind; // 'sale' or 'purchase'
  final WholesaleOrderModel? initialOrder;
  final WholesaleSaleModel? initialSale;

  const WholesaleTransactionDialog({
    super.key,
    required this.kind,
    this.initialOrder,
    this.initialSale,
  });

  @override
  State<WholesaleTransactionDialog> createState() => _WholesaleTransactionDialogState();
}

class _WholesaleTransactionDialogState extends State<WholesaleTransactionDialog> {
  // Step 0 = Catalog (New sale), Step 1 = Review Cart
  int _activeStep = 0;
  bool _isOptionsExpanded = false;

  String? _customerId;
  String _customerName = 'Walk-in Customer';
  String _customerMobile = '';
  final String _supplierName = '';

  List<WholesaleSaleItemModel> _items = [];
  double _discount = 0.0;
  double _amountPaid = 0.0;
  String _paymentMethod = 'cash'; // 'cash', 'pos', 'bank', 'due', 'mixed'

  final _customerSearchController = TextEditingController();
  final _searchController = TextEditingController();
  final _discountController = TextEditingController(text: '0.0');
  final _paidController = TextEditingController(text: '0.0');
  final _barcodeController = TextEditingController();
  final _notesController = TextEditingController();

  // Cached controllers for cart items to prevent focus loss during rebuilds
  final Map<String, TextEditingController> _priceControllers = {};
  final Map<String, TextEditingController> _qtyControllers = {};

  List<ProductModel> _allProducts = [];
  List<ProductModel> _filteredProducts = [];
  List<WholesaleCustomerModel> _customers = [];
  List<WholesaleCustomerModel> _filteredCustomers = [];
  bool _showCustomerDropdown = false;

  @override
  void initState() {
    super.initState();
    final state = context.read<WholesaleCubit>().state;
    _allProducts = state.products;
    _filteredProducts = _allProducts;
    _customers = state.customers;
    _filteredCustomers = _customers;

    if (widget.initialSale != null) {
      final sale = widget.initialSale!;
      _customerId = sale.customerId;
      _customerName = sale.customerName.isEmpty ? 'Walk-in Customer' : sale.customerName;
      _customerMobile = sale.customerMobile;
      _items = List.from(sale.items);
      _discount = sale.discount;
      _discountController.text = sale.discount.toString();
      _paymentMethod = sale.paymentMethod;
      final paid = sale.total - sale.discount - sale.dueAmount;
      _amountPaid = paid > 0 ? paid : 0.0;
      _paidController.text = _amountPaid.toString();

      for (final item in _items) {
        _priceControllers[item.productId] = TextEditingController(text: item.price.toString());
        _qtyControllers[item.productId] = TextEditingController(text: item.qty.toString());
      }
    } else if (widget.initialOrder != null) {
      final order = widget.initialOrder!;
      _customerName = order.customerName.isEmpty ? 'Walk-in Customer' : order.customerName;
      _customerMobile = order.customerMobile;
      _items = List.from(order.items);
      _paidController.text = '0.0';
      _amountPaid = 0.0;
      _paymentMethod = 'due';

      try {
        final existing = _customers.firstWhere(
          (c) => c.mobile == order.customerMobile || c.name.toLowerCase() == order.customerName.toLowerCase(),
        );
        _customerId = existing.id;
      } catch (_) {}

      for (final item in _items) {
        _priceControllers[item.productId] = TextEditingController(text: item.price.toString());
        _qtyControllers[item.productId] = TextEditingController(text: item.qty.toString());
      }
    }
  }

  @override
  void dispose() {
    _customerSearchController.dispose();
    _searchController.dispose();
    _discountController.dispose();
    _paidController.dispose();
    _barcodeController.dispose();
    _notesController.dispose();
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
      return (_total - _amountPaid).clamp(0.0, double.infinity);
    }
  }

  int get _distinctItemCount => _items.length;

  double get _totalQty => _items.fold(0.0, (sum, i) => sum + i.qty);

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

  void _filterCustomers(String query) {
    setState(() {
      if (query.trim().isEmpty) {
        _filteredCustomers = _customers;
      } else {
        final q = query.toLowerCase();
        _filteredCustomers = _customers.where((c) => c.name.toLowerCase().contains(q) || c.mobile.contains(q)).toList();
      }
    });
  }

  void _selectCustomer(WholesaleCustomerModel customer) {
    setState(() {
      _customerId = customer.id;
      _customerName = customer.name;
      _customerMobile = customer.mobile;
      _customerSearchController.clear();
      _showCustomerDropdown = false;
    });
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
          price: currentItem.price,
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
      _priceControllers[item.productId]?.dispose();
      _priceControllers.remove(item.productId);
      _qtyControllers[item.productId]?.dispose();
      _qtyControllers.remove(item.productId);
      _items.removeAt(index);
    });
  }

  void _clearCart() {
    setState(() {
      for (final c in _priceControllers.values) {
        c.dispose();
      }
      for (final c in _qtyControllers.values) {
        c.dispose();
      }
      _priceControllers.clear();
      _qtyControllers.clear();
      _items.clear();
    });
  }

  void _executeSale({bool printReceipt = false, bool shareReceipt = false}) {
    if (widget.initialSale != null) {
      final updated = widget.initialSale!.copyWith(
        customerId: _customerId,
        customerName: _customerName.isEmpty ? 'Walk-in Customer' : _customerName,
        customerMobile: _customerMobile,
        items: _items,
        total: _total,
        discount: _discount,
        dueAmount: _dueAmount,
        paymentMethod: _paymentMethod,
      );
      context.read<WholesaleCubit>().updateSale(updated);
    } else if (widget.initialOrder != null) {
      context.read<WholesaleCubit>().convertOrderToSale(
            order: widget.initialOrder!,
            paymentMethod: _paymentMethod,
            discount: _discount,
            dueAmount: _dueAmount,
          );
    } else {
      context.read<WholesaleCubit>().createSale(
            customerId: _customerId,
            customerName: _customerName.isEmpty ? 'Walk-in Customer' : _customerName,
            customerMobile: _customerMobile,
            items: _items,
            total: _total,
            discount: _discount,
            dueAmount: _dueAmount,
            paymentMethod: _paymentMethod,
          );
    }

    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(printReceipt ? 'Sale completed & receipt printed!' : 'Sale completed successfully!'),
        backgroundColor: const Color(0xFF24B489),
      ),
    );
  }

  String _fmt(double val) => 'SAR ${val.toStringAsFixed(2)}';

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      backgroundColor: bgColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500, maxHeight: 780),
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 250),
          child: _activeStep == 0
              ? _buildCatalogView(context, isDark, bgColor, cardBg, textColor, labelColor, borderColor, primaryColor)
              : _buildReviewCartView(context, isDark, bgColor, cardBg, textColor, labelColor, borderColor, primaryColor),
        ),
      ),
    );
  }

  // ==========================================
  // STEP 1: CATALOG VIEW (Matching Image 1)
  // ==========================================
  Widget _buildCatalogView(
    BuildContext context,
    bool isDark,
    Color bgColor,
    Color cardBg,
    Color textColor,
    Color labelColor,
    Color borderColor,
    Color primaryColor,
  ) {
    return GestureDetector(
      onTap: () {
        if (_showCustomerDropdown) {
          setState(() => _showCustomerDropdown = false);
        }
      },
      behavior: HitTestBehavior.translucent,
      child: Column(
        key: const ValueKey('catalog_view'),
        children: [
          // Top Header Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 12, 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  widget.kind == 'sale' ? 'New sale' : 'New purchase',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor,
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

          // Scrollable Body
          Expanded(
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                SingleChildScrollView(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Customer Selection Trigger Field
                      InkWell(
                        onTap: () {
                          setState(() {
                            _showCustomerDropdown = !_showCustomerDropdown;
                            _filteredCustomers = _customers;
                          });
                        },
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: _showCustomerDropdown ? primaryColor : borderColor,
                              width: _showCustomerDropdown ? 1.5 : 1.0,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(LucideIcons.user, size: 18, color: primaryColor),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  _customerName.isEmpty ? 'Select customer *' : _customerName,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: textColor,
                                  ),
                                ),
                              ),
                              Icon(
                                _showCustomerDropdown ? LucideIcons.chevronUp : LucideIcons.chevronDown,
                                size: 18,
                                color: labelColor,
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),

                      // 2. Sale Options Accordion Bar
                      Container(
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: borderColor),
                        ),
                        child: Column(
                          children: [
                            InkWell(
                              onTap: () => setState(() => _isOptionsExpanded = !_isOptionsExpanded),
                              borderRadius: BorderRadius.circular(16),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'SALE OPTIONS',
                                          style: TextStyle(
                                            fontSize: 9.5,
                                            fontWeight: FontWeight.bold,
                                            letterSpacing: 0.6,
                                            color: labelColor,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          'Discount & notes',
                                          style: TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w500,
                                            color: textColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Icon(
                                      _isOptionsExpanded ? LucideIcons.chevronUp : LucideIcons.chevronDown,
                                      size: 18,
                                      color: labelColor,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            if (_isOptionsExpanded) ...[
                              const Divider(height: 1),
                              Padding(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: TextField(
                                            controller: _discountController,
                                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                            style: TextStyle(fontSize: 13, color: textColor),
                                            decoration: InputDecoration(
                                              labelText: 'Discount (SAR)',
                                              labelStyle: TextStyle(fontSize: 11, color: labelColor),
                                              filled: true,
                                              fillColor: cardBg,
                                              isDense: true,
                                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
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
                                    const SizedBox(height: 8),
                                    TextField(
                                      controller: _notesController,
                                      style: TextStyle(fontSize: 13, color: textColor),
                                      decoration: InputDecoration(
                                        labelText: 'Notes',
                                        labelStyle: TextStyle(fontSize: 11, color: labelColor),
                                        filled: true,
                                        fillColor: cardBg,
                                        isDense: true,
                                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),

                      // 3. Search Products & Barcode Button Bar
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _searchController,
                              style: TextStyle(fontSize: 13, color: textColor),
                              onChanged: _filterProducts,
                              decoration: InputDecoration(
                                hintText: 'Search products, barcode...',
                                hintStyle: TextStyle(fontSize: 13, color: labelColor),
                                prefixIcon: Icon(LucideIcons.search, size: 16, color: labelColor),
                                filled: true,
                                fillColor: cardBg,
                                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(20),
                                  borderSide: BorderSide(color: borderColor),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(20),
                                  borderSide: BorderSide(color: borderColor),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(20),
                                  borderSide: const BorderSide(color: Color(0xFF24B489), width: 1.5),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Circular Barcode Scan Button
                          InkWell(
                            onTap: () async {
                              final code = _searchController.text.trim();
                              if (code.isNotEmpty) {
                                try {
                                  final p = _allProducts.firstWhere((prod) => prod.barcode == code || prod.itemCode == code);
                                  _addItem(p);
                                  _searchController.clear();
                                } catch (_) {}
                              }
                            },
                            borderRadius: BorderRadius.circular(24),
                            child: Container(
                              width: 46,
                              height: 46,
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1),
                                shape: BoxShape.circle,
                                border: Border.all(color: primaryColor.withValues(alpha: 0.3)),
                              ),
                              child: Icon(LucideIcons.scan, color: primaryColor, size: 20),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // 4. Products List (With Item Card Quantity Stepper & Keyboard Input)
                      ..._filteredProducts.map((product) {
                        final cartIdx = _items.indexWhere((it) => it.productId == product.id);
                        final inCartQty = cartIdx >= 0 ? _items[cartIdx].qty : 0.0;
                        final isInCart = inCartQty > 0;
                        final qtyCtrl = cartIdx >= 0
                            ? (_qtyControllers[product.id] ??= TextEditingController(text: inCartQty.toString()))
                            : null;

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: InkWell(
                            onTap: () => _addItem(product),
                            borderRadius: BorderRadius.circular(20),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 150),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: isInCart ? (isDark ? const Color(0xFF132A29) : const Color(0xFFF0FDF4)) : cardBg,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isInCart ? primaryColor : borderColor,
                                  width: isInCart ? 1.5 : 1.0,
                                ),
                              ),
                              child: Row(
                                children: [
                                // Box Icon Avatar
                                Container(
                                  width: 38,
                                  height: 38,
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(LucideIcons.box, size: 18, color: labelColor),
                                ),
                                const SizedBox(width: 12),

                                // Product Title & Subtitle
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        product.name,
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold,
                                          color: textColor,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 2),
                                      RichText(
                                        text: TextSpan(
                                          style: TextStyle(fontSize: 12, color: labelColor),
                                          children: [
                                            TextSpan(
                                              text: _fmt(widget.kind == 'sale' ? product.price : product.purchasePrice),
                                              style: TextStyle(fontWeight: FontWeight.bold, color: textColor),
                                            ),
                                            const TextSpan(text: '  0 · '),
                                            TextSpan(
                                              text: 'Stock ${product.stock.toInt()}',
                                              style: TextStyle(
                                                color: product.stock <= 0 ? Colors.red : labelColor,
                                                fontWeight: product.stock <= 0 ? FontWeight.bold : FontWeight.normal,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Quantity Control (Steppers or (+) Add Button)
                                if (!isInCart)
                                  InkWell(
                                    onTap: () => _addItem(product),
                                    borderRadius: BorderRadius.circular(18),
                                    child: Container(
                                      width: 36,
                                      height: 36,
                                      decoration: BoxDecoration(
                                        color: primaryColor,
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Center(
                                        child: Icon(LucideIcons.plus, color: Colors.white, size: 20),
                                      ),
                                    ),
                                  )
                                else
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: cardBg,
                                      borderRadius: BorderRadius.circular(18),
                                      border: Border.all(color: primaryColor, width: 1.5),
                                    ),
                                    child: Row(
                                      children: [
                                        // Decrease quantity button (-)
                                        InkWell(
                                          onTap: () => _updateQty(cartIdx, -1.0),
                                          borderRadius: BorderRadius.circular(12),
                                          child: Padding(
                                            padding: const EdgeInsets.all(4.0),
                                            child: Icon(LucideIcons.minus, size: 14, color: primaryColor),
                                          ),
                                        ),
                                        // Keyboard Editable Quantity Text Field
                                        SizedBox(
                                          width: 38,
                                          child: TextFormField(
                                            controller: qtyCtrl,
                                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                            inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*'))],
                                            textAlign: TextAlign.center,
                                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: textColor),
                                            decoration: const InputDecoration(
                                              border: InputBorder.none,
                                              isDense: true,
                                              contentPadding: EdgeInsets.zero,
                                            ),
                                            onChanged: (val) {
                                              final q = double.tryParse(val) ?? 0.0;
                                              _updateQtyDirectly(cartIdx, q);
                                            },
                                          ),
                                        ),
                                        // Increase quantity button (+)
                                        InkWell(
                                          onTap: () => _updateQty(cartIdx, 1.0),
                                          borderRadius: BorderRadius.circular(12),
                                          child: Padding(
                                            padding: const EdgeInsets.all(4.0),
                                            child: Icon(LucideIcons.plus, size: 14, color: primaryColor),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                      );
                      }),
                      const SizedBox(height: 70),
                    ],
                  ),
                ),

                // Customer Dropdown Overlay (With Search inside & Tap Outside to Dismiss)
                if (_showCustomerDropdown)
                  Positioned(
                    top: 52,
                    left: 14,
                    right: 14,
                    child: Material(
                      elevation: 8,
                      borderRadius: BorderRadius.circular(20),
                      color: cardBg,
                      child: Container(
                        constraints: const BoxConstraints(maxHeight: 270),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: borderColor),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Search Field inside the Dropdown Header
                            Padding(
                              padding: const EdgeInsets.all(10.0),
                              child: TextField(
                                controller: _customerSearchController,
                                autofocus: true,
                                style: TextStyle(fontSize: 13, color: textColor),
                                onChanged: _filterCustomers,
                                decoration: InputDecoration(
                                  hintText: 'Search customer name or mobile...',
                                  hintStyle: TextStyle(fontSize: 12, color: labelColor),
                                  prefixIcon: Icon(LucideIcons.search, size: 16, color: labelColor),
                                  isDense: true,
                                  filled: true,
                                  fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                              ),
                            ),
                            const Divider(height: 1),

                            // Walk-in Customer Option
                            ListTile(
                              dense: true,
                              leading: Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: primaryColor.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(LucideIcons.userCheck, size: 14, color: primaryColor),
                              ),
                              title: const Text('Walk-in Customer', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              subtitle: const Text('Default general customer', style: TextStyle(fontSize: 10, color: Colors.grey)),
                              trailing: _customerName == 'Walk-in Customer' ? Icon(LucideIcons.check, size: 16, color: primaryColor) : null,
                              onTap: () {
                                setState(() {
                                  _customerId = null;
                                  _customerName = 'Walk-in Customer';
                                  _customerMobile = '';
                                  _showCustomerDropdown = false;
                                });
                              },
                            ),
                            const Divider(height: 1),

                            // Customers List
                            Flexible(
                              child: _filteredCustomers.isEmpty
                                  ? Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Text('No matching customers found', style: TextStyle(fontSize: 12, color: labelColor)),
                                    )
                                  : ListView.builder(
                                      shrinkWrap: true,
                                      itemCount: _filteredCustomers.length,
                                      itemBuilder: (context, idx) {
                                        final c = _filteredCustomers[idx];
                                        final isSelected = _customerId == c.id || _customerName == c.name;
                                        return ListTile(
                                          dense: true,
                                          leading: Icon(LucideIcons.user, size: 16, color: isSelected ? primaryColor : labelColor),
                                          title: Text(c.name, style: TextStyle(fontWeight: FontWeight.bold, color: textColor, fontSize: 13)),
                                          subtitle: Text(c.mobile, style: TextStyle(fontSize: 11, color: labelColor)),
                                          trailing: isSelected ? Icon(LucideIcons.check, size: 16, color: primaryColor) : null,
                                          onTap: () => _selectCustomer(c),
                                        );
                                      },
                                    ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // 5. Sticky Bottom Cart Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: primaryColor,
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        const Icon(LucideIcons.shoppingCart, color: Colors.white, size: 24),
                        if (_distinctItemCount > 0)
                          Positioned(
                            top: -6,
                            right: -6,
                            child: Container(
                              padding: const EdgeInsets.all(3),
                              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                              child: Text(
                                _distinctItemCount.toString(),
                                style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: primaryColor),
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '$_distinctItemCount ITEM · QTY ${_totalQty.toInt()}',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.6,
                            color: Colors.white70,
                          ),
                        ),
                        Text(
                          _fmt(_total),
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                // Review ^ Button
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF52D1AC),
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  onPressed: () => setState(() => _activeStep = 1),
                  icon: const Text('Review', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                  label: const Icon(LucideIcons.chevronUp, color: Colors.white, size: 16),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // STEP 2: REVIEW CART VIEW (Matching Image 2)
  // ==========================================
  Widget _buildReviewCartView(
    BuildContext context,
    bool isDark,
    Color bgColor,
    Color cardBg,
    Color textColor,
    Color labelColor,
    Color borderColor,
    Color primaryColor,
  ) {
    // Fixed Bug: Customer warning banner ONLY shows if no customer name is set at all.
    final bool hasNoCustomer = _customerName.trim().isEmpty;

    return Column(
      key: const ValueKey('review_cart_view'),
      children: [
        // Grab handle & Header Bar with BACK BUTTON
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 10, 16, 10),
          child: Column(
            children: [
              Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? Colors.white24 : Colors.black12,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      // BACK BUTTON to return to New Sale catalog view
                      IconButton(
                        icon: Icon(LucideIcons.arrowLeft, size: 20, color: textColor),
                        onPressed: () => setState(() => _activeStep = 0),
                        tooltip: 'Back to New Sale',
                      ),
                      Icon(LucideIcons.shoppingCart, size: 18, color: primaryColor),
                      const SizedBox(width: 6),
                      Text(
                        'Review cart',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '$_distinctItemCount item',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: textColor),
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: _clearCart,
                    child: const Text('Clear all', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 1, thickness: 1),

        // Scrollable Cart Items & Options
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Cart Items List
                ..._items.asMap().entries.map((entryIdx) {
                  final idx = entryIdx.key;
                  final item = entryIdx.value;

                  final priceCtrl = _priceControllers[item.productId] ??= TextEditingController(text: item.price.toString());
                  final qtyCtrl = _qtyControllers[item.productId] ??= TextEditingController(text: item.qty.toString());

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 10.0),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: borderColor),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Item Header Row
                          Row(
                            children: [
                              Container(
                                width: 34,
                                height: 34,
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(LucideIcons.box, size: 16, color: labelColor),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  item.name,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: textColor,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Text(
                                '${(item.qty * item.price).toStringAsFixed(2)}\nSAR',
                                textAlign: TextAlign.right,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: textColor,
                                ),
                              ),
                              const SizedBox(width: 8),
                              InkWell(
                                onTap: () => _removeItem(idx),
                                child: const Icon(LucideIcons.trash2, color: Colors.red, size: 18),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),

                          // Controls Row (Qty Stepper + Price Input)
                          Row(
                            children: [
                              // Quantity Stepper ([-] [ 2 ] [+])
                              Container(
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: borderColor),
                                ),
                                child: Row(
                                  children: [
                                    IconButton(
                                      icon: const Icon(LucideIcons.minus, size: 14),
                                      onPressed: () => _updateQty(idx, -1.0),
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                                    ),
                                    SizedBox(
                                      width: 40,
                                      child: TextFormField(
                                        controller: qtyCtrl,
                                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                        inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*'))],
                                        textAlign: TextAlign.center,
                                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: textColor),
                                        decoration: const InputDecoration(
                                          border: InputBorder.none,
                                          isDense: true,
                                          contentPadding: EdgeInsets.zero,
                                        ),
                                        onChanged: (val) {
                                          final q = double.tryParse(val) ?? 0.0;
                                          _updateQtyDirectly(idx, q);
                                        },
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(LucideIcons.plus, size: 14),
                                      onPressed: () => _updateQty(idx, 1.0),
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 10),

                              // Price Input Box
                              Expanded(
                                child: Container(
                                  height: 36,
                                  padding: const EdgeInsets.symmetric(horizontal: 10),
                                  decoration: BoxDecoration(
                                    color: cardBg,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: borderColor),
                                  ),
                                  child: Row(
                                    children: [
                                      Text('SAR', style: TextStyle(fontSize: 11, color: labelColor)),
                                      const SizedBox(width: 6),
                                      Expanded(
                                        child: TextFormField(
                                          controller: priceCtrl,
                                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: textColor),
                                          decoration: const InputDecoration(
                                            border: InputBorder.none,
                                            isDense: true,
                                            contentPadding: EdgeInsets.zero,
                                          ),
                                          onChanged: (val) {
                                            final p = double.tryParse(val) ?? 0.0;
                                            _updatePrice(idx, p);
                                          },
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 10),

                // Notes Field
                TextField(
                  controller: _notesController,
                  style: TextStyle(fontSize: 13, color: textColor),
                  decoration: InputDecoration(
                    hintText: 'Add notes (optional)',
                    hintStyle: TextStyle(fontSize: 13, color: labelColor),
                    filled: true,
                    fillColor: cardBg,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(color: borderColor),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(color: borderColor),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // PAYMENT Section
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'PAYMENT',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                            color: labelColor,
                          ),
                        ),
                        Row(
                          children: [
                            InkWell(
                              onTap: () {
                                setState(() {
                                  _paymentMethod = 'cash';
                                  _amountPaid = _total;
                                  _paidController.text = _total.toString();
                                });
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text('Paid full', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: textColor)),
                              ),
                            ),
                            const SizedBox(width: 6),
                            InkWell(
                              onTap: () {
                                setState(() {
                                  _paymentMethod = 'due';
                                  _amountPaid = 0.0;
                                  _paidController.text = '0.0';
                                });
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text('All due', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: textColor)),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Paid input & Payment method dropdown
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _paidController,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            style: TextStyle(fontSize: 13, color: textColor),
                            decoration: InputDecoration(
                              hintText: 'Paid (SAR)',
                              hintStyle: TextStyle(fontSize: 12, color: labelColor),
                              filled: true,
                              fillColor: cardBg,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                            ),
                            onChanged: (val) {
                              setState(() {
                                _amountPaid = double.tryParse(val) ?? 0.0;
                              });
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: borderColor),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _paymentMethod,
                                isExpanded: true,
                                dropdownColor: cardBg,
                                style: TextStyle(color: textColor, fontSize: 13, fontWeight: FontWeight.bold),
                                onChanged: (val) => setState(() => _paymentMethod = val!),
                                items: const [
                                  DropdownMenuItem(value: 'cash', child: Text('Cash')),
                                  DropdownMenuItem(value: 'pos', child: Text('Card / POS')),
                                  DropdownMenuItem(value: 'bank', child: Text('Bank Transfer')),
                                  DropdownMenuItem(value: 'due', child: Text('Credit / Due')),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Subtitle: Due this sale
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Due this sale', style: TextStyle(fontSize: 11, color: labelColor)),
                        Text(_fmt(_dueAmount), style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: primaryColor)),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),

        // Bottom Footer
        const Divider(height: 1, thickness: 1),
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'TOTAL · VAT INCL.',
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.6,
                          color: labelColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _fmt(_total),
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: textColor,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '$_distinctItemCount item · ${_totalQty.toInt()} qty',
                        style: TextStyle(fontSize: 11, color: labelColor),
                      ),
                      Text(
                        'VAT 0.00',
                        style: TextStyle(fontSize: 11, color: labelColor),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Warning Banner (Only shown if NO customer name is specified)
              if (hasNoCustomer) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF7ED),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFFED7AA)),
                  ),
                  child: const Row(
                    children: [
                      Icon(LucideIcons.alertTriangle, size: 14, color: Color(0xFFC2410C)),
                      SizedBox(width: 8),
                      Text(
                        'Select customer before completing sale',
                        style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Color(0xFFC2410C)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
              ],

              // Action Buttons Row (Complete, Save & Share, Save & Print)
              Row(
                children: [
                  Expanded(
                    flex: 12,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF52D1AC),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => _executeSale(),
                      icon: const Icon(LucideIcons.checkCircle, size: 16, color: Colors.white),
                      label: const Text(
                        'Complete ...',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    flex: 11,
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: BorderSide(color: borderColor),
                        backgroundColor: cardBg,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => _executeSale(shareReceipt: true),
                      icon: Icon(LucideIcons.messageCircle, size: 14, color: textColor),
                      label: Text(
                        'Save & Sh...',
                        style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 11.5),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    flex: 11,
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: BorderSide(color: borderColor),
                        backgroundColor: cardBg,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => _executeSale(printReceipt: true),
                      icon: Icon(LucideIcons.printer, size: 14, color: textColor),
                      label: Text(
                        'Save & Print',
                        style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 11.5),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}
