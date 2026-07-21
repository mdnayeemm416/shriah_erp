import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';

class PaymentInDialog extends StatefulWidget {
  final String? initialCustomerId;
  final String? initialCustomerName;

  const PaymentInDialog({
    super.key,
    this.initialCustomerId,
    this.initialCustomerName,
  });

  @override
  State<PaymentInDialog> createState() => _PaymentInDialogState();
}

class _PaymentInDialogState extends State<PaymentInDialog> {
  String? _selCustomerId;
  String _selCustomerName = '';
  String _paymentMethod = 'Cash';

  final _amountController = TextEditingController();
  final _notesController = TextEditingController();
  final _customerSearchController = TextEditingController();

  bool _showCustomerDropdown = false;
  List<WholesaleCustomerModel> _filteredCustomers = [];

  @override
  void initState() {
    super.initState();
    _selCustomerId = widget.initialCustomerId;
    _selCustomerName = widget.initialCustomerName ?? '';

    final state = context.read<WholesaleCubit>().state;
    _filteredCustomers = state.customers;
  }

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    _customerSearchController.dispose();
    super.dispose();
  }

  void _filterCustomers(String query) {
    final customers = context.read<WholesaleCubit>().state.customers;
    setState(() {
      if (query.trim().isEmpty) {
        _filteredCustomers = customers;
      } else {
        final q = query.toLowerCase();
        _filteredCustomers = customers.where((c) => c.name.toLowerCase().contains(q) || c.mobile.contains(q)).toList();
      }
    });
  }

  void _selectCustomer(WholesaleCustomerModel customer) {
    setState(() {
      _selCustomerId = customer.id;
      _selCustomerName = customer.name;
      _showCustomerDropdown = false;
      _customerSearchController.clear();
    });
  }

  Future<void> _shareToWhatsApp(String text) async {
    final url = Uri.parse('https://wa.me/?text=${Uri.encodeComponent(text)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _savePayment({bool share = false}) {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0.0;
    if (amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid amount')),
      );
      return;
    }

    final custName = _selCustomerName.isEmpty ? 'General Customer' : _selCustomerName;
    final notes = _notesController.text.trim();

    if (_selCustomerId != null) {
      context.read<WholesaleCubit>().recordPayment(
            customerId: _selCustomerId!,
            amount: amount,
            kind: 'payment_in',
            notes: 'Method: $_paymentMethod${notes.isNotEmpty ? ' | $notes' : ''}',
          );
    }

    if (share) {
      final msg = 'Payment Receipt\nCustomer: $custName\nAmount Paid: SAR ${amount.toStringAsFixed(2)}\nMethod: $_paymentMethod\nThank you!';
      _shareToWhatsApp(msg);
    }

    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Payment of SAR ${amount.toStringAsFixed(2)} recorded successfully!'),
        backgroundColor: const Color(0xFF24B489),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        return Dialog(
          insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          backgroundColor: bgColor,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: GestureDetector(
            onTap: () {
              if (_showCustomerDropdown) {
                setState(() => _showCustomerDropdown = false);
              }
            },
            behavior: HitTestBehavior.translucent,
            child: Container(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Top Header Bar
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 14, 12, 10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(LucideIcons.wallet, color: primaryColor, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              'Payment In',
                              style: TextStyle(
                                fontSize: 17,
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
                  ),
                  const Divider(height: 1, thickness: 1),

                  // Form Content
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // 1. Pick a customer... (Dashed/Subtle rounded selector card)
                            InkWell(
                              onTap: () {
                                setState(() {
                                  _showCustomerDropdown = !_showCustomerDropdown;
                                  _filteredCustomers = state.customers;
                                });
                              },
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                decoration: BoxDecoration(
                                  color: cardBg,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: _showCustomerDropdown ? primaryColor : borderColor,
                                    width: _showCustomerDropdown ? 1.5 : 1.0,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Icon(LucideIcons.search, size: 16, color: labelColor),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        _selCustomerName.isEmpty ? 'Pick a customer...' : _selCustomerName,
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: _selCustomerName.isEmpty ? FontWeight.normal : FontWeight.bold,
                                          color: _selCustomerName.isEmpty ? labelColor : textColor,
                                        ),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        'Optional',
                                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: labelColor),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),

                            // 2. Amount * & Method Input Row
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Amount * Field
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Amount *',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          color: labelColor,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      TextField(
                                        controller: _amountController,
                                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                        inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*'))],
                                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                                        decoration: InputDecoration(
                                          hintText: '0.00',
                                          hintStyle: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: labelColor),
                                          filled: true,
                                          fillColor: cardBg,
                                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
                                            borderSide: const BorderSide(color: primaryColor, width: 1.5),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 12),

                                // Method Field (Cash ˅ Dropdown)
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Method',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          color: labelColor,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: cardBg,
                                          borderRadius: BorderRadius.circular(20),
                                          border: Border.all(color: borderColor),
                                        ),
                                        child: DropdownButtonHideUnderline(
                                          child: DropdownButton<String>(
                                            value: _paymentMethod,
                                            isExpanded: true,
                                            dropdownColor: cardBg,
                                            style: TextStyle(color: textColor, fontSize: 13, fontWeight: FontWeight.bold),
                                            onChanged: (val) => setState(() => _paymentMethod = val!),
                                            items: const [
                                              DropdownMenuItem(value: 'Cash', child: Text('Cash')),
                                              DropdownMenuItem(value: 'Card / POS', child: Text('Card / POS')),
                                              DropdownMenuItem(value: 'Bank Transfer', child: Text('Bank Transfer')),
                                              DropdownMenuItem(value: 'Check', child: Text('Check')),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),

                            // 3. Notes (optional) Input Field
                            TextField(
                              controller: _notesController,
                              maxLines: 2,
                              style: TextStyle(fontSize: 13, color: textColor),
                              decoration: InputDecoration(
                                hintText: 'Notes (optional)',
                                hintStyle: TextStyle(fontSize: 13, color: labelColor),
                                filled: true,
                                fillColor: cardBg,
                                contentPadding: const EdgeInsets.all(14),
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
                                  borderSide: const BorderSide(color: primaryColor, width: 1.5),
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),

                            // 4. Action Buttons Row (Save & Share | Save payment)
                            Row(
                              children: [
                                Expanded(
                                  child: OutlinedButton.icon(
                                    style: OutlinedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(vertical: 14),
                                      side: BorderSide(color: borderColor),
                                      backgroundColor: cardBg,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                    ),
                                    onPressed: () => _savePayment(share: true),
                                    icon: Icon(LucideIcons.messageCircle, size: 16, color: textColor),
                                    label: Text(
                                      'Save & Share',
                                      style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: primaryColor,
                                      padding: const EdgeInsets.symmetric(vertical: 14),
                                      elevation: 0,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                    ),
                                    onPressed: () => _savePayment(),
                                    child: const Text(
                                      'Save payment',
                                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),

                        // Searchable Customer Dropdown Overlay
                        if (_showCustomerDropdown)
                          Positioned(
                            top: 48,
                            left: 0,
                            right: 0,
                            child: Material(
                              elevation: 8,
                              borderRadius: BorderRadius.circular(20),
                              color: cardBg,
                              child: Container(
                                constraints: const BoxConstraints(maxHeight: 220),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: borderColor),
                                ),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: TextField(
                                        controller: _customerSearchController,
                                        autofocus: true,
                                        style: TextStyle(fontSize: 13, color: textColor),
                                        onChanged: _filterCustomers,
                                        decoration: InputDecoration(
                                          hintText: 'Search customer...',
                                          hintStyle: TextStyle(fontSize: 12, color: labelColor),
                                          prefixIcon: Icon(LucideIcons.search, size: 16, color: labelColor),
                                          isDense: true,
                                          filled: true,
                                          fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                                          contentPadding: const EdgeInsets.symmetric(vertical: 8),
                                          border: OutlineInputBorder(
                                            borderRadius: BorderRadius.circular(12),
                                            borderSide: BorderSide.none,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const Divider(height: 1),
                                    Flexible(
                                      child: _filteredCustomers.isEmpty
                                          ? Padding(
                                              padding: const EdgeInsets.all(12.0),
                                              child: Text('No matching customers found', style: TextStyle(fontSize: 12, color: labelColor)),
                                            )
                                          : ListView.builder(
                                              shrinkWrap: true,
                                              itemCount: _filteredCustomers.length,
                                              itemBuilder: (context, idx) {
                                                final c = _filteredCustomers[idx];
                                                final isSelected = _selCustomerId == c.id;
                                                return ListTile(
                                                  dense: true,
                                                  leading: Icon(LucideIcons.user, size: 16, color: isSelected ? primaryColor : labelColor),
                                                  title: Text(c.name, style: TextStyle(fontWeight: FontWeight.bold, color: textColor, fontSize: 13)),
                                                  subtitle: Text(c.mobile, style: TextStyle(fontSize: 11, color: labelColor)),
                                                  trailing: isSelected ? const Icon(LucideIcons.check, size: 16, color: primaryColor) : null,
                                                  onTap: () => _selectCustomer(c),
                                                );
                                              },
                                            ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
