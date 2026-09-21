import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../blocs/price_compare/price_compare_cubit.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/price_compare_models.dart';
import 'dashed_container.dart';

class AddVendorEntryDialog extends StatefulWidget {
  final String productId;
  final String productName;
  final double? currentSellingPrice;

  const AddVendorEntryDialog({
    super.key,
    required this.productId,
    required this.productName,
    this.currentSellingPrice,
  });

  static Future<bool?> show(
    BuildContext context, {
    required String productId,
    required String productName,
    double? currentSellingPrice,
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AddVendorEntryDialog(
        productId: productId,
        productName: productName,
        currentSellingPrice: currentSellingPrice,
      ),
    );
  }

  @override
  State<AddVendorEntryDialog> createState() => _AddVendorEntryDialogState();
}

class _AddVendorEntryDialogState extends State<AddVendorEntryDialog> {
  final TextEditingController _vendorController = TextEditingController();
  final TextEditingController _priceController = TextEditingController();
  final TextEditingController _sellingPriceController = TextEditingController();
  final TextEditingController _quantityController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  DateTime _selectedDate = DateTime.now();
  String? _slipImagePath;
  String? _slipPdfPath;
  String? _attachmentName;
  bool _isSaving = false;

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    if (widget.currentSellingPrice != null && widget.currentSellingPrice! > 0) {
      _sellingPriceController.text = widget.currentSellingPrice!.toStringAsFixed(2);
    }
  }

  @override
  void dispose() {
    _vendorController.dispose();
    _priceController.dispose();
    _sellingPriceController.dispose();
    _quantityController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  void _attachSlip() {
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
                  'Attach Purchase Slip / Invoice',
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
                        _slipImagePath = picked.path;
                        _slipPdfPath = null;
                        _attachmentName = picked.name;
                      });
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Failed to take photo: $e')),
                      );
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
                        _slipImagePath = picked.path;
                        _slipPdfPath = null;
                        _attachmentName = picked.name;
                      });
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Failed to pick image: $e')),
                      );
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
                          _slipPdfPath = path;
                          _slipImagePath = null;
                          _attachmentName = result.files.first.name;
                        });
                      }
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Failed to pick PDF: $e')),
                      );
                    }
                  }
                },
              ),
              if (_attachmentName != null)
                ListTile(
                  leading: const Icon(LucideIcons.trash2, color: Colors.grey),
                  title: Text(
                    'Remove Attachment',
                    style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                  ),
                  onTap: () {
                    Navigator.pop(ctx);
                    setState(() {
                      _slipImagePath = null;
                      _slipPdfPath = null;
                      _attachmentName = null;
                    });
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleSave() async {
    final vendor = _vendorController.text.trim();
    if (vendor.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a vendor/company name'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
      return;
    }

    final price = double.tryParse(_priceController.text.trim()) ?? 0.0;
    if (price <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a valid purchase price'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
      return;
    }

    final qty = double.tryParse(_quantityController.text.trim());
    final sellingPrice = double.tryParse(_sellingPriceController.text.trim());
    final notes = _notesController.text.trim();
    final dateStr = DateFormat('yyyy-MM-dd').format(_selectedDate);

    setState(() {
      _isSaving = true;
    });

    try {
      final params = CreatePriceCompareEntryParams(
        productId: widget.productId,
        vendorName: vendor,
        purchasePrice: price,
        purchaseDate: dateStr,
        quantity: qty,
        sellingPrice: sellingPrice,
        slipImagePath: _slipImagePath,
        slipPdfPath: _slipPdfPath,
        notes: notes.isNotEmpty ? notes : null,
      );

      final success = await context.read<PriceCompareCubit>().addPurchaseEntry(params);

      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Vendor purchase for '$vendor' recorded successfully"),
            backgroundColor: const Color(0xFF23B386),
          ),
        );
        Navigator.pop(context, true);
      } else {
        final err = context.read<PriceCompareCubit>().state.errorMessage ?? 'Failed to record entry';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(err),
            backgroundColor: const Color(0xFFEF4444),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: const Color(0xFFEF4444),
          ),
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
    final maxHeight = MediaQuery.of(context).size.height * 0.88;

    return Container(
      constraints: BoxConstraints(maxHeight: maxHeight),
      decoration: BoxDecoration(
        color: isDark ? AppColors.bgDark : const Color(0xFFF8FAFC),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
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
          const SizedBox(height: 8),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SizedBox(width: 36),
                Column(
                  children: [
                    Text(
                      'Add Vendor Price',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      widget.productName,
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
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
          const SizedBox(height: 10),
          Divider(
            height: 1,
            color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
          ),

          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(16, 16, 16, bottomInset + 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Vendor Name
                  Text(
                    'Vendor / Company Name *',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    height: 48,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.inputDark : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                    ),
                    child: TextField(
                      controller: _vendorController,
                      style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                      decoration: const InputDecoration(
                        hintText: 'e.g. Danube Hypermarket, Dire Wholesale',
                        hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Purchase Price & Purchase Date
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Purchase Price *',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              height: 48,
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.inputDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                              ),
                              child: TextField(
                                controller: _priceController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                                decoration: const InputDecoration(
                                  hintText: 'SAR 0.00',
                                  hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Purchase Date *',
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
                                height: 48,
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.inputDark : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 14),
                                alignment: Alignment.centerLeft,
                                child: Text(
                                  DateFormat('yyyy-MM-dd').format(_selectedDate),
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Quantity & Selling Price
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Quantity',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              height: 48,
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.inputDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                              ),
                              child: TextField(
                                controller: _quantityController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                                decoration: const InputDecoration(
                                  hintText: 'e.g. 50',
                                  hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Selling Price',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              height: 48,
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.inputDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                              ),
                              child: TextField(
                                controller: _sellingPriceController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                                decoration: const InputDecoration(
                                  hintText: 'SAR 0.00',
                                  hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
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

                  // Slip / Memo Upload
                  Text(
                    'Slip Image or PDF Document',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 6),
                  GestureDetector(
                    onTap: _attachSlip,
                    child: DashedContainer(
                      borderRadius: 16,
                      color: isDark ? AppColors.borderDark : const Color(0xFFCBD5E1),
                      padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
                      child: Center(
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _slipPdfPath != null
                                  ? LucideIcons.fileText
                                  : LucideIcons.camera,
                              size: 18,
                              color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                            ),
                            const SizedBox(width: 8),
                            Flexible(
                              child: Text(
                                _attachmentName ?? 'Attach slip image or PDF',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                  color: isDark ? AppColors.mutedFgDark : const Color(0xFF475569),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Notes
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
                    height: 48,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.inputDark : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                    ),
                    child: TextField(
                      controller: _notesController,
                      style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                      decoration: const InputDecoration(
                        hintText: 'e.g. Promotional quote, bulk deal',
                        hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Submit Button
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
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                color: Colors.white,
                              ),
                            )
                          : const Text(
                              'Save Vendor Price',
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
