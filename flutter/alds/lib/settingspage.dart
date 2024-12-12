/// 
///  settingspage.dart
/// 
///  Settings page
/// 
/// 
/// 

library alds.settingspage;

import 'package:alds/providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AldsSettingsPage extends ConsumerStatefulWidget {
  const AldsSettingsPage({super.key});

  @override
  ConsumerState<AldsSettingsPage> createState() => _AldsSettingsPageState();
}

class _AldsSettingsPageState extends ConsumerState<AldsSettingsPage> {

  @override
  Widget build(BuildContext context) {

    // State variables
    // Watch the current theme state from themeProvider, fallback to "System" if no theme is currently set
    final currentTheme = ref.watch(themeProvider).themeMode.isNotEmpty
        ? ref.watch(themeProvider).themeMode
        : "System";

    String selectedLang = "English";

    return ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          _buildSectionHeader("Preferences"),
          _buildListTile(
            title: "Language",
            subtitle: "Change the app language",
            trailing: DropdownButton<String>(
              value: selectedLang,
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    selectedLang = newValue;
                  });
                }
              },
              items: ["English"].map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  key: Key("language_dropdown"),
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
          ),
          _buildListTile(
            title: "Theme",
            subtitle: "Switch between light and dark themes",
            trailing: DropdownButton<String>(
              key: Key("theme_dropdown"),
              value: currentTheme,
              onChanged: (String? newValue) async {
                if (newValue != null) {
                  // Update the app theme via the provider
                  ref.read(themeProvider).setTheme(newValue); 
                }
              },
              items: ["System", "Light", "Dark"].map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  key: Key("${value.toLowerCase()}_item"),
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
          ),
        ]);
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
        ),
      ),
    );
  }

  Widget _buildListTile({
    required String title,
    required String subtitle,
    required Widget trailing,
  }) {
    return ListTile(
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: trailing,
    );
  }
}
