/*
 *      mainpage.dart 
 *    
 *    New Main page for displaying room
 * 
 */

import 'package:alds/mappage.dart';
import 'package:alds/settingspage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'savedpage.dart';

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
  late int navBarIndex; // use of the `late` keyword denotes a non-nullable variable that will be initialized later

  _AldsMainWidgetState();

  @override
  void initState() {
    super.initState();
    
    // Initial state
    navBarIndex = 0;
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
      body: <Widget>[
        const AldsMapPage(),
        const SavedLocationsPage(),
        const AldsSettingsWidget(),
      ][navBarIndex],
      bottomNavigationBar: NavigationBar(  // NOTE: Code structure from demo on https://api.flutter.dev/flutter/material/NavigationBar-class.html
        onDestinationSelected: (int index) {
          setState(() => navBarIndex = index);
        },
        indicatorColor: Colors.purpleAccent,
        selectedIndex: navBarIndex,
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
      ),
    );
  }
}