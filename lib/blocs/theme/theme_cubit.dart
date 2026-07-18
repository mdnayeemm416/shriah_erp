import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';

class ThemeCubit extends Cubit<ThemeMode> {
  ThemeCubit() : super(ThemeMode.light) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    try {
      final box = await Hive.openBox('settings');
      final isDark = box.get('isDark', defaultValue: false);
      emit(isDark ? ThemeMode.dark : ThemeMode.light);
    } catch (_) {
      emit(ThemeMode.light);
    }
  }

  Future<void> toggleTheme() async {
    final isDark = state == ThemeMode.dark;
    final nextMode = isDark ? ThemeMode.light : ThemeMode.dark;
    emit(nextMode);
    try {
      final box = await Hive.openBox('settings');
      await box.put('isDark', !isDark);
    } catch (_) {}
  }
}
