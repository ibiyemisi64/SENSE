/**
 * 
 *  settingspage.dart
 * 
 *  Settings page
 * 
 * 
 */

import 'package:alds/mainpage.dart';
import 'package:alds/savedpage.dart';
import 'package:flutter/material.dart';
import 'util.dart' as util;
import 'widgets.dart' as widgets;
import 'package:google_fonts/google_fonts.dart';
import 'loginpage.dart';

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
            label: 'Locations',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
        onDestinationSelected: (int index) {
            if (index == 0) {
              // Navigate to saved locations page
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AldsMain()),
              );
            }
            if (index == 1) {
              // Navigate to saved locations page
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SavedLocationsPage()),
              );
            }
        }
      ),
      bottomSheet: Container(
       height: 60,
       alignment: Alignment.center,
       child: ElevatedButton(
         onPressed: () {
           // Navigate to saved locations page on logout
           Navigator.push(
             context,
             MaterialPageRoute(builder: (context) => const AldsLogin(),
              ),
           );
         },
         style: ElevatedButton.styleFrom(
           backgroundColor: Colors.red,
           padding: const EdgeInsets.symmetric(horizontal: 40),
         ),
         child: const Text(
           'Logout account',
           style: TextStyle(
             color: Colors.white,
             fontSize: 16,
           ),
         ),
       ),
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
