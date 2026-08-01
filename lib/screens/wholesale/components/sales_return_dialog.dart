import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';

class SalesReturnDialog extends StatefulWidget {
  final WholesaleSaleModel? initialSale;

  const SalesReturnDialog({
    super.key,
    this.initialSale,
  });

  static Future<void> show(BuildContext context, {WholesaleSaleModel? initialSale}) async {
    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => SalesReturnDialog(initialSale: initialSale),
    );
  }

  @override
  State<SalesReturnDialog> createState() => _SalesReturnDialogState();
}

class _SalesReturnDialogState extends State<SalesReturnDialog> {
  int _currentStep = 1;
  bool _isSaving = false;

  // Step 1 State
  WholesaleCustomerModel? _selectedCustomer;
  final String _customerSearch = '';

  // Step 2 State
  WholesaleSaleModel? _selectedSale;

  // Step 3 State
  final Map<String, int> _returnQtys = {}; // productId -> returnQty
  final Map<String, String> _returnReasons = {}; // productId -> reason
  String _settlementMethod = 'adjust_due'; // 'adjust_due' or 'cash_refund'
  final TextEditingController _notesController = TextEditingController();

  final List<String> _reasonsList = [
    'Reason',
    'Damaged Goods',
    'Wrong Item',
    'Expired',
    'Customer Choice',
    'Other',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialSale != null) {
      _selectedSale = widget.initialSale;
      _currentStep = 3;
      _initSaleItems(widget.initialSale!);
    }
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _initSaleItems(WholesaleSaleModel sale) {
    _returnQtys.clear();
    _returnReasons.clear();
    for (final item in sale.items) {
      _returnQtys[item.productId] = 1;
      _returnReasons[item.productId] = 'Damaged Goods';
    }
  }

  String _fmtPrice(double val) => 'SAR ${val.toStringAsFixed(2)}';

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final dialogBg = isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF0F172A) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    const accentMint = Color(0xFF76E4C4);

    return Dialog(
      backgroundColor: dialogBg,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: borderColor),
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 480, maxHeight: 680),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 14),
              child: Row(
                children: [
                  const Icon(LucideIcons.undo2, color: Color(0xFFEF4444), size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'New Sales Return',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: borderColor),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Step $_currentStep of 3',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: subtextColor,
                          ),
                        ),
                        const SizedBox(width: 4),
                        InkWell(
                          onTap: () => Navigator.pop(context),
                          borderRadius: BorderRadius.circular(12),
                          child: Icon(LucideIcons.x, size: 14, color: subtextColor),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Divider(height: 1, color: borderColor),

            // Step Body Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: BlocBuilder<WholesaleCubit, WholesaleState>(
                  builder: (context, state) {
                    if (_currentStep == 1) {
                      return _buildStep1(state, cardBg, borderColor, textColor, subtextColor, isDark);
                    } else if (_currentStep == 2) {
                      return _buildStep2(state, cardBg, borderColor, textColor, subtextColor, isDark);
                    } else {
                      return _buildStep3(state, cardBg, borderColor, textColor, subtextColor, isDark);
                    }
                  },
                ),
              ),
            ),

            Divider(height: 1, color: borderColor),

            // Footer Actions Bar
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  if (_currentStep == 1) ...[
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(context),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          backgroundColor: cardBg,
                          side: BorderSide(color: borderColor),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: Text(
                          'Cancel',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() => _currentStep = 2);
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          backgroundColor: accentMint,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Next ',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            Icon(LucideIcons.arrowRight, size: 16, color: Color(0xFF0F172A)),
                          ],
                        ),
                      ),
                    ),
                  ] else if (_currentStep == 2) ...[
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          setState(() => _currentStep = 1);
                        },
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          backgroundColor: cardBg,
                          side: BorderSide(color: borderColor),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(LucideIcons.arrowLeft, size: 16, color: textColor),
                            const SizedBox(width: 6),
                            Text(
                              'Back',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: _selectedSale != null
                            ? () {
                                _initSaleItems(_selectedSale!);
                                setState(() => _currentStep = 3);
                              }
                            : null,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          backgroundColor: accentMint,
                          disabledBackgroundColor: accentMint.withOpacity(0.4),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Continue ',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            Icon(LucideIcons.arrowRight, size: 16, color: Color(0xFF0F172A)),
                          ],
                        ),
                      ),
                    ),
                  ] else ...[
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _isSaving
                            ? null
                            : () {
                                setState(() => _currentStep = 2);
                              },
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          backgroundColor: cardBg,
                          side: BorderSide(color: borderColor),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(LucideIcons.arrowLeft, size: 16, color: _isSaving ? Colors.grey : textColor),
                            const SizedBox(width: 6),
                            Text(
                              'Back',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: _isSaving ? Colors.grey : textColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: _isSaving ? null : () => _confirmReturn(context),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          backgroundColor: accentMint,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            _isSaving
                                ? const SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(
                                      color: Color(0xFF0F172A),
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Icon(LucideIcons.check, size: 16, color: Color(0xFF0F172A)),
                            const SizedBox(width: 6),
                            const Text(
                              'Confirm Return',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- Step 1 Widget ---
  Widget _buildStep1(
    WholesaleState state,
    Color cardBg,
    Color borderColor,
    Color textColor,
    Color subtextColor,
    bool isDark,
  ) {
    final filteredCustomers = state.customers.where((c) {
      if (_customerSearch.isEmpty) return true;
      return c.name.toLowerCase().contains(_customerSearch.toLowerCase()) ||
          c.mobile.contains(_customerSearch);
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Select the customer who is returning items.',
          style: TextStyle(fontSize: 13.5, color: subtextColor),
        ),
        const SizedBox(height: 16),

        // Customer Search / Selection Box
        Container(
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: borderColor),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          child: Row(
            children: [
              Icon(LucideIcons.search, size: 18, color: subtextColor),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  _selectedCustomer != null
                      ? _selectedCustomer!.name
                      : 'Pick a customer...',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: _selectedCustomer != null ? FontWeight.bold : FontWeight.normal,
                    color: _selectedCustomer != null ? textColor : subtextColor,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(
                  'Optional',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: subtextColor,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Customer List Cards
        Text(
          'SELECT CUSTOMER',
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.8,
            color: subtextColor,
          ),
        ),
        const SizedBox(height: 8),

        // Walk-in Option
        InkWell(
          onTap: () {
            setState(() {
              _selectedCustomer = null;
            });
          },
          borderRadius: BorderRadius.circular(16),
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: _selectedCustomer == null
                  ? (isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1))
                  : cardBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: _selectedCustomer == null
                    ? const Color(0xFF24B489)
                    : borderColor,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  LucideIcons.userCheck,
                  size: 18,
                  color: _selectedCustomer == null
                      ? const Color(0xFF24B489)
                      : subtextColor,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Walk-in / Cash Customer',
                    style: TextStyle(
                      fontSize: 13.5,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                ),
                if (_selectedCustomer == null)
                  const Icon(LucideIcons.checkCircle2, color: Color(0xFF24B489), size: 18),
              ],
            ),
          ),
        ),

        ...filteredCustomers.map((cust) {
          final isSelected = _selectedCustomer?.id == cust.id;
          return InkWell(
            onTap: () {
              setState(() {
                _selectedCustomer = cust;
              });
            },
            borderRadius: BorderRadius.circular(16),
            child: Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected
                    ? (isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1))
                    : cardBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected ? const Color(0xFF24B489) : borderColor,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          cust.name,
                          style: TextStyle(
                            fontSize: 13.5,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          cust.mobile,
                          style: TextStyle(fontSize: 12, color: subtextColor),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    _fmtPrice(cust.openingDue),
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: cust.openingDue > 0 ? const Color(0xFFEF4444) : textColor,
                    ),
                  ),
                  if (isSelected) ...[
                    const SizedBox(width: 8),
                    const Icon(LucideIcons.checkCircle2, color: Color(0xFF24B489), size: 18),
                  ],
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  // --- Step 2 Widget ---
  Widget _buildStep2(
    WholesaleState state,
    Color cardBg,
    Color borderColor,
    Color textColor,
    Color subtextColor,
    bool isDark,
  ) {
    final customerName = _selectedCustomer?.name ?? 'Walk-in';

    // Filter sales by selected customer
    final matchingSales = state.sales.where((s) {
      if (s.status == 'cancelled') return false;
      if (_selectedCustomer != null) {
        return s.customerId == _selectedCustomer!.id ||
            s.customerName.toLowerCase() == _selectedCustomer!.name.toLowerCase();
      }
      return true;
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: TextSpan(
            style: TextStyle(fontSize: 13.5, color: subtextColor),
            children: [
              const TextSpan(text: 'Pick the invoice being returned for '),
              TextSpan(
                text: customerName,
                style: TextStyle(fontWeight: FontWeight.bold, color: textColor),
              ),
              const TextSpan(text: '.'),
            ],
          ),
        ),
        const SizedBox(height: 16),

        if (matchingSales.isEmpty)
          Container(
            padding: const EdgeInsets.all(24),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              children: [
                Icon(LucideIcons.receipt, size: 36, color: subtextColor),
                const SizedBox(height: 10),
                Text(
                  'No invoices found',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ],
            ),
          )
        else
          ...matchingSales.map((sale) {
            final isSelected = _selectedSale?.id == sale.id;
            final invLabel = 'INV-${sale.invoiceNumber}';
            final dateStr = DateFormat('M/d/yyyy, h:mm:ss a').format(sale.createdAt);

            return InkWell(
              onTap: () {
                setState(() {
                  _selectedSale = sale;
                });
              },
              borderRadius: BorderRadius.circular(20),
              child: Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isSelected
                      ? (isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1))
                      : cardBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected ? const Color(0xFF24B489) : borderColor,
                    width: isSelected ? 1.5 : 1.0,
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            invLabel,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '$dateStr · ${sale.items.length} items',
                            style: TextStyle(fontSize: 12, color: subtextColor),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      _fmtPrice(sale.total),
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: textColor,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }

  // --- Step 3 Widget ---
  Widget _buildStep3(
    WholesaleState state,
    Color cardBg,
    Color borderColor,
    Color textColor,
    Color subtextColor,
    bool isDark,
  ) {
    if (_selectedSale == null) return const SizedBox.shrink();

    final sale = _selectedSale!;
    final custName = _selectedCustomer?.name ?? sale.customerName;
    final custBalance = _selectedCustomer?.openingDue ?? 0.0;
    final invLabel = 'INV-${sale.invoiceNumber}';

    // Calculate total return value
    double totalReturnValue = 0.0;
    for (final item in sale.items) {
      final qty = _returnQtys[item.productId] ?? 0;
      totalReturnValue += qty * item.price;
    }

    final oldBalance = custBalance;
    final newBalance = _settlementMethod == 'adjust_due'
        ? (oldBalance - totalReturnValue < 0 ? 0.0 : oldBalance - totalReturnValue)
        : oldBalance;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 1. Returning Summary Header Card
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
                'RETURNING',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: subtextColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '$custName · $invLabel',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                'Current balance: ${_fmtPrice(custBalance)}',
                style: TextStyle(fontSize: 12.5, color: subtextColor),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 2. Product Return Items List Cards
        ...sale.items.map((item) {
          final returnQty = _returnQtys[item.productId] ?? 0;
          final reason = _returnReasons[item.productId] ?? 'Reason';

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
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
                  item.name,
                  style: TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Sold ${item.qty.toInt()} · Returned 0 · Available ${item.qty.toInt()} · ${_fmtPrice(item.price)}',
                  style: TextStyle(fontSize: 12, color: subtextColor),
                ),
                const SizedBox(height: 12),

                // Form Fields Row: Return Qty & Reason
                Row(
                  children: [
                    // Return Qty Input
                    Expanded(
                      flex: 1,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Return Qty',
                            style: TextStyle(fontSize: 11.5, color: subtextColor),
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            initialValue: returnQty.toString(),
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: BorderSide(color: borderColor),
                              ),
                            ),
                            onChanged: (val) {
                              final parsed = int.tryParse(val) ?? 0;
                              setState(() {
                                _returnQtys[item.productId] = parsed.clamp(0, item.qty.toInt());
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Reason Dropdown
                    Expanded(
                      flex: 2,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Reason',
                            style: TextStyle(fontSize: 11.5, color: subtextColor),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: borderColor),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _reasonsList.contains(reason) ? reason : _reasonsList.first,
                                isExpanded: true,
                                icon: Icon(LucideIcons.chevronDown, size: 16, color: subtextColor),
                                style: TextStyle(fontSize: 13, color: textColor),
                                items: _reasonsList.map((r) {
                                  return DropdownMenuItem(
                                    value: r,
                                    child: Text(r),
                                  );
                                }).toList(),
                                onChanged: (val) {
                                  if (val != null) {
                                    setState(() {
                                      _returnReasons[item.productId] = val;
                                    });
                                  }
                                },
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
          );
        }),

        // 3. SETTLEMENT Section
        Text(
          'SETTLEMENT',
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.8,
            color: subtextColor,
          ),
        ),
        const SizedBox(height: 10),

        Row(
          children: [
            // Option 1: Adjust Customer Due
            Expanded(
              child: InkWell(
                onTap: () => setState(() => _settlementMethod = 'adjust_due'),
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: _settlementMethod == 'adjust_due'
                        ? (isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1))
                        : cardBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: _settlementMethod == 'adjust_due'
                          ? const Color(0xFF24B489)
                          : borderColor,
                      width: _settlementMethod == 'adjust_due' ? 1.5 : 1.0,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(LucideIcons.wallet, color: Color(0xFF24B489), size: 20),
                      const SizedBox(height: 8),
                      Text(
                        'Adjust Customer Due',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Reduce outstanding balance',
                        style: TextStyle(fontSize: 11, color: subtextColor),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),

            // Option 2: Cash Refund
            Expanded(
              child: InkWell(
                onTap: () => setState(() => _settlementMethod = 'cash_refund'),
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: _settlementMethod == 'cash_refund'
                        ? (isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1))
                        : cardBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: _settlementMethod == 'cash_refund'
                          ? const Color(0xFF24B489)
                          : borderColor,
                      width: _settlementMethod == 'cash_refund' ? 1.5 : 1.0,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(LucideIcons.coins, color: Color(0xFF24B489), size: 20),
                      const SizedBox(height: 8),
                      Text(
                        'Cash Refund',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Pay customer immediately',
                        style: TextStyle(fontSize: 11, color: subtextColor),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // 4. Return Calculation Result Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF24B489).withOpacity(0.4)),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Return Value',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  Text(
                    _fmtPrice(totalReturnValue),
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: textColor),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Old Balance', style: TextStyle(fontSize: 12.5, color: subtextColor)),
                  Text(_fmtPrice(oldBalance), style: TextStyle(fontSize: 12.5, color: subtextColor)),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'New Balance',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  Text(
                    _fmtPrice(newBalance),
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: textColor),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 5. Optional Notes
        TextFormField(
          controller: _notesController,
          maxLines: 2,
          decoration: InputDecoration(
            hintText: 'Notes (optional)',
            hintStyle: TextStyle(color: subtextColor, fontSize: 13),
            contentPadding: const EdgeInsets.all(14),
            fillColor: cardBg,
            filled: true,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(20),
              borderSide: BorderSide(color: borderColor),
            ),
          ),
        ),
      ],
    );
  }

  // Confirm Return Action
  void _confirmReturn(BuildContext context) async {
    if (_selectedSale == null || _isSaving) return;

    final sale = _selectedSale!;
    final itemsToReturn = <Map<String, dynamic>>[];
    double totalRefund = 0.0;

    for (final item in sale.items) {
      final qty = _returnQtys[item.productId] ?? 0;
      if (qty > 0) {
        itemsToReturn.add({
          'product_id': item.productId,
          'return_qty': qty,
          'reason': _returnReasons[item.productId] ?? 'Damaged Goods',
        });
        totalRefund += qty * item.price;
      }
    }

    if (itemsToReturn.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select at least 1 item quantity to return.'),
          backgroundColor: Colors.orangeAccent,
        ),
      );
      return;
    }

    final firstReason = itemsToReturn.first['reason'] as String;

    setState(() => _isSaving = true);

    try {
      await context.read<WholesaleCubit>().processSalesReturn(
        saleId: sale.id,
        invoiceNumber: sale.invoiceNumber.toString(),
        customerName: _selectedCustomer?.name ?? sale.customerName,
        customerId: _selectedCustomer?.id ?? sale.customerId,
        refundAmount: totalRefund,
        reason: firstReason,
        settlementMethod: _settlementMethod,
        returnItems: itemsToReturn,
        notes: _notesController.text,
      );

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Sales return for INV-${sale.invoiceNumber} created successfully!'),
            backgroundColor: const Color(0xFF24B489),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        String msg = e.toString();
        if (msg.startsWith("Exception: ")) {
          msg = msg.substring(11);
        }
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Server Error', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
            content: Text(msg),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }
}
