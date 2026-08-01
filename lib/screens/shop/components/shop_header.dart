import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

class ShopHeader extends StatelessWidget implements PreferredSizeWidget {
  final int shopCount;
  final bool isDark;
  final VoidCallback? onNewEntry;
  final VoidCallback onManageShops;
  final VoidCallback onManageCashiers;

  final VoidCallback onImportData;
  final VoidCallback onExportPdf;
  final VoidCallback onExportExcel;

  const ShopHeader({
    super.key,
    required this.shopCount,
    required this.isDark,
    this.onNewEntry,
    required this.onManageShops,
    required this.onManageCashiers,
    required this.onImportData,
    required this.onExportPdf,
    required this.onExportExcel,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;

    return AppBar(
      backgroundColor: isDark ? AppColors.bgDark : AppColors.bgLight,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      title: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: borderColor),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              LucideIcons.store,
              size: 16,
              color: Color(0xFF24B489),
            ),
            const SizedBox(width: 8),
            Text(
              'Shops · $shopCount',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
      actions: [
        Container(
          margin: const EdgeInsets.only(right: 16),
          decoration: BoxDecoration(
            color: cardBg,
            shape: BoxShape.circle,
            border: Border.all(color: borderColor),
          ),
          child: PopupMenuButton<String>(
            icon: Icon(LucideIcons.moreVertical, size: 18, color: textColor),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            color: isDark ? AppColors.cardDark : Colors.white,
            elevation: 8,
            onSelected: (value) {
              switch (value) {
                case 'new_entry':
                  onNewEntry?.call();
                  break;
                case 'shops':
                  onManageShops();
                  break;
                case 'cashiers':
                  onManageCashiers();
                  break;
                case 'import':
                  onImportData();
                  break;
                case 'pdf':
                  onExportPdf();
                  break;
                case 'excel':
                  onExportExcel();
                  break;
              }
            },
            itemBuilder: (context) => [
              if (onNewEntry != null) ...[
                PopupMenuItem<String>(
                  value: 'new_entry',
                  height: 40,
                  child: Row(
                    children: [
                      const Icon(LucideIcons.plus, size: 18, color: AppColors.primary),
                      const SizedBox(width: 12),
                      Text(
                        'New Entry',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: isDark ? Colors.white : const Color(0xFF1E293B),
                        ),
                      ),
                    ],
                  ),
                ),
                const PopupMenuDivider(height: 1),
              ],
              PopupMenuItem<String>(
                enabled: false,
                height: 32,
                child: Padding(
                  padding: const EdgeInsets.only(top: 6, bottom: 2),
                  child: Text(
                    'SHOP TOOLS',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: isDark ? Colors.grey.shade400 : const Color(0xFF64748B),
                      letterSpacing: 0.6,
                    ),
                  ),
                ),
              ),
              PopupMenuItem<String>(
                value: 'shops',
                height: 40,
                child: Row(
                  children: [
                    Icon(LucideIcons.store, size: 18, color: isDark ? Colors.grey.shade300 : const Color(0xFF475569)),
                    const SizedBox(width: 12),
                    Text(
                      'Manage Shops',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        color: isDark ? Colors.white : const Color(0xFF1E293B),
                      ),
                    ),
                  ],
                ),
              ),
              PopupMenuItem<String>(
                value: 'cashiers',
                height: 40,
                child: Row(
                  children: [
                    Icon(LucideIcons.wallet, size: 18, color: isDark ? Colors.grey.shade300 : const Color(0xFF475569)),
                    const SizedBox(width: 12),
                    Text(
                      'Cashiers',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        color: isDark ? Colors.white : const Color(0xFF1E293B),
                      ),
                    ),
                  ],
                ),
              ),

              PopupMenuItem<String>(
                value: 'import',
                height: 40,
                child: Row(
                  children: [
                    Icon(LucideIcons.fileSpreadsheet, size: 18, color: isDark ? Colors.grey.shade300 : const Color(0xFF475569)),
                    const SizedBox(width: 12),
                    Text(
                      'Import Sales',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        color: isDark ? Colors.white : const Color(0xFF1E293B),
                      ),
                    ),
                  ],
                ),
              ),
              const PopupMenuDivider(height: 1),
              PopupMenuItem<String>(
                value: 'excel',
                height: 40,
                child: Row(
                  children: [
                    Icon(LucideIcons.fileDown, size: 18, color: isDark ? Colors.grey.shade300 : const Color(0xFF475569)),
                    const SizedBox(width: 12),
                    Text(
                      'Export Excel',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        color: isDark ? Colors.white : const Color(0xFF1E293B),
                      ),
                    ),
                  ],
                ),
              ),
              PopupMenuItem<String>(
                value: 'pdf',
                height: 40,
                child: Row(
                  children: [
                    Icon(LucideIcons.fileText, size: 18, color: isDark ? Colors.grey.shade300 : const Color(0xFF475569)),
                    const SizedBox(width: 12),
                    Text(
                      'Export PDF',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        color: isDark ? Colors.white : const Color(0xFF1E293B),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
