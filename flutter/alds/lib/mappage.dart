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
  String _curLocationText = "";
  Position? _curPosition;
  final TextEditingController _controller = TextEditingController();
  String? _selectedLocation;
  List<String> locations = [];
  late bool _isLoading;
  List<SavedLocation> savedLocations = [];

  @override
  void initState() {
    super.initState();
    
    Locator loc = Locator();
    _curLocationText = loc.lastLocation ?? "Unsaved Location";
    _isLoading = true;

    _getSavedLocations();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      return Future.error('Location permissions are permanently denied');
    } 

    final pos = await Geolocator.getCurrentPosition();
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
    if (_isLoading) {
      return const CircularProgressIndicator();
    }

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
              widgets.searchableDropdown(
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
                  child: FittedBox(
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
          : LatLng(41.82674914418993, -71.40251841199533),
        initialZoom: 13.0,
      ),
      children: <Widget>[
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: "edu.brown.alds",
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

    if (txt.isEmpty || _curPosition == null) {
      util.log("NO LOCATION ENTERED OR CURRENT POSITION NOT AVAILABLE");
      return;
    }

    await storage.addNewLocation(txt, _curPosition!.latitude, _curPosition!.longitude);
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