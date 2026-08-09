import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class SalesManagementHeader extends StatelessWidget {
  final bool isDark;
  final Color textColor;
  final Color? subtextColor;
  final VoidCallback onRefresh;
  final VoidCallback? onLogout;

  const SalesManagementHeader({
    super.key,
    required this.isDark,
    required this.textColor,
    this.subtextColor,
    required this.onRefresh,
    this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'SALESMAN',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                      color: subtextColor,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Shop Visit',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.03),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isDark ? Colors.white.withValues(alpha: 0.1) : Colors.black.withValues(alpha: 0.05),
                      ),
                    ),
                    child: IconButton(
                      onPressed: onRefresh,
                      icon: Icon(
                        LucideIcons.refreshCw,
                        size: 18,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                      tooltip: 'Refresh Page',
                    ),
                  ),
                  if (onLogout != null) ...[
                    const SizedBox(width: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.red.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Colors.red.withValues(alpha: 0.2),
                        ),
                      ),
                      child: IconButton(
                        onPressed: onLogout,
                        icon: const Icon(
                          LucideIcons.logOut,
                          size: 18,
                          color: Colors.redAccent,
                        ),
                        tooltip: 'Logout',
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
