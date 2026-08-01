import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../blocs/wholesale/wholesale_cubit.dart';
import '../../models/wholesale_models.dart';
import '../../models/product_model.dart';
import '../../services/pdf_print_service.dart';
import '../common_widgets/smart_image_widget.dart';
import 'components/add_party_bottom_sheet.dart';

class WholesaleTransactionDialog extends StatefulWidget {
  final String kind; // 'sale' or 'purchase'
  final WholesaleOrderModel? initialOrder;
  final WholesaleSaleModel? initialSale;
  final WholesalePurchaseModel? initialPurchase;

  const WholesaleTransactionDialog({
    super.key,
    required this.kind,
    this.initialOrder,
    this.initialSale,
    this.initialPurchase,
  });

  @override
  State<WholesaleTransactionDialog> createState() => _WholesaleTransactionDialogState();
}

class _WholesaleTransactionDialogState extends State<WholesaleTransactionDialog> {
  String get _titleText {
    if (widget.initialSale != null) {
      return 'Edit Sale #${widget.initialSale!.invoiceNumber}';
    }
    if (widget.initialPurchase != null) {
      return 'Edit Purchase #${widget.initialPurchase!.invoiceNumber}';
    }
    if (widget.initialOrder != null) {
      return 'Process Order #${widget.initialOrder!.orderNumber}';
    }
    return widget.kind == 'sale' ? 'New sale' : 'New purchase';
  }

  // Step 0 = Catalog (New sale), Step 1 = Review Cart
  int _activeStep = 0;
  bool _isOptionsExpanded = false;
  bool _isSaving = false;

  bool _isLoadingPurchaseDetails = false;
  String? _purchaseDetailsError;
  WholesalePurchaseModel? _loadedPurchase;

  String? _customerId;
  String _customerName = 'Walk-in Customer';
  String _customerMobile = '';

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

  String? _getProductImageUrl(ProductModel product) {
    if (product.images != null && product.images!.isNotEmpty) {
      final firstImg = product.images!.firstWhere(
        (img) => img.trim().isNotEmpty,
        orElse: () => '',
      );
      if (firstImg.isNotEmpty) return firstImg;
    }
    if (product.imageUrl != null && product.imageUrl!.trim().isNotEmpty) {
      return product.imageUrl;
    }
    return null;
  }

  Future<void> _showAddPartySheet() async {
    final newParty = await showModalBottomSheet<WholesaleCustomerModel>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AddPartyBottomSheet(
        initialType: widget.kind == 'purchase' ? 'Supplier' : 'Customer',
      ),
    );

    if (newParty != null && mounted) {
      final updatedCustomers = context.read<WholesaleCubit>().state.customers;
      WholesaleCustomerModel? created;
      try {
        created = updatedCustomers.firstWhere(
          (c) =>
              c.name.toLowerCase() == newParty.name.toLowerCase() ||
              (newParty.mobile.isNotEmpty && c.mobile == newParty.mobile),
        );
      } catch (_) {
        created = newParty;
      }

      setState(() {
        _customers = updatedCustomers;
        _filteredCustomers = updatedCustomers;
        _customerId = (created?.id.isNotEmpty ?? false) ? created!.id : null;
        _customerName = created?.name ?? newParty.name;
        _customerMobile = created?.mobile ?? newParty.mobile;
        _showCustomerDropdown = false;
      });
      _saveDraft();
    }
  }

  @override
  void initState() {
    super.initState();
    if (widget.kind == 'purchase') {
      _customerName = 'Walk-in Supplier';
    }
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
    } else if (widget.initialPurchase != null) {
      _isLoadingPurchaseDetails = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _fetchPurchaseDetails();
      });
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
    } else {
      _loadDraft();
    }
  }

  Future<void> _loadDraft() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final draftKey = 'wholesale_draft_${widget.kind}';
      final rawJson = prefs.getString(draftKey);
      if (rawJson == null || rawJson.isEmpty) return;

      final Map<String, dynamic> data = jsonDecode(rawJson);
      final rawItems = data['items'] as List<dynamic>?;
      if (rawItems == null || rawItems.isEmpty) return;

      final loadedItems = rawItems
          .map((itemJson) => WholesaleSaleItemModel.fromJson(Map<String, dynamic>.from(itemJson)))
          .toList();

      if (!mounted) return;

      setState(() {
        _customerId = data['customerId'] as String?;
        _customerName = data['customerName'] as String? ?? (widget.kind == 'purchase' ? 'Walk-in Supplier' : 'Walk-in Customer');
        _customerMobile = data['customerMobile'] as String? ?? '';
        _discount = (data['discount'] as num? ?? 0.0).toDouble();
        _discountController.text = _discount.toString();
        _amountPaid = (data['amountPaid'] as num? ?? 0.0).toDouble();
        _paidController.text = _amountPaid.toString();
        _paymentMethod = data['paymentMethod'] as String? ?? 'cash';
        _notesController.text = data['notes'] as String? ?? '';

        _items = loadedItems;
        for (final item in _items) {
          _priceControllers[item.productId] = TextEditingController(text: item.price.toString());
          _qtyControllers[item.productId] = TextEditingController(text: item.qty.toString());
        }
      });
    } catch (e) {
      debugPrint('Error loading wholesale draft: $e');
    }
  }

  Future<void> _saveDraft() async {
    if (widget.initialSale != null || widget.initialOrder != null) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final draftKey = 'wholesale_draft_${widget.kind}';

      if (_items.isEmpty &&
          (_customerId == null || _customerId!.isEmpty) &&
          (_customerName == 'Walk-in Customer' || _customerName.isEmpty) &&
          _discount == 0.0 &&
          _notesController.text.isEmpty) {
        await prefs.remove(draftKey);
        return;
      }

      final data = {
        'customerId': _customerId,
        'customerName': _customerName,
        'customerMobile': _customerMobile,
        'items': _items.map((i) => i.toJson()).toList(),
        'discount': _discount,
        'amountPaid': _amountPaid,
        'paymentMethod': _paymentMethod,
        'notes': _notesController.text,
      };
      await prefs.setString(draftKey, jsonEncode(data));
    } catch (e) {
      debugPrint('Error saving wholesale draft: $e');
    }
  }

  Future<void> _clearDraft() async {
    if (widget.initialSale != null || widget.initialOrder != null) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('wholesale_draft_${widget.kind}');
    } catch (e) {
      debugPrint('Error clearing wholesale draft: $e');
    }
  }

  Future<void> _fetchPurchaseDetails() async {
    setState(() {
      _isLoadingPurchaseDetails = true;
      _purchaseDetailsError = null;
    });

    try {
      final cubit = context.read<WholesaleCubit>();
      final purchase = await cubit.wholesaleRepo.purchaseRepo.getPurchaseById(widget.initialPurchase!.id);

      if (!mounted) return;

      setState(() {
        _loadedPurchase = purchase;
        _customerId = null;
        _customerName = purchase.supplierName.isEmpty ? 'Walk-in Supplier' : purchase.supplierName;
        _customerMobile = '';
        _items = List.from(purchase.items);
        _discount = 0.0;
        _discountController.text = '0.0';
        _paymentMethod = 'cash';
        _amountPaid = purchase.total;
        _paidController.text = _amountPaid.toString();
        _notesController.text = purchase.notes ?? '';

        for (final item in _items) {
          _priceControllers[item.productId] = TextEditingController(text: item.price.toString());
          _qtyControllers[item.productId] = TextEditingController(text: item.qty.toString());
        }
        _isLoadingPurchaseDetails = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _purchaseDetailsError = e.toString();
        _isLoadingPurchaseDetails = false;
      });
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
    _saveDraft();
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
    _saveDraft();
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
    _saveDraft();
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
    _saveDraft();
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
    _saveDraft();
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
    _saveDraft();
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
    _clearDraft();
  }

  Future<void> _executeSale({bool printReceipt = false, bool shareReceipt = false}) async {
    if (_isSaving) return;

    final cubit = context.read<WholesaleCubit>();
    String mobileToUse = _customerMobile;
    if (shareReceipt && mobileToUse.trim().isEmpty) {
      final promptedMobile = await _promptWhatsAppNumber();
      if (promptedMobile != null && promptedMobile.isNotEmpty) {
        mobileToUse = promptedMobile;
      }
    }

    setState(() => _isSaving = true);

    try {
      dynamic savedEntry;

      if (widget.kind == 'purchase') {
        if (widget.initialPurchase != null) {
          final basePurchase = _loadedPurchase ?? widget.initialPurchase!;
          final updated = basePurchase.copyWith(
            supplierName: _customerName.isEmpty ? 'Walk-in Supplier' : _customerName,
            items: _items,
            total: _total,
            notes: _notesController.text.isNotEmpty ? _notesController.text : null,
          );
          await cubit.updatePurchase(updated);
          savedEntry = updated;
        } else {
          savedEntry = await cubit.createPurchase(
            supplierName: _customerName.isEmpty ? 'Walk-in Supplier' : _customerName,
            items: _items,
            total: _total,
            notes: _notesController.text.isNotEmpty ? _notesController.text : null,
          );
        }
      } else if (widget.initialSale != null) {
        final updated = widget.initialSale!.copyWith(
          customerId: _customerId,
          customerName: _customerName.isEmpty ? 'Walk-in Customer' : _customerName,
          customerMobile: mobileToUse,
          items: _items,
          total: _total,
          discount: _discount,
          dueAmount: _dueAmount,
          paymentMethod: _paymentMethod,
        );
        await cubit.updateSale(updated);
        savedEntry = updated;
      } else if (widget.initialOrder != null) {
        savedEntry = await cubit.convertOrderToSale(
          order: widget.initialOrder!,
          paymentMethod: _paymentMethod,
          discount: _discount,
          dueAmount: _dueAmount,
        );
      } else {
        savedEntry = await cubit.createSale(
          customerId: _customerId,
          customerName: _customerName.isEmpty ? 'Walk-in Customer' : _customerName,
          customerMobile: mobileToUse,
          items: _items,
          total: _total,
          discount: _discount,
          dueAmount: _dueAmount,
          paymentMethod: _paymentMethod,
        );
      }

      if (savedEntry == null) {
        throw Exception("Server did not return a valid saved transaction");
      }

      _clearDraft();

      if (!mounted) return;
      Navigator.pop(context);

      if (printReceipt) {
        await PdfPrintService.print80mmReceipt(
          entry: savedEntry,
          partyName: _customerName.isEmpty ? 'Walk-in Customer' : _customerName,
        );
      } else if (shareReceipt) {
        await _handleSaveAndShare(savedEntry, targetMobile: mobileToUse);
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(widget.initialSale != null
                ? 'Sale updated successfully!'
                : widget.initialPurchase != null
                    ? 'Purchase updated successfully!'
                    : shareReceipt
                        ? 'Sale completed & receipt shared!'
                        : printReceipt
                            ? (widget.kind == 'purchase' ? 'Purchase completed & receipt printed!' : 'Sale completed & receipt printed!')
                            : (widget.kind == 'purchase' ? 'Purchase completed successfully!' : 'Sale completed successfully!')),
            backgroundColor: const Color(0xFF24B489),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        String msg = e.toString();
        if (msg.startsWith("Exception: ")) {
          msg = msg.substring(11);
        }
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Server Error', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
            content: Text(msg),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  Future<void> _handleSaveAndShare(dynamic entry, {required String targetMobile}) async {
    try {
      final partyName = _customerName.isEmpty ? 'Walk-in Customer' : _customerName;

      // 1. Generate PNG image of the sales receipt
      final pngBytes = await PdfPrintService.generateReceiptImage(
        entry: entry,
        partyName: partyName,
      );

      // 2. Save PNG bytes to temporary directory
      final tempDir = await getTemporaryDirectory();
      final invNum = (entry is WholesaleSaleModel)
          ? '${entry.invoiceNumber}'
          : (entry is WholesalePurchaseModel ? entry.invoiceNumber : 'receipt');
      final imagePath = '${tempDir.path}/sale_receipt_$invNum.png';
      final file = File(imagePath);
      await file.writeAsBytes(pngBytes);

      final cleanMobile = targetMobile.replaceAll(RegExp(r'\D'), '');

      // 3. Build summary text for WhatsApp message
      final totalStr = _fmt(_total);
      final msg = '🧾 *Sale Receipt #$invNum*\nCustomer: $partyName\nTotal: $totalStr\nPayment Method: ${_paymentMethod.toUpperCase()}\nThank you for your business!';

      // 4. Open WhatsApp chat with prefilled message if phone number exists
      if (cleanMobile.isNotEmpty) {
        final whatsappUrl = Uri.parse('https://wa.me/$cleanMobile?text=${Uri.encodeComponent(msg)}');
        if (await canLaunchUrl(whatsappUrl)) {
          await launchUrl(whatsappUrl, mode: LaunchMode.externalApplication);
        }
      }

      // 5. Launch system share sheet with the generated receipt image
      await Share.shareXFiles(
        [XFile(imagePath)],
        text: msg,
        subject: 'Sale Receipt #$invNum',
      );
    } catch (e) {
      debugPrint('Error sharing receipt image: $e');
    }
  }

  Future<String?> _promptWhatsAppNumber() async {
    final phoneController = TextEditingController();
    return showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('WhatsApp Number', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Enter customer WhatsApp mobile number to share the receipt image:', style: TextStyle(fontSize: 13)),
            const SizedBox(height: 14),
            TextField(
              controller: phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                hintText: 'e.g. 966500000000',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                prefixIcon: const Icon(LucideIcons.phone, size: 18),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, null),
            child: const Text('Skip Phone'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF24B489),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () => Navigator.pop(ctx, phoneController.text.trim()),
            child: const Text('Send to WhatsApp', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  String _fmt(double val) => 'SAR ${val.toStringAsFixed(2)}';

  @override
  Widget build(BuildContext context) {
    final state = context.watch<WholesaleCubit>().state;
    _allProducts = state.products;
    _customers = state.customers;
    if (_customerSearchController.text.trim().isEmpty) {
      _filteredCustomers = _customers;
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    if (_isLoadingPurchaseDetails) {
      return Dialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        backgroundColor: bgColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500, maxHeight: 400),
          padding: const EdgeInsets.all(24),
          child: const Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                ),
                SizedBox(height: 24),
                Text(
                  'Fetching purchase details from server...',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Please wait while we load the latest transaction data.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (_purchaseDetailsError != null) {
      return Dialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        backgroundColor: bgColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500, maxHeight: 400),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  LucideIcons.alertTriangle,
                  color: Colors.red,
                  size: 40,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Failed to load purchase details',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                _purchaseDetailsError!,
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.red.shade400, fontSize: 13),
                maxLines: 4,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: borderColor),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: Text('Cancel', style: TextStyle(color: textColor)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      icon: const Icon(Icons.refresh, size: 16, color: Colors.white),
                      label: const Text('Retry', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      onPressed: _fetchPurchaseDetails,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }

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
                  _titleText,
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
                                  _customerName.isEmpty ? (widget.kind == 'purchase' ? 'Select supplier *' : 'Select customer *') : _customerName,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: textColor,
                                  ),
                                ),
                              ),
                              IconButton(
                                onPressed: _showAddPartySheet,
                                icon: Icon(LucideIcons.userPlus, size: 18, color: primaryColor),
                                tooltip: widget.kind == 'purchase' ? 'Add New Party / Supplier' : 'Add New Party / Customer',
                                constraints: const BoxConstraints(),
                                padding: const EdgeInsets.symmetric(horizontal: 6),
                              ),
                              const SizedBox(width: 2),
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
                                          widget.kind == 'purchase' ? 'PURCHASE OPTIONS' : 'SALE OPTIONS',
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
                                              _saveDraft();
                                            },
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    TextField(
                                      controller: _notesController,
                                      style: TextStyle(fontSize: 13, color: textColor),
                                      onChanged: (_) => _saveDraft(),
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
                                SmartImageWidget(
                                  imageUrl: _getProductImageUrl(product),
                                  width: 38,
                                  height: 38,
                                  fit: BoxFit.cover,
                                  borderRadius: BorderRadius.circular(19),
                                  fallbackWidget: Container(
                                    width: 38,
                                    height: 38,
                                    decoration: BoxDecoration(
                                      color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(LucideIcons.box, size: 18, color: labelColor),
                                  ),
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
                        constraints: const BoxConstraints(maxHeight: 450),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: borderColor),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Search Field & Add Party Button inside Dropdown Header
                            Padding(
                              padding: const EdgeInsets.all(10.0),
                              child: Row(
                                children: [
                                  Expanded(
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
                                  const SizedBox(width: 8),
                                  InkWell(
                                    onTap: _showAddPartySheet,
                                    borderRadius: BorderRadius.circular(14),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: primaryColor.withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                      child: Row(
                                        children: [
                                          Icon(LucideIcons.userPlus, size: 14, color: primaryColor),
                                          const SizedBox(width: 4),
                                          Text(
                                            'Add Party',
                                            style: TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                              color: primaryColor,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Divider(height: 1),

                            // Add New Party / Customer Action Option
                            ListTile(
                              dense: true,
                              leading: Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: primaryColor.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(LucideIcons.plus, size: 14, color: primaryColor),
                              ),
                              title: Text(
                                widget.kind == 'purchase' ? '+ Add New Party / Supplier' : '+ Add New Party / Customer',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: primaryColor),
                              ),
                              subtitle: Text(widget.kind == 'purchase' ? 'Create supplier and attach to purchase' : 'Create party and attach to transaction', style: TextStyle(fontSize: 10, color: labelColor)),
                              onTap: _showAddPartySheet,
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
                              title: Text(widget.kind == 'purchase' ? 'Walk-in Supplier' : 'Walk-in Customer', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              subtitle: Text(widget.kind == 'purchase' ? 'Default general supplier' : 'Default general customer', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                              trailing: _customerName == (widget.kind == 'purchase' ? 'Walk-in Supplier' : 'Walk-in Customer') ? Icon(LucideIcons.check, size: 16, color: primaryColor) : null,
                              onTap: () {
                                setState(() {
                                  _customerId = null;
                                  _customerName = widget.kind == 'purchase' ? 'Walk-in Supplier' : 'Walk-in Customer';
                                  _customerMobile = '';
                                  _showCustomerDropdown = false;
                                });
                                _saveDraft();
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
                        tooltip: widget.initialSale != null
                            ? 'Back to Edit Sale'
                            : (widget.initialPurchase != null
                                ? 'Back to Edit Purchase'
                                : (widget.kind == 'sale' ? 'Back to New Sale' : 'Back to New Purchase')),
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
                              Builder(
                                builder: (context) {
                                  String? itemImageUrl;
                                  try {
                                    final products = context.read<WholesaleCubit>().state.products;
                                    final matched = products.firstWhere((p) => p.id == item.productId);
                                    itemImageUrl = _getProductImageUrl(matched);
                                  } catch (_) {}

                                  return SmartImageWidget(
                                    imageUrl: itemImageUrl,
                                    width: 34,
                                    height: 34,
                                    fit: BoxFit.cover,
                                    borderRadius: BorderRadius.circular(17),
                                    fallbackWidget: Container(
                                      width: 34,
                                      height: 34,
                                      decoration: BoxDecoration(
                                        color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(LucideIcons.box, size: 16, color: labelColor),
                                    ),
                                  );
                                },
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
                  onChanged: (_) => _saveDraft(),
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
                                _saveDraft();
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
                                _saveDraft();
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
                              _saveDraft();
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
                                onChanged: (val) {
                                  setState(() => _paymentMethod = val!);
                                  _saveDraft();
                                },
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
                  child: Row(
                    children: [
                      const Icon(LucideIcons.alertTriangle, size: 14, color: Color(0xFFC2410C)),
                      const SizedBox(width: 8),
                      Text(
                        widget.kind == 'purchase' ? 'Select supplier before completing purchase' : 'Select customer before completing sale',
                        style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Color(0xFFC2410C)),
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
                      onPressed: _isSaving ? null : () => _executeSale(),
                      icon: _isSaving
                          ? const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : const Icon(LucideIcons.checkCircle, size: 16, color: Colors.white),
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
                      onPressed: _isSaving ? null : () => _executeSale(shareReceipt: true),
                      icon: _isSaving
                          ? SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(color: textColor, strokeWidth: 2),
                            )
                          : Icon(LucideIcons.messageCircle, size: 14, color: textColor),
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
                      onPressed: _isSaving ? null : () => _executeSale(printReceipt: true),
                      icon: _isSaving
                          ? SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(color: textColor, strokeWidth: 2),
                            )
                          : Icon(LucideIcons.printer, size: 14, color: textColor),
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
