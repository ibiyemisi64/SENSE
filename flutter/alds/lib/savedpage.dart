/*
* Some of the code below is adopted from mainpage.dart, written by Michael and from claude.ai
*/

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AldsSavedLocationsPage extends StatefulWidget {
  const AldsSavedLocationsPage({super.key});

  @override
  State<AldsSavedLocationsPage> createState() => _AldsSavedLocationsPageState();
}

class _AldsSavedLocationsPageState extends State<AldsSavedLocationsPage> {
  // Mock data - a list of saved locations (name, latitude, longitude)
  final List<SavedLocation> _savedLocations = [
    SavedLocation("Home", 40.7128, -74.0060),
    SavedLocation("Work", 40.7589, -73.9851),
    SavedLocation("Gym", 40.7549, -73.9840),
    SavedLocation("Starbucks", 40.7082, -74.0337),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        itemCount: _savedLocations.length,
        itemBuilder: (context, index) {
          return _buildLocationCard(_savedLocations[index]);
        },
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
