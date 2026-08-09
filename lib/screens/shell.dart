import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../blocs/auth/auth_cubit.dart';
import '../blocs/auth/auth_state.dart';
import '../blocs/theme/theme_cubit.dart';
import '../blocs/language/language_cubit.dart';
import '../core/theme/app_colors.dart';
import '../core/localization/translate_extension.dart';

// Import Screens
import 'dashboard/summary_screen.dart';
import 'shop/shop_screen.dart';
import 'wholesale/store_admin_screen.dart';
import 'reports/reports_screen.dart';
import 'sales_return/sales_return_screen.dart';
import 'my_expenses/my_expenses_screen.dart';
import 'price_compare/price_compare_screen.dart';
import 'daily_closing/daily_closing_screen.dart';
import 'profit_summary/profit_summary_screen.dart';
import 'employees/employees_screen.dart';
import 'settings/settings_screen.dart';
import 'login/login_screen.dart';
import 'sales_management/sales_management_screen.dart';
import 'sales_management_admin/sales_management_admin_screen.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => AppShellState();
}

class AppShellState extends State<AppShell> {
  int _selectedIndex = 0; // Default: Sales Management Admin
  bool _sidebarCollapsed = false;

  void setSelectedIndex(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> _screens = const [
    SummaryScreen(),
    ShopScreen(),
    StoreAdminScreen(),
    ReportsScreen(),
    SalesReturnScreen(),
    MyExpensesScreen(),
    PriceCompareScreen(),
    DailyClosingScreen(),
    ProfitSummaryScreen(),
    EmployeesScreen(),
    SettingsScreen(),
    SalesManagementScreen(),
    SalesManagementAdminScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _loadSidebarState();
    // Set default page based on user role after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authState = context.read<AuthCubit>().state;
      if (authState is AuthAuthenticated) {
        final role = authState.user.role ?? '';
        if (role == 'sales') {
          setState(() => _selectedIndex = 11); // SalesManagementScreen
        }
      }
    });
  }


  Future<void> _loadSidebarState() async {
    try {
      final box = await Hive.openBox('settings');
      setState(() {
        _sidebarCollapsed = box.get('sidebarCollapsed', defaultValue: false);
      });
    } catch (_) {}
  }

  Future<void> _toggleSidebar() async {
    setState(() {
      _sidebarCollapsed = !_sidebarCollapsed;
    });
    try {
      final box = await Hive.openBox('settings');
      await box.put('sidebarCollapsed', _sidebarCollapsed);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isRtl = context.watch<LanguageCubit>().isRtl;
    final authState = context.watch<AuthCubit>().state;

    String fullName = 'User';
    String userRole = '';
    if (authState is AuthAuthenticated) {
      fullName = authState.user.fullName ?? 'User';
      userRole = authState.user.role ?? '';
    }

    final isSalesRole = userRole == 'sales';

    return BlocListener<AuthCubit, AuthState>(
      listener: (context, state) {
        if (state is! AuthAuthenticated) {
          Navigator.of(context).pushReplacement(
            PageRouteBuilder(
              pageBuilder: (_, __, ___) => const LoginScreen(),
              transitionsBuilder: (_, anim, __, child) =>
                  FadeTransition(opacity: anim, child: child),
              transitionDuration: const Duration(milliseconds: 500),
            ),
          );
        }
      },
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isLarge = constraints.maxWidth >= 800;

          return Scaffold(
            // Sales role: drawer with ONLY Sales Management + Logout
            drawer: isLarge
                ? null
                : isSalesRole
                    ? _buildSalesDrawer(context, isDark, fullName)
                    : _buildMobileDrawer(context, isDark, fullName, userRole),
            appBar: isLarge
                ? null
                : AppBar(
                    title: const Text('ShRiAh ERP', style: TextStyle(fontWeight: FontWeight.bold)),
                    actions: isSalesRole
                        ? [] // No extra actions for sales role
                        : [
                            IconButton(
                              icon: const Icon(LucideIcons.bell),
                              onPressed: () {},
                            ),
                            IconButton(
                              icon: const Icon(LucideIcons.settings),
                              onPressed: () {
                                setState(() => _selectedIndex = 10);
                              },
                            ),
                          ],
                  ),
            body: isLarge
                ? Row(
                    textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
                    children: [
                      _buildDesktopSidebar(context, isDark, isRtl, fullName, userRole),
                      const VerticalDivider(width: 1),
                      Expanded(
                        child: ClipRect(
                          child: Scaffold(
                            backgroundColor: Colors.transparent,
                            appBar: AppBar(
                              elevation: 0,
                              backgroundColor: Colors.transparent,
                              automaticallyImplyLeading: false,
                              title: Row(
                                children: [
                                  IconButton(
                                    icon: Icon(_sidebarCollapsed
                                        ? LucideIcons.panelLeftOpen
                                        : LucideIcons.panelLeftClose),
                                    onPressed: _toggleSidebar,
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    'Logged in as: $fullName',
                                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                                  ),
                                ],
                              ),
                              actions: [
                                IconButton(
                                  icon: Icon(
                                    isDark ? LucideIcons.sun : LucideIcons.moon,
                                    size: 20,
                                  ),
                                  onPressed: () {
                                    context.read<ThemeCubit>().toggleTheme();
                                  },
                                ),
                                const SizedBox(width: 16),
                              ],
                            ),
                            body: _screens[_selectedIndex],
                          ),
                        ),
                      ),
                    ],
                  )
                : _screens[_selectedIndex],
            // Sales role: NO bottom navigation bar
            bottomNavigationBar: isLarge || isSalesRole
                ? null
                : BottomNavigationBar(
                    type: BottomNavigationBarType.fixed,
                    currentIndex: _selectedIndex > 3 ? 0 : _selectedIndex,
                    selectedItemColor: AppColors.primary,
                    unselectedItemColor: Colors.grey,
                    onTap: (idx) {
                      setState(() => _selectedIndex = idx);
                    },
                    items: [
                      BottomNavigationBarItem(
                        icon: const Icon(LucideIcons.home),
                        label: context.t('nav.home'),
                      ),
                      BottomNavigationBarItem(
                        icon: const Icon(LucideIcons.store),
                        label: context.t('nav.shop'),
                      ),
                      BottomNavigationBarItem(
                        icon: const Icon(LucideIcons.globe),
                        label: context.t('nav.wholesale'),
                      ),
                      BottomNavigationBarItem(
                        icon: const Icon(LucideIcons.fileBarChart),
                        label: context.t('nav.reports'),
                      ),
                    ],
                  ),
          );
        },
      ),
    );
  }

  Widget _buildDesktopSidebar(BuildContext context, bool isDark, bool isRtl, String userName, String userRole) {
    final width = _sidebarCollapsed ? 76.0 : 250.0;
    final isAdmin = userRole == 'admin';

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      width: width,
      color: isDark ? AppColors.cardDark : AppColors.cardLight,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Sidebar Brand Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
            child: Row(
              children: [
                Container(
                  height: 40,
                  width: 40,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(LucideIcons.wallet, color: Colors.white, size: 20),
                ),
                if (!_sidebarCollapsed) ...[
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ShRiAh Group',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: -0.5),
                        ),
                        Text(
                          'ERP Solution',
                          style: TextStyle(fontSize: 12, color: AppColors.mutedFgLight),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          const Divider(height: 1),

          // Sidebar Navigation Links
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 16),
              children: [
                _buildSidebarItem(0, LucideIcons.home, context.t('nav.home')),
                _buildSidebarItem(1, LucideIcons.store, context.t('nav.shop')),
                _buildSidebarItem(2, LucideIcons.globe, context.t('nav.wholesale')),
                _buildSidebarItem(3, LucideIcons.fileBarChart, context.t('nav.reports')),
                _buildSidebarItem(4, LucideIcons.undo, 'Sales Return'),
                _buildSidebarItem(5, LucideIcons.arrowUpCircle, 'My Wallet'),
                _buildSidebarItem(6, LucideIcons.trendingUp, 'Price Compare'),
                _buildSidebarItem(7, LucideIcons.calendarCheck, 'Daily Closing'),
                _buildSidebarItem(8, LucideIcons.barChart, 'Profit Summary'),
                _buildSidebarItem(9, LucideIcons.users, context.t('nav.employees')),
                // Sales Management Admin only visible to admin role
                if (isAdmin) _buildSidebarItem(12, LucideIcons.shieldAlert, 'Sales Management Admin'),
                _buildSidebarItem(10, LucideIcons.settings, context.t('nav.settings')),
              ],
            ),
          ),

          // Sidebar Footer Action Drawer
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                if (!_sidebarCollapsed)
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          userName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const Text(
                          'Online Session',
                          style: TextStyle(color: AppColors.success, fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                IconButton(
                  icon: const Icon(LucideIcons.logOut, color: Colors.grey, size: 18),
                  onPressed: () {
                    context.read<AuthCubit>().logout();
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebarItem(int index, IconData icon, String label) {
    final isSelected = _selectedIndex == index;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          setState(() {
            _selectedIndex = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primary.withAlpha(25)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                color: isSelected ? AppColors.primary : Colors.grey,
                size: 20,
              ),
              if (!_sidebarCollapsed) ...[
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                      color: isSelected
                          ? AppColors.primary
                          : (isDark ? Colors.white70 : Colors.black87),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  /// Restricted drawer for sales role — ONLY shows Sales Management + Logout
  Widget _buildSalesDrawer(BuildContext context, bool isDark, String userName) {
    return Drawer(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      backgroundColor: isDark ? AppColors.bgDark : AppColors.bgLight,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Gradient Account Header
          Container(
            padding: const EdgeInsets.only(top: 60, bottom: 24, left: 24, right: 24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.primary, AppColors.primaryGlow],
              ),
              borderRadius: const BorderRadius.only(topRight: Radius.circular(32)),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withAlpha(60),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(2),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: CircleAvatar(
                    radius: 28,
                    backgroundColor: AppColors.primary.withAlpha(40),
                    child: const Icon(LucideIcons.user, color: AppColors.primary, size: 28),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        userName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withAlpha(50),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.circle, color: Colors.greenAccent, size: 8),
                            SizedBox(width: 4),
                            Text(
                              'Sales Session',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
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
          ),

          // Only one nav item: Sales Management
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 16),
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: Text(
                    'MY WORKSPACE',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
                  ),
                ),
                _buildDrawerItem(11, LucideIcons.userCheck, 'Sales Management', isDark),
              ],
            ),
          ),

          // Footer: Logout only
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: InkWell(
              borderRadius: BorderRadius.circular(14),
              onTap: () {
                Navigator.pop(context);
                context.read<AuthCubit>().logout();
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: Colors.red.withAlpha(18),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.red.withAlpha(40)),
                ),
                child: const Row(
                  children: [
                    Icon(LucideIcons.logOut, color: Colors.redAccent, size: 20),
                    SizedBox(width: 16),
                    Text(
                      'Logout',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.redAccent,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileDrawer(BuildContext context, bool isDark, String userName, String userRole) {
    final isAdmin = userRole == 'admin';
    return Drawer(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      backgroundColor: isDark ? AppColors.bgDark : AppColors.bgLight,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Dynamic Gradient Account Header
          Container(
            padding: const EdgeInsets.only(top: 60, bottom: 24, left: 24, right: 24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppColors.primary,
                  AppColors.primaryGlow,
                ],
              ),
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(32),
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withAlpha(60),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(2),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: CircleAvatar(
                    radius: 28,
                    backgroundColor: AppColors.primary.withAlpha(40),
                    child: const Icon(LucideIcons.user, color: AppColors.primary, size: 28),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        userName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withAlpha(50),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.circle, color: Colors.greenAccent, size: 8),
                            SizedBox(width: 4),
                            Text(
                              'ERP Session',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
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
          ),

          // Drawer Navigation Items (Grouped)
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 16),
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: Text(
                    'MAIN WORKSPACES',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
                  ),
                ),
                _buildDrawerItem(0, LucideIcons.home, context.t('nav.home'), isDark),
                _buildDrawerItem(1, LucideIcons.store, context.t('nav.shop'), isDark),
                _buildDrawerItem(2, LucideIcons.globe, context.t('nav.wholesale'), isDark),
                _buildDrawerItem(3, LucideIcons.fileBarChart, context.t('nav.reports'), isDark),
                
                const Padding(
                  padding: EdgeInsets.only(left: 24, top: 16, right: 24),
                  child: Text(
                    'MANAGEMENT & UTILITIES',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
                  ),
                ),
                _buildDrawerItem(4, LucideIcons.undo, 'Sales Return', isDark),
                _buildDrawerItem(5, LucideIcons.arrowUpCircle, 'My Wallet', isDark),
                _buildDrawerItem(6, LucideIcons.trendingUp, 'Price Compare', isDark),
                _buildDrawerItem(7, LucideIcons.calendarCheck, 'Daily Closing', isDark),
                _buildDrawerItem(8, LucideIcons.barChart, 'Profit Summary', isDark),
                _buildDrawerItem(9, LucideIcons.users, context.t('nav.employees'), isDark),
                // Sales Management Admin only visible to admin role
                if (isAdmin) _buildDrawerItem(12, LucideIcons.shieldAlert, 'Sales Management Admin', isDark),
                _buildDrawerItem(10, LucideIcons.settings, context.t('nav.settings'), isDark),
              ],
            ),
          ),

          // Drawer Footer Toggles & Log Out
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(isDark ? LucideIcons.sun : LucideIcons.moon, size: 20),
                  onPressed: () {
                    context.read<ThemeCubit>().toggleTheme();
                  },
                ),
                IconButton(
                  icon: const Icon(LucideIcons.globe, size: 20),
                  onPressed: () {
                    setState(() => _selectedIndex = 10);
                    Navigator.pop(context);
                  },
                ),
                IconButton(
                  icon: const Icon(LucideIcons.logOut, color: AppColors.destructive, size: 20),
                  onPressed: () {
                    Navigator.pop(context);
                    context.read<AuthCubit>().logout();
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(int index, IconData icon, String label, bool isDark) {
    final isSelected = _selectedIndex == index;
    final activeBg = AppColors.primary.withAlpha(25);
    const activeFg = AppColors.primary;
    final inactiveFg = isDark ? Colors.white70 : Colors.black87;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 3),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          setState(() {
            _selectedIndex = index;
          });
          Navigator.pop(context); // Close Drawer
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? activeBg : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isSelected ? AppColors.primary.withAlpha(50) : Colors.transparent,
              width: 1,
            ),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                color: isSelected ? activeFg : Colors.grey,
                size: 20,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    color: isSelected ? activeFg : inactiveFg,
                  ),
                ),
              ),
              if (isSelected)
                const Icon(
                  LucideIcons.chevronRight,
                  color: AppColors.primary,
                  size: 14,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
