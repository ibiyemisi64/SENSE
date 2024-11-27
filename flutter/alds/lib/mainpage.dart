/*
 *      mainpage.dart 
 *    
 *    New Main page for displaying room
 * 
 */

import 'package:alds/settingspage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'savedpage.dart';

import 'widgets.dart' as widgets;
import 'util.dart' as util;
import 'locator.dart';

class AldsMain extends StatelessWidget {
  const AldsMain({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ALDS',
      theme: util.getTheme(),
      home: const AldsMainWidget()
    ); // App
  }
}

class AldsMainWidget extends StatefulWidget {
  const AldsMainWidget({super.key});

  @override
  State<AldsMainWidget> createState() => _AldsMainWidgetState();
}

class _AldsMainWidgetState extends State<AldsMainWidget> {
  String _curLocationText = "";
  Position? _curPosition;

  _AldsMainWidgetState();

  @override
  void initState() {
    super.initState();
    
    // Initial state
    Locator loc = Locator();
    _curLocationText = loc.lastLocation ?? "N/A";
    _getCurrentLocation();
  }

  _getCurrentLocation() async {
    // Code adapted from: https://pub.dev/packages/geolocator#example

    bool serviceEnabled;
    LocationPermission permission;

    // Test if location services are enabled.
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // Location services are not enabled don't continue
      // accessing the position and request users of the 
      // App to enable the location services.
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        // Permissions are denied, next time you could try
        // requesting permissions again (this is also where
        // Android's shouldShowRequestPermissionRationale 
        // returned true. According to Android guidelines
        // your App should show an explanatory UI now.
        return Future.error('Location permissions are denied');
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      // Permissions are denied forever, handle appropriately. 
      return Future.error(
        'Location permissions are permanently denied, we cannot request permissions.');
    } 

    // When we reach here, permissions are granted and we can
    // continue accessing the position of the device.
    final pos = await Geolocator.getCurrentPosition();
    double lat = pos.latitude;
    double long = pos.longitude;
    util.log("CURRENT LOCATION: ($lat, $long)");
    setState(() {
      _curPosition = pos;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
            "ALDS Location Selector",
            style: GoogleFonts.anta(),
          ),
      ),
      body: Column(
        children: [
          // Header
          SizedBox(
            height: 50,
            child: Center(
              child: Text(
                "Current Location: $_curLocationText",
                style: GoogleFonts.anta(
                  textStyle: const TextStyle(color: Colors.black, fontSize: 20),
                ),
              ),
            ),
          ),
          widgets.fieldSeparator(),
          // Map
          Expanded(
            child: _createLocationMap(),
          ),
          SizedBox(
            height: 50,
            child: Center(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                ),
                onPressed: _saveLocationAction, 
                child: Text(
                  "Save Location",
                  style: GoogleFonts.anta(
                    textStyle: const TextStyle(color: Colors.white),
                  ),
                )
              ),
            )
          )
        ],
      ),
    //   bottomNavigationBar: NavigationBar(  // NOTE: Code structure from demo on https://api.flutter.dev/flutter/material/NavigationBar-class.html
    //     destinations: const <Widget>[
    //       NavigationDestination(
    //         selectedIcon: Icon(Icons.home),
    //         icon: Icon(Icons.home_outlined),
    //         label: 'Home',
    //       ),
    //       NavigationDestination(
    //         icon: Icon(Icons.location_on),
    //         label: 'Saved',
    //       ),
    //       NavigationDestination(
    //         icon: Icon(Icons.settings),
    //         label: 'Settings',
    //       ),
    //     ], 
    //   ),
    // );
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
            if (index == 1) {
              // Navigate to saved locations page
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SavedLocationsPage()),
              );
            }
            if (index == 2) {
              // Navigate to saved locations page
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AldsSettingsPage()),
              );
            }
            // Add other navigation cases here if needed
          }
        ));
  }

  Widget _createLocationMap() {
    return FlutterMap(
      options: MapOptions(
        initialCenter: (_curPosition != null) ? LatLng(_curPosition!.latitude, _curPosition!.longitude) : LatLng(41.82674914418993, -71.40251841199533),  // defaults to Brown
        initialZoom: 9.2,
      ),
      children: <Widget>[
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: "edu.brown.alds",  // FIXME: Fix the package name when you know it
        ),
        CurrentLocationLayer(
          alignPositionOnUpdate: AlignOnUpdate.always,
          style: LocationMarkerStyle(
            marker: const DefaultLocationMarker(),
            markerSize: const Size(20, 20),
            markerDirection: MarkerDirection.heading,
          ),
        ),
        ..._createSavedLocationMarkers(),
      ]
    );
  }

  List<Widget> _createSavedLocationMarkers() {
    
    // Mocked saved locations - (name, (lat, long))
    List<SavedLocation> savedLocations = [
      SavedLocation("Home", 41.826874886601985, -71.40318586689112),  // Brown Campus Center
      SavedLocation("Gym", 41.830156496801976, -71.39804070374443), // Nelson Fitness Center
      SavedLocation("Work", 41.826922607676, -71.3995623245632), // CIT
      SavedLocation("Office", 41.82415891316371, -71.39895318840045), // New Watson
    ];

    List<LocationMarkerLayer> savedLocationMarkers = savedLocations.map((SavedLocation loc) => 
      LocationMarkerLayer(
        position: LocationMarkerPosition(latitude: loc.latitude, longitude: loc.longitude, accuracy: 0.5),
        style: LocationMarkerStyle(
          marker: const Icon(Icons.location_on, color: Colors.red),
          markerSize: const Size(20, 20),
        ),
      )
    ).toList();

    return savedLocationMarkers;
  }

  void _saveLocationAction() {
    // TODO: Implement action for clicking the "Save Location" button
  }
}