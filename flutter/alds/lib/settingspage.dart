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

class AldsSettingsPage extends StatelessWidget {
  const AldsSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ALDS Settings',
      theme: util.getTheme(),
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
  bool locationServicesLight = false;
  bool notificationsLight = false;

  _AldsSettingsWidgetState();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("ALDS Settings"),
      ),
      body: Center(
        child: ListView(children: <Widget>[
            ClipRRect(
              borderRadius: BorderRadius.circular(15.0),
              child: Expanded(
                child: _featurePanel(),
              ),
            ),
            widgets.fieldSeparator(),
            ClipRRect(
              borderRadius: BorderRadius.circular(15.0),
              child: Expanded(
                child: _preferencesPanel(),
              )
            )]
        )
      ),
      bottomNavigationBar: NavigationBar(  // NOTE: Code structure from demo on https://api.flutter.dev/flutter/material/NavigationBar-class.html
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
      )
    );
  }

  Widget _featurePanel() {
    return Column(
      children: <Widget>[
        widgets.heading("Features"),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Location Services"),
            Switch(
              value: locationServicesLight, 
              activeColor: Colors.green, 
              onChanged: (bool value) => 
                {setState(() => locationServicesLight = value)},
            )
          ],),
        widgets.fieldSeparator(),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Notifications"),
            Switch(
              value: notificationsLight,
              activeColor: Colors.green,
              onChanged: (bool value) => 
                {setState(() => notificationsLight = value)},
            )
          ],
        )
      ],
    );
  }

  Widget _preferencesPanel() {
    return Column(
      children: <Widget>[
        widgets.heading("Preferences"),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Language"),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30.0),
                ),
              ),
              child: Text('English'),
              onPressed: () {},
            )
            // _createLanguageSelector()
          ],
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Theme"),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30.0),
                ),
              ),
              child: Text('Light'),
              onPressed: () {},
            )
          ],
        )
      ],
    );
  }

  Widget _createLanguageSelector() {
    List<String> languages = []; // FIXME: Fill this in later

    return widgets.dropDown(languages, value: "English", onChanged: _locationSelected);
  }

  Future<void> _locationSelected(String? value) async {
    
  }
}