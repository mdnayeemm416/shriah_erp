import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../wholesale/components/online_image_search_dialog.dart';
import '../models/price_compare_models.dart';
import 'product_info_section.dart';
import 'purchase_info_section.dart';

class AddProductBottomSheet extends StatefulWidget {
  final Function(PriceCompareProduct) onSave;

  const AddProductBottomSheet({
    super.key,
    required this.onSave,
  });

  static Future<void> show(BuildContext context, {required Function(PriceCompareProduct) onSave}) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AddProductBottomSheet(onSave: onSave),
    );
  }

  @override
  State<AddProductBottomSheet> createState() => _AddProductBottomSheetState();
}

class _AddProductBottomSheetState extends State<AddProductBottomSheet> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _barcodeController = TextEditingController();
  final TextEditingController _salePriceController = TextEditingController();
  final ImagePicker _picker = ImagePicker();

  String? _selectedImagePath;
  final List<CompanyPurchaseEntry> _purchases = [];

  @override
  void initState() {
    super.initState();
    // Default with 1 company purchase entry as shown in screenshot
    _purchases.add(
      CompanyPurchaseEntry(
        companyController: TextEditingController(),
        priceController: TextEditingController(),
        date: DateTime(2026, 9, 20),
        isExpanded: true,
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _barcodeController.dispose();
    _salePriceController.dispose();
    for (final p in _purchases) {
      p.companyController.dispose();
      p.priceController.dispose();
    }
    super.dispose();
  }

  void _addAnotherCompany() {
    setState(() {
      _purchases.add(
        CompanyPurchaseEntry(
          companyController: TextEditingController(),
          priceController: TextEditingController(),
          date: DateTime.now(),
          isExpanded: true,
        ),
      );
    });
  }

  void _toggleExpand(int index) {
    setState(() {
      _purchases[index].isExpanded = !_purchases[index].isExpanded;
    });
  }

  Future<void> _pickDate(int index) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _purchases[index].date,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        _purchases[index].date = picked;
      });
    }
  }

  void _attachMemo(int index) {
    setState(() {
      _purchases[index].attachmentName = 'invoice_receipt_${index + 1}.pdf';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Memo attached successfully')),
    );
  }

  Future<void> _handleFindOnline() async {
    final query = _nameController.text.trim();
    if (query.isEmpty) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(LucideIcons.info, color: Color(0xFF23B386), size: 20),
              SizedBox(width: 8),
              Text('Product Name Required', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: const Text(
            'Please write the product name first before searching for images online.',
            style: TextStyle(fontSize: 14, color: Color(0xFF475569)),
          ),
          actions: [
            ElevatedButton(
              onPressed: () => Navigator.pop(ctx),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF23B386),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    final List<String>? selectedUrls = await showDialog<List<String>>(
      context: context,
      builder: (ctx) => OnlineImageSearchDialog(
        initialQuery: query,
        maxAllowed: 1,
      ),
    );

    if (selectedUrls != null && selectedUrls.isNotEmpty) {
      setState(() {
        _selectedImagePath = selectedUrls.first;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Product image selected from online!'),
            backgroundColor: Color(0xFF23B386),
            duration: Duration(seconds: 2),
          ),
        );
      }
    }
  }

  Future<void> _handleCamera() async {
    try {
      final picked = await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);
      if (picked != null) {
        setState(() {
          _selectedImagePath = picked.path;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error taking picture: $e')),
        );
      }
    }
  }

  Future<void> _handleGallery() async {
    try {
      final picked = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
      if (picked != null) {
        setState(() {
          _selectedImagePath = picked.path;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error selecting image: $e')),
        );
      }
    }
  }

  void _handleRemoveImage() {
    setState(() {
      _selectedImagePath = null;
    });
  }

  void _handleSave() {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a product name')),
      );
      return;
    }

    final salePrice = double.tryParse(_salePriceController.text.trim()) ?? 0.0;
    final purchaseItems = <CompanyPurchaseItem>[];

    for (int i = 0; i < _purchases.length; i++) {
      final p = _purchases[i];
      final compName = p.companyController.text.trim();
      final pPrice = double.tryParse(p.priceController.text.trim()) ?? 0.0;
      if (compName.isNotEmpty || pPrice > 0) {
        purchaseItems.add(
          CompanyPurchaseItem(
            id: 'purchase_${DateTime.now().millisecondsSinceEpoch}_$i',
            companyName: compName.isNotEmpty ? compName : 'Company #${i + 1}',
            purchasePrice: pPrice,
            memoDate: p.date,
            memoAttachment: p.attachmentName,
          ),
        );
      }
    }

    final newProduct = PriceCompareProduct(
      id: 'prod_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      barcode: _barcodeController.text.trim(),
      salePrice: salePrice,
      imagePath: _selectedImagePath,
      purchases: purchaseItems,
    );

    widget.onSave(newProduct);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final maxHeight = MediaQuery.of(context).size.height * 0.92;

    return Container(
      constraints: BoxConstraints(maxHeight: maxHeight),
      decoration: const BoxDecoration(
        color: Color(0xFFF8FAFC),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag Handle
          const SizedBox(height: 10),
          Center(
            child: Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 6),

          // Header with Close Button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SizedBox(width: 36), // Balance title
                const Text(
                  'Add Product',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(LucideIcons.x, size: 20, color: Color(0xFF64748B)),
                  splashRadius: 20,
                ),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24),
            child: Text(
              'Save product details once, then add unlimited company prices.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
            ),
          ),
          const SizedBox(height: 12),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),

          // Scrollable Form Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: Column(
                children: [
                  // Product Information Card
                  ProductInfoSection(
                    nameController: _nameController,
                    barcodeController: _barcodeController,
                    salePriceController: _salePriceController,
                    selectedImagePath: _selectedImagePath,
                    onScanBarcode: () {
                      setState(() {
                        _barcodeController.text = '6281001234567';
                      });
                    },
                    onCamera: _handleCamera,
                    onGallery: _handleGallery,
                    onFindOnline: _handleFindOnline,
                    onRemoveImage: _handleRemoveImage,
                  ),
                  const SizedBox(height: 16),

                  // Purchase Information Section
                  PurchaseInfoSection(
                    purchases: _purchases,
                    onAddCompany: _addAnotherCompany,
                    onToggleExpand: _toggleExpand,
                    onPickDate: _pickDate,
                    onAttachMemo: _attachMemo,
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),

          // Bottom Action Buttons
          Container(
            padding: EdgeInsets.fromLTRB(16, 12, 16, MediaQuery.of(context).padding.bottom + 12),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Save Product Button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF23B386),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    ),
                    onPressed: _handleSave,
                    child: const Text(
                      'Save Product',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
                const SizedBox(height: 8),

                // Cancel Button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF0F172A),
                      side: const BorderSide(color: Color(0xFFE2E8F0)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text(
                      'Cancel',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
