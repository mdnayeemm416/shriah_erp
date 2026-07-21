import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_colors.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';
import '../wholesale_transaction_dialog.dart';

class OrdersTab extends StatelessWidget {
  const OrdersTab({super.key});

  String _fmt(double val) => '${val.toStringAsFixed(2)} SAR';
  String _fmtDate(DateTime dt) => DateFormat('yyyy-MM-dd HH:mm').format(dt);

  void _showTransactionDialog(
    BuildContext context,
    String kind, {
    WholesaleOrderModel? initialOrder,
  }) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => WholesaleTransactionDialog(
        kind: kind,
        initialOrder: initialOrder,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        if (state.orders.isEmpty) {
          return const Center(child: Text('No storefront web orders filed.'));
        }

        return ListView.separated(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          itemCount: state.orders.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final order = state.orders[index];
            final isPending = order.status == 'pending';

            return Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.grey.withValues(alpha: 0.2)),
              ),
              child: ExpansionTile(
                title: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            order.customerName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Order #${order.orderNumber} • ${_fmtDate(order.createdAt)}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _fmt(order.total),
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: isPending
                              ? Colors.orange.withValues(alpha: 0.1)
                              : Colors.green.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          order.status.toUpperCase(),
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: isPending ? Colors.orange : Colors.green,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Address: ${order.customerAddress ?? 'N/A'}'),
                        const SizedBox(height: 4),
                        if (order.notes != null) ...[
                          Text(
                            'Notes: ${order.notes}',
                            style: const TextStyle(
                              fontStyle: FontStyle.italic,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 12),
                        ],
                        const Text(
                          'Cart Items',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 8),
                        ...order.items.map(
                          (it) => Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    '${it.name} (x${it.qty.toInt()})',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(_fmt(it.qty * it.price)),
                              ],
                            ),
                          ),
                        ),
                        const Divider(height: 24),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          alignment: WrapAlignment.end,
                          children: [
                            if (isPending) ...[
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                ),
                                icon: const Icon(LucideIcons.xCircle, size: 14),
                                label: const Text('Cancel Order'),
                                onPressed: () {
                                  context.read<WholesaleCubit>().cancelOrder(order.id);
                                },
                              ),
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                ),
                                icon: const Icon(LucideIcons.refreshCw, size: 14),
                                label: const Text('Convert to Sale'),
                                onPressed: () {
                                  _showTransactionDialog(
                                    context,
                                    'sale',
                                    initialOrder: order,
                                  );
                                },
                              ),
                            ],
                          ],
                        ),
                      ],
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
}
