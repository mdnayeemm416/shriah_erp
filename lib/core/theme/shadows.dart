import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppShadows {
  static List<BoxShadow> soft = [
    BoxShadow(
      color: Colors.black.withAlpha(46), // 0.18 * 255 = 46
      offset: const Offset(0, 1),
      blurRadius: 2,
    ),
    BoxShadow(
      color: Colors.black.withAlpha(46),
      offset: const Offset(0, 6),
      blurRadius: 18,
    ),
  ];

  static List<BoxShadow> elegant = [
    BoxShadow(
      color: Colors.black.withAlpha(89), // 0.35 * 255 = 89
      offset: const Offset(0, 8),
      blurRadius: 24,
      spreadRadius: -8,
    ),
    BoxShadow(
      color: Colors.black.withAlpha(71), // 0.28 * 255 = 71
      offset: const Offset(0, 18),
      blurRadius: 48,
      spreadRadius: -12,
    ),
  ];

  static List<BoxShadow> glow = [
    BoxShadow(
      color: AppColors.primary.withAlpha(140), // primary glow mix
      offset: const Offset(0, 10),
      blurRadius: 40,
      spreadRadius: -12,
    ),
  ];
}
