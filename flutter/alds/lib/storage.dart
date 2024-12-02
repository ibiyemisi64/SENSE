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

import 'util.dart' as util;
import 'savedpage.dart';
import 'dart:convert';

AuthData _authData = AuthData('*', "*");
// List<String> _locations = defaultLocations;
String _deviceId = "*";

// const List<String> defaultLocations = [
//   'Office',
//   'Home',
//   'Dining',
//   'Meeting',
//   'Class',
//   'Driving',
//   'Gym',
//   'Bed',
//   'Shopping',
//   'Home Office',
//   'Other',
// ];

class AuthData {
  late String userId;
  late String userPass;

  AuthData(this.userId, this.userPass);
}

Future<void> setupStorage() async {
  await Hive.initFlutter();
  var appbox = await Hive.openBox('appData');
  // appbox.clear(); // REMOVE IN PRODUCTION
  bool setup = await appbox.get("setup", defaultValue: false);
  String uid = await appbox.get("userid", defaultValue: util.randomString(12));
  String upa =
      await appbox.get("userpass", defaultValue: util.randomString(16));
  _authData = AuthData(uid, upa);
  // _locations = appbox.get("locations", defaultValue: defaultLocations);
  _deviceId =
      appbox.get("deviceid", defaultValue: "ALDS_${util.randomString(20)}");
  if (!setup) {
    await saveData();
  }
}

Future<void> saveData() async {
  var appbox = Hive.box('appData');
  await appbox.put('setup', true);
  await appbox.put('userid', _authData.userId);
  await appbox.put('userpass', _authData.userPass);
  // await appbox.put('locations', _locations);
  await appbox.put('deviceid', _deviceId);
}

AuthData getAuthData() {
  return _authData;
}

// List<String> getLocations() {
//   return _locations;
// }

String getDeviceId() {
  return _deviceId;
}

Future<void> saveLocatorData(String json) async {
  var appbox = Hive.box('appData');
  await appbox.put("locdata", json);
}

Future<String?> readLocationData() async {
  var appbox = Hive.box('appData');
  return await appbox.get('locdata');
}

Future<void> remove(SavedLocation location) async {
  var appbox = Hive.box('appData');
  // WE ASSUME THAT LOC NAME IS UNIQUE
  String? existingData = await readLocationData();
  if (existingData != null) {
    List<dynamic> locations = json.decode(existingData);
    util.log("BEFORE REMOVE CALLED: $locations");
    locations.removeWhere((loc) => loc['location'] == location.name);
        // loc['location'] == location.name &&
        // loc['position']['latitude'] == location.latitude &&
        // loc['position']['longitude'] == location.longitude);
    util.log ("REMOVE CALLED - $locations");

    appbox.delete("locdata");
    await saveLocatorData(json.encode(locations));
  }
}

Future<void> update(SavedLocation location) async {
  String? existingData = await readLocationData();
  if (existingData != null) {
    List<dynamic> locations = json.decode(existingData);
    locations.removeWhere((loc) =>
        loc['location'] == location.name &&
        loc['position']['latitude'] == location.latitude &&
        loc['position']['longitude'] == location.longitude);

    await saveLocatorData(json.encode(locations));
  }


}




