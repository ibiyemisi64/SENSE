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

/**
 * ThemeProvider
 * 
 * This function is used to manage the state of the theme.
 * This tutorial was really helpful: https://www.youtube.com/watch?v=7Cp1GlmHTGE
 */
class ThemeProvider extends ChangeNotifier {
  String themeMode;

  ThemeProvider({required this.themeMode});

  void setTheme(String newTheme) {
    themeMode = newTheme;
    notifyListeners();
  }
}


