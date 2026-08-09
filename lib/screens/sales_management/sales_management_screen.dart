import 'package:flutter/material.dart';
import 'package:toastification/toastification.dart';

import 'components/sales_management_header.dart';
import 'components/shop_visit_form.dart';
import 'components/visit_history_dashboard.dart';

class SalesManagementScreen extends StatefulWidget {
  const SalesManagementScreen({super.key});

  @override
  State<SalesManagementScreen> createState() => _SalesManagementScreenState();
}

class _SalesManagementScreenState extends State<SalesManagementScreen> {
  void _handleVisitSubmit(
    String customerName,
    double amount,
    String notes,
    String photoPath,
  ) {
    toastification.show(
      context: context,
      type: ToastificationType.success,
      style: ToastificationStyle.flatColored,
      title: const Text('Success'),
      description: Text('Shop visit for "$customerName" submitted successfully.'),
      autoCloseDuration: const Duration(seconds: 4),
      showProgressBar: true,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : Colors.black;
    final subtextColor = isDark ? Colors.grey[400] : const Color(0xFF64748B);
    final borderColor = isDark ? Colors.white10 : Colors.black.withValues(alpha: 0.05);

    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      behavior: HitTestBehavior.opaque,
      child: Scaffold(
        backgroundColor: bgColor,
        body: SafeArea(
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Top Tab & Titles Header
              SliverToBoxAdapter(
                child: SalesManagementHeader(
                  isDark: isDark,
                  textColor: textColor,
                  subtextColor: subtextColor,
                ),
              ),

              // Active Tab Content Widget
              SliverPadding(
                padding: const EdgeInsets.all(16.0),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    ShopVisitForm(
                      cardBg: cardBg,
                      textColor: textColor,
                      subtextColor: subtextColor,
                      borderColor: borderColor,
                      isDark: isDark,
                      onSubmit: _handleVisitSubmit,
                    ),
                    const SizedBox(height: 24),
                    VisitHistoryDashboard(
                      cardBg: cardBg,
                      textColor: textColor,
                      subtextColor: subtextColor,
                      borderColor: borderColor,
                      isDark: isDark,
                    ),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
