/**
 * 
 *  settingspage.dart
 * 
 *  Settings page
 * 
 * 
 */

import 'package:flutter/material.dart';
import 'package:alds/widgets.dart' as widgets;

class AldsSettingsWidget extends StatefulWidget {
  const AldsSettingsWidget({super.key});

  @override
  State<AldsSettingsWidget> createState() => _AldsSettingsWidgetState();
}

class _AldsSettingsWidgetState extends State<AldsSettingsWidget> {
  // State variables
  String selectedTheme = "Light";
  String selectedLang = "English";

  @override
  Widget build(BuildContext context) {
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
              value: selectedTheme,
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    selectedTheme = newValue;
                  });
                }
              },
              items: ["Light", "Dark"].map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
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

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return SwitchListTile(
      title: Text(title),
      subtitle: Text(subtitle),
      value: value,
      onChanged: onChanged,
      activeColor: Colors.blue,
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
