import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_colors.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../models/wholesale_models.dart';

class EditTransactionDialog extends StatefulWidget {
  final dynamic entry;

  const EditTransactionDialog({super.key, required this.entry});

  @override
  State<EditTransactionDialog> createState() => _EditTransactionDialogState();
}

class _EditTransactionDialogState extends State<EditTransactionDialog> {
  final _formKey = GlobalKey<FormState>();

  // Sale Controllers
  late TextEditingController _nameController;
  late TextEditingController _mobileController;
  late TextEditingController _totalController;
  late TextEditingController _discountController;
  late TextEditingController _dueController;
  late String _paymentMethod;
  late String _status;

  // Purchase Controllers
  late TextEditingController _supplierController;

  // Payment Controllers
  late String _paymentKind;

  // Shared Notes Controller
  late TextEditingController _notesController;

  @override
  void initState() {
    super.initState();
    final entry = widget.entry;

    if (entry is WholesaleSaleModel) {
      _nameController = TextEditingController(text: entry.customerName);
      _mobileController = TextEditingController(text: entry.customerMobile);
      _totalController = TextEditingController(text: entry.total.toString());
      _discountController = TextEditingController(text: entry.discount.toString());
      _dueController = TextEditingController(text: entry.dueAmount.toString());
      _paymentMethod = entry.paymentMethod;
      _status = entry.status;
      _notesController = TextEditingController();
    } else if (entry is WholesalePurchaseModel) {
      _supplierController = TextEditingController(text: entry.supplierName);
      _totalController = TextEditingController(text: entry.total.toString());
      _notesController = TextEditingController(text: entry.notes ?? '');
    } else if (entry is WholesalePaymentModel) {
      _totalController = TextEditingController(text: entry.amount.toString());
      _paymentKind = entry.kind;
      _notesController = TextEditingController(text: entry.notes ?? '');
    } else if (entry is WholesaleOrderModel) {
      _nameController = TextEditingController(text: entry.customerName);
      _mobileController = TextEditingController(text: entry.customerMobile);
      _totalController = TextEditingController(text: entry.total.toString());
      _status = entry.status;
      _notesController = TextEditingController(text: entry.notes ?? '');
    }
  }

  @override
  void dispose() {
    if (widget.entry is WholesaleSaleModel || widget.entry is WholesaleOrderModel) {
      _nameController.dispose();
      _mobileController.dispose();
    }
    if (widget.entry is WholesalePurchaseModel) {
      _supplierController.dispose();
    }
    _totalController.dispose();
    if (widget.entry is WholesaleSaleModel) {
      _discountController.dispose();
      _dueController.dispose();
    }
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bgColor = isDark ? AppColors.cardDark : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF111827) : Colors.white;
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569);
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final borderColor = isDark ? const Color(0xFF1F2937) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    final entry = widget.entry;
    String title = 'Edit Transaction';
    if (entry is WholesaleSaleModel) title = 'Edit Sale #${entry.invoiceNumber}';
    if (entry is WholesalePurchaseModel) title = 'Edit Purchase #${entry.invoiceNumber}';
    if (entry is WholesalePaymentModel) title = 'Edit Payment Entry';
    if (entry is WholesaleOrderModel) title = 'Edit Order #${entry.orderNumber}';

    return Dialog(
      backgroundColor: bgColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 540),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.x, color: labelColor, size: 20),
                    onPressed: () => Navigator.pop(context),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 1),

            // Form Content
            Flexible(
              child: Form(
                key: _formKey,
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (entry is WholesaleSaleModel) ...[
                        _buildSectionLabel('Customer Name', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _nameController, hint: 'Customer Name', cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                        const SizedBox(height: 14),

                        _buildSectionLabel('Mobile Number', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _mobileController, hint: '966...', keyboardType: TextInputType.phone, cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                        const SizedBox(height: 14),

                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSectionLabel('Total (SAR)', labelColor),
                                  const SizedBox(height: 6),
                                  _buildTextField(controller: _totalController, hint: '0.00', keyboardType: const TextInputType.numberWithOptions(decimal: true), cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSectionLabel('Discount (SAR)', labelColor),
                                  const SizedBox(height: 6),
                                  _buildTextField(controller: _discountController, hint: '0.00', keyboardType: const TextInputType.numberWithOptions(decimal: true), cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),

                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSectionLabel('Due Amount (SAR)', labelColor),
                                  const SizedBox(height: 6),
                                  _buildTextField(controller: _dueController, hint: '0.00', keyboardType: const TextInputType.numberWithOptions(decimal: true), cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSectionLabel('Payment Method', labelColor),
                                  const SizedBox(height: 6),
                                  _buildDropdown(
                                    value: _paymentMethod,
                                    items: const ['cash', 'pos', 'bank', 'due', 'mixed'],
                                    onChanged: (val) => setState(() => _paymentMethod = val!),
                                    cardBg: cardBg,
                                    borderColor: borderColor,
                                    textColor: textColor,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),

                        _buildSectionLabel('Invoice Status', labelColor),
                        const SizedBox(height: 6),
                        _buildDropdown(
                          value: _status,
                          items: const ['completed', 'cancelled'],
                          onChanged: (val) => setState(() => _status = val!),
                          cardBg: cardBg,
                          borderColor: borderColor,
                          textColor: textColor,
                        ),
                      ] else if (entry is WholesalePurchaseModel) ...[
                        _buildSectionLabel('Supplier Name', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _supplierController, hint: 'Supplier Name', cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                        const SizedBox(height: 14),

                        _buildSectionLabel('Total Purchase Amount (SAR)', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _totalController, hint: '0.00', keyboardType: const TextInputType.numberWithOptions(decimal: true), cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                        const SizedBox(height: 14),

                        _buildSectionLabel('Notes', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _notesController, hint: 'Notes...', maxLines: 2, cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                      ] else if (entry is WholesalePaymentModel) ...[
                        _buildSectionLabel('Payment Amount (SAR)', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _totalController, hint: '0.00', keyboardType: const TextInputType.numberWithOptions(decimal: true), cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                        const SizedBox(height: 14),

                        _buildSectionLabel('Payment Direction', labelColor),
                        const SizedBox(height: 6),
                        _buildDropdown(
                          value: _paymentKind,
                          items: const ['payment_in', 'payment_out'],
                          onChanged: (val) => setState(() => _paymentKind = val!),
                          cardBg: cardBg,
                          borderColor: borderColor,
                          textColor: textColor,
                        ),
                        const SizedBox(height: 14),

                        _buildSectionLabel('Notes', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _notesController, hint: 'Notes...', maxLines: 2, cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                      ] else if (entry is WholesaleOrderModel) ...[
                        _buildSectionLabel('Customer Name', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _nameController, hint: 'Customer Name', cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                        const SizedBox(height: 14),

                        _buildSectionLabel('Mobile Number', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _mobileController, hint: '966...', keyboardType: TextInputType.phone, cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                        const SizedBox(height: 14),

                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSectionLabel('Total (SAR)', labelColor),
                                  const SizedBox(height: 6),
                                  _buildTextField(controller: _totalController, hint: '0.00', keyboardType: const TextInputType.numberWithOptions(decimal: true), cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSectionLabel('Status', labelColor),
                                  const SizedBox(height: 6),
                                  _buildDropdown(
                                    value: _status,
                                    items: const ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
                                    onChanged: (val) => setState(() => _status = val!),
                                    cardBg: cardBg,
                                    borderColor: borderColor,
                                    textColor: textColor,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),

                        _buildSectionLabel('Notes', labelColor),
                        const SizedBox(height: 6),
                        _buildTextField(controller: _notesController, hint: 'Delivery notes...', maxLines: 2, cardBg: cardBg, borderColor: borderColor, textColor: textColor, primaryColor: primaryColor),
                      ],
                    ],
                  ),
                ),
              ),
            ),

            // Footer Actions
            const Divider(height: 1, thickness: 1),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: BorderSide(color: borderColor),
                        backgroundColor: cardBg,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: Text('Cancel', style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        backgroundColor: primaryColor,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: _onSave,
                      child: const Text('Save Changes', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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

  void _onSave() async {
    final entry = widget.entry;
    final cubit = context.read<WholesaleCubit>();

    if (entry is WholesaleSaleModel) {
      final updated = entry.copyWith(
        customerName: _nameController.text.trim(),
        customerMobile: _mobileController.text.trim(),
        total: double.tryParse(_totalController.text.trim()) ?? entry.total,
        discount: double.tryParse(_discountController.text.trim()) ?? entry.discount,
        dueAmount: double.tryParse(_dueController.text.trim()) ?? entry.dueAmount,
        paymentMethod: _paymentMethod,
        status: _status,
      );
      await cubit.updateSale(updated);
    } else if (entry is WholesalePurchaseModel) {
      final updated = entry.copyWith(
        supplierName: _supplierController.text.trim(),
        total: double.tryParse(_totalController.text.trim()) ?? entry.total,
        notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      );
      await cubit.updatePurchase(updated);
    } else if (entry is WholesalePaymentModel) {
      final updated = entry.copyWith(
        amount: double.tryParse(_totalController.text.trim()) ?? entry.amount,
        kind: _paymentKind,
        notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      );
      await cubit.updatePayment(updated);
    } else if (entry is WholesaleOrderModel) {
      final updated = entry.copyWith(
        customerName: _nameController.text.trim(),
        customerMobile: _mobileController.text.trim(),
        total: double.tryParse(_totalController.text.trim()) ?? entry.total,
        status: _status,
        notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      );
      await cubit.updateOrder(updated);
    }

    if (mounted) {
      Navigator.pop(context, true); // Return true indicating update
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Transaction updated successfully.')),
      );
    }
  }

  Widget _buildSectionLabel(String label, Color color) {
    return Text(
      label,
      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required Color cardBg,
    required Color borderColor,
    required Color textColor,
    required Color primaryColor,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      style: TextStyle(color: textColor, fontSize: 14),
      decoration: InputDecoration(
        hintText: hint,
        fillColor: cardBg,
        filled: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: primaryColor, width: 1.5),
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
    required Color cardBg,
    required Color borderColor,
    required Color textColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: items.contains(value) ? value : items.first,
          isExpanded: true,
          dropdownColor: cardBg,
          style: TextStyle(color: textColor, fontSize: 14),
          onChanged: onChanged,
          items: items.map((it) {
            return DropdownMenuItem<String>(
              value: it,
              child: Text(it.toUpperCase()),
            );
          }).toList(),
        ),
      ),
    );
  }
}
