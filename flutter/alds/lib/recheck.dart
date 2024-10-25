/*
 *      recheck.dart
 * 
 *    Code to try to compute location periodically
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


library alds.recheck;

import 'dart:async';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'locator.dart';
import 'package:mutex/mutex.dart';
import 'util.dart' as util;

// FlutterBlue _flutterBlue = FlutterBlue.instance;
bool _checkLocation = false;
bool _checkBluetooth = false;
Locator _locator = Locator();
final _doingRecheck = Mutex();

// Extension function
// Source: https://github.com/chipweinberger/flutter_blue_plus/blob/master/MIGRATION.md#1150
extension Scan on FlutterBluePlus {
  static Stream<ScanResult> scan({
    List<Guid> withServices = const [],
    Duration? timeout,
    bool androidUsesFineLocation = false,
  }) {
    if (FlutterBluePlus.isScanningNow) {
        throw Exception("Another scan is already in progress");
    }

    final controller = StreamController<ScanResult>();

    var subscription = FlutterBluePlus.scanResults.listen(
      (r){if(r.isNotEmpty){controller.add(r.first);}},
      onError: (e, stackTrace) => controller.addError(e, stackTrace),
    );

    Future scanComplete = FlutterBluePlus.isScanning.skip(1).where((e) => e == false).first;

    FlutterBluePlus.startScan(
      withServices: withServices,
      timeout: timeout,
      removeIfGone: null,
      oneByOne: true,
      androidUsesFineLocation: androidUsesFineLocation,
    );

    scanComplete.whenComplete(() {
      subscription.cancel();
      controller.close();
    });

    return controller.stream;
  }
}

Future<void> initialize() async {
  LocationPermission perm = await Geolocator.checkPermission();
  if (perm == LocationPermission.denied) {
    perm = await Geolocator.requestPermission();
  }
  if (perm != LocationPermission.denied) _checkLocation = true;
  util.log("CHECK GEOLOCATION $perm $_checkLocation");
  FlutterBluePlus.setLogLevel(LogLevel.debug);
  _checkBluetooth = await FlutterBluePlus.isAvailable;
  bool ison = await FlutterBluePlus.isOn;
  util.log("CHECK BT $_checkBluetooth $ison ${FlutterBluePlus.state}");
}

Future<LocationData> recheck() async {
  await _doingRecheck.acquire();
  try {
    util.log("START RECHECK");
    Position? curpos;
    if (_checkLocation) {
      try {
        curpos = await Geolocator.getCurrentPosition()
            .timeout(const Duration(seconds: 5));
        double lat = curpos.latitude;
        double long = curpos.longitude;
        double elev = curpos.altitude;
        double speed = curpos.speed;
        double speeda = curpos.speedAccuracy;
        double posa = curpos.accuracy;
        util.log("GEO FOUND $lat $long $elev $speed $speeda $posa");
      } catch (e) {
        util.log("NO GEO LOCATION $e");
      }
    }

    Stream<ScanResult> st = Scan.scan(timeout: const Duration(seconds: 6));
    List<BluetoothData> btdata = await st.fold([], _btscan2);

    // no way to scan wifi access points on ios

    LocationData rslt = _locator.updateLocation(curpos, btdata);
    util.log("FINISHED RECHECK)");
    return rslt;
  } finally {
    _doingRecheck.release();
    util.flushLogs();
  }
}

void _btscan1(ScanResult r) async {
  int rssi = r.rssi;
  String name = r.device.platformName;
  String mac = r.device.remoteId.str;
  // String typ = r.device.type.name;
  String svd = r.advertisementData.serviceData.toString();
  String mfd = r.advertisementData.manufacturerData.toString();
  bool conn = r.advertisementData.connectable;
  String lname = r.advertisementData.advName;
  util.log("BT FOUND $mac $conn $rssi $svd $mfd $name $lname");
}

List<BluetoothData> _btscan2(List<BluetoothData> bl, ScanResult r) {
  _btscan1(r);
  BluetoothData btd = BluetoothData(r.device.remoteId.str, r.rssi, r.device.platformName);
  bl.add(btd);
  return bl;
}











