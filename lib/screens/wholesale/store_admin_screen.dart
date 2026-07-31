import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../blocs/wholesale/wholesale_cubit.dart';
import '../../blocs/wholesale/wholesale_state.dart';
import '../../core/theme/app_colors.dart';
import 'components/dashboard_tab.dart';
import 'components/sales_tab.dart';
import 'components/purchases_tab.dart';
import 'components/customers_tab.dart';
import 'components/payments_tab.dart';
import 'components/orders_tab.dart';
import 'components/inventory_tab.dart';
import 'components/categories_tab.dart';
import 'components/add_customer_dialog.dart';
import 'components/payment_in_dialog.dart';
import 'components/vyapar_import_dialog.dart';
import 'components/parties_dialog.dart';
import 'wholesale_transaction_dialog.dart';

class StoreAdminScreen extends StatefulWidget {
  const StoreAdminScreen({super.key});

  @override
  State<StoreAdminScreen> createState() => _StoreAdminScreenState();
}

class _StoreAdminScreenState extends State<StoreAdminScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

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
    super.dispose();
  }

  // ─── Tab Pages ─────────────────────────────
  List<Widget> _buildTabPages() {
    return [
      DashboardTab(
        onOpenCustomer: (customer) {
          // Navigate to customers tab – handled internally in DashboardTab
        },
      ),
      const SalesTab(),
      const PurchasesTab(),
      const CustomersTab(),
      const PaymentsTab(),
      const OrdersTab(),
      const InventoryTab(),
      const CategoriesTab(),
    ];
  }

  // ─── FAB per tab ───────────────────────────
  Widget? _buildFabForTab(int activeTab) {
    if (activeTab == 2) {
      return FloatingActionButton(
        backgroundColor: Colors.blue,
        onPressed: () => _showTransactionDialog('purchase'),
        child: const Icon(Icons.add, color: Colors.white),
      );
    } else if (activeTab == 3) {
      return FloatingActionButton(
        backgroundColor: Colors.purple,
        onPressed: _showAddCustomerDialog,
        child: const Icon(Icons.person_add, color: Colors.white),
      );
    } else if (activeTab == 4) {
      return FloatingActionButton(
        backgroundColor: Colors.teal,
        onPressed: _showPaymentInDialog,
        child: const Icon(Icons.add, color: Colors.white),
      );
    }
    return null;
  }

  // ─── Dialog helpers ────────────────────────
  void _showTransactionDialog(String kind, {dynamic initialOrder}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => WholesaleTransactionDialog(
        kind: kind,
        initialOrder: initialOrder,
      ),
    );
  }

  void _showAddCustomerDialog() {
    showDialog(
      context: context,
      builder: (context) => const AddCustomerDialog(),
    );
  }

  void _showPaymentInDialog() {
    showDialog(
      context: context,
      builder: (context) => const PaymentInDialog(),
    );
  }

  void _showVyaparImportDialog() {
    showDialog(
      context: context,
      builder: (context) => const VyaparImportDialog(),
    );
  }

  void _showPartiesDialog([String initialFilter = 'Supplier']) {
    showDialog(
      context: context,
      builder: (context) => PartiesDialog(initialFilter: initialFilter),
    );
  }

  // ─── More-menu helpers ──────────────────────
  void _onMoreMenuSelected(String value) {
    switch (value) {
      case 'category':
        context.read<WholesaleCubit>().changeTab(7);
        break;
      case 'customers':
        context.read<WholesaleCubit>().changeTab(3);
        break;
      case 'suppliers':
        _showPartiesDialog('Supplier');
        break;
      case 'stock_count':
        context.read<WholesaleCubit>().changeTab(6);
        break;
      case 'import':
        _showVyaparImportDialog();
        break;
    }
  }

  void _showSimpleDialog({
    required IconData icon,
    required String title,
    required String body,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Icon(icon, color: AppColors.primary),
            const SizedBox(width: 8),
            Text(title),
          ],
        ),
        content: Text(body),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  // ─── Side navigation (desktop) ─────────────
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
          // Branding header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 28.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(LucideIcons.globe, color: AppColors.primary, size: 24),
                    SizedBox(width: 10),
                    Text(
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
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Divider(
              color: isDark ? Colors.white10 : Colors.black12,
              height: 1,
            ),
          ),
          const SizedBox(height: 16),

          // Nav items
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
                      onTap: () =>
                          context.read<WholesaleCubit>().changeTab(idx),
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

  // ─── Top pills navigation (mobile) ─────────
  Widget _buildTopPillsMenu(WholesaleState state, bool isDark) {
    final List<int> visibleIndices = [0, 1, 2, 3, 4, 5];
    if (state.activeTab >= 6) {
      visibleIndices[5] = state.activeTab;
    }

    final barBgColor = isDark ? const Color(0xFF0F172A) : Colors.white;
    final bottomBorderColor = isDark
        ? Colors.white.withOpacity(0.06)
        : Colors.black.withOpacity(0.06);

    return Container(
      height: 60,
      decoration: BoxDecoration(
        color: barBgColor,
        border: Border(
          bottom: BorderSide(color: bottomBorderColor, width: 1),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 10.0,
              ),
              child: Row(
                children: visibleIndices.map((idx) {
                  final active = state.activeTab == idx;
                  String label = _tabLabels[idx];
                  if (idx == 1) label = 'Sale';
                  if (idx == 2) label = 'Purchase';
                  if (idx == 5) label = 'Order';

                  final bg = active
                      ? (isDark
                          ? const Color(0xFF1E293B)
                          : const Color(0xFFE6F7F0))
                      : Colors.transparent;
                  final fg = active
                      ? (isDark
                          ? const Color(0xFF10B981)
                          : const Color(0xFF0F9D58))
                      : (isDark ? Colors.grey[400] : const Color(0xFF64748B));

                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: Material(
                      color: bg,
                      borderRadius: BorderRadius.circular(20),
                      child: InkWell(
                        onTap: () =>
                            context.read<WholesaleCubit>().changeTab(idx),
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14.0,
                            vertical: 8.0,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(_tabIcons[idx], size: 16, color: fg),
                              const SizedBox(width: 6),
                              Text(
                                label,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: active
                                      ? FontWeight.bold
                                      : FontWeight.w500,
                                  color: fg,
                                ),
                              ),
                              if (idx == 5 &&
                                  state.pendingOrdersCount > 0) ...[
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 6,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.orange,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    '${state.pendingOrdersCount}',
                                    style: const TextStyle(
                                      fontSize: 9,
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
                }).toList(),
              ),
            ),
          ),

          IconButton(
            icon: Icon(
              LucideIcons.refreshCw,
              size: 18,
              color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
            ),
            tooltip: 'Refresh Wholesale Data',
            onPressed: () {
              context.read<WholesaleCubit>().loadAllData();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Refreshing wholesale data from server...'), duration: Duration(seconds: 1)),
              );
            },
          ),
          // More menu
          PopupMenuButton<String>(
            icon: Icon(
              Icons.more_vert,
              color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
            ),
            onSelected: _onMoreMenuSelected,
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'category',
                child: Row(children: [
                  Icon(LucideIcons.tag, size: 18),
                  SizedBox(width: 8),
                  Text('Category'),
                ]),
              ),
              const PopupMenuItem(
                value: 'customers',
                child: Row(children: [
                  Icon(LucideIcons.users, size: 18),
                  SizedBox(width: 8),
                  Text('Customer Ledger'),
                ]),
              ),
              const PopupMenuItem(
                value: 'suppliers',
                child: Row(children: [
                  Icon(LucideIcons.truck, size: 18),
                  SizedBox(width: 8),
                  Text('Suppliers'),
                ]),
              ),
              const PopupMenuItem(
                value: 'stock_count',
                child: Row(children: [
                  Icon(LucideIcons.clipboardList, size: 18),
                  SizedBox(width: 8),
                  Text('Stock Count'),
                ]),
              ),
              const PopupMenuItem(
                value: 'import',
                child: Row(children: [
                  Icon(LucideIcons.fileSpreadsheet, size: 18),
                  SizedBox(width: 8),
                  Text('Import (Vyapar)'),
                ]),
              ),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
    );
  }

  // ─── Build ─────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        if (state.loading) {
          return const Center(child: CircularProgressIndicator());
        }

        // Sync tab controller with state
        if (_tabController.index != state.activeTab) {
          _tabController.index = state.activeTab;
        }

        final tabPages = _buildTabPages();

        return LayoutBuilder(
          builder: (context, constraints) {
            final isLarge = constraints.maxWidth >= 950;

            if (isLarge) {
              // ── Desktop: sidebar layout ──
              return Scaffold(
                body: Row(
                  children: [
                    _buildSideMenu(state, isDark),
                    Expanded(
                      child: TabBarView(
                        controller: _tabController,
                        physics: const NeverScrollableScrollPhysics(),
                        children: tabPages,
                      ),
                    ),
                  ],
                ),
              );
            } else {
              // ── Mobile: top pills layout ──
              return Scaffold(
                backgroundColor: isDark
                    ? const Color(0xFF0F172A)
                    : const Color(0xFFF8FAFC),
                appBar: PreferredSize(
                  preferredSize: const Size.fromHeight(60),
                  child: _buildTopPillsMenu(state, isDark),
                ),
                body: TabBarView(
                  controller: _tabController,
                  physics: const NeverScrollableScrollPhysics(),
                  children: tabPages,
                ),
                floatingActionButton: _buildFabForTab(state.activeTab),
              );
            }
          },
        );
      },
    );
  }
}
