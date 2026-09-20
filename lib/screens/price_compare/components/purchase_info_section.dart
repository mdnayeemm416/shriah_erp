import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dashed_container.dart';

class CompanyPurchaseEntry {
  final TextEditingController companyController;
  final TextEditingController priceController;
  DateTime date;
  String? attachmentName;
  bool isExpanded;

  CompanyPurchaseEntry({
    required this.companyController,
    required this.priceController,
    DateTime? date,
    this.attachmentName,
    this.isExpanded = true,
  }) : date = date ?? DateTime.now();
}

class PurchaseInfoSection extends StatelessWidget {
  final List<CompanyPurchaseEntry> purchases;
  final VoidCallback onAddCompany;
  final Function(int) onToggleExpand;
  final Function(int) onPickDate;
  final Function(int) onAttachMemo;
  final Function(int)? onRemoveCompany;

  const PurchaseInfoSection({
    super.key,
    required this.purchases,
    required this.onAddCompany,
    required this.onToggleExpand,
    required this.onPickDate,
    required this.onAttachMemo,
    this.onRemoveCompany,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header Row
        Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: const BoxDecoration(
                color: Color(0xFFE8F7F2),
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
                const Text(
                  'Purchase Information',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 1),
                Text(
                  '${purchases.length} ${purchases.length == 1 ? "company" : "companies"}',
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
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
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE2E8F0)),
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
                          decoration: const BoxDecoration(
                            color: Color(0xFFE8F7F2),
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
                                'Purchase #${index + 1}',
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item.companyController.text.isNotEmpty
                                    ? item.companyController.text
                                    : 'Tap to fill details',
                                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                        ),

                        // Expand / Collapse Chevron
                        Icon(
                          item.isExpanded ? LucideIcons.chevronUp : LucideIcons.chevronDown,
                          size: 18,
                          color: const Color(0xFF64748B),
                        ),
                      ],
                    ),
                  ),
                ),

                // Expanded Fields
                if (item.isExpanded) ...[
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Company Name Field
                        const Text(
                          'Company Name',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          height: 48,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: TextField(
                            controller: item.companyController,
                            decoration: const InputDecoration(
                              hintText: 'Search or type new company',
                              hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                              border: InputBorder.none,
                              contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            ),
                          ),
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
                                  const Text(
                                    'Purchase Price',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF1E293B),
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Container(
                                    height: 48,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: const Color(0xFFE2E8F0)),
                                    ),
                                    child: TextField(
                                      controller: item.priceController,
                                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
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
                                  const Text(
                                    'Memo Date',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF1E293B),
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  GestureDetector(
                                    onTap: () => onPickDate(index),
                                    child: Container(
                                      height: 48,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(16),
                                        border: Border.all(color: const Color(0xFFE2E8F0)),
                                      ),
                                      padding: const EdgeInsets.symmetric(horizontal: 14),
                                      alignment: Alignment.centerLeft,
                                      child: Text(
                                        DateFormat('MM/dd/yyyy').format(item.date),
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w500,
                                          color: Color(0xFF1E293B),
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
                        const Text(
                          'Memo (Image or PDF)',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 6),
                        GestureDetector(
                          onTap: () => onAttachMemo(index),
                          child: DashedContainer(
                            borderRadius: 16,
                            color: const Color(0xFFCBD5E1),
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            child: Center(
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(LucideIcons.camera, size: 18, color: Color(0xFF64748B)),
                                  const SizedBox(width: 8),
                                  Text(
                                    item.attachmentName ?? 'Attach image or PDF',
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                      color: Color(0xFF475569),
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
