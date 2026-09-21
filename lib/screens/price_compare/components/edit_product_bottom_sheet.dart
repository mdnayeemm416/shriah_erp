import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../blocs/price_compare/price_compare_cubit.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/price_compare_models.dart';
import '../../wholesale/components/online_image_search_dialog.dart';
import 'product_info_section.dart';
import 'purchase_info_section.dart';

class EditProductBottomSheet extends StatefulWidget {
  final PriceCompareProductModel product;

  const EditProductBottomSheet({
    super.key,
    required this.product,
  });

  static Future<bool?> show(
    BuildContext context, {
    required PriceCompareProductModel product,
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => EditProductBottomSheet(product: product),
    );
  }

  @override
  State<EditProductBottomSheet> createState() => _EditProductBottomSheetState();
}

class _EditProductBottomSheetState extends State<EditProductBottomSheet> {
  late final TextEditingController _nameController;
  late final TextEditingController _barcodeController;
  late final TextEditingController _salePriceController;
  late final TextEditingController _categoryController;
  late final TextEditingController _notesController;
  final ImagePicker _picker = ImagePicker();

  String? _selectedImagePath;
  String? _selectedPdfPath;
  final List<CompanyPurchaseEntry> _purchases = [];
  final List<String> _existingEntryIds = [];
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.product.productName);
    _barcodeController = TextEditingController(text: widget.product.barcode ?? '');
    _categoryController = TextEditingController(text: widget.product.category ?? '');
    _notesController = TextEditingController(text: widget.product.notes ?? '');
    _salePriceController = TextEditingController(
      text: widget.product.sellingPrice > 0
          ? (widget.product.sellingPrice % 1 == 0
              ? widget.product.sellingPrice.toInt().toString()
              : widget.product.sellingPrice.toStringAsFixed(2))
          : '',
    );
    _selectedImagePath = widget.product.productImageUrl;
    _selectedPdfPath = widget.product.productPdfUrl;

    // Pre-populate with existing company purchases
    if (widget.product.history.isNotEmpty) {
      for (final h in widget.product.history) {
        _existingEntryIds.add(h.id);
        _purchases.add(
          CompanyPurchaseEntry(
            companyController: TextEditingController(text: h.vendorName),
            priceController: TextEditingController(
              text: h.purchasePrice % 1 == 0
                  ? h.purchasePrice.toInt().toString()
                  : h.purchasePrice.toStringAsFixed(2),
            ),
            quantityController: TextEditingController(
              text: h.quantity != null && h.quantity! > 0 ? h.quantity!.toString() : '',
            ),
            notesController: TextEditingController(text: h.notes ?? ''),
            date: h.purchaseDate != null
                ? (DateTime.tryParse(h.purchaseDate!) ?? DateTime.now())
                : DateTime.now(),
            attachmentName: (h.slipImageUrl ?? h.slipPdfUrl)?.split('/').last,
            slipImagePath: h.slipImageUrl,
            slipPdfPath: h.slipPdfUrl,
            isExpanded: false,
          ),
        );
      }
    } else {
      _purchases.add(
        CompanyPurchaseEntry(
          companyController: TextEditingController(),
          priceController: TextEditingController(),
          date: DateTime.now(),
          isExpanded: false,
        ),
      );
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _barcodeController.dispose();
    _salePriceController.dispose();
    _categoryController.dispose();
    _notesController.dispose();
    for (final p in _purchases) {
      p.companyController.dispose();
      p.priceController.dispose();
      p.quantityController.dispose();
      p.notesController.dispose();
    }
    super.dispose();
  }

  Future<void> _handlePickPdf() async {
    try {
      final result = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
      );
      if (result != null && result.files.isNotEmpty) {
        setState(() {
          _selectedPdfPath = result.files.first.path;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to pick PDF: $e')),
        );
      }
    }
  }

  void _handleRemovePdf() {
    setState(() {
      _selectedPdfPath = null;
    });
  }

  void _addAnotherCompany() {
    setState(() {
      for (final p in _purchases) {
        p.isExpanded = false;
      }
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

  void _removeCompany(int index) {
    if (_purchases.length <= 1) return;
    setState(() {
      final removed = _purchases.removeAt(index);
      removed.companyController.dispose();
      removed.priceController.dispose();
      removed.quantityController.dispose();
      removed.notesController.dispose();
      if (index < _existingEntryIds.length) {
        _existingEntryIds.removeAt(index);
      }
    });
  }

  void _toggleExpand(int index) {
    setState(() {
      final willBeExpanded = !_purchases[index].isExpanded;
      for (int i = 0; i < _purchases.length; i++) {
        _purchases[i].isExpanded = false;
      }
      _purchases[index].isExpanded = willBeExpanded;
    });
  }

  Future<void> _pickDate(int index) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _purchases[index].date,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF23B386),
              onPrimary: Colors.white,
              onSurface: Color(0xFF0F172A),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _purchases[index].date = picked;
      });
    }
  }

  void _attachMemo(int index) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showModalBottomSheet(
      context: context,
      backgroundColor: isDark ? AppColors.cardDark : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Text(
                  'Attach Purchase Slip / Memo',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                  ),
                ),
              ),
              Divider(height: 1, color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
              ListTile(
                leading: const Icon(LucideIcons.camera, color: Color(0xFF23B386)),
                title: Text(
                  'Take Photo of Slip',
                  style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                ),
                onTap: () async {
                  Navigator.pop(ctx);
                  try {
                    final picked = await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);
                    if (picked != null) {
                      setState(() {
                        _purchases[index].slipImagePath = picked.path;
                        _purchases[index].slipPdfPath = null;
                        _purchases[index].attachmentName = picked.name;
                      });
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
                    }
                  }
                },
              ),
              ListTile(
                leading: const Icon(LucideIcons.image, color: Color(0xFF3B82F6)),
                title: Text(
                  'Choose Slip from Gallery',
                  style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                ),
                onTap: () async {
                  Navigator.pop(ctx);
                  try {
                    final picked = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
                    if (picked != null) {
                      setState(() {
                        _purchases[index].slipImagePath = picked.path;
                        _purchases[index].slipPdfPath = null;
                        _purchases[index].attachmentName = picked.name;
                      });
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
                    }
                  }
                },
              ),
              ListTile(
                leading: const Icon(LucideIcons.fileText, color: Color(0xFFEF4444)),
                title: Text(
                  'Upload PDF Invoice / Slip',
                  style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                ),
                onTap: () async {
                  Navigator.pop(ctx);
                  try {
                    final result = await FilePicker.pickFiles(
                      type: FileType.custom,
                      allowedExtensions: ['pdf'],
                    );
                    if (result != null && result.files.isNotEmpty) {
                      final path = result.files.first.path;
                      if (path != null) {
                        setState(() {
                          _purchases[index].slipPdfPath = path;
                          _purchases[index].slipImagePath = null;
                          _purchases[index].attachmentName = result.files.first.name;
                        });
                      }
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
                    }
                  }
                },
              ),
              if (_purchases[index].attachmentName != null)
                ListTile(
                  leading: const Icon(LucideIcons.trash2, color: Colors.grey),
                  title: Text(
                    'Remove Attachment',
                    style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                  ),
                  onTap: () {
                    Navigator.pop(ctx);
                    setState(() {
                      _purchases[index].slipImagePath = null;
                      _purchases[index].slipPdfPath = null;
                      _purchases[index].attachmentName = null;
                    });
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleFindOnline() async {
    final query = _nameController.text.trim();
    if (query.isEmpty) return;

    final List<String>? selectedUrls = await showDialog<List<String>>(
      context: context,
      builder: (ctx) => OnlineImageSearchDialog(initialQuery: query, maxAllowed: 1),
    );

    if (selectedUrls != null && selectedUrls.isNotEmpty) {
      setState(() {
        _selectedImagePath = selectedUrls.first;
      });
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
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
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
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  void _handleRemoveImage() {
    setState(() {
      _selectedImagePath = null;
    });
  }

  Future<void> _handleSave() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a product name'), backgroundColor: Color(0xFFEF4444)),
      );
      return;
    }

    final salePrice = double.tryParse(_salePriceController.text.trim()) ?? 0.0;

    setState(() {
      _isSaving = true;
    });

    try {
      // Check asset removal vs replacement for product
      final hadProductImage = widget.product.productImageUrl != null && widget.product.productImageUrl!.trim().isNotEmpty;
      final hasProductImage = _selectedImagePath != null && _selectedImagePath!.trim().isNotEmpty;
      final removeProductImage = hadProductImage && !hasProductImage;

      final hadProductPdf = widget.product.productPdfUrl != null && widget.product.productPdfUrl!.trim().isNotEmpty;
      final hasProductPdf = _selectedPdfPath != null && _selectedPdfPath!.trim().isNotEmpty;
      final removeProductPdf = hadProductPdf && !hasProductPdf;

      final productParams = CreatePriceCompareProductParams(
        id: widget.product.id,
        productName: name,
        sellingPrice: salePrice,
        barcode: _barcodeController.text.trim().isNotEmpty
            ? _barcodeController.text.trim()
            : widget.product.barcode,
        category: _categoryController.text.trim().isNotEmpty
            ? _categoryController.text.trim()
            : widget.product.category,
        erpProductId: widget.product.erpProductId,
        notes: _notesController.text.trim().isNotEmpty
            ? _notesController.text.trim()
            : widget.product.notes,
        productImagePath: hasProductImage ? _selectedImagePath : null,
        productPdfPath: hasProductPdf ? _selectedPdfPath : null,
        removeProductImage: removeProductImage ? true : null,
        removeProductPdf: removeProductPdf ? true : null,
      );

      final success = await context.read<PriceCompareCubit>().updateProduct(
        widget.product.id,
        productParams,
      );

      if (!mounted) return;

      if (success) {
        // Save/Update company quotes entered
        for (int i = 0; i < _purchases.length; i++) {
          final p = _purchases[i];
          final compName = p.companyController.text.trim();
          final pPrice = double.tryParse(p.priceController.text.trim()) ?? 0.0;
          final qty = double.tryParse(p.quantityController.text.trim());
          final notes = p.notesController.text.trim();
          final dateStr = DateFormat('yyyy-MM-dd').format(p.date);

          if (compName.isNotEmpty || pPrice > 0) {
            bool? remSlipImg;
            bool? remSlipPdf;
            if (i < widget.product.history.length) {
              final orig = widget.product.history[i];
              final hadSlipImg = orig.slipImageUrl != null && orig.slipImageUrl!.trim().isNotEmpty;
              final hasSlipImg = p.slipImagePath != null && p.slipImagePath!.trim().isNotEmpty;
              if (hadSlipImg && !hasSlipImg) remSlipImg = true;

              final hadSlipPdf = orig.slipPdfUrl != null && orig.slipPdfUrl!.trim().isNotEmpty;
              final hasSlipPdf = p.slipPdfPath != null && p.slipPdfPath!.trim().isNotEmpty;
              if (hadSlipPdf && !hasSlipPdf) remSlipPdf = true;
            }

            final entryParams = CreatePriceCompareEntryParams(
              productId: widget.product.id,
              vendorName: compName.isNotEmpty ? compName : 'Vendor #${i + 1}',
              purchasePrice: pPrice,
              purchaseDate: dateStr,
              sellingPrice: salePrice > 0 ? salePrice : null,
              quantity: qty,
              slipImagePath: p.slipImagePath != null && p.slipImagePath!.trim().isNotEmpty ? p.slipImagePath : null,
              slipPdfPath: p.slipPdfPath != null && p.slipPdfPath!.trim().isNotEmpty ? p.slipPdfPath : null,
              removeSlipImage: remSlipImg,
              removeSlipPdf: remSlipPdf,
              notes: notes.isNotEmpty ? notes : null,
            );

            if (i < _existingEntryIds.length) {
              // Update existing entry
              try {
                await context.read<PriceCompareCubit>().updatePurchaseEntry(
                  _existingEntryIds[i],
                  entryParams,
                );
              } catch (_) {}
            } else {
              // Add new entry
              try {
                await context.read<PriceCompareCubit>().addPurchaseEntry(entryParams);
              } catch (_) {}
            }
          }
        }

        if (!mounted) return;
        Navigator.pop(context, true);
      } else {
        if (!mounted) return;
        final err = context.read<PriceCompareCubit>().state.errorMessage ?? 'Failed to update product';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(err), backgroundColor: const Color(0xFFEF4444)),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: const Color(0xFFEF4444)),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final maxHeight = MediaQuery.of(context).size.height * 0.92;

    return Container(
      constraints: BoxConstraints(maxHeight: maxHeight),
      decoration: BoxDecoration(
        color: isDark ? AppColors.bgDark : const Color(0xFFF8FAFC),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
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
                color: isDark ? AppColors.borderDark : const Color(0xFFCBD5E1),
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
                const SizedBox(width: 36),
                Text(
                  'Edit Product',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                  ),
                ),
                IconButton(
                  onPressed: _isSaving ? null : () => Navigator.pop(context),
                  icon: Icon(
                    LucideIcons.x,
                    size: 20,
                    color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                  ),
                  splashRadius: 20,
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Text(
              'Save product details once, then add unlimited company prices.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12.5,
                color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Divider(
            height: 1,
            color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
          ),

          // Scrollable Form Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: Column(
                children: [
                  // Product Information Card (Matches Add Product)
                  ProductInfoSection(
                    nameController: _nameController,
                    barcodeController: _barcodeController,
                    salePriceController: _salePriceController,
                    categoryController: _categoryController,
                    notesController: _notesController,
                    selectedImagePath: _selectedImagePath,
                    selectedPdfPath: _selectedPdfPath,
                    onScanBarcode: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Opening scanner...')),
                      );
                    },
                    onCamera: _handleCamera,
                    onGallery: _handleGallery,
                    onFindOnline: _handleFindOnline,
                    onRemoveImage: _handleRemoveImage,
                    onPickPdf: _handlePickPdf,
                    onRemovePdf: _handleRemovePdf,
                  ),
                  const SizedBox(height: 16),

                  // Purchase Information Section (Matches Add Product)
                  PurchaseInfoSection(
                    purchases: _purchases,
                    onAddCompany: _addAnotherCompany,
                    onToggleExpand: _toggleExpand,
                    onPickDate: _pickDate,
                    onAttachMemo: _attachMemo,
                    onRemoveCompany: _removeCompany,
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),

          // Bottom Action Buttons: [ Update Product ] & [ Cancel ]
          Container(
            padding: EdgeInsets.fromLTRB(16, 12, 16, MediaQuery.of(context).padding.bottom + 12),
            decoration: BoxDecoration(
              color: isDark ? AppColors.cardDark : Colors.white,
              border: Border(
                top: BorderSide(
                  color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                ),
              ),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
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
                    onPressed: _isSaving ? null : _handleSave,
                    child: _isSaving
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                          )
                        : const Text(
                            'Update Product',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                          ),
                  ),
                ),
                const SizedBox(height: 8),

                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                      foregroundColor: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                      side: BorderSide(
                        color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    ),
                    onPressed: _isSaving ? null : () => Navigator.pop(context),
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
