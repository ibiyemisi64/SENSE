///  providers.dart
/// 
///  Providers for state management
/// 
/// 

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
  (ref) => LocationNameProvider(locationName: "Unsaved Location")
);

class ThemeProvider extends ChangeNotifier {
  String themeMode;

  ThemeProvider({required this.themeMode});

  void setTheme(String newTheme) async {
    themeMode = newTheme;
    notifyListeners();

    // Save the updated theme to local storage
    await saveThemePref(newTheme);
  }
}

// We might need this for current position
class PositionProvider extends ChangeNotifier {
  Position? pos;

  PositionProvider({required this.pos});

  void setPosition() async {
    pos = await util.getCurrentLocation();
    // this.pos = pos;
    notifyListeners();
  }
}

class LocationNameProvider extends ChangeNotifier {
  String locationName;

  LocationNameProvider({required this.locationName});

  void setLocationName() {
    alds_loc.Locator loc = alds_loc.Locator();
    loc.findLocation();  // find the location first in order to initialize the lastLocation variable
    locationName = loc.lastLocation ?? "Unsaved Location";
    util.log("LOCATION NAME SET TO $locationName");
    notifyListeners();
  }
}