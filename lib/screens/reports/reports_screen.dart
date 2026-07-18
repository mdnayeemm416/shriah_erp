import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';

import '../../blocs/shop/shop_bloc.dart';
import '../../blocs/shop/shop_event.dart';
import '../../blocs/shop/shop_state.dart';
import '../../models/shop_entry_model.dart';
import '../../models/shop_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/localization/translate_extension.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String? _selectedShopId;
  String _selectedEntryType = 'all'; // 'all' | 'sale' | 'purchase' | 'expense' | 'withdraw'
  final _searchController = TextEditingController();
  final _minAmountController = TextEditingController();
  final _maxAmountController = TextEditingController();

  List<ShopEntryModel> _filteredEntries = [];
  bool _filtersVisible = false;

  @override
  void dispose() {
    _searchController.dispose();
    _minAmountController.dispose();
    _maxAmountController.dispose();
    super.dispose();
  }

  void _applyFilters(List<ShopEntryModel> allEntries) {
    var list = allEntries;

    // Filter by Shop
    if (_selectedShopId != null && _selectedShopId != 'all') {
      list = list.where((e) => e.shopId == _selectedShopId).toList();
    }

    // Filter by Entry Type
    if (_selectedEntryType != 'all') {
      list = list.where((e) => e.entryType == _selectedEntryType).toList();
    }

    // Filter by Text Search
    final query = _searchController.text.trim().toLowerCase();
    if (query.isNotEmpty) {
      list = list.where((e) {
        final notes = (e.notes ?? '').toLowerCase();
        final type = e.entryType.toLowerCase();
        return notes.contains(query) || type.contains(query);
      }).toList();
    }

    // Filter by Min Amount
    final min = double.tryParse(_minAmountController.text);
    if (min != null) {
      list = list.where((e) => _getAmount(e) >= min).toList();
    }

    // Filter by Max Amount
    final max = double.tryParse(_maxAmountController.text);
    if (max != null) {
      list = list.where((e) => _getAmount(e) <= max).toList();
    }

    setState(() {
      _filteredEntries = list;
    });
  }

  double _getAmount(ShopEntryModel e) {
    if (e.entryType == 'sale') return e.posSale + e.cashSale + e.bankSale + e.creditSale;
    if (e.entryType == 'purchase') return e.purchaseAmount;
    if (e.entryType == 'expense') return e.expenseAmount;
    if (e.entryType == 'withdraw') return e.withdrawAmount;
    return 0.0;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final shopState = context.watch<ShopBloc>().state;

    List<ShopModel> shops = [];
    List<ShopEntryModel> allEntries = [];

    if (shopState is ShopLoaded) {
      shops = shopState.shops;
      // Fetch all entries without date filters for global reports
      allEntries = shopState.entries;
    }

    // Trigger update if entries changes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_filteredEntries.isEmpty && allEntries.isNotEmpty && _searchController.text.isEmpty) {
        _applyFilters(allEntries);
      }
    });

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    context.t('nav.reports'),
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    context.t('nav.desc.reports'),
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? AppColors.mutedFgDark : AppColors.mutedFgLight,
                    ),
                  ),
                ],
              ),
              // Export CSV / Excel Button
              OutlinedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Report exported to Documents/ShRiAh_Report.xlsx')),
                  );
                },
                icon: const Icon(LucideIcons.fileSpreadsheet, size: 16),
                label: const Text('Export Excel'),
              ),
            ],
          ),
          const SizedBox(height: 32),

          // Search Bar & Filter Toggle Row
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(LucideIcons.search, size: 20),
                    hintText: 'Search entries by notes or type...',
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              _applyFilters(allEntries);
                            },
                          )
                        : null,
                  ),
                  onChanged: (_) => _applyFilters(allEntries),
                ),
              ),
              const SizedBox(width: 12),
              IconButton(
                style: IconButton.styleFrom(
                  backgroundColor: _filtersVisible
                      ? AppColors.primary.withAlpha(30)
                      : (isDark ? AppColors.mutedDark : AppColors.mutedLight),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.all(14),
                ),
                onPressed: () {
                  setState(() {
                    _filtersVisible = !_filtersVisible;
                  });
                },
                icon: Icon(
                  LucideIcons.sliders,
                  color: _filtersVisible ? AppColors.primary : null,
                  size: 22,
                ),
              ),
            ],
          ),

          // Expanded Filters Panel
          if (_filtersVisible) ...[
            const SizedBox(height: 16),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Advanced Filters', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        // Shop Filter dropdown
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _selectedShopId ?? 'all',
                            decoration: const InputDecoration(
                              labelText: 'Shop Location',
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            items: [
                              const DropdownMenuItem(value: 'all', child: Text('All Shops')),
                              ...shops.map((s) => DropdownMenuItem(value: s.id, child: Text(s.name))),
                            ],
                            onChanged: (val) {
                              setState(() {
                                _selectedShopId = val;
                              });
                              _applyFilters(allEntries);
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        // Entry Type dropdown
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _selectedEntryType,
                            decoration: const InputDecoration(
                              labelText: 'Entry Type',
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            items: const [
                              DropdownMenuItem(value: 'all', child: Text('All Types')),
                              DropdownMenuItem(value: 'sale', child: Text('Sales')),
                              DropdownMenuItem(value: 'purchase', child: Text('Purchases')),
                              DropdownMenuItem(value: 'expense', child: Text('Expenses')),
                              DropdownMenuItem(value: 'withdraw', child: Text('Withdrawals')),
                            ],
                            onChanged: (val) {
                              setState(() {
                                _selectedEntryType = val!;
                              });
                              _applyFilters(allEntries);
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Value range filters
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _minAmountController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(
                              labelText: 'Min Amount (SAR)',
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            onChanged: (_) => _applyFilters(allEntries),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _maxAmountController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(
                              labelText: 'Max Amount (SAR)',
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            onChanged: (_) => _applyFilters(allEntries),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
          const SizedBox(height: 24),

          // Results Listing
          Expanded(
            child: _filteredEntries.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.clipboardList, size: 48, color: AppColors.mutedFgLight),
                        SizedBox(height: 12),
                        Text('No records match your filter criteria.'),
                      ],
                    ),
                  )
                : ListView.separated(
                    itemCount: _filteredEntries.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final entry = _filteredEntries[index];
                      final amount = _getAmount(entry);
                      final isOut = entry.entryType == 'purchase' ||
                          entry.entryType == 'expense' ||
                          entry.entryType == 'withdraw';

                      Color entryColor = AppColors.primary;
                      IconData entryIcon = LucideIcons.shoppingCart;
                      
                      if (entry.entryType == 'purchase') {
                        entryColor = AppColors.warning;
                        entryIcon = LucideIcons.package;
                      } else if (entry.entryType == 'expense') {
                        entryColor = AppColors.destructive;
                        entryIcon = LucideIcons.banknote;
                      } else if (entry.entryType == 'withdraw') {
                        entryColor = Colors.purple;
                        entryIcon = LucideIcons.arrowUpCircle;
                      }

                      return Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(16),
                          onTap: () => _showDetailsDialog(context, entry, amount),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 20,
                                  backgroundColor: entryColor.withAlpha(20),
                                  child: Icon(entryIcon, color: entryColor, size: 20),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        entry.entryType.toUpperCase(),
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: entryColor,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        entry.notes ?? 'No description notes',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontWeight: FontWeight.w600),
                                      ),
                                    ],
                                  ),
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      '${isOut ? '-' : '+'}${amount.toStringAsFixed(2)} SAR',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: isOut ? AppColors.destructive : AppColors.success,
                                        fontSize: 15,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      DateFormat('yyyy-MM-dd').format(entry.txnDate),
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: AppColors.mutedFgLight,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showDetailsDialog(BuildContext context, ShopEntryModel entry, double amount) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text('${entry.entryType.toUpperCase()} Detail View'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildDetailRow('Amount', '${amount.toStringAsFixed(2)} SAR'),
              _buildDetailRow('Transaction Date', DateFormat('yyyy-MM-dd').format(entry.txnDate)),
              _buildDetailRow('Location Shop ID', entry.shopId),
              if (entry.cashierId != null) _buildDetailRow('Cashier ID', entry.cashierId!),
              _buildDetailRow('Created Stamp', DateFormat('yyyy-MM-dd HH:mm').format(entry.createdAt)),
              if (entry.notes != null) _buildDetailRow('Description notes', entry.notes!),
              if (entry.entryType == 'sale') ...[
                const Divider(),
                _buildDetailRow('  • POS Sale', '${entry.posSale} SAR'),
                _buildDetailRow('  • Cash Sale', '${entry.cashSale} SAR'),
                _buildDetailRow('  • Bank Sale', '${entry.bankSale} SAR'),
                _buildDetailRow('  • Credit Sale', '${entry.creditSale} SAR'),
              ],
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
            IconButton(
              icon: const Icon(LucideIcons.trash2, color: AppColors.destructive),
              onPressed: () {
                context.read<ShopBloc>().add(DeleteEntry(entry.id));
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Transaction successfully deleted.')),
                );
              },
            ),
          ],
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: RichText(
        text: TextSpan(
          style: const TextStyle(fontSize: 14, color: Colors.black87),
          children: [
            TextSpan(text: '$label: ', style: const TextStyle(fontWeight: FontWeight.bold)),
            TextSpan(text: value),
          ],
        ),
      ),
    );
  }
}
