import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../blocs/wholesale/wholesale_cubit.dart';
import '../../blocs/wholesale/wholesale_state.dart';
import '../../models/wholesale_models.dart';
import '../../models/product_model.dart';
import '../../repositories/product_repository.dart';
import '../../core/theme/app_colors.dart';
import 'wholesale_transaction_dialog.dart';

class StoreAdminScreen extends StatefulWidget {
  const StoreAdminScreen({super.key});

  @override
  State<StoreAdminScreen> createState() => _StoreAdminScreenState();
}

class _StoreAdminScreenState extends State<StoreAdminScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _searchController = TextEditingController();

  final List<String> _tabLabels = [
    'Dashboard',
    'Sales',
    'Purchases',
    'Customers',
    'Payments',
    'Orders',
    'Inventory',
    'Categories',
  ];

  final List<IconData> _tabIcons = [
    LucideIcons.layoutGrid,
    LucideIcons.shoppingBag,
    LucideIcons.truck,
    LucideIcons.users,
    LucideIcons.wallet,
    LucideIcons.shoppingCart,
    LucideIcons.package,
    LucideIcons.tag,
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabLabels.length, vsync: this);
    _tabController.addListener(() {
      context.read<WholesaleCubit>().changeTab(_tabController.index);
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  // --- Utility formatting ---
  String _fmt(double val) {
    return '${val.toStringAsFixed(2)} SAR';
  }

  String _fmtDate(DateTime dt) {
    return DateFormat('yyyy-MM-dd HH:mm').format(dt);
  }

  // --- WhatsApp Redirect ---
  Future<void> _shareToWhatsApp(String mobile, String msg) async {
    final cleanMobile = mobile.replaceAll(RegExp(r'\D'), '');
    final url = Uri.parse(
      'https://wa.me/$cleanMobile?text=${Uri.encodeComponent(msg)}',
    );
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } else {
        debugPrint('Could not launch WhatsApp link.');
      }
    } catch (e) {
      debugPrint('Error launching WhatsApp: $e');
    }
  }

  Widget _buildSideMenu(WholesaleState state, bool isDark) {
    return Container(
      width: 250,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF151515) : const Color(0xFFF9F9F9),
        border: Border(
          right: BorderSide(
            color: isDark ? Colors.white10 : Colors.black12,
            width: 1,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Branding Header
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 28.0,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(LucideIcons.globe, color: AppColors.primary, size: 24),
                    const SizedBox(width: 10),
                    const Text(
                      'Saudi Wholesale',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'B2B Wholesale Portal',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.grey[500] : Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),

          // Divider
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Divider(
              color: isDark ? Colors.white10 : Colors.black12,
              height: 1,
            ),
          ),
          const SizedBox(height: 16),

          // Menu Navigation List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _tabLabels.length,
              itemBuilder: (context, idx) {
                final active = state.activeTab == idx;
                final color = active
                    ? AppColors.primary
                    : (isDark ? Colors.grey[400] : Colors.grey[700]);
                final bg = active
                    ? AppColors.primary.withAlpha(15)
                    : Colors.transparent;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 6.0),
                  child: Material(
                    color: bg,
                    borderRadius: BorderRadius.circular(12),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () {
                        context.read<WholesaleCubit>().changeTab(idx);
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16.0,
                          vertical: 12.0,
                        ),
                        child: Row(
                          children: [
                            Icon(_tabIcons[idx], size: 18, color: color),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                _tabLabels[idx],
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: active
                                      ? FontWeight.bold
                                      : FontWeight.w500,
                                  color: color,
                                ),
                              ),
                            ),
                            if (idx == 5 && state.pendingOrdersCount > 0) ...[
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 3,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.orange,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '${state.pendingOrdersCount}',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
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

  Widget _buildTopPillsMenu(WholesaleState state, bool isDark) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A) : Colors.white,
        border: Border(
          bottom: BorderSide(
            color: isDark
                ? Colors.white.withOpacity(0.06)
                : Colors.black.withOpacity(0.06),
            width: 1,
          ),
        ),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
        child: Row(
          children: List.generate(_tabLabels.length, (idx) {
            final active = state.activeTab == idx;

            final bg = active ? AppColors.primary : Colors.transparent;
            final fg = active
                ? Colors.white
                : (isDark ? Colors.grey[400] : Colors.grey[700]);

            return Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeInOut,
                child: Material(
                  color: bg,
                  borderRadius: BorderRadius.circular(10),
                  elevation: active ? 2 : 0,
                  shadowColor: active
                      ? AppColors.primary.withOpacity(0.3)
                      : Colors.transparent,
                  child: InkWell(
                    onTap: () {
                      context.read<WholesaleCubit>().changeTab(idx);
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12.0,
                        vertical: 6.0,
                      ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: active
                              ? Colors.transparent
                              : (isDark
                                    ? Colors.white.withOpacity(0.06)
                                    : Colors.black.withOpacity(0.05)),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(_tabIcons[idx], size: 13, color: fg),
                          const SizedBox(width: 6),
                          Text(
                            _tabLabels[idx],
                            style: TextStyle(
                              fontSize: 11.5,
                              fontWeight: active
                                  ? FontWeight.bold
                                  : FontWeight.w500,
                              color: fg,
                            ),
                          ),
                          if (idx == 5 && state.pendingOrdersCount > 0) ...[
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 5,
                                vertical: 2,
                              ),
                              decoration: const BoxDecoration(
                                color: Colors.orange,
                                shape: BoxShape.circle,
                              ),
                              child: Text(
                                '${state.pendingOrdersCount}',
                                style: const TextStyle(
                                  fontSize: 8,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        if (state.loading) {
          return const Center(child: CircularProgressIndicator());
        }

        // Sync tab index if state changes from outer pages
        if (_tabController.index != state.activeTab) {
          _tabController.index = state.activeTab;
        }

        return LayoutBuilder(
          builder: (context, constraints) {
            final isLarge = constraints.maxWidth >= 950;

            if (isLarge) {
              // Desktop: Left Navigation Sidebar
              return Scaffold(
                body: Row(
                  children: [
                    _buildSideMenu(state, isDark),
                    Expanded(
                      child: TabBarView(
                        controller: _tabController,
                        physics: const NeverScrollableScrollPhysics(),
                        children: [
                          _buildDashboardTab(state, isDark),
                          _buildSalesTab(state, isDark),
                          _buildPurchasesTab(state, isDark),
                          _buildCustomersTab(state, isDark),
                          _buildPaymentsTab(state, isDark),
                          _buildOrdersTab(state, isDark),
                          _buildInventoryTab(state, isDark),
                          _buildCategoriesTab(state, isDark),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            } else {
              // Mobile: Top scrolling pills navigation
              return Scaffold(
                appBar: PreferredSize(
                  preferredSize: const Size.fromHeight(64),
                  child: _buildTopPillsMenu(state, isDark),
                ),
                body: TabBarView(
                  controller: _tabController,
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    _buildDashboardTab(state, isDark),
                    _buildSalesTab(state, isDark),
                    _buildPurchasesTab(state, isDark),
                    _buildCustomersTab(state, isDark),
                    _buildPaymentsTab(state, isDark),
                    _buildOrdersTab(state, isDark),
                    _buildInventoryTab(state, isDark),
                    _buildCategoriesTab(state, isDark),
                  ],
                ),
              );
            }
          },
        );
      },
    );
  }

  // ==========================================
  // ==========================================
  // 1. DASHBOARD TAB
  // ==========================================
  Widget _buildDashboardTab(WholesaleState state, bool isDark) {
    final profit = state.profitSummary;

    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;

        // Dynamically compute columns for 6 KPI cards
        int kpiCols = 6;
        double kpiAspect = 1.4;
        if (width < 600) {
          kpiCols = 2;
          kpiAspect = 1.7;
        } else if (width < 900) {
          kpiCols = 3;
          kpiAspect = 1.6;
        } else if (width < 1200) {
          kpiCols = 3;
          kpiAspect = 1.8;
        }

        // Dynamically compute quick action columns
        int actionCols = 4;
        double actionAspect = 2.6;
        if (width < 500) {
          actionCols = 2;
          actionAspect = 2.2;
        } else if (width < 800) {
          actionCols = 2;
          actionAspect = 2.4;
        } else if (width < 1100) {
          actionCols = 3;
          actionAspect = 2.4;
        }

        // Determine if left/right sections should stack vertically
        final isStack = width < 850;

        final leftPanel = Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Profit Analytics',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 12),
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(
                  color: isDark ? Colors.white10 : Colors.black12,
                ),
              ),
              color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20.0,
                  vertical: 16.0,
                ),
                child: Column(
                  children: [
                    _buildProfitRow(
                      'Today Profit',
                      profit['dailyProfit'] ?? 0.0,
                      profit['dailyRevenue'] ?? 0.0,
                    ),
                    const Divider(height: 16),
                    _buildProfitRow(
                      'Monthly Profit',
                      profit['monthlyProfit'] ?? 0.0,
                      profit['monthlyRevenue'] ?? 0.0,
                    ),
                    const Divider(height: 16),
                    _buildProfitRow(
                      'All-Time Profit',
                      profit['allProfit'] ?? 0.0,
                      profit['allRevenue'] ?? 0.0,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Quick Action Panel',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: actionCols,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: actionAspect,
              children: [
                _buildQuickActionTile(
                  icon: LucideIcons.plusCircle,
                  title: 'New Sale',
                  subtitle: 'Draft a checkout',
                  color: Colors.green,
                  isDark: isDark,
                  onTap: () => _showTransactionDialog('sale'),
                ),
                _buildQuickActionTile(
                  icon: LucideIcons.minusCircle,
                  title: 'Log Purchase',
                  subtitle: 'Receive inventory',
                  color: Colors.blue,
                  isDark: isDark,
                  onTap: () => _showTransactionDialog('purchase'),
                ),
                _buildQuickActionTile(
                  icon: LucideIcons.wallet,
                  title: 'Payment In',
                  subtitle: 'Record receipt',
                  color: Colors.teal,
                  isDark: isDark,
                  onTap: () => _showPaymentInDialog(),
                ),
                _buildQuickActionTile(
                  icon: LucideIcons.userPlus,
                  title: 'Add Client',
                  subtitle: 'Register customer',
                  color: Colors.purple,
                  isDark: isDark,
                  onTap: () => _showAddCustomerDialog(),
                ),
              ],
            ),
          ],
        );

        final rightPanel = Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recent Entries',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 12),
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(
                  color: isDark ? Colors.white10 : Colors.black12,
                ),
              ),
              color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child:
                    state.sales.isEmpty &&
                        state.purchases.isEmpty &&
                        state.payments.isEmpty
                    ? const SizedBox(
                        height: 200,
                        child: Center(
                          child: Text(
                            'No recent entries found.',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ),
                      )
                    : Column(
                        children: [
                          ...state.sales
                              .take(3)
                              .map(
                                (s) => _buildRecentEntryRow(
                                  icon: LucideIcons.shoppingBag,
                                  title: s.customerName,
                                  subtitle: 'Invoice #${s.invoiceNumber}',
                                  amount: s.total,
                                  isPositive: true,
                                  color: Colors.green,
                                  date: s.createdAt,
                                ),
                              ),
                          ...state.purchases
                              .take(2)
                              .map(
                                (p) => _buildRecentEntryRow(
                                  icon: LucideIcons.truck,
                                  title: p.supplierName,
                                  subtitle: 'Invoice ${p.invoiceNumber}',
                                  amount: p.total,
                                  isPositive: false,
                                  color: Colors.blue,
                                  date: p.createdAt,
                                ),
                              ),
                          ...state.payments.take(3).map((pay) {
                            final customerName =
                                state.customers
                                    .cast<WholesaleCustomerModel?>()
                                    .firstWhere(
                                      (c) =>
                                          c != null && c.id == pay.customerId,
                                      orElse: () => null,
                                    )
                                    ?.name ??
                                'Customer';
                            return _buildRecentEntryRow(
                              icon: LucideIcons.coins,
                              title: customerName,
                              subtitle: pay.notes ?? 'Payment received',
                              amount: pay.amount,
                              isPositive: pay.kind == 'payment_in',
                              color: Colors.teal,
                              date: pay.createdAt,
                            );
                          }),
                        ],
                      ),
              ),
            ),
          ],
        );

        return SingleChildScrollView(
          // padding: const EdgeInsets.all(24.0),
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // KPI Cards Grid
              GridView.count(
                crossAxisCount: kpiCols,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 5,
                mainAxisSpacing: 5,
                childAspectRatio: kpiAspect,
                children: [
                  _buildKpiCard(
                    icon: LucideIcons.globe,
                    label: "Wholesale Value",
                    value: _fmt(state.stockValuation + state.totalCustomerDue),
                    color: Colors.indigo,
                    onInfo: () => _showMetricInfoDialog('warehouse', state),
                  ),
                  _buildKpiCard(
                    icon: LucideIcons.package,
                    label: 'Current Stock',
                    value: _fmt(state.stockValuation),
                    color: Colors.teal,
                    onInfo: () => _showMetricInfoDialog('stock', state),
                  ),
                  _buildKpiCard(
                    icon: LucideIcons.wallet,
                    label: 'Receivable',
                    value: _fmt(state.totalCustomerDue),
                    color: Colors.red,
                    onInfo: () => _showMetricInfoDialog('receivable', state),
                  ),
                  _buildKpiCard(
                    icon: LucideIcons.coins,
                    label: 'Converted Cash',
                    value: _fmt(
                      100000.0 -
                          (state.stockValuation + state.totalCustomerDue),
                    ),
                    color: Colors.blue,
                    onInfo: () => _showMetricInfoDialog('converted', state),
                  ),
                  _buildKpiCard(
                    icon: LucideIcons.shoppingBag,
                    label: "Today's Sales",
                    value: _fmt(state.todaySales),
                    color: Colors.green,
                  ),
                  _buildKpiCard(
                    icon: LucideIcons.shoppingCart,
                    label: 'Pending Orders',
                    value: '${state.pendingOrdersCount} orders',
                    color: Colors.orange,
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Layout switcher (Row vs Column)
              if (isStack) ...[
                leftPanel,
                const SizedBox(height: 28),
                rightPanel,
              ] else ...[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(flex: 3, child: leftPanel),
                    const SizedBox(width: 24),
                    Expanded(flex: 2, child: rightPanel),
                  ],
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  void _showMetricInfoDialog(String metric, WholesaleState state) {
    final currentStock = state.stockValuation;
    final openingDue = state.customers.fold(
      0.0,
      (sum, c) => sum + c.openingDue,
    );
    final salesDue = state.sales
        .where((s) => s.status != 'cancelled')
        .fold(0.0, (sum, s) => sum + s.dueAmount);
    final paidIn = state.payments
        .where((p) => p.kind == 'payment_in')
        .fold(0.0, (sum, p) => sum + p.amount);
    final receivable = (openingDue + salesDue - paidIn).clamp(
      0.0,
      double.infinity,
    );
    final wholesaleValue = currentStock + receivable;
    const openingBalance = 100000.0;
    final convertedToCash = openingBalance - wholesaleValue;

    String title = '';
    Widget body = const SizedBox();

    if (metric == 'warehouse') {
      title = 'Wholesale value';
      body = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFormulaLine('Wholesale Value = Current Stock + Receivable'),
          const SizedBox(height: 12),
          _buildDetailRow('Current Stock', _fmt(currentStock)),
          _buildDetailRow('Receivable', _fmt(receivable)),
          const Divider(),
          _buildDetailRow(
            'Total Wholesale Value',
            _fmt(wholesaleValue),
            isBold: true,
            color: AppColors.primary,
          ),
        ],
      );
    } else if (metric == 'stock') {
      title = 'Current stock';
      body = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFormulaLine('Current Stock = Σ(product.stock × purchase_cost)'),
          const SizedBox(height: 12),
          _buildDetailRow(
            'Total stock value',
            _fmt(currentStock),
            isBold: true,
          ),
        ],
      );
    } else if (metric == 'receivable') {
      title = 'Receivable';
      body = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFormulaLine(
            'Receivable = Opening Due + Sales Due − Payments In',
          ),
          const SizedBox(height: 12),
          _buildDetailRow('Opening due', _fmt(openingDue)),
          _buildDetailRow('Sales due', _fmt(salesDue)),
          _buildDetailRow('Payments in', '− ${_fmt(paidIn)}'),
          const Divider(),
          _buildDetailRow(
            'Total receivable',
            _fmt(receivable),
            isBold: true,
            color: Colors.red,
          ),
        ],
      );
    } else if (metric == 'converted') {
      title = 'Converted to cash';
      body = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFormulaLine(
            'Converted To Cash = Opening Balance − Wholesale Value',
          ),
          const SizedBox(height: 12),
          _buildDetailRow('Opening balance', _fmt(openingBalance)),
          _buildDetailRow('Wholesale value', '− ${_fmt(wholesaleValue)}'),
          const Divider(),
          _buildDetailRow(
            'Converted',
            _fmt(convertedToCash),
            isBold: true,
            color: convertedToCash >= 0 ? Colors.green : Colors.red,
          ),
        ],
      );
    }

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            title,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          content: body,
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

  Widget _buildFormulaLine(String text) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: AppColors.primary,
        ),
      ),
    );
  }

  Widget _buildDetailRow(
    String label,
    String value, {
    bool isBold = false,
    Color? color,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              fontSize: 13,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
              color: color,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpiCard({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
    VoidCallback? onInfo,
  }) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: color.withOpacity(0.12)),
      ),
      color: color.withOpacity(0.04),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: color.withOpacity(0.1),
              child: Icon(icon, color: color, size: 16),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10,
                            color: Colors.grey,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      if (onInfo != null)
                        InkWell(
                          onTap: onInfo,
                          borderRadius: BorderRadius.circular(8),
                          child: Padding(
                            padding: const EdgeInsets.all(2.0),
                            child: Icon(
                              LucideIcons.info,
                              size: 11,
                              color: color.withOpacity(0.6),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerLeft,
                    child: Text(
                      value,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: color,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfitRow(String label, double profit, double revenue) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                _fmt(profit),
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: profit >= 0 ? Colors.green : Colors.red,
                  fontSize: 14,
                ),
              ),
              Text(
                'Rev: ${_fmt(revenue)}',
                style: const TextStyle(fontSize: 10, color: Colors.grey),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
        border: Border.all(
          color: isDark
              ? Colors.white.withOpacity(0.08)
              : Colors.black.withOpacity(0.06),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            offset: const Offset(0, 2),
            blurRadius: 6,
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 10.0,
              vertical: 8.0,
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: color, size: 18),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          letterSpacing: -0.2,
                        ),
                      ),
                      const SizedBox(height: 1),
                      Text(
                        subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 9, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                Icon(
                  LucideIcons.chevronRight,
                  size: 12,
                  color: isDark ? Colors.white30 : Colors.black26,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRecentEntryRow({
    required IconData icon,
    required String title,
    required String subtitle,
    required double amount,
    required bool isPositive,
    required Color color,
    required DateTime date,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: color.withOpacity(0.08),
            child: Icon(icon, color: color, size: 14),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '$subtitle • ${DateFormat('MM-dd HH:mm').format(date)}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Colors.grey, fontSize: 10),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '${isPositive ? '+' : '-'} ${_fmt(amount)}',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: isPositive ? Colors.green : Colors.red,
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 2. SALES TAB
  // ==========================================
  Widget _buildSalesTab(WholesaleState state, bool isDark) {
    if (state.sales.isEmpty) {
      return const Center(child: Text('No wholesale sales logged yet.'));
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      itemCount: state.sales.length,
      separatorBuilder: (_, __) => const SizedBox(height: 02),
      itemBuilder: (context, index) {
        final sale = state.sales[index];
        final isCancelled = sale.status == 'cancelled';

        return Card(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.withOpacity(0.2)),
          ),
          child: ExpansionTile(
            title: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        sale.customerName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                          decoration: isCancelled
                              ? TextDecoration.lineThrough
                              : null,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Invoice #${sale.invoiceNumber} • ${_fmtDate(sale.createdAt)}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  _fmt(sale.total),
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: isCancelled ? Colors.grey : AppColors.primary,
                  ),
                ),
              ],
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: isCancelled
                          ? Colors.grey.withOpacity(0.2)
                          : (sale.dueAmount > 0
                                ? Colors.red.withOpacity(0.1)
                                : Colors.green.withOpacity(0.1)),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      isCancelled
                          ? 'CANCELLED'
                          : (sale.dueAmount > 0
                                ? 'DUE: ${_fmt(sale.dueAmount)}'
                                : 'PAID'),
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isCancelled
                            ? Colors.grey[700]
                            : (sale.dueAmount > 0 ? Colors.red : Colors.green),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Method: ${sale.paymentMethod.toUpperCase()}',
                    style: const TextStyle(
                      fontSize: 11,
                      color: Colors.blueGrey,
                    ),
                  ),
                ],
              ),
            ),
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Line Items',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...sale.items.map(
                      (it) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                '${it.name} (x${it.qty.toInt()})',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(_fmt(it.qty * it.price)),
                          ],
                        ),
                      ),
                    ),
                    const Divider(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Discount:',
                          style: TextStyle(color: Colors.grey),
                        ),
                        Text(_fmt(sale.discount)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Net Total:',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          _fmt(sale.total - sale.discount),
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        if (!isCancelled) ...[
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 8,
                              ),
                            ),
                            icon: const Icon(LucideIcons.xCircle, size: 14),
                            label: const Text(
                              'Void Invoice',
                              style: TextStyle(fontSize: 12),
                            ),
                            onPressed: () {
                              context.read<WholesaleCubit>().cancelSale(
                                sale.id,
                              );
                            },
                          ),
                          const SizedBox(width: 8),
                        ],
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 8,
                            ),
                          ),
                          icon: const Icon(LucideIcons.messageCircle, size: 14),
                          label: const Text(
                            'Share',
                            style: TextStyle(fontSize: 12),
                          ),
                          onPressed: () {
                            final msg =
                                'Dear Customer, here is your invoice #${sale.invoiceNumber} details:\n'
                                'Items: ${sale.items.map((it) => '${it.name} x${it.qty}').join(', ')}\n'
                                'Total: ${sale.total} SAR\n'
                                'Remaining Due: ${sale.dueAmount} SAR\n'
                                'Thank you for shopping with Azzouz Wholesale!';
                            _shareToWhatsApp(sale.customerMobile, msg);
                          },
                        ),
                      ],
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

  // ==========================================
  // 3. PURCHASES TAB
  // ==========================================
  Widget _buildPurchasesTab(WholesaleState state, bool isDark) {
    if (state.purchases.isEmpty) {
      return const Center(
        child: Text('No inventory supplier purchases logged.'),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      itemCount: state.purchases.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final purchase = state.purchases[index];

        return Card(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.withOpacity(0.2)),
          ),
          child: ExpansionTile(
            title: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        purchase.supplierName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Purchase Code: ${purchase.invoiceNumber} • ${_fmtDate(purchase.createdAt)}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  _fmt(purchase.total),
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
              ],
            ),
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Received Items',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...purchase.items.map(
                      (it) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                '${it.name} (x${it.qty.toInt()})',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(_fmt(it.qty * it.price)),
                          ],
                        ),
                      ),
                    ),
                    const Divider(height: 24),
                    if (purchase.notes != null) ...[
                      Text(
                        'Notes: ${purchase.notes}',
                        style: const TextStyle(
                          fontStyle: FontStyle.italic,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                    ],
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ==========================================
  // 4. CUSTOMERS TAB
  // ==========================================
  Widget _buildCustomersTab(WholesaleState state, bool isDark) {
    if (state.customers.isEmpty) {
      return const Center(child: Text('No customer registry profiles found.'));
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final isMobile = constraints.maxWidth < 650;

        return ListView.separated(
          padding: const EdgeInsets.all(10),
          itemCount: state.customers.length,
          separatorBuilder: (_, __) => const SizedBox(height: 02),
          itemBuilder: (context, index) {
            final customer = state.customers[index];
            final dueBalance = state.getCustomerDue(customer.id);

            if (isMobile) {
              return Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: Colors.grey.withOpacity(0.2)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            backgroundColor: AppColors.primary.withOpacity(0.1),
                            child: const Icon(
                              LucideIcons.user,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  customer.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  customer.mobile,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Opening Due: ${_fmt(customer.openingDue)}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            _fmt(dueBalance),
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                              color: dueBalance > 0 ? Colors.red : Colors.green,
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton.icon(
                            icon: const Icon(LucideIcons.fileText, size: 16),
                            label: const Text(
                              'Statement',
                              style: TextStyle(fontSize: 12),
                            ),
                            onPressed: () =>
                                _showCustomerStatementDialog(customer, state),
                          ),
                          const SizedBox(width: 8),
                          TextButton.icon(
                            icon: const Icon(
                              LucideIcons.messageCircle,
                              size: 16,
                              color: Colors.green,
                            ),
                            label: const Text(
                              'WhatsApp',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.green,
                              ),
                            ),
                            onPressed: () {
                              final msg =
                                  'Dear ${customer.name}, your total outstanding wholesale balance is ${_fmt(dueBalance)}.\n'
                                  'Please arrange for settlement at your earliest convenience.\n'
                                  'Thank you, Azzouz Wholesale team!';
                              _shareToWhatsApp(customer.mobile, msg);
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            } else {
              return Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: Colors.grey.withOpacity(0.2)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: AppColors.primary.withOpacity(0.1),
                        child: const Icon(
                          LucideIcons.user,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              customer.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Mobile: ${customer.mobile} • Opening Due: ${_fmt(customer.openingDue)}',
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text(
                            'Total Due Balance',
                            style: TextStyle(fontSize: 11, color: Colors.grey),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _fmt(dueBalance),
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: dueBalance > 0 ? Colors.red : Colors.green,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 16),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(
                              LucideIcons.fileText,
                              color: Colors.blueGrey,
                              size: 20,
                            ),
                            tooltip: 'View Statement Ledger',
                            onPressed: () =>
                                _showCustomerStatementDialog(customer, state),
                          ),
                          IconButton(
                            icon: const Icon(
                              LucideIcons.messageCircle,
                              color: Colors.green,
                              size: 20,
                            ),
                            tooltip: 'Share Balance on WhatsApp',
                            onPressed: () {
                              final msg =
                                  'Dear ${customer.name}, your total outstanding wholesale balance is ${_fmt(dueBalance)}.\n'
                                  'Please arrange for settlement at your earliest convenience.\n'
                                  'Thank you, Azzouz Wholesale team!';
                              _shareToWhatsApp(customer.mobile, msg);
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }
          },
        );
      },
    );
  }

  void _showCustomerStatementDialog(
    WholesaleCustomerModel customer,
    WholesaleState state,
  ) {
    final lines = <Map<String, dynamic>>[];

    // Add Sales
    final customerSales = state.sales.where(
      (s) => s.customerId == customer.id && s.status != 'cancelled',
    );
    for (final sale in customerSales) {
      lines.add({
        'date': sale.createdAt,
        'type': 'sale',
        'ref': 'Invoice #${sale.invoiceNumber}',
        'debit': sale.dueAmount,
        'credit': 0.0,
      });
    }

    // Add Payments
    final customerPayments = state.payments.where(
      (p) => p.customerId == customer.id && p.kind == 'payment_in',
    );
    for (final pay in customerPayments) {
      lines.add({
        'date': pay.createdAt,
        'type': 'payment',
        'ref': pay.notes ?? 'Payment received',
        'debit': 0.0,
        'credit': pay.amount,
      });
    }

    lines.sort(
      (a, b) => (a['date'] as DateTime).compareTo(b['date'] as DateTime),
    );

    double runningBalance = customer.openingDue;

    showDialog(
      context: context,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.teal.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(LucideIcons.fileText, color: Colors.teal, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      customer.name,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Text(
                      'Customer Ledger Statement',
                      style: TextStyle(fontSize: 11, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ],
          ),
          content: SizedBox(
            width: 700,
            height: 520,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white.withOpacity(0.03) : Colors.black.withOpacity(0.02),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isDark ? Colors.white10 : Colors.black12,
                      width: 0.5,
                    ),
                  ),
                  child: Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    alignment: WrapAlignment.spaceBetween,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Opening Balance: ${_fmt(customer.openingDue)}',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Outstanding Due: ${_fmt(state.getCustomerDue(customer.id))}',
                            style: TextStyle(
                              fontSize: 12, 
                              fontWeight: FontWeight.bold,
                              color: state.getCustomerDue(customer.id) > 0 ? Colors.red : Colors.green,
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        icon: const Icon(LucideIcons.messageCircle, size: 14, color: Colors.white),
                        label: const Text(
                          'Share Ledger', 
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)
                        ),
                        onPressed: () {
                          String statementText =
                              'Ledger Statement for ${customer.name}\n'
                              'Starting Balance: ${_fmt(customer.openingDue)}\n\n';

                          double run = customer.openingDue;
                          for (final row in lines) {
                            run +=
                                (row['debit'] as double) -
                                (row['credit'] as double);
                            final dateStr = DateFormat(
                              'yyyy-MM-dd',
                            ).format(row['date'] as DateTime);
                            statementText +=
                                '$dateStr | ${row['ref']} | Debit: ${row['debit']} | Credit: ${row['credit']} | Bal: ${_fmt(run)}\n';
                          }

                          statementText += '\nFinal Balance Due: ${_fmt(run)}';
                          _shareToWhatsApp(customer.mobile, statementText);
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: isDark ? Colors.white10 : Colors.black12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: SingleChildScrollView(
                      scrollDirection: Axis.vertical,
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: SizedBox(
                          width: 650,
                          child: Table(
                            border: TableBorder.symmetric(
                              inside: BorderSide(
                                color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.06),
                                width: 0.5,
                              ),
                            ),
                            columnWidths: const {
                              0: FlexColumnWidth(2.2),
                              1: FlexColumnWidth(3),
                              2: FlexColumnWidth(1.4),
                              3: FlexColumnWidth(1.4),
                              4: FlexColumnWidth(1.6),
                            },
                            children: [
                              TableRow(
                                decoration: BoxDecoration(
                                  color: isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.04),
                                ),
                                children: const [
                                  Padding(
                                    padding: EdgeInsets.all(10.0),
                                    child: Text(
                                      'Date',
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.all(10.0),
                                    child: Text(
                                      'Reference',
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.all(10.0),
                                    child: Text(
                                      'Debit (+)',
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.redAccent),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.all(10.0),
                                    child: Text(
                                      'Credit (-)',
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.green),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.all(10.0),
                                    child: Text(
                                      'Due Bal',
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
                                    ),
                                  ),
                                ],
                              ),
                              ...lines.map((row) {
                                runningBalance +=
                                    (row['debit'] as double) -
                                    (row['credit'] as double);
                                final isSale = row['type'] == 'sale';

                                return TableRow(
                                  decoration: BoxDecoration(
                                    color: isSale
                                        ? Colors.transparent
                                        : (isDark ? Colors.teal.withOpacity(0.02) : Colors.teal.withOpacity(0.015)),
                                  ),
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                      child: Text(
                                        DateFormat('yyyy-MM-dd HH:mm').format(row['date'] as DateTime),
                                        style: const TextStyle(fontSize: 11),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                      child: Text(
                                        row['ref'] as String,
                                        style: const TextStyle(fontSize: 11),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                      child: Text(
                                        row['debit'] > 0 ? _fmt(row['debit'] as double) : '-',
                                        style: const TextStyle(fontSize: 11, color: Colors.redAccent),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                      child: Text(
                                        row['credit'] > 0 ? _fmt(row['credit'] as double) : '-',
                                        style: const TextStyle(fontSize: 11, color: Colors.green),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                                      child: Text(
                                        _fmt(runningBalance),
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ),
                                  ],
                                );
                              }),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close', style: TextStyle(color: Colors.grey)),
            ),
          ],
        );
      },
    );
  }

  // ==========================================
  // 5. PAYMENTS TAB
  // ==========================================
  Widget _buildPaymentsTab(WholesaleState state, bool isDark) {
    if (state.payments.isEmpty) {
      return const Center(child: Text('No payment ledgers recorded.'));
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      itemCount: state.payments.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final payment = state.payments[index];
        final customerName =
            state.customers
                .cast<WholesaleCustomerModel?>()
                .firstWhere(
                  (c) => c != null && c.id == payment.customerId,
                  orElse: () => null,
                )
                ?.name ??
            'Walk-in Customer';

        return Card(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.withOpacity(0.2)),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.teal.withOpacity(0.1),
                  child: const Icon(LucideIcons.coins, color: Colors.teal),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        customerName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${payment.notes ?? 'Payment received'} • ${_fmtDate(payment.createdAt)}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Text(
                  '+ ${_fmt(payment.amount)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ==========================================
  // 6. ORDERS TAB (Convert order to sale)
  // ==========================================
  Widget _buildOrdersTab(WholesaleState state, bool isDark) {
    if (state.orders.isEmpty) {
      return const Center(child: Text('No storefront web orders filed.'));
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      itemCount: state.orders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final order = state.orders[index];
        final isPending = order.status == 'pending';

        return Card(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.withOpacity(0.2)),
          ),
          child: ExpansionTile(
            title: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        order.customerName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Order #${order.orderNumber} • ${_fmtDate(order.createdAt)}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  _fmt(order.total),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: isPending
                          ? Colors.orange.withOpacity(0.1)
                          : Colors.green.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      order.status.toUpperCase(),
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isPending ? Colors.orange : Colors.green,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Address: ${order.customerAddress ?? 'N/A'}'),
                    const SizedBox(height: 4),
                    if (order.notes != null) ...[
                      Text(
                        'Notes: ${order.notes}',
                        style: const TextStyle(
                          fontStyle: FontStyle.italic,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 12),
                    ],
                    const Text(
                      'Cart Items',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...order.items.map(
                      (it) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                '${it.name} (x${it.qty.toInt()})',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(_fmt(it.qty * it.price)),
                          ],
                        ),
                      ),
                    ),
                    const Divider(height: 24),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      alignment: WrapAlignment.end,
                      children: [
                        if (isPending) ...[
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                            ),
                            icon: const Icon(LucideIcons.xCircle, size: 14),
                            label: const Text('Cancel Order'),
                            onPressed: () {
                              context.read<WholesaleCubit>().cancelOrder(
                                order.id,
                              );
                            },
                          ),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                            ),
                            icon: const Icon(LucideIcons.refreshCw, size: 14),
                            label: const Text('Convert to Sale'),
                            onPressed: () {
                              _showTransactionDialog(
                                'sale',
                                initialOrder: order,
                              );
                            },
                          ),
                        ],
                      ],
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

  // ==========================================
  // 7. INVENTORY CATALOG TAB
  // ==========================================
  Widget _buildInventoryTab(WholesaleState state, bool isDark) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isMobile = constraints.maxWidth < 650;

        final header = isMobile
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Warehouse Stock Catalog',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      ElevatedButton.icon(
                        onPressed: _showPrintPriceList,
                        icon: const Icon(LucideIcons.printer, size: 14),
                        label: const Text(
                          'Print Catalog',
                          style: TextStyle(fontSize: 12),
                        ),
                      ),
                      ElevatedButton.icon(
                        onPressed: _showAddProductDialog,
                        icon: const Icon(LucideIcons.plus, size: 14),
                        label: const Text(
                          'Add Product',
                          style: TextStyle(fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ],
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Warehouse Stock Catalog',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  Row(
                    children: [
                      ElevatedButton.icon(
                        onPressed: _showPrintPriceList,
                        icon: const Icon(LucideIcons.printer, size: 16),
                        label: const Text('Print Catalog'),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        onPressed: _showAddProductDialog,
                        icon: const Icon(LucideIcons.plus, size: 16),
                        label: const Text('Add Product'),
                      ),
                    ],
                  ),
                ],
              );

        return Padding(
          padding: const EdgeInsets.all(10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              header,
              const SizedBox(height: 20),
              Expanded(
                child: ListView.separated(
                  itemCount: state.products.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 02),
                  itemBuilder: (context, index) {
                    final product = state.products[index];
                    final isLow = product.stock <= product.minStock;

                    if (isMobile) {
                      return Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: Colors.grey.withOpacity(0.2)),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  CircleAvatar(
                                    radius: 20,
                                    backgroundColor:
                                        (isLow
                                                ? Colors.orange
                                                : AppColors.primary)
                                            .withOpacity(0.1),
                                    child: Icon(
                                      LucideIcons.package,
                                      color: isLow
                                          ? Colors.orange
                                          : AppColors.primary,
                                      size: 18,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      product.name,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 15,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'SKU: ${product.itemCode ?? 'N/A'}  •  Barcode: ${product.barcode ?? 'N/A'}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Colors.grey,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Price: ${product.price.toStringAsFixed(2)} SAR  •  Cost: ${product.purchasePrice.toStringAsFixed(2)} SAR',
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const Divider(height: 20),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      if (isLow) ...[
                                        const Icon(
                                          LucideIcons.alertTriangle,
                                          color: Colors.orange,
                                          size: 14,
                                        ),
                                        const SizedBox(width: 4),
                                      ],
                                      Text(
                                        'Stock: ${product.stock}',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 14,
                                          color: isLow
                                              ? Colors.orange
                                              : Colors.green,
                                        ),
                                      ),
                                    ],
                                  ),
                                  OutlinedButton.icon(
                                    style: OutlinedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 6,
                                      ),
                                      minimumSize: Size.zero,
                                    ),
                                    onPressed: () =>
                                        _showAdjustStockDialog(product),
                                    icon: const Icon(
                                      LucideIcons.pencil,
                                      size: 12,
                                    ),
                                    label: const Text(
                                      'Adjust',
                                      style: TextStyle(fontSize: 11),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    } else {
                      return Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: Colors.grey.withOpacity(0.2)),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 24,
                                backgroundColor:
                                    (isLow ? Colors.orange : AppColors.primary)
                                        .withOpacity(0.1),
                                child: Icon(
                                  LucideIcons.package,
                                  color: isLow
                                      ? Colors.orange
                                      : AppColors.primary,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      product.name,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'SKU: ${product.itemCode ?? 'N/A'}  •  Barcode: ${product.barcode ?? 'N/A'}',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Price: ${product.price.toStringAsFixed(2)} SAR  •  Cost: ${product.purchasePrice.toStringAsFixed(2)} SAR',
                                      style: const TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Row(
                                    children: [
                                      if (isLow) ...[
                                        const Icon(
                                          LucideIcons.alertTriangle,
                                          color: Colors.orange,
                                          size: 14,
                                        ),
                                        const SizedBox(width: 4),
                                      ],
                                      Text(
                                        'Stock: ${product.stock}',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15,
                                          color: isLow
                                              ? Colors.orange
                                              : Colors.green,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  OutlinedButton.icon(
                                    style: OutlinedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 6,
                                      ),
                                      minimumSize: Size.zero,
                                    ),
                                    onPressed: () =>
                                        _showAdjustStockDialog(product),
                                    icon: const Icon(
                                      LucideIcons.pencil,
                                      size: 12,
                                    ),
                                    label: const Text(
                                      'Adjust',
                                      style: TextStyle(fontSize: 12),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    }
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ==========================================
  // 8. CATEGORIES TAB
  // ==========================================
  Widget _buildCategoriesTab(WholesaleState state, bool isDark) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Product Categories',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              ElevatedButton.icon(
                onPressed: _showAddCategoryDialog,
                icon: const Icon(LucideIcons.plus, size: 16),
                label: const Text('Add Category'),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Expanded(
            child: state.categories.isEmpty
                ? const Center(child: Text('No categories added yet.'))
                : ListView.separated(
                    itemCount: state.categories.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final cat = state.categories[index];
                      return Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: Colors.grey.withOpacity(0.2)),
                        ),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: Colors.teal.withOpacity(0.1),
                            child: const Icon(
                              LucideIcons.tag,
                              color: Colors.teal,
                            ),
                          ),
                          title: Text(
                            cat.name,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            'AR: ${cat.nameAr ?? 'N/A'} • BN: ${cat.nameBn ?? 'N/A'}',
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              'Sort Index: ${cat.sortOrder}',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Colors.black54,
                              ),
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

  // ==========================================
  // TRANSACTION DIALOG SHOWERS
  // ==========================================
  void _showTransactionDialog(
    String kind, {
    WholesaleOrderModel? initialOrder,
  }) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return WholesaleTransactionDialog(
          kind: kind,
          initialOrder: initialOrder,
        );
      },
    );
  }

  void _showAddCustomerDialog() {
    final nameController = TextEditingController();
    final mobileController = TextEditingController();
    final dueController = TextEditingController(text: '0.0');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Icon(LucideIcons.userPlus, color: AppColors.primary, size: 20),
              const SizedBox(width: 10),
              const Text(
                'Add Customer Profile',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Customer Name',
                    prefixIcon: Icon(LucideIcons.user, size: 16),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: mobileController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Mobile Number',
                    prefixIcon: Icon(LucideIcons.phone, size: 16),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: dueController,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'Opening Balance Due (SAR)',
                    prefixIcon: Icon(LucideIcons.wallet, size: 16),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
              ),
              onPressed: () {
                final name = nameController.text.trim();
                final mobile = mobileController.text.trim();
                final due = double.tryParse(dueController.text) ?? 0.0;
                if (name.isNotEmpty && mobile.isNotEmpty) {
                  context.read<WholesaleCubit>().createCustomer(
                    name: name,
                    mobile: mobile,
                    openingDue: due,
                  );
                  Navigator.pop(context);
                }
              },
              child: const Text('Save Profile'),
            ),
          ],
        );
      },
    );
  }

  void _showPaymentInDialog() {
    final state = context.read<WholesaleCubit>().state;
    String? selCustomerId;
    final amountController = TextEditingController();
    final notesController = TextEditingController(
      text: 'Settle account receivables',
    );

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              title: Row(
                children: [
                  Icon(LucideIcons.wallet, color: Colors.teal, size: 20),
                  const SizedBox(width: 10),
                  const Text(
                    'Record Customer Payment',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DropdownButtonFormField<String>(
                      value: selCustomerId,
                      decoration: const InputDecoration(
                        labelText: 'Select Wholesale Customer',
                        prefixIcon: Icon(LucideIcons.user, size: 16),
                      ),
                      items: state.customers
                          .map(
                            (c) => DropdownMenuItem(
                              value: c.id,
                              child: Text(
                                c.name,
                                style: const TextStyle(fontSize: 13),
                              ),
                            ),
                          )
                          .toList(),
                      onChanged: (val) {
                        setDialogState(() {
                          selCustomerId = val;
                        });
                      },
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: amountController,
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                      ),
                      decoration: const InputDecoration(
                        labelText: 'Amount Received (SAR)',
                        prefixIcon: Icon(LucideIcons.coins, size: 16),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: notesController,
                      decoration: const InputDecoration(
                        labelText: 'Notes / Slip Number',
                        prefixIcon: Icon(LucideIcons.fileText, size: 16),
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.teal),
                  onPressed: () {
                    final amount =
                        double.tryParse(amountController.text) ?? 0.0;
                    if (selCustomerId != null && amount > 0) {
                      context.read<WholesaleCubit>().recordPayment(
                        customerId: selCustomerId!,
                        amount: amount,
                        kind: 'payment_in',
                        notes: notesController.text,
                      );
                      Navigator.pop(context);
                    }
                  },
                  child: const Text('Log Payment'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showAddCategoryDialog() {
    final nameController = TextEditingController();
    final arController = TextEditingController();
    final bnController = TextEditingController();
    final sortController = TextEditingController(text: '0');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Icon(LucideIcons.folderPlus, color: AppColors.primary, size: 20),
              const SizedBox(width: 10),
              const Text(
                'Add Product Category',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Category Name (EN)',
                    prefixIcon: Icon(LucideIcons.folder, size: 16),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: arController,
                  decoration: const InputDecoration(
                    labelText: 'Arabic Name (AR)',
                    prefixIcon: Icon(LucideIcons.languages, size: 16),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: bnController,
                  decoration: const InputDecoration(
                    labelText: 'Bangla Name (BN)',
                    prefixIcon: Icon(LucideIcons.languages, size: 16),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: sortController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Sort Order Index',
                    prefixIcon: Icon(LucideIcons.sliders, size: 16),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
              ),
              onPressed: () {
                final name = nameController.text.trim();
                final ar = arController.text.trim();
                final bn = bnController.text.trim();
                final sort = int.tryParse(sortController.text) ?? 0;
                if (name.isNotEmpty) {
                  context.read<WholesaleCubit>().createCategory(
                    name: name,
                    nameAr: ar.isEmpty ? null : ar,
                    nameBn: bn.isEmpty ? null : bn,
                    sortOrder: sort,
                  );
                  Navigator.pop(context);
                }
              },
              child: const Text('Save Category'),
            ),
          ],
        );
      },
    );
  }

  void _showAdjustStockDialog(ProductModel product) {
    final controller = TextEditingController(text: product.stock.toString());
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Icon(LucideIcons.edit2, color: Colors.orange, size: 20),
              const SizedBox(width: 10),
              const Text(
                'Adjust Stock Level',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Product: ${product.name}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: controller,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'New Stock Level',
                    prefixIcon: Icon(LucideIcons.package, size: 16),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
              onPressed: () async {
                final double? newStock = double.tryParse(controller.text);
                if (newStock != null) {
                  final diff = newStock - product.stock;
                  await context.read<WholesaleCubit>().adjustStock(
                    product.id,
                    diff,
                  );
                  Navigator.pop(context);
                }
              },
              child: const Text('Save Stock'),
            ),
          ],
        );
      },
    );
  }

  void _showAddProductDialog() {
    final formKey = GlobalKey<FormState>();
    final nameController = TextEditingController();
    final skuController = TextEditingController();
    final barcodeController = TextEditingController();
    final priceController = TextEditingController();
    final costController = TextEditingController();
    final stockController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: const Text('Add Product to Catalog'),
          content: Form(
            key: formKey,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Product Title',
                    style: TextStyle(fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: nameController,
                    decoration: const InputDecoration(
                      hintText: 'e.g. Saudi Fresh Yogurt',
                    ),
                    validator: (val) => (val == null || val.trim().isEmpty)
                        ? 'Enter title'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'SKU / Code',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: skuController,
                              decoration: const InputDecoration(
                                hintText: 'e.g. YOG-200',
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Barcode',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: barcodeController,
                              decoration: const InputDecoration(
                                hintText: 'e.g. 628100123',
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Price (SAR)',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: priceController,
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(
                                hintText: 'e.g. 2.50',
                              ),
                              validator: (val) =>
                                  (val == null || double.tryParse(val) == null)
                                  ? 'Enter price'
                                  : null,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Cost (SAR)',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: costController,
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(
                                hintText: 'e.g. 2.00',
                              ),
                              validator: (val) =>
                                  (val == null || double.tryParse(val) == null)
                                  ? 'Enter cost'
                                  : null,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Initial Stock',
                    style: TextStyle(fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: stockController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(hintText: 'e.g. 50'),
                    validator: (val) =>
                        (val == null || double.tryParse(val) == null)
                        ? 'Enter initial stock'
                        : null,
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                if (formKey.currentState!.validate()) {
                  final newProd = ProductModel(
                    id: const Uuid().v4(),
                    name: nameController.text.trim(),
                    itemCode: skuController.text.trim().isEmpty
                        ? null
                        : skuController.text,
                    barcode: barcodeController.text.trim().isEmpty
                        ? null
                        : barcodeController.text,
                    price: double.parse(priceController.text),
                    purchasePrice: double.parse(costController.text),
                    stock: double.parse(stockController.text),
                    minStock: 5.0,
                    createdAt: DateTime.now(),
                  );

                  await context.read<ProductRepository>().saveProduct(newProd);
                  context.read<WholesaleCubit>().loadAllData();
                  Navigator.pop(context);
                }
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  void _showPrintPriceList() {
    final state = context.read<WholesaleCubit>().state;
    String searchQuery = '';

    showDialog(
      context: context,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        
        return StatefulBuilder(
          builder: (context, setDialogState) {
            final filtered = state.products.where((p) {
              final query = searchQuery.toLowerCase();
              return p.name.toLowerCase().contains(query) ||
                  (p.itemCode ?? '').toLowerCase().contains(query) ||
                  (p.barcode ?? '').toLowerCase().contains(query);
            }).toList();

            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(LucideIcons.printer, color: AppColors.primary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Product Price List',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '${state.products.length} products registered',
                          style: const TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              content: SizedBox(
                width: 500,
                height: 480,
                child: Column(
                  children: [
                    TextField(
                      onChanged: (val) {
                        setDialogState(() {
                          searchQuery = val;
                        });
                      },
                      style: const TextStyle(fontSize: 12),
                      decoration: InputDecoration(
                        hintText: 'Search by name or code...',
                        prefixIcon: const Icon(LucideIcons.search, size: 14),
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white.withOpacity(0.04) : Colors.black.withOpacity(0.03),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Row(
                        children: [
                          Expanded(
                            child: Text(
                              'Product details',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                            ),
                          ),
                          Text(
                            'Unit Price',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 6),

                    Expanded(
                      child: filtered.isEmpty
                          ? const Center(
                              child: Text(
                                'No products match search.',
                                style: TextStyle(color: Colors.grey, fontSize: 12),
                              ),
                            )
                          : ListView.builder(
                              itemCount: filtered.length,
                              itemBuilder: (context, index) {
                                final p = filtered[index];
                                final rowBg = index % 2 == 0 
                                    ? Colors.transparent 
                                    : (isDark ? Colors.white.withOpacity(0.015) : Colors.black.withOpacity(0.01));

                                return Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                  decoration: BoxDecoration(
                                    color: rowBg,
                                    border: Border(
                                      bottom: BorderSide(
                                        color: isDark ? Colors.white10 : Colors.black12,
                                        width: 0.5,
                                      ),
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              p.name,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                                            ),
                                            const SizedBox(height: 3),
                                            Row(
                                              children: [
                                                if (p.itemCode != null) ...[
                                                  Text(
                                                    'SKU: ${p.itemCode}',
                                                    style: const TextStyle(fontSize: 10, color: Colors.grey),
                                                  ),
                                                  const SizedBox(width: 8),
                                                ],
                                                Text(
                                                  'Stock: ${p.stock.toInt()}',
                                                  style: TextStyle(
                                                    fontSize: 10, 
                                                    color: p.stock <= p.minStock ? Colors.orange : Colors.grey,
                                                    fontWeight: p.stock <= p.minStock ? FontWeight.bold : FontWeight.normal,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        '${p.price.toStringAsFixed(2)} SAR',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                          color: AppColors.primary,
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Close', style: TextStyle(color: Colors.grey)),
                ),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Price list generated for printing.')),
                    );
                  },
                  icon: const Icon(LucideIcons.printer, size: 14),
                  label: const Text('Print / Export'),
                ),
              ],
            );
          },
        );
      },
    );
  }
}
