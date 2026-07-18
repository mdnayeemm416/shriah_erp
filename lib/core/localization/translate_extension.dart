import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../blocs/language/language_cubit.dart';
import 'app_localizations.dart';

extension TranslateExtension on BuildContext {
  String t(String key) {
    final lang = watch<LanguageCubit>().state;
    return AppLocalizations(lang).translate(key);
  }

  // Support translation key with variable replacements like Settings page: {query}
  String tWith(String key, Map<String, String> replacements) {
    String val = t(key);
    replacements.forEach((k, v) {
      val = val.replaceAll('{$k}', v);
    });
    return val;
  }
}
