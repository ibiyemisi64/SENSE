/*
 * savedpage.dart
 *
 * Purpose:
 *   Displays and manages saved locations within the ALDS (Automatic Location Detection System) Flutter application.
 *   Allows editing, deleting, and viewing saved locations stored locally.
 *
 * Copyright 2023 Brown University -- Muhiim Ali and Michael Tu
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

import 'package:flutter/material.dart';
import 'dart:convert';

import 'locator.dart';
import 'storage.dart' as storage;
import 'util.dart' as util;

class AldsSavedLocationsPage extends StatefulWidget {
  const AldsSavedLocationsPage({super.key});

  @override
  State<AldsSavedLocationsPage> createState() => _AldsSavedLocationsPageState();
}

class _AldsSavedLocationsPageState extends State<AldsSavedLocationsPage> {
  List<dynamic> _savedLocations = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSavedLocations();
  }

  Future<void> _loadSavedLocations() async {
    String? locDataJson = await storage.readLocationData();
    if (locDataJson != null) {
      try {
        List<dynamic> locDataParsed = jsonDecode(locDataJson);
        setState(() {
          _savedLocations = locDataParsed;
          _isLoading = false;
        });
      } catch (e) {
        util.log("Error parsing location data: $e");
        setState(() {
          _savedLocations = [];
          _isLoading = false;
        });
      }
    } else {
      setState(() {
        _savedLocations = [];
        _isLoading = false;
      });
    }
  }

  void _editLocation(int index) async {
    String oldName = _savedLocations[index]['location'];
    String? newName = await _showEditDialog(oldName);
    if (newName == null || newName.isEmpty || newName == oldName) return;

    await storage.updateLocation(
      SavedLocation(
        oldName,
        _savedLocations[index]['position']['latitude'],
        _savedLocations[index]['position']['longitude'],
      ),
      newName,
    );

    await _loadSavedLocations();
  }

  void _deleteLocation(int index) async {
    String locName = _savedLocations[index]['location'];
    await storage.removeLocation(
      SavedLocation(
        locName,
        _savedLocations[index]['position']['latitude'],
        _savedLocations[index]['position']['longitude'],
      ),
    );

    Locator loc = Locator();
    loc.removeLocation(locName);

    await _loadSavedLocations();
  }

  Future<String?> _showEditDialog(String oldName) async {
    TextEditingController controller = TextEditingController(text: oldName);
    return showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Edit Location Name'),
          content: TextField(controller: controller, decoration: const InputDecoration(labelText: "New Name")),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, null),
              child: const Text("Cancel"),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, controller.text),
              child: const Text("Save"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_savedLocations.isEmpty) {
      return const Center(child: Text("No Saved Locations"));
    }

    return ListView.builder(
      itemCount: _savedLocations.length,
      itemBuilder: (context, index) {
        final loc = _savedLocations[index];
        return Card(
          child: ListTile(
            title: Text(loc['location'] ?? "Unknown"),
            subtitle: Text("Lat: ${loc['position']['latitude']}, Lng: ${loc['position']['longitude']}"),
            trailing: PopupMenuButton(
              itemBuilder: (BuildContext context) => <PopupMenuEntry>[
                const PopupMenuItem(
                  value: 'edit',
                  child: Text('Edit'),
                ),
                const PopupMenuItem(
                  value: 'delete',
                  child: Text('Delete'),
                ),
              ],
              onSelected: (value) {
                if (value == 'edit') {
                  _editLocation(index);
                } else if (value == 'delete') {
                  _deleteLocation(index);
                }
              },
            ),
          ),
        );
      },
    );
  }
}

class SavedLocation {
  String name;
  final double latitude;
  final double longitude;

  SavedLocation(this.name, this.latitude, this.longitude);
}
