/*
 * settingspage.dart
 *
 * Purpose:
 *   Provides a settings page for the ALDS (Automatic Location Detection System) Flutter application.
 *   Allows users to modify preferences such as language (not implement) and theme.
 *
 * Copyright 2023 Brown University -- Kelsie Edie and Michael Tu
 *
 * All Rights Reserved
 *
 * Permission to use, copy, modify, and distribute this software and its
 * documentation for any purpose other than its incorporation into a
 * commercial product is hereby granted without fee, provided that the
 * above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Brown University not be used in
 * advertising or publicity pertaining to distribution of the software
 * without specific, written prior permission.
 *
 * BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR ANY PARTICULAR PURPOSE. IN NO EVENT SHALL BROWN UNIVERSITY
 * BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 */

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
    // Get the current theme state. Falls back to "System" if not set.
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
                key: const Key("language_dropdown"),
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
            key: const Key("theme_dropdown"),
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
      ],
    );
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
