import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';

class LanguageCubit extends Cubit<String> {
  LanguageCubit() : super('en') {
    _loadLanguage();
  }

  Future<void> _loadLanguage() async {
    try {
      final box = await Hive.openBox('settings');
      final lang = box.get('language', defaultValue: 'en');
      emit(lang);
    } catch (_) {
      emit('en');
    }
  }

  Future<void> changeLanguage(String langCode) async {
    if (langCode == state) return;
    emit(langCode);
    try {
      final box = await Hive.openBox('settings');
      await box.put('language', langCode);
    } catch (_) {}
  }

  bool get isRtl => state == 'ar';
}
