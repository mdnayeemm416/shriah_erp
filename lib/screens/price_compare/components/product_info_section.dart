import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../common_widgets/smart_image_widget.dart';
import 'dashed_container.dart';

class ProductInfoSection extends StatelessWidget {
  final TextEditingController nameController;
  final TextEditingController barcodeController;
  final TextEditingController salePriceController;
  final TextEditingController? categoryController;
  final TextEditingController? notesController;
  final String? selectedImagePath;
  final String? selectedPdfPath;
  final VoidCallback onScanBarcode;
  final VoidCallback onCamera;
  final VoidCallback onGallery;
  final VoidCallback onFindOnline;
  final VoidCallback? onRemoveImage;
  final VoidCallback? onPickPdf;
  final VoidCallback? onRemovePdf;

  const ProductInfoSection({
    super.key,
    required this.nameController,
    required this.barcodeController,
    required this.salePriceController,
    this.categoryController,
    this.notesController,
    this.selectedImagePath,
    this.selectedPdfPath,
    required this.onScanBarcode,
    required this.onCamera,
    required this.onGallery,
    required this.onFindOnline,
    this.onRemoveImage,
    this.onPickPdf,
    this.onRemovePdf,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF064E3B).withValues(alpha: 0.4) : const Color(0xFFE8F7F2),
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Icon(LucideIcons.box, color: Color(0xFF23B386), size: 20),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Product Information',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 1),
                  Text(
                    'Entered once per product',
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Field: Product Name *
          Text(
            'Product Name *',
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
              border: Border.all(
                color: isDark ? const Color(0xFF0D9488) : const Color(0xFF5EEAD4),
                width: 1.5,
              ),
            ),
            child: TextField(
              controller: nameController,
              style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
              decoration: const InputDecoration(
                prefixIcon: Icon(LucideIcons.search, size: 18, color: Color(0xFF64748B)),
                hintText: 'Search or type new name',
                hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Field: Barcode
          Text(
            'Barcode',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.inputDark : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                  ),
                  child: TextField(
                    controller: barcodeController,
                    style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                    decoration: const InputDecoration(
                      hintText: 'Scan or enter',
                      hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              GestureDetector(
                onTap: onScanBarcode,
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.accentDark : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                  ),
                  child: Center(
                    child: Icon(
                      LucideIcons.scan,
                      size: 20,
                      color: isDark ? AppColors.fgDark : const Color(0xFF334155),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Field: Sale Price
          Text(
            'Sale Price',
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
              controller: salePriceController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
              decoration: const InputDecoration(
                hintText: '0.00',
                hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
          ),
          if (categoryController != null) ...[
            const SizedBox(height: 16),
            Text(
              'Category (Optional)',
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
                controller: categoryController,
                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                decoration: const InputDecoration(
                  hintText: 'e.g. Spreads & Jams',
                  hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
            ),
          ],
          const SizedBox(height: 16),

          // Field: Product Image
          Text(
            'Product Image',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
            ),
          ),
          const SizedBox(height: 8),

          if (selectedImagePath != null && selectedImagePath!.isNotEmpty)
            Stack(
              children: [
                Container(
                  height: 160,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.bgDark : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF23B386), width: 1.5),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: SmartImageWidget(
                      imageUrl: selectedImagePath,
                      fit: BoxFit.contain,
                      fallbackWidget: const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(LucideIcons.image, size: 36, color: Color(0xFF94A3B8)),
                            SizedBox(height: 6),
                            Text('Preview unavailable', style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
                if (onRemoveImage != null)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: onRemoveImage,
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.65),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(LucideIcons.x, color: Colors.white, size: 14),
                        ),
                      ),
                    ),
                  ),
                Positioned(
                  bottom: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF23B386),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(LucideIcons.checkCircle2, color: Colors.white, size: 12),
                        SizedBox(width: 4),
                        Text(
                          'Photo Selected',
                          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            )
          else
            DashedContainer(
              borderRadius: 16,
              color: isDark ? AppColors.borderDark : const Color(0xFFCBD5E1),
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              child: Center(
                child: Column(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.accentDark : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        LucideIcons.imagePlus,
                        color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                        size: 22,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Add a product photo',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Camera, Gallery, or Find online',
                      style: TextStyle(
                        fontSize: 11,
                        color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          const SizedBox(height: 12),

          // 3 Source Action Buttons
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 38,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      backgroundColor: isDark ? AppColors.accentDark : Colors.white,
                      foregroundColor: isDark ? AppColors.fgDark : const Color(0xFF334155),
                      side: BorderSide(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(19)),
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                    ),
                    onPressed: onCamera,
                    icon: const Icon(LucideIcons.camera, size: 14),
                    label: const Text('Camera', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: SizedBox(
                  height: 38,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      backgroundColor: isDark ? AppColors.accentDark : Colors.white,
                      foregroundColor: isDark ? AppColors.fgDark : const Color(0xFF334155),
                      side: BorderSide(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(19)),
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                    ),
                    onPressed: onGallery,
                    icon: const Icon(LucideIcons.upload, size: 14),
                    label: const Text('Gallery', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: SizedBox(
                  height: 38,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      backgroundColor: isDark ? AppColors.accentDark : Colors.white,
                      foregroundColor: const Color(0xFF23B386),
                      side: const BorderSide(color: Color(0xFF23B386)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(19)),
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                    ),
                    onPressed: onFindOnline,
                    icon: const Icon(LucideIcons.sparkles, size: 14, color: Color(0xFF23B386)),
                    label: const Text('Find', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  ),
                ),
              ),
            ],
          ),

          // Field: Product Spec / Catalog (PDF)
          if (onPickPdf != null) ...[
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Product Catalog / Spec (PDF)',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                  ),
                ),
                if (selectedPdfPath != null && selectedPdfPath!.isNotEmpty)
                  InkWell(
                    onTap: onRemovePdf,
                    child: const Text(
                      'Remove',
                      style: TextStyle(fontSize: 12, color: Color(0xFFEF4444), fontWeight: FontWeight.bold),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 6),
            InkWell(
              onTap: onPickPdf,
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: selectedPdfPath != null && selectedPdfPath!.isNotEmpty
                      ? (isDark ? const Color(0xFF1E3A8A).withValues(alpha: 0.4) : const Color(0xFFEFF6FF))
                      : (isDark ? AppColors.inputDark : const Color(0xFFF8FAFC)),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: selectedPdfPath != null && selectedPdfPath!.isNotEmpty
                        ? (isDark ? const Color(0xFF3B82F6) : const Color(0xFF3B82F6))
                        : (isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      LucideIcons.fileText,
                      size: 20,
                      color: selectedPdfPath != null && selectedPdfPath!.isNotEmpty
                          ? const Color(0xFF3B82F6)
                          : (isDark ? AppColors.mutedFgDark : const Color(0xFF64748B)),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        selectedPdfPath != null && selectedPdfPath!.isNotEmpty
                            ? selectedPdfPath!.split('/').last
                            : 'Upload product catalog or spec PDF',
                        style: TextStyle(
                          fontSize: 13,
                          color: selectedPdfPath != null && selectedPdfPath!.isNotEmpty
                              ? (isDark ? const Color(0xFF93C5FD) : const Color(0xFF1E40AF))
                              : (isDark ? AppColors.mutedFgDark : const Color(0xFF64748B)),
                          fontWeight: selectedPdfPath != null && selectedPdfPath!.isNotEmpty ? FontWeight.w600 : FontWeight.normal,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Icon(
                      LucideIcons.paperclip,
                      size: 16,
                      color: isDark ? AppColors.mutedFgDark : const Color(0xFF94A3B8),
                    ),
                  ],
                ),
              ),
            ),
          ],

          // Field: Benchmark Notes (Optional)
          if (notesController != null) ...[
            const SizedBox(height: 16),
            Text(
              'Benchmark Notes (Optional)',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
              ),
            ),
            const SizedBox(height: 6),
            Container(
              decoration: BoxDecoration(
                color: isDark ? AppColors.inputDark : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
              ),
              child: TextField(
                controller: notesController,
                maxLines: 2,
                style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
                decoration: const InputDecoration(
                  hintText: 'e.g. Riyadh market benchmarking',
                  hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
