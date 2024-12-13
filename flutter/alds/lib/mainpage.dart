/*
 * mainpage.dart
 *
 * Purpose:
 *   Defines the main user interface for the ALDS (Automatic Location Detection System) Flutter application.
 *   Displays different pages such as Map, Saved Locations, and Settings.
 *
 * Copyright 2024 Brown University -- Micheal Tu and Kelsie Edie
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
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'util.dart' as util;
import 'savedpage.dart';
import 'mappage.dart';
import 'settingspage.dart';
import 'providers.dart';

class AldsApp extends ConsumerWidget {
  const AldsApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeListener = ref.watch(themeProvider); // Access the theme state provider
    ThemeMode themeMode = util.getThemeMode(themeListener.themeMode);

    return MaterialApp(
      title: "ALDS Location Selector",
      home: AldsMain(),
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode: themeMode, // Default is ThemeMode.system (see providers.dart)
    );
  }
}

class AldsMain extends ConsumerStatefulWidget {
  const AldsMain({super.key});

  @override
  ConsumerState<AldsMain> createState() => _AldsMainState();
}

class _AldsMainState extends ConsumerState<AldsMain> {
  // ignore: unused_field
  Position? _curPosition;
  late int navBarIndex; // Non-nullable variable initialized in initState

  _AldsMainState();

  @override
  void initState() {
    super.initState();
    navBarIndex = 0;
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
        const AldsMapPage(isLoading: false, currentLat: 0.0, currentLng: 0.0),
        const AldsSavedLocationsPage(),
        const AldsSettingsPage(),
      ][navBarIndex],
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          if (index == 0) { // MapPage index
            // Update the current location name
            ref.read(curLocationNameProvider).setLocationName();

            // Update the current position
            ref.read(curPositionProvider).setPosition();
          }

          setState(() => navBarIndex = index);
        },
        indicatorColor: const Color.fromARGB(97, 124, 77, 255),
        selectedIndex: navBarIndex,
        destinations: const <Widget>[
          NavigationDestination(
            selectedIcon: Icon(key: Key('selected_home_icon'), Icons.home),
            icon: Icon(key: Key('home_icon'), Icons.home_outlined),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(key: Key('saved_locations_icon'), Icons.location_on),
            label: 'Saved',
          ),
          NavigationDestination(
            icon: Icon(key: Key("settings_icon"), Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
