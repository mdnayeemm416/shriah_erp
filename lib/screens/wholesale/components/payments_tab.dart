import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';
import 'transaction_detail_dialog.dart';

class PaymentsTab extends StatelessWidget {
  const PaymentsTab({super.key});

  String _fmt(double val) => '${val.toStringAsFixed(2)} SAR';
  String _fmtDate(DateTime dt) => DateFormat('yyyy-MM-dd HH:mm').format(dt);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        if (state.payments.isEmpty) {
          return const Center(child: Text('No payment ledgers recorded.'));
        }

        return ListView.separated(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          itemCount: state.payments.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final payment = state.payments[index];
            final customerName =
                state.customers
                    .cast<WholesaleCustomerModel?>()
                    .firstWhere(
                      (c) => c != null && c.id == payment.customerId,
                      orElse: () => null,
                    )
                    ?.name ??
                'Walk-in Customer';

            return Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.grey.withValues(alpha: 0.2)),
              ),
              child: InkWell(
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (ctx) => TransactionDetailDialog(entry: payment),
                  );
                },
                borderRadius: BorderRadius.circular(16),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.teal.withValues(alpha: 0.1),
                        child: const Icon(LucideIcons.coins, color: Colors.teal),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              customerName,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${payment.notes ?? 'Payment received'} • ${_fmtDate(payment.createdAt)}',
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
                      const SizedBox(width: 16),
                      Text(
                        '+ ${_fmt(payment.amount)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.green,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
