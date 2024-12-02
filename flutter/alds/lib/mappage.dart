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

import 'widgets.dart' as widgets;
import 'util.dart' as util;
import 'locator.dart';

class AldsMapPage extends StatefulWidget {
  const AldsMapPage({super.key});

  @override
  State<AldsMapPage> createState() => _AldsMapPageState();
}

class _AldsMapPageState extends State<AldsMapPage> {
  String _curLocationText = "";
  Position? _curPosition;

  _AldsMapPageState();

  @override
  void initState() {
    super.initState();
    
    // Initial state
    Locator loc = Locator();
    _curLocationText = loc.lastLocation ?? "Unsaved Location";
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
    return Column( 
      children: [
        // Header
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
        // Map
        Expanded(
          child: _createLocationMap(),
        ),
        SizedBox(
          height: 50,
          child: Center(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepPurpleAccent,
              ),
              onPressed: _handleValidateLocation, 
              child: Text(
                "Validate Location",
                style: GoogleFonts.anta(
                  textStyle: const TextStyle(color: Colors.white),
                ),
              )
            ),
          )
        )
      ],
    );
  }

  Widget _createLocationMap() {
    return FlutterMap(
      options: MapOptions(
        initialCenter: (_curPosition != null) ? LatLng(_curPosition!.latitude, _curPosition!.longitude) : LatLng(51.509364, -0.128928),  // defaults to London
        initialZoom: 9.2,
      ),
      children: [
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
      ]
    );
  }

  void _handleValidateLocation() async {
    String txt = _curLocationText;
    Locator loc = Locator();
    loc.noteLocation(txt);
    util.log("VALIDATE location as $txt");
  }
}