/*
 *      mainpage.dart 
 *    
 *    New Main page for displaying room
 * 
 */

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'util.dart' as util;
import 'locator.dart' as alds_loc;
import 'savedpage.dart';
import 'mappage.dart';
import 'settingspage.dart';
import 'providers.dart';

class AldsApp extends ConsumerWidget {
  const AldsApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeListener = ref.watch(themeProvider);  // ref.watch() is used to access the state provider
    ThemeMode themeMode = util.getThemeMode(themeListener.themeMode);

    // util.log("Current theme mode: $themeMode");

    return MaterialApp(
      title: "ALDS Location Selector",
      home: AldsMain(),
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode: themeMode,  // default is ThemeMode.system (see providers.dart)
    ); // App
  }
}

class AldsMain extends StatefulWidget {
  const AldsMain({super.key});

  @override
  State<AldsMain> createState() => _AldsMainState();
}

class _AldsMainState extends State<AldsMain> {
  String _curLocationText = "";  // FIXME: Remove this code???
  Position? _curPosition;
  late int navBarIndex; // use of the `late` keyword denotes a non-nullable variable that will be initialized later

  _AldsMainState();

  @override
  void initState() {
    super.initState();
    
    // Initial state
    navBarIndex = 0;
    alds_loc.Locator loc = alds_loc.Locator();
    _curLocationText = loc.lastLocation ?? "N/A";
    _getCurrentLocation();
  }

  _getCurrentLocation() async {  // TODO: Remove this code???
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

    _handleUpdate();
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
        const AldsSavedLocationsPage(),
        const AldsSettingsPage(),
      ][navBarIndex],
      bottomNavigationBar: NavigationBar(  // NOTE: Code structure from demo on https://api.flutter.dev/flutter/material/NavigationBar-class.html
        onDestinationSelected: (int index) {
          if (index == 0) {  // mapPage index
            _getCurrentLocation();
          }

          setState(() => navBarIndex = index);
        },
        indicatorColor: const Color.fromARGB(97, 124, 77, 255),
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

  void _locationSelected(String? value) {
    util.log("SET CURRENT TO $value");
    setState(() => _curLocationText = value ?? "");
  }

  Future<void> _handleUpdate() async {
    alds_loc.Locator loc = alds_loc.Locator();
    String? where = await loc.findLocation();
    _locationSelected(where);
  }
}