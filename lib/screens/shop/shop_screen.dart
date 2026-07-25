import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import 'package:intl/intl.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:flutter/services.dart';
import 'package:hive/hive.dart';

import '../../blocs/shop/shop_bloc.dart';
import '../../blocs/shop/shop_event.dart';
import '../../blocs/shop/shop_state.dart';
import '../../blocs/working_date/working_date_cubit.dart';
import '../../models/shop_model.dart';
import '../../models/cashier_model.dart';
import '../../models/shop_entry_model.dart';
import '../../core/theme/app_colors.dart';
import '../../repositories/shop_repository.dart';

class ShopScreen extends StatefulWidget {
  const ShopScreen({super.key});

  @override
  State<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> with TickerProviderStateMixin {
  late TabController _formTabController;
  final _formKey = GlobalKey<FormState>();

  // Date and filter states
  String _dateRange =
      'month'; // 'today' | 'yesterday' | 'week' | 'month' | 'custom'
  DateTime? _customFrom;
  DateTime? _customTo;
  String _shopFilter = 'all'; // 'all' | shopId
  final List<String> _activeFilters = []; // Multi-select filters

  // Entry Form Sheet states
  String? _formShopId;
  String? _selectedCashierId;
  DateTime _formDate = DateTime.now();
  double? _ocrDetectedTotal;
  bool _ocrMismatchAck = false;
  ShopEntryModel? _editingEntry;
  bool _isOcrScanning = false;

  // Form Field Controllers
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

  // Pagination states
  int _visibleCount = 20;

  // Local copy of cashiers & shops for duplicate check
  List<CashierModel> _cashiers = [];
  List<ShopModel> _shops = [];
  List<ShopEntryModel> _allEntries = [];

  @override
  void initState() {
    super.initState();
    _formTabController = TabController(length: 4, vsync: this);

    // Listen to amount controller changes to rebuild calculations reactively
    _posSaleController.addListener(() => setState(() {}));
    _cashSaleController.addListener(() => setState(() {}));
    _bankSaleController.addListener(() => setState(() {}));
    _creditSaleController.addListener(() => setState(() {}));
    _dueReceivableController.addListener(() => setState(() {}));
    _purchaseController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _formTabController.dispose();
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

  void _clearForm() {
    _editingEntry = null;
    _selectedCashierId = null;
    _ocrDetectedTotal = null;
    _ocrMismatchAck = false;
    _isOcrScanning = false;
    _posSaleController.clear();
    _cashSaleController.clear();
    _bankSaleController.clear();
    _creditSaleController.clear();
    _dueReceivableController.clear();
    _purchaseController.clear();
    _expenseController.clear();
    _withdrawController.clear();
    _notesController.clear();
    _attachmentController.clear();
  }

  // --- Helper Methods ---

  String _formatCurrency(double val) {
    return '${val.toStringAsFixed(2)} SAR';
  }

  String _formatDateString(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }

  // Calculate dates range
  DateRangeBounds _getDateRangeBounds(DateTime workingDate) {
    final now = DateTime(workingDate.year, workingDate.month, workingDate.day);
    switch (_dateRange) {
      case 'today':
        return DateRangeBounds(from: now, to: now);
      case 'yesterday':
        final yesterday = now.subtract(const Duration(days: 1));
        return DateRangeBounds(from: yesterday, to: yesterday);
      case 'week':
        final weekStart = now.subtract(const Duration(days: 6));
        return DateRangeBounds(from: weekStart, to: now);
      case 'month':
        final monthStart = DateTime(now.year, now.month, 1);
        return DateRangeBounds(from: monthStart, to: now);
      case 'custom':
        return DateRangeBounds(from: _customFrom ?? now, to: _customTo ?? now);
      default:
        return DateRangeBounds(from: now, to: now);
    }
  }

  DuplicateEntry? _findDuplicate({
    required String shopId,
    required DateTime date,
    required String type,
    String? cashierId,
    required double withdrawAmt,
  }) {
    final dateStr = _formatDateString(date);
    final excludeId = _editingEntry?.id;

    if (type == 'sale') {
      if (cashierId == null) return null;
      for (final e in _allEntries) {
        if (e.id != excludeId &&
            e.shopId == shopId &&
            _formatDateString(e.txnDate) == dateStr &&
            e.cashierId == cashierId &&
            e.entryType == 'sale') {
          final cName = _cashiers
              .firstWhere(
                (c) => c.id == cashierId,
                orElse: () => CashierModel(id: '', name: 'Unknown', shopId: ''),
              )
              .name;
          final amt = e.posSale + e.cashSale + e.bankSale + e.creditSale;
          return DuplicateEntry(
            isHard: true,
            label: 'Sale · $cName · $dateStr',
            message:
                'A sale record already exists for cashier "$cName" on $dateStr.',
            amount: amt,
            existingEntry: e,
          );
        }
      }
    } else if (type == 'purchase') {
      for (final e in _allEntries) {
        if (e.id != excludeId &&
            e.shopId == shopId &&
            _formatDateString(e.txnDate) == dateStr &&
            e.entryType == 'purchase') {
          final sName = _shops
              .firstWhere(
                (s) => s.id == shopId,
                orElse: () => ShopModel(
                  id: '',
                  name: 'Unknown',
                  createdAt: DateTime.now(),
                ),
              )
              .name;
          return DuplicateEntry(
            isHard: true,
            label: 'Purchase · $sName · $dateStr',
            message:
                'A purchase invoice already exists for "$sName" on $dateStr.',
            amount: e.purchaseAmount,
            existingEntry: e,
          );
        }
      }
    } else if (type == 'withdraw') {
      if (withdrawAmt <= 0) return null;
      for (final e in _allEntries) {
        if (e.id != excludeId &&
            e.entryType == 'withdraw' &&
            _formatDateString(e.txnDate) == dateStr &&
            e.withdrawAmount == withdrawAmt) {
          final sName = _shops
              .firstWhere(
                (s) => s.id == e.shopId,
                orElse: () => ShopModel(
                  id: '',
                  name: 'Unknown',
                  createdAt: DateTime.now(),
                ),
              )
              .name;
          return DuplicateEntry(
            isHard: false,
            label: 'Withdraw · ${_formatCurrency(withdrawAmt)} · $dateStr',
            message:
                'Another withdrawal with matching amount (${_formatCurrency(withdrawAmt)}) exists on $dateStr for "$sName".',
            amount: withdrawAmt,
            existingEntry: e,
          );
        }
      }
    }
    return null;
  }

  void _showDuplicateWarning(DuplicateEntry dup, VoidCallback onConfirm) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          title: Row(
            children: [
              Icon(
                dup.isHard ? LucideIcons.alertTriangle : LucideIcons.info,
                color: dup.isHard ? AppColors.destructive : AppColors.warning,
                size: 28,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  dup.isHard
                      ? 'Double Entry Blocked'
                      : 'Matching Transfer Found',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 18,
                  ),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                dup.message,
                style: const TextStyle(fontSize: 14, height: 1.4),
              ),
              const SizedBox(height: 20),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.warning.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppColors.warning.withValues(alpha: 0.25),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          LucideIcons.fileText,
                          size: 14,
                          color: AppColors.warning.withValues(alpha: 0.8),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          'Existing Record Details:',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: AppColors.warning,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Label: ${dup.label}',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Amount: ${_formatCurrency(dup.amount)}',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (dup.existingEntry.notes != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        'Notes: ${dup.existingEntry.notes}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text(
                'Cancel',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            TextButton(
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
              ),
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context); // Close the form
                _showEntryDetails(dup.existingEntry);
              },
              child: const Text(
                'View Existing',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            if (!dup.isHard)
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.warning,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 10,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () {
                  Navigator.pop(context);
                  onConfirm();
                },
                child: const Text(
                  'Save Anyway',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
          ],
        );
      },
    );
  }

  void _submitForm(String defaultShopId) {
    if (_formKey.currentState!.validate()) {
      final shopId = _formShopId ?? defaultShopId;
      final selectedShop = _shops.firstWhere(
        (s) => s.id == shopId,
        orElse: () =>
            ShopModel(id: '', name: 'Unknown', createdAt: DateTime.now()),
      );
      final simple = selectedShop.shopType == 'simple_cash';

      final tabIndex = _formTabController.index;
      String type = 'sale';
      double posSale = 0.0;
      double cashSale = 0.0;
      double bankSale = 0.0;
      double creditSale = 0.0;
      double dueReceivable = 0.0;
      double purchaseAmount = 0.0;
      double expenseAmount = 0.0;
      double withdrawAmount = 0.0;

      if (simple) {
        if (tabIndex == 0) {
          type = 'sale';
          cashSale = double.tryParse(_cashSaleController.text) ?? 0.0;
        } else {
          type = 'expense';
          expenseAmount = double.tryParse(_expenseController.text) ?? 0.0;
        }
      } else {
        if (tabIndex == 0) {
          type = 'sale';
          posSale = double.tryParse(_posSaleController.text) ?? 0.0;
          cashSale = double.tryParse(_cashSaleController.text) ?? 0.0;
          bankSale = double.tryParse(_bankSaleController.text) ?? 0.0;
          creditSale = double.tryParse(_creditSaleController.text) ?? 0.0;
          dueReceivable = double.tryParse(_dueReceivableController.text) ?? 0.0;
        } else if (tabIndex == 1) {
          type = 'purchase';
          purchaseAmount = double.tryParse(_purchaseController.text) ?? 0.0;
        } else if (tabIndex == 2) {
          type = 'expense';
          expenseAmount = double.tryParse(_expenseController.text) ?? 0.0;
        } else if (tabIndex == 3) {
          type = 'withdraw';
          withdrawAmount = double.tryParse(_withdrawController.text) ?? 0.0;
        }
      }

      // Notes validation
      if (type != 'sale' && _notesController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Notes description is required for purchases, expenses, and withdrawals.',
            ),
          ),
        );
        return;
      }

      // OCR Mismatch validation
      if (type == 'purchase' && _ocrDetectedTotal != null && !_ocrMismatchAck) {
        final diff = (purchaseAmount - _ocrDetectedTotal!).abs();
        if (diff > 1.0) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                'OCR total mismatch! Review comparison card and verify match.',
              ),
            ),
          );
          return;
        }
      }

      // Check duplicates
      final duplicate = _findDuplicate(
        shopId: shopId,
        date: _formDate,
        type: type,
        cashierId: _selectedCashierId,
        withdrawAmt: withdrawAmount,
      );

      final saveCallback = () {
        final totalSale = cashSale + bankSale + creditSale - dueReceivable;
        final diff = type == 'sale' ? (totalSale - posSale) : 0.0;

        final updatedOrNew = ShopEntryModel(
          id: _editingEntry?.id ?? const Uuid().v4(),
          shopId: shopId,
          cashierId: type == 'sale' ? _selectedCashierId : null,
          entryType: type,
          posSale: posSale,
          cashSale: cashSale,
          bankSale: bankSale,
          creditSale: creditSale,
          dueReceivable: dueReceivable,
          difference: diff,
          purchaseAmount: purchaseAmount,
          expenseAmount: expenseAmount,
          withdrawAmount: withdrawAmount,
          notes: _notesController.text.trim().isEmpty
              ? null
              : _notesController.text.trim(),
          attachmentUrl: _attachmentController.text.trim().isEmpty
              ? null
              : _attachmentController.text.trim(),
          txnDate: _formDate,
          createdAt: _editingEntry?.createdAt ?? DateTime.now(),
        );

        if (_editingEntry != null) {
          context.read<ShopBloc>().add(UpdateEntry(updatedOrNew));
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Entry updated successfully.')),
          );
        } else {
          context.read<ShopBloc>().add(AddEntry(updatedOrNew));
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Entry saved to database.')),
          );
        }

        Navigator.pop(context); // Close the sheet
        _clearForm();
      };

      if (duplicate != null) {
        _showDuplicateWarning(duplicate, saveCallback);
      } else {
        saveCallback();
      }
    }
  }

  void _triggerSimulatedOCR(StateSetter setSheetState) {
    setSheetState(() {
      _isOcrScanning = true;
    });

    Future.delayed(const Duration(seconds: 1500 ~/ 1000), () {
      if (!mounted) return;
      setSheetState(() {
        _isOcrScanning = false;
        _ocrDetectedTotal = 845.50;
        _purchaseController.text = '845.50';
        _notesController.text =
            'Simulated OCR Purchase Scan - Packaging & Staples (Gemini OCR Match)';
        _attachmentController.text = 'receipt_invoice_845.jpg';
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Receipt scan successful! OCR fields pre-filled.'),
        ),
      );
    });
  }

  // --- UI Presentation Builders ---

  void _showEntryDetails(ShopEntryModel entry) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final shop = _shops.firstWhere(
      (s) => s.id == entry.shopId,
      orElse: () =>
          ShopModel(id: '', name: 'Unknown', createdAt: DateTime.now()),
    );
    final cashier = entry.cashierId != null
        ? _cashiers.firstWhere(
            (c) => c.id == entry.cashierId,
            orElse: () => CashierModel(id: '', name: 'Unknown', shopId: ''),
          )
        : null;

    final isOut = entry.entryType != 'sale';
    double totalAmount = 0.0;
    if (entry.entryType == 'sale') {
      totalAmount =
          entry.cashSale +
          entry.bankSale +
          entry.creditSale -
          entry.dueReceivable;
    } else if (entry.entryType == 'purchase') {
      totalAmount = entry.purchaseAmount;
    } else if (entry.entryType == 'expense') {
      totalAmount = entry.expenseAmount;
    } else if (entry.entryType == 'withdraw') {
      totalAmount = entry.withdrawAmount;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
          backgroundColor: isDark ? AppColors.cardDark : Colors.white,
          clipBehavior: Clip.antiAlias,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Banner
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 22,
                  ),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: isOut
                          ? [AppColors.destructive, const Color(0xFFC026D3)]
                          : [AppColors.primary, AppColors.primaryGlow],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              entry.entryType.toUpperCase(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.5,
                              ),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            shop.name,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(LucideIcons.x, color: Colors.white),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),

                // Details Content
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Overview values
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildDetailField(
                            'DATE',
                            _formatDateString(entry.txnDate),
                          ),
                          _buildDetailField(
                            'TOTAL VALUE',
                            _formatCurrency(totalAmount),
                            isBold: true,
                            primaryColor: true,
                          ),
                        ],
                      ),
                      if (cashier != null) ...[
                        const SizedBox(height: 16),
                        _buildDetailField('ASSIGNED CASHIER', cashier.name),
                      ],
                      const Divider(height: 32),

                      // Sales fields breakdown
                      if (entry.entryType == 'sale') ...[
                        _buildDetailRow(
                          'POS Z-Report Value',
                          _formatCurrency(entry.posSale),
                        ),
                        _buildDetailRow(
                          'Physical Cash Drawer',
                          _formatCurrency(entry.cashSale),
                        ),
                        _buildDetailRow(
                          'Bank Card Sales',
                          _formatCurrency(entry.bankSale),
                        ),
                        _buildDetailRow(
                          'Credit Sale / Baki',
                          _formatCurrency(entry.creditSale),
                        ),
                        _buildDetailRow(
                          'Old Due Collection',
                          _formatCurrency(entry.dueReceivable),
                        ),
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 8.0),
                          child: Divider(height: 1),
                        ),
                        _buildDetailRow(
                          'Calculated Net Sale',
                          _formatCurrency(totalAmount),
                          isBold: true,
                        ),
                        _buildDetailRow(
                          'Discrepancy (Plus / Minus)',
                          '${entry.difference >= 0 ? "+" : ""}${entry.difference.toStringAsFixed(2)} SAR',
                          isBold: true,
                          color: entry.difference == 0
                              ? Colors.grey
                              : entry.difference > 0
                              ? AppColors.success
                              : AppColors.destructive,
                        ),
                      ] else if (entry.entryType == 'purchase') ...[
                        _buildDetailRow(
                          'Purchase Value',
                          _formatCurrency(entry.purchaseAmount),
                        ),
                      ] else if (entry.entryType == 'expense') ...[
                        _buildDetailRow(
                          'Expense Value',
                          _formatCurrency(entry.expenseAmount),
                        ),
                      ] else if (entry.entryType == 'withdraw') ...[
                        _buildDetailRow(
                          'Transfer Withdraw',
                          _formatCurrency(entry.withdrawAmount),
                        ),
                      ],

                      const Divider(height: 32),
                      const Row(
                        children: [
                          Icon(
                            LucideIcons.fileText,
                            size: 14,
                            color: Colors.grey,
                          ),
                          SizedBox(width: 6),
                          Text(
                            'REMARKS / DESCRIPTION',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                              color: Colors.grey,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isDark
                              ? AppColors.inputDark
                              : AppColors.inputLight,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isDark
                                ? AppColors.borderDark
                                : AppColors.borderLight,
                          ),
                        ),
                        child: Text(
                          entry.notes ?? 'No description remarks entered.',
                          style: TextStyle(
                            fontSize: 13,
                            color: isDark ? Colors.white70 : Colors.black87,
                            height: 1.4,
                          ),
                        ),
                      ),

                      if (entry.attachmentUrl != null) ...[
                        const SizedBox(height: 20),
                        const Row(
                          children: [
                            Icon(
                              LucideIcons.paperclip,
                              size: 14,
                              color: Colors.grey,
                            ),
                            SizedBox(width: 6),
                            Text(
                              'ATTACHMENT SLIP',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 11,
                                color: Colors.grey,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: AppColors.primary.withValues(alpha: 0.3),
                            ),
                            color: AppColors.primary.withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                LucideIcons.image,
                                size: 16,
                                color: AppColors.primary,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  entry.attachmentUrl!,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],

                      const SizedBox(height: 32),
                      // Actions row
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                side: BorderSide(
                                  color: isDark
                                      ? AppColors.borderDark
                                      : AppColors.borderLight,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              icon: const Icon(LucideIcons.pencil, size: 14),
                              label: const Text('Edit Entry'),
                              onPressed: () {
                                Navigator.pop(context);
                                _showEntryFormSheet(shop.id, entry: entry);
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.destructive
                                    .withValues(alpha: 0.1),
                                foregroundColor: AppColors.destructive,
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              icon: const Icon(LucideIcons.trash2, size: 14),
                              label: const Text('Delete'),
                              onPressed: () {
                                _confirmDelete(entry.id);
                              },
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _confirmDelete(String entryId) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Text(
            'Move to Recycle Bin?',
            style: TextStyle(fontWeight: FontWeight.w900),
          ),
          content: const Text(
            'This entry will be marked as deleted. Shop summary balances will recalculate immediately.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.destructive,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                context.read<ShopBloc>().add(DeleteEntry(entryId));
                Navigator.pop(context); // Close confirm
                Navigator.pop(context); // Close detail
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Entry moved to Recycle Bin.')),
                );
              },
              child: const Text('Delete Entry'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildDetailField(
    String label,
    String val, {
    bool isBold = false,
    bool primaryColor = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            color: Colors.grey,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          val,
          style: TextStyle(
            fontSize: isBold ? 16 : 14,
            fontWeight: isBold ? FontWeight.w900 : FontWeight.w600,
            color: primaryColor ? AppColors.primary : null,
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(
    String label,
    String val, {
    bool isBold = false,
    Color? color,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            val,
            style: TextStyle(
              fontSize: 13,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  void _showEntryFormSheet(String defaultShopId, {ShopEntryModel? entry}) {
    _clearForm();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (entry != null) {
      _editingEntry = entry;
      _formShopId = entry.shopId;
      _formDate = entry.txnDate;
      _selectedCashierId = entry.cashierId;

      _posSaleController.text = entry.posSale > 0
          ? entry.posSale.toString()
          : '';
      _cashSaleController.text = entry.cashSale > 0
          ? entry.cashSale.toString()
          : '';
      _bankSaleController.text = entry.bankSale > 0
          ? entry.bankSale.toString()
          : '';
      _creditSaleController.text = entry.creditSale > 0
          ? entry.creditSale.toString()
          : '';
      _dueReceivableController.text = entry.dueReceivable > 0
          ? entry.dueReceivable.toString()
          : '';
      _purchaseController.text = entry.purchaseAmount > 0
          ? entry.purchaseAmount.toString()
          : '';
      _expenseController.text = entry.expenseAmount > 0
          ? entry.expenseAmount.toString()
          : '';
      _withdrawController.text = entry.withdrawAmount > 0
          ? entry.withdrawAmount.toString()
          : '';
      _notesController.text = entry.notes ?? '';
      _attachmentController.text = entry.attachmentUrl ?? '';

      final activeShop = _shops.firstWhere(
        (s) => s.id == entry.shopId,
        orElse: () => ShopModel(id: '', name: '', createdAt: DateTime.now()),
      );
      final simple = activeShop.shopType == 'simple_cash';

      int tabIdx = 0;
      if (simple) {
        tabIdx = entry.entryType == 'sale' ? 0 : 1;
      } else {
        if (entry.entryType == 'sale') tabIdx = 0;
        if (entry.entryType == 'purchase') tabIdx = 1;
        if (entry.entryType == 'expense') tabIdx = 2;
        if (entry.entryType == 'withdraw') tabIdx = 3;
      }
      _formTabController.index = tabIdx;
    } else {
      _formShopId = defaultShopId;
      _formDate = DateTime.now();
      _formTabController.index = 0;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: isDark ? AppColors.bgDark : AppColors.bgLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setSheetState) {
            final activeShopId = _formShopId ?? defaultShopId;
            final shop = _shops.firstWhere(
              (s) => s.id == activeShopId,
              orElse: () =>
                  ShopModel(id: '', name: 'Unknown', createdAt: DateTime.now()),
            );
            final simpleMode = shop.shopType == 'simple_cash';
            final filteredCashiers = _cashiers
                .where((c) => c.shopId == activeShopId)
                .toList();

            // Perform calculations
            final posVal = double.tryParse(_posSaleController.text) ?? 0.0;
            final cashVal = double.tryParse(_cashSaleController.text) ?? 0.0;
            final bankVal = double.tryParse(_bankSaleController.text) ?? 0.0;
            final creditVal =
                double.tryParse(_creditSaleController.text) ?? 0.0;
            final dueVal =
                double.tryParse(_dueReceivableController.text) ?? 0.0;

            final totalSale = cashVal + bankVal + creditVal - dueVal;
            final diff = totalSale - posVal;

            // Form Validation helper
            String? numberValidator(String? val, bool isReq) {
              if (isReq) {
                if (val == null ||
                    double.tryParse(val) == null ||
                    double.parse(val) <= 0) {
                  return 'Enter valid positive number';
                }
              }
              return null;
            }

            return Container(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              height: MediaQuery.of(context).size.height * 0.88,
              child: Column(
                children: [
                  // Pull indicator and Title
                  Padding(
                    padding: const EdgeInsets.only(top: 14, bottom: 8),
                    child: Container(
                      height: 5,
                      width: 50,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 8,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _editingEntry != null
                                  ? 'Edit Transaction'
                                  : 'Record New Entry',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              shop.name.toUpperCase(),
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.0,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.grey.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            icon: const Icon(LucideIcons.x, size: 18),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),

                  // Scrollable form contents
                  Expanded(
                    child: Form(
                      key: _formKey,
                      child: ListView(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        children: [
                          // Date and Shop Selection Card
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.cardDark : Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isDark
                                    ? AppColors.borderDark
                                    : AppColors.borderLight,
                              ),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'DATE SELECTION',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 10,
                                          color: Colors.grey,
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      InkWell(
                                        onTap: () async {
                                          final picked = await showDatePicker(
                                            context: context,
                                            initialDate: _formDate,
                                            firstDate: DateTime(2020),
                                            lastDate: DateTime(2100),
                                          );
                                          if (picked != null) {
                                            setSheetState(() {
                                              _formDate = picked;
                                            });
                                          }
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 12,
                                          ),
                                          decoration: BoxDecoration(
                                            color: isDark
                                                ? AppColors.inputDark
                                                : AppColors.inputLight,
                                            border: Border.all(
                                              color: isDark
                                                  ? AppColors.borderDark
                                                  : AppColors.borderLight,
                                            ),
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                          ),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                _formatDateString(_formDate),
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 13,
                                                ),
                                              ),
                                              const Icon(
                                                LucideIcons.calendar,
                                                size: 16,
                                                color: Colors.grey,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'OUTLET SHOP',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 10,
                                          color: Colors.grey,
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      DropdownButtonFormField<String>(
                                        value: activeShopId,
                                        isExpanded: true,
                                        style: TextStyle(
                                          color: isDark
                                              ? Colors.white
                                              : Colors.black,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                        ),
                                        decoration: InputDecoration(
                                          fillColor: isDark
                                              ? AppColors.inputDark
                                              : AppColors.inputLight,
                                          filled: true,
                                          contentPadding:
                                              const EdgeInsets.symmetric(
                                                horizontal: 12,
                                                vertical: 12,
                                              ),
                                          border: OutlineInputBorder(
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                            borderSide: BorderSide(
                                              color: isDark
                                                  ? AppColors.borderDark
                                                  : AppColors.borderLight,
                                            ),
                                          ),
                                          enabledBorder: OutlineInputBorder(
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                            borderSide: BorderSide(
                                              color: isDark
                                                  ? AppColors.borderDark
                                                  : AppColors.borderLight,
                                            ),
                                          ),
                                        ),
                                        items: _shops.map((s) {
                                          return DropdownMenuItem(
                                            value: s.id,
                                            child: Text(
                                              s.name,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          );
                                        }).toList(),
                                        onChanged: (val) {
                                          if (val != null) {
                                            setSheetState(() {
                                              _formShopId = val;
                                              _selectedCashierId = null;

                                              final nextShop = _shops
                                                  .firstWhere(
                                                    (s) => s.id == val,
                                                  );
                                              final isNextSimple =
                                                  nextShop.shopType ==
                                                  'simple_cash';
                                              if (isNextSimple &&
                                                  _formTabController.index >
                                                      1) {
                                                _formTabController.index = 0;
                                              }
                                            });
                                            setState(() {
                                              _formShopId = val;
                                            });
                                          }
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Tab bar styled container
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.cardDark : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isDark
                                    ? AppColors.borderDark
                                    : AppColors.borderLight,
                              ),
                            ),
                            child: TabBar(
                              controller: _formTabController,
                              indicator: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              indicatorSize: TabBarIndicatorSize.tab,
                              dividerColor: Colors.transparent,
                              labelColor: Colors.white,
                              unselectedLabelColor: Colors.grey,
                              labelStyle: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                              unselectedLabelStyle: const TextStyle(
                                fontWeight: FontWeight.normal,
                                fontSize: 12,
                              ),
                              tabs: simpleMode
                                  ? const [
                                      Tab(text: 'Cash In'),
                                      Tab(text: 'Expense'),
                                    ]
                                  : const [
                                      Tab(text: 'Sales'),
                                      Tab(text: 'Purchase'),
                                      Tab(text: 'Expense'),
                                      Tab(text: 'Withdraw'),
                                    ],
                              onTap: (idx) {
                                setSheetState(() {});
                              },
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Dynamic Form fields depending on active tab
                          if (_formTabController.index == 0) ...[
                            if (simpleMode) ...[
                              _buildFormField(
                                controller: _cashSaleController,
                                label: 'CASH IN AMOUNT',
                                isDark: isDark,
                                validator: (val) => numberValidator(val, true),
                              ),
                            ] else ...[
                              // Full ERP Sales fields
                              const Text(
                                'CASHIER ACCOUNT',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 10,
                                  color: Colors.grey,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 8),
                              DropdownButtonFormField<String>(
                                value: _selectedCashierId,
                                isExpanded: true,
                                style: TextStyle(
                                  color: isDark ? Colors.white : Colors.black,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                                hint: const Text(
                                  'Assign Cashier Account...',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                                decoration: InputDecoration(
                                  fillColor: isDark
                                      ? AppColors.inputDark
                                      : AppColors.inputLight,
                                  filled: true,
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 12,
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: isDark
                                          ? AppColors.borderDark
                                          : AppColors.borderLight,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: isDark
                                          ? AppColors.borderDark
                                          : AppColors.borderLight,
                                    ),
                                  ),
                                ),
                                items: filteredCashiers.map((c) {
                                  return DropdownMenuItem(
                                    value: c.id,
                                    child: Text(c.name),
                                  );
                                }).toList(),
                                onChanged: (val) {
                                  setSheetState(() {
                                    _selectedCashierId = val;
                                  });
                                },
                              ),
                              const SizedBox(height: 20),
                              Row(
                                children: [
                                  Expanded(
                                    child: _buildFormField(
                                      controller: _posSaleController,
                                      label: 'POS CARD TOTAL',
                                      isDark: isDark,
                                      hint: 'Z-Report cash sum',
                                      validator: (val) =>
                                          numberValidator(val, false),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: _buildFormField(
                                      controller: _cashSaleController,
                                      label: 'CASH DRAWER TOTAL',
                                      isDark: isDark,
                                      hint: 'Physical cash drawer',
                                      validator: (val) =>
                                          numberValidator(val, false),
                                    ),
                                  ),
                                ],
                              ),
                              Row(
                                children: [
                                  Expanded(
                                    child: _buildFormField(
                                      controller: _bankSaleController,
                                      label: 'BANK SALES TRANSFER',
                                      isDark: isDark,
                                      hint: 'Direct bank payments',
                                      validator: (val) =>
                                          numberValidator(val, false),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: _buildFormField(
                                      controller: _creditSaleController,
                                      label: 'CREDIT SALE / BAKI',
                                      isDark: isDark,
                                      hint: 'Customer credit sum',
                                      validator: (val) =>
                                          numberValidator(val, false),
                                    ),
                                  ),
                                ],
                              ),
                              _buildFormField(
                                controller: _dueReceivableController,
                                label: 'DUE CASH RECEIVED',
                                isDark: isDark,
                                hint: 'Collection of old dues',
                                validator: (val) => numberValidator(val, false),
                              ),

                              // Interactive Total Card
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [
                                      Color(0xFF0F766E),
                                      Color(0xFF0D9488),
                                    ],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(
                                        0xFF0D9488,
                                      ).withValues(alpha: 0.25),
                                      blurRadius: 12,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Row(
                                      children: [
                                        Icon(
                                          LucideIcons.info,
                                          size: 18,
                                          color: Colors.white,
                                        ),
                                        SizedBox(width: 10),
                                        Text(
                                          'Calculated Net Sale:',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Text(
                                      _formatCurrency(totalSale),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w900,
                                        fontSize: 16,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 12),

                              // Diff discrepancy card
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: diff == 0
                                      ? Colors.grey.withValues(alpha: 0.1)
                                      : diff > 0
                                      ? AppColors.success.withValues(alpha: 0.1)
                                      : AppColors.destructive.withValues(
                                          alpha: 0.1,
                                        ),
                                  border: Border.all(
                                    color: diff == 0
                                        ? Colors.grey.withValues(alpha: 0.3)
                                        : diff > 0
                                        ? AppColors.success.withValues(
                                            alpha: 0.3,
                                          )
                                        : AppColors.destructive.withValues(
                                            alpha: 0.3,
                                          ),
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        Icon(
                                          diff == 0
                                              ? LucideIcons.checkCircle
                                              : diff > 0
                                              ? LucideIcons.plusCircle
                                              : LucideIcons.minusCircle,
                                          size: 16,
                                          color: diff == 0
                                              ? Colors.grey
                                              : diff > 0
                                              ? AppColors.success
                                              : AppColors.destructive,
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          diff == 0
                                              ? 'POS Match Status: Perfect'
                                              : diff > 0
                                              ? 'Discrepancy: Cash Surplus'
                                              : 'Discrepancy: Cash Shortage',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 12,
                                            color: diff == 0
                                                ? Colors.grey
                                                : diff > 0
                                                ? AppColors.success
                                                : AppColors.destructive,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Text(
                                      '${diff >= 0 ? "+" : ""}${diff.toStringAsFixed(2)} SAR',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                        color: diff == 0
                                            ? Colors.grey
                                            : diff > 0
                                            ? AppColors.success
                                            : AppColors.destructive,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ] else if (_formTabController.index == 1 &&
                              !simpleMode) ...[
                            // Tab 1: Purchase (Full ERP)
                            _buildFormField(
                              controller: _purchaseController,
                              label: 'PURCHASE INVOICE AMOUNT',
                              isDark: isDark,
                              hint: 'SAR amount paid',
                              validator: (val) => numberValidator(val, true),
                            ),
                            const SizedBox(height: 8),

                            // Mock OCR scanner visual block
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? AppColors.cardDark
                                    : Colors.white,
                                border: Border.all(
                                  color: isDark
                                      ? AppColors.borderDark
                                      : AppColors.borderLight,
                                ),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(
                                        LucideIcons.sparkles,
                                        size: 16,
                                        color: AppColors.primary,
                                      ),
                                      const SizedBox(width: 8),
                                      const Text(
                                        'Simulated AI Receipt OCR Scanner',
                                        style: TextStyle(
                                          fontWeight: FontWeight.w900,
                                          fontSize: 13,
                                        ),
                                      ),
                                      if (_isOcrScanning) ...[
                                        const SizedBox(width: 8),
                                        const SizedBox(
                                          height: 12,
                                          width: 12,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            color: AppColors.primary,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  const Text(
                                    'Mock scan will auto-fill receipt totals and invoice tags using simulated Gemini analysis.',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Colors.grey,
                                      height: 1.3,
                                    ),
                                  ),
                                  const SizedBox(height: 14),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: AppColors.primary,
                                            foregroundColor: Colors.white,
                                            elevation: 0,
                                            padding: const EdgeInsets.symmetric(
                                              vertical: 12,
                                            ),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                          ),
                                          icon: const Icon(
                                            LucideIcons.camera,
                                            size: 14,
                                          ),
                                          label: const Text(
                                            'Camera',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          onPressed: _isOcrScanning
                                              ? null
                                              : () => _triggerSimulatedOCR(
                                                  setSheetState,
                                                ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: AppColors.primary
                                                .withValues(alpha: 0.1),
                                            foregroundColor: AppColors.primary,
                                            elevation: 0,
                                            padding: const EdgeInsets.symmetric(
                                              vertical: 12,
                                            ),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                          ),
                                          icon: const Icon(
                                            LucideIcons.image,
                                            size: 14,
                                          ),
                                          label: const Text(
                                            'Gallery',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          onPressed: _isOcrScanning
                                              ? null
                                              : () => _triggerSimulatedOCR(
                                                  setSheetState,
                                                ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: AppColors.primary
                                                .withValues(alpha: 0.1),
                                            foregroundColor: AppColors.primary,
                                            elevation: 0,
                                            padding: const EdgeInsets.symmetric(
                                              vertical: 12,
                                            ),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                          ),
                                          icon: const Icon(
                                            LucideIcons.fileText,
                                            size: 14,
                                          ),
                                          label: const Text(
                                            'PDF Slip',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          onPressed: _isOcrScanning
                                              ? null
                                              : () => _triggerSimulatedOCR(
                                                  setSheetState,
                                                ),
                                        ),
                                      ),
                                    ],
                                  ),

                                  if (_ocrDetectedTotal != null) ...[
                                    const SizedBox(height: 14),
                                    Container(
                                      padding: const EdgeInsets.all(14),
                                      decoration: BoxDecoration(
                                        color: Colors.teal.withValues(
                                          alpha: 0.08,
                                        ),
                                        borderRadius: BorderRadius.circular(14),
                                        border: Border.all(
                                          color: Colors.teal.withValues(
                                            alpha: 0.25,
                                          ),
                                        ),
                                      ),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          const Row(
                                            children: [
                                              Icon(
                                                LucideIcons.checkSquare,
                                                size: 14,
                                                color: Colors.teal,
                                              ),
                                              SizedBox(width: 6),
                                              Text(
                                                'OCR Detection Verified:',
                                                style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 11,
                                                  color: Colors.teal,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            'Detected Total: ${_formatCurrency(_ocrDetectedTotal!)}',
                                            style: const TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          Text(
                                            'Current Input Value: ${_formatCurrency(double.tryParse(_purchaseController.text) ?? 0.0)}',
                                            style: const TextStyle(
                                              fontSize: 11,
                                              color: Colors.grey,
                                            ),
                                          ),
                                          const SizedBox(height: 10),
                                          InkWell(
                                            onTap: () {
                                              setSheetState(() {
                                                _ocrMismatchAck =
                                                    !_ocrMismatchAck;
                                              });
                                            },
                                            child: Row(
                                              children: [
                                                Icon(
                                                  _ocrMismatchAck
                                                      ? LucideIcons.checkCircle
                                                      : LucideIcons.circle,
                                                  size: 16,
                                                  color: _ocrMismatchAck
                                                      ? Colors.teal
                                                      : Colors.grey,
                                                ),
                                                const SizedBox(width: 8),
                                                const Expanded(
                                                  child: Text(
                                                    'Verify visual match and check manual confirmation.',
                                                    style: TextStyle(
                                                      fontSize: 11,
                                                      fontWeight:
                                                          FontWeight.w500,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ] else if ((_formTabController.index == 2 &&
                                  !simpleMode) ||
                              (_formTabController.index == 1 &&
                                  simpleMode)) ...[
                            // Tab 2: Expense (Full) or Tab 1: Expense (Simple)
                            _buildFormField(
                              controller: _expenseController,
                              label: 'EXPENSE VALUE',
                              isDark: isDark,
                              hint: 'SAR amount spent',
                              validator: (val) => numberValidator(val, true),
                            ),
                          ] else if (_formTabController.index == 3 &&
                              !simpleMode) ...[
                            // Tab 3: Withdraw (Full ERP)
                            _buildFormField(
                              controller: _withdrawController,
                              label: 'CASH WITHDRAWAL TRANSFER',
                              isDark: isDark,
                              hint: 'Transfer amount sent',
                              validator: (val) => numberValidator(val, true),
                            ),
                          ],

                          const SizedBox(height: 20),
                          // Notes description (required for non-sales)
                          _buildFormField(
                            controller: _notesController,
                            label: 'REMARKS / DESCRIPTION',
                            isDark: isDark,
                            hint: 'Entry references & annotations...',
                            maxLines: 2,
                            validator: (val) {
                              final activeIndex = _formTabController.index;
                              final isSale = simpleMode
                                  ? (activeIndex == 0)
                                  : (activeIndex == 0);
                              if (!isSale &&
                                  (val == null || val.trim().isEmpty)) {
                                return 'Description note is required for tracking.';
                              }
                              return null;
                            },
                          ),

                          const SizedBox(height: 12),
                          // Attachment (Optional)
                          _buildFormField(
                            controller: _attachmentController,
                            label: 'ATTACHMENT LINK (OPTIONAL)',
                            isDark: isDark,
                            hint: 'e.g. invoice_slip_scan.jpg',
                          ),

                          const SizedBox(height: 32),
                          // Action submit button
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              minimumSize: const Size.fromHeight(52),
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              elevation: 2,
                              shadowColor: AppColors.primary.withValues(
                                alpha: 0.3,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            onPressed: () {
                              _submitForm(defaultShopId);
                            },
                            child: Text(
                              _editingEntry != null
                                  ? 'CONFIRM UPDATE'
                                  : 'RECORD TRANSACTION',
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.0,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildFormField({
    required TextEditingController controller,
    required String label,
    required bool isDark,
    String? hint,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 10,
              color: Colors.grey,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 8),
          TextFormField(
            controller: controller,
            maxLines: maxLines,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            keyboardType: maxLines > 1
                ? TextInputType.text
                : const TextInputType.numberWithOptions(decimal: true),
            decoration: InputDecoration(
              hintText: hint ?? '0.00 SAR',
              hintStyle: const TextStyle(
                fontWeight: FontWeight.normal,
                fontSize: 13,
                color: Colors.grey,
              ),
              fillColor: isDark ? AppColors.inputDark : AppColors.inputLight,
              filled: true,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 14,
                vertical: 12,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: isDark ? AppColors.borderDark : AppColors.borderLight,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: isDark ? AppColors.borderDark : AppColors.borderLight,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(
                  color: AppColors.primary,
                  width: 1.5,
                ),
              ),
            ),
            validator: validator,
          ),
        ],
      ),
    );
  }

  // --- Actions Dropdown Functions (Phase 2) ---

  void _showManageShops() {
    final nameController = TextEditingController();
    String shopType = 'full_erp';
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              backgroundColor: isDark ? AppColors.cardDark : Colors.white,
              clipBehavior: Clip.antiAlias,
              child: SizedBox(
                width: MediaQuery.of(context).size.width * 0.9,
                height: 480,
                child: Column(
                  children: [
                    // Header title banner
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 18,
                      ),
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [AppColors.primary, AppColors.primaryGlow],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Manage Shops',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              fontSize: 16,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              LucideIcons.x,
                              color: Colors.white,
                              size: 18,
                            ),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                    ),

                    // List of existing shops
                    Expanded(
                      child: _shops.isEmpty
                          ? const Center(
                              child: Text(
                                'No shops found.',
                                style: TextStyle(color: Colors.grey),
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _shops.length,
                              itemBuilder: (context, idx) {
                                final s = _shops[idx];
                                final isSimple = s.shopType == 'simple_cash';
                                return Container(
                                  margin: const EdgeInsets.only(bottom: 10),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? AppColors.inputDark
                                        : AppColors.inputLight,
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(
                                      color: isDark
                                          ? AppColors.borderDark
                                          : AppColors.borderLight,
                                    ),
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(14),
                                    child: Container(
                                      decoration: BoxDecoration(
                                        border: Border(
                                          left: BorderSide(
                                            color: isSimple
                                                ? Colors.indigo
                                                : AppColors.primary,
                                            width: 4,
                                          ),
                                        ),
                                      ),
                                      child: ListTile(
                                        dense: true,
                                        leading: Icon(
                                          isSimple
                                              ? LucideIcons.wallet
                                              : LucideIcons.store,
                                          color: isSimple
                                              ? Colors.indigo
                                              : AppColors.primary,
                                        ),
                                        title: Text(
                                          s.name,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                          ),
                                        ),
                                        subtitle: Text(
                                          isSimple
                                              ? 'Simple Cash Outlets'
                                              : 'Full ERP Workflows',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            color: Colors.grey,
                                          ),
                                        ),
                                        trailing: IconButton(
                                          icon: const Icon(
                                            LucideIcons.trash2,
                                            size: 16,
                                            color: AppColors.destructive,
                                          ),
                                          onPressed: () async {
                                            final repo = ShopRepository();
                                            await repo.saveShop(
                                              s.copyWith(isDeleted: true),
                                            );
                                            if (!mounted) return;
                                            context.read<ShopBloc>().add(
                                              LoadShops(),
                                            );
                                            Navigator.pop(context);
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              const SnackBar(
                                                content: Text('Shop deleted.'),
                                              ),
                                            );
                                          },
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                    const Divider(height: 1),

                    // Add New Shop block
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'ADD NEW SHOP OUTLET',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                              color: Colors.grey,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: nameController,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'Shop display name...',
                                    hintStyle: const TextStyle(
                                      fontWeight: FontWeight.normal,
                                      fontSize: 12,
                                    ),
                                    fillColor: isDark
                                        ? AppColors.inputDark
                                        : AppColors.inputLight,
                                    filled: true,
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 10,
                                    ),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : AppColors.borderLight,
                                      ),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : AppColors.borderLight,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 12,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                onPressed: () async {
                                  final name = nameController.text.trim();
                                  if (name.isEmpty) return;
                                  final repo = ShopRepository();
                                  final newShop = ShopModel(
                                    id: 'shop-${DateTime.now().millisecondsSinceEpoch}',
                                    name: name,
                                    shopType: shopType,
                                    createdAt: DateTime.now(),
                                  );
                                  await repo.saveShop(newShop);
                                  if (!mounted) return;
                                  context.read<ShopBloc>().add(LoadShops());
                                  Navigator.pop(context);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                        'Shop outlet created successfully.',
                                      ),
                                    ),
                                  );
                                },
                                child: const Text(
                                  'Add',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              ChoiceChip(
                                label: const Text(
                                  'Full ERP Workflow',
                                  style: TextStyle(fontSize: 11),
                                ),
                                selected: shopType == 'full_erp',
                                selectedColor: AppColors.primary.withValues(
                                  alpha: 0.15,
                                ),
                                checkmarkColor: AppColors.primary,
                                onSelected: (val) {
                                  if (val)
                                    setDialogState(() => shopType = 'full_erp');
                                },
                              ),
                              ChoiceChip(
                                label: const Text(
                                  'Simple Cash Drawer',
                                  style: TextStyle(fontSize: 11),
                                ),
                                selected: shopType == 'simple_cash',
                                selectedColor: Colors.indigo.withValues(
                                  alpha: 0.15,
                                ),
                                checkmarkColor: Colors.indigo,
                                onSelected: (val) {
                                  if (val)
                                    setDialogState(
                                      () => shopType = 'simple_cash',
                                    );
                                },
                              ),
                            ],
                          ),
                        ],
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

  void _showManageCashiers(String currentShopId) {
    final nameController = TextEditingController();
    final shopCashiers = _cashiers
        .where((c) => c.shopId == currentShopId)
        .toList();
    final shopName = _shops
        .firstWhere(
          (s) => s.id == currentShopId,
          orElse: () => ShopModel(
            id: '',
            name: 'Selected Shop',
            createdAt: DateTime.now(),
          ),
        )
        .name;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              backgroundColor: isDark ? AppColors.cardDark : Colors.white,
              clipBehavior: Clip.antiAlias,
              child: SizedBox(
                width: MediaQuery.of(context).size.width * 0.9,
                height: 440,
                child: Column(
                  children: [
                    // Header title banner
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 18,
                      ),
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.indigo, Color(0xFF6366F1)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              'Cashiers: $shopName',
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                fontSize: 15,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              LucideIcons.x,
                              color: Colors.white,
                              size: 18,
                            ),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                    ),

                    // Cashiers list
                    Expanded(
                      child: shopCashiers.isEmpty
                          ? const Center(
                              child: Text(
                                'No cashier accounts found.',
                                style: TextStyle(color: Colors.grey),
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: shopCashiers.length,
                              itemBuilder: (context, idx) {
                                final c = shopCashiers[idx];
                                return Container(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? AppColors.inputDark
                                        : AppColors.inputLight,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: isDark
                                          ? AppColors.borderDark
                                          : AppColors.borderLight,
                                    ),
                                  ),
                                  child: ListTile(
                                    dense: true,
                                    leading: const CircleAvatar(
                                      radius: 12,
                                      backgroundColor: Colors.indigo,
                                      child: Icon(
                                        LucideIcons.user,
                                        size: 12,
                                        color: Colors.white,
                                      ),
                                    ),
                                    title: Text(
                                      c.name,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                      ),
                                    ),
                                    trailing: IconButton(
                                      icon: const Icon(
                                        LucideIcons.trash2,
                                        size: 16,
                                        color: AppColors.destructive,
                                      ),
                                      onPressed: () async {
                                        final repo = ShopRepository();
                                        await repo.saveCashier(
                                          c.copyWith(isDeleted: true),
                                        );
                                        if (!mounted) return;
                                        context.read<ShopBloc>().add(
                                          LoadShops(),
                                        );
                                        Navigator.pop(context);
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          const SnackBar(
                                            content: Text('Cashier deleted.'),
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                    const Divider(height: 1),

                    // Add New Cashier Block
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'ADD NEW CASHIER ACCOUNT',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                              color: Colors.grey,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: nameController,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'Enter cashier display name...',
                                    hintStyle: const TextStyle(
                                      fontWeight: FontWeight.normal,
                                      fontSize: 12,
                                    ),
                                    fillColor: isDark
                                        ? AppColors.inputDark
                                        : AppColors.inputLight,
                                    filled: true,
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 10,
                                    ),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : AppColors.borderLight,
                                      ),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : AppColors.borderLight,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.indigo,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 12,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                onPressed: () async {
                                  final name = nameController.text.trim();
                                  if (name.isEmpty) return;
                                  final repo = ShopRepository();
                                  final newCashier = CashierModel(
                                    id: 'cashier-${DateTime.now().millisecondsSinceEpoch}',
                                    name: name,
                                    shopId: currentShopId,
                                  );
                                  await repo.saveCashier(newCashier);
                                  if (!mounted) return;
                                  context.read<ShopBloc>().add(LoadShops());
                                  Navigator.pop(context);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                        'Cashier account added successfully.',
                                      ),
                                    ),
                                  );
                                },
                                child: const Text(
                                  'Add',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ],
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

  void _showManageCategories() async {
    final nameController = TextEditingController();
    final box = await Hive.openBox<String>('expense_categories');
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (box.isEmpty) {
      await box.addAll([
        'Rent',
        'Electricity',
        'Water',
        'Snacks',
        'Supplies',
        'Maintenance',
      ]);
    }

    final categories = box.values.toList();

    if (!mounted) return;
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              backgroundColor: isDark ? AppColors.cardDark : Colors.white,
              clipBehavior: Clip.antiAlias,
              child: SizedBox(
                width: MediaQuery.of(context).size.width * 0.9,
                height: 440,
                child: Column(
                  children: [
                    // Header title banner
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 18,
                      ),
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFF0F766E), Color(0xFF0D9488)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Expense Categories',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              fontSize: 16,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              LucideIcons.x,
                              color: Colors.white,
                              size: 18,
                            ),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                    ),

                    // Grid or Wrap of categories
                    Expanded(
                      child: categories.isEmpty
                          ? const Center(
                              child: Text(
                                'No categories found.',
                                style: TextStyle(color: Colors.grey),
                              ),
                            )
                          : SingleChildScrollView(
                              padding: const EdgeInsets.all(20),
                              child: Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: List.generate(categories.length, (
                                  idx,
                                ) {
                                  final cat = categories[idx];
                                  return Container(
                                    padding: const EdgeInsets.only(
                                      left: 12,
                                      right: 4,
                                      top: 4,
                                      bottom: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? AppColors.inputDark
                                          : AppColors.inputLight,
                                      border: Border.all(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : AppColors.borderLight,
                                      ),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(
                                          LucideIcons.tag,
                                          size: 12,
                                          color: AppColors.primary,
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          cat,
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        IconButton(
                                          icon: const Icon(
                                            LucideIcons.x,
                                            size: 12,
                                            color: Colors.grey,
                                          ),
                                          padding: EdgeInsets.zero,
                                          constraints: const BoxConstraints(),
                                          onPressed: () async {
                                            final key = box.keyAt(idx);
                                            await box.delete(key);
                                            setDialogState(() {
                                              categories.removeAt(idx);
                                            });
                                          },
                                        ),
                                      ],
                                    ),
                                  );
                                }),
                              ),
                            ),
                    ),
                    const Divider(height: 1),

                    // Add Category tag block
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'ADD CATEGORY TAG',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                              color: Colors.grey,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: nameController,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'Enter expense tag name...',
                                    hintStyle: const TextStyle(
                                      fontWeight: FontWeight.normal,
                                      fontSize: 12,
                                    ),
                                    fillColor: isDark
                                        ? AppColors.inputDark
                                        : AppColors.inputLight,
                                    filled: true,
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 10,
                                    ),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : AppColors.borderLight,
                                      ),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : AppColors.borderLight,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 12,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                onPressed: () async {
                                  final name = nameController.text.trim();
                                  if (name.isEmpty) return;
                                  await box.add(name);
                                  setDialogState(() {
                                    categories.add(name);
                                  });
                                  nameController.clear();
                                },
                                child: const Text(
                                  'Add',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ],
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

  void _showImportSales(String currentShopId) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final activeShop = _shops.firstWhere(
      (s) => s.id == currentShopId,
      orElse: () =>
          ShopModel(id: '', name: 'Main Shop', createdAt: DateTime.now()),
    );
    final activeCashier = _cashiers.firstWhere(
      (c) => c.shopId == currentShopId,
      orElse: () => CashierModel(id: '', name: 'Ahsan', shopId: ''),
    );

    String stage = 'upload'; // 'upload' | 'preview' | 'importing' | 'done'
    double progress = 0.0;
    List<ParsedRowMock> rows = [];
    int validCount = 0;
    int errorCount = 0;
    int dupCount = 0;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setImportState) {
            return Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(28),
              ),
              backgroundColor: isDark ? AppColors.cardDark : Colors.white,
              clipBehavior: Clip.antiAlias,
              child: SizedBox(
                width: MediaQuery.of(context).size.width * 0.9,
                height: 520,
                child: Column(
                  children: [
                    // Header title banner
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 18,
                      ),
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [AppColors.primary, AppColors.primaryGlow],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(
                                LucideIcons.fileSpreadsheet,
                                color: Colors.white,
                                size: 20,
                              ),
                              SizedBox(width: 8),
                              Text(
                                'Import Shop Sales',
                                style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(
                              LucideIcons.x,
                              color: Colors.white,
                              size: 18,
                            ),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                    ),

                    // Content panel according to active stage
                    Expanded(
                      child: stage == 'upload'
                          ? SingleChildScrollView(
                              padding: const EdgeInsets.all(24.0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  // Drag container design
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 40,
                                      horizontal: 20,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? AppColors.inputDark
                                          : AppColors.inputLight,
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(
                                        color: AppColors.primary.withValues(
                                          alpha: 0.3,
                                        ),
                                        style: BorderStyle.solid,
                                        width: 1.5,
                                      ),
                                    ),
                                    child: Column(
                                      children: [
                                        Icon(
                                          LucideIcons.uploadCloud,
                                          size: 48,
                                          color: AppColors.primary.withValues(
                                            alpha: 0.6,
                                          ),
                                        ),
                                        const SizedBox(height: 16),
                                        const Text(
                                          'Simulate Import Spreadsheet',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w900,
                                            fontSize: 14,
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        const Text(
                                          'Drag and drop Excel / CSV files or select simulated parser schema template.',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: Colors.grey,
                                            height: 1.3,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 24),
                                  ElevatedButton.icon(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primary,
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 24,
                                        vertical: 14,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                    ),
                                    icon: const Icon(
                                      LucideIcons.sparkles,
                                      size: 14,
                                    ),
                                    label: const Text(
                                      'Simulate Upload & Parse',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    onPressed: () {
                                      setImportState(() {
                                        stage = 'preview';
                                        rows = [
                                          ParsedRowMock(
                                            idx: 2,
                                            date: _formatDateString(
                                              DateTime.now(),
                                            ),
                                            shopName: activeShop.name,
                                            cashierName: activeCashier.name,
                                            pos: 1500.0,
                                            cash: 600.0,
                                            bank: 700.0,
                                            credit: 200.0,
                                            total: 1500.0,
                                            diff: 0.0,
                                            status: 'OK',
                                            tooltip: 'Valid sales row',
                                          ),
                                          ParsedRowMock(
                                            idx: 3,
                                            date: _formatDateString(
                                              DateTime.now(),
                                            ),
                                            shopName: 'Non-Existent Outlet B',
                                            cashierName: 'Zubair',
                                            pos: 500.0,
                                            cash: 200.0,
                                            bank: 300.0,
                                            credit: 0.0,
                                            total: 500.0,
                                            diff: 0.0,
                                            status: 'Error',
                                            tooltip:
                                                'Shop not found in records DB',
                                          ),
                                          ParsedRowMock(
                                            idx: 4,
                                            date: _formatDateString(
                                              DateTime.now(),
                                            ),
                                            shopName: activeShop.name,
                                            cashierName: activeCashier.name,
                                            pos: 1500.0,
                                            cash: 600.0,
                                            bank: 700.0,
                                            credit: 200.0,
                                            total: 1500.0,
                                            diff: 0.0,
                                            status: 'Dup',
                                            tooltip:
                                                'Row duplicate matching Row 2',
                                          ),
                                        ];
                                        validCount = 1;
                                        errorCount = 1;
                                        dupCount = 1;
                                      });
                                    },
                                  ),
                                  const SizedBox(height: 12),
                                  OutlinedButton(
                                    style: OutlinedButton.styleFrom(
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      side: BorderSide(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : AppColors.borderLight,
                                      ),
                                    ),
                                    onPressed: () {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Schema fields: Date, Shop Name, Cashier Name, POS Sale, Cash Sale, Bank Sale, Credit Sale',
                                          ),
                                        ),
                                      );
                                    },
                                    child: const Text(
                                      'View Template Schema',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )
                          : stage == 'preview'
                          ? Column(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceEvenly,
                                    children: [
                                      _buildImportStatBox(
                                        'Valid',
                                        validCount,
                                        Colors.green,
                                        isDark,
                                      ),
                                      _buildImportStatBox(
                                        'Errors',
                                        errorCount,
                                        Colors.red,
                                        isDark,
                                      ),
                                      _buildImportStatBox(
                                        'Duplicates',
                                        dupCount,
                                        Colors.amber,
                                        isDark,
                                      ),
                                    ],
                                  ),
                                ),
                                const Divider(height: 1),
                                Expanded(
                                  child: SingleChildScrollView(
                                    scrollDirection: Axis.vertical,
                                    child: SingleChildScrollView(
                                      scrollDirection: Axis.horizontal,
                                      child: DataTable(
                                        columnSpacing: 16,
                                        headingRowColor:
                                            WidgetStateProperty.all(
                                              isDark
                                                  ? AppColors.inputDark
                                                  : AppColors.inputLight,
                                            ),
                                        headingRowHeight: 34,
                                        dataRowHeight: 38,
                                        columns: const [
                                          DataColumn(
                                            label: Text(
                                              '#',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                          DataColumn(
                                            label: Text(
                                              'Shop Name',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                          DataColumn(
                                            label: Text(
                                              'POS Amount',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                          DataColumn(
                                            label: Text(
                                              'Calculated',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                          DataColumn(
                                            label: Text(
                                              'Status',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                        rows: rows.map<DataRow>((r) {
                                          Color rowColor = Colors.transparent;
                                          if (r.status == 'Error')
                                            rowColor = Colors.red.withValues(
                                              alpha: 0.05,
                                            );
                                          if (r.status == 'Dup')
                                            rowColor = Colors.amber.withValues(
                                              alpha: 0.05,
                                            );

                                          return DataRow(
                                            color: WidgetStateProperty.all(
                                              rowColor,
                                            ),
                                            cells: [
                                              DataCell(
                                                Text(
                                                  r.idx.toString(),
                                                  style: const TextStyle(
                                                    fontSize: 11,
                                                  ),
                                                ),
                                              ),
                                              DataCell(
                                                Text(
                                                  r.shopName,
                                                  style: const TextStyle(
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                              DataCell(
                                                Text(
                                                  r.pos.toStringAsFixed(0),
                                                  style: const TextStyle(
                                                    fontSize: 11,
                                                  ),
                                                ),
                                              ),
                                              DataCell(
                                                Text(
                                                  r.total.toStringAsFixed(0),
                                                  style: const TextStyle(
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                              DataCell(
                                                Container(
                                                  padding:
                                                      const EdgeInsets.symmetric(
                                                        horizontal: 8,
                                                        vertical: 4,
                                                      ),
                                                  decoration: BoxDecoration(
                                                    color: r.status == 'OK'
                                                        ? Colors.green
                                                              .withValues(
                                                                alpha: 0.15,
                                                              )
                                                        : r.status == 'Dup'
                                                        ? Colors.amber
                                                              .withValues(
                                                                alpha: 0.15,
                                                              )
                                                        : Colors.red.withValues(
                                                            alpha: 0.15,
                                                          ),
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                          20,
                                                        ),
                                                  ),
                                                  child: Text(
                                                    r.status,
                                                    style: TextStyle(
                                                      fontSize: 10,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      color: r.status == 'OK'
                                                          ? Colors
                                                                .green
                                                                .shade700
                                                          : r.status == 'Dup'
                                                          ? Colors
                                                                .amber
                                                                .shade700
                                                          : Colors.red,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          );
                                        }).toList(),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            )
                          : stage == 'importing'
                          ? Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const CircularProgressIndicator(
                                  color: AppColors.primary,
                                ),
                                const SizedBox(height: 24),
                                Text(
                                  'Processing imports... ${(progress * 100).toInt()}%',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 40,
                                  ),
                                  child: LinearProgressIndicator(
                                    value: progress,
                                    minHeight: 6,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                              ],
                            )
                          : Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(20),
                                  decoration: BoxDecoration(
                                    color: Colors.green.withValues(alpha: 0.1),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    LucideIcons.checkCircle2,
                                    color: Colors.green,
                                    size: 56,
                                  ),
                                ),
                                const SizedBox(height: 20),
                                const Text(
                                  'Import Process Complete!',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 18,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                  ),
                                  child: Text(
                                    '$validCount records updated in shop_entries box cache table.',
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: Colors.grey,
                                      height: 1.4,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              ],
                            ),
                    ),
                    const Divider(height: 1),

                    // Actions row buttons
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (stage == 'upload' || stage == 'preview')
                            OutlinedButton(
                              style: OutlinedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                side: BorderSide(
                                  color: isDark
                                      ? AppColors.borderDark
                                      : AppColors.borderLight,
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 18,
                                  vertical: 12,
                                ),
                              ),
                              onPressed: () => Navigator.pop(context),
                              child: const Text(
                                'Cancel',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          if (stage == 'preview') ...[
                            const SizedBox(width: 10),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 18,
                                  vertical: 12,
                                ),
                              ),
                              onPressed: () {
                                setImportState(() {
                                  stage = 'importing';
                                  progress = 0.0;
                                });

                                // Batch progress
                                Future.forEach([0.2, 0.5, 0.8, 1.0], (
                                  val,
                                ) async {
                                  await Future.delayed(
                                    const Duration(milliseconds: 300),
                                  );
                                  setImportState(() {
                                    progress = val;
                                  });
                                }).then((_) async {
                                  final newEntry = ShopEntryModel(
                                    id: const Uuid().v4(),
                                    shopId: currentShopId,
                                    cashierId: activeCashier.id,
                                    entryType: 'sale',
                                    posSale: 1500.0,
                                    cashSale: 600.0,
                                    bankSale: 700.0,
                                    creditSale: 200.0,
                                    difference: 0.0,
                                    txnDate: DateTime.now(),
                                    createdAt: DateTime.now(),
                                  );

                                  context.read<ShopBloc>().add(
                                    AddEntry(newEntry),
                                  );
                                  if (!mounted) return;
                                  setImportState(() {
                                    stage = 'done';
                                  });
                                });
                              },
                              child: Text(
                                'Import $validCount Rows',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                          if (stage == 'done')
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 24,
                                  vertical: 12,
                                ),
                              ),
                              onPressed: () => Navigator.pop(context),
                              child: const Text(
                                'Done',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                        ],
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

  Widget _buildImportStatBox(String label, int val, Color color, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        border: Border.all(color: color.withValues(alpha: 0.25)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              color: Colors.grey,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            val.toString(),
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  // --- Report and Exports logic (Phase 2) ---

  ShopStats _calculateShopStats(String shopId, DateRangeBounds bounds) {
    final fromStr = _formatDateString(bounds.from);
    final toStr = _formatDateString(bounds.to);

    final shop = _shops.firstWhere((s) => s.id == shopId);
    final simple = shop.shopType == 'simple_cash';

    double pos = 0.0, cash = 0.0, bank = 0.0, credit = 0.0;
    double purchase = 0.0, expense = 0.0, withdraw = 0.0;

    for (final e in _allEntries) {
      if (e.shopId == shopId && !e.isDeleted) {
        final eDateStr = _formatDateString(e.txnDate);
        if (eDateStr.compareTo(fromStr) >= 0 &&
            eDateStr.compareTo(toStr) <= 0) {
          if (e.entryType == 'sale') {
            if (simple) {
              cash += e.cashSale;
            } else {
              pos += e.posSale;
              cash += e.cashSale;
              bank += e.bankSale;
              credit += e.creditSale;
            }
          } else if (e.entryType == 'purchase') {
            purchase += e.purchaseAmount;
          } else if (e.entryType == 'expense') {
            expense += e.expenseAmount;
          } else if (e.entryType == 'withdraw') {
            withdraw += e.withdrawAmount;
          }
        }
      }
    }

    final totalSale = simple
        ? cash
        : (cash + bank + credit - 0.0 /* dueReceivable */ );
    final diff = simple ? 0.0 : (totalSale - pos);

    return ShopStats(
      pos: pos,
      cash: cash,
      bank: bank,
      credit: credit,
      totalSale: totalSale,
      purchase: purchase,
      expense: expense,
      withdraw: withdraw,
      diff: diff,
    );
  }

  void _showGenerateReport(
    List<ShopCardSummary> summaries,
    DateRangeBounds bounds,
  ) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final rangeStr =
        '${_formatDateString(bounds.from)} to ${_formatDateString(bounds.to)}';

    // Aggregate Totals
    double tPos = 0,
        tCash = 0,
        tBank = 0,
        tCredit = 0,
        tTot = 0,
        tPur = 0,
        tExp = 0,
        tWd = 0,
        tDiff = 0;
    final List<_ReportRow> rows = summaries.map((s) {
      final stats = _calculateShopStats(s.shop.id, bounds);
      tPos += stats.pos;
      tCash += stats.cash;
      tBank += stats.bank;
      tCredit += stats.credit;
      tTot += stats.totalSale;
      tPur += stats.purchase;
      tExp += stats.expense;
      tWd += stats.withdraw;
      tDiff += stats.diff;

      return _ReportRow(
        name: s.shop.name,
        pos: stats.pos,
        cash: stats.cash,
        bank: stats.bank,
        credit: stats.credit,
        total: stats.totalSale,
        purchase: stats.purchase,
        expense: stats.expense,
        withdraw: stats.withdraw,
        diff: stats.diff,
      );
    }).toList();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
          backgroundColor: isDark ? AppColors.cardDark : Colors.white,
          clipBehavior: Clip.antiAlias,
          child: SizedBox(
            width: MediaQuery.of(context).size.width * 0.95,
            height: MediaQuery.of(context).size.height * 0.7,
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 18,
                  ),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppColors.primary, AppColors.primaryGlow],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Monthly Shop Report Matrix',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'RANGE: $rangeStr',
                            style: const TextStyle(
                              fontSize: 10,
                              color: Colors.white70,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(
                          LucideIcons.x,
                          color: Colors.white,
                          size: 18,
                        ),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),

                // Table content
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.vertical,
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: DataTable(
                        columnSpacing: 14,
                        headingRowColor: WidgetStateProperty.all(
                          isDark ? AppColors.inputDark : AppColors.inputLight,
                        ),
                        columns: const [
                          DataColumn(
                            label: Text(
                              'Shop Name',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'POS Card',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'Cash Drawer',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'Bank',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'Credit',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'Total Sale',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'Purchase',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'Expense',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              'Withdraw',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          DataColumn(
                            label: Text(
                              '+/-',
                              textAlign: TextAlign.right,
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                        rows: [
                          ...rows.map((r) {
                            return DataRow(
                              cells: [
                                DataCell(
                                  Text(
                                    r.name,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    _formatCurrency(r.pos),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    _formatCurrency(r.cash),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    _formatCurrency(r.bank),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    _formatCurrency(r.credit),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    _formatCurrency(r.total),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    _formatCurrency(r.purchase),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    _formatCurrency(r.expense),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    _formatCurrency(r.withdraw),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ),
                                DataCell(
                                  Text(
                                    '${r.diff >= 0 ? "+" : ""}${r.diff.toStringAsFixed(2)}',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                      color: r.diff == 0
                                          ? Colors.grey
                                          : r.diff > 0
                                          ? AppColors.success
                                          : AppColors.destructive,
                                    ),
                                  ),
                                ),
                              ],
                            );
                          }).toList(),
                          // Totals Row
                          DataRow(
                            color: WidgetStateProperty.all(
                              AppColors.primary.withValues(alpha: 0.1),
                            ),
                            cells: [
                              const DataCell(
                                Text(
                                  'TOTAL',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 12,
                                    color: AppColors.primary,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  _formatCurrency(tPos),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  _formatCurrency(tCash),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  _formatCurrency(tBank),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  _formatCurrency(tCredit),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  _formatCurrency(tTot),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                    color: AppColors.primary,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  _formatCurrency(tPur),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  _formatCurrency(tExp),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  _formatCurrency(tWd),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  '${tDiff >= 0 ? "+" : ""}${tDiff.toStringAsFixed(2)}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 12,
                                    color: tDiff == 0
                                        ? Colors.grey
                                        : tDiff > 0
                                        ? AppColors.success
                                        : AppColors.destructive,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const Divider(height: 1),

                // Actions row
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 16,
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.green),
                            foregroundColor: Colors.green,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          icon: const Icon(
                            LucideIcons.fileSpreadsheet,
                            size: 14,
                          ),
                          label: const Text(
                            'Excel CSV',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          onPressed: () => _exportExcel(summaries, bounds),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.red),
                            foregroundColor: Colors.red,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          icon: const Icon(LucideIcons.fileText, size: 14),
                          label: const Text(
                            'PDF Print',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          onPressed: () => _exportPdf(summaries, bounds),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          icon: const Icon(LucideIcons.share2, size: 14),
                          label: const Text(
                            'Share text',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          onPressed: () => _shareReport(summaries, bounds),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _exportExcel(
    List<ShopCardSummary> summaries,
    DateRangeBounds bounds,
  ) async {
    final rangeStr =
        '${_formatDateString(bounds.from)} to ${_formatDateString(bounds.to)}';
    final csv = StringBuffer();
    csv.writeln('# ShRiAh Group Shop Report');
    csv.writeln('# Range: $rangeStr');
    csv.writeln(
      'Shop,POS Sale,Cash Sale,Bank Sale,Credit Sale,Total Sale,Purchase,Expense,Withdraw,Plus/Minus',
    );

    double tPos = 0,
        tCash = 0,
        tBank = 0,
        tCredit = 0,
        tTot = 0,
        tPur = 0,
        tExp = 0,
        tWd = 0,
        tDiff = 0;

    for (final s in summaries) {
      final stats = _calculateShopStats(s.shop.id, bounds);
      csv.writeln(
        '"${s.shop.name}",${stats.pos},${stats.cash},${stats.bank},${stats.credit},${stats.totalSale},${stats.purchase},${stats.expense},${stats.withdraw},${stats.diff}',
      );

      tPos += stats.pos;
      tCash += stats.cash;
      tBank += stats.bank;
      tCredit += stats.credit;
      tTot += stats.totalSale;
      tPur += stats.purchase;
      tExp += stats.expense;
      tWd += stats.withdraw;
      tDiff += stats.diff;
    }

    csv.writeln(
      'TOTAL,$tPos,$tCash,$tBank,$tCredit,$tTot,$tPur,$tExp,$tWd,$tDiff',
    );

    try {
      final directory = await getApplicationDocumentsDirectory();
      final file = File(
        '${directory.path}/shop_report_${DateTime.now().millisecondsSinceEpoch}.csv',
      );
      await file.writeAsString(csv.toString());
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Report exported to Excel (CSV): ${file.path}')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to save file: $e')));
    }
  }

  Future<void> _exportPdf(
    List<ShopCardSummary> summaries,
    DateRangeBounds bounds,
  ) async {
    final rangeStr =
        '${_formatDateString(bounds.from)} to ${_formatDateString(bounds.to)}';

    final html = StringBuffer();
    html.writeln(
      '<!doctype html><html><head><meta charset="utf-8"/><title>Monthly Shop Report</title>',
    );
    html.writeln('<style>');
    html.writeln('body{font-family:sans-serif;padding:20px;color:#333;}');
    html.writeln(
      'h1{font-size:20px;border-bottom:2px solid #0D9488;padding-bottom:10px;}',
    );
    html.writeln(
      'table{width:100%;border-collapse:collapse;margin-top:20px;font-size:12px;}',
    );
    html.writeln('th,td{border:1px solid #ddd;padding:8px;text-align:right;}');
    html.writeln('th{background-color:#F3F4F6;}');
    html.writeln('tr:nth-child(even){background-color:#F9FAFB;}');
    html.writeln('</style></head><body>');
    html.writeln('<h1>ShRiAh Group Shop Report</h1>');
    html.writeln('<p><strong>Date Range:</strong> $rangeStr</p>');
    html.writeln('<table><thead><tr>');
    html.writeln(
      '<th>Shop</th><th>POS</th><th>Cash</th><th>Bank</th><th>Credit</th><th>Total Sale</th><th>Purchase</th><th>Expense</th><th>Withdraw</th><th>+/-</th>',
    );
    html.writeln('</tr></thead><tbody>');

    double tPos = 0,
        tCash = 0,
        tBank = 0,
        tCredit = 0,
        tTot = 0,
        tPur = 0,
        tExp = 0,
        tWd = 0,
        tDiff = 0;

    for (final s in summaries) {
      final stats = _calculateShopStats(s.shop.id, bounds);
      html.writeln('<tr>');
      html.writeln('<td><strong>${s.shop.name}</strong></td>');
      html.writeln('<td>${stats.pos.toStringAsFixed(2)}</td>');
      html.writeln('<td>${stats.cash.toStringAsFixed(2)}</td>');
      html.writeln('<td>${stats.bank.toStringAsFixed(2)}</td>');
      html.writeln('<td>${stats.credit.toStringAsFixed(2)}</td>');
      html.writeln(
        '<td><strong>${stats.totalSale.toStringAsFixed(2)}</strong></td>',
      );
      html.writeln('<td>${stats.purchase.toStringAsFixed(2)}</td>');
      html.writeln('<td>${stats.expense.toStringAsFixed(2)}</td>');
      html.writeln('<td>${stats.withdraw.toStringAsFixed(2)}</td>');
      html.writeln(
        '<td style="color:${stats.diff >= 0 ? 'green' : 'red'}">${stats.diff.toStringAsFixed(2)}</td>',
      );
      html.writeln('</tr>');

      tPos += stats.pos;
      tCash += stats.cash;
      tBank += stats.bank;
      tCredit += stats.credit;
      tTot += stats.totalSale;
      tPur += stats.purchase;
      tExp += stats.expense;
      tWd += stats.withdraw;
      tDiff += stats.diff;
    }

    html.writeln('<tr style="font-weight:bold;background-color:#E5E7EB;">');
    html.writeln('<td>TOTAL</td>');
    html.writeln('<td>${tPos.toStringAsFixed(2)}</td>');
    html.writeln('<td>${tCash.toStringAsFixed(2)}</td>');
    html.writeln('<td>${tBank.toStringAsFixed(2)}</td>');
    html.writeln('<td>${tCredit.toStringAsFixed(2)}</td>');
    html.writeln('<td>${tTot.toStringAsFixed(2)}</td>');
    html.writeln('<td>${tPur.toStringAsFixed(2)}</td>');
    html.writeln('<td>${tExp.toStringAsFixed(2)}</td>');
    html.writeln('<td>${tWd.toStringAsFixed(2)}</td>');
    html.writeln('<td>${tDiff.toStringAsFixed(2)}</td>');
    html.writeln('</tr>');
    html.writeln('</tbody></table>');
    html.writeln('</body></html>');

    try {
      final directory = await getApplicationDocumentsDirectory();
      final file = File(
        '${directory.path}/shop_report_${DateTime.now().millisecondsSinceEpoch}.html',
      );
      await file.writeAsString(html.toString());
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Report PDF HTML page exported: ${file.path}')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to save HTML page: $e')));
    }
  }

  void _shareReport(List<ShopCardSummary> summaries, DateRangeBounds bounds) {
    final rangeStr =
        '${_formatDateString(bounds.from)} to ${_formatDateString(bounds.to)}';
    final sb = StringBuffer();
    sb.writeln('*ShRiAh Group Shop Report*');
    sb.writeln('Range: $rangeStr');
    sb.writeln('');

    double tPos = 0,
        tCash = 0,
        tBank = 0,
        tCredit = 0,
        tTot = 0,
        tPur = 0,
        tExp = 0,
        tWd = 0,
        tDiff = 0;

    for (final s in summaries) {
      final stats = _calculateShopStats(s.shop.id, bounds);
      sb.writeln('*${s.shop.name}*:');
      sb.writeln('  POS Card: ${stats.pos.toStringAsFixed(2)} SAR');
      sb.writeln('  Cash Sale: ${stats.cash.toStringAsFixed(2)} SAR');
      sb.writeln('  Bank Sale: ${stats.bank.toStringAsFixed(2)} SAR');
      sb.writeln('  Credit Sale: ${stats.credit.toStringAsFixed(2)} SAR');
      sb.writeln('  *Total Sale*: *${stats.totalSale.toStringAsFixed(2)}* SAR');
      sb.writeln('  Purchase: ${stats.purchase.toStringAsFixed(2)} SAR');
      sb.writeln('  Expense: ${stats.expense.toStringAsFixed(2)} SAR');
      sb.writeln('  Withdrawal: ${stats.withdraw.toStringAsFixed(2)} SAR');
      sb.writeln('  *Plus/Minus*: *${stats.diff.toStringAsFixed(2)}* SAR');
      sb.writeln('');

      tPos += stats.pos;
      tCash += stats.cash;
      tBank += stats.bank;
      tCredit += stats.credit;
      tTot += stats.totalSale;
      tPur += stats.purchase;
      tExp += stats.expense;
      tWd += stats.withdraw;
      tDiff += stats.diff;
    }

    sb.writeln('--------------------');
    sb.writeln('*TOTAL AGGREGATE*:');
    sb.writeln('  POS Card: ${tPos.toStringAsFixed(2)} SAR');
    sb.writeln('  Cash: ${tCash.toStringAsFixed(2)} SAR');
    sb.writeln('  Bank: ${tBank.toStringAsFixed(2)} SAR');
    sb.writeln('  Credit: ${tCredit.toStringAsFixed(2)} SAR');
    sb.writeln('  *Total Sale*: *${tTot.toStringAsFixed(2)}* SAR');
    sb.writeln('  Purchase: ${tPur.toStringAsFixed(2)} SAR');
    sb.writeln('  Expense: ${tExp.toStringAsFixed(2)} SAR');
    sb.writeln('  Withdrawal: ${tWd.toStringAsFixed(2)} SAR');
    sb.writeln('  *Plus/Minus*: *${tDiff.toStringAsFixed(2)}* SAR');

    Clipboard.setData(ClipboardData(text: sb.toString()));

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Report text formatted and copied to clipboard! Ready to share.',
        ),
      ),
    );
  }

  // --- End Actions Dropdown Functions (Phase 2) ---

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final shopState = context.watch<ShopBloc>().state;
    final workingDateTime = context.watch<WorkingDateCubit>().state;

    if (shopState is ShopLoading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      );
    }

    if (shopState is ShopLoaded) {
      _shops = shopState.shops;
      _cashiers = shopState.cashiers;
      _allEntries = shopState.entries;

      final activeShop = shopState.selectedShop;
      final defaultShopId = activeShop?.id ?? '';

      // Date constraints bounds
      final bounds = _getDateRangeBounds(workingDateTime);
      final fromStr = _formatDateString(bounds.from);
      final toStr = _formatDateString(bounds.to);

      // 1. Calculate Per-Shop summary cards dynamically for all shops
      final List<ShopCardSummary> shopCards = _shops.map((shop) {
        final simple = shop.shopType == 'simple_cash';
        double cashTot = 0.0;
        double bankTot = 0.0;
        double withdrawTot = 0.0;
        double purchaseTot = 0.0;
        double expenseTot = 0.0;
        double primary = 0.0;
        double secondary = 0.0;
        DateTime? lastDate;

        final shopEntries = _allEntries.where(
          (e) => e.shopId == shop.id && !e.isDeleted,
        );
        for (final e in shopEntries) {
          final eDateStr = _formatDateString(e.txnDate);
          if (eDateStr.compareTo(fromStr) >= 0 &&
              eDateStr.compareTo(toStr) <= 0) {
            if (lastDate == null || e.txnDate.isAfter(lastDate)) {
              lastDate = e.txnDate;
            }

            if (simple) {
              if (e.entryType == 'sale') {
                primary += e.cashSale;
              } else if (e.entryType == 'expense') {
                secondary += e.expenseAmount;
              }
            } else {
              cashTot += e.cashSale;
              bankTot += e.bankSale;
              withdrawTot += e.withdrawAmount;
              purchaseTot += e.purchaseAmount;
              expenseTot += e.expenseAmount;
            }
          }
        }

        final double cashPosition = simple
            ? (primary - secondary)
            : ((cashTot + withdrawTot) - (purchaseTot + expenseTot));
        final double expectedBank = simple ? 0.0 : (bankTot - withdrawTot);

        return ShopCardSummary(
          shop: shop,
          cashPosition: cashPosition,
          expectedBank: expectedBank,
          lastDate: lastDate,
        );
      }).toList();

      // 2. Client-side filtering recent entries
      final filteredEntries = _allEntries.where((e) {
        // Shop filter
        if (_shopFilter != 'all' && e.shopId != _shopFilter) return false;

        // Date bounds filter
        final eDateStr = _formatDateString(e.txnDate);
        if (eDateStr.compareTo(fromStr) < 0 || eDateStr.compareTo(toStr) > 0)
          return false;

        // Entry types filter pills
        if (_activeFilters.isNotEmpty) {
          bool match = false;
          for (final f in _activeFilters) {
            if (f == 'pos_sale' && e.entryType == 'sale' && e.posSale > 0)
              match = true;
            if (f == 'cash_sale' && e.entryType == 'sale' && e.cashSale > 0)
              match = true;
            if (f == 'bank_sale' && e.entryType == 'sale' && e.bankSale > 0)
              match = true;
            if (f == 'credit_sale' && e.entryType == 'sale' && e.creditSale > 0)
              match = true;
            if (f == 'difference' && e.entryType == 'sale' && e.difference != 0)
              match = true;
            if (f == 'purchase' && e.entryType == 'purchase') match = true;
            if (f == 'expense' && e.entryType == 'expense') match = true;
            if (f == 'withdraw' && e.entryType == 'withdraw') match = true;
          }
          return match;
        }

        return true;
      }).toList();

      // Sort entries: latest first, then creation order
      filteredEntries.sort((a, b) {
        final cmp = b.txnDate.compareTo(a.txnDate);
        if (cmp != 0) return cmp;
        return b.createdAt.compareTo(a.createdAt);
      });

      // 3. Compute Net Total for filtered subset
      double netTotalSum = 0.0;
      if (_activeFilters.isEmpty) {
        for (final e in filteredEntries) {
          if (e.entryType == 'sale') {
            netTotalSum +=
                (e.cashSale + e.bankSale + e.creditSale - e.dueReceivable);
          } else if (e.entryType == 'purchase') {
            netTotalSum -= e.purchaseAmount;
          } else if (e.entryType == 'expense') {
            netTotalSum -= e.expenseAmount;
          } else if (e.entryType == 'withdraw') {
            netTotalSum += e.withdrawAmount;
          }
        }
      } else {
        for (final e in filteredEntries) {
          for (final f in _activeFilters) {
            if (f == 'pos_sale' && e.entryType == 'sale')
              netTotalSum += e.posSale;
            if (f == 'cash_sale' && e.entryType == 'sale')
              netTotalSum += e.cashSale;
            if (f == 'bank_sale' && e.entryType == 'sale')
              netTotalSum += e.bankSale;
            if (f == 'credit_sale' && e.entryType == 'sale')
              netTotalSum += e.creditSale;
            if (f == 'difference' && e.entryType == 'sale')
              netTotalSum += e.difference;
            if (f == 'purchase' && e.entryType == 'purchase')
              netTotalSum += e.purchaseAmount;
            if (f == 'expense' && e.entryType == 'expense')
              netTotalSum += e.expenseAmount;
            if (f == 'withdraw' && e.entryType == 'withdraw')
              netTotalSum += e.withdrawAmount;
          }
        }
      }

      // Slice for pagination
      final paginatedEntries = filteredEntries.take(_visibleCount).toList();

      return Scaffold(
        backgroundColor: Colors.transparent,
        floatingActionButton: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.3),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: FloatingActionButton(
            backgroundColor: AppColors.primary,
            elevation: 0,
            child: const Icon(LucideIcons.plus, color: Colors.white, size: 24),
            onPressed: () {
              // Check active shop mode for FAB
              final currShop = _shops.firstWhere(
                (s) => s.id == defaultShopId,
                orElse: () => ShopModel(
                  id: '',
                  name: 'Unknown',
                  createdAt: DateTime.now(),
                ),
              );
              final simple = currShop.shopType == 'simple_cash';

              showModalBottomSheet(
                context: context,
                backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                ),
                builder: (BuildContext context) {
                  return SafeArea(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 20),
                          child: Text(
                            'Select Transaction Type',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 16,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                        const Divider(height: 1),
                        ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(
                              LucideIcons.shoppingCart,
                              color: AppColors.primary,
                              size: 18,
                            ),
                          ),
                          title: Text(
                            simple ? 'Cash In Record' : 'POS & Cash Sales',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          onTap: () {
                            Navigator.pop(context);
                            _showEntryFormSheet(defaultShopId);
                          },
                        ),
                        if (!simple)
                          ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.warning.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(
                                LucideIcons.package,
                                color: AppColors.warning,
                                size: 18,
                              ),
                            ),
                            title: const Text(
                              'Purchase Invoice',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            onTap: () {
                              Navigator.pop(context);
                              _showEntryFormSheet(defaultShopId);
                              _formTabController.index = 1;
                            },
                          ),
                        ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.destructive.withValues(
                                alpha: 0.1,
                              ),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(
                              LucideIcons.fileText,
                              color: AppColors.destructive,
                              size: 18,
                            ),
                          ),
                          title: const Text(
                            'Expense Voucher',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          onTap: () {
                            Navigator.pop(context);
                            _showEntryFormSheet(defaultShopId);
                            _formTabController.index = simple ? 1 : 2;
                          },
                        ),
                        if (!simple)
                          ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.purple.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(
                                LucideIcons.banknote,
                                color: Colors.purple,
                                size: 18,
                              ),
                            ),
                            title: const Text(
                              'Cash Withdrawal / Transfer',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            onTap: () {
                              Navigator.pop(context);
                              _showEntryFormSheet(defaultShopId);
                              _formTabController.index = 3;
                            },
                          ),
                        const SizedBox(height: 10),
                      ],
                    ),
                  );
                },
              );
            },
          ),
        ),
        body: SafeArea(
          child: RefreshIndicator(
            color: const Color(0xFF24B489),
            onRefresh: () async {
              context.read<ShopBloc>().add(
                LoadShopEntries(defaultShopId, workingDateTime),
              );
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Top Header Row (Shops Count Pill on left, 3-Dots Menu on right)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(LucideIcons.store, size: 16, color: Color(0xFF0D9488)),
                            const SizedBox(width: 8),
                            Text(
                              'Shops · ${_shops.length}',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // 3-Dots Menu Button
                      Container(
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                          ),
                        ),
                        child: PopupMenuButton<String>(
                          icon: Icon(
                            LucideIcons.moreVertical,
                            size: 18,
                            color: isDark ? Colors.white : const Color(0xFF475569),
                          ),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          color: isDark ? AppColors.cardDark : Colors.white,
                          elevation: 8,
                          onSelected: (String val) {
                            if (val == 'shops') _showManageShops();
                            if (val == 'cashiers') _showManageCashiers(defaultShopId);
                            if (val == 'categories') _showManageCategories();
                            if (val == 'import') _showImportSales(defaultShopId);
                            if (val == 'report') _showGenerateReport(shopCards, bounds);
                            if (val == 'excel') _exportExcel(shopCards, bounds);
                            if (val == 'pdf') _exportPdf(shopCards, bounds);
                            if (val == 'share') _shareReport(shopCards, bounds);
                          },
                          itemBuilder: (BuildContext context) => [
                            PopupMenuItem(
                              value: 'import',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.fileSpreadsheet, size: 16, color: Colors.green.shade600),
                                  const SizedBox(width: 10),
                                  const Text('Import Sales', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                ],
                              ),
                            ),
                            PopupMenuItem(
                              value: 'report',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.barChart3, size: 16, color: Colors.blue.shade600),
                                  const SizedBox(width: 10),
                                  const Text('Generate Report', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                ],
                              ),
                            ),
                            PopupMenuItem(
                              value: 'excel',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.fileDown, size: 16, color: Colors.teal.shade600),
                                  const SizedBox(width: 10),
                                  const Text('Export Excel', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                ],
                              ),
                            ),
                            PopupMenuItem(
                              value: 'pdf',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.fileText, size: 16, color: Colors.red.shade600),
                                  const SizedBox(width: 10),
                                  const Text('Export PDF', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                ],
                              ),
                            ),
                            PopupMenuItem(
                              value: 'share',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.share2, size: 16, color: Colors.amber.shade700),
                                  const SizedBox(width: 10),
                                  const Text('Share Report', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                ],
                              ),
                            ),
                            const PopupMenuDivider(),
                            const PopupMenuItem(
                              value: 'shops',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.store, size: 16),
                                  SizedBox(width: 10),
                                  Text('Manage Shops', style: TextStyle(fontSize: 13)),
                                ],
                              ),
                            ),
                            const PopupMenuItem(
                              value: 'cashiers',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.userCheck, size: 16),
                                  SizedBox(width: 10),
                                  Text('Manage Cashiers', style: TextStyle(fontSize: 13)),
                                ],
                              ),
                            ),
                            const PopupMenuItem(
                              value: 'categories',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.tag, size: 16),
                                  SizedBox(width: 10),
                                  Text('Manage Categories', style: TextStyle(fontSize: 13)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // 2. Date Filter Pills Row (Horizontal Scroll)
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildDatePill('today', 'Today', isDark),
                        _buildDatePill('yesterday', 'Yesterday', isDark),
                        _buildDatePill('week', 'Weekly', isDark),
                        _buildDatePill('month', 'Monthly', isDark),
                        _buildDatePill('custom', 'Custom', isDark),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Custom dates bounds selection
                  if (_dateRange == 'custom') ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.cardDark : Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: InkWell(
                              onTap: () async {
                                final date = await showDatePicker(
                                  context: context,
                                  initialDate: _customFrom ?? workingDateTime,
                                  firstDate: DateTime(2020),
                                  lastDate: DateTime(2100),
                                );
                                if (date != null) {
                                  setState(() {
                                    _customFrom = date;
                                    _visibleCount = 20;
                                  });
                                }
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.inputDark : AppColors.inputLight,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      _customFrom != null ? _formatDateString(_customFrom!) : 'From Date',
                                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                    ),
                                    const Icon(LucideIcons.calendar, size: 14, color: Colors.grey),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: InkWell(
                              onTap: () async {
                                final date = await showDatePicker(
                                  context: context,
                                  initialDate: _customTo ?? workingDateTime,
                                  firstDate: DateTime(2020),
                                  lastDate: DateTime(2100),
                                );
                                if (date != null) {
                                  setState(() {
                                    _customTo = date;
                                    _visibleCount = 20;
                                  });
                                }
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.inputDark : AppColors.inputLight,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      _customTo != null ? _formatDateString(_customTo!) : 'To Date',
                                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                    ),
                                    const Icon(LucideIcons.calendar, size: 14, color: Colors.grey),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // 3. PER-SHOP SUMMARY HEADER
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'PER-SHOP SUMMARY',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.8,
                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                        ),
                      ),
                      InkWell(
                        onTap: () {
                          context.read<ShopBloc>().add(
                            LoadShopEntries(defaultShopId, workingDateTime),
                          );
                        },
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(LucideIcons.refreshCw, size: 12, color: isDark ? Colors.white70 : const Color(0xFF475569)),
                              const SizedBox(width: 6),
                              Text(
                                'Refresh',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white70 : const Color(0xFF475569),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // 4. PER-SHOP SUMMARY CARDS CAROUSEL
                  SizedBox(
                    height: 245,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: shopCards.length,
                      separatorBuilder: (context, index) => const SizedBox(width: 12),
                      itemBuilder: (context, idx) {
                        final summary = shopCards[idx];
                        final isSelected = _shopFilter == summary.shop.id || (_shopFilter == 'all' && idx == 0);
                        return _buildShopSummaryCard(
                          summary: summary,
                          isSelected: isSelected,
                          isDark: isDark,
                          onTap: () {
                            setState(() {
                              _shopFilter = summary.shop.id;
                              _visibleCount = 20;
                            });
                          },
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 16),

                  // 5. SELECTED SHOP BANNER (e.g. Main Store · This Month)
                  if (_shopFilter != 'all') ...[
                    Builder(
                      builder: (context) {
                        final currentShop = _shops.firstWhere(
                          (s) => s.id == _shopFilter,
                          orElse: () => ShopModel(id: '', name: 'Main Store', createdAt: DateTime.now()),
                        );
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: const Color(0xFF24B489).withValues(alpha: 0.4),
                            ),
                          ),
                          child: Row(
                            children: [
                              const Icon(LucideIcons.store, size: 16, color: Color(0xFF0D9488)),
                              const SizedBox(width: 8),
                              Text(
                                currentShop.name,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                                  ),
                                ),
                                child: Text(
                                  _dateRange == 'month' ? 'This Month' : _dateRange.toUpperCase(),
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                  ),
                                ),
                              ),
                              const Spacer(),
                              InkWell(
                                onTap: () => setState(() => _shopFilter = 'all'),
                                borderRadius: BorderRadius.circular(16),
                                child: Icon(
                                  LucideIcons.x,
                                  size: 16,
                                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 16),
                  ],

                  // 6. RECENT ENTRIES CONTAINER CARD
                  Container(
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.cardDark : Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                        color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Header title
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  const Icon(LucideIcons.wallet, size: 18, color: Color(0xFF0D9488)),
                                  const SizedBox(width: 10),
                                  Text(
                                    '${_shopFilter == 'all' ? (_shops.isNotEmpty ? _shops.first.name : 'Main Store') : _shops.firstWhere((s) => s.id == _shopFilter, orElse: () => ShopModel(id: '', name: 'Main Store', createdAt: DateTime.now())).name} · Recent Entries',
                                    style: TextStyle(
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.bold,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                '${filteredEntries.length}',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Divider(height: 1, color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),

                        // Entry Category Filter Pills
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          child: Row(
                            children: [
                              _buildFilterPill('all', 'All'),
                              _buildFilterPill('pos_sale', 'POS Sale'),
                              _buildFilterPill('cash_sale', 'Cash Sale'),
                              _buildFilterPill('bank_sale', 'Bank Sale'),
                              _buildFilterPill('credit_sale', 'Credit Sale'),
                              Container(
                                margin: const EdgeInsets.only(left: 4),
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                                  ),
                                ),
                                child: Icon(
                                  LucideIcons.moreHorizontal,
                                  size: 14,
                                  color: isDark ? Colors.white70 : const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Dynamic Net Total banner
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'NET TOTAL (ALL ENTRIES)',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.5,
                                      color: Color(0xFF0D9488),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'This Month · ${filteredEntries.length} entries',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                'SAR ${netTotalSum.toStringAsFixed(netTotalSum.truncateToDouble() == netTotalSum ? 0 : 2)}',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0D9488),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Entries Rows list
                        paginatedEntries.isEmpty
                            ? Padding(
                                padding: const EdgeInsets.symmetric(vertical: 48),
                                child: Center(
                                  child: Column(
                                    children: [
                                      Icon(
                                        LucideIcons.inbox,
                                        size: 36,
                                        color: isDark ? Colors.white38 : Colors.grey[400],
                                      ),
                                      const SizedBox(height: 12),
                                      Text(
                                        'No matching records found in database.',
                                        style: TextStyle(
                                          color: isDark ? Colors.white70 : const Color(0xFF64748B),
                                          fontSize: 13,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              )
                            : ListView.separated(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: paginatedEntries.length,
                                separatorBuilder: (context, index) => Divider(
                                  height: 1,
                                  color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                                ),
                                itemBuilder: (context, idx) {
                                  final e = paginatedEntries[idx];
                                  final eShop = _shops.firstWhere(
                                    (s) => s.id == e.shopId,
                                    orElse: () => ShopModel(
                                      id: '',
                                      name: 'Unknown',
                                      createdAt: DateTime.now(),
                                    ),
                                  );

                                  final isOut = e.entryType != 'sale';
                                  double amtVal = 0.0;
                                  IconData trIcon = LucideIcons.shoppingCart;
                                  Color trColor = AppColors.primary;

                                  if (e.entryType == 'sale') {
                                    amtVal = e.cashSale + e.bankSale + e.creditSale - e.dueReceivable;
                                    trIcon = LucideIcons.shoppingBag;
                                    trColor = AppColors.primary;
                                  } else if (e.entryType == 'purchase') {
                                    amtVal = e.purchaseAmount;
                                    trIcon = LucideIcons.package;
                                    trColor = AppColors.warning;
                                  } else if (e.entryType == 'expense') {
                                    amtVal = e.expenseAmount;
                                    trIcon = LucideIcons.fileSpreadsheet;
                                    trColor = AppColors.destructive;
                                  } else if (e.entryType == 'withdraw') {
                                    amtVal = e.withdrawAmount;
                                    trIcon = LucideIcons.banknote;
                                    trColor = Colors.purple;
                                  }

                                  return ListTile(
                                    onTap: () => _showEntryDetails(e),
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 20,
                                      vertical: 8,
                                    ),
                                    leading: Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: trColor.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                      child: Icon(
                                        trIcon,
                                        size: 18,
                                        color: trColor,
                                      ),
                                    ),
                                    title: Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            eShop.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 13,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 6,
                                            vertical: 2,
                                          ),
                                          decoration: BoxDecoration(
                                            color: isDark ? AppColors.inputDark : AppColors.inputLight,
                                            borderRadius: BorderRadius.circular(6),
                                            border: Border.all(
                                              color: isDark ? AppColors.borderDark : AppColors.borderLight,
                                            ),
                                          ),
                                          child: Text(
                                            e.entryType.toUpperCase(),
                                            style: const TextStyle(
                                              fontSize: 9,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.grey,
                                              letterSpacing: 0.5,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    subtitle: Padding(
                                      padding: const EdgeInsets.only(top: 4.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            e.notes ?? 'No annotations entered.',
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              const Icon(
                                                LucideIcons.calendar,
                                                size: 10,
                                                color: Colors.grey,
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                _formatDateString(e.txnDate),
                                                style: const TextStyle(
                                                  fontSize: 10,
                                                  color: Colors.grey,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    trailing: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          '${isOut ? "-" : "+"}${_formatCurrency(amtVal)}',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: isOut ? AppColors.destructive : AppColors.success,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        const Icon(
                                          LucideIcons.chevronRight,
                                          size: 16,
                                          color: Colors.grey,
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),

                        // Load More Button
                        if (filteredEntries.length > paginatedEntries.length) ...[
                          const Divider(height: 1),
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Center(
                              child: OutlinedButton(
                                style: OutlinedButton.styleFrom(
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  side: BorderSide(
                                    color: isDark ? AppColors.borderDark : AppColors.borderLight,
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 12,
                                  ),
                                ),
                                child: Text(
                                  'Load More (${filteredEntries.length - paginatedEntries.length} remaining)',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                                onPressed: () {
                                  setState(() {
                                    _visibleCount += 20;
                                  });
                                },
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ),
      );
    }

      return const Center(child: Text('Failed to load shop states.'));
    }

  Widget _buildShopSummaryCard({
    required ShopCardSummary summary,
    required bool isSelected,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    final cardBg = isSelected
        ? (isDark ? const Color(0xFF132A29) : const Color(0xFFE8F5F1))
        : (isDark ? AppColors.cardDark : Colors.white);
    final borderColor = isSelected
        ? const Color(0xFF24B489)
        : (isDark ? AppColors.borderDark : const Color(0xFFE2E8F0));
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        width: 210,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: borderColor,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Top Row: Shop Icon, Name, and Status Dot
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(7),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : const Color(0xFFCCFBF1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(LucideIcons.store, color: Color(0xFF0D9488), size: 15),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    summary.shop.name,
                    style: TextStyle(
                      fontSize: 14.5,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (isSelected)
                  Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                      color: Color(0xFF10B981),
                      shape: BoxShape.circle,
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),

            // Inner Card 1: SHOP CASH POSITION
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFD1FAE5),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'SHOP CASH POSITION',
                        style: TextStyle(
                          fontSize: 8.5,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                          color: subtextColor,
                        ),
                      ),
                      Icon(LucideIcons.info, size: 11, color: subtextColor),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'SAR ${summary.cashPosition.toStringAsFixed(summary.cashPosition.truncateToDouble() == summary.cashPosition ? 0 : 2)}',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: isSelected ? const Color(0xFF0D9488) : textColor,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 6),

            // Inner Card 2: EXPECTED BANK BALANCE
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFD1FAE5),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'EXPECTED BANK BALANCE',
                        style: TextStyle(
                          fontSize: 8.5,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                          color: subtextColor,
                        ),
                      ),
                      Icon(LucideIcons.info, size: 11, color: subtextColor),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'SAR ${summary.expectedBank.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: isSelected ? const Color(0xFF0D9488) : textColor,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 6),

            // Footer Subtext
            Text(
              summary.lastDate != null ? 'Last: ${DateFormat('M/d/yyyy').format(summary.lastDate!)}' : 'No activity',
              style: TextStyle(
                fontSize: 10.5,
                color: subtextColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDatePill(String key, String label, bool isDark) {
    final active = _dateRange == key;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: InkWell(
        onTap: () {
          setState(() {
            _dateRange = key;
            _visibleCount = 20;
          });
        },
        borderRadius: BorderRadius.circular(24),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
          decoration: BoxDecoration(
            color: active
                ? const Color(0xFF24B489)
                : (isDark ? const Color(0xFF1E293B) : Colors.white),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: active
                  ? const Color(0xFF24B489)
                  : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: active
                  ? Colors.white
                  : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569)),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFilterPill(String key, String label) {
    final on = key == 'all' ? _activeFilters.isEmpty : _activeFilters.contains(key);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: () {
          setState(() {
            if (key == 'all') {
              _activeFilters.clear();
            } else {
              if (_activeFilters.contains(key)) {
                _activeFilters.remove(key);
              } else {
                _activeFilters.add(key);
              }
            }
            _visibleCount = 20;
          });
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: on
                ? const Color(0xFF24B489)
                : (isDark ? const Color(0xFF1E293B) : Colors.white),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: on
                  ? const Color(0xFF24B489)
                  : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: on
                  ? Colors.white
                  : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569)),
            ),
          ),
        ),
      ),
    );
  }
}

// Helper Class definitions for clean state mapping

class DateRangeBounds {
  final DateTime from;
  final DateTime to;
  DateRangeBounds({required this.from, required this.to});
}

class ShopCardSummary {
  final ShopModel shop;
  final double cashPosition;
  final double expectedBank;
  final DateTime? lastDate;

  ShopCardSummary({
    required this.shop,
    required this.cashPosition,
    required this.expectedBank,
    this.lastDate,
  });
}

class DuplicateEntry {
  final bool isHard;
  final String label;
  final String message;
  final double amount;
  final ShopEntryModel existingEntry;

  DuplicateEntry({
    required this.isHard,
    required this.label,
    required this.message,
    required this.amount,
    required this.existingEntry,
  });
}

class ParsedRowMock {
  final int idx;
  final String date;
  final String shopName;
  final String cashierName;
  final double pos;
  final double cash;
  final double bank;
  final double credit;
  final double total;
  final double diff;
  final String status;
  final String tooltip;
  ParsedRowMock({
    required this.idx,
    required this.date,
    required this.shopName,
    required this.cashierName,
    required this.pos,
    required this.cash,
    required this.bank,
    required this.credit,
    required this.total,
    required this.diff,
    required this.status,
    required this.tooltip,
  });
}

class ShopStats {
  final double pos;
  final double cash;
  final double bank;
  final double credit;
  final double totalSale;
  final double purchase;
  final double expense;
  final double withdraw;
  final double diff;
  ShopStats({
    required this.pos,
    required this.cash,
    required this.bank,
    required this.credit,
    required this.totalSale,
    required this.purchase,
    required this.expense,
    required this.withdraw,
    required this.diff,
  });
}

class _ReportRow {
  final String name;
  final double pos;
  final double cash;
  final double bank;
  final double credit;
  final double total;
  final double purchase;
  final double expense;
  final double withdraw;
  final double diff;
  _ReportRow({
    required this.name,
    required this.pos,
    required this.cash,
    required this.bank,
    required this.credit,
    required this.total,
    required this.purchase,
    required this.expense,
    required this.withdraw,
    required this.diff,
  });
}
