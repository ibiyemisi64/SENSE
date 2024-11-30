/**
 *  providers.dart
 * 
 *  Providers for state management
 * 
 * 
 */

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final themeProvider = ChangeNotifierProvider<ThemeProvider>((ref) => ThemeProvider(themeMode: "system"));

class ThemeProvider extends ChangeNotifier {
  String themeMode;

  ThemeProvider({required this.themeMode});

  void setTheme(String newTheme) {
    themeMode = newTheme;
    notifyListeners();
  }
}


