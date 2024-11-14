/*
 *      mainpage.dart 
 *    
 *    New Main page for displaying room
 * 
 */

import 'package:flutter/material.dart';
// import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import 'widgets.dart' as widgets;
import 'util.dart' as util;

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
  _AldsMainWidgetState();

  @override
  void initState() {
    super.initState();
    
    // TODO: initial state code
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("ALDS Location Selector"),
      ),
      body: Column(
        children: [
          // Header
          SizedBox(
            height: 50,
            child: Center(
              child: Text(
                "Current Location: ",
                style: TextStyle(color: Colors.black, fontSize: 20),
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
                  style: TextStyle(color: Colors.white),
                )
              ),
            )
          )
        ],
      ),
      bottomNavigationBar: NavigationBar(  // NOTE: Code structure from demo on https://api.flutter.dev/flutter/material/NavigationBar-class.html
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
        ]
      ),
    );
  }

  Widget _createLocationMap() {
    return FlutterMap(
      options: MapOptions(
        initialCenter: LatLng(51.509364, -0.128928), // FIXME: Center over user's current location
        initialZoom: 9.2,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: "edu.brown.alds",  // FIXME: Fix the package name when you know it
        ),
      ]
    );
  }

  void _saveLocationAction() {
    
  }
}