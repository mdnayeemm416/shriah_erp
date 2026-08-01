import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../models/wholesale_models.dart';

class AddPartyBottomSheet extends StatefulWidget {
  final String initialType;
  final WholesaleCustomerModel? partyToEdit;

  const AddPartyBottomSheet({
    super.key,
    this.initialType = 'Supplier',
    this.partyToEdit,
  });

  @override
  State<AddPartyBottomSheet> createState() => _AddPartyBottomSheetState();
}

class _AddPartyBottomSheetState extends State<AddPartyBottomSheet> {
  late String _partyType;
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _openingDueController = TextEditingController(text: '0');
  final _openingAdvanceController = TextEditingController(text: '0');
  final _openingPayableController = TextEditingController(text: '0');
  final _openingNotesController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _partyType = widget.initialType;
    if (widget.partyToEdit != null) {
      final p = widget.partyToEdit!;
      _nameController.text = p.name;
      _phoneController.text = p.mobile;
      _addressController.text = p.address ?? '';
      _openingDueController.text = p.openingDue.toString();
      _openingNotesController.text = p.notes ?? '';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _openingDueController.dispose();
    _openingAdvanceController.dispose();
    _openingPayableController.dispose();
    _openingNotesController.dispose();
    super.dispose();
  }

  void _save() {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();
    final address = _addressController.text.trim();
    final due = double.tryParse(_openingDueController.text.trim()) ?? 0.0;
    final advance = double.tryParse(_openingAdvanceController.text.trim()) ?? 0.0;
    final payable = double.tryParse(_openingPayableController.text.trim()) ?? 0.0;
    final notes = _openingNotesController.text.trim();

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter party name')),
      );
      return;
    }

    final netOpening = (due + payable) - advance;
    final combinedNotes = [
      if (_partyType.isNotEmpty) 'Type: $_partyType',
      if (advance > 0) 'Advance: $advance SAR',
      if (payable > 0) 'Payable: $payable SAR',
      if (notes.isNotEmpty) notes,
    ].join(' | ');

    final partyObj = WholesaleCustomerModel(
      id: widget.partyToEdit?.id ?? '',
      name: name,
      mobile: phone,
      openingDue: netOpening,
      address: address.isEmpty ? null : address,
      notes: combinedNotes.isEmpty ? null : combinedNotes,
      createdAt: widget.partyToEdit?.createdAt ?? DateTime.now(),
    );

    if (widget.partyToEdit != null) {
      context.read<WholesaleCubit>().updateCustomer(partyObj);
    } else {
      context.read<WholesaleCubit>().createCustomer(
            name: name,
            mobile: phone,
            openingDue: netOpening,
            address: address.isEmpty ? null : address,
            notes: combinedNotes.isEmpty ? null : combinedNotes,
          );
    }

    Navigator.pop(context, partyObj);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$_partyType "$name" saved successfully.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF161E2E) : Colors.white;
    final cardBgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569);
    final borderColor = isDark ? const Color(0xFF1F2937) : const Color(0xFFE2E8F0);
    const primaryGreen = Color(0xFF10B981);

    return SafeArea(
      top: false,
      child: Container(
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 16,
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Header Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const SizedBox(width: 24),
                    Text(
                      widget.partyToEdit != null ? 'Edit party' : 'New party',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: Icon(
                        LucideIcons.x,
                        color: labelColor,
                        size: 20,
                      ),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Name
                _buildFieldLabel('Name', labelColor),
                const SizedBox(height: 6),
                _buildTextField(
                  controller: _nameController,
                  hint: 'e.g. Bata Quraish',
                  cardBg: cardBgColor,
                  borderColor: borderColor,
                  textColor: textColor,
                  labelColor: labelColor,
                ),
                const SizedBox(height: 16),

                // Type Dropdown
                _buildFieldLabel('Type', labelColor),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: cardBgColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: borderColor),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _partyType,
                      isExpanded: true,
                      dropdownColor: bgColor,
                      style: TextStyle(color: textColor, fontSize: 14),
                      icon: Icon(LucideIcons.chevronDown, size: 16, color: labelColor),
                      items: const [
                        DropdownMenuItem(value: 'Customer', child: Text('Customer')),
                        DropdownMenuItem(value: 'Supplier', child: Text('Supplier')),
                      ],
                      onChanged: (val) {
                        if (val != null) {
                          setState(() {
                            _partyType = val;
                          });
                        }
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Phone
                _buildFieldLabel('Phone', labelColor),
                const SizedBox(height: 6),
                _buildTextField(
                  controller: _phoneController,
                  hint: '+966...',
                  keyboardType: TextInputType.phone,
                  cardBg: cardBgColor,
                  borderColor: borderColor,
                  textColor: textColor,
                  labelColor: labelColor,
                ),
                const SizedBox(height: 16),

                // Address
                _buildFieldLabel('Address', labelColor),
                const SizedBox(height: 6),
                _buildTextField(
                  controller: _addressController,
                  hint: '',
                  cardBg: cardBgColor,
                  borderColor: borderColor,
                  textColor: textColor,
                  labelColor: labelColor,
                ),
                const SizedBox(height: 20),

                // OPENING BALANCE Box Container
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: cardBgColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'OPENING BALANCE',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.8,
                          color: labelColor,
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Opening Due
                      _buildFieldLabel('Opening Due', labelColor),
                      const SizedBox(height: 6),
                      _buildTextField(
                        controller: _openingDueController,
                        hint: '0',
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        cardBg: bgColor,
                        borderColor: borderColor,
                        textColor: textColor,
                        labelColor: labelColor,
                      ),
                      const SizedBox(height: 14),

                      // Opening Advance
                      _buildFieldLabel('Opening Advance', labelColor),
                      const SizedBox(height: 6),
                      _buildTextField(
                        controller: _openingAdvanceController,
                        hint: '0',
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        cardBg: bgColor,
                        borderColor: borderColor,
                        textColor: textColor,
                        labelColor: labelColor,
                      ),
                      const SizedBox(height: 14),

                      // Opening Payable
                      _buildFieldLabel('Opening Payable', labelColor),
                      const SizedBox(height: 6),
                      _buildTextField(
                        controller: _openingPayableController,
                        hint: '0',
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        cardBg: bgColor,
                        borderColor: borderColor,
                        textColor: textColor,
                        labelColor: labelColor,
                      ),
                      const SizedBox(height: 14),

                      // Opening Notes
                      _buildFieldLabel('Opening Notes', labelColor),
                      const SizedBox(height: 6),
                      _buildTextField(
                        controller: _openingNotesController,
                        hint: '',
                        maxLines: 3,
                        cardBg: bgColor,
                        borderColor: borderColor,
                        textColor: textColor,
                        labelColor: labelColor,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Save Button
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(50),
                    backgroundColor: primaryGreen,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    elevation: 0,
                  ),
                  onPressed: _save,
                  child: const Text(
                    'Save',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 12),

                // Cancel Button
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(50),
                    side: BorderSide(color: borderColor),
                    foregroundColor: textColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFieldLabel(String label, Color color) {
    return Text(
      label,
      style: TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: color,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required Color cardBg,
    required Color borderColor,
    required Color textColor,
    required Color labelColor,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      style: TextStyle(fontSize: 14, color: textColor),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(fontSize: 13, color: labelColor.withValues(alpha: 0.6)),
        filled: true,
        fillColor: cardBg,
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
          borderSide: const BorderSide(color: Color(0xFF10B981), width: 1.5),
        ),
      ),
    );
  }
}
