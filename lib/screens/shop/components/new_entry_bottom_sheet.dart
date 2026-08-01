import 'dart:io';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:file_picker/file_picker.dart';
import '../../../models/shop_model.dart';
import '../../../models/shop_entry_model.dart';
import '../../../models/cashier_model.dart';

class NewEntryBottomSheet extends StatefulWidget {
  final String defaultShopId;
  final ShopEntryModel? editingEntry;
  final List<ShopModel> shops;
  final List<CashierModel> cashiers;
  final bool isDark;
  final Function(Map<String, dynamic> entryData) onSubmit;

  const NewEntryBottomSheet({
    super.key,
    required this.defaultShopId,
    this.editingEntry,
    required this.shops,
    required this.cashiers,
    required this.isDark,
    required this.onSubmit,
  });

  static void show({
    required BuildContext context,
    required String defaultShopId,
    ShopEntryModel? editingEntry,
    required List<ShopModel> shops,
    required List<CashierModel> cashiers,
    required bool isDark,
    required Function(Map<String, dynamic> entryData) onSubmit,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
      ),
      builder: (context) => NewEntryBottomSheet(
        defaultShopId: defaultShopId,
        editingEntry: editingEntry,
        shops: shops,
        cashiers: cashiers,
        isDark: isDark,
        onSubmit: onSubmit,
      ),
    );
  }

  @override
  State<NewEntryBottomSheet> createState() => _NewEntryBottomSheetState();
}

class _NewEntryBottomSheetState extends State<NewEntryBottomSheet> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  late TabController _tabController;

  late String _shopId;
  late DateTime _date;
  String? _cashierId;

  final _posSaleController = TextEditingController();
  final _cashSaleController = TextEditingController();
  final _bankSaleController = TextEditingController();
  final _creditSaleController = TextEditingController();
  final _dueReceivableController = TextEditingController();
  final _purchaseController = TextEditingController();
  final _expenseController = TextEditingController();
  final _withdrawController = TextEditingController();
  final _notesController = TextEditingController();
  final _attachmentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);

    if (widget.editingEntry != null) {
      final e = widget.editingEntry!;
      _shopId = e.shopId;
      _date = e.txnDate;
      _cashierId = e.cashierId;

      _posSaleController.text = e.posSale > 0 ? e.posSale.toString() : '';
      _cashSaleController.text = e.cashSale > 0 ? e.cashSale.toString() : '';
      _bankSaleController.text = e.bankSale > 0 ? e.bankSale.toString() : '';
      _creditSaleController.text = e.creditSale > 0 ? e.creditSale.toString() : '';
      _dueReceivableController.text = e.dueReceivable > 0 ? e.dueReceivable.toString() : '';
      _purchaseController.text = e.purchaseAmount > 0 ? e.purchaseAmount.toString() : '';
      _expenseController.text = e.expenseAmount > 0 ? e.expenseAmount.toString() : '';
      _withdrawController.text = e.withdrawAmount > 0 ? e.withdrawAmount.toString() : '';
      _notesController.text = e.notes ?? '';
      _attachmentController.text = e.attachmentUrl ?? '';

      if (e.entryType == 'sale') _tabController.index = 0;
      if (e.entryType == 'purchase') _tabController.index = 1;
      if (e.entryType == 'expense') _tabController.index = 2;
      if (e.entryType == 'withdraw') _tabController.index = 3;
    } else {
      _shopId = widget.defaultShopId;
      _date = DateTime.now();
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    _posSaleController.dispose();
    _cashSaleController.dispose();
    _bankSaleController.dispose();
    _creditSaleController.dispose();
    _dueReceivableController.dispose();
    _purchaseController.dispose();
    _expenseController.dispose();
    _withdrawController.dispose();
    _notesController.dispose();
    _attachmentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = widget.isDark;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryTeal = Color(0xFF24B489);

    final shop = widget.shops.firstWhere(
      (s) => s.id == _shopId,
      orElse: () => ShopModel(id: '', name: 'Branch', createdAt: DateTime.now()),
    );
    final filteredCashiers = widget.cashiers.where((c) => c.shopId == _shopId).toList();

    // Calculations
    final posVal = double.tryParse(_posSaleController.text) ?? 0.0;
    final cashVal = double.tryParse(_cashSaleController.text) ?? 0.0;
    final bankVal = double.tryParse(_bankSaleController.text) ?? 0.0;
    final creditVal = double.tryParse(_creditSaleController.text) ?? 0.0;
    final dueVal = double.tryParse(_dueReceivableController.text) ?? 0.0;

    final totalSale = cashVal + bankVal + creditVal - dueVal;
    final diff = totalSale - posVal;

    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      height: MediaQuery.of(context).size.height * 0.90,
      child: Column(
        children: [
          // Handle Pill Indicator
          const SizedBox(height: 10),
          Container(
            width: 36,
            height: 4,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 14),

          // Header Title & Subtitle
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.editingEntry != null ? 'Edit Entry' : 'New Entry',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    shop.name,
                    style: TextStyle(
                      fontSize: 13,
                      color: subtextColor,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Divider(height: 1, color: borderColor),

          // Scrollable Form Body
          Expanded(
            child: Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  // 1. Date & Shop Selectors Row
                  Row(
                    children: [
                      // Date Picker Box
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Date',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 6),
                            InkWell(
                              onTap: () async {
                                final picked = await showDatePicker(
                                  context: context,
                                  initialDate: _date,
                                  firstDate: DateTime(2020),
                                  lastDate: DateTime(2100),
                                );
                                if (picked != null) {
                                  setState(() => _date = picked);
                                }
                              },
                              borderRadius: BorderRadius.circular(24),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                decoration: BoxDecoration(
                                  color: cardBg,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: borderColor),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      DateFormat('MM/dd/yyyy').format(_date),
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: textColor,
                                      ),
                                    ),
                                    Icon(LucideIcons.calendar, size: 16, color: subtextColor),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 14),

                      // Shop Dropdown Selector Box
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Shop',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                              decoration: BoxDecoration(
                                color: cardBg,
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(color: borderColor),
                              ),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<String>(
                                  value: _shopId,
                                  isExpanded: true,
                                  icon: Icon(LucideIcons.chevronDown, size: 16, color: subtextColor),
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: textColor,
                                  ),
                                  items: widget.shops.map((s) {
                                    return DropdownMenuItem(
                                      value: s.id,
                                      child: Text(s.name, overflow: TextOverflow.ellipsis),
                                    );
                                  }).toList(),
                                  onChanged: (val) {
                                    if (val != null) {
                                      setState(() {
                                        _shopId = val;
                                        _cashierId = null;
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
                  const SizedBox(height: 18),

                  // 2. Entry Type Selector Pill Tabs
                  Row(
                    children: [
                      _buildTabPill(0, 'Sale', LucideIcons.shoppingCart),
                      const SizedBox(width: 8),
                      _buildTabPill(1, 'Purchase', null),
                      const SizedBox(width: 8),
                      _buildTabPill(2, 'Expense', null),
                      const SizedBox(width: 8),
                      _buildTabPill(3, 'Withdraw', null),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // 3. Cashier Selector Dropdown
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Cashier',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: borderColor),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String?>(
                            value: _cashierId,
                            isExpanded: true,
                            icon: Icon(LucideIcons.chevronDown, size: 16, color: subtextColor),
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: textColor,
                            ),
                            hint: Text('— None —', style: TextStyle(color: subtextColor, fontSize: 14)),
                            items: [
                              const DropdownMenuItem<String?>(
                                value: null,
                                child: Text('— None —'),
                              ),
                              ...filteredCashiers.map((c) {
                                return DropdownMenuItem<String?>(
                                  value: c.id,
                                  child: Text(c.name),
                                );
                              }),
                            ],
                            onChanged: (val) {
                              setState(() => _cashierId = val);
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // 4. Form Input Fields
                  if (_tabController.index == 0) ...[
                    // SALE TAB FIELDS
                    Row(
                      children: [
                        Expanded(
                          child: _buildAmountInput(
                            controller: _posSaleController,
                            label: 'POS Sale',
                            subtext: 'Z-report / printed POS total',
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: _buildAmountInput(
                            controller: _cashSaleController,
                            label: 'Cash Sale',
                            subtext: 'Paid in physical cash',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(
                          child: _buildAmountInput(
                            controller: _bankSaleController,
                            label: 'Bank Sale',
                            subtext: 'Card / transfer',
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: _buildAmountInput(
                            controller: _creditSaleController,
                            label: 'Credit Sale',
                            subtext: 'Sale given on due / baki',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Full Width: Due Receivable
                    _buildAmountInput(
                      controller: _dueReceivableController,
                      label: 'Due Receivable',
                      subtext: 'Received from previous due / baki',
                    ),
                    const SizedBox(height: 18),

                    // TOTAL SALE Calculation Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: primaryTeal.withValues(alpha: 0.4),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'TOTAL SALE',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                  color: Color(0xFF0D9488),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Icon(LucideIcons.info, size: 13, color: const Color(0xFF0D9488).withValues(alpha: 0.7)),
                            ],
                          ),
                          Text(
                            'SAR ${totalSale.toStringAsFixed(totalSale.truncateToDouble() == totalSale ? 0 : 2)}',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0D9488),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // PLUS / MINUS Discrepancy Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: borderColor),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'PLUS / MINUS',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                              color: textColor,
                            ),
                          ),
                          Text(
                            'SAR ${diff.toStringAsFixed(diff.truncateToDouble() == diff ? 0 : 2)}',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: textColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ] else if (_tabController.index == 1) ...[
                    // PURCHASE TAB FIELDS
                    _buildAmountInput(
                      controller: _purchaseController,
                      label: 'Purchase Amount',
                      subtext: 'SAR total amount paid',
                    ),
                  ] else if (_tabController.index == 2) ...[
                    // EXPENSE TAB FIELDS
                    _buildAmountInput(
                      controller: _expenseController,
                      label: 'Expense Value',
                      subtext: 'SAR total expense spent',
                    ),
                  ] else if (_tabController.index == 3) ...[
                    // WITHDRAW TAB FIELDS
                    _buildAmountInput(
                      controller: _withdrawController,
                      label: 'Withdrawal Amount',
                      subtext: 'SAR transfer / withdrawal sum',
                    ),
                  ],
                  const SizedBox(height: 18),

                  // 5. Notes Field
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Notes',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _notesController,
                        maxLines: 2,
                        style: TextStyle(fontSize: 14, color: textColor),
                        validator: (value) {
                          final idx = _tabController.index;
                          final isMandatory = idx == 1 || idx == 2 || idx == 3;
                          if (isMandatory && (value == null || value.trim().isEmpty)) {
                            return 'Notes description is required for purchases, expenses, and withdrawals.';
                          }
                          return null;
                        },
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.all(14),
                          fillColor: cardBg,
                          filled: true,
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
                            borderSide: const BorderSide(color: primaryTeal, width: 1.5),
                          ),
                          errorBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(20),
                            borderSide: const BorderSide(color: Colors.red, width: 1.0),
                          ),
                          focusedErrorBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(20),
                            borderSide: const BorderSide(color: Colors.red, width: 1.5),
                          ),
                          errorStyle: const TextStyle(color: Colors.red),
                        ),
                      ),                    ],
                  ),
                  const SizedBox(height: 18),

                  // 6. Attachment Field
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Attachment (image / PDF)',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 6),
                      InkWell(
                        onTap: () async {
                          try {
                            final result = await FilePicker.pickFiles(
                              type: FileType.custom,
                              allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf'],
                            );
                            if (result != null && result.files.isNotEmpty) {
                              final path = result.files.first.path;
                              if (path != null) {
                                setState(() {
                                  _attachmentController.text = path;
                                });
                              }
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Failed to pick file: $e')),
                              );
                            }
                          }
                        },
                        borderRadius: BorderRadius.circular(24),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: borderColor),
                          ),
                          child: Row(
                            children: [
                              Text(
                                'Choose File',
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.bold,
                                  color: textColor,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _attachmentController.text.isNotEmpty
                                      ? _attachmentController.text.split(Platform.pathSeparator).last
                                      : 'No file chosen',
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: subtextColor,
                                  ),
                                ),
                              ),
                              if (_attachmentController.text.isNotEmpty) ...[
                                const SizedBox(width: 8),
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _attachmentController.clear();
                                    });
                                  },
                                  child: Icon(
                                    LucideIcons.x,
                                    size: 16,
                                    color: Colors.red.shade400,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),
                ],
              ),
            ),
          ),

          // Bottom Action Buttons (Cancel & Save Entry)
          Divider(height: 1, color: borderColor),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
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
                    onPressed: _handleSubmit,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      backgroundColor: primaryTeal,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.save, size: 16, color: Colors.white),
                        SizedBox(width: 6),
                        Text(
                          'Save entry',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabPill(int index, String label, IconData? icon) {
    final active = _tabController.index == index;
    final isDark = widget.isDark;
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryTeal = Color(0xFF24B489);

    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _tabController.index = index),
        borderRadius: BorderRadius.circular(24),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: active ? primaryTeal : cardBg,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: active ? primaryTeal : borderColor,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 15, color: active ? Colors.white : const Color(0xFF0F172A)),
                const SizedBox(width: 6),
              ],
              Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: active
                      ? Colors.white
                      : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAmountInput({
    required TextEditingController controller,
    required String label,
    required String subtext,
  }) {
    final isDark = widget.isDark;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final cardBg = isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(width: 4),
            Icon(LucideIcons.info, size: 12, color: subtextColor),
          ],
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: textColor,
          ),
          onChanged: (_) => setState(() {}),
          decoration: InputDecoration(
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            fillColor: cardBg,
            filled: true,
            prefixIcon: Padding(
              padding: const EdgeInsets.only(left: 14, right: 8),
              child: Text(
                'SAR',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: subtextColor,
                ),
              ),
            ),
            prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
            hintText: '0.00',
            hintStyle: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: subtextColor,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(24),
              borderSide: BorderSide(color: borderColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(24),
              borderSide: BorderSide(color: borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(24),
              borderSide: const BorderSide(color: Color(0xFF24B489), width: 1.5),
            ),
          ),
        ),
        if (subtext.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(
            subtext,
            style: TextStyle(
              fontSize: 11,
              color: subtextColor,
            ),
          ),
        ],
      ],
    );
  }

  void _handleSubmit() {
    if (_formKey.currentState == null || !_formKey.currentState!.validate()) {
      return;
    }

    String entryType = 'sale';
    if (_tabController.index == 1) entryType = 'purchase';
    if (_tabController.index == 2) entryType = 'expense';
    if (_tabController.index == 3) entryType = 'withdraw';

    final data = <String, dynamic>{
      'shop_id': _shopId,
      'txn_date': _date,
      'cashier_id': _cashierId,
      'entry_type': entryType,
      'pos_sale': double.tryParse(_posSaleController.text) ?? 0.0,
      'cash_sale': double.tryParse(_cashSaleController.text) ?? 0.0,
      'bank_sale': double.tryParse(_bankSaleController.text) ?? 0.0,
      'credit_sale': double.tryParse(_creditSaleController.text) ?? 0.0,
      'due_receivable': double.tryParse(_dueReceivableController.text) ?? 0.0,
      'purchase_amount': double.tryParse(_purchaseController.text) ?? 0.0,
      'expense_amount': double.tryParse(_expenseController.text) ?? 0.0,
      'withdraw_amount': double.tryParse(_withdrawController.text) ?? 0.0,
      'notes': _notesController.text,
      'attachment_url': _attachmentController.text,
    };

    widget.onSubmit(data);
  }
}
