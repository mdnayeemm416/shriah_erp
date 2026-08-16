import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import 'package:intl/intl.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import 'package:share_plus/share_plus.dart';
import 'package:printing/printing.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:dio/dio.dart';
import 'package:url_launcher/url_launcher.dart';
import '../common_widgets/smart_image_widget.dart';

import '../../blocs/shop/shop_bloc.dart';
import '../../blocs/shop/shop_event.dart';
import '../../blocs/shop/shop_state.dart';
import '../../blocs/working_date/working_date_cubit.dart';
import '../../models/shop_model.dart';
import '../../models/cashier_model.dart';
import '../../models/shop_entry_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints/api_endpoints.dart';
import '../../repositories/shop_repository.dart';
import 'components/shop_models.dart';
import 'components/new_entry_bottom_sheet.dart';

class ShopScreen extends StatefulWidget {
  const ShopScreen({super.key});

  @override
  State<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> with TickerProviderStateMixin {
  late TabController _formTabController;

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

  bool _initialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialized) {
      _initialized = true;
      _triggerFilteredLoad();
    }
  }

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

    Future<void> saveCallback() async {
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

      // Show a loading dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );

      try {
        final isUpdate = _editingEntry != null;
        await context.read<ShopBloc>().shopRepository.saveEntry(
          updatedOrNew,
          isUpdate: isUpdate,
        );

        if (mounted) {
          Navigator.pop(context); // Close loading dialog
          Navigator.pop(context); // Close bottom sheet
          _clearForm();

          final bloc = context.read<ShopBloc>();
          final currentState = bloc.state;
          if (currentState is ShopLoaded) {
            bloc.add(
              LoadShops(
                period: currentState.period,
                startDate: currentState.startDate,
                endDate: currentState.endDate,
                date: currentState.date,
              ),
            );
          }

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                isUpdate
                    ? 'Entry updated successfully.'
                    : 'Entry saved successfully.',
              ),
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          Navigator.pop(context); // Close loading dialog ONLY
          String errMsg = e.toString();
          if (e is DioException) {
            final resData = e.response?.data;
            if (resData is Map && resData.containsKey('message')) {
              errMsg = resData['message'];
            } else if (e.response?.statusMessage != null) {
              errMsg = e.response!.statusMessage!;
            }
          }
          if (errMsg.startsWith('Exception: ')) {
            errMsg = errMsg.substring('Exception: '.length);
          }
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to save entry: $errMsg'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }

    if (duplicate != null) {
      _showDuplicateWarning(duplicate, saveCallback);
    } else {
      saveCallback();
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

                      if (entry.attachmentUrl != null &&
                          entry.attachmentUrl!.isNotEmpty) ...[
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
                        Builder(
                          builder: (context) {
                            final url = entry.attachmentUrl!;
                            final isImage = _isImageAttachment(url);
                            return InkWell(
                              onTap: () {
                                if (isImage) {
                                  _showFullScreenImage(context, url);
                                } else {
                                  _openAttachment(url);
                                }
                              },
                              borderRadius: BorderRadius.circular(16),
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  border: Border.all(
                                    color: AppColors.primary.withValues(
                                      alpha: 0.3,
                                    ),
                                  ),
                                  color: AppColors.primary.withValues(
                                    alpha: 0.05,
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Icon(
                                          isImage
                                              ? LucideIcons.image
                                              : LucideIcons.fileText,
                                          size: 16,
                                          color: AppColors.primary,
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Text(
                                            url
                                                .split(Platform.pathSeparator)
                                                .last,
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: AppColors.primary,
                                              fontWeight: FontWeight.bold,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        Icon(
                                          LucideIcons.eye,
                                          size: 14,
                                          color: AppColors.primary.withValues(
                                            alpha: 0.7,
                                          ),
                                        ),
                                      ],
                                    ),
                                    if (isImage) ...[
                                      const SizedBox(height: 10),
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(12),
                                        child: SizedBox(
                                          height: 150,
                                          width: double.infinity,
                                          child: SmartImageWidget(
                                            imageUrl: url,
                                            fit: BoxFit.cover,
                                            fallbackWidget: Container(
                                              color: Colors.grey.withValues(
                                                alpha: 0.1,
                                              ),
                                              child: const Icon(
                                                LucideIcons.imageOff,
                                                size: 28,
                                                color: Colors.grey,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            );
                          },
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
    final isDark = Theme.of(context).brightness == Brightness.dark;

    NewEntryBottomSheet.show(
      context: context,
      defaultShopId: defaultShopId,
      editingEntry: entry,
      shops: _shops,
      cashiers: _cashiers,
      isDark: isDark,
      onSubmit: (data) {
        _editingEntry = entry;
        _formShopId = data['shop_id'];
        _formDate = data['txn_date'];
        _selectedCashierId = data['cashier_id'];

        _posSaleController.text = data['pos_sale'].toString();
        _cashSaleController.text = data['cash_sale'].toString();
        _bankSaleController.text = data['bank_sale'].toString();
        _creditSaleController.text = data['credit_sale'].toString();
        _dueReceivableController.text = data['due_receivable'].toString();
        _purchaseController.text = data['purchase_amount'].toString();
        _expenseController.text = data['expense_amount'].toString();
        _withdrawController.text = data['withdraw_amount'].toString();
        _notesController.text = data['notes'] ?? '';
        _attachmentController.text = data['attachment_url'] ?? '';

        final activeShop = _shops.firstWhere(
          (s) => s.id == _formShopId,
          orElse: () => ShopModel(id: '', name: '', createdAt: DateTime.now()),
        );
        final simple = activeShop.shopType == 'simple_cash';

        int tabIdx = 0;
        final entryType = data['entry_type'] as String;
        if (simple) {
          tabIdx = entryType == 'sale' ? 0 : 1;
        } else {
          if (entryType == 'sale') tabIdx = 0;
          if (entryType == 'purchase') tabIdx = 1;
          if (entryType == 'expense') tabIdx = 2;
          if (entryType == 'withdraw') tabIdx = 3;
        }
        _formTabController.index = tabIdx;

        _submitForm(defaultShopId);
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
    final cashController = TextEditingController(text: '0');
    String shopType = 'full_erp';
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return Dialog(
              insetPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 24,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(28),
              ),
              backgroundColor: isDark
                  ? AppColors.cardDark
                  : const Color(0xFFFAFAFA),
              child: ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 440,
                  maxHeight: 680,
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // 1. Header with title & close button
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Manage Shops',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: isDark
                                  ? Colors.white
                                  : const Color(0xFF0F172A),
                            ),
                          ),
                          InkWell(
                            onTap: () => Navigator.pop(context),
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: const Color(0xFF2DD4BF),
                                  width: 1.5,
                                ),
                              ),
                              child: const Icon(
                                LucideIcons.x,
                                size: 16,
                                color: Color(0xFF0D9488),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // 2. Form Inputs
                      // Shop Name
                      Text(
                        'Shop name',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: isDark
                              ? Colors.grey.shade300
                              : const Color(0xFF334155),
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: nameController,
                        style: TextStyle(
                          fontSize: 14,
                          color: isDark
                              ? Colors.white
                              : const Color(0xFF0F172A),
                        ),
                        decoration: InputDecoration(
                          hintText: 'e.g. Main branch',
                          hintStyle: TextStyle(
                            color: isDark
                                ? Colors.grey.shade500
                                : const Color(0xFF94A3B8),
                            fontSize: 13,
                          ),
                          fillColor: isDark
                              ? AppColors.inputDark
                              : Colors.white,
                          filled: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Opening Cash
                      Text(
                        'Opening cash',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: isDark
                              ? Colors.grey.shade300
                              : const Color(0xFF334155),
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: cashController,
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                        style: TextStyle(
                          fontSize: 14,
                          color: isDark
                              ? Colors.white
                              : const Color(0xFF0F172A),
                        ),
                        decoration: InputDecoration(
                          fillColor: isDark
                              ? AppColors.inputDark
                              : Colors.white,
                          filled: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Type Dropdown
                      Text(
                        'Type',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: isDark
                              ? Colors.grey.shade300
                              : const Color(0xFF334155),
                        ),
                      ),
                      const SizedBox(height: 6),
                      DropdownButtonFormField<String>(
                        initialValue: shopType,
                        decoration: InputDecoration(
                          fillColor: isDark
                              ? AppColors.inputDark
                              : Colors.white,
                          filled: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                        ),
                        icon: Icon(
                          LucideIcons.chevronDown,
                          size: 18,
                          color: isDark
                              ? Colors.white
                              : const Color(0xFF334155),
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: 'full_erp',
                            child: Text(
                              'Full ERP',
                              style: TextStyle(fontSize: 13),
                            ),
                          ),
                          DropdownMenuItem(
                            value: 'simple_cash',
                            child: Text(
                              'Simple Cash',
                              style: TextStyle(fontSize: 13),
                            ),
                          ),
                        ],
                        onChanged: (val) {
                          if (val != null) setDialogState(() => shopType = val);
                        },
                      ),
                      const SizedBox(height: 18),

                      // + Add Button
                      SizedBox(
                        height: 48,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF24B489),
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                          onPressed: () async {
                            final name = nameController.text.trim();
                            if (name.isEmpty) return;
                            final cashVal =
                                double.tryParse(cashController.text.trim()) ??
                                0.0;
                            final repo = ShopRepository();
                            final newShop = ShopModel(
                              id: 'shop-${DateTime.now().millisecondsSinceEpoch}',
                              name: name,
                              shopType: shopType,
                              openingCash: cashVal,
                              createdAt: DateTime.now(),
                            );
                            await repo.saveShop(newShop);
                            if (!mounted) return;
                            _triggerFilteredLoad();
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Shop added successfully.'),
                              ),
                            );
                          },
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(LucideIcons.plus, size: 18),
                              SizedBox(width: 6),
                              Text(
                                'Add',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 18),

                      // 3. Shop List Container Card
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.inputDark : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          child: _shops.isEmpty
                              ? const Center(
                                  child: Text(
                                    'No shops found.',
                                    style: TextStyle(color: Colors.grey),
                                  ),
                                )
                              : ListView.separated(
                                  padding: const EdgeInsets.all(12),
                                  itemCount: _shops.length,
                                  separatorBuilder: (context, index) =>
                                      const Divider(
                                        height: 1,
                                        color: Color(0xFFF1F5F9),
                                      ),
                                  itemBuilder: (context, idx) {
                                    final s = _shops[idx];
                                    final isSimple =
                                        s.shopType == 'simple_cash';
                                    final openingVal =
                                        s.openingCash ??
                                        (isSimple ? 3000.0 : 5000.0);
                                    final formattedCash = NumberFormat(
                                      '#,##0.00',
                                    ).format(openingVal);

                                    return Padding(
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 8,
                                      ),
                                      child: Row(
                                        children: [
                                          // Left info
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    Flexible(
                                                      child: Text(
                                                        s.name,
                                                        style: TextStyle(
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          fontSize: 14,
                                                          color: isDark
                                                              ? Colors.white
                                                              : const Color(
                                                                  0xFF0F172A,
                                                                ),
                                                        ),
                                                        overflow: TextOverflow
                                                            .ellipsis,
                                                      ),
                                                    ),
                                                    const SizedBox(width: 6),
                                                    Container(
                                                      padding:
                                                          const EdgeInsets.symmetric(
                                                            horizontal: 6,
                                                            vertical: 2,
                                                          ),
                                                      decoration: BoxDecoration(
                                                        color: const Color(
                                                          0xFFCCFBF1,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius.circular(
                                                              10,
                                                            ),
                                                      ),
                                                      child: Text(
                                                        isSimple
                                                            ? 'CASH'
                                                            : 'ERP',
                                                        style: const TextStyle(
                                                          color: Color(
                                                            0xFF0D9488,
                                                          ),
                                                          fontSize: 9,
                                                          fontWeight:
                                                              FontWeight.w800,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                const SizedBox(height: 3),
                                                Text(
                                                  'Opening · SAR  $formattedCash',
                                                  style: TextStyle(
                                                    fontSize: 12,
                                                    color: isDark
                                                        ? Colors.grey.shade400
                                                        : const Color(
                                                            0xFF64748B,
                                                          ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          const SizedBox(width: 8),

                                          // Dropdown selector
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 0,
                                            ),
                                            decoration: BoxDecoration(
                                              color: isDark
                                                  ? AppColors.cardDark
                                                  : const Color(0xFFF8FAFC),
                                              borderRadius:
                                                  BorderRadius.circular(16),
                                              border: Border.all(
                                                color: isDark
                                                    ? AppColors.borderDark
                                                    : const Color(0xFFE2E8F0),
                                              ),
                                            ),
                                            child: DropdownButtonHideUnderline(
                                              child: DropdownButton<String>(
                                                value: s.shopType ?? 'full_erp',
                                                isDense: true,
                                                icon: const Icon(
                                                  LucideIcons.chevronDown,
                                                  size: 14,
                                                ),
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w500,
                                                  color: isDark
                                                      ? Colors.white
                                                      : const Color(0xFF1E293B),
                                                ),
                                                items: const [
                                                  DropdownMenuItem(
                                                    value: 'full_erp',
                                                    child: Text('Full ERP'),
                                                  ),
                                                  DropdownMenuItem(
                                                    value: 'simple_cash',
                                                    child: Text('Simple Cash'),
                                                  ),
                                                ],
                                                onChanged: (newType) async {
                                                  if (newType != null &&
                                                      newType != s.shopType) {
                                                    final repo =
                                                        ShopRepository();
                                                    await repo.saveShop(
                                                      s.copyWith(
                                                        shopType: newType,
                                                      ),
                                                    );
                                                    if (!mounted) return;
                                                    _triggerFilteredLoad();
                                                    setDialogState(() {});
                                                  }
                                                },
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 4),

                                          // Delete icon button
                                          IconButton(
                                            icon: const Icon(
                                              LucideIcons.trash2,
                                              size: 16,
                                              color: Color(0xFF94A3B8),
                                            ),
                                            onPressed: () async {
                                              final navigator = Navigator.of(context);
                                              final scaffoldMessenger = ScaffoldMessenger.of(context);

                                              final confirm = await showDialog<bool>(
                                                context: context,
                                                builder: (dialogContext) => AlertDialog(
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius: BorderRadius.circular(20),
                                                  ),
                                                  title: const Text(
                                                    'Delete Shop?',
                                                    style: TextStyle(fontWeight: FontWeight.w900),
                                                  ),
                                                  content: Text(
                                                    'Are you sure you want to delete "${s.name}"? This action cannot be undone.',
                                                  ),
                                                  actions: [
                                                    TextButton(
                                                      onPressed: () => Navigator.pop(dialogContext, false),
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
                                                      onPressed: () => Navigator.pop(dialogContext, true),
                                                      child: const Text('Delete'),
                                                    ),
                                                  ],
                                                ),
                                              );
                                              if (confirm != true) return;

                                              try {
                                                final repo = ShopRepository();
                                                await repo.deleteShop(s.id);
                                                if (!mounted) return;
                                                _triggerFilteredLoad();
                                                navigator.pop();
                                                scaffoldMessenger.showSnackBar(
                                                  const SnackBar(
                                                    content: Text(
                                                      'Shop deleted successfully.',
                                                    ),
                                                  ),
                                                );
                                              } catch (e) {
                                                scaffoldMessenger.showSnackBar(
                                                  SnackBar(
                                                    content: Text(
                                                      'Failed to delete shop: $e',
                                                    ),
                                                  ),
                                                );
                                              }
                                            },
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _showManageCashiers(String initialShopId) {
    String selectedShopId = _shops.any((s) => s.id == initialShopId)
        ? initialShopId
        : (_shops.isNotEmpty ? _shops.first.id : '');
    final searchController = TextEditingController();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return BlocBuilder<ShopBloc, ShopState>(
          builder: (dialogContext, shopState) {
            List<ShopModel> currentShops = _shops;
            List<CashierModel> currentCashiers = _cashiers;

            if (shopState is ShopLoaded) {
              currentShops = shopState.shops;
              currentCashiers = shopState.cashiers;
            }

            return StatefulBuilder(
              builder: (context, setDialogState) {
                final query = searchController.text.trim().toLowerCase();
                final filteredShops = currentShops.where((s) {
                  return s.name.toLowerCase().contains(query);
                }).toList();

                final selectedShop = currentShops.firstWhere(
                  (s) => s.id == selectedShopId,
                  orElse: () => ShopModel(
                    id: '',
                    name: 'Main Store',
                    createdAt: DateTime.now(),
                  ),
                );

                final activeCashiers = currentCashiers
                    .where((c) => c.shopId == selectedShopId && !c.isDeleted)
                    .toList();

                return Dialog(
                  insetPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 24,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                  backgroundColor: isDark
                      ? AppColors.cardDark
                      : const Color(0xFFFAFAFA),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(
                      maxWidth: 440,
                      maxHeight: 680,
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Header title & Close Button
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Cashiers',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: isDark
                                      ? Colors.white
                                      : const Color(0xFF0F172A),
                                ),
                              ),
                              IconButton(
                                icon: Icon(
                                  LucideIcons.x,
                                  size: 18,
                                  color: isDark
                                      ? Colors.grey.shade400
                                      : const Color(0xFF64748B),
                                ),
                                onPressed: () => Navigator.pop(context),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),

                          // Outer Card Container
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? AppColors.inputDark
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(
                                  color: isDark
                                      ? AppColors.borderDark
                                      : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Inner Header: Cashiers + Add cashier button
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: [
                                          const Icon(
                                            LucideIcons.users,
                                            size: 20,
                                            color: Color(0xFF0D9488),
                                          ),
                                          const SizedBox(width: 8),
                                          Text(
                                            'Cashiers',
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                              color: isDark
                                                  ? Colors.white
                                                  : const Color(0xFF0F172A),
                                            ),
                                          ),
                                        ],
                                      ),
                                      ElevatedButton.icon(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color(
                                            0xFF24B489,
                                          ),
                                          foregroundColor: Colors.white,
                                          elevation: 0,
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 14,
                                            vertical: 8,
                                          ),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              20,
                                            ),
                                          ),
                                        ),
                                        onPressed: () {
                                          _showAddCashierDialog(
                                            selectedShopId,
                                            onCashierAdded: () {
                                              setDialogState(() {});
                                            },
                                          );
                                        },
                                        icon: const Icon(
                                          LucideIcons.plus,
                                          size: 16,
                                        ),
                                        label: const Text(
                                          'Add cashier',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 14),

                                  // Search Bar
                                  TextField(
                                    controller: searchController,
                                    onChanged: (_) => setDialogState(() {}),
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: isDark
                                          ? Colors.white
                                          : const Color(0xFF0F172A),
                                    ),
                                    decoration: InputDecoration(
                                      hintText: 'Search shops...',
                                      hintStyle: TextStyle(
                                        color: isDark
                                            ? Colors.grey.shade500
                                            : const Color(0xFF94A3B8),
                                        fontSize: 13,
                                      ),
                                      prefixIcon: Icon(
                                        LucideIcons.search,
                                        size: 16,
                                        color: isDark
                                            ? Colors.grey.shade400
                                            : const Color(0xFF94A3B8),
                                      ),
                                      fillColor: isDark
                                          ? AppColors.cardDark
                                          : const Color(0xFFFAFAFA),
                                      filled: true,
                                      contentPadding:
                                          const EdgeInsets.symmetric(
                                            horizontal: 14,
                                            vertical: 10,
                                          ),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(16),
                                        borderSide: BorderSide(
                                          color: isDark
                                              ? AppColors.borderDark
                                              : const Color(0xFFE2E8F0),
                                        ),
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(16),
                                        borderSide: BorderSide(
                                          color: isDark
                                              ? AppColors.borderDark
                                              : const Color(0xFFE2E8F0),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 14),

                                  // SHOPS Section Card
                                  Container(
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(18),
                                      border: Border.all(
                                        color: isDark
                                            ? AppColors.borderDark
                                            : const Color(0xFFE2E8F0),
                                      ),
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.only(
                                            left: 12,
                                            top: 10,
                                            bottom: 6,
                                          ),
                                          child: Text(
                                            'SHOPS',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w700,
                                              color: isDark
                                                  ? Colors.grey.shade400
                                                  : const Color(0xFF64748B),
                                              letterSpacing: 0.6,
                                            ),
                                          ),
                                        ),
                                        ConstrainedBox(
                                          constraints: const BoxConstraints(
                                            maxHeight: 140,
                                          ),
                                          child: filteredShops.isEmpty
                                              ? const Padding(
                                                  padding: EdgeInsets.all(12.0),
                                                  child: Text(
                                                    'No shops found.',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                )
                                              : ListView.builder(
                                                  shrinkWrap: true,
                                                  padding: EdgeInsets.zero,
                                                  itemCount:
                                                      filteredShops.length,
                                                  itemBuilder: (context, idx) {
                                                    final shop =
                                                        filteredShops[idx];
                                                    final isSelected =
                                                        shop.id ==
                                                        selectedShopId;
                                                    final count =
                                                        currentCashiers
                                                            .where(
                                                              (c) =>
                                                                  c.shopId ==
                                                                      shop.id &&
                                                                  !c.isDeleted,
                                                            )
                                                            .length;

                                                    return InkWell(
                                                      onTap: () {
                                                        setDialogState(() {
                                                          selectedShopId =
                                                              shop.id;
                                                        });
                                                      },
                                                      child: Container(
                                                        padding:
                                                            const EdgeInsets.symmetric(
                                                              horizontal: 12,
                                                              vertical: 10,
                                                            ),
                                                        decoration: BoxDecoration(
                                                          color: isSelected
                                                              ? (isDark
                                                                    ? AppColors
                                                                          .primary
                                                                          .withValues(
                                                                            alpha:
                                                                                0.2,
                                                                          )
                                                                    : const Color(
                                                                        0xFFE6F4F1,
                                                                      ))
                                                              : Colors
                                                                    .transparent,
                                                        ),
                                                        child: Row(
                                                          children: [
                                                            Container(
                                                              padding:
                                                                  const EdgeInsets.all(
                                                                    6,
                                                                  ),
                                                              decoration: BoxDecoration(
                                                                color:
                                                                    const Color(
                                                                      0xFFCCFBF1,
                                                                    ),
                                                                borderRadius:
                                                                    BorderRadius.circular(
                                                                      10,
                                                                    ),
                                                              ),
                                                              child: const Icon(
                                                                LucideIcons
                                                                    .store,
                                                                size: 14,
                                                                color: Color(
                                                                  0xFF0D9488,
                                                                ),
                                                              ),
                                                            ),
                                                            const SizedBox(
                                                              width: 10,
                                                            ),
                                                            Expanded(
                                                              child: Text(
                                                                shop.name,
                                                                style: TextStyle(
                                                                  fontSize: 13,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w600,
                                                                  color: isDark
                                                                      ? Colors
                                                                            .white
                                                                      : const Color(
                                                                          0xFF0F172A,
                                                                        ),
                                                                ),
                                                              ),
                                                            ),
                                                            Container(
                                                              padding:
                                                                  const EdgeInsets.symmetric(
                                                                    horizontal:
                                                                        8,
                                                                    vertical: 2,
                                                                  ),
                                                              decoration: BoxDecoration(
                                                                color: isDark
                                                                    ? Colors
                                                                          .grey
                                                                          .shade800
                                                                    : const Color(
                                                                        0xFFF1F5F9,
                                                                      ),
                                                                borderRadius:
                                                                    BorderRadius.circular(
                                                                      10,
                                                                    ),
                                                              ),
                                                              child: Text(
                                                                '$count',
                                                                style: TextStyle(
                                                                  fontSize: 11,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .bold,
                                                                  color: isDark
                                                                      ? Colors
                                                                            .grey
                                                                            .shade300
                                                                      : const Color(
                                                                          0xFF64748B,
                                                                        ),
                                                                ),
                                                              ),
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    );
                                                  },
                                                ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 14),

                                  // CASHIERS OF [SHOP NAME] Section Card
                                  Expanded(
                                    child: Container(
                                      width: double.infinity,
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(18),
                                        border: Border.all(
                                          color: isDark
                                              ? AppColors.borderDark
                                              : const Color(0xFFE2E8F0),
                                        ),
                                      ),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.only(
                                              left: 12,
                                              top: 10,
                                              bottom: 6,
                                            ),
                                            child: Text(
                                              'CASHIERS OF ${selectedShop.name.toUpperCase()}',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.w700,
                                                color: isDark
                                                    ? Colors.grey.shade400
                                                    : const Color(0xFF64748B),
                                                letterSpacing: 0.6,
                                              ),
                                            ),
                                          ),
                                          const Divider(height: 1),
                                          Expanded(
                                            child: activeCashiers.isEmpty
                                                ? const Center(
                                                    child: Text(
                                                      'No cashiers yet.',
                                                      style: TextStyle(
                                                        fontSize: 13,
                                                        color: Color(
                                                          0xFF64748B,
                                                        ),
                                                      ),
                                                    ),
                                                  )
                                                : ListView.separated(
                                                    padding:
                                                        const EdgeInsets.all(8),
                                                    itemCount:
                                                        activeCashiers.length,
                                                    separatorBuilder:
                                                        (context, idx) =>
                                                            const Divider(
                                                              height: 1,
                                                            ),
                                                    itemBuilder: (context, idx) {
                                                      final cashier =
                                                          activeCashiers[idx];
                                                      return ListTile(
                                                        dense: true,
                                                        leading:
                                                            const CircleAvatar(
                                                              radius: 12,
                                                              backgroundColor:
                                                                  Color(
                                                                    0xFF24B489,
                                                                  ),
                                                              child: Icon(
                                                                LucideIcons
                                                                    .user,
                                                                size: 12,
                                                                color: Colors
                                                                    .white,
                                                              ),
                                                            ),
                                                        title: Text(
                                                          cashier.name,
                                                          style: TextStyle(
                                                            fontWeight:
                                                                FontWeight.bold,
                                                            fontSize: 13,
                                                            color: isDark
                                                                ? Colors.white
                                                                : const Color(
                                                                    0xFF0F172A,
                                                                  ),
                                                          ),
                                                        ),
                                                        trailing: IconButton(
                                                          icon: const Icon(
                                                            LucideIcons.trash2,
                                                            size: 16,
                                                            color: Color(
                                                              0xFF94A3B8,
                                                            ),
                                                          ),
                                                          onPressed: () async {
                                                            final repo =
                                                                ShopRepository();
                                                            await repo.saveCashier(
                                                              cashier.copyWith(
                                                                isDeleted: true,
                                                              ),
                                                            );
                                                            if (!mounted)
                                                              return;
                                                            _triggerFilteredLoad();
                                                            setDialogState(
                                                              () {},
                                                            );
                                                          },
                                                        ),
                                                      );
                                                    },
                                                  ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  void _showAddCashierDialog(
    String preselectedShopId, {
    required VoidCallback onCashierAdded,
  }) {
    final nameController = TextEditingController();
    String selectedShopId = _shops.any((s) => s.id == preselectedShopId)
        ? preselectedShopId
        : (_shops.isNotEmpty ? _shops.first.id : '');
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
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 360),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Header title & Close Button
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'New cashier',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: isDark
                                  ? Colors.white
                                  : const Color(0xFF0F172A),
                            ),
                          ),
                          IconButton(
                            icon: Icon(
                              LucideIcons.x,
                              size: 18,
                              color: isDark
                                  ? Colors.grey.shade400
                                  : const Color(0xFF64748B),
                            ),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Name Field
                      Text(
                        'Name',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: isDark
                              ? Colors.grey.shade300
                              : const Color(0xFF334155),
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: nameController,
                        style: TextStyle(
                          fontSize: 14,
                          color: isDark
                              ? Colors.white
                              : const Color(0xFF0F172A),
                        ),
                        decoration: InputDecoration(
                          hintText: 'e.g. Anwer',
                          hintStyle: TextStyle(
                            color: isDark
                                ? Colors.grey.shade500
                                : const Color(0xFF94A3B8),
                            fontSize: 13,
                          ),
                          fillColor: isDark
                              ? AppColors.inputDark
                              : const Color(0xFFFAFAFA),
                          filled: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                              color: Color(0xFF24B489),
                              width: 1.5,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Shop Field
                      Text(
                        'Shop',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: isDark
                              ? Colors.grey.shade300
                              : const Color(0xFF334155),
                        ),
                      ),
                      const SizedBox(height: 6),
                      DropdownButtonFormField<String>(
                        initialValue: selectedShopId.isNotEmpty
                            ? selectedShopId
                            : null,
                        decoration: InputDecoration(
                          fillColor: isDark
                              ? AppColors.inputDark
                              : const Color(0xFFFAFAFA),
                          filled: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                        ),
                        icon: Icon(
                          LucideIcons.chevronDown,
                          size: 18,
                          color: isDark
                              ? Colors.white
                              : const Color(0xFF64748B),
                        ),
                        items: _shops.map((s) {
                          return DropdownMenuItem<String>(
                            value: s.id,
                            child: Text(
                              s.name,
                              style: const TextStyle(fontSize: 13),
                            ),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null)
                            setDialogState(() => selectedShopId = val);
                        },
                      ),
                      const SizedBox(height: 20),

                      // Save Button
                      SizedBox(
                        height: 46,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF24B489),
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                          onPressed: () async {
                            final name = nameController.text.trim();
                            if (name.isEmpty || selectedShopId.isEmpty) return;
                            final repo = ShopRepository();
                            final newCashier = CashierModel(
                              id: 'cashier-${DateTime.now().millisecondsSinceEpoch}',
                              name: name,
                              shopId: selectedShopId,
                            );
                            await repo.saveCashier(newCashier);
                            if (!context.mounted) return;
                            _triggerFilteredLoad();
                            onCashierAdded();
                            Navigator.pop(context);
                          },
                          child: const Text(
                            'Save',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
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

    String stage = 'upload'; // 'upload' | 'importing' | 'done'
    double progress = 0.0;
    PlatformFile? pickedFile;
    Map<String, dynamic>? importedStats;

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
                                  // Pick container
                                  InkWell(
                                    onTap: () async {
                                      try {
                                        final result =
                                            await FilePicker.pickFiles(
                                              type: FileType.custom,
                                              allowedExtensions: ['csv'],
                                              withData: true,
                                            );
                                        if (result != null &&
                                            result.files.isNotEmpty) {
                                          setImportState(() {
                                            pickedFile = result.files.first;
                                          });
                                        }
                                      } catch (e) {
                                        if (context.mounted) {
                                          ScaffoldMessenger.of(
                                            context,
                                          ).showSnackBar(
                                            SnackBar(
                                              content: Text(
                                                'Error picking file: $e',
                                              ),
                                            ),
                                          );
                                        }
                                      }
                                    },
                                    borderRadius: BorderRadius.circular(20),
                                    child: Container(
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
                                          Text(
                                            pickedFile != null
                                                ? pickedFile!.name
                                                : 'Select Shop CSV Report File',
                                            textAlign: TextAlign.center,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.w900,
                                              fontSize: 14,
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            pickedFile != null
                                                ? '${(pickedFile!.size / 1024).toStringAsFixed(1)} KB · Click to change'
                                                : 'Tap here to select the CSV file from your device.',
                                            textAlign: TextAlign.center,
                                            style: const TextStyle(
                                              fontSize: 11,
                                              color: Colors.grey,
                                              height: 1.3,
                                            ),
                                          ),
                                        ],
                                      ),
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
                                      'Upload & Import CSV',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    onPressed: pickedFile == null
                                        ? null
                                        : () async {
                                            setImportState(() {
                                              stage = 'importing';
                                              progress = 0.1;
                                            });

                                            try {
                                              FormData formData;
                                              if (pickedFile!.path != null) {
                                                formData = FormData.fromMap({
                                                  'file':
                                                      await MultipartFile.fromFile(
                                                        pickedFile!.path!,
                                                        filename:
                                                            pickedFile!.name,
                                                      ),
                                                });
                                              } else {
                                                formData = FormData.fromMap({
                                                  'file':
                                                      MultipartFile.fromBytes(
                                                        pickedFile!.bytes!,
                                                        filename:
                                                            pickedFile!.name,
                                                      ),
                                                });
                                              }

                                              setImportState(() {
                                                progress = 0.4;
                                              });

                                              final response = await ApiClient()
                                                  .dio
                                                  .post(
                                                    ApiEndpoints.shopImportCsv,
                                                    data: formData,
                                                  );

                                              setImportState(() {
                                                progress = 0.8;
                                              });

                                              if (response.statusCode == 200 &&
                                                  response.data is Map) {
                                                final body =
                                                    Map<String, dynamic>.from(
                                                      response.data as Map,
                                                    );
                                                if (body['success'] == true) {
                                                  final stats =
                                                      Map<String, dynamic>.from(
                                                        body['data'] as Map,
                                                      );

                                                  // Refresh local list via shop bloc
                                                  _triggerFilteredLoad();

                                                  setImportState(() {
                                                    stage = 'done';
                                                    progress = 1.0;
                                                    importedStats = stats;
                                                  });
                                                  return;
                                                } else {
                                                  throw Exception(
                                                    body['message'] ??
                                                        'Import failed',
                                                  );
                                                }
                                              } else {
                                                throw Exception(
                                                  'Server returned status ${response.statusCode}',
                                                );
                                              }
                                            } catch (e) {
                                              if (context.mounted) {
                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(
                                                  SnackBar(
                                                    content: Text(
                                                      'Import failed: ${e.toString()}',
                                                    ),
                                                  ),
                                                );
                                              }
                                              setImportState(() {
                                                stage = 'upload';
                                              });
                                            }
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
                                            'Expected Headers: Date, Time, Shop, Cashier, Type, Notes, POS Sale, Cash Sale, Bank Sale, Credit Sale, Purchase, Expense, Withdraw, Difference, Total',
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
                          : SingleChildScrollView(
                              padding: const EdgeInsets.all(24),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.green.withValues(
                                        alpha: 0.1,
                                      ),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      LucideIcons.checkCircle2,
                                      color: Colors.green,
                                      size: 48,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  const Text(
                                    'Import Process Complete!',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w900,
                                      fontSize: 16,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  if (importedStats != null) ...[
                                    Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color: isDark
                                            ? AppColors.inputDark
                                            : AppColors.inputLight,
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Column(
                                        children: [
                                          _buildStatRow(
                                            'Entries Imported',
                                            '${importedStats!['entriesImported'] ?? 0}',
                                          ),
                                          _buildStatRow(
                                            'Shops Auto-Created',
                                            '${importedStats!['shopsAutoCreated'] ?? 0}',
                                          ),
                                          _buildStatRow(
                                            'Cashiers Auto-Created',
                                            '${importedStats!['cashiersAutoCreated'] ?? 0}',
                                          ),
                                          const Divider(height: 16),
                                          _buildStatRow(
                                            'Total POS Sales',
                                            '৳${(importedStats!['totalPosSales'] as num? ?? 0).toStringAsFixed(2)}',
                                          ),
                                          _buildStatRow(
                                            'Total Cash Sales',
                                            '৳${(importedStats!['totalCashSales'] as num? ?? 0).toStringAsFixed(2)}',
                                          ),
                                          _buildStatRow(
                                            'Total Purchases',
                                            '৳${(importedStats!['totalPurchases'] as num? ?? 0).toStringAsFixed(2)}',
                                          ),
                                          _buildStatRow(
                                            'Total Expenses',
                                            '৳${(importedStats!['totalExpenses'] as num? ?? 0).toStringAsFixed(2)}',
                                          ),
                                          _buildStatRow(
                                            'Total Withdrawals',
                                            '৳${(importedStats!['totalWithdrawals'] as num? ?? 0).toStringAsFixed(2)}',
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                    ),
                    const Divider(height: 1),

                    // Actions row buttons
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (stage == 'upload')
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

  Widget _buildStatRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          Text(
            value,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
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
    final List<ReportRow> rows = summaries.map((s) {
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

      return ReportRow(
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
                          }),
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
      final directory = await getTemporaryDirectory();
      final file = File(
        '${directory.path}/shop_report_${DateTime.now().millisecondsSinceEpoch}.csv',
      );
      await file.writeAsString(csv.toString());

      await Share.shareXFiles(
        [XFile(file.path)],
        subject: 'Shop Report CSV',
        text: 'Shop Report ($rangeStr)',
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to export Excel (CSV): $e')),
      );
    }
  }

  Future<Uint8List> _buildShopReportPdf(
    List<ShopCardSummary> summaries,
    DateRangeBounds bounds,
  ) async {
    final pdf = pw.Document();
    final rangeStr =
        '${_formatDateString(bounds.from)} to ${_formatDateString(bounds.to)}';

    final headers = [
      'Shop',
      'POS',
      'Cash',
      'Bank',
      'Credit',
      'Total Sale',
      'Purchase',
      'Expense',
      'Withdraw',
      '+/-',
    ];

    double tPos = 0,
        tCash = 0,
        tBank = 0,
        tCredit = 0,
        tTot = 0,
        tPur = 0,
        tExp = 0,
        tWd = 0,
        tDiff = 0;

    final tableRows = <pw.TableRow>[];

    // Header Row
    tableRows.add(
      pw.TableRow(
        decoration: const pw.BoxDecoration(color: PdfColors.teal),
        children: headers.map((header) {
          final isFirst = header == 'Shop';
          return pw.Padding(
            padding: const pw.EdgeInsets.all(6),
            child: pw.Text(
              header,
              textAlign: isFirst ? pw.TextAlign.left : pw.TextAlign.right,
              style: pw.TextStyle(
                fontSize: 8.5,
                fontWeight: pw.FontWeight.bold,
                color: PdfColors.white,
              ),
            ),
          );
        }).toList(),
      ),
    );

    // Data Rows
    for (int i = 0; i < summaries.length; i++) {
      final s = summaries[i];
      final stats = _calculateShopStats(s.shop.id, bounds);
      final isEven = i % 2 == 0;
      tableRows.add(
        pw.TableRow(
          decoration: pw.BoxDecoration(
            color: isEven ? PdfColors.grey100 : PdfColors.white,
          ),
          children: [
            pw.Padding(
              padding: const pw.EdgeInsets.all(6),
              child: pw.Text(
                s.shop.name,
                style: pw.TextStyle(
                  fontWeight: pw.FontWeight.bold,
                  fontSize: 8,
                ),
              ),
            ),
            ...[
              stats.pos,
              stats.cash,
              stats.bank,
              stats.credit,
              stats.totalSale,
              stats.purchase,
              stats.expense,
              stats.withdraw,
            ].map(
              (val) => pw.Padding(
                padding: const pw.EdgeInsets.all(6),
                child: pw.Text(
                  val.toStringAsFixed(2),
                  textAlign: pw.TextAlign.right,
                  style: const pw.TextStyle(fontSize: 8),
                ),
              ),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(6),
              child: pw.Text(
                '${stats.diff >= 0 ? "+" : ""}${stats.diff.toStringAsFixed(2)}',
                textAlign: pw.TextAlign.right,
                style: pw.TextStyle(
                  fontSize: 8,
                  fontWeight: pw.FontWeight.bold,
                  color: stats.diff >= 0 ? PdfColors.green : PdfColors.red,
                ),
              ),
            ),
          ],
        ),
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

    // Total Row
    tableRows.add(
      pw.TableRow(
        decoration: const pw.BoxDecoration(
          color: PdfColors.grey200,
          border: pw.Border(
            top: pw.BorderSide(color: PdfColors.teal, width: 1),
            bottom: pw.BorderSide(color: PdfColors.teal, width: 1),
          ),
        ),
        children: [
          pw.Padding(
            padding: const pw.EdgeInsets.all(6),
            child: pw.Text(
              'TOTAL',
              style: pw.TextStyle(
                fontSize: 8.5,
                fontWeight: pw.FontWeight.bold,
                color: PdfColors.teal,
              ),
            ),
          ),
          ...[tPos, tCash, tBank, tCredit, tTot, tPur, tExp, tWd].map(
            (val) => pw.Padding(
              padding: const pw.EdgeInsets.all(6),
              child: pw.Text(
                val.toStringAsFixed(2),
                textAlign: pw.TextAlign.right,
                style: pw.TextStyle(
                  fontSize: 8.5,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
            ),
          ),
          pw.Padding(
            padding: const pw.EdgeInsets.all(6),
            child: pw.Text(
              '${tDiff >= 0 ? "+" : ""}${tDiff.toStringAsFixed(2)}',
              textAlign: pw.TextAlign.right,
              style: pw.TextStyle(
                fontSize: 8.5,
                fontWeight: pw.FontWeight.bold,
                color: tDiff >= 0 ? PdfColors.green : PdfColors.red,
              ),
            ),
          ),
        ],
      ),
    );

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4.landscape,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context context) {
          return [
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Text(
                  'ShRiAh Group Shop Report',
                  style: pw.TextStyle(
                    fontSize: 16,
                    fontWeight: pw.FontWeight.bold,
                    color: PdfColors.teal,
                  ),
                ),
                pw.Text(
                  'Date Range: $rangeStr',
                  style: const pw.TextStyle(
                    fontSize: 10,
                    color: PdfColors.grey,
                  ),
                ),
              ],
            ),
            pw.SizedBox(height: 16),
            pw.Table(
              border: const pw.TableBorder(
                horizontalInside: pw.BorderSide(
                  color: PdfColors.grey300,
                  width: 0.5,
                ),
                bottom: pw.BorderSide(color: PdfColors.grey300, width: 0.5),
              ),
              columnWidths: {0: const pw.FlexColumnWidth(2)},
              children: tableRows,
            ),
          ];
        },
      ),
    );

    return pdf.save();
  }

  Future<void> _exportPdf(
    List<ShopCardSummary> summaries,
    DateRangeBounds bounds, {
    bool shareOnly = false,
  }) async {
    try {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );

      final pdfBytes = await _buildShopReportPdf(summaries, bounds);

      if (mounted) {
        Navigator.pop(context); // Pop loading dialog
        _showPdfPreview(
          context,
          pdfBytes,
          'shop_report_${DateTime.now().millisecondsSinceEpoch}.pdf',
        );
      }
    } catch (e) {
      if (mounted) Navigator.pop(context); // Pop loading dialog
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to process PDF: $e')));
    }
  }

  void _showPdfPreview(
    BuildContext context,
    Uint8List pdfBytes,
    String fileName,
  ) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(
            title: const Text('PDF Report Preview'),
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
          ),
          body: PdfPreview(
            build: (format) => pdfBytes,
            pdfFileName: fileName,
            allowPrinting: true,
            allowSharing: true,
            canChangePageFormat: false,
            canChangeOrientation: false,
            canDebug: false,
          ),
        ),
      ),
    );
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

    try {
      Share.share(sb.toString(), subject: 'Shop Report ($rangeStr)');
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to share: $e')));
    }
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
        if (eDateStr.compareTo(fromStr) < 0 || eDateStr.compareTo(toStr) > 0) {
          return false;
        }

        // Entry types filter pills
        if (_activeFilters.isNotEmpty) {
          bool match = false;
          for (final f in _activeFilters) {
            if (f == 'pos_sale' && e.entryType == 'sale' && e.posSale > 0) {
              match = true;
            }
            if (f == 'cash_sale' && e.entryType == 'sale' && e.cashSale > 0) {
              match = true;
            }
            if (f == 'bank_sale' && e.entryType == 'sale' && e.bankSale > 0) {
              match = true;
            }
            if (f == 'credit_sale' &&
                e.entryType == 'sale' &&
                e.creditSale > 0) {
              match = true;
            }
            if (f == 'difference' &&
                e.entryType == 'sale' &&
                e.difference != 0) {
              match = true;
            }
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
            if (f == 'pos_sale' && e.entryType == 'sale') {
              netTotalSum += e.posSale;
            }
            if (f == 'cash_sale' && e.entryType == 'sale') {
              netTotalSum += e.cashSale;
            }
            if (f == 'bank_sale' && e.entryType == 'sale') {
              netTotalSum += e.bankSale;
            }
            if (f == 'credit_sale' && e.entryType == 'sale') {
              netTotalSum += e.creditSale;
            }
            if (f == 'difference' && e.entryType == 'sale') {
              netTotalSum += e.difference;
            }
            if (f == 'purchase' && e.entryType == 'purchase') {
              netTotalSum += e.purchaseAmount;
            }
            if (f == 'expense' && e.entryType == 'expense') {
              netTotalSum += e.expenseAmount;
            }
            if (f == 'withdraw' && e.entryType == 'withdraw') {
              netTotalSum += e.withdrawAmount;
            }
          }
        }
      }

      // Slice for pagination
      final paginatedEntries = filteredEntries.take(_visibleCount).toList();

      return BlocListener<WorkingDateCubit, DateTime>(
        listener: (context, workingDate) {
          _triggerFilteredLoad(workingDate: workingDate);
        },
        child: Scaffold(
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
              child: const Icon(
                LucideIcons.shoppingCart,
                color: Colors.white,
                size: 24,
              ),
              onPressed: () {
                _showEntryFormSheet(defaultShopId);
              },
            ),
          ),
          body: SafeArea(
            child: RefreshIndicator(
              color: const Color(0xFF24B489),
              onRefresh: () async {
                _triggerFilteredLoad();
              },
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1. Top Header Row (Shops Count Pill on left, 3-Dots Menu on right)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: isDark
                                ? const Color(0xFF1E293B)
                                : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: isDark
                                  ? const Color(0xFF334155)
                                  : const Color(0xFFE2E8F0),
                            ),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                LucideIcons.store,
                                size: 16,
                                color: Color(0xFF0D9488),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Shops · ${_shops.length}',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: isDark
                                      ? Colors.white
                                      : const Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                        ),

                        Row(
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                color: isDark
                                    ? const Color(0xFF1E293B)
                                    : const Color(0xFFF1F5F9),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isDark
                                      ? const Color(0xFF334155)
                                      : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: IconButton(
                                icon: Icon(
                                  LucideIcons.refreshCw,
                                  size: 18,
                                  color: isDark
                                      ? Colors.white
                                      : const Color(0xFF475569),
                                ),
                                tooltip: 'Refresh Shop Data',
                                onPressed: () {
                                  _triggerFilteredLoad();
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                        'Refreshing shop data from server...',
                                      ),
                                      duration: Duration(seconds: 1),
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            // 3-Dots Menu Button
                            Container(
                              decoration: BoxDecoration(
                                color: isDark
                                    ? const Color(0xFF1E293B)
                                    : const Color(0xFFF1F5F9),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isDark
                                      ? const Color(0xFF334155)
                                      : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: PopupMenuButton<String>(
                                icon: Icon(
                                  LucideIcons.moreVertical,
                                  size: 18,
                                  color: isDark
                                      ? Colors.white
                                      : const Color(0xFF475569),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                color: isDark
                                    ? AppColors.cardDark
                                    : Colors.white,
                                elevation: 8,
                                onSelected: (String val) {
                                  if (val == 'new_entry')
                                    _showEntryFormSheet(defaultShopId);
                                  if (val == 'shops') _showManageShops();
                                  if (val == 'cashiers')
                                    _showManageCashiers(defaultShopId);
                                  if (val == 'import')
                                    _showImportSales(defaultShopId);
                                  if (val == 'report')
                                    _showGenerateReport(shopCards, bounds);
                                  if (val == 'excel')
                                    _exportExcel(shopCards, bounds);
                                  if (val == 'pdf')
                                    _exportPdf(
                                      shopCards,
                                      bounds,
                                      shareOnly: true,
                                    );
                                  if (val == 'share')
                                    _shareReport(shopCards, bounds);
                                },
                                itemBuilder: (BuildContext context) => [
                                  // 1. New Entry
                                  PopupMenuItem<String>(
                                    value: 'new_entry',
                                    height: 40,
                                    child: Row(
                                      children: [
                                        const Icon(
                                          LucideIcons.plus,
                                          size: 18,
                                          color: AppColors.primary,
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'New Entry',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 14,
                                            color: isDark
                                                ? Colors.white
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuDivider(height: 1),

                                  // 2. SHOP TOOLS Header
                                  PopupMenuItem<String>(
                                    enabled: false,
                                    height: 32,
                                    child: Padding(
                                      padding: const EdgeInsets.only(
                                        top: 6,
                                        bottom: 2,
                                      ),
                                      child: Text(
                                        'SHOP TOOLS',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                          color: isDark
                                              ? Colors.grey.shade400
                                              : const Color(0xFF64748B),
                                          letterSpacing: 0.6,
                                        ),
                                      ),
                                    ),
                                  ),

                                  // 3. Manage Shops
                                  PopupMenuItem<String>(
                                    value: 'shops',
                                    height: 40,
                                    child: Row(
                                      children: [
                                        Icon(
                                          LucideIcons.store,
                                          size: 18,
                                          color: isDark
                                              ? Colors.grey.shade300
                                              : const Color(0xFF475569),
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'Manage Shops',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14,
                                            color: isDark
                                                ? Colors.white
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // 4. Cashiers
                                  PopupMenuItem<String>(
                                    value: 'cashiers',
                                    height: 40,
                                    child: Row(
                                      children: [
                                        Icon(
                                          LucideIcons.wallet,
                                          size: 18,
                                          color: isDark
                                              ? Colors.grey.shade300
                                              : const Color(0xFF475569),
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'Cashiers',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14,
                                            color: isDark
                                                ? Colors.white
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  const PopupMenuDivider(height: 1),

                                  // 6. Import Sales
                                  PopupMenuItem<String>(
                                    value: 'import',
                                    height: 40,
                                    child: Row(
                                      children: [
                                        Icon(
                                          LucideIcons.fileSpreadsheet,
                                          size: 18,
                                          color: isDark
                                              ? Colors.grey.shade300
                                              : const Color(0xFF475569),
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'Import Sales',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14,
                                            color: isDark
                                                ? Colors.white
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // 7. Generate Report
                                  PopupMenuItem<String>(
                                    value: 'report',
                                    height: 40,
                                    child: Row(
                                      children: [
                                        Icon(
                                          LucideIcons.barChart3,
                                          size: 18,
                                          color: isDark
                                              ? Colors.grey.shade300
                                              : const Color(0xFF475569),
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'Generate Report',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14,
                                            color: isDark
                                                ? Colors.white
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  const PopupMenuDivider(height: 1),

                                  // 8. Export Excel
                                  PopupMenuItem<String>(
                                    value: 'excel',
                                    height: 40,
                                    child: Row(
                                      children: [
                                        Icon(
                                          LucideIcons.fileDown,
                                          size: 18,
                                          color: isDark
                                              ? Colors.grey.shade300
                                              : const Color(0xFF475569),
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'Export Excel',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14,
                                            color: isDark
                                                ? Colors.white
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // 9. Export PDF
                                  PopupMenuItem<String>(
                                    value: 'pdf',
                                    height: 40,
                                    child: Row(
                                      children: [
                                        Icon(
                                          LucideIcons.fileText,
                                          size: 18,
                                          color: isDark
                                              ? Colors.grey.shade300
                                              : const Color(0xFF475569),
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'Export PDF',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14,
                                            color: isDark
                                                ? Colors.white
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // 10. Share Report
                                  PopupMenuItem<String>(
                                    value: 'share',
                                    height: 40,
                                    child: Row(
                                      children: [
                                        Icon(
                                          LucideIcons.share2,
                                          size: 18,
                                          color: isDark
                                              ? Colors.grey.shade300
                                              : const Color(0xFF475569),
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'Share Report',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14,
                                            color: isDark
                                                ? Colors.white
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
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
                            color: isDark
                                ? AppColors.borderDark
                                : const Color(0xFFE2E8F0),
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
                                    _triggerFilteredLoad();
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 10,
                                    horizontal: 12,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? AppColors.inputDark
                                        : AppColors.inputLight,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: isDark
                                          ? AppColors.borderDark
                                          : const Color(0xFFE2E8F0),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        _customFrom != null
                                            ? _formatDateString(_customFrom!)
                                            : 'From Date',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const Icon(
                                        LucideIcons.calendar,
                                        size: 14,
                                        color: Colors.grey,
                                      ),
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
                                    _triggerFilteredLoad();
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 10,
                                    horizontal: 12,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? AppColors.inputDark
                                        : AppColors.inputLight,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: isDark
                                          ? AppColors.borderDark
                                          : const Color(0xFFE2E8F0),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        _customTo != null
                                            ? _formatDateString(_customTo!)
                                            : 'To Date',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const Icon(
                                        LucideIcons.calendar,
                                        size: 14,
                                        color: Colors.grey,
                                      ),
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
                            color: isDark
                                ? const Color(0xFF94A3B8)
                                : const Color(0xFF64748B),
                          ),
                        ),
                        InkWell(
                          onTap: () {
                            _triggerFilteredLoad();
                          },
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF1E293B)
                                  : const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isDark
                                    ? const Color(0xFF334155)
                                    : const Color(0xFFE2E8F0),
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  LucideIcons.refreshCw,
                                  size: 12,
                                  color: isDark
                                      ? Colors.white70
                                      : const Color(0xFF475569),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Refresh',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: isDark
                                        ? Colors.white70
                                        : const Color(0xFF475569),
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
                    shopCards.isEmpty
                        ? Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(
                              vertical: 36,
                              horizontal: 24,
                            ),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.cardDark : Colors.white,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: isDark
                                    ? AppColors.borderDark
                                    : const Color(0xFFE2E8F0),
                              ),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF0D9488)
                                        .withValues(alpha: 0.1),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    LucideIcons.store,
                                    size: 32,
                                    color: Color(0xFF0D9488),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'No Shops Available',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: isDark
                                        ? Colors.white
                                        : const Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Create a shop to start logging sales, purchases, and tracking cash flow.',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 12.5,
                                    color: isDark
                                        ? const Color(0xFF94A3B8)
                                        : const Color(0xFF64748B),
                                    height: 1.4,
                                  ),
                                ),
                                const SizedBox(height: 20),
                                ElevatedButton.icon(
                                  onPressed: () {
                                    _showManageShops();
                                  },
                                  icon: const Icon(
                                    LucideIcons.plus,
                                    size: 16,
                                    color: Colors.white,
                                  ),
                                  label: const Text(
                                    'Add Shop',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF0D9488),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 24,
                                      vertical: 12,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    elevation: 0,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : SizedBox(
                            height: 245,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              itemCount: shopCards.length,
                              separatorBuilder: (context, index) =>
                                  const SizedBox(width: 12),
                              itemBuilder: (context, idx) {
                                final summary = shopCards[idx];
                                final isSelected =
                                    _shopFilter == summary.shop.id;
                                return _buildShopSummaryCard(
                                  summary: summary,
                                  isSelected: isSelected,
                                  isDark: isDark,
                                  onTap: () {
                                    setState(() {
                                      if (_shopFilter == summary.shop.id) {
                                        _shopFilter = 'all';
                                      } else {
                                        _shopFilter = summary.shop.id;
                                      }
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
                            orElse: () => ShopModel(
                              id: '',
                              name: 'Main Store',
                              createdAt: DateTime.now(),
                            ),
                          );
                          return Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF132A29)
                                  : const Color(0xFFE8F5F1),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: const Color(
                                  0xFF24B489,
                                ).withValues(alpha: 0.4),
                              ),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  LucideIcons.store,
                                  size: 16,
                                  color: Color(0xFF0D9488),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  currentShop.name,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: isDark
                                        ? Colors.white
                                        : const Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? const Color(0xFF1E293B)
                                        : Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: isDark
                                          ? const Color(0xFF334155)
                                          : const Color(0xFFE2E8F0),
                                    ),
                                  ),
                                  child: Text(
                                    _dateRange == 'month'
                                        ? 'This Month'
                                        : _dateRange.toUpperCase(),
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: isDark
                                          ? const Color(0xFF94A3B8)
                                          : const Color(0xFF64748B),
                                    ),
                                  ),
                                ),
                                const Spacer(),
                                InkWell(
                                  onTap: () {
                                    setState(() => _shopFilter = 'all');
                                    _triggerFilteredLoad();
                                  },
                                  borderRadius: BorderRadius.circular(16),
                                  child: Icon(
                                    LucideIcons.x,
                                    size: 16,
                                    color: isDark
                                        ? const Color(0xFF94A3B8)
                                        : const Color(0xFF64748B),
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
                          color: isDark
                              ? AppColors.borderDark
                              : const Color(0xFFE2E8F0),
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
                                    const Icon(
                                      LucideIcons.wallet,
                                      size: 18,
                                      color: Color(0xFF0D9488),
                                    ),
                                    const SizedBox(width: 10),
                                    Text(
                                      '${_shopFilter == 'all' ? 'All Shops' : _shops.firstWhere(
                                              (s) => s.id == _shopFilter,
                                              orElse: () => ShopModel(id: '', name: 'Main Store', createdAt: DateTime.now()),
                                            ).name} · Recent Entries',
                                      style: TextStyle(
                                        fontSize: 14.5,
                                        fontWeight: FontWeight.bold,
                                        color: isDark
                                            ? Colors.white
                                            : const Color(0xFF0F172A),
                                      ),
                                    ),
                                  ],
                                ),
                                Text(
                                  '${filteredEntries.length}',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: isDark
                                        ? const Color(0xFF94A3B8)
                                        : const Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Divider(
                            height: 1,
                            color: isDark
                                ? AppColors.borderDark
                                : const Color(0xFFE2E8F0),
                          ),

                          // Entry Category Filter Pills
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
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
                                    color: isDark
                                        ? const Color(0xFF1E293B)
                                        : const Color(0xFFF1F5F9),
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isDark
                                          ? const Color(0xFF334155)
                                          : const Color(0xFFE2E8F0),
                                    ),
                                  ),
                                  child: Icon(
                                    LucideIcons.moreHorizontal,
                                    size: 14,
                                    color: isDark
                                        ? Colors.white70
                                        : const Color(0xFF64748B),
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
                              color: isDark
                                  ? const Color(0xFF132A29)
                                  : const Color(0xFFE8F5F1),
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
                                        color: isDark
                                            ? const Color(0xFF94A3B8)
                                            : const Color(0xFF64748B),
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
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 48,
                                  ),
                                  child: Center(
                                    child: Column(
                                      children: [
                                        Icon(
                                          LucideIcons.inbox,
                                          size: 36,
                                          color: isDark
                                              ? Colors.white38
                                              : Colors.grey[400],
                                        ),
                                        const SizedBox(height: 12),
                                        Text(
                                          'No matching records found in database.',
                                          style: TextStyle(
                                            color: isDark
                                                ? Colors.white70
                                                : const Color(0xFF64748B),
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
                                    color: isDark
                                        ? AppColors.borderDark
                                        : const Color(0xFFE2E8F0),
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
                                      amtVal =
                                          e.cashSale +
                                          e.bankSale +
                                          e.creditSale -
                                          e.dueReceivable;
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
                                      contentPadding:
                                          const EdgeInsets.symmetric(
                                            horizontal: 20,
                                            vertical: 8,
                                          ),
                                      leading: Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: trColor.withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(
                                            14,
                                          ),
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
                                              color: isDark
                                                  ? AppColors.inputDark
                                                  : AppColors.inputLight,
                                              borderRadius:
                                                  BorderRadius.circular(6),
                                              border: Border.all(
                                                color: isDark
                                                    ? AppColors.borderDark
                                                    : AppColors.borderLight,
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
                                        padding: const EdgeInsets.only(
                                          top: 4.0,
                                        ),
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              e.notes ??
                                                  'No annotations entered.',
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
                                              color: isOut
                                                  ? AppColors.destructive
                                                  : AppColors.success,
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
                          if (filteredEntries.length >
                              paginatedEntries.length) ...[
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
                                      color: isDark
                                          ? AppColors.borderDark
                                          : AppColors.borderLight,
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
    final subtextColor = isDark
        ? const Color(0xFF94A3B8)
        : const Color(0xFF64748B);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        width: 210,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: borderColor, width: isSelected ? 1.5 : 1.0),
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
                    color: isDark
                        ? const Color(0xFF1E293B)
                        : const Color(0xFFCCFBF1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.store,
                    color: Color(0xFF0D9488),
                    size: 15,
                  ),
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
                color: isDark
                    ? const Color(0xFF1E293B)
                    : const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark
                      ? const Color(0xFF334155)
                      : const Color(0xFFD1FAE5),
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
                color: isDark
                    ? const Color(0xFF1E293B)
                    : const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark
                      ? const Color(0xFF334155)
                      : const Color(0xFFD1FAE5),
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
              summary.lastDate != null
                  ? 'Last: ${DateFormat('M/d/yyyy').format(summary.lastDate!)}'
                  : 'No activity',
              style: TextStyle(fontSize: 10.5, color: subtextColor),
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
                  : (isDark
                        ? const Color(0xFF334155)
                        : const Color(0xFFE2E8F0)),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: active
                  ? Colors.white
                  : (isDark
                        ? const Color(0xFF94A3B8)
                        : const Color(0xFF475569)),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFilterPill(String key, String label) {
    final on = key == 'all'
        ? _activeFilters.isEmpty
        : _activeFilters.contains(key);
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
                  : (isDark
                        ? const Color(0xFF334155)
                        : const Color(0xFFE2E8F0)),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: on
                  ? Colors.white
                  : (isDark
                        ? const Color(0xFF94A3B8)
                        : const Color(0xFF475569)),
            ),
          ),
        ),
      ),
    );
  }

  bool _isImageAttachment(String path) {
    try {
      final uri = Uri.parse(path);
      final cleanPath = uri.path.toLowerCase();
      return cleanPath.endsWith('.png') ||
          cleanPath.endsWith('.jpg') ||
          cleanPath.endsWith('.jpeg') ||
          cleanPath.endsWith('.gif') ||
          cleanPath.endsWith('.webp') ||
          cleanPath.endsWith('.heic') ||
          cleanPath.endsWith('.heif');
    } catch (_) {
      final lower = path.toLowerCase();
      final cleanPath = lower.split('?').first;
      return cleanPath.endsWith('.png') ||
          cleanPath.endsWith('.jpg') ||
          cleanPath.endsWith('.jpeg') ||
          cleanPath.endsWith('.gif') ||
          cleanPath.endsWith('.webp') ||
          cleanPath.endsWith('.heic') ||
          cleanPath.endsWith('.heif');
    }
  }

  Future<void> _openAttachment(String url) async {
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Could not open document: $url')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error launching document: $e')));
      }
    }
  }

  void _showFullScreenImage(BuildContext context, String url) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.black,
        insetPadding: EdgeInsets.zero,
        child: Stack(
          alignment: Alignment.center,
          children: [
            InteractiveViewer(
              minScale: 0.5,
              maxScale: 4.0,
              child: SmartImageWidget(
                imageUrl: url,
                fit: BoxFit.contain,
                fallbackWidget: Container(
                  color: Colors.black,
                  child: const Icon(
                    Icons.broken_image,
                    color: Colors.white,
                    size: 40,
                  ),
                ),
              ),
            ),
            Positioned(
              top: 40,
              right: 20,
              child: IconButton(
                icon: const Icon(Icons.close, color: Colors.white, size: 30),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _triggerFilteredLoad({DateTime? workingDate}) {
    final wDate = workingDate ?? context.read<WorkingDateCubit>().state;
    final bounds = _getDateRangeBounds(wDate);

    String? period;
    String? startDate;
    String? endDate;
    String? date;

    if (_dateRange == 'today') {
      period = 'today';
    } else if (_dateRange == 'yesterday') {
      period = 'yesterday';
    } else if (_dateRange == 'week') {
      period = 'this_week';
    } else if (_dateRange == 'month') {
      period = 'this_month';
    } else if (_dateRange == 'custom') {
      period = 'custom';
      startDate = _formatDateString(bounds.from);
      endDate = _formatDateString(bounds.to);
    }

    context.read<ShopBloc>().add(
      LoadShops(
        period: period,
        startDate: startDate,
        endDate: endDate,
        date: date,
      ),
    );

    context.read<ShopBloc>().add(
      LoadShopEntries(
        shopId: 'all',
        period: period,
        startDate: startDate,
        endDate: endDate,
        date: date,
      ),
    );

    context.read<ShopBloc>().add(
      LoadShopSummary(
        shopId: 'all',
        period: period,
        startDate: startDate,
        endDate: endDate,
        date: date,
      ),
    );
  }
}
