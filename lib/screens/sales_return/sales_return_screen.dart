import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';

import '../../repositories/shop_repository.dart';
import '../../models/shop_entry_model.dart';
import '../../core/theme/app_colors.dart';

// ─── Rose palette ─────────────────────────────────────────────────────────────
const _rose600 = Color(0xFFE11D48);
const _rose500 = Color(0xFFF43F5E);
const _rose400 = Color(0xFFFB7185);
const _amber500 = Color(0xFFF59E0B);
const _violet500 = Color(0xFF8B5CF6);
const _teal500 = Color(0xFF14B8A6);

class SalesReturnScreen extends StatefulWidget {
  const SalesReturnScreen({super.key});

  @override
  State<SalesReturnScreen> createState() => _SalesReturnScreenState();
}

class _SalesReturnScreenState extends State<SalesReturnScreen>
    with TickerProviderStateMixin {
  List<Map<String, dynamic>> _returnsHistory = [];
  String _searchQuery = '';
  String _settlementFilter = 'all';

  // Wizard state
  int _wizardStep = 0;
  ShopEntryModel? _selectedInvoice;
  final TextEditingController _invoiceSearchController = TextEditingController();
  final TextEditingController _returnReasonController = TextEditingController();
  final TextEditingController _refundAmountController = TextEditingController();
  String _selectedRefundType = 'due_reduction';
  List<Map<String, dynamic>> _invoiceItems = [];
  Map<int, int> _returnQuantities = {};

  // Animations
  late AnimationController _headerAnim;
  late Animation<double> _headerFade;

  @override
  void initState() {
    super.initState();
    _headerAnim = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _headerFade = CurvedAnimation(parent: _headerAnim, curve: Curves.easeOut);
    _headerAnim.forward();
    _loadReturnsHistory();
  }

  @override
  void dispose() {
    _headerAnim.dispose();
    _invoiceSearchController.dispose();
    _returnReasonController.dispose();
    _refundAmountController.dispose();
    super.dispose();
  }

  void _loadReturnsHistory() {
    setState(() {
      _returnsHistory = [
        {
          'id': 'ret-1',
          'return_number': 'RET-0012',
          'invoice_number': 'INV-1092',
          'customer_name': 'Ahmad Al-Ghamdi',
          'customer_mobile': '0551234567',
          'total_qty': 3,
          'return_value': 450.0,
          'refund_type': 'due_reduction',
          'refund_amount': 450.0,
          'reason': 'Customer requested color exchange',
          'created_at': DateTime.now().subtract(const Duration(days: 2)),
        },
        {
          'id': 'ret-2',
          'return_number': 'RET-0013',
          'invoice_number': 'INV-1078',
          'customer_name': 'Siddique Rahman',
          'customer_mobile': '0509876543',
          'total_qty': 1,
          'return_value': 89.0,
          'refund_type': 'cash',
          'refund_amount': 89.0,
          'reason': 'Product defect check',
          'created_at': DateTime.now().subtract(const Duration(days: 4)),
        },
        {
          'id': 'ret-3',
          'return_number': 'RET-0014',
          'invoice_number': 'INV-1103',
          'customer_name': 'Khalid Al-Zahrani',
          'customer_mobile': '0561122334',
          'total_qty': 2,
          'return_value': 230.0,
          'refund_type': 'credit',
          'refund_amount': 230.0,
          'reason': 'Wrong size delivered',
          'created_at': DateTime.now().subtract(const Duration(days: 1)),
        },
        {
          'id': 'ret-4',
          'return_number': 'RET-0015',
          'invoice_number': 'INV-1055',
          'customer_name': 'Walk-in Customer',
          'customer_mobile': '',
          'total_qty': 1,
          'return_value': 120.0,
          'refund_type': 'cash',
          'refund_amount': 120.0,
          'reason': '',
          'created_at': DateTime.now().subtract(const Duration(hours: 5)),
        },
      ];
    });
  }

  List<Map<String, dynamic>> get _filtered {
    return _returnsHistory.where((r) {
      if (_settlementFilter != 'all' && r['refund_type'] != _settlementFilter) return false;
      if (_searchQuery.isEmpty) return true;
      return (r['return_number'] as String).toLowerCase().contains(_searchQuery) ||
          (r['invoice_number'] as String).toLowerCase().contains(_searchQuery) ||
          (r['customer_name'] as String).toLowerCase().contains(_searchQuery);
    }).toList();
  }

  Map<String, Map<String, dynamic>> _byCustomer(List<Map<String, dynamic>> list) {
    final m = <String, Map<String, dynamic>>{};
    for (final r in list) {
      final k = r['customer_name'] as String;
      m.putIfAbsent(k, () => {'name': k, 'qty': 0, 'value': 0.0});
      m[k]!['qty'] = (m[k]!['qty'] as int) + (r['total_qty'] as int);
      m[k]!['value'] = (m[k]!['value'] as double) + (r['return_value'] as double);
    }
    final list2 = m.values.toList()..sort((a, b) => (b['value'] as double).compareTo(a['value'] as double));
    return {for (var e in list2.take(6)) e['name'] as String: e};
  }

  void _openReturnWizard(BuildContext context) {
    setState(() {
      _wizardStep = 0;
      _selectedInvoice = null;
      _invoiceSearchController.clear();
      _returnReasonController.clear();
      _refundAmountController.clear();
      _invoiceItems.clear();
      _returnQuantities.clear();
      _selectedRefundType = 'due_reduction';
    });

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setDialogState) {
            return Dialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              child: Container(
                width: 520,
                constraints: const BoxConstraints(maxHeight: 600),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF1A0510), Color(0xFF0F172A)],
                  ),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                        gradient: LinearGradient(colors: [_rose600, Color(0xFFC2183C)]),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(LucideIcons.undo2, color: Colors.white, size: 18),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Sales Return Wizard',
                                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                              Text('Step ${_wizardStep + 1} of 3',
                                  style: TextStyle(color: Colors.white.withOpacity(0.75), fontSize: 12)),
                            ],
                          ),
                          const Spacer(),
                          Row(
                            children: List.generate(3, (i) {
                              final active = i <= _wizardStep;
                              return AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.only(left: 6),
                                width: active ? 24 : 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: active ? Colors.white : Colors.white.withOpacity(0.3),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              );
                            }),
                          ),
                        ],
                      ),
                    ),
                    Flexible(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24),
                        child: _buildWizardContent(setDialogState),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.fromLTRB(24, 12, 24, 20),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: _buildWizardActions(setDialogState, ctx),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  InputDecoration get _fieldDeco => InputDecoration(
        filled: true,
        fillColor: Colors.white.withOpacity(0.07),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.12)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.12)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: _rose400, width: 1.5),
        ),
        hintStyle: TextStyle(color: Colors.white.withOpacity(0.35)),
        labelStyle: TextStyle(color: Colors.white.withOpacity(0.6)),
      );

  Widget _buildWizardContent(StateSetter setDialogState) {
    if (_wizardStep == 0) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Search Original Invoice',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 4),
          Text('Enter the sale amount or invoice details to locate the original transaction.',
              style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
          const SizedBox(height: 16),
          TextFormField(
            controller: _invoiceSearchController,
            style: const TextStyle(color: Colors.white),
            decoration: _fieldDeco.copyWith(
              hintText: 'e.g. 450 or INV-1092',
              suffixIcon: Icon(LucideIcons.search, color: Colors.white.withOpacity(0.4), size: 18),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () async {
                final shopRepo = context.read<ShopRepository>();
                final entries = await shopRepo.getEntries();
                final searchVal = double.tryParse(_invoiceSearchController.text) ?? 0.0;
                ShopEntryModel? found;
                try {
                  found = entries.firstWhere(
                      (e) => e.entryType == 'sale' && (e.cashSale == searchVal || e.posSale == searchVal));
                } catch (_) {
                  if (entries.isNotEmpty) {
                    found = entries.firstWhere((e) => e.entryType == 'sale');
                  }
                }
                if (found != null) {
                  setDialogState(() {
                    _selectedInvoice = found;
                    _wizardStep = 1;
                    _invoiceItems = [
                      {'name': 'iPhone Silicone Case', 'qty': 2, 'price': 150.0},
                      {'name': 'Type-C Fast Cable 2m', 'qty': 1, 'price': 89.0},
                      {'name': 'Power Delivery 20W Plug', 'qty': 1, 'price': 120.0},
                    ];
                    _returnQuantities = {0: 0, 1: 0, 2: 0};
                  });
                } else {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('No invoice matched. Try another value.')),
                    );
                  }
                }
              },
              icon: const Icon(LucideIcons.search, size: 16),
              label: const Text('Find Invoice'),
              style: ElevatedButton.styleFrom(
                backgroundColor: _rose600,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      );
    } else if (_wizardStep == 1) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: _rose600.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _rose600.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(LucideIcons.fileText, color: _rose400, size: 16),
                const SizedBox(width: 8),
                Text('Invoice #${_selectedInvoice?.id.substring(0, 6).toUpperCase()}',
                    style: const TextStyle(color: _rose400, fontWeight: FontWeight.bold, fontSize: 13)),
                const Spacer(),
                Text('SAR ${_selectedInvoice?.cashSale.toStringAsFixed(2) ?? "—"}',
                    style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.w600)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Select Return Quantities',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 12),
          ..._invoiceItems.asMap().entries.map((entry) {
            final index = entry.key;
            final item = entry.value;
            final maxQty = item['qty'] as int;
            final returnQty = _returnQuantities[index] ?? 0;
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color: returnQty > 0 ? _rose400.withOpacity(0.5) : Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item['name'],
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
                        Text('SAR ${item['price']} · Max: $maxQty',
                            style: TextStyle(color: Colors.white.withOpacity(0.45), fontSize: 11)),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      _qtyBtn(
                        icon: LucideIcons.minus,
                        enabled: returnQty > 0,
                        onTap: () => setDialogState(() => _returnQuantities[index] = returnQty - 1),
                      ),
                      SizedBox(
                        width: 36,
                        child: Text('$returnQty',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                color: returnQty > 0 ? _rose400 : Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16)),
                      ),
                      _qtyBtn(
                        icon: LucideIcons.plus,
                        enabled: returnQty < maxQty,
                        onTap: () => setDialogState(() => _returnQuantities[index] = returnQty + 1),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      );
    } else {
      double totalReturnVal = 0.0;
      for (int i = 0; i < _invoiceItems.length; i++) {
        final q = _returnQuantities[i] ?? 0;
        final p = _invoiceItems[i]['price'] as double;
        totalReturnVal += q * p;
      }
      if (_refundAmountController.text.isEmpty) {
        _refundAmountController.text = totalReturnVal.toStringAsFixed(2);
      }
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [_rose600, Color(0xFFBE123C)]),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Text('Total Return Value', style: TextStyle(color: Colors.white70, fontSize: 12)),
                const SizedBox(height: 4),
                Text('SAR ${totalReturnVal.toStringAsFixed(2)}',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 26)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Text('Settlement Method',
              style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12, fontWeight: FontWeight.w500)),
          const SizedBox(height: 8),
          Row(
            children: [
              _refundPill('due_reduction', 'Due Reduced', setDialogState),
              const SizedBox(width: 8),
              _refundPill('cash', 'Cash', setDialogState),
              const SizedBox(width: 8),
              _refundPill('credit', 'Credit', setDialogState),
            ],
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _refundAmountController,
            style: const TextStyle(color: Colors.white),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: _fieldDeco.copyWith(
              labelText: 'Settlement Amount',
              prefixText: 'SAR ',
              prefixStyle: TextStyle(color: Colors.white.withOpacity(0.6)),
            ),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _returnReasonController,
            style: const TextStyle(color: Colors.white),
            decoration: _fieldDeco.copyWith(
              labelText: 'Reason (optional)',
              suffixIcon: Icon(LucideIcons.messageSquare, color: Colors.white.withOpacity(0.35), size: 16),
            ),
          ),
        ],
      );
    }
  }

  Widget _refundPill(String val, String label, StateSetter setDialogState) {
    final selected = _selectedRefundType == val;
    return Expanded(
      child: GestureDetector(
        onTap: () => setDialogState(() => _selectedRefundType = val),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: selected ? _rose600 : Colors.white.withOpacity(0.07),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: selected ? _rose600 : Colors.white.withOpacity(0.1)),
          ),
          child: Text(label,
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: selected ? Colors.white : Colors.white.withOpacity(0.5),
                  fontWeight: FontWeight.w600,
                  fontSize: 12)),
        ),
      ),
    );
  }

  Widget _qtyBtn({required IconData icon, required bool enabled, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: 28,
        height: 28,
        decoration: BoxDecoration(
          color: enabled ? _rose600.withOpacity(0.2) : Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 14, color: enabled ? _rose400 : Colors.white.withOpacity(0.2)),
      ),
    );
  }

  List<Widget> _buildWizardActions(StateSetter setDialogState, BuildContext dialogCtx) {
    final cancelStyle = TextButton.styleFrom(
      foregroundColor: Colors.white60,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
    );
    final nextStyle = ElevatedButton.styleFrom(
      backgroundColor: _rose600,
      foregroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
    );

    if (_wizardStep == 0) {
      return [
        TextButton(style: cancelStyle, onPressed: () => Navigator.pop(dialogCtx), child: const Text('Cancel')),
        const Spacer(),
      ];
    } else if (_wizardStep == 1) {
      return [
        TextButton(
            style: cancelStyle,
            onPressed: () => setDialogState(() => _wizardStep = 0),
            child: const Text('← Back')),
        ElevatedButton(
          style: nextStyle,
          onPressed: () {
            final totalQty = _returnQuantities.values.fold(0, (s, q) => s + q);
            if (totalQty > 0) {
              setDialogState(() => _wizardStep = 2);
            } else {
              ScaffoldMessenger.of(context)
                  .showSnackBar(const SnackBar(content: Text('Select at least one item to return.')));
            }
          },
          child: const Text('Next →'),
        ),
      ];
    } else {
      return [
        TextButton(
            style: cancelStyle,
            onPressed: () => setDialogState(() => _wizardStep = 1),
            child: const Text('← Back')),
        ElevatedButton(
          style: nextStyle,
          onPressed: () {
            double totalReturnVal = 0.0;
            int totalReturnQty = 0;
            for (int i = 0; i < _invoiceItems.length; i++) {
              final q = _returnQuantities[i] ?? 0;
              final p = _invoiceItems[i]['price'] as double;
              totalReturnVal += q * p;
              totalReturnQty += q;
            }
            final mockReturn = {
              'id': const Uuid().v4(),
              'return_number': 'RET-00${14 + _returnsHistory.length}',
              'invoice_number': 'INV-${_selectedInvoice?.id.substring(0, 4).toUpperCase()}',
              'customer_name': 'Walk-in Customer',
              'customer_mobile': '',
              'total_qty': totalReturnQty,
              'return_value': totalReturnVal,
              'refund_type': _selectedRefundType,
              'refund_amount': double.tryParse(_refundAmountController.text) ?? totalReturnVal,
              'reason': _returnReasonController.text,
              'created_at': DateTime.now(),
            };
            super.setState(() {
              _returnsHistory.insert(0, mockReturn);
            });
            Navigator.pop(dialogCtx);
            ScaffoldMessenger.of(context)
                .showSnackBar(const SnackBar(content: Text('Return submitted successfully.')));
          },
          child: const Text('Submit Return'),
        ),
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sarFmt = NumberFormat.currency(symbol: 'SAR ', decimalDigits: 2);
    final filtered = _filtered;

    double totalVal = 0.0;
    int totalQty = 0;
    for (final r in filtered) {
      totalVal += r['return_value'] as double;
      totalQty += r['total_qty'] as int;
    }
    final avgVal = filtered.isNotEmpty ? totalVal / filtered.length : 0.0;
    final byCustomer = _byCustomer(filtered);

    return Scaffold(
      backgroundColor: isDark ? AppColors.bgDark : const Color(0xFFF8FAFC),
      body: FadeTransition(
        opacity: _headerFade,
        child: CustomScrollView(
          slivers: [
            // Hero Header
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF9F1239), Color(0xFF4C0519), Color(0xFF1A0510)],
                    stops: [0.0, 0.5, 1.0],
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: _rose600.withOpacity(0.35), blurRadius: 30, offset: const Offset(0, 10)),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(LucideIcons.undo2, color: Colors.white, size: 20),
                              ),
                              const SizedBox(width: 12),
                              const Flexible(
                                child: Text('Sales Return',
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                        color: Colors.white, fontWeight: FontWeight.bold, fontSize: 24, letterSpacing: -0.5)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text('Process refunds, track restockings and\nmanage customer returns with ease.',
                              style: TextStyle(color: Colors.white.withOpacity(0.65), fontSize: 13, height: 1.5)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    ElevatedButton.icon(
                      onPressed: () => _openReturnWizard(context),
                      icon: const Icon(LucideIcons.plus, size: 16),
                      label: const Text('New Return', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: _rose600,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Stat Cards — responsive
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                child: LayoutBuilder(
                  builder: (ctx, constraints) {
                    final isNarrow = constraints.maxWidth < 500;
                    if (isNarrow) {
                      // 2-column wrap on mobile
                      return Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _StatCard(
                                  label: 'Total Returned',
                                  value: sarFmt.format(totalVal),
                                  sub: '${filtered.length} returns',
                                  icon: LucideIcons.undo2,
                                  color: _rose500,
                                  isDark: isDark,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _StatCard(
                                  label: 'Items Returned',
                                  value: '$totalQty units',
                                  sub: 'across all returns',
                                  icon: LucideIcons.package,
                                  color: _amber500,
                                  isDark: isDark,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: _StatCard(
                                  label: 'Avg Refund',
                                  value: sarFmt.format(avgVal),
                                  sub: 'per transaction',
                                  icon: LucideIcons.barChart3,
                                  color: _violet500,
                                  isDark: isDark,
                                ),
                              ),
                              // placeholder to keep 2-col grid aligned
                              const Expanded(child: SizedBox.shrink()),
                            ],
                          ),
                        ],
                      );
                    }
                    // 3-column row on wider screens
                    return Row(
                      children: [
                        Expanded(
                          child: _StatCard(
                            label: 'Total Returned',
                            value: sarFmt.format(totalVal),
                            sub: '${filtered.length} returns',
                            icon: LucideIcons.undo2,
                            color: _rose500,
                            isDark: isDark,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _StatCard(
                            label: 'Items Returned',
                            value: '$totalQty units',
                            sub: 'across all returns',
                            icon: LucideIcons.package,
                            color: _amber500,
                            isDark: isDark,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _StatCard(
                            label: 'Avg Refund',
                            value: sarFmt.format(avgVal),
                            sub: 'per transaction',
                            icon: LucideIcons.barChart3,
                            color: _violet500,
                            isDark: isDark,
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),

            // Analytics Row — responsive
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                child: LayoutBuilder(
                  builder: (ctx, constraints) {
                    final isNarrow = constraints.maxWidth < 500;
                    final topCustomersBlock = _AnalyticsBlock(
                      title: 'Top Customers',
                      icon: LucideIcons.users,
                      color: _rose500,
                      isDark: isDark,
                      rows: byCustomer.values
                          .map((c) => _AnalyticsRow(
                                label: c['name'] as String,
                                value: sarFmt.format(c['value']),
                                sub: '${c['qty']} qty',
                              ))
                          .toList(),
                    );
                    final settlementBlock = _AnalyticsBlock(
                      title: 'By Settlement',
                      icon: LucideIcons.creditCard,
                      color: _violet500,
                      isDark: isDark,
                      rows: _settlementBreakdown(filtered, sarFmt),
                    );
                    if (isNarrow) {
                      return Column(
                        children: [
                          topCustomersBlock,
                          const SizedBox(height: 14),
                          settlementBlock,
                        ],
                      );
                    }
                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(child: topCustomersBlock),
                        const SizedBox(width: 14),
                        Expanded(child: settlementBlock),
                      ],
                    );
                  },
                ),
              ),
            ),

            // Filters
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 14),
                child: Column(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.cardDark : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: isDark ? AppColors.borderDark : AppColors.borderLight),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2)),
                        ],
                      ),
                      child: TextField(
                        onChanged: (v) => setState(() => _searchQuery = v.trim().toLowerCase()),
                        decoration: InputDecoration(
                          hintText: 'Search by return #, invoice, or customer…',
                          hintStyle: TextStyle(color: isDark ? Colors.grey[500] : Colors.grey[400], fontSize: 13),
                          prefixIcon: Icon(LucideIcons.search, size: 18, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _FilterPill(label: 'All', value: 'all', selected: _settlementFilter,
                              onTap: (v) => setState(() => _settlementFilter = v), isDark: isDark),
                          _FilterPill(label: 'Due Reduced', value: 'due_reduction', selected: _settlementFilter,
                              onTap: (v) => setState(() => _settlementFilter = v), isDark: isDark),
                          _FilterPill(label: 'Cash Refund', value: 'cash', selected: _settlementFilter,
                              onTap: (v) => setState(() => _settlementFilter = v), isDark: isDark),
                          _FilterPill(label: 'Credit', value: 'credit', selected: _settlementFilter,
                              onTap: (v) => setState(() => _settlementFilter = v), isDark: isDark),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Returns List
            filtered.isEmpty
                ? SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 60),
                      child: Column(
                        children: [
                          Icon(LucideIcons.inbox, size: 48, color: isDark ? Colors.grey[700] : Colors.grey[300]),
                          const SizedBox(height: 12),
                          Text('No matching returns found.',
                              style: TextStyle(color: isDark ? Colors.grey[500] : Colors.grey[400], fontSize: 14)),
                        ],
                      ),
                    ),
                  )
                : SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (ctx, i) {
                        final r = filtered[i];
                        return Padding(
                          padding: EdgeInsets.fromLTRB(20, i == 0 ? 0 : 8, 20, i == filtered.length - 1 ? 24 : 0),
                          child: _ReturnCard(data: r, sarFmt: sarFmt, isDark: isDark),
                        );
                      },
                      childCount: filtered.length,
                    ),
                  ),
          ],
        ),
      ),
    );
  }

  List<_AnalyticsRow> _settlementBreakdown(List<Map<String, dynamic>> list, NumberFormat fmt) {
    final m = <String, double>{'due_reduction': 0, 'cash': 0, 'credit': 0};
    for (final r in list) {
      m[r['refund_type'] as String] = (m[r['refund_type'] as String] ?? 0) + (r['return_value'] as double);
    }
    final labels = {'due_reduction': 'Due Reduction', 'cash': 'Cash Refund', 'credit': 'Credit Issued'};
    return m.entries
        .map((e) => _AnalyticsRow(label: labels[e.key] ?? e.key, value: fmt.format(e.value), sub: e.value > 0 ? 'settled' : 'none'))
        .toList();
  }
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
// NOTE: caller wraps in Expanded; _StatCard itself is layout-agnostic.
class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final String sub;
  final IconData icon;
  final Color color;
  final bool isDark;

  const _StatCard({required this.label, required this.value, required this.sub, required this.icon, required this.color, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: color.withOpacity(0.2), width: 1.5),
        boxShadow: [
          BoxShadow(color: color.withOpacity(isDark ? 0.08 : 0.06), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(7),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 15),
          ),
          const SizedBox(height: 10),
          Text(label,
              style: TextStyle(
                  fontSize: 10,
                  color: isDark ? Colors.grey[400] : Colors.grey[500],
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.3),
              maxLines: 1,
              overflow: TextOverflow.ellipsis),
          const SizedBox(height: 3),
          Text(value,
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: color, letterSpacing: -0.3),
              maxLines: 1,
              overflow: TextOverflow.ellipsis),
          const SizedBox(height: 2),
          Text(sub,
              style: TextStyle(fontSize: 10, color: isDark ? Colors.grey[600] : Colors.grey[400]),
              maxLines: 1,
              overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }
}

// ─── Analytics Row ───────────────────────────────────────────────────────────
class _AnalyticsRow {
  final String label;
  final String value;
  final String sub;
  const _AnalyticsRow({required this.label, required this.value, required this.sub});
}

class _AnalyticsBlock extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final bool isDark;
  final List<_AnalyticsRow> rows;

  const _AnalyticsBlock({required this.title, required this.icon, required this.color, required this.isDark, required this.rows});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: isDark ? AppColors.borderDark : AppColors.borderLight),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 12, offset: const Offset(0, 3)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                child: Icon(icon, color: color, size: 14),
              ),
              const SizedBox(width: 8),
              Text(title,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: isDark ? Colors.white : const Color(0xFF1E293B))),
            ],
          ),
          const SizedBox(height: 14),
          if (rows.isEmpty)
            Text('No data', style: TextStyle(fontSize: 12, color: isDark ? Colors.grey[500] : Colors.grey[400]))
          else
            ...rows.asMap().entries.map((entry) {
              final i = entry.key;
              final row = entry.value;
              return Container(
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  border: i < rows.length - 1
                      ? Border(bottom: BorderSide(color: isDark ? AppColors.borderDark : AppColors.borderLight))
                      : null,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(row.label,
                          style: TextStyle(fontSize: 12, color: isDark ? Colors.grey[200] : const Color(0xFF334155)),
                          overflow: TextOverflow.ellipsis),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(row.value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: color)),
                        Text(row.sub, style: TextStyle(fontSize: 10, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                      ],
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }
}

// ─── Filter Pill ─────────────────────────────────────────────────────────────
class _FilterPill extends StatelessWidget {
  final String label;
  final String value;
  final String selected;
  final ValueChanged<String> onTap;
  final bool isDark;

  const _FilterPill({required this.label, required this.value, required this.selected, required this.onTap, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final active = selected == value;
    return GestureDetector(
      onTap: () => onTap(value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: active ? _rose600 : (isDark ? AppColors.cardDark : Colors.white),
          borderRadius: BorderRadius.circular(100),
          border: Border.all(color: active ? _rose600 : (isDark ? AppColors.borderDark : AppColors.borderLight)),
          boxShadow: active ? [BoxShadow(color: _rose600.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 2))] : [],
        ),
        child: Text(label,
            style: TextStyle(
                fontSize: 12,
                fontWeight: active ? FontWeight.bold : FontWeight.w500,
                color: active ? Colors.white : (isDark ? Colors.grey[400] : Colors.grey[600]))),
      ),
    );
  }
}

// ─── Return Card ─────────────────────────────────────────────────────────────
class _ReturnCard extends StatefulWidget {
  final Map<String, dynamic> data;
  final NumberFormat sarFmt;
  final bool isDark;

  const _ReturnCard({required this.data, required this.sarFmt, required this.isDark});

  @override
  State<_ReturnCard> createState() => _ReturnCardState();
}

class _ReturnCardState extends State<_ReturnCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final r = widget.data;
    final isDark = widget.isDark;
    final sarFmt = widget.sarFmt;

    final refundType = r['refund_type'] as String;
    final typeLabel = refundType == 'due_reduction' ? 'Due Reduced' : (refundType == 'cash' ? 'Cash Refund' : 'Credit');
    final typeColor = refundType == 'due_reduction' ? _violet500 : (refundType == 'cash' ? _teal500 : _amber500);

    final date = r['created_at'] as DateTime;
    final dateStr = DateFormat('MMM d, yyyy · h:mm a').format(date);
    final reason = r['reason'] as String? ?? '';

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.translationValues(0, _hovered ? -2 : 0, 0),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: _hovered ? _rose500.withOpacity(0.4) : (isDark ? AppColors.borderDark : AppColors.borderLight),
            width: _hovered ? 1.5 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: _hovered ? _rose500.withOpacity(0.1) : Colors.black.withOpacity(0.04),
              blurRadius: _hovered ? 20 : 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [_rose500, _rose600], begin: Alignment.topLeft, end: Alignment.bottomRight),
                borderRadius: BorderRadius.circular(14),
                boxShadow: [BoxShadow(color: _rose600.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))],
              ),
              child: const Icon(LucideIcons.undo2, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(r['return_number'] as String,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: _rose500)),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(color: typeColor.withOpacity(0.1), borderRadius: BorderRadius.circular(6)),
                        child: Text(typeLabel, style: TextStyle(fontSize: 10, color: typeColor, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(LucideIcons.fileText, size: 12, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                      const SizedBox(width: 4),
                      Text(r['invoice_number'] as String,
                          style: TextStyle(fontSize: 11, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                      const SizedBox(width: 12),
                      Icon(LucideIcons.user, size: 12, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(r['customer_name'] as String,
                            style: TextStyle(fontSize: 11, color: isDark ? Colors.grey[400] : Colors.grey[500]),
                            overflow: TextOverflow.ellipsis),
                      ),
                    ],
                  ),
                  if (reason.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Row(
                        children: [
                          Icon(LucideIcons.messageCircle, size: 11, color: isDark ? Colors.grey[600] : Colors.grey[400]),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(reason,
                                style: TextStyle(
                                    fontSize: 11, fontStyle: FontStyle.italic, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                                overflow: TextOverflow.ellipsis),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 4),
                  Text(dateStr, style: TextStyle(fontSize: 10, color: isDark ? Colors.grey[600] : Colors.grey[400])),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(sarFmt.format(r['return_value']),
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: _rose500)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white.withOpacity(0.05) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text('${r['total_qty']} items',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: isDark ? Colors.grey[400] : Colors.grey[600])),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
