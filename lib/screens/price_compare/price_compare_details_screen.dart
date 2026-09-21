import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../blocs/price_compare/price_compare_cubit.dart';
import '../../core/theme/app_colors.dart';
import '../../models/price_compare_models.dart';
import '../common_widgets/smart_image_widget.dart';
import 'components/add_vendor_entry_dialog.dart';
import 'components/edit_product_bottom_sheet.dart';
import 'components/edit_vendor_entry_dialog.dart';
import 'components/pdf_viewer_screen.dart';
import 'services/price_compare_export_service.dart';

class PriceCompareDetailsScreen extends StatefulWidget {
  final String productId;

  const PriceCompareDetailsScreen({
    super.key,
    required this.productId,
  });

  @override
  State<PriceCompareDetailsScreen> createState() => _PriceCompareDetailsScreenState();
}

class _PriceCompareDetailsScreenState extends State<PriceCompareDetailsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PriceCompareCubit>().selectProduct(widget.productId);
    });
  }

  void _scanBarcode() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening Barcode Scanner...'),
        backgroundColor: Color(0xFF0F172A),
      ),
    );
  }

  Future<void> _handleMenuAction(String action, PriceCompareProductModel product) async {
    switch (action) {
      case 'export_pdf':
        await PriceCompareExportService.exportPdf(context, [], singleProduct: product);
        break;
      case 'export_excel':
        await PriceCompareExportService.exportExcel(context, [], singleProduct: product);
        break;
      case 'print':
        await PriceCompareExportService.printReport(context, [], singleProduct: product);
        break;
      case 'share_whatsapp':
        await PriceCompareExportService.shareOnWhatsApp(context, [], singleProduct: product);
        break;
      case 'refresh':
        await context.read<PriceCompareCubit>().selectProduct(widget.productId);
        break;
    }
  }

  Future<void> _confirmDeleteProduct(PriceCompareProductModel product) async {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(LucideIcons.trash2, color: Color(0xFFEF4444), size: 20),
            const SizedBox(width: 8),
            Text(
              'Delete Product',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        content: Text(
          'Are you sure you want to delete "${product.productName}" and all vendor quotes?',
          style: TextStyle(
            fontSize: 14,
            color: isDark ? AppColors.mutedFgDark : const Color(0xFF475569),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(
              'Cancel',
              style: TextStyle(
                color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
              ),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final success = await context.read<PriceCompareCubit>().deleteProduct(product.id);
      if (success && mounted) {
        Navigator.pop(context);
      }
    }
  }

  Future<void> _confirmDeleteEntry(PriceCompareEntryModel entry) async {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(LucideIcons.trash2, color: Color(0xFFEF4444), size: 20),
            const SizedBox(width: 8),
            Text(
              'Delete Supplier Quote',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        content: Text(
          'Delete quote from "${entry.vendorName}" of SAR ${entry.purchasePrice.toStringAsFixed(2)}?',
          style: TextStyle(
            fontSize: 14,
            color: isDark ? AppColors.mutedFgDark : const Color(0xFF475569),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(
              'Cancel',
              style: TextStyle(
                color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
              ),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await context.read<PriceCompareCubit>().deletePurchaseEntry(entry.id, productId: widget.productId);
    }
  }

  void _viewAttachment(BuildContext context, String urlOrPath, String title) {
    final lower = urlOrPath.toLowerCase();
    final cleanPath = urlOrPath.split('?').first.toLowerCase();
    final isPdf = cleanPath.endsWith('.pdf') ||
        lower.contains('.pdf?') ||
        lower.contains('application/pdf');

    if (isPdf) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => PdfViewerScreen(
            urlOrPath: urlOrPath,
            title: title,
          ),
        ),
      );
      return;
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: Icon(
                      LucideIcons.x,
                      size: 18,
                      color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                    ),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxHeight: 380),
                  child: SmartImageWidget(
                    imageUrl: urlOrPath,
                    fit: BoxFit.contain,
                    fallbackWidget: const Center(
                      child: Icon(LucideIcons.image, size: 48, color: Color(0xFF94A3B8)),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return BlocConsumer<PriceCompareCubit, PriceCompareState>(
      listener: (context, state) {
        if (state.errorMessage != null && state.errorMessage!.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.errorMessage!),
              backgroundColor: const Color(0xFFEF4444),
            ),
          );
        } else if (state.successMessage != null && state.successMessage!.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.successMessage!),
              backgroundColor: const Color(0xFF23B386),
            ),
          );
          context.read<PriceCompareCubit>().clearMessages();
        }
      },
      builder: (context, state) {
        final product = state.selectedProduct ??
            state.products.where((p) => p.id == widget.productId).firstOrNull;

        return Scaffold(
          backgroundColor: isDark ? AppColors.bgDark : const Color(0xFFF8FAFC),
          appBar: AppBar(
            title: Text(
              'Price Compare',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
              ),
            ),
            backgroundColor: isDark ? AppColors.bgDark : Colors.white,
            elevation: 0,
            leading: IconButton(
              icon: Icon(
                LucideIcons.arrowLeft,
                color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
              ),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              IconButton(
                onPressed: _scanBarcode,
                icon: Icon(
                  LucideIcons.scan,
                  size: 20,
                  color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                ),
                splashRadius: 22,
                tooltip: 'Scan Barcode',
              ),
              if (product != null)
                PopupMenuButton<String>(
                  icon: Icon(
                    LucideIcons.moreVertical,
                    size: 20,
                    color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                  ),
                  color: isDark ? AppColors.popoverDark : Colors.white,
                  splashRadius: 22,
                  onSelected: (val) => _handleMenuAction(val, product),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  itemBuilder: (ctx) => [
                    PopupMenuItem(
                      value: 'export_pdf',
                      child: Row(
                        children: [
                          Icon(LucideIcons.fileText, size: 17, color: isDark ? AppColors.fgDark : const Color(0xFF334155)),
                          const SizedBox(width: 12),
                          Text(
                            'Export PDF',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                    ),
                    PopupMenuItem(
                      value: 'export_excel',
                      child: Row(
                        children: [
                          Icon(LucideIcons.sheet, size: 17, color: isDark ? AppColors.fgDark : const Color(0xFF334155)),
                          const SizedBox(width: 12),
                          Text(
                            'Export Excel',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                    ),
                    PopupMenuItem(
                      value: 'print',
                      child: Row(
                        children: [
                          Icon(LucideIcons.printer, size: 17, color: isDark ? AppColors.fgDark : const Color(0xFF334155)),
                          const SizedBox(width: 12),
                          Text(
                            'Print',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                    ),
                    PopupMenuItem(
                      value: 'share_whatsapp',
                      child: Row(
                        children: [
                          const Icon(LucideIcons.share2, size: 17, color: Color(0xFF25D366)),
                          const SizedBox(width: 12),
                          Text(
                            'Share on WhatsApp',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const PopupMenuDivider(
                      height: 1,
                    ),
                    PopupMenuItem(
                      value: 'refresh',
                      child: Row(
                        children: [
                          Icon(LucideIcons.refreshCw, size: 17, color: isDark ? AppColors.fgDark : const Color(0xFF334155)),
                          const SizedBox(width: 12),
                          Text(
                            'Refresh',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              const SizedBox(width: 4),
            ],
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Divider(
                height: 1,
                color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
              ),
            ),
          ),
          body: product == null
              ? const Center(child: CircularProgressIndicator(color: Color(0xFF23B386)))
              : _buildProductDetails(context, product),
        );
      },
    );
  }

  Widget _buildProductDetails(BuildContext context, PriceCompareProductModel product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Sort cheapest first
    final entries = List<PriceCompareEntryModel>.from(product.history);
    entries.sort((a, b) => a.purchasePrice.compareTo(b.purchasePrice));

    // Compute stats
    final lowestEntry = entries.isNotEmpty ? entries.first : null;
    final highestEntry = entries.isNotEmpty ? entries.last : null;
    final latestEntry = product.analysis?.latestPurchase ?? (entries.isNotEmpty ? entries.first : null);

    final lowestPrice = lowestEntry?.purchasePrice ?? product.lowestPurchasePrice ?? 0.0;
    final highestPrice = highestEntry?.purchasePrice ?? product.highestPurchasePrice ?? 0.0;
    final latestPrice = latestEntry?.purchasePrice ?? product.latestPurchasePrice ?? lowestPrice;

    final updatedDateStr = product.updatedAt ?? product.createdAt ?? DateFormat('yyyy-MM-dd').format(DateTime.now());

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Card (Matches Screenshot 2 & 3)
          Container(
            decoration: BoxDecoration(
              color: isDark ? AppColors.cardDark : Colors.white,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Big Rounded Image / Box Avatar
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.accentDark : const Color(0xFFE8F1F5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: (product.productImageUrl != null && product.productImageUrl!.isNotEmpty)
                            ? SmartImageWidget(
                                imageUrl: product.productImageUrl!,
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                                fallbackWidget: const Center(
                                  child: Icon(LucideIcons.box, color: Color(0xFF23B386), size: 36),
                                ),
                              )
                            : Center(
                                child: Icon(
                                  LucideIcons.box,
                                  color: isDark ? AppColors.fgDark : const Color(0xFF334155),
                                  size: 36,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(width: 14),

                    // Name & Badges
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product.productName,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                            ),
                          ),
                          if ((product.category != null && product.category!.isNotEmpty) ||
                              (product.barcode != null && product.barcode!.isNotEmpty)) ...[
                            const SizedBox(height: 6),
                            Wrap(
                              spacing: 6,
                              runSpacing: 4,
                              children: [
                                if (product.category != null && product.category!.isNotEmpty)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: isDark ? AppColors.accentDark : const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      product.category!,
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: isDark ? AppColors.fgDark : const Color(0xFF475569),
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                if (product.barcode != null && product.barcode!.isNotEmpty)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: isDark ? AppColors.accentDark : const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          LucideIcons.scan,
                                          size: 12,
                                          color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          product.barcode!,
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: isDark ? AppColors.fgDark : const Color(0xFF475569),
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                          ],
                          const SizedBox(height: 8),

                          // Badges Row (SALE & LOWEST)
                          Row(
                            children: [
                              // SALE Badge
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF134E48) : const Color(0xFFE0F7F6),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'SALE',
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: isDark ? const Color(0xFF5EEAD4) : const Color(0xFF0D9488),
                                      ),
                                    ),
                                    Text(
                                      'SAR ${product.sellingPrice.toStringAsFixed(2)}',
                                      style: TextStyle(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.bold,
                                        color: isDark ? const Color(0xFF5EEAD4) : const Color(0xFF0D9488),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),

                              // LOWEST Badge
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF14532D) : const Color(0xFFE6F4EA),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'LOWEST',
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: isDark ? const Color(0xFF86EFAC) : const Color(0xFF1B8755),
                                      ),
                                    ),
                                    Text(
                                      'SAR ${lowestPrice.toStringAsFixed(2)}',
                                      style: TextStyle(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.bold,
                                        color: isDark ? const Color(0xFF86EFAC) : const Color(0xFF1B8755),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                if (product.productPdfUrl != null && product.productPdfUrl!.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  InkWell(
                    onTap: () => _viewAttachment(context, product.productPdfUrl!, 'Product Spec / Catalog'),
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E3A8A).withValues(alpha: 0.4) : const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: isDark ? const Color(0xFF1D4ED8) : const Color(0xFFBFDBFE)),
                      ),
                      child: Row(
                        children: [
                          Icon(LucideIcons.fileText, size: 16, color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF2563EB)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'View Product Spec / Catalog PDF',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF1E40AF),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          Icon(LucideIcons.externalLink, size: 14, color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF2563EB)),
                        ],
                      ),
                    ),
                  ),
                ],

                if (product.notes != null && product.notes!.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.bgDark : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Note: ${product.notes!}',
                      style: TextStyle(
                        fontSize: 11.5,
                        color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                ],

                const SizedBox(height: 14),
                Divider(
                  height: 1,
                  color: isDark ? AppColors.borderDark : const Color(0xFFF1F5F9),
                ),
                const SizedBox(height: 10),

                // Updated Date & Change Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          LucideIcons.calendar,
                          size: 14,
                          color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Updated $updatedDateStr',
                          style: TextStyle(
                            fontSize: 12,
                            color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                    InkWell(
                      onTap: () => EditProductBottomSheet.show(context, product: product),
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        child: Text(
                          'Change',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF23B386),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // 2x2 Grid of Stat Cards (Matches Screenshot 2 & 3)
          Row(
            children: [
              // Card 1: SALE PRICE
              Expanded(
                child: _buildMetricCard(
                  isDark: isDark,
                  icon: LucideIcons.tag,
                  iconBg: isDark ? const Color(0xFF134E48) : const Color(0xFFE0F7F6),
                  iconColor: isDark ? const Color(0xFF5EEAD4) : const Color(0xFF0D9488),
                  title: 'SALE PRICE',
                  value: 'SAR ${product.sellingPrice.toStringAsFixed(2)}',
                ),
              ),
              const SizedBox(width: 12),

              // Card 2: LATEST PURCHASE
              Expanded(
                child: _buildMetricCard(
                  isDark: isDark,
                  icon: LucideIcons.wallet,
                  iconBg: isDark ? const Color(0xFF312E81) : const Color(0xFFEEF2FF),
                  iconColor: isDark ? const Color(0xFFA5B4FC) : const Color(0xFF4F46E5),
                  title: 'LATEST PURCHASE',
                  value: 'SAR ${latestPrice.toStringAsFixed(2)}',
                  subtitle: latestEntry?.vendorName,
                  date: latestEntry?.purchaseDate,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              // Card 3: LOWEST PURCHASE
              Expanded(
                child: _buildMetricCard(
                  isDark: isDark,
                  icon: LucideIcons.arrowDown,
                  iconBg: isDark ? const Color(0xFF14532D) : const Color(0xFFDCFCE7),
                  iconColor: isDark ? const Color(0xFF86EFAC) : const Color(0xFF16A34A),
                  title: 'LOWEST PURCHASE',
                  value: 'SAR ${lowestPrice.toStringAsFixed(2)}',
                  subtitle: lowestEntry?.vendorName,
                  date: lowestEntry?.purchaseDate,
                ),
              ),
              const SizedBox(width: 12),

              // Card 4: HIGHEST PURCHASE
              Expanded(
                child: _buildMetricCard(
                  isDark: isDark,
                  icon: LucideIcons.arrowUp,
                  iconBg: isDark ? const Color(0xFF7F1D1D) : const Color(0xFFFEE2E2),
                  iconColor: isDark ? const Color(0xFFFCA5A5) : const Color(0xFFEF4444),
                  title: 'HIGHEST PURCHASE',
                  value: 'SAR ${highestPrice.toStringAsFixed(2)}',
                  subtitle: highestEntry?.vendorName,
                  date: highestEntry?.purchaseDate,
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Suppliers Header: "Suppliers" ... "Cheapest first"
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Suppliers',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                ),
              ),
              Row(
                children: [
                  Text(
                    'Cheapest first',
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                    ),
                  ),
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: () {
                      AddVendorEntryDialog.show(
                        context,
                        productId: product.id,
                        productName: product.productName,
                        currentSellingPrice: product.sellingPrice,
                      );
                    },
                    borderRadius: BorderRadius.circular(6),
                    child: const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(LucideIcons.plus, size: 14, color: Color(0xFF23B386)),
                          SizedBox(width: 2),
                          Text(
                            'Add',
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF23B386),
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

          const SizedBox(height: 12),

          // Suppliers List (Matches Screenshot 2 & 3)
          if (entries.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 32),
              decoration: BoxDecoration(
                color: isDark ? AppColors.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  Icon(
                    LucideIcons.inbox,
                    size: 36,
                    color: isDark ? AppColors.mutedFgDark : const Color(0xFF94A3B8),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'No vendor quotes found',
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: entries.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (ctx, idx) {
                final entry = entries[idx];
                final initials = entry.vendorName.length >= 2
                    ? entry.vendorName.substring(0, 2).toUpperCase()
                    : entry.vendorName.toUpperCase();

                return Container(
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.cardDark : Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.02),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          // Circle Avatar with Initials
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.accentDark : const Color(0xFFEEF2F6),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                initials,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? AppColors.fgDark : const Color(0xFF475569),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),

                          // Vendor Name, Date & Quantity
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  entry.vendorName,
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Row(
                                  children: [
                                    if (entry.purchaseDate != null) ...[
                                      Icon(
                                        LucideIcons.calendar,
                                        size: 12,
                                        color: isDark ? AppColors.mutedFgDark : const Color(0xFF94A3B8),
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        entry.purchaseDate!,
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                                        ),
                                      ),
                                    ],
                                    if (entry.quantity != null && entry.quantity! > 0) ...[
                                      const SizedBox(width: 8),
                                      Text(
                                        '• ${entry.quantity! % 1 == 0 ? entry.quantity!.toInt() : entry.quantity} units',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ],
                            ),
                          ),

                          // Price & Margin
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                'SAR ${entry.purchasePrice.toStringAsFixed(2)}',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                                ),
                              ),
                              if (entry.marginAmount != null)
                                Text(
                                  'Margin: SAR ${entry.marginAmount!.toStringAsFixed(2)}',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: entry.marginAmount! >= 0 ? const Color(0xFF16A34A) : const Color(0xFFEF4444),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),

                      // Slip Attachment & Notes
                      if (entry.slipImageUrl != null || entry.slipPdfUrl != null || (entry.notes != null && entry.notes!.isNotEmpty)) ...[
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            if (entry.slipPdfUrl != null && entry.slipImageUrl != null) ...[
                              InkWell(
                                onTap: () => _viewAttachment(
                                  context,
                                  entry.slipPdfUrl!,
                                  '${entry.vendorName} Receipt (PDF)',
                                ),
                                borderRadius: BorderRadius.circular(6),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF7F1D1D).withValues(alpha: 0.3) : const Color(0xFFFEF2F2),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: isDark ? const Color(0xFF991B1B) : const Color(0xFFFECACA)),
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(LucideIcons.fileText, size: 12, color: Color(0xFFEF4444)),
                                      SizedBox(width: 4),
                                      Text(
                                        'Receipt (PDF)',
                                        style: TextStyle(fontSize: 11, color: Color(0xFFDC2626), fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              InkWell(
                                onTap: () => _viewAttachment(
                                  context,
                                  entry.slipImageUrl!,
                                  '${entry.vendorName} Receipt (Image)',
                                ),
                                borderRadius: BorderRadius.circular(6),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF064E3B).withValues(alpha: 0.3) : const Color(0xFFE8F7F2),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: isDark ? const Color(0xFF065F46) : const Color(0xFFA7F3D0)),
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(LucideIcons.image, size: 12, color: Color(0xFF23B386)),
                                      SizedBox(width: 4),
                                      Text(
                                        'Receipt (Image)',
                                        style: TextStyle(fontSize: 11, color: Color(0xFF23B386), fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ] else if (entry.slipPdfUrl != null) ...[
                              InkWell(
                                onTap: () => _viewAttachment(
                                  context,
                                  entry.slipPdfUrl!,
                                  '${entry.vendorName} Receipt / Slip',
                                ),
                                borderRadius: BorderRadius.circular(6),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF7F1D1D).withValues(alpha: 0.3) : const Color(0xFFFEF2F2),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: isDark ? const Color(0xFF991B1B) : const Color(0xFFFECACA)),
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(LucideIcons.fileText, size: 12, color: Color(0xFFEF4444)),
                                      SizedBox(width: 4),
                                      Text(
                                        'View Receipt / Slip (PDF)',
                                        style: TextStyle(fontSize: 11, color: Color(0xFFDC2626), fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ] else if (entry.slipImageUrl != null) ...[
                              Builder(
                                builder: (context) {
                                  final lower = entry.slipImageUrl!.toLowerCase();
                                  final cleanPath = entry.slipImageUrl!.split('?').first.toLowerCase();
                                  final isPdfSlip = cleanPath.endsWith('.pdf') ||
                                      lower.contains('.pdf?') ||
                                      lower.contains('application/pdf');
                                  return InkWell(
                                    onTap: () => _viewAttachment(
                                      context,
                                      entry.slipImageUrl!,
                                      '${entry.vendorName} Receipt / Slip',
                                    ),
                                    borderRadius: BorderRadius.circular(6),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: isPdfSlip
                                            ? (isDark ? const Color(0xFF7F1D1D).withValues(alpha: 0.3) : const Color(0xFFFEF2F2))
                                            : (isDark ? const Color(0xFF064E3B).withValues(alpha: 0.3) : const Color(0xFFE8F7F2)),
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(
                                          color: isPdfSlip
                                              ? (isDark ? const Color(0xFF991B1B) : const Color(0xFFFECACA))
                                              : (isDark ? const Color(0xFF065F46) : const Color(0xFFA7F3D0)),
                                        ),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(
                                            isPdfSlip ? LucideIcons.fileText : LucideIcons.image,
                                            size: 12,
                                            color: isPdfSlip ? const Color(0xFFEF4444) : const Color(0xFF23B386),
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            isPdfSlip ? 'View Receipt / Slip (PDF)' : 'View Receipt / Slip',
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: isPdfSlip ? const Color(0xFFDC2626) : const Color(0xFF23B386),
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ],
                            if (entry.notes != null && entry.notes!.isNotEmpty) ...[
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  entry.notes!,
                                  style: TextStyle(
                                    fontSize: 11.5,
                                    color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                                    fontStyle: FontStyle.italic,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],

                      // Action Buttons (Pencil & Trash)
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          // Edit Quote
                          IconButton(
                            icon: Icon(
                              LucideIcons.pencil,
                              size: 16,
                              color: isDark ? AppColors.mutedFgDark : const Color(0xFF334155),
                            ),
                            padding: const EdgeInsets.all(6),
                            constraints: const BoxConstraints(),
                            onPressed: () {
                              EditVendorEntryDialog.show(
                                context,
                                entry: entry,
                                productName: product.productName,
                              );
                            },
                          ),
                          const SizedBox(width: 8),

                          // Delete Quote
                          IconButton(
                            icon: const Icon(LucideIcons.trash2, size: 16, color: Color(0xFFEF4444)),
                            padding: const EdgeInsets.all(6),
                            constraints: const BoxConstraints(),
                            onPressed: () => _confirmDeleteEntry(entry),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),

          const SizedBox(height: 28),

          // Bottom Product Actions (Edit & Delete Product)
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 46,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                      side: BorderSide(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(23)),
                    ),
                    onPressed: () => EditProductBottomSheet.show(context, product: product),
                    icon: const Icon(LucideIcons.edit2, size: 16),
                    label: const Text('Edit Product', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: SizedBox(
                  height: 46,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFFEF4444),
                      side: BorderSide(color: isDark ? const Color(0xFF7F1D1D) : const Color(0xFFFCA5A5)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(23)),
                    ),
                    onPressed: () => _confirmDeleteProduct(product),
                    icon: const Icon(LucideIcons.trash2, size: 16, color: Color(0xFFEF4444)),
                    label: const Text('Delete Product', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFEF4444))),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 36),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required bool isDark,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String value,
    String? subtitle,
    String? date,
  }) {
    return Container(
      height: 138,
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: iconBg,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Icon(icon, color: iconColor, size: 16),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.4,
                    color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                    height: 1.15,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          if (subtitle != null && subtitle.isNotEmpty) ...[
            const SizedBox(height: 3),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 12,
                color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
          if (date != null && date.isNotEmpty) ...[
            const SizedBox(height: 3),
            Row(
              children: [
                Icon(
                  LucideIcons.calendar,
                  size: 11,
                  color: isDark ? AppColors.mutedFgDark : const Color(0xFF94A3B8),
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    date,
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark ? AppColors.mutedFgDark : const Color(0xFF94A3B8),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
