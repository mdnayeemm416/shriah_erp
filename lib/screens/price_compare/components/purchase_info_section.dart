import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import 'dashed_container.dart';
import 'vendor_autocomplete_field.dart';

class CompanyPurchaseEntry {
  final TextEditingController companyController;
  final TextEditingController priceController;
  final TextEditingController quantityController;
  final TextEditingController notesController;
  DateTime date;
  String? attachmentName;
  String? slipImagePath;
  String? slipPdfPath;
  bool isExpanded;

  CompanyPurchaseEntry({
    required this.companyController,
    required this.priceController,
    TextEditingController? quantityController,
    TextEditingController? notesController,
    DateTime? date,
    this.attachmentName,
    this.slipImagePath,
    this.slipPdfPath,
    this.isExpanded = true,
  })  : quantityController = quantityController ?? TextEditingController(),
        notesController = notesController ?? TextEditingController(),
        date = date ?? DateTime.now();
}

class PurchaseInfoSection extends StatelessWidget {
  final List<CompanyPurchaseEntry> purchases;
  final VoidCallback onAddCompany;
  final Function(int) onToggleExpand;
  final Function(int) onPickDate;
  final Function(int) onAttachMemo;
  final Function(int)? onRemoveCompany;
  final List<String>? vendorSuggestions;

  const PurchaseInfoSection({
    super.key,
    required this.purchases,
    required this.onAddCompany,
    required this.onToggleExpand,
    required this.onPickDate,
    required this.onAttachMemo,
    this.onRemoveCompany,
    this.vendorSuggestions,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header Row
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
                child: Icon(LucideIcons.building2, color: Color(0xFF23B386), size: 20),
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Purchase Information',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 1),
                Text(
                  '${purchases.length} ${purchases.length == 1 ? "company" : "companies"}',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Company Purchase Cards
        ...purchases.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: isDark ? AppColors.cardDark : Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                // Collapsible Header
                InkWell(
                  onTap: () => onToggleExpand(index),
                  borderRadius: BorderRadius.vertical(
                    top: const Radius.circular(18),
                    bottom: Radius.circular(item.isExpanded ? 0 : 18),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Row(
                      children: [
                        // Number Badge
                        Container(
                          width: 30,
                          height: 30,
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF064E3B).withValues(alpha: 0.4) : const Color(0xFFE8F7F2),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(
                              '${index + 1}',
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF23B386),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Title & Subtitle
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.companyController.text.isNotEmpty
                                    ? item.companyController.text
                                    : 'Purchase #${index + 1}',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item.priceController.text.isNotEmpty
                                    ? 'Purchase: ৳${item.priceController.text} • ${DateFormat("MMM dd, yyyy").format(item.date)}'
                                    : (item.companyController.text.isNotEmpty
                                        ? 'Purchase #${index + 1} • Tap to view'
                                        : 'Tap to fill details'),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),

                        if (purchases.length > 1 && onRemoveCompany != null) ...[
                          IconButton(
                            icon: const Icon(LucideIcons.trash2, size: 16, color: Color(0xFFEF4444)),
                            onPressed: () => onRemoveCompany!(index),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            splashRadius: 18,
                          ),
                          const SizedBox(width: 8),
                        ],
                        // Expand / Collapse Chevron
                        Icon(
                          item.isExpanded ? LucideIcons.chevronUp : LucideIcons.chevronDown,
                          size: 18,
                          color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                        ),
                      ],
                    ),
                  ),
                ),

                // Expanded Fields
                if (item.isExpanded) ...[
                  Divider(
                    height: 1,
                    color: isDark ? AppColors.borderDark : const Color(0xFFF1F5F9),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Company Name Field
                        Text(
                          'Company Name',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 6),
                        VendorAutocompleteField(
                          controller: item.companyController,
                          suggestions: vendorSuggestions,
                          hintText: 'Search or type new company',
                          onChanged: (_) {
                            (context as Element).markNeedsBuild();
                          },
                          onSelected: (_) {
                            (context as Element).markNeedsBuild();
                          },
                        ),
                        const SizedBox(height: 14),

                        // Row: Purchase Price & Memo Date
                        Row(
                          children: [
                            // Purchase Price
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Purchase Price',
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
                                      controller: item.priceController,
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
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),

                            // Memo Date
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Memo Date',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  GestureDetector(
                                    onTap: () => onPickDate(index),
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
                                        DateFormat('MM/dd/yyyy').format(item.date),
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

                        // Memo (Image or PDF)
                        Text(
                          'Memo (Image or PDF)',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 6),
                        GestureDetector(
                          onTap: () => onAttachMemo(index),
                          child: DashedContainer(
                            borderRadius: 16,
                            color: isDark ? AppColors.borderDark : const Color(0xFFCBD5E1),
                            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                            child: Center(
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    item.slipPdfPath != null
                                        ? LucideIcons.fileText
                                        : LucideIcons.camera,
                                    size: 18,
                                    color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                                  ),
                                  const SizedBox(width: 8),
                                  Flexible(
                                    child: Text(
                                      item.attachmentName ?? 'Attach image or PDF',
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
                      ],
                    ),
                  ),
                ],
              ],
            ),
          );
        }),
        const SizedBox(height: 4),

        // "+ Add Another Company" Dashed Button
        GestureDetector(
          onTap: onAddCompany,
          child: const DashedContainer(
            borderRadius: 22,
            color: Color(0xFF23B386),
            backgroundColor: Colors.transparent,
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Center(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.add, size: 16, color: Color(0xFF23B386)),
                  SizedBox(width: 6),
                  Text(
                    'Add Another Company',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF23B386),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
