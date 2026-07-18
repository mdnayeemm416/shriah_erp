import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../blocs/auth/auth_cubit.dart';
import '../../blocs/auth/auth_state.dart';
import '../../blocs/theme/theme_cubit.dart';
import '../../core/theme/app_colors.dart';

// ─── Brand colours ────────────────────────────────────────────────────────────
const _teal500 = Color(0xFF14B8A6);
const _teal600 = Color(0xFF0D9488);
const _teal700 = Color(0xFF0F766E);
const _rose500 = Color(0xFFF43F5E);
const _violet500 = Color(0xFF8B5CF6);
const _amber500 = Color(0xFFF59E0B);
const _slate900 = Color(0xFF0F172A);

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final currentTheme = context.watch<ThemeCubit>().state;
    final authState = context.watch<AuthCubit>().state;

    String fullName = 'User';
    String email = 'user@shriah.com';
    String roleLabel = 'Staff';
    if (authState is AuthAuthenticated) {
      fullName = authState.user.fullName ?? 'User';
      email = authState.user.email ?? 'user@shriah.com';
      roleLabel = authState.user.landingPage ?? 'Staff';
    }

    final bg = isDark ? AppColors.bgDark : const Color(0xFFF8FAFC);

    return Scaffold(
      backgroundColor: bg,
      body: CustomScrollView(
        slivers: [
          // ─── Hero header ───────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.fromLTRB(20, 20, 20, 24),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [_teal700, _slate900],
                  stops: [0.0, 1.0],
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: _teal600.withOpacity(0.3),
                    blurRadius: 28,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Avatar
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.12),
                      border: Border.all(
                          color: Colors.white.withOpacity(0.25), width: 2),
                    ),
                    child: const Icon(LucideIcons.user,
                        color: Colors.white, size: 30),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(fullName,
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 20,
                                letterSpacing: -0.3),
                            overflow: TextOverflow.ellipsis),
                        const SizedBox(height: 4),
                        Text(email,
                            style: TextStyle(
                                color: Colors.white.withOpacity(0.6),
                                fontSize: 13),
                            overflow: TextOverflow.ellipsis),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 3),
                          decoration: BoxDecoration(
                            color: _teal500.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: _teal400.withOpacity(0.4)),
                          ),
                          child: Text(
                            roleLabel,
                            style: const TextStyle(
                                color: _teal400,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.5),
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Sign out button
                  _ActionButton(
                    icon: LucideIcons.logOut,
                    color: _rose500,
                    tooltip: 'Sign Out',
                    onTap: () => _showSignOutDialog(context),
                  ),
                ],
              ),
            ),
          ),

          // ─── App Preferences ───────────────────────────────────────────
          SliverToBoxAdapter(
            child: _SectionLabel(label: 'App Preferences', isDark: isDark),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
              child: _SettingsCard(
                isDark: isDark,
                children: [
                  // Dark mode toggle
                  _SettingsToggleTile(
                    icon: LucideIcons.moon,
                    iconColor: _violet500,
                    title: 'Dark Mode',
                    subtitle: 'Switch between light and dark appearance',
                    value: currentTheme == ThemeMode.dark,
                    onChanged: (_) =>
                        context.read<ThemeCubit>().toggleTheme(),
                    isDark: isDark,
                  ),
                ],
              ),
            ),
          ),

          // ─── Display & Data ────────────────────────────────────────────
          SliverToBoxAdapter(
            child: _SectionLabel(label: 'Display & Data', isDark: isDark),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
              child: _SettingsCard(
                isDark: isDark,
                children: [
                  _SettingsNavTile(
                    icon: LucideIcons.building2,
                    iconColor: _teal500,
                    title: 'Company Profile',
                    subtitle: 'Business name, address & tax info',
                    isDark: isDark,
                    onTap: () {},
                  ),
                  _divider(isDark),
                  _SettingsNavTile(
                    icon: LucideIcons.printer,
                    iconColor: _amber500,
                    title: 'Receipt & Invoice',
                    subtitle: 'Configure print settings and templates',
                    isDark: isDark,
                    onTap: () {},
                  ),
                  _divider(isDark),
                  _SettingsNavTile(
                    icon: LucideIcons.database,
                    iconColor: _violet500,
                    title: 'Data Management',
                    subtitle: 'Backup, restore and clear data',
                    isDark: isDark,
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ),

          // ─── Notifications ────────────────────────────────────────────
          SliverToBoxAdapter(
            child: _SectionLabel(label: 'Notifications', isDark: isDark),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
              child: _SettingsCard(
                isDark: isDark,
                children: [
                  _SettingsToggleTile(
                    icon: LucideIcons.bellRing,
                    iconColor: _amber500,
                    title: 'Daily Summary',
                    subtitle: 'Receive a closing report at end of day',
                    value: true,
                    onChanged: (_) {},
                    isDark: isDark,
                  ),
                  _divider(isDark),
                  _SettingsToggleTile(
                    icon: LucideIcons.alertCircle,
                    iconColor: _rose500,
                    title: 'Low Stock Alerts',
                    subtitle: 'Get notified when products run low',
                    value: false,
                    onChanged: (_) {},
                    isDark: isDark,
                  ),
                ],
              ),
            ),
          ),

          // ─── Security ─────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: _SectionLabel(label: 'Security', isDark: isDark),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
              child: _SettingsCard(
                isDark: isDark,
                children: [
                  _SettingsNavTile(
                    icon: LucideIcons.lock,
                    iconColor: _rose500,
                    title: 'Change Password',
                    subtitle: 'Update your account password',
                    isDark: isDark,
                    onTap: () {},
                  ),
                  _divider(isDark),
                  _SettingsNavTile(
                    icon: LucideIcons.shieldCheck,
                    iconColor: _teal500,
                    title: 'Two-Factor Auth',
                    subtitle: 'Add an extra layer of security',
                    isDark: isDark,
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ),

          // ─── About ─────────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: _SectionLabel(label: 'About', isDark: isDark),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 32),
              child: _AboutCard(isDark: isDark),
            ),
          ),
        ],
      ),
    );
  }

  Widget _divider(bool isDark) => Divider(
        height: 1,
        indent: 56,
        color: isDark ? AppColors.borderDark : AppColors.borderLight,
      );

  void _showSignOutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: _rose500.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(LucideIcons.logOut,
                    color: _rose500, size: 26),
              ),
              const SizedBox(height: 16),
              const Text('Sign Out',
                  style: TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 18)),
              const SizedBox(height: 8),
              const Text(
                'Are you sure you want to sign out of your account?',
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: AppColors.mutedFgLight, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(ctx),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                        context.read<AuthCubit>().logout();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _rose500,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                      child: const Text('Sign Out',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

const _teal400 = Color(0xFF2DD4BF);

// ─── Section Label ────────────────────────────────────────────────────────────
class _SectionLabel extends StatelessWidget {
  final String label;
  final bool isDark;
  const _SectionLabel({required this.label, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 4, 24, 8),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.0,
          color: isDark ? AppColors.mutedFgDark : AppColors.mutedFgLight,
        ),
      ),
    );
  }
}

// ─── Settings Card container ──────────────────────────────────────────────────
class _SettingsCard extends StatelessWidget {
  final List<Widget> children;
  final bool isDark;
  const _SettingsCard({required this.children, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
            color: isDark ? AppColors.borderDark : AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.12 : 0.04),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(children: children),
    );
  }
}

// ─── Nav tile ─────────────────────────────────────────────────────────────────
class _SettingsNavTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final bool isDark;
  final VoidCallback onTap;

  const _SettingsNavTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: iconColor, size: 18),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: isDark ? Colors.white : const Color(0xFF1E293B))),
                  const SizedBox(height: 2),
                  Text(subtitle,
                      style: TextStyle(
                          fontSize: 12,
                          color: isDark ? Colors.grey[500] : Colors.grey[500])),
                ],
              ),
            ),
            Icon(LucideIcons.chevronRight,
                size: 16,
                color: isDark ? Colors.grey[600] : Colors.grey[400]),
          ],
        ),
      ),
    );
  }
}

// ─── Toggle tile ──────────────────────────────────────────────────────────────
class _SettingsToggleTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;
  final bool isDark;

  const _SettingsToggleTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                        color: isDark ? Colors.white : const Color(0xFF1E293B))),
                const SizedBox(height: 2),
                Text(subtitle,
                    style: TextStyle(
                        fontSize: 12,
                        color:
                            isDark ? Colors.grey[500] : Colors.grey[500])),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: AppColors.primary,
          ),
        ],
      ),
    );
  }
}

// ─── Action button ────────────────────────────────────────────────────────────
class _ActionButton extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String tooltip;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.color,
    required this.tooltip,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
            border:
                Border.all(color: color.withOpacity(0.3)),
          ),
          child: Icon(icon, color: color, size: 18),
        ),
      ),
    );
  }
}

// ─── About Card ───────────────────────────────────────────────────────────────
class _AboutCard extends StatelessWidget {
  final bool isDark;
  const _AboutCard({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
            color: isDark ? AppColors.borderDark : AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.12 : 0.04),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    gradient: const LinearGradient(
                      colors: [_teal600, _slate900],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                          color: _teal600.withOpacity(0.4),
                          blurRadius: 12,
                          offset: const Offset(0, 4)),
                    ],
                  ),
                  padding: const EdgeInsets.all(10),
                  child: Image.asset('assets/images/shriah.png',
                      fit: BoxFit.contain),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('ShRiAh ERP',
                          style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: isDark
                                  ? Colors.white
                                  : const Color(0xFF1E293B))),
                      const SizedBox(height: 3),
                      Text('Flutter Client · v1.0.0',
                          style: TextStyle(
                              fontSize: 12,
                              color: isDark
                                  ? Colors.grey[500]
                                  : Colors.grey[500])),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Divider(
              height: 1,
              color:
                  isDark ? AppColors.borderDark : AppColors.borderLight),
          _AboutRow(
            icon: LucideIcons.copyright,
            text: '© 2026 ShRiAh Group. All rights reserved.',
            isDark: isDark,
          ),
          Divider(
              height: 1,
              indent: 48,
              color:
                  isDark ? AppColors.borderDark : AppColors.borderLight),
          _AboutRow(
            icon: LucideIcons.code2,
            text: 'Built with Flutter & Dart',
            isDark: isDark,
          ),
          Divider(
              height: 1,
              indent: 48,
              color:
                  isDark ? AppColors.borderDark : AppColors.borderLight),
          _AboutRow(
            icon: LucideIcons.server,
            text: 'Offline-first · Hive local storage',
            isDark: isDark,
          ),
        ],
      ),
    );
  }
}

class _AboutRow extends StatelessWidget {
  final IconData icon;
  final String text;
  final bool isDark;

  const _AboutRow(
      {required this.icon, required this.text, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Icon(icon,
              size: 16,
              color: isDark ? Colors.grey[500] : Colors.grey[400]),
          const SizedBox(width: 12),
          Expanded(
            child: Text(text,
                style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.grey[400] : Colors.grey[600])),
          ),
        ],
      ),
    );
  }
}
