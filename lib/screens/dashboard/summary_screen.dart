import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';

import '../../blocs/working_date/working_date_cubit.dart';
import '../../core/theme/app_colors.dart';
import '../../models/company_transaction_model.dart';
import '../../models/shop_model.dart';
import '../../models/shop_entry_model.dart';
import '../../models/employee_entry_model.dart';
import '../../models/product_model.dart';
import '../../models/cash_holder_model.dart';
import '../../models/cash_snapshot_model.dart';
import '../../repositories/shop_repository.dart';
import '../../repositories/employee_repository.dart';
import '../../repositories/product_repository.dart';
import '../../repositories/company_transaction_repository.dart';
import '../../repositories/cash_snapshot_repository.dart';
import '../../repositories/wholesale_repository.dart';
import '../../models/wholesale_models.dart';
import '../../models/opening_balance_model.dart';
import '../../repositories/opening_balance_repository.dart';

class SummaryScreen extends StatefulWidget {
  const SummaryScreen({super.key});

  @override
  State<SummaryScreen> createState() => _SummaryScreenState();
}

class _SummaryScreenState extends State<SummaryScreen> {
  // Constant Capitals & Limits
  static const double _companyOpeningCapital = 175000.0;

  bool _isLoading = true;

  // Domain data lists loaded from Hive
  List<ShopModel> _shops = [];
  List<ShopEntryModel> _shopEntries = [];
  List<EmployeeEntryModel> _employeeEntries = [];
  List<CompanyTransactionModel> _companyTxns = [];
  List<ProductModel> _products = [];
  List<CashInHandSnapshotModel> _snapshots = [];
  List<CashHolderModel> _holders = [];
  List<WholesaleCustomerModel> _wholesaleCustomers = [];
  List<WholesaleSaleModel> _wholesaleSales = [];
  List<WholesalePaymentModel> _wholesalePayments = [];

  // Text inputs controllers for cash holders
  List<TextEditingController> _nameControllers = [];
  List<TextEditingController> _amountControllers = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _disposeControllers();
    super.dispose();
  }

  void _disposeControllers() {
    for (final c in _nameControllers) {
      c.dispose();
    }
    for (final c in _amountControllers) {
      c.dispose();
    }
    _nameControllers = [];
    _amountControllers = [];
  }

  Map<String, dynamic>? _remoteSummary;
  OpeningBalanceModel? _openingBalanceModel;

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final shopRepo = context.read<ShopRepository>();
      final employeeRepo = context.read<EmployeeRepository>();
      final productRepo = context.read<ProductRepository>();
      final companyRepo = context.read<CompanyTransactionRepository>();
      final snapshotRepo = context.read<CashSnapshotRepository>();
      final wholesaleRepo = context.read<WholesaleRepository>();
      final openingBalanceRepo = context.read<OpeningBalanceRepository>();

      final List<ShopModel> shops;
      try {
        shops = await shopRepo.getShops();
      } catch (e) {
        throw Exception('Error loading shops: $e');
      }

      final List<ShopEntryModel> shopEntries;
      try {
        shopEntries = await shopRepo.getEntries();
      } catch (e) {
        throw Exception('Error loading shop entries: $e');
      }

      final List<EmployeeEntryModel> employeeEntries;
      try {
        employeeEntries = await employeeRepo.getEntries();
      } catch (e) {
        throw Exception('Error loading employee entries: $e');
      }

      final List<CompanyTransactionModel> companyTxns;
      try {
        companyTxns = await companyRepo.getTransactions();
      } catch (e) {
        throw Exception('Error loading company transactions: $e');
      }

      final List<ProductModel> products;
      try {
        products = await productRepo.getProducts();
      } catch (e) {
        throw Exception('Error loading products: $e');
      }

      final List<CashInHandSnapshotModel> snapshots;
      try {
        snapshots = await snapshotRepo.getSnapshots();
      } catch (e) {
        throw Exception('Error loading cash snapshots: $e');
      }

      final List<CashHolderModel> holders;
      try {
        holders = await snapshotRepo.getCurrentHolders();
      } catch (e) {
        throw Exception('Error loading cash holders: $e');
      }

      final List<WholesaleCustomerModel> wholesaleCustomers;
      try {
        wholesaleCustomers = await wholesaleRepo.getCustomers();
      } catch (e) {
        throw Exception('Error loading wholesale customers: $e');
      }

      final List<WholesaleSaleModel> wholesaleSales;
      try {
        wholesaleSales = await wholesaleRepo.getSales();
      } catch (e) {
        throw Exception('Error loading wholesale sales: $e');
      }

      final List<WholesalePaymentModel> wholesalePayments;
      try {
        wholesalePayments = await wholesaleRepo.getPayments();
      } catch (e) {
        throw Exception('Error loading wholesale payments: $e');
      }

      final Map<String, dynamic>? remoteSummary;
      try {
        remoteSummary = await wholesaleRepo.getDashboardSummary();
      } catch (e) {
        throw Exception('Error loading dashboard summary: $e');
      }

      final OpeningBalanceModel? openingBalanceModel;
      try {
        openingBalanceModel = await openingBalanceRepo.getOpeningBalance();
      } catch (e) {
        throw Exception('Error loading opening balance: $e');
      }

      _disposeControllers();

      for (final h in holders) {
        _nameControllers.add(TextEditingController(text: h.name));
        _amountControllers.add(
          TextEditingController(
            text: h.amount == 0.0 ? '' : h.amount.toString(),
          ),
        );
      }

      setState(() {
        _shops = shops;
        _shopEntries = shopEntries;
        _employeeEntries = employeeEntries;
        _companyTxns = companyTxns;
        _products = products;
        _snapshots = snapshots;
        _holders = holders;
        _wholesaleCustomers = wholesaleCustomers;
        _wholesaleSales = wholesaleSales;
        _wholesalePayments = wholesalePayments;
        _remoteSummary = remoteSummary;
        _openingBalanceModel = openingBalanceModel;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error loading data: $e')));
    }
  }

  // --- Dynamic Getters calculated from active month of Working Date ---

  DateTime get _workingDate {
    return context.read<WorkingDateCubit>().state;
  }

  DateTime get _monthStart =>
      DateTime(_workingDate.year, _workingDate.month, 1);
  DateTime get _monthEnd => _workingDate;

  bool _isInRange(DateTime date, DateTime from, DateTime to) {
    final d = DateTime(date.year, date.month, date.day);
    final f = DateTime(from.year, from.month, from.day);
    final t = DateTime(to.year, to.month, to.day);
    return (d.isAtSameMomentAs(f) || d.isAfter(f)) &&
        (d.isAtSameMomentAs(t) || d.isBefore(t));
  }

  // Helper formatting for currency
  String _fmt(double val) {
    return '${val.toStringAsFixed(2)} SAR';
  }

  // Calculates cash position for a specific shop
  double _getShopPosition(ShopModel shop) {
    final entries = _shopEntries.where((e) {
      if (e.shopId != shop.id) return false;
      return _isInRange(e.txnDate, _monthStart, _monthEnd);
    }).toList();

    if (shop.shopType == 'simple_cash') {
      double cashIn = 0.0;
      double expense = 0.0;
      for (final e in entries) {
        if (e.entryType == 'sale') {
          cashIn += e.cashSale;
        } else if (e.entryType == 'expense') {
          expense += e.expenseAmount;
        }
      }
      return cashIn - expense;
    } else {
      double cashSale = 0.0;
      double withdraw = 0.0;
      double purchase = 0.0;
      double expense = 0.0;
      for (final e in entries) {
        cashSale += e.cashSale;
        withdraw += e.withdrawAmount;
        purchase += e.purchaseAmount;
        expense += e.expenseAmount;
      }
      return (cashSale + withdraw) - (purchase + expense);
    }
  }

  double get _totalShopCashPosition {
    if (_remoteSummary != null && _remoteSummary!['totalShopCashPosition'] != null) {
      return (_remoteSummary!['totalShopCashPosition'] as num).toDouble();
    }
    return 0.0;
  }

  double get _currentStockValue {
    if (_remoteSummary != null && _remoteSummary!['inventoryValue'] != null) {
      return (_remoteSummary!['inventoryValue'] as num).toDouble();
    }
    return 0.0;
  }

  double get _wholesaleReceivables {
    if (_remoteSummary != null && _remoteSummary!['totalReceivables'] != null) {
      return (_remoteSummary!['totalReceivables'] as num).toDouble();
    }
    return 0.0;
  }

  double get _wholesaleCurrentValue {
    if (_remoteSummary != null && _remoteSummary!['wholesaleCurrentValue'] != null) {
      return (_remoteSummary!['wholesaleCurrentValue'] as num).toDouble();
    }
    return 0.0;
  }

  double get _employeeOutstanding {
    if (_remoteSummary != null && _remoteSummary!['employeeOutstanding'] != null) {
      return (_remoteSummary!['employeeOutstanding'] as num).toDouble();
    }
    return 0.0;
  }

  double get _currentCompanyBalance {
    if (_remoteSummary != null && _remoteSummary!['currentCompanyBalance'] != null) {
      return (_remoteSummary!['currentCompanyBalance'] as num).toDouble();
    }
    return 0.0;
  }

  double get _openingCapital {
    if (_openingBalanceModel != null && _openingBalanceModel!.amount > 0) {
      return _openingBalanceModel!.amount;
    }
    if (_remoteSummary != null && _remoteSummary!['companyOpeningCapital'] != null) {
      return (_remoteSummary!['companyOpeningCapital'] as num).toDouble();
    }
    return 0.0;
  }

  Future<void> _showEditOpeningBalanceDialog() async {
    final workingDate = context.read<WorkingDateCubit>().state;
    final defaultDateStr = DateFormat('yyyy-MM-dd').format(workingDate);

    final amountController = TextEditingController(text: '');
    final dateController = TextEditingController(
      text: _openingBalanceModel?.date ?? defaultDateStr,
    );
    final notesController = TextEditingController(text: '');

    bool isSaving = false;

    await showDialog(
      context: context,
      builder: (dialogCtx) {
        final isDark = Theme.of(dialogCtx).brightness == Brightness.dark;
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: isDark ? AppColors.cardDark : Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(LucideIcons.lock, color: AppColors.primary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'Set Opening Balance',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(height: 8),
                    TextField(
                      controller: amountController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      autofocus: true,
                      decoration: InputDecoration(
                        labelText: 'Opening Balance Amount (SAR)',
                        hintText: 'e.g. 50000.00',
                        prefixIcon: const Icon(LucideIcons.dollarSign, size: 18),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        filled: true,
                        fillColor: isDark ? AppColors.inputDark : Colors.grey.shade50,
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: dateController,
                      readOnly: true,
                      decoration: InputDecoration(
                        labelText: 'Date',
                        prefixIcon: const Icon(LucideIcons.calendar, size: 18),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        filled: true,
                        fillColor: isDark ? AppColors.inputDark : Colors.grey.shade50,
                      ),
                      onTap: () async {
                        final parsed = DateTime.tryParse(dateController.text) ?? DateTime.now();
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: parsed,
                          firstDate: DateTime(2020),
                          lastDate: DateTime(2030),
                        );
                        if (picked != null) {
                          dateController.text = DateFormat('yyyy-MM-dd').format(picked);
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: notesController,
                      maxLines: 2,
                      decoration: InputDecoration(
                        labelText: 'Notes / Description',
                        hintText: 'Company opening capital / register cash',
                        prefixIcon: const Icon(LucideIcons.fileText, size: 18),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        filled: true,
                        fillColor: isDark ? AppColors.inputDark : Colors.grey.shade50,
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSaving ? null : () => Navigator.pop(dialogCtx),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: isSaving
                      ? null
                      : () async {
                          final amt = double.tryParse(amountController.text.trim());
                          if (amt == null || amt < 0) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Please enter a valid amount'),
                                backgroundColor: Colors.red,
                              ),
                            );
                            return;
                          }

                          setDialogState(() => isSaving = true);
                          try {
                            final repo = context.read<OpeningBalanceRepository>();
                            final updated = await repo.setOpeningBalance(
                              amount: amt,
                              date: dateController.text.trim(),
                              notes: notesController.text.trim(),
                            );
                            if (mounted) {
                              setState(() {
                                _openingBalanceModel = updated;
                              });
                              await _loadData();
                            }
                            if (dialogCtx.mounted) {
                              Navigator.pop(dialogCtx);
                            }
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Opening balance updated successfully'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            }
                          } catch (e) {
                            setDialogState(() => isSaving = false);
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Failed to update opening balance: $e'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  ),
                  child: isSaving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Save Opening Balance'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _showWriteCompanyBalanceDialog() async {
    final workingDate = context.read<WorkingDateCubit>().state;
    final currentBal = _currentCompanyBalance;

    int modeIndex = 0; // 0 = Direct Target Balance, 1 = Add Income/Expense Txn
    final targetBalController = TextEditingController(
      text: currentBal.toStringAsFixed(2),
    );
    final amountController = TextEditingController();
    final notesController = TextEditingController();
    String txnType = 'in';
    String category = 'Capital Deposit';

    bool isSaving = false;

    await showDialog(
      context: context,
      builder: (dialogCtx) {
        final isDark = Theme.of(dialogCtx).brightness == Brightness.dark;
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: isDark ? AppColors.cardDark : Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(LucideIcons.building2, color: Colors.blue, size: 20),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'Update Company Balance',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.inputDark : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Current Balance:',
                            style: TextStyle(fontSize: 12, color: Colors.grey),
                          ),
                          Text(
                            _fmt(currentBal),
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ChoiceChip(
                            label: const Text('Set Balance'),
                            selected: modeIndex == 0,
                            onSelected: (val) {
                              if (val) setDialogState(() => modeIndex = 0);
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ChoiceChip(
                            label: const Text('Add Transaction'),
                            selected: modeIndex == 1,
                            onSelected: (val) {
                              if (val) setDialogState(() => modeIndex = 1);
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    if (modeIndex == 0) ...[
                      TextField(
                        controller: targetBalController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: InputDecoration(
                          labelText: 'New Target Balance (SAR)',
                          prefixIcon: const Icon(LucideIcons.dollarSign, size: 18),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          filled: true,
                          fillColor: isDark ? AppColors.inputDark : Colors.grey.shade50,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: notesController,
                        decoration: InputDecoration(
                          labelText: 'Adjustment Note (Optional)',
                          prefixIcon: const Icon(LucideIcons.fileText, size: 18),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          filled: true,
                          fillColor: isDark ? AppColors.inputDark : Colors.grey.shade50,
                        ),
                      ),
                    ] else ...[
                      Row(
                        children: [
                          Expanded(
                            child: FilterChip(
                              label: const Text('+ Income (In)'),
                              selected: txnType == 'in',
                              selectedColor: Colors.green.shade100,
                              onSelected: (val) {
                                if (val) setDialogState(() => txnType = 'in');
                              },
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: FilterChip(
                              label: const Text('- Expense (Out)'),
                              selected: txnType == 'out',
                              selectedColor: Colors.red.shade100,
                              onSelected: (val) {
                                if (val) setDialogState(() => txnType = 'out');
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: amountController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: InputDecoration(
                          labelText: 'Amount (SAR)',
                          prefixIcon: const Icon(LucideIcons.dollarSign, size: 18),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          filled: true,
                          fillColor: isDark ? AppColors.inputDark : Colors.grey.shade50,
                        ),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        initialValue: category,
                        decoration: InputDecoration(
                          labelText: 'Category',
                          prefixIcon: const Icon(LucideIcons.tag, size: 18),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          filled: true,
                          fillColor: isDark ? AppColors.inputDark : Colors.grey.shade50,
                        ),
                        items: const [
                          DropdownMenuItem(value: 'Capital Deposit', child: Text('Capital Deposit')),
                          DropdownMenuItem(value: 'Bank Transfer', child: Text('Bank Transfer')),
                          DropdownMenuItem(value: 'Operating Expense', child: Text('Operating Expense')),
                          DropdownMenuItem(value: 'Adjustment', child: Text('Adjustment')),
                          DropdownMenuItem(value: 'Other', child: Text('Other')),
                        ],
                        onChanged: (val) {
                          if (val != null) setDialogState(() => category = val);
                        },
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: notesController,
                        decoration: InputDecoration(
                          labelText: 'Notes / Remarks',
                          prefixIcon: const Icon(LucideIcons.fileText, size: 18),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          filled: true,
                          fillColor: isDark ? AppColors.inputDark : Colors.grey.shade50,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSaving ? null : () => Navigator.pop(dialogCtx),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: isSaving
                      ? null
                      : () async {
                          setDialogState(() => isSaving = true);
                          try {
                            final companyRepo = context.read<CompanyTransactionRepository>();
                            const uuid = Uuid();

                            if (modeIndex == 0) {
                              final target = double.tryParse(targetBalController.text.trim());
                              if (target == null) {
                                setDialogState(() => isSaving = false);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Please enter a valid target balance'), backgroundColor: Colors.red),
                                );
                                return;
                              }
                              final diff = target - currentBal;
                              if (diff.abs() > 0.001) {
                                final txn = CompanyTransactionModel(
                                  id: uuid.v4(),
                                  amount: diff.abs(),
                                  category: 'Balance Adjustment',
                                  notes: notesController.text.trim().isNotEmpty
                                      ? notesController.text.trim()
                                      : 'Direct balance adjustment to ${target.toStringAsFixed(2)} SAR',
                                  txnDate: workingDate,
                                  txnType: diff >= 0 ? 'in' : 'out',
                                  createdAt: DateTime.now(),
                                );
                                await companyRepo.saveTransaction(txn);
                              }
                            } else {
                              final amt = double.tryParse(amountController.text.trim());
                              if (amt == null || amt <= 0) {
                                setDialogState(() => isSaving = false);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Please enter a valid amount'), backgroundColor: Colors.red),
                                );
                                return;
                              }
                              final txn = CompanyTransactionModel(
                                id: uuid.v4(),
                                amount: amt,
                                category: category,
                                notes: notesController.text.trim().isNotEmpty
                                    ? notesController.text.trim()
                                    : null,
                                txnDate: workingDate,
                                txnType: txnType,
                                createdAt: DateTime.now(),
                              );
                              await companyRepo.saveTransaction(txn);
                            }

                            if (mounted) {
                              await _loadData();
                            }
                            if (dialogCtx.mounted) {
                              Navigator.pop(dialogCtx);
                            }
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Company balance updated successfully'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            }
                          } catch (e) {
                            setDialogState(() => isSaving = false);
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Failed to update company balance: $e'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  ),
                  child: isSaving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Update Balance'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  double get _totalInvest {
    if (_remoteSummary != null && _remoteSummary!['totalInvest'] != null) {
      return (_remoteSummary!['totalInvest'] as num).toDouble();
    }
    return 0.0;
  }

  double get _totalCashInApp {
    if (_remoteSummary != null && _remoteSummary!['totalCashInApp'] != null) {
      return (_remoteSummary!['totalCashInApp'] as num).toDouble();
    }
    return 0.0;
  }

  double get _totalCashInHand => _holders.fold(0.0, (sum, h) => sum + h.amount);

  double get _difference => _totalCashInHand - _totalCashInApp;

  // --- Snapshot Actions ---

  void _saveCurrentHolders() {
    final repo = context.read<CashSnapshotRepository>();
    repo.saveCurrentHolders(_holders);
  }

  void _addHolder() {
    setState(() {
      _holders.add(CashHolderModel(name: '', amount: 0.0));
      _nameControllers.add(TextEditingController());
      _amountControllers.add(TextEditingController());
      _saveCurrentHolders();
    });
  }

  void _removeHolder(int index) {
    if (_holders.length <= 1) return;
    setState(() {
      _holders.removeAt(index);
      _nameControllers[index].dispose();
      _nameControllers.removeAt(index);
      _amountControllers[index].dispose();
      _amountControllers.removeAt(index);
      _saveCurrentHolders();
    });
  }

  Future<void> _saveTodaySnapshot() async {
    final dateStr = DateFormat('yyyy-MM-dd').format(_workingDate);
    final repo = context.read<CashSnapshotRepository>();
    const uuid = Uuid();
    final snapshot = CashInHandSnapshotModel(
      id: uuid.v4(),
      snapshotDate: _workingDate,
      cashInHand: _totalCashInHand,
      cashInApp: _totalCashInApp,
      difference: _difference,
      holders: _holders
          .map((h) => CashHolderModel(name: h.name, amount: h.amount))
          .toList(),
      createdAt: DateTime.now(),
    );
    await repo.saveSnapshot(snapshot);
    final list = await repo.getSnapshots();
    if (!mounted) return;
    setState(() {
      _snapshots = list;
    });
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Saved snapshot for $dateStr')));
  }

  Future<void> _deleteSnapshot(String id) async {
    final repo = context.read<CashSnapshotRepository>();
    await repo.deleteSnapshot(id);
    final list = await repo.getSnapshots();
    if (!mounted) return;
    setState(() {
      _snapshots = list;
    });
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Snapshot deleted')));
  }

  // --- Breakdown Sheets ---

  void _showShopBreakdownSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return DraggableScrollableSheet(
          initialChildSize: 0.6,
          maxChildSize: 0.9,
          minChildSize: 0.4,
          expand: false,
          builder: (context, scrollController) {
            return Container(
              decoration: BoxDecoration(
                color: isDark ? AppColors.bgDark : Colors.white,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(24),
                ),
              ),
              child: Column(
                children: [
                  Container(
                    width: 40,
                    height: 4,
                    margin: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.grey.withAlpha(100),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const Text(
                    'Shop Cash Position Breakdown',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: ListView.separated(
                      controller: scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: _shops.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (context, i) {
                        final shop = _shops[i];
                        final pos = _getShopPosition(shop);
                        return Card(
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                            side: BorderSide(
                              color: isDark
                                  ? AppColors.borderDark
                                  : AppColors.borderLight,
                            ),
                          ),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.teal.shade50,
                              child: const Icon(
                                LucideIcons.store,
                                color: AppColors.primary,
                                size: 20,
                              ),
                            ),
                            title: Text(
                              shop.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            subtitle: Text(
                              shop.shopType == 'simple_cash'
                                  ? 'Simple Cash'
                                  : 'Full ERP',
                            ),
                            trailing: Text(
                              _fmt(pos),
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.cardDark : Colors.teal.shade50,
                      border: Border(
                        top: BorderSide(
                          color: isDark
                              ? AppColors.borderDark
                              : AppColors.borderLight,
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total Cash Position',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                        Text(
                          _fmt(_totalShopCashPosition),
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
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

  void _showWarehouseBreakdownSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.grey.withAlpha(100),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const Center(
                child: Text(
                  'Warehouse Current Value',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 20),
              _buildBreakdownRow('Current Stock', _currentStockValue),
              const Divider(height: 24),
              _buildBreakdownRow('Receivables', _wholesaleReceivables),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.cardDark : Colors.teal.shade50,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Current Value',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                    Text(
                      _fmt(_wholesaleCurrentValue),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBreakdownRow(String label, double val) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
        Text(
          _fmt(val),
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  void _showFormulaDialog(String title, String lines, String formula) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(lines, style: const TextStyle(fontSize: 13, height: 1.4)),
              const SizedBox(height: 16),
              const Text(
                'Formula:',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 6),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.withAlpha(20),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  formula,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 11,
                    height: 1.3,
                  ),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  // --- Styling Helpers for Verification Card ---

  Color _getStatusBgColor(double diff, bool isDark) {
    if (diff.abs() <= 0.01)
      return isDark ? const Color(0xFF064E3B) : const Color(0xFFECFDF5);
    if (diff < -0.01)
      return isDark ? const Color(0xFF991B1B) : const Color(0xFFFEF2F2);
    return isDark ? const Color(0xFF78350F) : const Color(0xFFFFFBEB);
  }

  Color _getStatusBorderColor(double diff) {
    if (diff.abs() <= 0.01) return const Color(0xFF10B981);
    if (diff < -0.01) return const Color(0xFFEF4444);
    return const Color(0xFFF59E0B);
  }

  Color _getStatusTextColor(double diff, bool isDark) {
    if (diff.abs() <= 0.01)
      return isDark ? const Color(0xFFA7F3D0) : const Color(0xFF047857);
    if (diff < -0.01)
      return isDark ? const Color(0xFFFECACA) : const Color(0xFFB91C1C);
    return isDark ? const Color(0xFFFDE68A) : const Color(0xFFB45309);
  }

  String _getStatusLabel(double diff) {
    if (diff.abs() <= 0.01) return 'Perfect Match';
    if (diff < -0.01) return 'Cash Shortage';
    return 'Extra Cash Found';
  }

  IconData _getStatusIcon(double diff) {
    if (diff.abs() <= 0.01) return LucideIcons.checkCircle2;
    if (diff < -0.01) return LucideIcons.trendingDown;
    return LucideIcons.trendingUp;
  }

  @override
  Widget build(BuildContext context) {
    // Listen to WorkingDateCubit to rebuild screen on date changes
    context.watch<WorkingDateCubit>();

    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final formattedDate = DateFormat('yyyy-MM-dd').format(_workingDate);

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Welcome banner with Date Selector
              _buildWelcomeBanner(formattedDate, isDark),
              const SizedBox(height: 16),

              // 2. Large sticky cash card: Total Cash In App
              _buildTotalCashInAppCard(isDark),
              const SizedBox(height: 12),

              // 3. Ask AI promo banner
              _buildAskAIPromoted(isDark),
              const SizedBox(height: 16),

              // 4. Section: Company Foundation
              _buildSectionHeader('01', 'Company Foundation', isDark),
              _buildCompanyFoundationCard(isDark),
              const SizedBox(height: 16),

              // 5. Section: Wholesale & Employee
              _buildSectionHeader('02', 'Wholesale & Employee', isDark),
              _buildWholesaleEmployeeGrid(isDark),
              const SizedBox(height: 16),

              // 6. Section: Cash In Hand
              _buildSectionHeader('03', 'Cash In Hand', isDark),
              _buildCashInHandCard(isDark, formattedDate),
              const SizedBox(height: 16),

              // 7. Section: Cash In Hand History
              _buildSectionHeader('04', 'Cash In Hand History', isDark),
              _buildHistoryCard(isDark),
              const SizedBox(height: 16),

              // 8. Section: Verification
              _buildSectionHeader('05', 'Verification', isDark),
              _buildVerificationCard(isDark),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWelcomeBanner(String formattedDate, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primary, AppColors.primaryGlow.withBlue(150)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withAlpha(40),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Welcome, Admin AhsAN!',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Real-time cash logs, staff balances, and daily reconciliations.',
                  style: TextStyle(fontSize: 11, color: Colors.white70),
                ),
              ],
            ),
          ),
          Row(
            children: [
              IconButton(
                icon: const Icon(
                  LucideIcons.refreshCw,
                  color: Colors.white,
                  size: 18,
                ),
                tooltip: 'Refresh Live Data',
                onPressed: () {
                  _loadData();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Refreshing dashboard metrics from server...',
                      ),
                      duration: Duration(seconds: 1),
                    ),
                  );
                },
              ),
              const SizedBox(width: 4),
              // Working Date trigger pill (Compact)
              Material(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(20),
                child: InkWell(
                  borderRadius: BorderRadius.circular(20),
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _workingDate,
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2030),
                    );
                    if (picked != null) {
                      if (!mounted) return;
                      context.read<WorkingDateCubit>().changeDate(picked);
                    }
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          LucideIcons.calendarCheck,
                          size: 14,
                          color: Colors.white,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          formattedDate,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTotalCashInAppCard(bool isDark) {
    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isDark ? AppColors.borderDark : const Color(0xFF99F6E4),
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: isDark
                ? [AppColors.cardDark, AppColors.cardDark.withAlpha(200)]
                : [const Color(0xFFF0FDF4), Colors.white],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Container(
              height: 48,
              width: 48,
              decoration: BoxDecoration(
                color: Colors.teal.shade50,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(
                LucideIcons.wallet,
                color: AppColors.primary,
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'TOTAL CASH IN APP',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: AppColors.mutedFgLight,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _fmt(_totalCashInApp),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(LucideIcons.info, size: 18),
              onPressed: () {
                _showFormulaDialog(
                  'Total Cash In App',
                  'Calculates the net cash that should theoretically be held in physical drawers/wallets.',
                  'Total Invest:        ${_totalInvest.toStringAsFixed(2)} SAR\n- Wholesale Value:   ${_wholesaleCurrentValue.toStringAsFixed(2)} SAR\n- Employee Outstand: ${_employeeOutstanding.toStringAsFixed(2)} SAR\n────────────────────\n= Cash In App:       ${_totalCashInApp.toStringAsFixed(2)} SAR',
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAskAIPromoted(bool isDark) {
    return InkWell(
      onTap: () {
        showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              title: const Row(
                children: [
                  Icon(LucideIcons.sparkles, color: AppColors.primary),
                  SizedBox(width: 8),
                  Text(
                    'AI Insights',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              content: const Text(
                'Get deep analytics, forecast projections, and anomaly detection. AI queries are processed dynamically.\n\n(Coming soon to the mobile app dashboard. Use the web portal for real-time AI access.)',
                style: TextStyle(fontSize: 13, height: 1.4),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Got it'),
                ),
              ],
            );
          },
        );
      },
      child: Card(
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: isDark
                ? AppColors.borderDark
                : AppColors.primary.withAlpha(50),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            children: [
              Container(
                height: 36,
                width: 36,
                decoration: BoxDecoration(
                  color: AppColors.primary.withAlpha(30),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  LucideIcons.sparkles,
                  color: AppColors.primary,
                  size: 18,
                ),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Ask AI Insights',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      'Ask automated questions & get data comparisons.',
                      style: TextStyle(color: Colors.grey, fontSize: 11),
                    ),
                  ],
                ),
              ),
              const Icon(
                LucideIcons.chevronRight,
                color: Colors.grey,
                size: 16,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String index, String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(top: 20.0, bottom: 8.0),
      child: Row(
        children: [
          Text(
            index,
            style: const TextStyle(
              fontFamily: 'monospace',
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            title.toUpperCase(),
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Divider(
              color: isDark ? AppColors.borderDark : AppColors.borderLight,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCompanyFoundationCard(bool isDark) {
    return Column(
      children: [
        // 1. Total Invest Showcase Card
        Card(
          elevation: 0,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(
              color: isDark ? AppColors.borderDark : const Color(0xFF99F6E4),
              width: 1.5,
            ),
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: LinearGradient(
                colors: isDark
                    ? [AppColors.cardDark, AppColors.cardDark.withAlpha(200)]
                    : [const Color(0xFFF0FDF4), Colors.white],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Container(
                  height: 40,
                  width: 40,
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.inputDark : Colors.teal.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    LucideIcons.landmark,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'TOTAL INVEST',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppColors.mutedFgLight,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _fmt(_totalInvest),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(
                    LucideIcons.info,
                    size: 16,
                    color: Colors.grey,
                  ),
                  onPressed: () {
                    _showFormulaDialog(
                      'Total Invest',
                      'Total operational capital currently inside cash cycles.',
                      'Opening Balance:    ${_openingCapital.toStringAsFixed(2)} SAR\n+ Total Shop Cash:   ${_totalShopCashPosition.toStringAsFixed(2)} SAR\n+ Company Balance:   ${_currentCompanyBalance.toStringAsFixed(2)} SAR\n────────────────────\n= Total Invest:      ${_totalInvest.toStringAsFixed(2)} SAR',
                    );
                  },
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // 2. Sub cards split row
        Row(
          children: [
            Expanded(
              child: _buildSubFoundationCard(
                label: 'Opening Balance',
                value: _openingCapital,
                icon: LucideIcons.lock,
                isDark: isDark,
                onTap: _showEditOpeningBalanceDialog,
                onInfo: () {
                  _showFormulaDialog(
                    'Company Opening Balance',
                    'Fixed baseline capital allocation for the operational account.',
                    '= ${_openingCapital.toStringAsFixed(2)} SAR',
                  );
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildSubFoundationCard(
                label: 'Shop Cash Position',
                value: _totalShopCashPosition,
                icon: LucideIcons.store,
                isDark: isDark,
                onTap: _showShopBreakdownSheet,
                onInfo: () {
                  _showFormulaDialog(
                    'Total Shop Cash Position',
                    'The sum of cash balances currently held across all shops.',
                    'Formula varies by shop settings:\n- simple_cash: Cash In - Expense\n- full_erp:    (Cash Sale + Bank Withdraw) - (Purchase + Expense)',
                  );
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSubFoundationCard({
    required String label,
    required double value,
    required IconData icon,
    required bool isDark,
    VoidCallback? onTap,
    required VoidCallback onInfo,
  }) {
    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          height: 28,
                          width: 28,
                          decoration: BoxDecoration(
                            color: isDark
                                ? AppColors.inputDark
                                : Colors.teal.shade50,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(icon, color: AppColors.primary, size: 14),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            label.toUpperCase(),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                    icon: const Icon(
                      LucideIcons.info,
                      size: 14,
                      color: Colors.grey,
                    ),
                    onPressed: onInfo,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      _fmt(value),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (onTap != null)
                    const Icon(
                      LucideIcons.chevronRight,
                      size: 14,
                      color: Colors.grey,
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWholesaleEmployeeGrid(bool isDark) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildMetricItem(
                label: 'Wholesale Current Value',
                value: _wholesaleCurrentValue,
                icon: LucideIcons.package,
                isDark: isDark,
                onTap: _showWarehouseBreakdownSheet,
                onInfo: () {
                  _showFormulaDialog(
                    'Wholesale Current Value',
                    'Sum of warehouse stocks (measured at purchase cost) and wholesale client dues.',
                    'Current Stock: ${_currentStockValue.toStringAsFixed(2)} SAR\n+ Receivables:  ${_wholesaleReceivables.toStringAsFixed(2)} SAR\n────────────────────\n= Total Value:  ${_wholesaleCurrentValue.toStringAsFixed(2)} SAR',
                  );
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildMetricItem(
                label: 'Employee Outstanding',
                value: _employeeOutstanding,
                icon: LucideIcons.users,
                isDark: isDark,
                onInfo: () {
                  _showFormulaDialog(
                    'Employee Outstanding',
                    'All-time advance payments minus salary settlements across staff accounts.',
                    'Total Given:    ${_employeeEntries.where((e) => e.entryType == 'give').fold(0.0, (s, e) => s + e.amount).toStringAsFixed(2)} SAR\n- Total Recv:    ${_employeeEntries.where((e) => e.entryType == 'receive').fold(0.0, (s, e) => s + e.amount).toStringAsFixed(2)} SAR\n────────────────────\n= Outstanding:   ${_employeeOutstanding.toStringAsFixed(2)} SAR',
                  );
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        _buildMetricItem(
          label: 'Current Company Balance',
          value: _currentCompanyBalance,
          icon: LucideIcons.building2,
          isDark: isDark,
          fullWidth: true,
          onTap: _showWriteCompanyBalanceDialog,
          onInfo: () {
            _showFormulaDialog(
              'Current Company Balance',
              'Capital funds currently inside the primary company operating account.',
              'Opening:  0.00 SAR\n+ Income:  ${_companyTxns.where((t) => t.txnType == 'in' && _isInRange(t.txnDate, _monthStart, _monthEnd)).fold(0.0, (s, t) => s + t.amount).toStringAsFixed(2)} SAR\n- Expense: ${_companyTxns.where((t) => t.txnType == 'out' && _isInRange(t.txnDate, _monthStart, _monthEnd)).fold(0.0, (s, t) => s + t.amount).toStringAsFixed(2)} SAR\n────────────────────\n= Balance: ${_currentCompanyBalance.toStringAsFixed(2)} SAR',
            );
          },
        ),
      ],
    );
  }

  Widget _buildMetricItem({
    required String label,
    required double value,
    required IconData icon,
    required bool isDark,
    bool fullWidth = false,
    VoidCallback? onTap,
    required VoidCallback onInfo,
  }) {
    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: EdgeInsets.all(fullWidth ? 16.0 : 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          height: 28,
                          width: 28,
                          decoration: BoxDecoration(
                            color: isDark
                                ? AppColors.inputDark
                                : Colors.teal.shade50,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(icon, color: AppColors.primary, size: 14),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            label.toUpperCase(),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                    icon: const Icon(
                      LucideIcons.info,
                      size: 14,
                      color: Colors.grey,
                    ),
                    onPressed: onInfo,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      _fmt(value),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (onTap != null)
                    const Icon(
                      LucideIcons.chevronRight,
                      size: 16,
                      color: Colors.grey,
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCashInHandCard(bool isDark, String formattedDate) {
    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Real-world cash holders',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const Text(
              'Add every person or location that physically holds cash.',
              style: TextStyle(color: Colors.grey, fontSize: 11),
            ),
            const SizedBox(height: 12),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _holders.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, i) => _buildHolderRow(i, isDark),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(double.infinity, 38),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: _addHolder,
              icon: const Icon(LucideIcons.plus, size: 16),
              label: const Text('Add Holder'),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: isDark ? AppColors.inputDark : Colors.grey.shade50,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'TOTAL CASH IN HAND',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                      letterSpacing: 0.5,
                    ),
                  ),
                  Text(
                    _fmt(_totalCashInHand),
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 40),
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: _saveTodaySnapshot,
              icon: const Icon(LucideIcons.save, size: 16),
              label: Text('Save Today ($formattedDate)'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHolderRow(int index, bool isDark) {
    return Row(
      children: [
        Expanded(
          flex: 3,
          child: TextField(
            controller: _nameControllers[index],
            decoration: const InputDecoration(
              hintText: 'Name (e.g. Safe, Manager)',
              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
            onChanged: (val) {
              _holders[index] = CashHolderModel(
                name: val,
                amount: _holders[index].amount,
              );
              _saveCurrentHolders();
              setState(() {});
            },
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          flex: 2,
          child: TextField(
            controller: _amountControllers[index],
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            textAlign: TextAlign.end,
            decoration: const InputDecoration(
              hintText: '0.00',
              suffixText: ' SAR',
              suffixStyle: TextStyle(fontSize: 11, color: Colors.grey),
              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
            onChanged: (val) {
              final amt = double.tryParse(val) ?? 0.0;
              _holders[index] = CashHolderModel(
                name: _holders[index].name,
                amount: amt,
              );
              _saveCurrentHolders();
              setState(() {});
            },
          ),
        ),
        const SizedBox(width: 4),
        IconButton(
          icon: const Icon(
            LucideIcons.trash2,
            color: AppColors.destructive,
            size: 16,
          ),
          onPressed: _holders.length <= 1 ? null : () => _removeHolder(index),
        ),
      ],
    );
  }

  Widget _buildHistoryCard(bool isDark) {
    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _snapshots.isEmpty
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 24.0),
                  child: Column(
                    children: [
                      Icon(LucideIcons.history, color: Colors.grey, size: 28),
                      SizedBox(height: 8),
                      Text(
                        'No saved snapshots yet.',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Save your first daily cash count above.',
                        style: TextStyle(fontSize: 11, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              )
            : ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _snapshots.length,
                separatorBuilder: (_, __) => Divider(
                  color: isDark ? AppColors.borderDark : AppColors.borderLight,
                  height: 16,
                ),
                itemBuilder: (context, i) {
                  final snap = _snapshots[i];
                  final diff = snap.difference;
                  final dateStr = DateFormat(
                    'yyyy-MM-dd',
                  ).format(snap.snapshotDate);

                  String badgeText = 'Matched';
                  Color chipBg = const Color(0xFFD1FAE5);
                  Color chipText = const Color(0xFF065F46);
                  IconData chipIcon = LucideIcons.checkCircle2;

                  if (diff < -0.01) {
                    badgeText = 'Shortage ${diff.toStringAsFixed(2)}';
                    chipBg = const Color(0xFFFEE2E2);
                    chipText = const Color(0xFF991B1B);
                    chipIcon = LucideIcons.trendingDown;
                  } else if (diff > 0.01) {
                    badgeText = 'Extra +${diff.toStringAsFixed(2)}';
                    chipBg = const Color(0xFFFEF3C7);
                    chipText = const Color(0xFF92400E);
                    chipIcon = LucideIcons.trendingUp;
                  }

                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  dateStr,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 6,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    color: chipBg,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(chipIcon, color: chipText, size: 10),
                                      const SizedBox(width: 2),
                                      Text(
                                        badgeText,
                                        style: TextStyle(
                                          color: chipText,
                                          fontSize: 9,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Hand: ${_fmt(snap.cashInHand)} · App: ${_fmt(snap.cashInApp)}',
                              style: const TextStyle(
                                fontSize: 11,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(
                          LucideIcons.trash2,
                          size: 16,
                          color: Colors.grey,
                        ),
                        onPressed: () => _deleteSnapshot(snap.id),
                      ),
                    ],
                  );
                },
              ),
      ),
    );
  }

  Widget _buildVerificationCard(bool isDark) {
    final diff = _difference;
    final absDiff = diff.abs();

    final bg = _getStatusBgColor(diff, isDark);
    final border = _getStatusBorderColor(diff);
    final textCol = _getStatusTextColor(diff, isDark);
    final label = _getStatusLabel(diff);
    final icon = _getStatusIcon(diff);

    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: border, width: 1.5),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(20),
        ),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: border.withAlpha(40),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(icon, color: border, size: 12),
                      const SizedBox(width: 4),
                      Text(
                        label.toUpperCase(),
                        style: TextStyle(
                          color: border,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  constraints: const BoxConstraints(),
                  padding: EdgeInsets.zero,
                  icon: const Icon(
                    LucideIcons.info,
                    size: 16,
                    color: Colors.grey,
                  ),
                  onPressed: () {
                    _showFormulaDialog(
                      'Verification Difference',
                      'The net discrepancy between counted cash and recorded system cash.',
                      'Cash in Hand: ${_totalCashInHand.toStringAsFixed(2)} SAR\n- Cash in App:  ${_totalCashInApp.toStringAsFixed(2)} SAR\n────────────────────\n= Difference:   ${_difference.toStringAsFixed(2)} SAR',
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              'Cash In Hand - Cash In App',
              style: TextStyle(color: Colors.grey, fontSize: 11),
            ),
            const SizedBox(height: 4),
            Text(
              _fmt(absDiff),
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: textCol,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
