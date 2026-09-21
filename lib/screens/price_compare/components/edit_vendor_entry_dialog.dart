import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../blocs/price_compare/price_compare_cubit.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/price_compare_models.dart';
import '../../common_widgets/smart_image_widget.dart';
import 'dashed_container.dart';
import 'pdf_viewer_screen.dart';
import 'vendor_autocomplete_field.dart';

class EditVendorEntryDialog extends StatefulWidget {
  final PriceCompareEntryModel entry;
  final String productName;

  const EditVendorEntryDialog({
    super.key,
    required this.entry,
    required this.productName,
  });

  static Future<bool?> show(
    BuildContext context, {
    required PriceCompareEntryModel entry,
    required String productName,
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => EditVendorEntryDialog(
        entry: entry,
        productName: productName,
      ),
    );
  }

  @override
  State<EditVendorEntryDialog> createState() => _EditVendorEntryDialogState();
}

class _EditVendorEntryDialogState extends State<EditVendorEntryDialog> {
  late DateTime _selectedDate;
  late final TextEditingController _marketShopController;
  late final TextEditingController _supplierController;
  late final TextEditingController _purchaseController;
  late final TextEditingController _sellingController;
  late final TextEditingController _offerController;
  late final TextEditingController _notesController;

  String? _slipImagePath;
  String? _slipPdfPath;
  bool _isSaving = false;

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _selectedDate = widget.entry.purchaseDate != null
        ? (DateTime.tryParse(widget.entry.purchaseDate!) ?? DateTime.now())
        : DateTime.now();
    _marketShopController = TextEditingController(text: widget.entry.marketShop ?? '');
    _supplierController = TextEditingController(text: widget.entry.vendorName);
    _purchaseController = TextEditingController(
      text: widget.entry.purchasePrice > 0
          ? (widget.entry.purchasePrice % 1 == 0
              ? widget.entry.purchasePrice.toInt().toString()
              : widget.entry.purchasePrice.toStringAsFixed(2))
          : '',
    );
    _sellingController = TextEditingController(
      text: widget.entry.sellingPrice != null && widget.entry.sellingPrice! > 0
          ? (widget.entry.sellingPrice! % 1 == 0
              ? widget.entry.sellingPrice!.toInt().toString()
              : widget.entry.sellingPrice!.toStringAsFixed(2))
          : '',
    );
    _offerController = TextEditingController(
      text: widget.entry.offerPrice != null && widget.entry.offerPrice! > 0
          ? (widget.entry.offerPrice! % 1 == 0
              ? widget.entry.offerPrice!.toInt().toString()
              : widget.entry.offerPrice!.toStringAsFixed(2))
          : '',
    );
    _notesController = TextEditingController(text: widget.entry.notes ?? '');
    _slipImagePath = widget.entry.slipImageUrl;
    _slipPdfPath = widget.entry.slipPdfUrl;
  }

  @override
  void dispose() {
    _marketShopController.dispose();
    _supplierController.dispose();
    _purchaseController.dispose();
    _sellingController.dispose();
    _offerController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
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
        _selectedDate = picked;
      });
    }
  }

  void _attachPhoto() {
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
                  'Attach Product Photo / Slip',
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
                  'Take Photo',
                  style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                ),
                onTap: () async {
                  Navigator.pop(ctx);
                  try {
                    final picked = await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);
                    if (picked != null) {
                      setState(() {
                        _slipImagePath = picked.path;
                        _slipPdfPath = null;
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
                  'Choose from Gallery',
                  style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                ),
                onTap: () async {
                  Navigator.pop(ctx);
                  try {
                    final picked = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
                    if (picked != null) {
                      setState(() {
                        _slipImagePath = picked.path;
                        _slipPdfPath = null;
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
                  'Upload PDF Slip',
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
                          _slipPdfPath = path;
                          _slipImagePath = null;
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
              if (_slipImagePath != null || _slipPdfPath != null)
                ListTile(
                  leading: const Icon(LucideIcons.trash2, color: Colors.grey),
                  title: Text(
                    'Remove Photo',
                    style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                  ),
                  onTap: () {
                    Navigator.pop(ctx);
                    setState(() {
                      _slipImagePath = null;
                      _slipPdfPath = null;
                    });
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleUpdate() async {
    final supplier = _supplierController.text.trim();
    if (supplier.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter supplier name'), backgroundColor: Color(0xFFEF4444)),
      );
      return;
    }

    final purchase = double.tryParse(_purchaseController.text.trim()) ?? 0.0;
    if (purchase <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter valid purchase price'), backgroundColor: Color(0xFFEF4444)),
      );
      return;
    }

    setState(() {
      _isSaving = true;
    });

    try {
      final selling = double.tryParse(_sellingController.text.trim());
      final offer = double.tryParse(_offerController.text.trim());
      final marketShop = _marketShopController.text.trim();
      final notes = _notesController.text.trim();
      final dateStr = DateFormat('yyyy-MM-dd').format(_selectedDate);

      // Check asset removal vs replacement
      final hadSlipImage = widget.entry.slipImageUrl != null && widget.entry.slipImageUrl!.trim().isNotEmpty;
      final hasSlipImage = _slipImagePath != null && _slipImagePath!.trim().isNotEmpty;
      final removeSlipImage = hadSlipImage && !hasSlipImage;

      final hadSlipPdf = widget.entry.slipPdfUrl != null && widget.entry.slipPdfUrl!.trim().isNotEmpty;
      final hasSlipPdf = _slipPdfPath != null && _slipPdfPath!.trim().isNotEmpty;
      final removeSlipPdf = hadSlipPdf && !hasSlipPdf;

      final params = CreatePriceCompareEntryParams(
        productId: widget.entry.productId,
        vendorName: supplier,
        purchasePrice: purchase,
        purchaseDate: dateStr,
        sellingPrice: selling,
        marketShop: marketShop.isNotEmpty ? marketShop : null,
        offerPrice: offer,
        slipImagePath: hasSlipImage ? _slipImagePath : null,
        slipPdfPath: hasSlipPdf ? _slipPdfPath : null,
        removeSlipImage: removeSlipImage ? true : null,
        removeSlipPdf: removeSlipPdf ? true : null,
        notes: notes.isNotEmpty ? notes : null,
      );

      final success = await context.read<PriceCompareCubit>().updatePurchaseEntry(widget.entry.id, params);

      if (!mounted) return;

      if (success) {
        Navigator.pop(context, true);
      } else {
        final err = context.read<PriceCompareCubit>().state.errorMessage ?? 'Failed to update record';
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
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    final maxHeight = MediaQuery.of(context).size.height * 0.92;

    return Container(
      constraints: BoxConstraints(maxHeight: maxHeight),
      decoration: BoxDecoration(
        color: isDark ? AppColors.bgDark : const Color(0xFFF8FAFC),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 12),

          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SizedBox(width: 24),
                Text(
                  'Edit Price Record',
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
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Divider(
            height: 1,
            color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
          ),

          // Form Body
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(16, 12, 16, bottomInset + 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Row 1: Date * & Market / Shop
                  Row(
                    children: [
                      // Date *
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Date *',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 6),
                            GestureDetector(
                              onTap: _pickDate,
                              child: Container(
                                height: 46,
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.inputDark : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: const Color(0xFF23B386), width: 1.5),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 12),
                                alignment: Alignment.centerLeft,
                                child: Text(
                                  DateFormat('MM/dd/yyyy').format(_selectedDate),
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),

                      // Market / Shop
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Market / Shop',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              height: 46,
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.inputDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                              ),
                              child: TextField(
                                controller: _marketShopController,
                                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Row 2: Supplier
                  Text(
                    'Supplier',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 6),
                  VendorAutocompleteField(
                    controller: _supplierController,
                    hintText: 'Search or type new supplier',
                  ),
                  const SizedBox(height: 14),

                  // Row 3: Purchase *, Selling, Offer
                  Row(
                    children: [
                      // Purchase *
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Purchase *',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              height: 46,
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.inputDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                              ),
                              child: TextField(
                                controller: _purchaseController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),

                      // Selling
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Selling',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              height: 46,
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.inputDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                              ),
                              child: TextField(
                                controller: _sellingController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),

                      // Offer
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Offer',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              height: 46,
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.inputDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                              ),
                              child: TextField(
                                controller: _offerController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Row 4: Notes
                  Text(
                    'Notes',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    height: 80,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.inputDark : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                    ),
                    child: TextField(
                      controller: _notesController,
                      maxLines: 3,
                      style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.all(12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Row 5: Product Photo
                  Text(
                    'Receipt / Slip Attachment',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 6),
                  if (_slipImagePath != null && _slipImagePath!.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.cardDark : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: SizedBox(
                              width: 56,
                              height: 56,
                              child: SmartImageWidget(
                                imageUrl: _slipImagePath!,
                                fit: BoxFit.cover,
                                fallbackWidget: const Icon(LucideIcons.image, color: Color(0xFF23B386)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Photo attached',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(LucideIcons.trash2, color: Color(0xFFEF4444), size: 18),
                            onPressed: () => setState(() => _slipImagePath = null),
                          ),
                        ],
                      ),
                    )
                  else if (_slipPdfPath != null && _slipPdfPath!.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF451A1A) : const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: isDark ? const Color(0xFF7F1D1D) : const Color(0xFFFECACA)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF7F1D1D).withValues(alpha: 0.5) : const Color(0xFFFEE2E2),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(LucideIcons.fileText, color: Color(0xFFEF4444), size: 24),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _slipPdfPath!.split('/').last,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                InkWell(
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => PdfViewerScreen(
                                          urlOrPath: _slipPdfPath!,
                                          title: '${widget.entry.vendorName} Receipt / Slip',
                                        ),
                                      ),
                                    );
                                  },
                                  child: const Text(
                                    'Tap to view PDF',
                                    style: TextStyle(fontSize: 12, color: Color(0xFF2563EB), fontWeight: FontWeight.w600),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(LucideIcons.trash2, color: Color(0xFFEF4444), size: 18),
                            onPressed: () => setState(() => _slipPdfPath = null),
                          ),
                        ],
                      ),
                    )
                  else
                    GestureDetector(
                      onTap: _attachPhoto,
                      child: DashedContainer(
                        borderRadius: 16,
                        color: isDark ? const Color(0xFF475569) : const Color(0xFFCBD5E1),
                        padding: const EdgeInsets.symmetric(vertical: 24),
                        child: Center(
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                LucideIcons.camera,
                                size: 18,
                                color: isDark ? AppColors.mutedFgDark : const Color(0xFF475569),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Add photo or PDF slip',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                  color: isDark ? AppColors.mutedFgDark : const Color(0xFF475569),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  const SizedBox(height: 24),

                  // Bottom Buttons: [ Update ] & [ Cancel ]
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
                      onPressed: _isSaving ? null : _handleUpdate,
                      child: _isSaving
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                            )
                          : const Text(
                              'Update',
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                            ),
                    ),
                  ),
                  const SizedBox(height: 10),

                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                        foregroundColor: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                        side: BorderSide(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                      ),
                      onPressed: _isSaving ? null : () => Navigator.pop(context),
                      child: const Text(
                        'Cancel',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
