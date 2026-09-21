import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../blocs/price_compare/price_compare_cubit.dart';
import '../../core/theme/app_colors.dart';
import '../../models/price_compare_models.dart';
import 'components/add_product_bottom_sheet.dart';
import 'components/price_compare_empty_state.dart';
import 'components/price_compare_header.dart';
import 'components/price_compare_product_card.dart';
import 'price_compare_details_screen.dart';
import 'services/price_compare_export_service.dart';

class PriceCompareScreen extends StatefulWidget {
  const PriceCompareScreen({super.key});

  @override
  State<PriceCompareScreen> createState() => _PriceCompareScreenState();
}

class _PriceCompareScreenState extends State<PriceCompareScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PriceCompareCubit>().loadProducts();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _openAddProduct() {
    AddProductBottomSheet.show(context);
  }

  void _scanBarcode() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening Barcode Scanner...'),
        backgroundColor: Color(0xFF0F172A),
      ),
    );
  }

  Future<void> _handleMenuAction(String action, List<PriceCompareProductModel> products) async {
    switch (action) {
      case 'export_pdf':
        await PriceCompareExportService.exportPdf(context, products);
        break;
      case 'export_excel':
        await PriceCompareExportService.exportExcel(context, products);
        break;
      case 'print':
        await PriceCompareExportService.printReport(context, products);
        break;
      case 'share_whatsapp':
        await PriceCompareExportService.shareOnWhatsApp(context, products);
        break;
      case 'refresh':
        await context.read<PriceCompareCubit>().loadProducts();
        break;
    }
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
              action: SnackBarAction(
                label: 'Retry',
                textColor: Colors.white,
                onPressed: () {
                  context.read<PriceCompareCubit>().loadProducts();
                },
              ),
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
        final filtered = state.filteredProducts;

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
            backgroundColor: isDark ? AppColors.cardDark : Colors.white,
            elevation: 0,
            centerTitle: false,
            actions: [
              IconButton(
                onPressed: _scanBarcode,
                icon: Icon(LucideIcons.scan, size: 20, color: isDark ? AppColors.fgDark : const Color(0xFF1E293B)),
                splashRadius: 22,
                tooltip: 'Scan Barcode',
              ),
              PopupMenuButton<String>(
                icon: Icon(LucideIcons.moreVertical, size: 20, color: isDark ? AppColors.fgDark : const Color(0xFF1E293B)),
                splashRadius: 22,
                color: isDark ? AppColors.popoverDark : Colors.white,
                onSelected: (val) => _handleMenuAction(val, filtered),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                itemBuilder: (ctx) => [
                  PopupMenuItem(
                    value: 'export_pdf',
                    child: Row(
                      children: [
                        Icon(LucideIcons.fileText, size: 17, color: isDark ? AppColors.fgDark : const Color(0xFF334155)),
                        const SizedBox(width: 12),
                        Text('Export PDF', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? AppColors.fgDark : const Color(0xFF0F172A))),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'export_excel',
                    child: Row(
                      children: [
                        Icon(LucideIcons.sheet, size: 17, color: isDark ? AppColors.fgDark : const Color(0xFF334155)),
                        const SizedBox(width: 12),
                        Text('Export Excel', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? AppColors.fgDark : const Color(0xFF0F172A))),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'print',
                    child: Row(
                      children: [
                        Icon(LucideIcons.printer, size: 17, color: isDark ? AppColors.fgDark : const Color(0xFF334155)),
                        const SizedBox(width: 12),
                        Text('Print', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? AppColors.fgDark : const Color(0xFF0F172A))),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'share_whatsapp',
                    child: Row(
                      children: [
                        const Icon(LucideIcons.share2, size: 17, color: Color(0xFF25D366)),
                        const SizedBox(width: 12),
                        Text('Share on WhatsApp', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? AppColors.fgDark : const Color(0xFF0F172A))),
                      ],
                    ),
                  ),
                  const PopupMenuDivider(),
                  PopupMenuItem(
                    value: 'refresh',
                    child: Row(
                      children: [
                        Icon(LucideIcons.refreshCw, size: 17, color: isDark ? AppColors.fgDark : const Color(0xFF334155)),
                        const SizedBox(width: 12),
                        Text('Refresh', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? AppColors.fgDark : const Color(0xFF0F172A))),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 4),
            ],
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Divider(height: 1, color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
            ),
          ),
          body: RefreshIndicator(
            color: const Color(0xFF23B386),
            onRefresh: () => context.read<PriceCompareCubit>().loadProducts(),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Hero Card (Matches Screenshot 1)
                  PriceCompareHeader(
                    searchController: _searchController,
                    onSearchChanged: (val) {
                      context.read<PriceCompareCubit>().search(val);
                    },
                    onScanBarcode: _scanBarcode,
                    onAddProduct: _openAddProduct,
                  ),
                  const SizedBox(height: 20),

                  // Error Display Banner (if any)
                  if (state.errorMessage != null && state.errorMessage!.isNotEmpty) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFFECACA)),
                      ),
                      child: Row(
                        children: [
                          const Icon(LucideIcons.alertCircle, color: Color(0xFFEF4444), size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              state.errorMessage!,
                              style: const TextStyle(fontSize: 13, color: Color(0xFFB91C1C)),
                            ),
                          ),
                          TextButton(
                            onPressed: () => context.read<PriceCompareCubit>().loadProducts(),
                            child: const Text('Retry', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFEF4444))),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // "All Products" Section Header (Matches Screenshot 1)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'All Products',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                        ),
                      ),
                      if (state.loading)
                        const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF23B386)),
                        )
                      else
                        Text(
                          '${filtered.length} ${filtered.length == 1 ? "item" : "items"}',
                          style: TextStyle(
                            fontSize: 13,
                            color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Content List or Empty State
                  if (state.loading && state.products.isEmpty)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 48),
                        child: CircularProgressIndicator(color: Color(0xFF23B386)),
                      ),
                    )
                  else if (filtered.isEmpty)
                    PriceCompareEmptyState(
                      onAddProduct: _openAddProduct,
                    )
                  else
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: filtered.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final product = filtered[index];
                        return PriceCompareProductCard(
                          product: product,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => PriceCompareDetailsScreen(productId: product.id),
                              ),
                            );
                          },
                        );
                      },
                    ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
