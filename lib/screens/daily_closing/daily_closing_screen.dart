import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../blocs/daily_closing/daily_closing_cubit.dart';
import '../../blocs/working_date/working_date_cubit.dart';
import '../../blocs/auth/auth_cubit.dart';
import '../../blocs/auth/auth_state.dart';
import '../../models/cash_holder_model.dart';
import '../../core/theme/app_colors.dart';

class DailyClosingScreen extends StatefulWidget {
  const DailyClosingScreen({super.key});

  @override
  State<DailyClosingScreen> createState() => _DailyClosingScreenState();
}

class _DailyClosingScreenState extends State<DailyClosingScreen> {
  final TextEditingController _notesController = TextEditingController();
  final List<TextEditingController> _holderNameControllers = [];
  final List<TextEditingController> _holderAmountControllers = [];

  @override
  void initState() {
    super.initState();
    final workingDate = context.read<WorkingDateCubit>().state;
    context.read<DailyClosingCubit>().loadDate(workingDate);
  }

  @override
  void dispose() {
    _notesController.dispose();
    for (final c in _holderNameControllers) {
      c.dispose();
    }
    for (final c in _holderAmountControllers) {
      c.dispose();
    }
    super.dispose();
  }

  void _syncControllers(DailyClosingState state) {
    if (_notesController.text != state.notes) {
      _notesController.text = state.notes;
    }

    // Sync holder controllers
    if (_holderNameControllers.length != state.holders.length) {
      // Recreate
      for (final c in _holderNameControllers) {
        c.dispose();
      }
      for (final c in _holderAmountControllers) {
        c.dispose();
      }
      _holderNameControllers.clear();
      _holderAmountControllers.clear();

      for (final h in state.holders) {
        _holderNameControllers.add(TextEditingController(text: h.name));
        _holderAmountControllers.add(TextEditingController(text: h.amount > 0 ? h.amount.toStringAsFixed(2) : ''));
      }
    }
  }

  Future<void> _shareToWhatsApp(DailyClosingState state) async {
    const currency = 'SAR';
    final formatter = NumberFormat.currency(symbol: currency);

    final title = 'Daily Closing Report - ${DateFormat('yyyy-MM-dd').format(state.date)}';
    final lines = [
      '*$title*',
      '--------------------------------',
      'Opening Cash: ${formatter.format(state.openingCash)}',
      'Cash Sales & Other In: ${formatter.format(state.cashSale)}',
      'Withdrawals: ${formatter.format(state.withdraw)}',
      '--------------------------------',
      'Operating Expenses: -${formatter.format(state.expense)}',
      'Distributed Cash: -${formatter.format(state.distributionTotal)}',
      '--------------------------------',
      'Expected Closing: ${formatter.format(state.expectedClosing)}',
      'Counted Cash: ${formatter.format(state.countedCash)}',
      'Difference: ${formatter.format(state.difference)} (${state.statusTone.toUpperCase()})',
      '--------------------------------',
    ];

    if (state.notes.isNotEmpty) {
      lines.add('Notes: ${state.notes}');
    }

    final message = Uri.encodeComponent(lines.join('\n'));
    final url = Uri.parse('https://wa.me/?text=$message');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return BlocConsumer<DailyClosingCubit, DailyClosingState>(
      listener: (context, state) {
        _syncControllers(state);
      },
      builder: (context, state) {
        if (state.loading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        _syncControllers(state);
        final currencyFormatter = NumberFormat.currency(symbol: 'SAR');

        return Scaffold(
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Daily Closing',
                          style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, letterSpacing: -0.5),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Review cash drawer positions, lock registries and trace variance.',
                          style: TextStyle(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[600]),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      onPressed: () => _shareToWhatsApp(state),
                      icon: const Icon(LucideIcons.share2, size: 16),
                      label: const Text('Share WhatsApp'),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Date selection & Alert flags
                Row(
                  children: [
                    const Icon(LucideIcons.calendar, size: 18),
                    const SizedBox(width: 8),
                    TextButton(
                      onPressed: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: state.date,
                          firstDate: DateTime(2020),
                          lastDate: DateTime(2030),
                        );
                        if (picked != null) {
                          if (context.mounted) {
                            context.read<DailyClosingCubit>().loadDate(picked);
                          }
                        }
                      },
                      child: Text(
                        DateFormat('yyyy-MM-dd (EEEE)').format(state.date),
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    const Spacer(),
                    if (state.existingClosing != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Row(
                          children: [
                            Icon(LucideIcons.lock, size: 14, color: AppColors.primary),
                            SizedBox(width: 6),
                            Text(
                              'Closed Register',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 16),

                if (state.lockWarning)
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.amber.withOpacity(0.1),
                      border: Border.all(color: Colors.amber),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      children: [
                        Icon(LucideIcons.alertTriangle, color: Colors.amber),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'WARNING: Transactions have been edited/added after closing. Re-save to update calculations.',
                            style: TextStyle(fontSize: 12, color: Colors.amber, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),

                // Grid stats
                GridView.count(
                  crossAxisCount: 3,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 16,
                  childAspectRatio: 2.2,
                  children: [
                    _buildStatCard('Opening Cash', currencyFormatter.format(state.openingCash), Colors.blue, isDark),
                    _buildStatCard('Expected Cash', currencyFormatter.format(state.expectedClosing), Colors.indigo, isDark),
                    _buildStatCard('Difference', currencyFormatter.format(state.difference),
                        state.statusTone == 'matched' ? Colors.green : (state.statusTone == 'shortage' ? Colors.red : Colors.orange), isDark),
                  ],
                ),
                const SizedBox(height: 24),

                // Main form area split into cards
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Left Column: Inputs
                    Expanded(
                      flex: 2,
                      child: Column(
                        children: [
                          // Opening Cash Override Card
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      const Text('Opening Balance Override', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                      IconButton(
                                        icon: Icon(state.openingLocked ? LucideIcons.lock : LucideIcons.unlock, size: 20),
                                        onPressed: () {
                                          if (state.openingLocked) {
                                            // Prompt/Unlock
                                            showDialog(
                                              context: context,
                                              builder: (ctx) => AlertDialog(
                                                title: const Text('Unlock Opening Cash?'),
                                                content: const Text('Are you sure you want to override the preceding day closing amount? This may cause auditing variations.'),
                                                actions: [
                                                  TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                                                  TextButton(
                                                    onPressed: () {
                                                      context.read<DailyClosingCubit>().updateOpeningCash(state.openingCash);
                                                      Navigator.pop(ctx);
                                                    },
                                                    child: const Text('Unlock'),
                                                  ),
                                                ],
                                              ),
                                            );
                                          } else {
                                            context.read<DailyClosingCubit>().lockOpeningCash();
                                          }
                                        },
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  TextFormField(
                                    enabled: !state.openingLocked,
                                    initialValue: state.openingCash.toString(),
                                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                    decoration: const InputDecoration(
                                      labelText: 'Opening Cash Amount',
                                      prefixText: 'SAR ',
                                    ),
                                    onChanged: (val) {
                                      final num = double.tryParse(val) ?? 0.0;
                                      context.read<DailyClosingCubit>().updateOpeningCash(num);
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Counted Cash Card (Dynamic holders)
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      const Text('Counted Cash Holders', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                      ElevatedButton.icon(
                                        onPressed: () {
                                          final current = List<CashHolderModel>.from(state.holders);
                                          current.add(CashHolderModel(name: '', amount: 0.0));
                                          context.read<DailyClosingCubit>().updateHolders(current);
                                        },
                                        icon: const Icon(LucideIcons.plus, size: 14),
                                        label: const Text('Add Holder'),
                                        style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8)),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  ListView.separated(
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    itemCount: state.holders.length,
                                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                                    itemBuilder: (context, index) {
                                      return Row(
                                        children: [
                                          Expanded(
                                            flex: 2,
                                            child: TextFormField(
                                              controller: _holderNameControllers[index],
                                              decoration: const InputDecoration(
                                                hintText: 'Holder Name (e.g. Safe)',
                                                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                              ),
                                              onChanged: (val) {
                                                final current = List<CashHolderModel>.from(state.holders);
                                                current[index] = CashHolderModel(name: val, amount: current[index].amount);
                                                context.read<DailyClosingCubit>().updateHolders(current);
                                              },
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            flex: 1,
                                            child: TextFormField(
                                              controller: _holderAmountControllers[index],
                                              keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                              decoration: const InputDecoration(
                                                hintText: '0.00',
                                                prefixText: 'SAR ',
                                                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                              ),
                                              onChanged: (val) {
                                                final current = List<CashHolderModel>.from(state.holders);
                                                final amount = double.tryParse(val) ?? 0.0;
                                                current[index] = CashHolderModel(name: current[index].name, amount: amount);
                                                context.read<DailyClosingCubit>().updateHolders(current);
                                              },
                                            ),
                                          ),
                                          if (state.holders.length > 1)
                                            IconButton(
                                              icon: const Icon(LucideIcons.trash2, color: Colors.red, size: 18),
                                              onPressed: () {
                                                final current = List<CashHolderModel>.from(state.holders);
                                                current.removeAt(index);
                                                context.read<DailyClosingCubit>().updateHolders(current);
                                              },
                                            ),
                                        ],
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Tomorrow's distribution
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Tomorrow\'s Cash Distribution suggestions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                  const SizedBox(height: 16),
                                  ...state.distribution.entries.map((e) {
                                    return Padding(
                                      padding: const EdgeInsets.only(bottom: 8.0),
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(e.key, style: const TextStyle(fontWeight: FontWeight.w500)),
                                          SizedBox(
                                            width: 120,
                                            child: TextFormField(
                                              initialValue: e.value > 0 ? e.value.toString() : '',
                                              keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                              decoration: const InputDecoration(
                                                prefixText: 'SAR ',
                                                contentPadding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                                              ),
                                              onChanged: (val) {
                                                final amt = double.tryParse(val) ?? 0.0;
                                                context.read<DailyClosingCubit>().updateDistribution(e.key, amt);
                                              },
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                  }),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),

                    // Right Column: Summary Report & Actions
                    Expanded(
                      flex: 1,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Card(
                            color: isDark ? AppColors.cardDark : Colors.grey[50],
                            child: Padding(
                              padding: const EdgeInsets.all(20.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Day Summary Report', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                                  const SizedBox(height: 16),
                                  _buildSummaryRow('Opening Cash', state.openingCash, currencyFormatter),
                                  _buildSummaryRow('Shop Withdrawals', state.withdraw, currencyFormatter),
                                  _buildSummaryRow('Company Income', state.otherCashIn, currencyFormatter),
                                  _buildSummaryRow('Employee Inflows', state.employeeReceived, currencyFormatter),
                                  const Divider(),
                                  _buildSummaryRow('Tomorrow Distribution', -state.distributionTotal, currencyFormatter),
                                  _buildSummaryRow('Expenses Paid', -state.expense, currencyFormatter),
                                  _buildSummaryRow('Employee Given', -state.employeeGiven, currencyFormatter),
                                  const Divider(),
                                  _buildSummaryRow('Expected Ending', state.expectedClosing, currencyFormatter, isBold: true),
                                  _buildSummaryRow('Counted In Hand', state.countedCash, currencyFormatter, isBold: true),
                                  const Divider(),
                                  _buildSummaryRow(
                                    'Variance Difference',
                                    state.difference,
                                    currencyFormatter,
                                    isBold: true,
                                    color: state.statusTone == 'matched'
                                        ? Colors.green
                                        : (state.statusTone == 'shortage' ? Colors.red : Colors.orange),
                                  ),
                                  const SizedBox(height: 24),
                                  TextFormField(
                                    controller: _notesController,
                                    maxLines: 3,
                                    decoration: const InputDecoration(
                                      labelText: 'Verification Notes / Auditing logs',
                                      alignLabelWithHint: true,
                                    ),
                                    onChanged: (val) {
                                      context.read<DailyClosingCubit>().updateNotes(val);
                                    },
                                  ),
                                  const SizedBox(height: 24),
                                  ElevatedButton(
                                    onPressed: state.saving
                                        ? null
                                        : () async {
                                            final authState = context.read<AuthCubit>().state;
                                            String userId = 'system';
                                            if (authState is AuthAuthenticated) {
                                              userId = authState.user.id;
                                            }
                                            final success = await context.read<DailyClosingCubit>().saveClosing(userId);
                                            if (context.mounted) {
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(
                                                  content: Text(success ? 'Register saved successfully.' : 'Failed to save register.'),
                                                ),
                                              );
                                            }
                                          },
                                    style: ElevatedButton.styleFrom(
                                      minimumSize: const Size.fromHeight(50),
                                      backgroundColor: AppColors.primary,
                                      foregroundColor: Colors.white,
                                    ),
                                    child: state.saving
                                        ? const CircularProgressIndicator(color: Colors.white)
                                        : const Text('Save Register Handover', style: TextStyle(fontWeight: FontWeight.bold)),
                                  ),
                                  if (state.existingClosing != null) ...[
                                    const SizedBox(height: 12),
                                    OutlinedButton(
                                      onPressed: () {
                                        showDialog(
                                          context: context,
                                          builder: (ctx) => AlertDialog(
                                            title: const Text('Delete Handover Register?'),
                                            content: const Text('Are you sure you want to delete this closed register? This action is irreversible.'),
                                            actions: [
                                              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                                              TextButton(
                                                onPressed: () {
                                                  context.read<DailyClosingCubit>().deleteClosing();
                                                  Navigator.pop(ctx);
                                                },
                                                child: const Text('Delete', style: TextStyle(color: Colors.red)),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                      style: OutlinedButton.styleFrom(
                                        minimumSize: const Size.fromHeight(45),
                                        side: const BorderSide(color: Colors.red),
                                        foregroundColor: Colors.red,
                                      ),
                                      child: const Text('Delete Handover', style: TextStyle(fontWeight: FontWeight.bold)),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatCard(String label, String value, Color color, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w500)),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, double val, NumberFormat formatter, {bool isBold = false, Color? color}) {
    final style = TextStyle(
      fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
      fontSize: isBold ? 14 : 13,
      color: color ?? (isBold ? null : Colors.grey[700]),
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: style),
          Text(formatter.format(val), style: style),
        ],
      ),
    );
  }
}
