/*
 *      storage.dart
 * 
 *    Persistent storage for ALDS
 * 
 */
/* 	Copyright 2023 Brown University -- Steven P. Reiss			*/
/// *******************************************************************************
///  Copyright 2023, Brown University, Providence, RI.				 *
///										 *
///			  All Rights Reserved					 *
///										 *
///  Permission to use, copy, modify, and distribute this software and its	 *
///  documentation for any purpose other than its incorporation into a		 *
///  commercial product is hereby granted without fee, provided that the 	 *
///  above copyright notice appear in all copies and that both that		 *
///  copyright notice and this permission notice appear in supporting		 *
///  documentation, and that the name of Brown University not be used in 	 *
///  advertising or publicity pertaining to distribution of the software 	 *
///  without specific, written prior permission. 				 *
///										 *
///  BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS		 *
///  SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND		 *
///  FITNESS FOR ANY PARTICULAR PURPOSE.  IN NO EVENT SHALL BROWN UNIVERSITY	 *
///  BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY 	 *
///  DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,		 *
///  WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS		 *
///  ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE 	 *
///  OF THIS SOFTWARE.								 *
///										 *
///******************************************************************************

library alds.storage;

import 'package:hive_flutter/hive_flutter.dart';
import 'dart:convert';

import 'util.dart' as util;
import 'savedpage.dart';

AuthData _authData = AuthData('*', "*");
String _deviceId = "*";
String _appTheme = "System";

class AuthData {
  late String userId;
  late String userPass;

  AuthData(this.userId, this.userPass);
}

Future<void> setupStorage() async {
  await Hive.initFlutter();
  var appbox = await Hive.openBox('appData');
  bool setup = await appbox.get("setup", defaultValue: false);
  String uid = await appbox.get("userid", defaultValue: util.randomString(12));
  String upa = await appbox.get("userpass", defaultValue: util.randomString(16));
  _authData = AuthData(uid, upa);
  _deviceId = appbox.get("deviceid", defaultValue: "ALDS_${util.randomString(20)}");
  _appTheme = appbox.get("theme", defaultValue: _appTheme);
  if (!setup) {
    await saveData();
  }
}

Future<void> setupTestStorage(String testPath) async {
  // For tests, we bypass hive_flutter and path_provider by using Hive.init()
  Hive.init(testPath);
  var appbox = await Hive.openBox('appData');
  bool setup = await appbox.get("setup", defaultValue: false);
  String uid = await appbox.get("userid", defaultValue: util.randomString(12));
  String upa = await appbox.get("userpass", defaultValue: util.randomString(16));
  _authData = AuthData(uid, upa);
  _deviceId = appbox.get("deviceid", defaultValue: "ALDS_${util.randomString(20)}");
  _appTheme = appbox.get("theme", defaultValue: _appTheme);

  if (!setup) {
    saveData();
  }
}

Future<void> saveData() async {
  var appbox = Hive.box('appData');
  await appbox.put('setup', true);
  await appbox.put('userid', _authData.userId);
  await appbox.put('userpass', _authData.userPass);
  await appbox.put('deviceid', _deviceId);
  await appbox.put('theme', _appTheme);
}

AuthData getAuthData() {
  return _authData;
}

String getDeviceId() {
  return _deviceId;
}

// THEME DATA
Future<void> saveThemePref(String theme) async {
  var appbox = Hive.box('appData');
  await appbox.put('theme', theme);
  _appTheme = theme; 
}

String readThemePref() {
  return _appTheme;
}

// USER LOCATION DATA
// FIXME: I think there's an issue with this function, in that all tests that run this function hang
Future<void> saveLocatorData(String json) async {
    var appbox = Hive.box('appData');
    await appbox.put("locdata", json);
  
    util.log("Saving Locator Data: $json");
}

Future<String?> readLocationData() async {
  // late dynamic data;
  // try {
  //   var appbox = Hive.box('appData');
  //   data = await appbox.get('locdata');
  //   util.log("Successfully readLocationData(): $data");
  //   return data;
  // } catch (e) {
  //   util.log("Error readLocationData(): $e");
  //   return "";
  // }

  if (Hive.isBoxOpen('appData')) {
    var appbox = Hive.box('appData');
    var data = await appbox.get('locdata');
    util.log("Read data: $data");
    return data;
  } else {
    util.log("Error readLocationData(): Hive box not open");
    return null;
  }
}

Future<void> addNewLocation(String locationName, double latitude, double longitude) async {
  util.log("Adding new location: $locationName, $latitude, $longitude");
  var appbox = Hive.box('appData');
  String? existingData = await readLocationData();
  List<dynamic> locations = [];
  
  if (existingData != null) {
    locations = json.decode(existingData);
  }

  Map<String, dynamic> newLocation = {
    "location": locationName,
    "position": {
      "latitude": latitude,
      "longitude": longitude,
    },
    "bluetooth": {},
  };

  locations.add(newLocation);
  await saveLocatorData(json.encode(locations));
}

// Future<void> removeLocation(SavedLocation location) async {
//   var appbox = Hive.box('appData');
//   // WE ASSUME THAT LOC NAME IS UNIQUE
//   String? existingData = await readLocationData();
//   if (existingData != null) {
//     List<dynamic> locations = json.decode(existingData);
//     // util.log("BEFORE REMOVE CALLED: $locations");
//     locations.removeWhere((loc) => loc['location'] == location.name);
//     // util.log ("REMOVE CALLED - $locations");
//     appbox.delete("locdata");
//     await saveLocatorData(json.encode(locations));
//   }
// }

Future<void> removeLocation(SavedLocation location) async {
  String? existingData = await readLocationData();
  if (existingData != null) {
    List<dynamic> locations = json.decode(existingData);

    int initialLength = locations.length;
    locations.removeWhere((loc) => loc['location'] == location.name);
    
    util.log("After removing locations: $locations");

    if (locations.length != initialLength) {
      await saveLocatorData(json.encode(locations));
    }
  }
}

// Future<void> updateLocation(SavedLocation location, String locName) async {
//   var appbox = Hive.box('appData');
  
//   String? existingData = await readLocationData();
//   if (existingData != null) {

//     List<dynamic> locations = json.decode(existingData);
//     final currIndex = locations.indexWhere((loc) => loc['location'] == location.name);
  
//     util.log("INDEXWHERE: $currIndex");
//     util.log("LOCS: $locations");    
//     locations[currIndex]["location"] = locName;
//     util.log("Current Locs $locations");
  
//     // appbox.delete("locdata");

//     await saveLocatorData(json.encode(locations));
//   }

// }

Future<void> updateLocation(SavedLocation location, String locName) async {
  String? existingData = await readLocationData();
  if (existingData != null) {
    List<dynamic> locations = json.decode(existingData);
    final currIndex = locations.indexWhere((loc) => loc['location'] == location.name);

    // Ensure location actually exists before updating
    if (currIndex != -1) {
      locations[currIndex]["location"] = locName;
      await saveLocatorData(json.encode(locations));
    } else {
      util.log("Location to update not found: ${location.name}");
    }
  }
}

Future<List<String>> getLocations() async {
  String? locDataJson = await readLocationData();
  if (locDataJson != null) {
    try {
      List<dynamic> locDataParsed = List<dynamic>.from(jsonDecode(locDataJson));
      return locDataParsed
          .map((locData) => locData['location'] as String)
          .toList();
    } catch (e) {
      util.log("Error parsing location data: $e");
      return [];
    }
  }
  return [];
}

