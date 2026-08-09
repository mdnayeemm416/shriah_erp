import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';

import '../../../core/theme/app_colors.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../models/product_model.dart';
import '../../../repositories/product_repository.dart';
import '../../common_widgets/dashed_rounded_rect_painter.dart';
import '../../common_widgets/smart_image_widget.dart';
import 'category_searchable_dropdown.dart';
import 'online_image_search_dialog.dart';

class AddProductDialog extends StatefulWidget {
  final ProductModel? product;

  const AddProductDialog({super.key, this.product});

  @override
  State<AddProductDialog> createState() => _AddProductDialogState();
}

class _AddProductDialogState extends State<AddProductDialog> {
  final formKey = GlobalKey<FormState>();

  late final TextEditingController nameController;
  late final TextEditingController bnController;
  late final TextEditingController arController;
  late final TextEditingController barcodeController;
  late final TextEditingController priceController;
  late final TextEditingController costController;
  late final TextEditingController comparePriceController;
  late final TextEditingController taxController;
  late final TextEditingController stockController;
  late final TextEditingController minStockController;
  late final TextEditingController descriptionController;

  late List<String> _images;
  late List<String> _selectedCategories;

  late bool _isVisibleOnWebsite;
  late bool _isFeatured;
  late bool _showStock;

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    final p = widget.product;
    nameController = TextEditingController(text: p?.name ?? '');
    bnController = TextEditingController(text: p?.nameBn ?? '');
    arController = TextEditingController(text: p?.nameAr ?? '');
    barcodeController = TextEditingController(text: p?.barcode ?? p?.itemCode ?? '');
    priceController = TextEditingController(text: p != null ? p.price.toString() : '');
    costController = TextEditingController(text: p != null ? p.purchasePrice.toString() : '');
    comparePriceController = TextEditingController(text: p?.comparePrice != null ? p!.comparePrice.toString() : '');
    taxController = TextEditingController(text: p?.taxRate != null ? p!.taxRate.toString() : '15');
    stockController = TextEditingController(text: p != null ? p.stock.toString() : '');
    minStockController = TextEditingController(text: p?.minStock != null ? p!.minStock.toString() : '5');
    descriptionController = TextEditingController(text: p?.description ?? '');

    _selectedCategories = List<String>.from(p?.categoryIds ?? []);

    final initialImages = <String>[];
    if (p != null) {
      if (p.images != null && p.images!.isNotEmpty) {
        initialImages.addAll(p.images!);
      } else if (p.imageUrl != null && p.imageUrl!.isNotEmpty) {
        initialImages.add(p.imageUrl!);
      }
    }
    _images = initialImages;

    _isVisibleOnWebsite = p?.isVisibleOnWebsite ?? true;
    _isFeatured = p?.isFeatured ?? false;
    _showStock = p?.showStock ?? true;
  }

  @override
  void dispose() {
    nameController.dispose();
    bnController.dispose();
    arController.dispose();
    barcodeController.dispose();
    priceController.dispose();
    costController.dispose();
    comparePriceController.dispose();
    taxController.dispose();
    stockController.dispose();
    minStockController.dispose();
    descriptionController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      if (_images.length >= 6) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Maximum 6 images allowed.')),
        );
        return;
      }
      final XFile? file = await _picker.pickImage(
        source: source,
        imageQuality: 85,
        maxWidth: 1024,
      );
      if (file != null) {
        setState(() {
          _images.add(file.path);
        });
      }
    } catch (e) {
      debugPrint('Error picking image: $e');
    }
  }

  Future<void> _showFindImageDialog() async {
    if (_images.length >= 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Maximum 6 images allowed.')),
      );
      return;
    }

    final queryName = nameController.text.trim().isNotEmpty
        ? nameController.text.trim()
        : (bnController.text.trim().isNotEmpty
            ? bnController.text.trim()
            : arController.text.trim());

    if (queryName.isEmpty) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(LucideIcons.alertCircle, color: Colors.orange, size: 22),
              SizedBox(width: 8),
              Text('Product Name Required', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: const Text(
            'Please write the product name first before searching for images online.',
            style: TextStyle(fontSize: 14),
          ),
          actions: [
            ElevatedButton(
              onPressed: () => Navigator.pop(ctx),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF24B489),
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
        initialQuery: queryName,
        maxAllowed: 6 - _images.length,
      ),
    );

    if (selectedUrls != null && selectedUrls.isNotEmpty) {
      setState(() {
        for (final url in selectedUrls) {
          if (_images.length < 6 && !_images.contains(url)) {
            _images.add(url);
          }
        }
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Added ${selectedUrls.length} image(s) to product.'),
            backgroundColor: const Color(0xFF24B489),
          ),
        );
      }
    }
  }

  void _generateBarcode() {
    final randomDigits = (100000000 + (DateTime.now().millisecondsSinceEpoch % 899999999)).toString();
    setState(() {
      barcodeController.text = randomDigits;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bgColor = isDark ? AppColors.cardDark : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF111827) : Colors.white;
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569);
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final hintColor = isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8);
    final borderColor = isDark ? const Color(0xFF1F2937) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    return Dialog(
      backgroundColor: bgColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 540),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.product != null ? 'Edit product' : 'New product',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.x, color: hintColor, size: 20),
                    onPressed: () => Navigator.pop(context),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 1),

            // Form Body
            Expanded(
              child: Form(
                key: formKey,
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Section 1: Product Images
                      _buildSectionLabel('Product images', labelColor),
                      CustomPaint(
                        painter: DashedRoundedRectPainter(
                          color: borderColor,
                          borderRadius: 20,
                          strokeWidth: 1.2,
                          gap: 6,
                        ),
                        child: Container(
                          width: double.infinity,
                          height: 140,
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: _images.isEmpty
                            ? Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(LucideIcons.image, size: 40, color: hintColor),
                                  const SizedBox(height: 6),
                                  Text(
                                    'No image yet',
                                    style: TextStyle(color: hintColor, fontSize: 13, fontWeight: FontWeight.w500),
                                  ),
                                ],
                              )
                            : ListView.builder(
                                scrollDirection: Axis.horizontal,
                                padding: const EdgeInsets.all(12),
                                itemCount: _images.length,
                                itemBuilder: (context, index) {
                                  final path = _images[index];
                                  return Stack(
                                    children: [
                                      Container(
                                        width: 110,
                                        height: 110,
                                        margin: const EdgeInsets.only(right: 12),
                                        decoration: BoxDecoration(
                                          borderRadius: BorderRadius.circular(16),
                                          border: Border.all(color: borderColor),
                                          image: DecorationImage(
                                            image: getSmartImageProvider(path),
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      Positioned(
                                        top: 4,
                                        right: 16,
                                        child: GestureDetector(
                                          onTap: () {
                                            setState(() {
                                              _images.removeAt(index);
                                            });
                                          },
                                          child: Container(
                                            padding: const EdgeInsets.all(4),
                                            decoration: const BoxDecoration(
                                              color: Colors.black54,
                                              shape: BoxShape.circle,
                                            ),
                                            child: const Icon(LucideIcons.x, size: 14, color: Colors.white),
                                          ),
                                        ),
                                      ),
                                      if (index == 0)
                                        Positioned(
                                          bottom: 4,
                                          left: 4,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: primaryColor,
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: const Text(
                                              'Main',
                                              style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                            ),
                                          ),
                                        ),
                                    ],
                                  );
                                },
                              ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Image Buttons Row
                      Row(
                        children: [
                          Expanded(
                            child: _buildActionButton(
                              icon: LucideIcons.camera,
                              label: 'Camera',
                              onTap: () => _pickImage(ImageSource.camera),
                              cardBg: cardBg,
                              borderColor: borderColor,
                              textColor: textColor,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildActionButton(
                              icon: LucideIcons.upload,
                              label: 'Gallery',
                              onTap: () => _pickImage(ImageSource.gallery),
                              cardBg: cardBg,
                              borderColor: borderColor,
                              textColor: textColor,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildActionButton(
                              icon: LucideIcons.sparkles,
                              label: 'Find',
                              onTap: _showFindImageDialog,
                              cardBg: cardBg,
                              borderColor: borderColor,
                              textColor: textColor,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${_images.length}/6 images · stored as URLs (files live on the CDN, not the database). Tap a thumbnail to set as main or remove.',
                        style: TextStyle(fontSize: 11, color: labelColor, height: 1.3),
                      ),
                      const SizedBox(height: 16),

                      // Section 2: Product Name (English) *
                      _buildSectionLabel('Product name (English) *', labelColor),
                      const SizedBox(height: 6),
                      _buildTextField(
                        controller: nameController,
                        hint: 'e.g. Saudi Fresh Yogurt',
                        cardBg: cardBg,
                        borderColor: borderColor,
                        textColor: textColor,
                        hintColor: hintColor,
                        primaryColor: primaryColor,
                        validator: (val) => (val == null || val.trim().isEmpty) ? 'Enter English title' : null,
                      ),
                      const SizedBox(height: 16),

                      // Section 3: Name (Bengali) & Name (Arabic)
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSectionLabel('Name (Bengali)', labelColor),
                                const SizedBox(height: 6),
                                _buildTextField(
                                  controller: bnController,
                                  hint: '',
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                  textColor: textColor,
                                  hintColor: hintColor,
                                  primaryColor: primaryColor,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSectionLabel('Name (Arabic)', labelColor),
                                const SizedBox(height: 6),
                                _buildTextField(
                                  controller: arController,
                                  hint: '',
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                  textColor: textColor,
                                  hintColor: hintColor,
                                  primaryColor: primaryColor,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Section 4: Product Barcode
                      _buildSectionLabel('Product Barcode', labelColor),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Expanded(
                            child: _buildTextField(
                              controller: barcodeController,
                              hint: 'Scan or type barcode / SKU',
                              cardBg: cardBg,
                              borderColor: borderColor,
                              textColor: textColor,
                              hintColor: hintColor,
                              primaryColor: primaryColor,
                            ),
                          ),
                          const SizedBox(width: 8),
                          InkWell(
                            onTap: _generateBarcode,
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              height: 48,
                              width: 48,
                              decoration: BoxDecoration(
                                color: cardBg,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: borderColor),
                              ),
                              child: Icon(LucideIcons.scanLine, color: textColor, size: 20),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Section 5: Sale price & Purchase price
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSectionLabel('Sale price (SAR, VAT incl.) *', labelColor),
                                const SizedBox(height: 6),
                                _buildTextField(
                                  controller: priceController,
                                  hint: '',
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                  textColor: textColor,
                                  hintColor: hintColor,
                                  primaryColor: primaryColor,
                                  validator: (val) {
                                    if (val == null || val.trim().isEmpty) {
                                      return 'Required';
                                    }
                                    if (double.tryParse(val.trim()) == null) {
                                      return 'Enter valid price';
                                    }
                                    return null;
                                  },
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSectionLabel('Purchase price (SAR) *', labelColor),
                                const SizedBox(height: 6),
                                _buildTextField(
                                  controller: costController,
                                  hint: '',
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                  textColor: textColor,
                                  hintColor: hintColor,
                                  primaryColor: primaryColor,
                                  validator: (val) {
                                    if (val == null || val.trim().isEmpty) {
                                      return 'Required';
                                    }
                                    if (double.tryParse(val.trim()) == null) {
                                      return 'Enter valid cost';
                                    }
                                    return null;
                                  },
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Section 6: Other Company Price (SAR) — optional
                      _buildSectionLabel('Other Company Price (SAR) — optional, shown to customers as strike-through', labelColor),
                      const SizedBox(height: 6),
                      _buildTextField(
                        controller: comparePriceController,
                        hint: 'Leave empty to hide comparison',
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        cardBg: cardBg,
                        borderColor: borderColor,
                        textColor: textColor,
                        hintColor: hintColor,
                        primaryColor: primaryColor,
                      ),
                      const SizedBox(height: 16),

                      // Section 7: Tax %, Stock, Min stock
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSectionLabel('Tax %', labelColor),
                                const SizedBox(height: 6),
                                _buildTextField(
                                  controller: taxController,
                                  hint: '15',
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                  textColor: textColor,
                                  hintColor: hintColor,
                                  primaryColor: primaryColor,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSectionLabel('Stock', labelColor),
                                const SizedBox(height: 6),
                                _buildTextField(
                                  controller: stockController,
                                  hint: '',
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                  textColor: textColor,
                                  hintColor: hintColor,
                                  primaryColor: primaryColor,
                                  validator: (val) => (val == null || double.tryParse(val) == null) ? 'Required' : null,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSectionLabel('Min stock', labelColor),
                                const SizedBox(height: 6),
                                _buildTextField(
                                  controller: minStockController,
                                  hint: '',
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                  textColor: textColor,
                                  hintColor: hintColor,
                                  primaryColor: primaryColor,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Section 8: Categories Dropdown
                      _buildSectionLabel('Categories', labelColor),
                      const SizedBox(height: 6),
                      CategorySearchableDropdown(
                        selectedCategories: _selectedCategories,
                        onChanged: (newList) {
                          setState(() {
                            _selectedCategories = newList;
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      // Section 9: Description
                      _buildSectionLabel('Description', labelColor),
                      const SizedBox(height: 6),
                      _buildTextField(
                        controller: descriptionController,
                        hint: '',
                        maxLines: 3,
                        cardBg: cardBg,
                        borderColor: borderColor,
                        textColor: textColor,
                        hintColor: hintColor,
                        primaryColor: primaryColor,
                      ),
                      const SizedBox(height: 16),

                      // Section 10: Toggle Switches
                      Row(
                        children: [
                          Expanded(
                            child: _buildSwitchCard(
                              label: 'Website visible',
                              value: _isVisibleOnWebsite,
                              onChanged: (val) => setState(() => _isVisibleOnWebsite = val),
                              cardBg: cardBg,
                              borderColor: borderColor,
                              textColor: textColor,
                              primaryColor: primaryColor,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildSwitchCard(
                              label: 'Featured',
                              value: _isFeatured,
                              onChanged: (val) => setState(() => _isFeatured = val),
                              cardBg: cardBg,
                              borderColor: borderColor,
                              textColor: textColor,
                              primaryColor: primaryColor,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildSwitchCard(
                              label: 'Show stock',
                              value: _showStock,
                              onChanged: (val) => setState(() => _showStock = val),
                              cardBg: cardBg,
                              borderColor: borderColor,
                              textColor: textColor,
                              primaryColor: primaryColor,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Section 11: Info Box
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: RichText(
                          text: TextSpan(
                            style: TextStyle(fontSize: 12, color: labelColor, height: 1.4),
                            children: const [
                              TextSpan(
                                text: 'Sale price is the final price customers pay — 15% VAT is already included. If you enter ',
                              ),
                              TextSpan(
                                text: 'SAR 15',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              TextSpan(
                                text: ', the customer sees ',
                              ),
                              TextSpan(
                                text: 'SAR 15',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              TextSpan(text: '.'),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Section 12: Action Buttons
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryColor,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                          onPressed: _onSave,
                          child: const Text(
                            'Save',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: borderColor),
                            backgroundColor: cardBg,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                          onPressed: () => Navigator.pop(context),
                          child: Text(
                            'Cancel',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: textColor,
                            ),
                          ),
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
    );
  }

  void _onSave() async {
    if (formKey.currentState!.validate()) {
      final name = nameController.text.trim();
      final bn = bnController.text.trim().isEmpty ? null : bnController.text.trim();
      final ar = arController.text.trim().isEmpty ? null : arController.text.trim();
      final barcode = barcodeController.text.trim().isEmpty ? null : barcodeController.text.trim();
      final price = double.tryParse(priceController.text.trim()) ?? 0.0;
      final cost = double.tryParse(costController.text.trim()) ?? 0.0;
      final comparePrice = double.tryParse(comparePriceController.text.trim());
      final taxRate = double.tryParse(taxController.text.trim()) ?? 15.0;
      final stock = double.tryParse(stockController.text.trim()) ?? 0.0;
      final minStock = double.tryParse(minStockController.text.trim()) ?? 5.0;
      final description = descriptionController.text.trim().isEmpty ? null : descriptionController.text.trim();

      final newProd = ProductModel(
        id: widget.product?.id ?? const Uuid().v4(),
        name: name,
        nameBn: bn,
        nameAr: ar,
        barcode: barcode,
        itemCode: barcode,
        price: price,
        purchasePrice: cost,
        comparePrice: comparePrice,
        taxRate: taxRate,
        stock: stock,
        minStock: minStock,
        description: description,
        categoryIds: _selectedCategories,
        isVisibleOnWebsite: _isVisibleOnWebsite,
        isFeatured: _isFeatured,
        showStock: _showStock,
        imageUrl: _images.isNotEmpty ? _images.first : null,
        images: _images.isEmpty ? null : _images,
        createdAt: widget.product?.createdAt ?? DateTime.now(),
      );

      await context.read<ProductRepository>().saveProduct(newProd);

      if (mounted) {
        context.read<WholesaleCubit>().loadAllData();
        Navigator.pop(context);
      }
    }
  }

  Widget _buildSectionLabel(String label, Color color) {
    return Text(
      label,
      style: TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: color,
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required Color cardBg,
    required Color borderColor,
    required Color textColor,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: borderColor),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: textColor),
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: textColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required Color cardBg,
    required Color borderColor,
    required Color textColor,
    required Color hintColor,
    required Color primaryColor,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    FormFieldValidator<String>? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      validator: validator,
      style: TextStyle(color: textColor, fontSize: 14),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: hintColor, fontSize: 14),
        fillColor: cardBg,
        filled: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
          borderSide: BorderSide(color: primaryColor, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(20),
          borderSide: const BorderSide(color: Colors.redAccent),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(20),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
        ),
      ),
    );
  }

  Widget _buildSwitchCard({
    required String label,
    required bool value,
    required ValueChanged<bool> onChanged,
    required Color cardBg,
    required Color borderColor,
    required Color textColor,
    required Color primaryColor,
  }) {
    return Container(
      padding: const EdgeInsets.only(left: 10, right: 4, top: 4, bottom: 4),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: textColor,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Transform.scale(
            scale: 0.7,
            child: Switch.adaptive(
              value: value,
              activeTrackColor: primaryColor,
              onChanged: onChanged,
            ),
          ),
        ],
      ),
    );
  }
}
