import 'package:flutter/material.dart';
import '../models/employee_view_model.dart';

class GiveReceiveMoneyDialog extends StatefulWidget {
  final EmployeeItem employee;
  final String actionType; // 'give' | 'receive'
  final Function(String type, double amount, String notes, String mode, DateTime date) onConfirm;

  const GiveReceiveMoneyDialog({
    super.key,
    required this.employee,
    required this.actionType,
    required this.onConfirm,
  });

  static Future<void> show(
    BuildContext context, {
    required EmployeeItem employee,
    required String actionType,
    required Function(String type, double amount, String notes, String mode, DateTime date) onConfirm,
  }) {
    return showDialog(
      context: context,
      builder: (ctx) => GiveReceiveMoneyDialog(
        employee: employee,
        actionType: actionType,
        onConfirm: onConfirm,
      ),
    );
  }

  @override
  State<GiveReceiveMoneyDialog> createState() => _GiveReceiveMoneyDialogState();
}

class _GiveReceiveMoneyDialogState extends State<GiveReceiveMoneyDialog> {
  final _amountController = TextEditingController();
  final _notesController = TextEditingController();
  String _paymentMode = 'Cash';
  final DateTime _txnDate = DateTime.now();

  static const Color _mintColor = Color(0xFF24B489);
  static const Color _roseColor = Color(0xFFEF4444);

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _submit() {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0.0;
    if (amount <= 0) return;

    widget.onConfirm(
      widget.actionType,
      amount,
      _notesController.text.trim(),
      _paymentMode,
      _txnDate,
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isGive = widget.actionType == 'give';
    final activeColor = isGive ? _roseColor : _mintColor;
    final title = isGive ? 'Give Money to ${widget.employee.name}' : 'Receive Money from ${widget.employee.name}';

    final bgColor = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xFF0F172A);

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: bgColor,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: activeColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    isGive ? Icons.arrow_upward_rounded : Icons.arrow_downward_rounded,
                    color: activeColor,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: textPrimary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Amount field
            Text(
              'Amount (SAR) *',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              autofocus: true,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary),
              decoration: InputDecoration(
                hintText: '0.00',
                prefixText: 'SAR  ',
                prefixStyle: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: activeColor),
                filled: true,
                fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: activeColor, width: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Payment Mode
            Text(
              'Payment Mode',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
            ),
            const SizedBox(height: 6),
            Row(
              children: ['Cash', 'Bank Transfer', 'POS'].map((mode) {
                final isSelected = _paymentMode == mode;
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 3),
                    child: InkWell(
                      onTap: () => setState(() => _paymentMode = mode),
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 9),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? activeColor.withValues(alpha: 0.15)
                              : (isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC)),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSelected
                                ? activeColor
                                : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          mode,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: isSelected ? activeColor : textPrimary,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 14),

            // Notes
            Text(
              'Notes (optional)',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _notesController,
              style: TextStyle(fontSize: 13, color: textPrimary),
              decoration: InputDecoration(
                hintText: 'e.g. Advance for grocery delivery',
                hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                filled: true,
                fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Actions
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: activeColor,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(isGive ? 'Give Money' : 'Receive Money'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
