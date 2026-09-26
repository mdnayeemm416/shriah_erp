import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:file_picker/file_picker.dart';
import '../models/employee_view_model.dart';

class AddEmployeeBottomSheet extends StatefulWidget {
  final EmployeeItem? employeeToEdit;
  final Function(EmployeeItem) onSave;

  const AddEmployeeBottomSheet({
    super.key,
    this.employeeToEdit,
    required this.onSave,
  });

  static Future<void> show(
    BuildContext context, {
    EmployeeItem? employeeToEdit,
    required Function(EmployeeItem) onSave,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AddEmployeeBottomSheet(
        employeeToEdit: employeeToEdit,
        onSave: onSave,
      ),
    );
  }

  @override
  State<AddEmployeeBottomSheet> createState() => _AddEmployeeBottomSheetState();
}

class _AddEmployeeBottomSheetState extends State<AddEmployeeBottomSheet> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _nameController;
  late TextEditingController _mobileController;
  late TextEditingController _iqamaController;
  late TextEditingController _salaryController;
  late TextEditingController _notesController;

  String? _selectedShop;
  String? _selectedLinkedUserId;
  String? _selectedLinkedUserName;
  String? _attachmentName;

  static const Color _mintColor = Color(0xFF24B489);
  static const Color _borderColor = Color(0xFFE2E8F0);
  static const Color _darkBorderColor = Color(0xFF334155);

  @override
  void initState() {
    super.initState();
    final emp = widget.employeeToEdit;
    _nameController = TextEditingController(text: emp?.name ?? '');
    _mobileController = TextEditingController(text: emp?.mobile ?? '');
    _iqamaController = TextEditingController(text: emp?.iqama ?? '');
    _salaryController = TextEditingController(
        text: emp != null && emp.monthlySalary > 0
            ? emp.monthlySalary.toStringAsFixed(0)
            : '');
    _notesController = TextEditingController(text: emp?.notes ?? '');
    _selectedShop = emp?.shopName;
    _selectedLinkedUserId = emp?.linkedUserId;
    _selectedLinkedUserName = emp?.linkedUserName;
    _attachmentName = emp?.attachmentName;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _mobileController.dispose();
    _iqamaController.dispose();
    _salaryController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickAttachment() async {
    try {
      final result = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['jpg', 'png', 'pdf', 'jpeg'],
      );
      if (result != null && result.files.isNotEmpty) {
        setState(() {
          _attachmentName = result.files.first.name;
        });
      }
    } catch (_) {}
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final salary = double.tryParse(_salaryController.text.trim()) ?? 0.0;
    final now = DateTime.now();

    final item = EmployeeItem(
      id: widget.employeeToEdit?.id ?? 'emp_${now.millisecondsSinceEpoch}',
      name: _nameController.text.trim(),
      shopName: _selectedShop,
      mobile: _mobileController.text.trim(),
      iqama: _iqamaController.text.trim(),
      monthlySalary: salary,
      linkedUserId: _selectedLinkedUserId,
      linkedUserName: _selectedLinkedUserName,
      notes: _notesController.text.trim(),
      attachmentName: _attachmentName,
      totalGiven: widget.employeeToEdit?.totalGiven ?? 0.0,
      totalReceived: widget.employeeToEdit?.totalReceived ?? 0.0,
      createdAt: widget.employeeToEdit?.createdAt ?? now,
    );

    widget.onSave(item);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
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
                      widget.employeeToEdit == null ? 'Add employee' : 'Edit employee',
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

            // Scrollable Form Fields
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Name *
                      _buildFieldLabel('Name *', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _nameController,
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: _inputDecoration('e.g. Morshed', fieldBorder, isDark),
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'Please enter employee name';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Shop Dropdown
                      _buildFieldLabel('Shop', textPrimary),
                      const SizedBox(height: 6),
                      DropdownButtonFormField<String>(
                        initialValue: _selectedShop,
                        isExpanded: true,
                        dropdownColor: bgColor,
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: _inputDecoration('— None —', fieldBorder, isDark),
                        icon: Icon(Icons.keyboard_arrow_down, color: textSecondary),
                        items: [
                          DropdownMenuItem<String>(
                            value: null,
                            child: Text('— None —', style: TextStyle(color: textSecondary)),
                          ),
                          ...EmployeeDummyData.shops.map((s) => DropdownMenuItem<String>(
                                value: s,
                                child: Text(s),
                              )),
                        ],
                        onChanged: (val) => setState(() => _selectedShop = val),
                      ),
                      const SizedBox(height: 16),

                      // Mobile
                      _buildFieldLabel('Mobile', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _mobileController,
                        keyboardType: TextInputType.phone,
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: _inputDecoration('05XXXXXXXX', fieldBorder, isDark),
                      ),
                      const SizedBox(height: 16),

                      // Iqama
                      _buildFieldLabel('Iqama', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _iqamaController,
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: _inputDecoration('ID number', fieldBorder, isDark),
                      ),
                      const SizedBox(height: 16),

                      // Monthly Salary (SAR)
                      _buildFieldLabel('Monthly Salary (SAR)', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _salaryController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: _inputDecoration('e.g. 1500', fieldBorder, isDark),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Used in Profit Summary salary calculation. Does not affect the employee ledger.',
                        style: TextStyle(fontSize: 11, color: textSecondary),
                      ),
                      const SizedBox(height: 16),

                      // Linked Login (for Employee Expense)
                      _buildFieldLabel('Linked Login (for Employee Expense)', textPrimary),
                      const SizedBox(height: 6),
                      DropdownButtonFormField<String>(
                        initialValue: _selectedLinkedUserId,
                        isExpanded: true,
                        dropdownColor: bgColor,
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: _inputDecoration('— Not linked —', fieldBorder, isDark),
                        icon: Icon(Icons.keyboard_arrow_down, color: textSecondary),
                        items: [
                          DropdownMenuItem<String>(
                            value: null,
                            child: Text('— Not linked —', style: TextStyle(color: textSecondary)),
                          ),
                          ...EmployeeDummyData.loginUsers.map((u) => DropdownMenuItem<String>(
                                value: u['id'],
                                child: Text(u['name'] ?? ''),
                              )),
                        ],
                        onChanged: (val) {
                          setState(() {
                            _selectedLinkedUserId = val;
                            _selectedLinkedUserName = EmployeeDummyData.loginUsers
                                .firstWhere((u) => u['id'] == val,
                                    orElse: () => {'name': ''})['name'];
                          });
                        },
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Link this employee to a login user so they can submit their own Employee Expenses.',
                        style: TextStyle(fontSize: 11, color: textSecondary),
                      ),
                      const SizedBox(height: 16),

                      // Notes
                      _buildFieldLabel('Notes', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _notesController,
                        maxLines: 3,
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: _inputDecoration('', fieldBorder, isDark),
                      ),
                      const SizedBox(height: 16),

                      // Attachment (image or PDF)
                      _buildFieldLabel('Attachment (image or PDF)', textPrimary),
                      const SizedBox(height: 6),
                      InkWell(
                        onTap: _pickAttachment,
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: fieldBorder),
                          ),
                          child: Row(
                            children: [
                              const Icon(LucideIcons.paperclip, size: 16, color: Color(0xFF64748B)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _attachmentName ?? 'Choose file',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: _attachmentName != null ? textPrimary : textSecondary,
                                    fontWeight: _attachmentName != null ? FontWeight.w600 : FontWeight.normal,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              if (_attachmentName != null)
                                GestureDetector(
                                  onTap: () => setState(() => _attachmentName = null),
                                  child: const Icon(Icons.close, size: 16, color: Colors.grey),
                                ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Buttons Row
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
                          child: Text(
                            widget.employeeToEdit == null ? 'Add employee' : 'Save Changes',
                            style: const TextStyle(
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
