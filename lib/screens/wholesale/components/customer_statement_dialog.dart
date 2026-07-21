import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';

class CustomerStatementDialog extends StatelessWidget {
  final WholesaleCustomerModel customer;
  final WholesaleState state;

  const CustomerStatementDialog({
    super.key,
    required this.customer,
    required this.state,
  });

  String _fmt(double val) {
    return '${val.toStringAsFixed(2)} SAR';
  }

  Future<void> _shareToWhatsApp(String mobile, String msg) async {
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    final url = Uri.parse(
      'https://wa.me/$cleanMobile?text=${Uri.encodeComponent(msg)}',
    );
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lines = <Map<String, dynamic>>[];

    // Add Sales
    final customerSales = state.sales.where(
      (s) => s.customerId == customer.id && s.status != 'cancelled',
    );
    for (final sale in customerSales) {
      lines.add({
        'date': sale.createdAt,
        'type': 'sale',
        'ref': 'Invoice #${sale.invoiceNumber}',
        'debit': sale.dueAmount,
        'credit': 0.0,
      });
    }

    // Add Payments
    final customerPayments = state.payments.where(
      (p) => p.customerId == customer.id && p.kind == 'payment_in',
    );
    for (final pay in customerPayments) {
      lines.add({
        'date': pay.createdAt,
        'type': 'payment',
        'ref': pay.notes ?? 'Payment received',
        'debit': 0.0,
        'credit': pay.amount,
      });
    }

    lines.sort(
      (a, b) => (a['date'] as DateTime).compareTo(b['date'] as DateTime),
    );

    double runningBalance = customer.openingDue;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.teal.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(LucideIcons.fileText, color: Colors.teal, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  customer.name,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const Text(
                  'Customer Ledger Statement',
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ),
        ],
      ),
      content: SizedBox(
        width: 700,
        height: 520,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? Colors.white.withValues(alpha: 0.03) : Colors.black.withValues(alpha: 0.02),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isDark ? Colors.white10 : Colors.black12,
                  width: 0.5,
                ),
              ),
              child: Wrap(
                spacing: 12,
                runSpacing: 8,
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Opening Balance: ${_fmt(customer.openingDue)}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Outstanding Due: ${_fmt(state.getCustomerDue(customer.id))}',
                        style: TextStyle(
                          fontSize: 12, 
                          fontWeight: FontWeight.bold,
                          color: state.getCustomerDue(customer.id) > 0 ? Colors.red : Colors.green,
                        ),
                      ),
                    ],
                  ),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    icon: const Icon(LucideIcons.messageCircle, size: 14, color: Colors.white),
                    label: const Text(
                      'Share Ledger', 
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)
                    ),
                    onPressed: () {
                      String statementText =
                          'Ledger Statement for ${customer.name}\n'
                          'Starting Balance: ${_fmt(customer.openingDue)}\n\n';

                      double run = customer.openingDue;
                      for (final row in lines) {
                        run +=
                            (row['debit'] as double) -
                            (row['credit'] as double);
                        final dateStr = DateFormat(
                          'yyyy-MM-dd',
                        ).format(row['date'] as DateTime);
                        statementText +=
                            '$dateStr | ${row['ref']} | Debit: ${row['debit']} | Credit: ${row['credit']} | Bal: ${_fmt(run)}\n';
                      }

                      statementText += '\nFinal Balance Due: ${_fmt(run)}';
                      _shareToWhatsApp(customer.mobile, statementText);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: isDark ? Colors.white10 : Colors.black12),
                  borderRadius: BorderRadius.circular(10),
                ),
                clipBehavior: Clip.antiAlias,
                child: SingleChildScrollView(
                  scrollDirection: Axis.vertical,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: SizedBox(
                      width: 650,
                      child: Table(
                        border: TableBorder.symmetric(
                          inside: BorderSide(
                            color: isDark ? Colors.white.withValues(alpha: 0.06) : Colors.black.withValues(alpha: 0.06),
                            width: 0.5,
                          ),
                        ),
                        columnWidths: const {
                          0: FlexColumnWidth(2.2),
                          1: FlexColumnWidth(3),
                          2: FlexColumnWidth(1.4),
                          3: FlexColumnWidth(1.4),
                          4: FlexColumnWidth(1.6),
                        },
                        children: [
                          TableRow(
                            decoration: BoxDecoration(
                              color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.04),
                            ),
                            children: const [
                              Padding(
                                padding: EdgeInsets.all(10.0),
                                child: Text(
                                  'Date',
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.all(10.0),
                                child: Text(
                                  'Reference',
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.all(10.0),
                                child: Text(
                                  'Debit (+)',
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.redAccent),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.all(10.0),
                                child: Text(
                                  'Credit (-)',
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.green),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.all(10.0),
                                child: Text(
                                  'Due Bal',
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
                                ),
                              ),
                            ],
                          ),
                          ...lines.map((row) {
                            runningBalance +=
                                (row['debit'] as double) -
                                (row['credit'] as double);
                            final isSale = row['type'] == 'sale';

                            return TableRow(
                              decoration: BoxDecoration(
                                color: isSale
                                    ? Colors.transparent
                                    : (isDark ? Colors.teal.withValues(alpha: 0.02) : Colors.teal.withValues(alpha: 0.015)),
                              ),
                              children: [
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                  child: Text(
                                    DateFormat('yyyy-MM-dd HH:mm').format(row['date'] as DateTime),
                                    style: const TextStyle(fontSize: 11),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                  child: Text(
                                    row['ref'] as String,
                                    style: const TextStyle(fontSize: 11),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                  child: Text(
                                    row['debit'] > 0 ? _fmt(row['debit'] as double) : '-',
                                    style: const TextStyle(fontSize: 11, color: Colors.redAccent),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                  child: Text(
                                    row['credit'] > 0 ? _fmt(row['credit'] as double) : '-',
                                    style: const TextStyle(fontSize: 11, color: Colors.green),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                  child: Text(
                                    _fmt(runningBalance),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                    ),
                                  ),
                                ),
                              ],
                            );
                          }),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Close', style: TextStyle(color: Colors.grey)),
        ),
      ],
    );
  }
}
