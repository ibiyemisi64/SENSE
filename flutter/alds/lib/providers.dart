///  providers.dart
/// 
///  Providers for state management
/// 
/// 

library alds.providers;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:alds/storage.dart'; // Import storage functions

final themeProvider = ChangeNotifierProvider<ThemeProvider>(
  (ref) => ThemeProvider(themeMode: readThemePref()),
);

class ThemeProvider extends ChangeNotifier {
  String themeMode;

  ThemeProvider({required this.themeMode});

  void setTheme(String newTheme) async {
    themeMode = newTheme;
    notifyListeners();

    // Save the updated theme to local storage
    await saveThemePref(newTheme);
  }
}


