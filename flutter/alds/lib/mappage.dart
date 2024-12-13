/*
 * mainpage.dart
 *
 * Purpose:
 *   Defines the map page for the ALDS (Automatic Location Detection System) Flutter application.
 *   Displays the current location on a map, allows users to validate and save locations,
 *   and shows saved locations with markers.
 *
 * Copyright 2024 Brown University -- Michael Tu and Kelsie Edie
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
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:convert';

import 'providers.dart';
import 'widgets.dart' as widgets;
import 'util.dart' as util;
import 'locator.dart' as alds_loc;
import 'storage.dart' as storage;
import 'savedpage.dart';

class AldsMapPage extends ConsumerStatefulWidget {
  const AldsMapPage({super.key, required bool isLoading, required double currentLat, required double currentLng});

  @override
  ConsumerState<AldsMapPage> createState() => _AldsMapPageState();
}

class _AldsMapPageState extends ConsumerState<AldsMapPage> {
  String _curLocationText = "";
  Position? _curPosition;
  final TextEditingController _controller = TextEditingController();
  // ignore: unused_field
  String? _selectedLocation;
  List<String> locations = [];
  late bool _isLoading;
  List<SavedLocation> savedLocations = [];

  _AldsMapPageState();

  @override
  void initState() {
    super.initState();

    alds_loc.Locator loc = alds_loc.Locator();
    util.log("LOCATOR initialized");
    _curLocationText = loc.lastLocation ?? "Unsaved Location";
    _isLoading = true;
    _initializeCurPosition();

    util.log("calling async functions");
    _getSavedLocations();
  }

  Future<void> _initializeCurPosition() async {
    _curPosition = await util.getCurrentLocation();
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
      util.log("No location data found in local storage");
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
                  "locations_dropdown",
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
    String txt = _controller.text.trim();

    if (txt.isEmpty || _curPosition == null) {
      util.log("NO LOCATION ENTERED OR CURRENT POSITION NOT AVAILABLE");
      return;
    }

    if (!locations.contains(txt)) {
      await storage.addNewLocation(txt, _curPosition!.latitude, _curPosition!.longitude);
    }

    alds_loc.Locator loc = alds_loc.Locator();
    await loc.noteLocation(txt);
    util.log("VALIDATE location as $txt");

    await _getSavedLocations();
    setState(() {
      _controller.clear();
      ref.read(curLocationNameProvider).setLocationName();
      _curLocationText = ref.watch(curLocationNameProvider).locationName;
    });
  }
}
