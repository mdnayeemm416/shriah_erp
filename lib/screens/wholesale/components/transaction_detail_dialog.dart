import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/theme/app_colors.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../models/wholesale_models.dart';
import '../wholesale_transaction_dialog.dart';
import 'edit_transaction_dialog.dart';

class TransactionDetailDialog extends StatelessWidget {
  final dynamic entry;

  const TransactionDetailDialog({super.key, required this.entry});

  String _fmt(double val) => 'SAR ${val.toStringAsFixed(2)}';
  String _fmtDate(DateTime dt) => DateFormat('M/d/yyyy, h:mm:ss a').format(dt);

  Future<void> _shareToWhatsApp(String mobile, String msg) async {
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    if (cleanMobile.isEmpty) return;
    final url = Uri.parse(
      'https://wa.me/$cleanMobile?text=${Uri.encodeComponent(msg)}',
    );
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _showDeleteConfirm(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(LucideIcons.trash2, color: Colors.red, size: 20),
            SizedBox(width: 8),
            Text('Delete Transaction'),
          ],
        ),
        content: const Text('Are you sure you want to delete this transaction entry? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              final cubit = context.read<WholesaleCubit>();
              if (entry is WholesaleSaleModel) {
                await cubit.deleteSale((entry as WholesaleSaleModel).id);
              } else if (entry is WholesalePurchaseModel) {
                await cubit.deletePurchase((entry as WholesalePurchaseModel).id);
              } else if (entry is WholesalePaymentModel) {
                await cubit.deletePayment((entry as WholesalePaymentModel).id);
              } else if (entry is WholesaleOrderModel) {
                await cubit.deleteOrder((entry as WholesaleOrderModel).id);
              }
              if (ctx.mounted) {
                Navigator.pop(ctx);
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Transaction deleted.')),
                );
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _showEditTransaction(BuildContext context) async {
    if (entry is WholesaleSaleModel) {
      // Open full Sale Checkout Editor dialog
      await showDialog(
        context: context,
        builder: (ctx) => WholesaleTransactionDialog(
          kind: 'sale',
          initialSale: entry as WholesaleSaleModel,
        ),
      );
      if (context.mounted) Navigator.pop(context);
    } else {
      final result = await showDialog<bool>(
        context: context,
        builder: (ctx) => EditTransactionDialog(entry: entry),
      );
      if (result == true && context.mounted) {
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bgColor = isDark ? AppColors.cardDark : Colors.white;
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final bannerBg = isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    final state = context.watch<WholesaleCubit>().state;

    String headerTitle = '';
    String partyName = '';
    String partyMobile = '';
    DateTime createdAt = DateTime.now();
    double totalAmount = 0.0;
    List<WholesaleSaleItemModel> items = [];

    double discount = 0.0;
    double dueAmount = 0.0;
    double paidAmount = 0.0;
    double subtotal = 0.0;
    String paymentMethod = '';
    String saleStatus = '';
    String? notes;

    if (entry is WholesaleSaleModel) {
      final sale = entry as WholesaleSaleModel;
      headerTitle = 'Sale #${sale.invoiceNumber}';
      partyName = sale.customerName.isEmpty ? 'Walk-in Customer' : sale.customerName;
      partyMobile = sale.customerMobile;
      createdAt = sale.createdAt;
      totalAmount = sale.total;
      items = sale.items;
      discount = sale.discount;
      dueAmount = sale.dueAmount;
      subtotal = sale.items.fold(0.0, (sum, i) => sum + (i.qty * i.price));
      paidAmount = (totalAmount - dueAmount).clamp(0.0, double.infinity);
      paymentMethod = sale.paymentMethod;
      saleStatus = sale.status;
    } else if (entry is WholesalePurchaseModel) {
      final purchase = entry as WholesalePurchaseModel;
      headerTitle = 'Purchase #${purchase.invoiceNumber}';
      partyName = purchase.supplierName;
      createdAt = purchase.createdAt;
      totalAmount = purchase.total;
      subtotal = purchase.total;
      paidAmount = purchase.total;
      items = purchase.items;
      notes = purchase.notes;
    } else if (entry is WholesalePaymentModel) {
      final payment = entry as WholesalePaymentModel;
      final isPaymentIn = payment.kind == 'payment_in';
      headerTitle = isPaymentIn ? 'Payment Received' : 'Payment Out';
      
      final customer = state.customers
          .cast<WholesaleCustomerModel?>()
          .firstWhere((c) => c != null && c.id == payment.customerId, orElse: () => null);
      partyName = customer?.name ?? 'Customer';
      partyMobile = customer?.mobile ?? '';
      createdAt = payment.createdAt;
      totalAmount = payment.amount;
      paidAmount = payment.amount;
      notes = payment.notes;
    } else if (entry is WholesaleOrderModel) {
      final order = entry as WholesaleOrderModel;
      headerTitle = 'Order #${order.orderNumber}';
      partyName = order.customerName;
      partyMobile = order.customerMobile;
      createdAt = order.createdAt;
      totalAmount = order.total;
      subtotal = order.total;
      items = order.items;
      notes = order.notes;
    }

    // Receipt text generation for sharing
    String buildShareReceiptText() {
      final buffer = StringBuffer();
      buffer.writeln('🧾 *RECEIPT DETAILS*');
      buffer.writeln('---------------------------');
      buffer.writeln('Header: $headerTitle');
      buffer.writeln('Date: ${_fmtDate(createdAt)}');
      buffer.writeln('Customer: $partyName');
      if (partyMobile.isNotEmpty) buffer.writeln('Mobile: $partyMobile');
      buffer.writeln('---------------------------');
      if (items.isNotEmpty) {
        buffer.writeln('*ITEMS:*');
        for (var i in items) {
          buffer.writeln('• ${i.name} (${i.qty.toInt()} x ${_fmt(i.price)}) = ${_fmt(i.qty * i.price)}');
        }
        buffer.writeln('---------------------------');
      }
      if (discount > 0) buffer.writeln('Discount: -${_fmt(discount)}');
      buffer.writeln('*Total: ${_fmt(totalAmount)}*');
      if (dueAmount > 0) buffer.writeln('Due Amount: ${_fmt(dueAmount)}');
      buffer.writeln('---------------------------');
      buffer.writeln('Thank you!');
      return buffer.toString();
    }

    return Dialog(
      backgroundColor: bgColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 480),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 16, 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    headerTitle,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  InkWell(
                    onTap: () => Navigator.pop(context),
                    borderRadius: BorderRadius.circular(20),
                    child: Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Icon(LucideIcons.x, color: labelColor, size: 20),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 1),

            // Dialog Content Body
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Total Banner Card (Soft Teal background matching Image 1)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: bannerBg,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'TOTAL',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.8,
                              color: isDark ? const Color(0xFF2DD4BF) : const Color(0xFF0D9488),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _fmt(totalAmount),
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.w800,
                              color: isDark ? Colors.white : const Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _fmtDate(createdAt),
                            style: TextStyle(
                              fontSize: 11.5,
                              color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Customer Card (Matching Image 1)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: borderColor),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'CUSTOMER',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.8,
                              color: labelColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            partyName,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Items Card (Matching Image 1)
                    if (items.isNotEmpty) ...[
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
                            Text(
                              'ITEMS',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.8,
                                color: labelColor,
                              ),
                            ),
                            const SizedBox(height: 12),
                            ...items.map((it) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 10.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            it.name,
                                            style: TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w600,
                                              color: textColor,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        Text(
                                          _fmt(it.qty * it.price),
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: textColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${it.qty.toInt()} × ${_fmt(it.price)}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: labelColor,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                    ],

                    // 3 Stat Pills Row (SUBTOTAL, PAID, DUE matching Image 1)
                    Row(
                      children: [
                        Expanded(
                          child: _buildStatPill(
                            label: 'SUBTOTAL',
                            value: _fmt(subtotal > 0 ? subtotal : totalAmount),
                            valueColor: textColor,
                            cardBg: cardBg,
                            borderColor: borderColor,
                            labelColor: labelColor,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildStatPill(
                            label: 'PAID',
                            value: _fmt(paidAmount),
                            valueColor: const Color(0xFF10B981), // Green
                            cardBg: cardBg,
                            borderColor: borderColor,
                            labelColor: labelColor,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildStatPill(
                            label: 'DUE',
                            value: _fmt(dueAmount),
                            valueColor: dueAmount > 0 ? Colors.red : textColor,
                            cardBg: cardBg,
                            borderColor: borderColor,
                            labelColor: labelColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Footer Actions Row (Matching Image 1: [ Edit ], [ 80mm by AM ], [ Invoice V2 ])
            const Divider(height: 1, thickness: 1),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  // Edit Button
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: BorderSide(color: borderColor),
                        backgroundColor: cardBg,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => _showEditTransaction(context),
                      icon: Icon(LucideIcons.pencil, size: 14, color: textColor),
                      label: Text(
                        'Edit',
                        style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // 80mm by AM Button (Teal filled)
                  Expanded(
                    flex: 1,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () {
                        if (partyMobile.isNotEmpty) {
                          _shareToWhatsApp(partyMobile, buildShareReceiptText());
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Printing thermal receipt...')),
                          );
                        }
                      },
                      icon: const Icon(LucideIcons.printer, size: 14, color: Colors.white),
                      label: const Text(
                        '80mm by AM',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Invoice V2 Button
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: BorderSide(color: borderColor),
                        backgroundColor: cardBg,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Generating Invoice V2 PDF...')),
                        );
                      },
                      icon: Icon(LucideIcons.fileText, size: 14, color: textColor),
                      label: Text(
                        'Invoice V2',
                        style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 12),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatPill({
    required String label,
    required String value,
    required Color valueColor,
    required Color cardBg,
    required Color borderColor,
    required Color labelColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 9.5,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
              color: labelColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.bold,
              color: valueColor,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
