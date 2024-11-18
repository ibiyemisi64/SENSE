/**
 * 
 *  settingspage.dart
 * 
 *  Settings page
 * 
 * 
 */

import 'package:flutter/material.dart';
import 'util.dart' as util;
import 'widgets.dart' as widgets;
import 'package:google_fonts/google_fonts.dart';

class AldsSettingsPage extends StatelessWidget {
  const AldsSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ALDS Settings',
      theme: ThemeData(
        textTheme: GoogleFonts.antaTextTheme()
      ),
      home: const AldsSettingsWidget(),
    );
  }
}

class AldsSettingsWidget extends StatefulWidget {
  const AldsSettingsWidget({super.key});

  @override
  State<AldsSettingsWidget> createState() => _AldsSettingsWidgetState();
}

class _AldsSettingsWidgetState extends State<AldsSettingsWidget> {
  // State variables
  bool locationServicesEnabled = false;
  bool notificationsEnabled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Settings"),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          _buildSectionHeader("Features"),
          _buildSwitchTile(
            title: "Location Services",
            subtitle: "Allow the app to access your location",
            value: locationServicesEnabled,
            onChanged: (value) {
              setState(() {
                locationServicesEnabled = value;
              });
            },
          ),
          _buildSwitchTile(
            title: "Notifications",
            subtitle: "Enable app notifications",
            value: notificationsEnabled,
            onChanged: (value) {
              setState(() {
                notificationsEnabled = value;
              });
            },
          ),
          const Divider(),
          _buildSectionHeader("Preferences"),
          _buildListTile(
            title: "Language",
            subtitle: "Change the app language",
            trailing: TextButton(
              onPressed: () {
                // TODO: Implement language selector
              },
              child: const Text("English"),
            ),
          ),
          _buildListTile(
            title: "Theme",
            subtitle: "Switch between light and dark themes",
            trailing: TextButton(
              onPressed: () {
                // TODO: Implement theme toggle
              },
              child: const Text("Light"),
            ),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        destinations: const <Widget>[
          NavigationDestination(
            selectedIcon: Icon(Icons.home),
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.location_on),
            label: 'Saved',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
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
