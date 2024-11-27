import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'storage.dart' as storage;

class SavedLocationsPage extends StatefulWidget {
  const SavedLocationsPage({super.key});

  @override
  State<SavedLocationsPage> createState() => _SavedLocationsPageState();
}

class _SavedLocationsPageState extends State<SavedLocationsPage> {
  List<SavedLocation> _savedLocations = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadLocations();
  }

  Future<void> _loadLocations() async {
    // Ensure storage is initialized
    await storage.setupStorage();

    // Get locations from storage
    List<String> locationNames = storage.getLocations();

    // For now, we're generating random coordinates around New York coordinates
    setState(() {
      _savedLocations = locationNames.map((name) {
        double latVariation =
            (DateTime.now().millisecondsSinceEpoch % 100) / 1000;
        double longVariation =
            (DateTime.now().millisecondsSinceEpoch % 100) / 1000;
        return SavedLocation(
          name,
          40.7128 + latVariation,
          -74.0060 + longVariation,
        );
      }).toList();
      _isLoading = false;
    });
  }

  Future<void> _deleteLocation(SavedLocation location) async {
    setState(() {
      //TODO: FIX THE REMOVE
      _savedLocations.remove(location);
    });

    // TODO: FIX THE UPDATE BUTTON
    List<String> updatedNames = _savedLocations.map((loc) => loc.name).toList();
    await storage.saveData();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

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
          onSelected: (String value) async {
            if (value == 'delete') {
              await _deleteLocation(location);
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
