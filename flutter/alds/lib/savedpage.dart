/*
*Some of the code below is adopted from mainpage.dart, written by Michael and from claude.ai
*/

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:latlong2/latlong.dart';
import 'mainpage.dart';
import 'settingspage.dart';

class SavedLocationsPage extends StatefulWidget {
  const SavedLocationsPage({super.key});

  @override
  State<SavedLocationsPage> createState() => _SavedLocationsPageState();
}

class _SavedLocationsPageState extends State<SavedLocationsPage> {
  // Mock data - a list of saved locations (name, latitude, longitude)
  final List<SavedLocation> _savedLocations = [
    SavedLocation("Home", 40.7128, -74.0060),
    SavedLocation("Work", 40.7589, -73.9851),
    SavedLocation("Gym", 40.7549, -73.9840),
    SavedLocation("Starbucks", 40.7082, -74.0337),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Saved Locations",
          style: GoogleFonts.anta(),
        ),
      ),
      body: ListView.builder(
        itemCount: _savedLocations.length,
        itemBuilder: (context, index) {
          return _buildLocationCard(_savedLocations[index]);
        },
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 1, // Saved tab
        destinations: const <Widget>[
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          NavigationDestination(
            selectedIcon: Icon(Icons.location_on),
            icon: Icon(Icons.location_on_outlined),
            label: 'Locations',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            label: 'Settings',
          ),
        ],
        onDestinationSelected: (int index) {
          // Handle navigation
          switch (index) {
            case 0:
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const AldsMain()),
              );
              break;
            case 2:
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const AldsSettingsPage()),
              );
              break;
          }
        },
      ),
    );
  }

  Widget _buildLocationCard(SavedLocation location) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: const Icon(
          Icons.location_on,
          color: Colors.red,
        ),
        title: Text(
          location.name,
          style: GoogleFonts.anta(
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        subtitle: Text(
          '${location.latitude.toStringAsFixed(4)}°N, ${location.longitude.toStringAsFixed(4)}°W',
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
        trailing: PopupMenuButton<String>(
          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
            const PopupMenuItem<String>(
              value: 'edit',
              child: Text('Edit'),
            ),
            const PopupMenuItem<String>(
              value: 'delete',
              child: Text('Delete'),
            ),
          ],
          onSelected: (String value) {
            // Handle menu item selection
            if (value == 'delete') {
              setState(() {
                _savedLocations.remove(location);
              });
            }
          },
        ),
      ),
    );
  }
}

class SavedLocation {
  final String name;
  final double latitude;
  final double longitude;

  SavedLocation(this.name, this.latitude, this.longitude);
}
