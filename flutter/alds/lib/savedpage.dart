import 'package:flutter/material.dart';
import 'dart:convert';

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

    // Update in local storage
    await storage.updateLocation(SavedLocation(oldName, 
      _savedLocations[index]['position']['latitude'], 
      _savedLocations[index]['position']['longitude']), newName);
    
    // Refresh the list
    await _loadSavedLocations();
  }

  void _deleteLocation(int index) async {
    String locName = _savedLocations[index]['location'];
    await storage.removeLocation(SavedLocation(
      locName, 
      _savedLocations[index]['position']['latitude'], 
      _savedLocations[index]['position']['longitude']
    ));

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
              child: const Text("Cancel")
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, controller.text), 
              child: const Text("Save")
            ),
          ],
        );
      }
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
      }
    );
  }
}



// // FIXME - Remove unecessary log statements

// class AldsSavedLocationsPage extends StatefulWidget {
//   const AldsSavedLocationsPage({super.key});

//   @override
//   State<AldsSavedLocationsPage> createState() => _AldsSavedLocationsPageState();
// }

// class _AldsSavedLocationsPageState extends State<AldsSavedLocationsPage> {
//   List<SavedLocation> _savedLocations = [];
//   bool _isLoading = true;

//   @override
//   void initState() {
//     super.initState();
//     _loadLocations(); // Potential BUG
//   }

//   Future<void> _loadLocations() async {
//     await storage.setupStorage();

//     String? locDataJson = await storage.readLocationData();
//     if (locDataJson != null) {
//       try {
//         List<dynamic> locDataList = json.decode(locDataJson);

//         setState(() {
//           _savedLocations = locDataList.map((locData) {
//             Map<String, dynamic> position = locData['position'] ?? {};
//             return SavedLocation(
//               locData['location'] ?? 'Unknown',
//               position['latitude']?.toDouble() ?? 0.0,
//               position['longitude']?.toDouble() ?? 0.0,
//             );
//           }).toList();
//           _isLoading = false;
//         });
//       } catch (e) {
//         debugPrint('Error parsing location data: $e');
//         setState(() {
//           _isLoading = false;
//         });
//       }
//     } else {
//       setState(() {
//         _isLoading = false;
//       });
//     }
//   }

//   // Future<void> _saveLocations() async {
//   //   List<Map<String, dynamic>> locDataList = _savedLocations
//   //       .map((loc) => {
//   //             'location': loc.name,
//   //             'position': {
//   //               'latitude': loc.latitude,
//   //               'longitude': loc.longitude,
//   //             }
//   //           })
//   //       .toList();
//   //   util.log("locDatalist - $locDataList");
//   //   // save metadata locally 
//   //   // call delete on that storage that you clicked on 
//   //   // edit the name and add it back - append


//   //   await storage.saveLocatorData(json.encode(locDataList));
//   // }

//   Future<void> _deleteLocation(SavedLocation location) async {
//     // REMOVES THE FIRST LOCATION THAT MATCHES A PARTICULAR CONDITION - and not a conditional remove
//     storage.removeLocation(location);
//     setState(() {
//       _savedLocations.remove(location);
//       _isLoading = true; 
//     });
//     await _loadLocations(); 
//   }


//   Future<void> _editLocation(SavedLocation location) async {

//     String currName = location.name; 
//     String copyCurrName = String.fromCharCodes(currName.codeUnits);

//     final TextEditingController nameController =
//         TextEditingController(text: copyCurrName);

//     await showDialog(
//       context: context,
//       builder: (BuildContext context) {
//         return AlertDialog(
//           title: Text('Edit Location Name'),
//           content: TextField(
//             controller: nameController,
//             decoration: InputDecoration(
//               labelText: 'Location Name',
//               hintText: 'Enter a new location name',
//             ),
//           ),
//           actions: [
//             TextButton(
//               onPressed: () => Navigator.pop(context),
//               child: Text('Cancel'),
//             ),
//             TextButton(
//               onPressed: () async {

//                 if (nameController.text.isNotEmpty) {
//                   // util.log("BEFORE UPDATE - ${location.name}");

//                   // UPDATE STORAGE
//                   await storage.updateLocation(location, nameController.text);

//                   // util.log("AFTER UPDATE - ${location.name}");
//                   // UPDATE UI
//                   final index = _savedLocations.indexOf(location);
//                   setState(() {
//                     _savedLocations[index].name = nameController.text;
//                     _isLoading = true;
                    
//                   });
//                   await _loadLocations();
//                   Navigator.pop(context);
//                 }
//               },
//               child: Text('Save'),
//             ),
//           ],
//         );
//       },
//     );
//   }


//   @override
//   Widget build(BuildContext context) {
//     if (_isLoading) {
//       return const Center(
//         child: CircularProgressIndicator(),
//       );
//     }

//     if (_savedLocations.isEmpty) {
//       return const Center(
//         child: Text('No Saved Locations'),
//       );
//     }

//     return ListView.builder(
//       itemCount: _savedLocations.length,
//       itemBuilder: (context, index) {
//         return _buildLocationCard(_savedLocations[index]);
//       },
//     );
//   }

//   Widget _buildLocationCard(SavedLocation location) {
//     return Card(
//       margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
//       child: ListTile(
//         leading: const Icon(
//           Icons.location_on,
//           color: Colors.red,
//         ),
//         title: Text(
//           location.name,
//           style: GoogleFonts.anta(
//             textStyle: const TextStyle(
//               fontSize: 16,
//               fontWeight: FontWeight.w500,
//             ),
//           ),
//         ),
//         subtitle: Text(
//           '${location.latitude.toStringAsFixed(4)}°N, ${location.longitude.toStringAsFixed(4)}°W',
//           style: const TextStyle(
//             fontSize: 12,
//             color: Colors.grey,
//           ),
//         ),
//         trailing: PopupMenuButton<String>(
//           itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
//             const PopupMenuItem<String>(
//               value: 'edit',
//               child: Text('Edit'),
//             ),
//             const PopupMenuItem<String>(
//               value: 'delete',
//               child: Text('Delete'),
//             ),
//           ],
//           onSelected: (String value) async {
//             if (value == 'delete') {
//               await _deleteLocation(location);
//             } else if (value == 'edit') {
//               await _editLocation(location);
//             }
//           },
//         ),
//       ),
//     );
//   }
// }

class SavedLocation {
  String name;
  final double latitude;
  final double longitude;

  SavedLocation(this.name, this.latitude, this.longitude);
}
