import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/theme/app_colors.dart';
import '../common_widgets/empty_error_state_widgets.dart';
import '../../models/sales_visit_model.dart';
import '../../blocs/sales_management_admin/sales_management_admin_cubit.dart';
import '../../blocs/sales_management_admin/sales_management_admin_state.dart';
import 'package:toastification/toastification.dart';

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
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SalesManagementAdminCubit>().resetAndLoad();
    });
  }

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

    return BlocListener<SalesManagementAdminCubit, SalesManagementAdminState>(
      listenWhen: (previous, current) => current.error.isNotEmpty && previous.error != current.error,
      listener: (context, state) {
        if (state.error.isNotEmpty) {
          toastification.show(
            context: context,
            type: ToastificationType.error,
            style: ToastificationStyle.flatColored,
            title: const Text('Admin API Error'),
            description: Text(state.error),
            autoCloseDuration: const Duration(seconds: 4),
            showProgressBar: true,
          );
        }
      },
      child: BlocBuilder<SalesManagementAdminCubit, SalesManagementAdminState>(
        builder: (context, state) {

        // 1. Filter records frontend-side only by customer if filtered
        final filteredRecords = state.visitRecords.where((r) {
          final matchesCustomer =
              state.customerFilter == 'All customers' ||
              r.customerName == state.customerFilter;
          return matchesCustomer;
        }).toList();

        // Sort by time ascending for gap calculations and list ordering
        filteredRecords.sort((a, b) => a.dateTime.compareTo(b.dateTime));

        // Get list of unique customers for filter dropdown
        final customersList = ['All customers'];
        for (final r in state.visitRecords) {
          if (!customersList.contains(r.customerName)) {
            customersList.add(r.customerName);
          }
        }

        // Get list of unique salesmen for filter
        final salesmenList = state.salesmenDropdown;

        // 2. Compute or Read Statistics
        final metrics = state.summaryMetrics;
        final totalVisits = metrics?.totalVisits ?? filteredRecords.length;
        final uniqueShops = metrics?.uniqueShops ?? filteredRecords.map((r) => r.shopName).toSet().length;
        final totalSale = metrics?.totalReportedSale ?? filteredRecords.fold<double>(0.0, (sum, r) => sum + r.amount);

        // Subtotals & counts
        double cashTotal = metrics?.cashTotal ?? 0.0;
        double bankTotal = metrics?.bankTotal ?? 0.0;
        double creditTotal = metrics?.creditTotal ?? 0.0;
        int zeroSaleCount = metrics?.zeroSaleCount ?? 0;

        if (metrics == null) {
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
              cashTotal += r.cashAmount;
              bankTotal += r.bankAmount;
              creditTotal += r.creditAmount;
            }
          }
        }

        // Time stats
        String firstVisitTime = metrics?.firstVisitTime ?? '--:--';
        String lastVisitTime = metrics?.lastVisitTime ?? '--:--';
        String avgGapText = metrics?.avgTimeBetweenShops ?? 'N/A';

        if (metrics == null && filteredRecords.isNotEmpty) {
          firstVisitTime = DateFormat('HH:mm').format(filteredRecords.first.dateTime);
          lastVisitTime = DateFormat('HH:mm').format(filteredRecords.last.dateTime);

          if (filteredRecords.length > 1) {
            int totalDiffMinutes = 0;
            for (int i = 0; i < filteredRecords.length - 1; i++) {
              totalDiffMinutes += filteredRecords[i + 1].dateTime
                  .difference(filteredRecords[i].dateTime)
                  .inMinutes;
            }
            final avgMinutes = totalDiffMinutes ~/ (filteredRecords.length - 1);
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
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
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
                          Container(
                            decoration: BoxDecoration(
                              color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.03),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isDark ? Colors.white.withValues(alpha: 0.1) : Colors.black.withValues(alpha: 0.05),
                              ),
                            ),
                            child: IconButton(
                              onPressed: () {
                                context.read<SalesManagementAdminCubit>().loadAdminDashboard();
                                toastification.show(
                                  context: context,
                                  type: ToastificationType.success,
                                  style: ToastificationStyle.flatColored,
                                  title: const Text('Refreshing Data'),
                                  description: const Text('Admin sales dashboard updated.'),
                                  autoCloseDuration: const Duration(seconds: 2),
                                  showProgressBar: true,
                                );
                              },
                              icon: Icon(
                                LucideIcons.refreshCw,
                                size: 18,
                                color: isDark ? Colors.white : Colors.black87,
                              ),
                              tooltip: 'Refresh Page',
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

                        // Content body
                        if (state.loading)
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.all(32.0),
                              child: CircularProgressIndicator(color: AppColors.primary),
                            ),
                          )
                        else if (state.error.isNotEmpty)
                          BeautifulErrorStateWidget(
                            message: state.error,
                            onRetry: () {
                              context.read<SalesManagementAdminCubit>().loadAdminDashboard();
                            },
                          )
                        else ...[
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

                          // Tab contents
                          if (_innerTab == 0) ...[
                            if (filteredRecords.isEmpty)
                              const BeautifulEmptyStateWidget(
                                icon: LucideIcons.folderOpen,
                                title: 'No Visit Records',
                                description: 'No field visit logs have been captured for this date.',
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
                            if (state.salesmenBreakdown.isEmpty)
                              const BeautifulEmptyStateWidget(
                                icon: LucideIcons.barChart2,
                                title: 'No Performance Data',
                                description: 'No salesman performance breakdown data found.',
                              )
                            else
                              ...state.salesmenBreakdown.map((b) {
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 12.0),
                                  child: Card(
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
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                b.salesmanName.toUpperCase(),
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.w800,
                                                  fontSize: 14,
                                                  color: AppColors.primaryGlow,
                                                  letterSpacing: 0.8,
                                                ),
                                              ),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: AppColors.primary.withValues(alpha: 0.1),
                                                  borderRadius: BorderRadius.circular(8),
                                                ),
                                                child: Text(
                                                  'Productivity: ${b.productivityRate.toStringAsFixed(1)}%',
                                                  style: const TextStyle(
                                                    color: AppColors.primary,
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 14),
                                          _buildBreakdownRow(
                                            'Total Visits / Closed',
                                            '${b.totalVisits} visits / ${b.totalClosedShops} closed',
                                            Colors.green,
                                            subtextColor,
                                          ),
                                          _buildBreakdownRow(
                                            'Total Reported Sale',
                                            '${b.totalReportedSale.toStringAsFixed(2)} SAR',
                                            AppColors.primary,
                                            subtextColor,
                                          ),
                                          _buildBreakdownRow(
                                            'Average Sale Value',
                                            '${b.averageSaleValue.toStringAsFixed(2)} SAR',
                                            Colors.orange,
                                            subtextColor,
                                          ),
                                          _buildBreakdownRow(
                                            'Cash / Bank / Credit',
                                            'Cash: ${b.cashTotal.toStringAsFixed(2)} · Bank: ${b.bankTotal.toStringAsFixed(2)} · Credit: ${b.creditTotal.toStringAsFixed(2)}',
                                            textColor.withValues(alpha: 0.7),
                                            subtextColor,
                                          ),
                                          _buildBreakdownRow(
                                            'Zero Sale Count',
                                            '${b.zeroSaleCount} visits',
                                            Colors.redAccent,
                                            subtextColor,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
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
                        ]
                      ]),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    ),
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
      if (shopLocation.trim().isEmpty) return;

      String query = '';
      if (shopLocation.contains('|')) {
        // Format: "24.7136,46.6753|Address" -> extract coordinates
        final parts = shopLocation.split('|');
        final coordPart = parts[0].trim();
        query = coordPart
            .replaceAll('° N', '')
            .replaceAll('° E', '')
            .replaceAll('°N', '')
            .replaceAll('°E', '')
            .replaceAll('Lat:', '')
            .replaceAll('Lon:', '')
            .replaceAll(' ', '');
      } else {
        // Clean up standard coordinate prefixes/symbols
        final clean = shopLocation
            .replaceAll('° N', '')
            .replaceAll('° E', '')
            .replaceAll('°N', '')
            .replaceAll('°E', '')
            .replaceAll('Lat:', '')
            .replaceAll('Lon:', '')
            .trim();

        // Check if the cleaned string is coordinate-like (numbers, dots, commas, minus, plus, spaces)
        final isCoordinates = RegExp(r'^[\d\s.,\-+]+$').hasMatch(clean);
        if (isCoordinates) {
          query = clean.replaceAll(' ', '');
        } else {
          // If it's a general address name, keep the spaces and pass it to maps
          query = shopLocation.trim();
        }
      }

      if (query.isEmpty) {
        query = '24.7136,46.6753'; // Default fallback
      }

      final uri = Uri.https('www.google.com', '/maps/search/', {
        'api': '1',
        'query': query,
      });

      // Try calling launchUrl directly first since canLaunchUrl might return false
      // due to missing OS query configurations on some platforms.
      try {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } catch (e) {
        // Fallback using canLaunchUrl just in case
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        } else {
          debugPrint('Could not launch maps URL: $uri, error: $e');
        }
      }
    } catch (e) {
      debugPrint('Error launching maps: $e');
    }
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

                  // Actions: Open in Google Maps & Delete Visit Log
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
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
                      IconButton(
                        constraints: const BoxConstraints(),
                        padding: EdgeInsets.zero,
                        icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.redAccent),
                        onPressed: () => _showDeleteConfirmDialog(context, record),
                      ),
                    ],
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

  void _showDeleteConfirmDialog(BuildContext context, VisitRecord record) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Visit Log', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Text('Are you sure you want to delete the field visit log for "${record.shopName}"? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              Navigator.pop(ctx);
              context.read<SalesManagementAdminCubit>().deleteVisitRecord(record.id).then((_) {
                toastification.show(
                  context: context,
                  type: ToastificationType.success,
                  style: ToastificationStyle.flatColored,
                  title: const Text('Success'),
                  description: const Text('Field visit record deleted successfully.'),
                  autoCloseDuration: const Duration(seconds: 4),
                  showProgressBar: true,
                );
              }).catchError((e) {
                toastification.show(
                  context: context,
                  type: ToastificationType.error,
                  style: ToastificationStyle.flatColored,
                  title: const Text('Delete Failed'),
                  description: Text(e.toString().replaceFirst('Exception: ', '')),
                  autoCloseDuration: const Duration(seconds: 4),
                  showProgressBar: true,
                );
              });
            },
            child: const Text('Delete', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
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

class HorizontalCalendarStrip extends StatefulWidget {
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
  State<HorizontalCalendarStrip> createState() => _HorizontalCalendarStripState();
}

class _HorizontalCalendarStripState extends State<HorizontalCalendarStrip> {
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToCenter());
  }

  @override
  void didUpdateWidget(covariant HorizontalCalendarStrip oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!DateUtils.isSameDay(oldWidget.selectedDate, widget.selectedDate)) {
      _scrollToCenter();
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToCenter() {
    if (!_scrollController.hasClients) return;

    // Each item is 52px wide + 8px right padding = 60px total
    const itemWidth = 60.0;
    // The selected item is always at index 7 (the center of 15 generated items)
    const selectedIndex = 7;
    final itemOffset = selectedIndex * itemWidth;

    final screenWidth = MediaQuery.of(context).size.width;
    final targetScrollOffset = itemOffset - (screenWidth / 2.0) + (52.0 / 2.0);

    final maxScroll = _scrollController.position.maxScrollExtent;
    final minScroll = _scrollController.position.minScrollExtent;
    final finalOffset = targetScrollOffset.clamp(minScroll, maxScroll);

    _scrollController.animateTo(
      finalOffset,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    // Generate a 15-day range centered around selectedDate
    final List<DateTime> dates = List.generate(15, (index) {
      return widget.selectedDate.subtract(Duration(days: 7 - index));
    });

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              DateFormat('MMMM yyyy').format(widget.selectedDate).toUpperCase(),
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: widget.textColor,
                letterSpacing: 1.0,
              ),
            ),
            IconButton(
              icon: const Icon(LucideIcons.calendar, size: 20, color: AppColors.primaryGlow),
              onPressed: () async {
                final newDate = await showDatePicker(
                  context: context,
                  initialDate: widget.selectedDate,
                  firstDate: DateTime(2020),
                  lastDate: DateTime(2030),
                );
                if (newDate != null) {
                  widget.onDateSelected(newDate);
                }
              },
            ),
          ],
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 68,
          child: ListView.builder(
            controller: _scrollController,
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: dates.length,
            itemBuilder: (context, index) {
              final date = dates[index];
              final isSelected = DateUtils.isSameDay(date, widget.selectedDate);
              final dayName = DateFormat('E').format(date); // Mon, Tue...
              final dayNum = DateFormat('d').format(date); // 29, 30...

              return Padding(
                padding: const EdgeInsets.only(right: 8.0),
                child: InkWell(
                  onTap: () => widget.onDateSelected(date),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    width: 52,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primaryGlow
                          : (widget.isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? Colors.transparent : (widget.isDark ? Colors.white10 : Colors.black12),
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
                            color: isSelected ? Colors.white70 : widget.subtextColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          dayNum,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: isSelected ? Colors.white : widget.textColor,
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
