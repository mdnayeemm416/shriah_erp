import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/theme/app_colors.dart';
import '../../blocs/sales_management/sales_management_state.dart'; // For VisitRecord
import '../../blocs/sales_management_admin/sales_management_admin_cubit.dart';
import '../../blocs/sales_management_admin/sales_management_admin_state.dart';

class SalesManagementAdminScreen extends StatefulWidget {
  const SalesManagementAdminScreen({super.key});

  @override
  State<SalesManagementAdminScreen> createState() =>
      _SalesManagementAdminScreenState();
}

class _SalesManagementAdminScreenState
    extends State<SalesManagementAdminScreen> {
  final _searchTextController = TextEditingController();
  int _innerTab = 0; // 0: Visit Records, 1: Salesman Breakdown, 2: Daily Map

  @override
  void dispose() {
    _searchTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : Colors.black;
    final subtextColor = isDark ? Colors.grey[400] : const Color(0xFF64748B);
    final borderColor = isDark
        ? Colors.white10
        : Colors.black.withValues(alpha: 0.05);

    return BlocBuilder<SalesManagementAdminCubit, SalesManagementAdminState>(
      builder: (context, state) {
        final selectedDate = state.selectedDate;

        // 1. Filter records by selected date
        final dateRecords = state.visitRecords.where((record) {
          return record.dateTime.year == selectedDate.year &&
              record.dateTime.month == selectedDate.month &&
              record.dateTime.day == selectedDate.day;
        }).toList();

        // Sort by time ascending for gap calculations
        dateRecords.sort((a, b) => a.dateTime.compareTo(b.dateTime));

        // Get list of unique customers for filter dropdown
        final customersList = ['All customers'];
        for (final r in state.visitRecords) {
          if (!customersList.contains(r.customerName)) {
            customersList.add(r.customerName);
          }
        }

        // Get list of unique salesmen for filter
        final salesmenList = ['All Salesmen'];
        for (final r in state.visitRecords) {
          if (!salesmenList.contains(r.salesmanName)) {
            salesmenList.add(r.salesmanName);
          }
        }

        // Apply filters: Payment type, Customer, Salesman
        final filteredRecords = dateRecords.where((r) {
          final matchesPayment =
              state.paymentTypeFilter == 'All payment types' ||
              r.paymentType.toLowerCase() ==
                  state.paymentTypeFilter.toLowerCase();

          final matchesCustomer =
              state.customerFilter == 'All customers' ||
              r.customerName == state.customerFilter;

          final matchesSalesman =
              state.salesmanFilter == 'All Salesmen' ||
              r.salesmanName.toLowerCase() ==
                  state.salesmanFilter.toLowerCase();

          return matchesPayment && matchesCustomer && matchesSalesman;
        }).toList();

        // 2. Compute Statistics on filtered records
        final totalVisits = filteredRecords.length;
        final uniqueShops = filteredRecords
            .map((r) => r.shopName)
            .toSet()
            .length;
        final totalSale = filteredRecords.fold<double>(
          0.0,
          (sum, r) => sum + r.amount,
        );

        // Subtotals & counts
        double cashTotal = 0.0;
        double bankTotal = 0.0;
        double creditTotal = 0.0;
        int zeroSaleCount = 0;

        for (final r in filteredRecords) {
          if (r.amount == 0) {
            zeroSaleCount++;
          }
          if (r.paymentType == 'Cash') {
            cashTotal += r.amount;
          } else if (r.paymentType == 'Bank') {
            bankTotal += r.amount;
          } else if (r.paymentType == 'Credit') {
            creditTotal += r.amount;
          } else if (r.paymentType == 'Partial') {
            // Sum portions
            cashTotal += r.cashAmount;
            bankTotal += r.bankAmount;
            creditTotal += r.creditAmount;
          }
        }

        // Time stats (on dateRecords for consistency with day timeline)
        String firstVisitTime = '--:--';
        String lastVisitTime = '--:--';
        String avgGapText = 'N/A';

        if (dateRecords.isNotEmpty) {
          firstVisitTime = DateFormat(
            'HH:mm',
          ).format(dateRecords.first.dateTime);
          lastVisitTime = DateFormat('HH:mm').format(dateRecords.last.dateTime);

          if (dateRecords.length > 1) {
            int totalDiffMinutes = 0;
            for (int i = 0; i < dateRecords.length - 1; i++) {
              totalDiffMinutes += dateRecords[i + 1].dateTime
                  .difference(dateRecords[i].dateTime)
                  .inMinutes;
            }
            final avgMinutes = totalDiffMinutes ~/ (dateRecords.length - 1);
            final hours = avgMinutes ~/ 60;
            final mins = avgMinutes % 60;
            avgGapText = hours > 0 ? '${hours}h ${mins}m' : '${mins}m';
          }
        }

        return GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: Scaffold(
            backgroundColor: bgColor,
            body: SafeArea(
              child: CustomScrollView(
                physics: const BouncingScrollPhysics(),
                slivers: [
                  // Top Title / Actions Header Bar
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16.0,
                        vertical: 12.0,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'ADMIN PANEL',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.2,
                              color: subtextColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Sales Management',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Main Content Scrollable
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    sliver: SliverList(
                      delegate: SliverChildListDelegate([
                        // Horizontal Calendar Strip
                        HorizontalCalendarStrip(
                          selectedDate: state.selectedDate,
                          onDateSelected: (newDate) {
                            context.read<SalesManagementAdminCubit>().selectDate(newDate);
                          },
                          isDark: isDark,
                          textColor: textColor,
                          subtextColor: subtextColor,
                          cardBg: cardBg,
                        ),
                        const SizedBox(height: 16),

                        // Dropdown / Button Filters Row
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // PAYMENT TYPE DROPDOWN
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  'PAYMENT TYPE',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: subtextColor,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? const Color(0xFF111827)
                                        : const Color(0xFFF8FAFC),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: borderColor),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton<String>(
                                      value: state.paymentTypeFilter,
                                      dropdownColor: cardBg,
                                      icon: const Icon(
                                        LucideIcons.chevronDown,
                                        size: 16,
                                      ),
                                      style: TextStyle(
                                        color: textColor,
                                        fontSize: 13,
                                        fontWeight: FontWeight.w500,
                                      ),
                                      onChanged: (String? val) {
                                        if (val != null) {
                                          context
                                              .read<
                                                SalesManagementAdminCubit
                                              >()
                                              .setPaymentTypeFilter(val);
                                        }
                                      },
                                      items:
                                          <String>[
                                            'All payment types',
                                            'Cash',
                                            'Bank',
                                            'Credit',
                                            'Partial',
                                          ].map<DropdownMenuItem<String>>((
                                            String value,
                                          ) {
                                            return DropdownMenuItem<String>(
                                              value: value,
                                              child: Text(value),
                                            );
                                          }).toList(),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(width: 8),

                            // CUSTOMER SEARCHABLE SELECTOR
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  'CUSTOMER',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: subtextColor,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                InkWell(
                                  onTap: () {
                                    _showCustomerSearchDialog(
                                      context,
                                      state.customerFilter,
                                      customersList,
                                      isDark,
                                      textColor,
                                      subtextColor,
                                      cardBg,
                                      borderColor,
                                    );
                                  },
                                  borderRadius: BorderRadius.circular(16),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 14,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? const Color(0xFF111827)
                                          : const Color(0xFFF8FAFC),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: borderColor),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            state.customerFilter,
                                            style: TextStyle(
                                              color: textColor,
                                              fontSize: 13,
                                              fontWeight: FontWeight.w500,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        Icon(
                                          LucideIcons.chevronDown,
                                          size: 16,
                                          color: subtextColor,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(width: 8),

                            // SALESMAN SEARCHABLE SELECTOR
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  'SALESMAN',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: subtextColor,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                InkWell(
                                  onTap: () {
                                    _showSalesmanSearchDialog(
                                      context,
                                      state.salesmanFilter,
                                      salesmenList,
                                      isDark,
                                      textColor,
                                      subtextColor,
                                      cardBg,
                                      borderColor,
                                    );
                                  },
                                  borderRadius: BorderRadius.circular(16),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 14,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? const Color(0xFF111827)
                                          : const Color(0xFFF8FAFC),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: borderColor),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            state.salesmanFilter,
                                            style: TextStyle(
                                              color: textColor,
                                              fontSize: 13,
                                              fontWeight: FontWeight.w500,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        Icon(
                                          LucideIcons.chevronDown,
                                          size: 16,
                                          color: subtextColor,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // 3-Column Statistics capsules (Matching screenshot)
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: _buildStatCard(
                                    'SHOPS VISITED',
                                    totalVisits.toString(),
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildStatCard(
                                    'UNIQUE SHOPS',
                                    uniqueShops.toString(),
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildStatCard(
                                    'REPORTED SALE',
                                    totalSale.toStringAsFixed(2),
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: _buildStatCard(
                                    'TOTAL CASH',
                                    cashTotal.toStringAsFixed(2),
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildStatCard(
                                    'TOTAL BANK',
                                    bankTotal.toStringAsFixed(2),
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildStatCard(
                                    'TOTAL CREDIT',
                                    creditTotal.toStringAsFixed(2),
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: _buildStatCard(
                                    'ZERO-SALE VISITS',
                                    zeroSaleCount.toString(),
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildStatCard(
                                    'FIRST VISIT',
                                    firstVisitTime,
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildStatCard(
                                    'LAST VISIT',
                                    lastVisitTime,
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: _buildStatCard(
                                    'AVG. TIME\nBETWEEN SHOPS',
                                    avgGapText,
                                    subtextColor,
                                    textColor,
                                    borderColor,
                                  ),
                                ),
                                const Expanded(child: SizedBox()),
                                const SizedBox(width: 8),
                                const Expanded(child: SizedBox()),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Inner tabs selection
                        Row(
                          children: [
                            _buildInnerTabButton(
                              'Visit Records',
                              0,
                              subtextColor,
                            ),
                            _buildInnerTabButton(
                              'Salesman Breakdown',
                              1,
                              subtextColor,
                            ),
                            _buildInnerTabButton('Daily Map', 2, subtextColor),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // List views
                        if (_innerTab == 0) ...[
                          if (filteredRecords.isEmpty)
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.all(32.0),
                                child: Column(
                                  children: [
                                    Icon(
                                      LucideIcons.folderOpen,
                                      size: 48,
                                      color: subtextColor,
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      'No visit records found for this date.',
                                      style: TextStyle(
                                        color: subtextColor,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                          else
                            ListView.separated(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: filteredRecords.length,
                              separatorBuilder: (_, __) =>
                                  const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final record = filteredRecords[index];
                                return _buildRecordCard(
                                  index + 1,
                                  record,
                                  cardBg,
                                  borderColor,
                                  subtextColor,
                                  filteredRecords,
                                );
                              },
                            ),
                        ] else if (_innerTab == 1) ...[
                          Card(
                            color: cardBg,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                              side: BorderSide(color: borderColor),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Salesman Performance',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  _buildBreakdownRow(
                                    'Total Closed Shops',
                                    '15 Shops',
                                    Colors.green,
                                    subtextColor,
                                  ),
                                  _buildBreakdownRow(
                                    'Average Sale Value',
                                    '340.00 SAR',
                                    AppColors.primary,
                                    subtextColor,
                                  ),
                                  _buildBreakdownRow(
                                    'Productivity Rate',
                                    '94.2%',
                                    Colors.orange,
                                    subtextColor,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ] else ...[
                          Card(
                            color: cardBg,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                              side: BorderSide(color: borderColor),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(20.0),
                              child: Column(
                                children: [
                                  Icon(
                                    LucideIcons.map,
                                    size: 48,
                                    color: AppColors.primary.withValues(
                                      alpha: 0.8,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  const Text(
                                    'Route Maps & GPS Tracks',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Active tracking of all salesmen routes for today.',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: subtextColor,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                        const SizedBox(height: 32),
                      ]),
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

  Widget _buildStatCard(
    String label,
    String value,
    Color? subtextColor,
    Color textColor,
    Color borderColor,
  ) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            label.toUpperCase(),
            style: TextStyle(
              fontSize: 8.5,
              fontWeight: FontWeight.bold,
              color: subtextColor,
              letterSpacing: 0.5,
              height: 1.2,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentTypeChip(String type) {
    Color bg;
    Color fg;
    switch (type) {
      case 'No Sale':
        bg = const Color(0xFFFCE8E6);
        fg = const Color(0xFFC5221F);
        break;
      case 'Cash':
        bg = const Color(0xFFE6F4EA);
        fg = const Color(0xFF137333);
        break;
      case 'Bank':
        bg = const Color(0xFFE8F0FE);
        fg = const Color(0xFF1A73E8);
        break;
      case 'Credit':
        bg = const Color(0xFFFEF7E0);
        fg = const Color(0xFFB06000);
        break;
      default: // Partial / other
        bg = const Color(0xFFF3E8FF);
        fg = const Color(0xFF7E22CE);
        break;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        type,
        style: TextStyle(color: fg, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildStatusChip(String label, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: isDark ? Colors.white10 : const Color(0xFFF1F3F4),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isDark ? Colors.white70 : const Color(0xFF5F6368),
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Future<void> _launchMapsUrl(String shopLocation) async {
    try {
      String coords = '24.7136,46.6753';
      if (shopLocation.contains('|')) {
        coords = shopLocation
            .split('|')[0]
            .replaceAll('° N', '')
            .replaceAll('° E', '')
            .replaceAll('Lat:', '')
            .replaceAll('Lon:', '')
            .replaceAll(' ', '');
      } else {
        coords = shopLocation
            .replaceAll('° N', '')
            .replaceAll('° E', '')
            .replaceAll('Lat:', '')
            .replaceAll('Lon:', '')
            .replaceAll(' ', '');
      }
      final url = 'https://www.google.com/maps/search/?api=1&query=$coords';
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (_) {}
  }

  void _showSalesmanSearchDialog(
    BuildContext context,
    String selectedSalesman,
    List<String> salesmen,
    bool isDark,
    Color textColor,
    Color? subtextColor,
    Color cardBg,
    Color borderColor,
  ) {
    showDialog(
      context: context,
      builder: (dialogCtx) {
        String searchQuery = '';
        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final filtered = salesmen.where((name) {
              return name.toLowerCase().contains(searchQuery.toLowerCase());
            }).toList();

            return Dialog(
              backgroundColor: cardBg,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: BorderSide(color: borderColor),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Select Salesman',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      onChanged: (val) {
                        setStateDialog(() {
                          searchQuery = val;
                        });
                      },
                      autofocus: true,
                      decoration: InputDecoration(
                        hintText: 'Search salesman...',
                        prefixIcon: Icon(LucideIcons.search, size: 18, color: subtextColor),
                        filled: true,
                        fillColor: isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
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
                          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxHeight: 300),
                      child: ListView.builder(
                        shrinkWrap: true,
                        itemCount: filtered.length,
                        itemBuilder: (context, idx) {
                          final name = filtered[idx];
                          final isCurrent = name == selectedSalesman;
                          return ListTile(
                            onTap: () {
                              dialogCtx.read<SalesManagementAdminCubit>().setSalesmanFilter(name);
                              Navigator.pop(dialogCtx);
                            },
                            contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                            leading: CircleAvatar(
                              radius: 16,
                              backgroundColor: isCurrent ? AppColors.primaryGlow : (isDark ? Colors.white10 : const Color(0xFFF1F5F9)),
                              child: Icon(
                                name == 'All Salesmen' ? LucideIcons.users : LucideIcons.user,
                                size: 14,
                                color: isCurrent ? Colors.white : textColor,
                              ),
                            ),
                            title: Text(
                              name,
                              style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                                  color: isCurrent ? AppColors.primaryGlow : textColor),
                            ),
                            trailing: isCurrent
                                ? const Icon(LucideIcons.check, size: 16, color: AppColors.primaryGlow)
                                : null,
                          );
                        },
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

  void _showCustomerSearchDialog(
    BuildContext context,
    String selectedCustomer,
    List<String> customers,
    bool isDark,
    Color textColor,
    Color? subtextColor,
    Color cardBg,
    Color borderColor,
  ) {
    showDialog(
      context: context,
      builder: (dialogCtx) {
        String searchQuery = '';
        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final filtered = customers.where((name) {
              return name.toLowerCase().contains(searchQuery.toLowerCase());
            }).toList();

            return Dialog(
              backgroundColor: cardBg,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: BorderSide(color: borderColor),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Select Customer',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      onChanged: (val) {
                        setStateDialog(() {
                          searchQuery = val;
                        });
                      },
                      autofocus: true,
                      decoration: InputDecoration(
                        hintText: 'Search customer...',
                        prefixIcon: Icon(LucideIcons.search, size: 18, color: subtextColor),
                        filled: true,
                        fillColor: isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
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
                          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxHeight: 300),
                      child: ListView.builder(
                        shrinkWrap: true,
                        itemCount: filtered.length,
                        itemBuilder: (context, idx) {
                          final name = filtered[idx];
                          final isCurrent = name == selectedCustomer;
                          return ListTile(
                            onTap: () {
                              dialogCtx.read<SalesManagementAdminCubit>().setCustomerFilter(name);
                              Navigator.pop(dialogCtx);
                            },
                            contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                            leading: CircleAvatar(
                              radius: 16,
                              backgroundColor: isCurrent ? AppColors.primaryGlow : (isDark ? Colors.white10 : const Color(0xFFF1F5F9)),
                              child: Icon(
                                name == 'All customers' ? LucideIcons.users : LucideIcons.userCheck,
                                size: 14,
                                color: isCurrent ? Colors.white : textColor,
                              ),
                            ),
                            title: Text(
                              name,
                              style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                                  color: isCurrent ? AppColors.primaryGlow : textColor),
                            ),
                            trailing: isCurrent
                                ? const Icon(LucideIcons.check, size: 16, color: AppColors.primaryGlow)
                                : null,
                          );
                        },
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

  Widget _buildRecordCard(
    int index,
    VisitRecord record,
    Color cardBg,
    Color borderColor,
    Color? subtextColor,
    List<VisitRecord> dateRecords,
  ) {
    final timeStr = DateFormat('HH:mm').format(record.dateTime);
    final hasImage =
        record.photoPath.isNotEmpty && File(record.photoPath).existsSync();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Calculate time from previous shop
    String timeGapStr = 'First Visit of Day';
    if (index > 1) {
      final prevRecord = dateRecords[index - 2];
      final diff = record.dateTime.difference(prevRecord.dateTime);
      final diffInMinutes = diff.inMinutes;
      if (diffInMinutes < 60) {
        timeGapStr = 'Approx. Time from Previous Shop: $diffInMinutes minutes';
      } else {
        final hours = diffInMinutes ~/ 60;
        final mins = diffInMinutes % 60;
        timeGapStr = 'Approx. Time from Previous Shop: ${hours}h ${mins}m';
      }
    }

    // Parse location
    String addressStr = 'Address not captured';
    if (record.shopLocation.contains('|')) {
      final parts = record.shopLocation.split('|');
      addressStr = parts[1];
    } else {
      addressStr = record.shopLocation;
    }

    final isZeroSale = record.amount == 0;

    return Card(
      color: cardBg,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: borderColor),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Column: Index Circle
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                color: AppColors.primaryGlow,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  index.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 14),

            // Middle Column: Content Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and Chips
                  Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    spacing: 6,
                    runSpacing: 4,
                    children: [
                      Text(
                        record.shopName,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      _buildPaymentTypeChip(
                        isZeroSale ? 'No Sale' : record.paymentType,
                      ),
                      _buildStatusChip('captured', isDark),
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Amount
                  Text(
                    '${record.amount.toStringAsFixed(2)} SAR',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: AppColors.primaryGlow,
                    ),
                  ),
                  const SizedBox(height: 6),

                  // Breakdown
                  Text(
                    'Cash ${record.cashAmount.toStringAsFixed(2)} · Bank ${record.bankAmount.toStringAsFixed(2)} · Credit ${record.creditAmount.toStringAsFixed(2)}',
                    style: TextStyle(fontSize: 11, color: subtextColor),
                  ),
                  const SizedBox(height: 6),

                  // Notes
                  if (record.notes.isNotEmpty) ...[
                    Text(
                      '"${record.notes}"',
                      style: TextStyle(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                        color: isDark ? Colors.white70 : Colors.grey[800],
                      ),
                    ),
                    const SizedBox(height: 6),
                  ],

                  // Clock & time from previous
                  Row(
                    children: [
                      Icon(LucideIcons.clock, size: 12, color: subtextColor),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          '$timeStr · $timeGapStr',
                          style: TextStyle(fontSize: 11, color: subtextColor),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),

                  // Address
                  Text(
                    addressStr,
                    style: TextStyle(fontSize: 11, color: subtextColor),
                  ),
                  const SizedBox(height: 8),

                  // Open in Google Maps Link button
                  InkWell(
                    onTap: () => _launchMapsUrl(record.shopLocation),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          LucideIcons.externalLink,
                          size: 14,
                          color: AppColors.primary,
                        ),
                        SizedBox(width: 4),
                        Text(
                          'Open in Google Maps',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),

            // Right Column: Shop Photo Preview
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: isDark ? Colors.white10 : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: borderColor),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: hasImage
                    ? Image.file(File(record.photoPath), fit: BoxFit.cover)
                    : Container(
                        color: Colors
                            .black, // Display black box just like Card 3 in screenshot
                        child: const Icon(
                          LucideIcons.image,
                          size: 24,
                          color: Colors.white24,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInnerTabButton(String text, int index, Color? subtextColor) {
    final isSelected = _innerTab == index;
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2.0),
        child: InkWell(
          onTap: () => setState(() => _innerTab = index),
          borderRadius: BorderRadius.circular(24),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 10),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primaryGlow : Colors.transparent,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Center(
              child: Text(
                text,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.white : subtextColor,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBreakdownRow(
    String label,
    String value,
    Color color,
    Color? subtextColor,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: subtextColor)),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              value,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class HorizontalCalendarStrip extends StatelessWidget {
  final DateTime selectedDate;
  final Function(DateTime) onDateSelected;
  final bool isDark;
  final Color textColor;
  final Color? subtextColor;
  final Color cardBg;

  const HorizontalCalendarStrip({
    super.key,
    required this.selectedDate,
    required this.onDateSelected,
    required this.isDark,
    required this.textColor,
    required this.subtextColor,
    required this.cardBg,
  });

  @override
  Widget build(BuildContext context) {
    // Generate a 15-day range centered around selectedDate
    final List<DateTime> dates = List.generate(15, (index) {
      return selectedDate.subtract(Duration(days: 7 - index));
    });

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              DateFormat('MMMM yyyy').format(selectedDate).toUpperCase(),
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: textColor,
                letterSpacing: 1.0,
              ),
            ),
            IconButton(
              icon: const Icon(LucideIcons.calendar, size: 20, color: AppColors.primaryGlow),
              onPressed: () async {
                final newDate = await showDatePicker(
                  context: context,
                  initialDate: selectedDate,
                  firstDate: DateTime(2020),
                  lastDate: DateTime(2030),
                );
                if (newDate != null) {
                  onDateSelected(newDate);
                }
              },
            ),
          ],
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 68,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: dates.length,
            itemBuilder: (context, index) {
              final date = dates[index];
              final isSelected = DateUtils.isSameDay(date, selectedDate);
              final dayName = DateFormat('E').format(date); // Mon, Tue...
              final dayNum = DateFormat('d').format(date); // 29, 30...

              return Padding(
                padding: const EdgeInsets.only(right: 8.0),
                child: InkWell(
                  onTap: () => onDateSelected(date),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    width: 52,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primaryGlow
                          : (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? Colors.transparent : (isDark ? Colors.white10 : Colors.black12),
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          dayName,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isSelected ? Colors.white70 : subtextColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          dayNum,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: isSelected ? Colors.white : textColor,
                          ),
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
    );
  }
}
