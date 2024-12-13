/*
 * providers.dart
 *
 * Purpose:
 *   Provides state management for the ALDS (Automatic Location Detection System) Flutter application.
 *   Defines providers and ChangeNotifier classes for theme, current position, and location name management.
 *
 * Copyright 2023 Brown University -- Michael Tu and Kelsie Edie
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

library alds.providers;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:alds/storage.dart';
import 'package:geolocator/geolocator.dart';
import 'locator.dart' as alds_loc;
import 'util.dart' as util;

final themeProvider = ChangeNotifierProvider<ThemeProvider>(
  (ref) => ThemeProvider(themeMode: readThemePref()),
);

final curPositionProvider = ChangeNotifierProvider<PositionProvider>(
  (ref) => PositionProvider(pos: null),
);

final curLocationNameProvider = ChangeNotifierProvider<LocationNameProvider>(
  (ref) => LocationNameProvider(locationName: "Unsaved Location"),
);

class ThemeProvider extends ChangeNotifier {
  String themeMode;

  ThemeProvider({required this.themeMode});

  void setTheme(String newTheme) async {
    themeMode = newTheme;
    notifyListeners();
    await saveThemePref(newTheme);
  }
}

class PositionProvider extends ChangeNotifier {
  Position? pos;

  PositionProvider({required this.pos});

  void setPosition() async {
    pos = await util.getCurrentLocation();
    notifyListeners();
  }
}

class LocationNameProvider extends ChangeNotifier {
  String locationName;

  LocationNameProvider({required this.locationName});

  void setLocationName() {
    alds_loc.Locator loc = alds_loc.Locator();
    loc.findLocation();  
    locationName = loc.lastLocation ?? "Unsaved Location";
    util.log("LOCATION NAME SET TO $locationName");
    notifyListeners();
  }
}
