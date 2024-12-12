/*
 *        util.dart
 * 
 *    Utility methods
 * 
 */
/*	Copyright 2023 Brown University -- Steven P. Reiss			*/
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

library alds.util;

import 'dart:convert' as convert;
import 'package:crypto/crypto.dart' as crypto;
import 'package:flutter/material.dart';
import 'package:flutter_logs/flutter_logs.dart';
import 'package:geolocator/geolocator.dart';
// import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import 'dart:math';

Future<void> setup() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FlutterLogs.initLogs(
      logLevelsEnabled: [
        LogLevel.INFO,
        LogLevel.WARNING,
        LogLevel.ERROR,
        LogLevel.SEVERE
      ],
      timeStampFormat: TimeStampFormat.TIME_FORMAT_READABLE,
      directoryStructure: DirectoryStructure.SINGLE_FILE_FOR_DAY,
      logFileExtension: LogFileExtension.LOG,
      logsWriteDirectoryName: 'AldsLogs',
      logsExportDirectoryName: 'AldsLogs/Exported',
      debugFileOperations: true,
      isDebuggable: true);
}

String hasher(String msg) {
  final bytes = convert.utf8.encode(msg);
  crypto.Digest rslt = crypto.sha512.convert(bytes);
  String srslt = convert.base64.encode(rslt.bytes);
  return srslt;
}

ThemeData getTheme() {
  return ThemeData(
    primarySwatch: Colors.lightBlue,
  );
}

// Convert theme mode string to ThemeMode
ThemeMode getThemeMode(String themeMode) {
  switch (themeMode.toLowerCase()) {
    case 'light':
      return ThemeMode.light;
    case 'dark':
      return ThemeMode.dark;
    case 'system':
      return ThemeMode.system;
    default:
      log("ERROR: Couldn't retrieve theme mode: $themeMode");
      return ThemeMode.system;
  }
}

String randomString(int len) {
  var r = Random();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  return List.generate(len, (index) => chars[r.nextInt(chars.length)]).join();
}

// distance in meters
double calculateDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;
  var a = 0.5 -
      cos((lat2 - lat1) * p) / 2 +
      cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2;
  return 12742 * asin(sqrt(a)) * 1000;
}

void log(String msg) {
  FlutterLogs.logInfo('ALDS', "LOG", msg);
  sendDataToCedes({"type": "LOG", "message": msg});
}

void flushLogs() {
  FlutterLogs.exportLogs(exportType: ExportType.ALL);
}

Future<void> sendDataToCedes(dynamic d) async {
  var url = Uri.https('sherpa.cs.brown.edu:3333', '/alds/data');
  dynamic d1 = {"aldsdata": convert.jsonEncode(d)};
  await http.post(url, body: d1);
}

Future<Position> getCurrentLocation() async {
    // Code adapted from: https://pub.dev/packages/geolocator#example
    log("getCurrentLocation() called");
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();

    // If location services are not enabled don't continue
    if (!serviceEnabled) {
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
      return Future.error('Location permissions are permanently denied');
    } 

    // When we reach here, permissions are granted and we can
    // continue accessing the position of the device.
    final pos = await Geolocator.getCurrentPosition();
    double lat = pos.latitude;
    double long = pos.longitude;
    log("CURRENT LOCATION: ($lat, $long)");

    return pos;
  }






