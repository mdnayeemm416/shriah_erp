import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../models/wholesale_models.dart';

class AddCustomerDialog extends StatefulWidget {
  final WholesaleCustomerModel? customerToEdit;

  const AddCustomerDialog({
    super.key,
    this.customerToEdit,
  });

  @override
  State<AddCustomerDialog> createState() => _AddCustomerDialogState();
}

class _AddCustomerDialogState extends State<AddCustomerDialog> {
  final _nameController = TextEditingController();
  final _mobileController = TextEditingController();
  final _addressController = TextEditingController();
  final _vatController = TextEditingController();
  final _dueController = TextEditingController(text: '0');
  final _notesController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.customerToEdit != null) {
      final c = widget.customerToEdit!;
      _nameController.text = c.name;
      _mobileController.text = c.mobile;
      _addressController.text = c.address ?? '';
      _vatController.text = c.vatNumber ?? '';
      _dueController.text = c.openingDue.toString();
      _notesController.text = c.notes ?? '';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _mobileController.dispose();
    _addressController.dispose();
    _vatController.dispose();
    _dueController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _save() {
    final name = _nameController.text.trim();
    final mobile = _mobileController.text.trim();
    final address = _addressController.text.trim();
    final vat = _vatController.text.trim();
    final due = double.tryParse(_dueController.text.trim()) ?? 0.0;
    final notes = _notesController.text.trim();

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter customer full name')),
      );
      return;
    }

    if (widget.customerToEdit != null) {
      final updated = widget.customerToEdit!.copyWith(
        name: name,
        mobile: mobile,
        address: address.isEmpty ? null : address,
        vatNumber: vat.isEmpty ? null : vat,
        openingDue: due,
        notes: notes.isEmpty ? null : notes,
      );
      context.read<WholesaleCubit>().updateCustomer(updated);
    } else {
      context.read<WholesaleCubit>().createCustomer(
            name: name,
            mobile: mobile,
            openingDue: due,
            address: address.isEmpty ? null : address,
            vatNumber: vat.isEmpty ? null : vat,
            notes: notes.isEmpty ? null : notes,
          );
    }

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    final isEdit = widget.customerToEdit != null;

    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      backgroundColor: cardBg,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 440),
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Top Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(LucideIcons.userPlus, color: primaryColor, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        isEdit ? 'Edit customer' : 'Add customer',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.x, color: labelColor, size: 20),
                    onPressed: () => Navigator.pop(context),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // 1. CUSTOMER NAME *
              _buildLabel('CUSTOMER NAME *', labelColor),
              const SizedBox(height: 4),
              TextField(
                controller: _nameController,
                style: TextStyle(fontSize: 13, color: textColor),
                decoration: _buildInputDecoration('Full name', cardBg, borderColor, primaryColor, labelColor),
              ),
              const SizedBox(height: 12),

              // 2. MOBILE
              _buildLabel('MOBILE', labelColor),
              const SizedBox(height: 4),
              TextField(
                controller: _mobileController,
                keyboardType: TextInputType.phone,
                style: TextStyle(fontSize: 13, color: textColor),
                decoration: _buildInputDecoration('05xxxxxxxx', cardBg, borderColor, primaryColor, labelColor),
              ),
              const SizedBox(height: 12),

              // 3. ADDRESS
              _buildLabel('ADDRESS', labelColor),
              const SizedBox(height: 4),
              TextField(
                controller: _addressController,
                style: TextStyle(fontSize: 13, color: textColor),
                decoration: _buildInputDecoration('Optional', cardBg, borderColor, primaryColor, labelColor),
              ),
              const SizedBox(height: 12),

              // 4. TAX / VAT NUMBER
              _buildLabel('TAX / VAT NUMBER', labelColor),
              const SizedBox(height: 4),
              TextField(
                controller: _vatController,
                style: TextStyle(fontSize: 13, color: textColor),
                decoration: _buildInputDecoration('Optional', cardBg, borderColor, primaryColor, labelColor),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 4, left: 4),
                child: Text('Used on B2B invoices (ZATCA)', style: TextStyle(fontSize: 10, color: labelColor)),
              ),
              const SizedBox(height: 12),

              // 5. OPENING BALANCE (SAR)
              _buildLabel('OPENING BALANCE (SAR)', labelColor),
              const SizedBox(height: 4),
              TextField(
                controller: _dueController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                style: TextStyle(fontSize: 13, color: textColor),
                decoration: _buildInputDecoration('0', cardBg, borderColor, primaryColor, labelColor),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 4, left: 4),
                child: Text('Previous due owed by customer', style: TextStyle(fontSize: 10, color: labelColor)),
              ),
              const SizedBox(height: 12),

              // 6. NOTES
              _buildLabel('NOTES', labelColor),
              const SizedBox(height: 4),
              TextField(
                controller: _notesController,
                maxLines: 2,
                style: TextStyle(fontSize: 13, color: textColor),
                decoration: _buildInputDecoration('Optional', cardBg, borderColor, primaryColor, labelColor),
              ),
              const SizedBox(height: 20),

              // Action Buttons Row (Save customer / Cancel)
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: _save,
                      child: Text(
                        isEdit ? 'Update customer' : 'Save customer',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: BorderSide(color: borderColor),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: Text(
                        'Cancel',
                        style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String label, Color labelColor) {
    return Text(
      label,
      style: TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.6,
        color: labelColor,
      ),
    );
  }

  InputDecoration _buildInputDecoration(
    String hint,
    Color cardBg,
    Color borderColor,
    Color primaryColor,
    Color labelColor,
  ) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(fontSize: 13, color: labelColor),
      filled: true,
      fillColor: cardBg,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
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
    );
  }
}
