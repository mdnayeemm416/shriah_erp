import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../models/wholesale_models.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import 'add_customer_dialog.dart';
import 'add_party_bottom_sheet.dart';
import 'customer_statement_dialog.dart';
import 'payment_in_dialog.dart';
import '../wholesale_transaction_dialog.dart';

class CustomersTab extends StatefulWidget {
  const CustomersTab({super.key});

  @override
  State<CustomersTab> createState() => _CustomersTabState();
}

class _CustomersTabState extends State<CustomersTab> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  String _fmt(double val) => 'SAR ${val.toStringAsFixed(2)}';
  String _fmtShort(double val) => 'SAR ${val.toInt()}';

  Future<void> _shareToWhatsApp(String mobile, String msg) async {
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    final url = Uri.parse(
      'https://wa.me/$cleanMobile?text=${Uri.encodeComponent(msg)}',
    );
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _showAddCustomerDialog(BuildContext context, [WholesaleCustomerModel? customerToEdit]) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) => AddPartyBottomSheet(
        initialType: 'Customer',
        partyToEdit: customerToEdit,
      ),
    );
  }

  void _showCustomerDetailSheet(BuildContext context, WholesaleCustomerModel customer, WholesaleState state) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    final dueBalance = state.getCustomerDue(customer.id);

    // Calculate customer total sales & total paid
    final customerSales = state.sales.where((s) => s.customerId == customer.id || s.customerName.toLowerCase() == customer.name.toLowerCase());
    final totalSalesAmt = customerSales.fold(0.0, (sum, s) => sum + s.total);
    final totalPaidAmt = customerSales.fold(0.0, (sum, s) => sum + (s.total - s.discount - s.dueAmount));

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return DraggableScrollableSheet(
          expand: false,
          initialChildSize: 0.85,
          maxChildSize: 0.95,
          minChildSize: 0.5,
          builder: (ctx, scrollController) {
            return SingleChildScrollView(
              controller: scrollController,
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Grab handle
                  Center(
                    child: Container(
                      width: 36,
                      height: 4,
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white24 : Colors.black12,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Header with Customer Avatar & Name (Image 3)
                  Row(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: const BoxDecoration(
                          color: Color(0xFFE6F4F1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(LucideIcons.user, color: primaryColor, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        customer.name,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // CURRENT DUE Banner Card (Matching Image 3)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'CURRENT DUE',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                            color: isDark ? const Color(0xFF2DD4BF) : const Color(0xFF0D9488),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _fmt(dueBalance),
                          style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 12),

                        // 3 Sub-stat Pills Row (OPENING, TOTAL SALES, TOTAL PAID)
                        Row(
                          children: [
                            _buildMiniStatPill('OPENING', customer.openingDue.toStringAsFixed(2), cardBg, textColor, labelColor),
                            const SizedBox(width: 6),
                            _buildMiniStatPill('TOTAL SALES', totalSalesAmt.toStringAsFixed(2), cardBg, textColor, labelColor),
                            const SizedBox(width: 6),
                            _buildMiniStatPill('TOTAL PAID', totalPaidAmt.toStringAsFixed(2), cardBg, primaryColor, labelColor),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text('Last payment: —', style: TextStyle(fontSize: 11, color: labelColor)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // 6 Quick Action Buttons (Matching Image 3)
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 3,
                    childAspectRatio: 2.2,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                    children: [
                      // Payment In
                      _buildActionButton(
                        icon: LucideIcons.wallet,
                        label: 'Payment In',
                        color: textColor,
                        cardBg: cardBg,
                        borderColor: borderColor,
                        onTap: () {
                          Navigator.pop(ctx);
                          showDialog(context: context, builder: (_) => const PaymentInDialog());
                        },
                      ),
                      // Statement
                      _buildActionButton(
                        icon: LucideIcons.fileText,
                        label: 'Statement',
                        color: textColor,
                        cardBg: cardBg,
                        borderColor: borderColor,
                        onTap: () {
                          Navigator.pop(ctx);
                          showDialog(
                            context: context,
                            builder: (_) => CustomerStatementDialog(customer: customer, state: state),
                          );
                        },
                      ),
                      // New Sale
                      _buildActionButton(
                        icon: LucideIcons.shoppingCart,
                        label: 'New Sale',
                        color: textColor,
                        cardBg: cardBg,
                        borderColor: borderColor,
                        onTap: () {
                          Navigator.pop(ctx);
                          showDialog(
                            context: context,
                            builder: (_) => WholesaleTransactionDialog(
                              kind: 'sale',
                              initialSale: WholesaleSaleModel(
                                id: '',
                                invoiceNumber: 0,
                                customerId: customer.id,
                                customerName: customer.name,
                                customerMobile: customer.mobile,
                                items: [],
                                total: 0,
                                discount: 0,
                                dueAmount: 0,
                                paymentMethod: 'cash',
                                status: 'completed',
                                isDeleted: false,
                                createdAt: DateTime.now(),
                              ),
                            ),
                          );
                        },
                      ),
                      // Share
                      _buildActionButton(
                        icon: LucideIcons.messageCircle,
                        label: 'Share',
                        color: textColor,
                        cardBg: cardBg,
                        borderColor: borderColor,
                        onTap: () {
                          final msg =
                              'Dear ${customer.name}, your total outstanding balance is ${_fmt(dueBalance)}.\nThank you!';
                          _shareToWhatsApp(customer.mobile, msg);
                        },
                      ),
                      // Edit (Allows Customer Info Editing!)
                      _buildActionButton(
                        icon: LucideIcons.edit,
                        label: 'Edit',
                        color: textColor,
                        cardBg: cardBg,
                        borderColor: borderColor,
                        onTap: () {
                          Navigator.pop(ctx);
                          _showAddCustomerDialog(context, customer);
                        },
                      ),
                      // Delete
                      _buildActionButton(
                        icon: LucideIcons.trash2,
                        label: 'Delete',
                        color: Colors.red,
                        cardBg: cardBg,
                        borderColor: const Color(0xFFFCA5A5),
                        onTap: () {
                          Navigator.pop(ctx);
                          _confirmDeleteCustomer(context, customer);
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // BASIC INFO Card (Matching Image 3)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('BASIC INFO', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8, color: labelColor)),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Icon(LucideIcons.phone, size: 16, color: labelColor),
                            const SizedBox(width: 10),
                            Text(customer.mobile.isEmpty ? '—' : customer.mobile, style: TextStyle(fontSize: 13, color: textColor)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(LucideIcons.hash, size: 16, color: labelColor),
                            const SizedBox(width: 10),
                            Text(customer.vatNumber ?? 'No VAT number', style: TextStyle(fontSize: 13, color: textColor)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(LucideIcons.mapPin, size: 16, color: labelColor),
                            const SizedBox(width: 10),
                            Text(customer.address ?? '—', style: TextStyle(fontSize: 13, color: textColor)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // FINANCIAL Card (Matching Image 3)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('FINANCIAL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8, color: labelColor)),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('OPENING BALANCE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: labelColor)),
                                    const SizedBox(height: 2),
                                    Text(_fmt(customer.openingDue), style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: textColor)),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('CREDIT LIMIT', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: labelColor)),
                                    const SizedBox(height: 2),
                                    Text(_fmt(customer.creditLimit), style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: textColor)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // TAGS Card (Matching Image 3)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('TAGS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8, color: labelColor)),
                        const SizedBox(height: 6),
                        Text('No tags. Tap Edit to add.', style: TextStyle(fontSize: 12, color: labelColor)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Close Button
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: BorderSide(color: borderColor),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => Navigator.pop(ctx),
                      child: Text('Close', style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 14)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildMiniStatPill(String label, String value, Color cardBg, Color textColor, Color labelColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold, color: labelColor),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textColor),
              maxLines: 1,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required Color cardBg,
    required Color borderColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: color),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmDeleteCustomer(BuildContext context, WholesaleCustomerModel customer) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Customer Profile'),
        content: Text('Are you sure you want to delete "${customer.name}"?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              context.read<WholesaleCubit>().deleteCustomer(customer.id);
              Navigator.pop(ctx);
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        final customers = state.customers.where((c) => !c.isDeleted).toList();

        // Calculate Customer Metrics (Image 1)
        final totalCustomers = customers.length;
        int customersWithDueCount = 0;
        double totalDueSum = 0.0;

        for (final c in customers) {
          final due = state.getCustomerDue(c.id);
          if (due > 0) {
            customersWithDueCount++;
            totalDueSum += due;
          }
        }

        final filtered = customers.where((c) {
          if (_searchQuery.isEmpty) return true;
          final q = _searchQuery.toLowerCase();
          return c.name.toLowerCase().contains(q) || c.mobile.contains(q);
        }).toList();

        return SingleChildScrollView(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Metric Stat Cards Row (3 rounded white cards - Image 1)
              Row(
                children: [
                  Expanded(
                    child: _buildMetricCard('CUSTOMERS', '$totalCustomers', LucideIcons.users, cardBg, textColor, labelColor, borderColor),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildMetricCard('WITH DUE', '$customersWithDueCount', LucideIcons.alertCircle, cardBg, textColor, labelColor, borderColor),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildMetricCard('TOTAL DUE', _fmtShort(totalDueSum), LucideIcons.wallet, cardBg, textColor, labelColor, borderColor),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // 2. Search Field & + Add customer Button Row (Matching Image 1)
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      style: TextStyle(fontSize: 13, color: textColor),
                      onChanged: (val) => setState(() => _searchQuery = val.trim()),
                      decoration: InputDecoration(
                        hintText: 'Search by name, phone or...',
                        hintStyle: TextStyle(fontSize: 13, color: labelColor),
                        prefixIcon: Icon(LucideIcons.search, size: 16, color: labelColor),
                        filled: true,
                        fillColor: cardBg,
                        contentPadding: const EdgeInsets.symmetric(vertical: 12),
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
                          borderSide: const BorderSide(color: primaryColor, width: 1.5),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),

                  // + Add customer Button (Solid Mint #24B489)
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    onPressed: () => _showAddCustomerDialog(context),
                    icon: const Icon(LucideIcons.userPlus, size: 16, color: Colors.white),
                    label: const Text(
                      'Add customer',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // 3. Filter Pills Row (Payment In)
              Row(
                children: [
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      side: BorderSide(color: borderColor),
                      backgroundColor: cardBg,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    onPressed: () => showDialog(context: context, builder: (_) => const PaymentInDialog()),
                    icon: Icon(LucideIcons.wallet, size: 14, color: textColor),
                    label: Text('Payment In', style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // 4. Customer List Cards (Matching Image 1)
              if (filtered.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(30.0),
                    child: Text('No customers found', style: TextStyle(color: labelColor, fontSize: 13)),
                  ),
                )
              else
                ...filtered.map((customer) {
                  final dueBalance = state.getCustomerDue(customer.id);

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 10.0),
                    child: InkWell(
                      onTap: () => _showCustomerDetailSheet(context, customer, state),
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: borderColor),
                        ),
                        child: Row(
                          children: [
                            // Circular Mint Icon Avatar
                            Container(
                              width: 42,
                              height: 42,
                              decoration: const BoxDecoration(
                                color: Color(0xFFE6F4F1),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(LucideIcons.user, color: primaryColor, size: 20),
                            ),
                            const SizedBox(width: 14),

                            // Customer Info
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    customer.name,
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                      color: textColor,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    customer.mobile.isEmpty ? '—' : customer.mobile,
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: labelColor,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFE6F4F1),
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: Text(
                                      'Due ${_fmt(dueBalance)}',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF0D9488),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMetricCard(
    String label,
    String value,
    IconData icon,
    Color cardBg,
    Color textColor,
    Color labelColor,
    Color borderColor,
  ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: labelColor.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 16, color: labelColor),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 8.5,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                    color: labelColor,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: textColor,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
