/*
 *    mainpage.dart 
 *    
 *    New Main page for displaying room
 * 
 */

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:convert';

import 'widgets.dart' as widgets;
import 'util.dart' as util;
import 'locator.dart';
import 'storage.dart' as storage;
import 'savedpage.dart';

class AldsMapPage extends StatefulWidget {
  const AldsMapPage({super.key});

  @override
  State<AldsMapPage> createState() => _AldsMapPageState();
}

class _AldsMapPageState extends State<AldsMapPage> {
  // State variables
  String _curLocationText = "";
  Position? _curPosition;
  final TextEditingController _controller = TextEditingController();
  String? _selectedLocation;
  List<String> locations = [];
  late bool _isLoading;
  List<SavedLocation> savedLocations = [];

  _AldsMapPageState();

  @override
  void initState() {
    super.initState();
    
    // Initialize state variables
    Locator loc = Locator();
    _curLocationText = loc.lastLocation ?? "Unsaved Location";
    _isLoading = true;

    // Async functions
    _getSavedLocations();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    // Code adapted from: https://pub.dev/packages/geolocator#example
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();

    // If location services are not enabled don't continue
    if (!serviceEnabled) {
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
      return Future.error('Location permissions are permanently denied');
    } 

    // When we reach here, permissions are granted and we can
    // continue accessing the position of the device.
    final pos = await Geolocator.getCurrentPosition();
    double lat = pos.latitude;
    double long = pos.longitude;
    util.log("CURRENT LOCATION: ($lat, $long)");

    // Update the current position
    setState(() {
      _curPosition = pos;
    });
  }

  Future<void> _getSavedLocations() async {
    String? locDataJson = await storage.readLocationData();
    if (locDataJson != null) {
      try {
        List<dynamic> locDataParsed = List<dynamic>.from(jsonDecode(locDataJson));
        setState(() {
          locations = locDataParsed.map((locData) => locData['location'] as String).toList();
          savedLocations = locDataParsed.map((locData) => SavedLocation(
            locData['location'],
            locData['position']['latitude'],
            locData['position']['longitude']
          )).toList();
          _isLoading = false;
        });
      } catch (e) {
        util.log("Error parsing location data: $e");
        setState(() {
          locations = [];
          savedLocations = [];
          _isLoading = false;
        });
      }
    } else {
      setState(() {
        locations = [];
        savedLocations = [];
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // If still fetching data, show loading indicator
    if (_isLoading) {
      return const CircularProgressIndicator();
    }

    // Build this widget when the data is finishing loading
    return Column( 
      children: [
        SizedBox(
          height: 50,
          child: Center(
            child: Text(
              "Current Location: $_curLocationText",
              style: GoogleFonts.anta(
                textStyle: const TextStyle(fontSize: 20),
              ),
            ),
          ),
        ),
        widgets.fieldSeparator(),
        Expanded(
          child: _createLocationMap(),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // SizedBox(
              //   width: MediaQuery.of(context).size.width * 0.4, 
              //   child: locations.isEmpty
              //     ? TextField(controller: _controller, readOnly: false, decoration: InputDecoration(prefixIcon: Icon(Icons.location_on)))
              //     : widgets.searchableDropdown(
              //         MediaQuery.of(context).size.width * 0.4,
              //         _controller, 
              //         locations, 
              //         (String? value) => setState(() => _selectedLocation = value)
              //     ),
              // ), 
              widgets.searchableDropdown(
                  MediaQuery.of(context).size.width * 0.4,
                  _controller, 
                  locations, 
                  (String? value) => setState(() => _selectedLocation = value)
              ),
              const SizedBox(width: 20,),
              SizedBox(
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurpleAccent,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                  ),
                  onPressed: _handleValidateLocation,
                  child: FittedBox(  // Helps text scale down if needed
                    child: Text(
                      "Validate Location",
                      style: GoogleFonts.anta(
                        textStyle: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                ),
              )
            ],
          )
        ),
      ],
    );
  }

  Widget _createLocationMap() {
    return FlutterMap(
      options: MapOptions(
        initialCenter: (_curPosition != null) 
          ? LatLng(_curPosition!.latitude, _curPosition!.longitude) 
          : LatLng(41.82674914418993, -71.40251841199533),  // defaults to Brown University
        initialZoom: 13.0,
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
    return savedLocations.map((SavedLocation loc) => 
      LocationMarkerLayer(
        position: LocationMarkerPosition(
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: 0.5
        ),
        style: LocationMarkerStyle(
          marker: const Icon(Icons.location_on, color: Colors.red),
          markerSize: const Size(20, 20),
        ),
      )
    ).toList();
  }

  void _handleValidateLocation() async {
    String txt = _controller.text;

    // Handle invalid input
    if (txt.isEmpty || _curPosition == null) {
      util.log("NO LOCATION ENTERED OR CURRENT POSITION NOT AVAILABLE");
      return;
    }

    // Add location first if it doesn't already exist
    if (!locations.contains(txt)) {
      await storage.addNewLocation(txt, _curPosition!.latitude, _curPosition!.longitude);
    }

    // Validate the location using noteLocation()
    Locator loc = Locator();
    loc.noteLocation(txt);
    util.log("VALIDATE location as $txt");
    
    // Refresh locations after adding new one
    await _getSavedLocations();
    setState(() {
      _controller.clear();
    });
  }
}