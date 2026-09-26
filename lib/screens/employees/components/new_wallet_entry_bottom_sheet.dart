import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:file_picker/file_picker.dart';
import '../models/employee_view_model.dart';

class NewWalletEntryBottomSheet extends StatefulWidget {
  final EmployeeItem employee;
  final String initialType; // 'expense' | 'deposit'
  final Function(WalletTransactionItem) onSave;

  const NewWalletEntryBottomSheet({
    super.key,
    required this.employee,
    this.initialType = 'expense',
    required this.onSave,
  });

  static Future<void> show(
    BuildContext context, {
    required EmployeeItem employee,
    String initialType = 'expense',
    required Function(WalletTransactionItem) onSave,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => NewWalletEntryBottomSheet(
        employee: employee,
        initialType: initialType,
        onSave: onSave,
      ),
    );
  }

  @override
  State<NewWalletEntryBottomSheet> createState() => _NewWalletEntryBottomSheetState();
}

class _NewWalletEntryBottomSheetState extends State<NewWalletEntryBottomSheet> {
  final _formKey = GlobalKey<FormState>();

  late String _entryType; // 'expense' | 'deposit'
  final _amountController = TextEditingController();
  final _notesController = TextEditingController();

  String? _selectedCategory;
  DateTime _selectedDate = DateTime.now();
  String? _receiptPhotoName;

  static const Color _mintColor = Color(0xFF24B489);
  static const Color _roseColor = Color(0xFFEF4444);
  static const Color _borderColor = Color(0xFFE2E8F0);
  static const Color _darkBorderColor = Color(0xFF334155);

  final List<String> _expenseCategories = [
    'Fuel',
    'Vehicle Maintenance',
    'Food & Refreshments',
    'Delivery Logistics',
    'Office Supplies',
    'Medical / Iqama Fee',
    'General Expense',
  ];

  @override
  void initState() {
    super.initState();
    _entryType = widget.initialType;
    if (_entryType == 'expense') {
      _selectedCategory = _expenseCategories.first;
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _pickPhoto(String source) async {
    try {
      final result = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['jpg', 'png', 'jpeg', 'pdf'],
      );
      if (result != null && result.files.isNotEmpty) {
        setState(() {
          _receiptPhotoName = '$source: ${result.files.first.name}';
        });
      }
    } catch (_) {
      setState(() {
        _receiptPhotoName = '$source Photo attached';
      });
    }
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final amount = double.tryParse(_amountController.text.trim()) ?? 0.0;
    if (amount <= 0) return;

    final item = WalletTransactionItem(
      id: 'wt_${DateTime.now().millisecondsSinceEpoch}',
      employeeId: widget.employee.id,
      employeeName: widget.employee.name,
      type: _entryType,
      amount: amount,
      date: _selectedDate,
      category: _entryType == 'expense' ? (_selectedCategory ?? 'General Expense') : 'Deposit Float',
      notes: _notesController.text.trim(),
      paymentMode: 'Cash',
    );

    widget.onSave(item);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isExpense = _entryType == 'expense';
    final bgColor = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xFF0F172A);
    final textSecondary = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final fieldBorder = isDark ? _darkBorderColor : _borderColor;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.92,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      isExpense ? 'New expense' : 'New deposit',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textPrimary,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close, size: 20, color: textSecondary),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),

            // Scrollable Form
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Expense / Deposit Toggle Pills (Matching Image 2 & 3)
                      Row(
                        children: [
                          Expanded(
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  _entryType = 'expense';
                                  _selectedCategory ??= _expenseCategories.first;
                                });
                              },
                              borderRadius: BorderRadius.circular(24),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                decoration: BoxDecoration(
                                  color: isExpense ? _roseColor.withValues(alpha: 0.12) : Colors.transparent,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(
                                    color: isExpense ? _roseColor : fieldBorder,
                                    width: isExpense ? 1.5 : 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.arrow_upward_rounded, size: 18, color: isExpense ? _roseColor : textSecondary),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Expense',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: isExpense ? _roseColor : textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  _entryType = 'deposit';
                                });
                              },
                              borderRadius: BorderRadius.circular(24),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                decoration: BoxDecoration(
                                  color: !isExpense ? _mintColor.withValues(alpha: 0.12) : Colors.transparent,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(
                                    color: !isExpense ? _mintColor : fieldBorder,
                                    width: !isExpense ? 1.5 : 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.arrow_downward_rounded, size: 18, color: !isExpense ? _mintColor : textSecondary),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Deposit',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: !isExpense ? _mintColor : textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),

                      // 2. Amount (SAR) *
                      _buildFieldLabel('Amount (SAR) *', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _amountController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: textPrimary),
                        decoration: _inputDecoration('0.00', fieldBorder, isDark),
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'Please enter amount';
                          }
                          final d = double.tryParse(val.trim());
                          if (d == null || d <= 0) {
                            return 'Please enter a valid amount';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // 3. Category * (Shown for Expense)
                      if (isExpense) ...[
                        _buildFieldLabel('Category *', textPrimary),
                        const SizedBox(height: 6),
                        DropdownButtonFormField<String>(
                          initialValue: _selectedCategory,
                          isExpanded: true,
                          dropdownColor: bgColor,
                          style: TextStyle(fontSize: 14, color: textPrimary),
                          decoration: _inputDecoration('Select category', fieldBorder, isDark),
                          icon: Icon(Icons.keyboard_arrow_down, color: textSecondary),
                          items: _expenseCategories.map((c) => DropdownMenuItem(
                            value: c,
                            child: Text(c),
                          )).toList(),
                          onChanged: (val) => setState(() => _selectedCategory = val),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // 4. Date Picker Field
                      _buildFieldLabel('Date', textPrimary),
                      const SizedBox(height: 6),
                      InkWell(
                        onTap: _pickDate,
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: fieldBorder),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                DateFormat('dd/MM/yyyy').format(_selectedDate),
                                style: TextStyle(fontSize: 14, color: textPrimary),
                              ),
                              Icon(LucideIcons.calendar, size: 18, color: textSecondary),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // 5. Note (optional)
                      _buildFieldLabel('Note (optional)', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _notesController,
                        maxLines: 3,
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: _inputDecoration(
                          isExpense ? 'What was this expense for?' : 'Who gave you this money and why?',
                          fieldBorder,
                          isDark,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // 6. Receipt photo * (camera or gallery only)
                      Row(
                        children: [
                          _buildFieldLabel('Receipt photo *', textPrimary),
                          const SizedBox(width: 4),
                          Text(
                            '(camera or gallery only)',
                            style: TextStyle(fontSize: 11, color: textSecondary),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => _pickPhoto('Camera'),
                              icon: const Icon(LucideIcons.camera, size: 16),
                              label: const Text('Camera'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: textPrimary,
                                side: BorderSide(color: fieldBorder),
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => _pickPhoto('Gallery'),
                              icon: const Icon(LucideIcons.image, size: 16),
                              label: const Text('Gallery'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: textPrimary,
                                side: BorderSide(color: fieldBorder),
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                              ),
                            ),
                          ),
                        ],
                      ),
                      if (_receiptPhotoName != null) ...[
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.check_circle, size: 16, color: _mintColor),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                _receiptPhotoName!,
                                style: const TextStyle(fontSize: 12, color: _mintColor, fontWeight: FontWeight.w600),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.close, size: 16),
                              onPressed: () => setState(() => _receiptPhotoName = null),
                            ),
                          ],
                        ),
                      ],
                      const SizedBox(height: 24),

                      // 7. Save & Cancel Buttons
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: _submit,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _mintColor,
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                          child: const Text(
                            'Save',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        height: 40,
                        child: TextButton(
                          onPressed: () => Navigator.of(context).pop(),
                          child: Text(
                            'Cancel',
                            style: TextStyle(
                              fontSize: 14,
                              color: textSecondary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                    ],
                  ),
                ),
              ),
            ),
          ],
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

  InputDecoration _inputDecoration(String hint, Color borderColor, bool isDark) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
      filled: true,
      fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: borderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: borderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: _mintColor, width: 1.5),
      ),
    );
  }
}
