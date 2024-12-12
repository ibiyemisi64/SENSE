/*
 *      locator.dart
 * 
 *    Code to store/update current location information
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


import 'package:geolocator/geolocator.dart';
import 'util.dart' as util;
import 'dart:math';
import "recheck.dart" as recheck;
import "dart:convert";
import "storage.dart" as storage;
import "device.dart" as device;

const btFraction = 0.7;
const locFraction = 0.15;
const altFraction = 0.15;
// const useThreshold = 0.75;
const useThreshold = 0.25;  // NOTE: altered the threshold to demo
const stableCount = 3;

class Locator {
  LocationData? _curLocationData;
  List<KnownLocation> _knownLocations = [];
  String? lastLocation;
  String? _nextLocation;
  int _nextCount = 0;

  static final Locator _locator = Locator._internal();

  factory Locator() {
    return _locator;
  }

  void setup() async {
    String? s = await storage.readLocationData();
    if (s != null) {
      var x = jsonDecode(s) as List;
      List<KnownLocation> klst =
          x.map((json) => KnownLocation.fromJson(json)).toList();
      _knownLocations = klst;
      _knownLocations = [];
    }
  }

  LocationData updateLocation(Position? pos, List<BluetoothData> btdata) {
    LocationData nloc = LocationData(pos, btdata);
    LocationData? cloc = _curLocationData;
    if (cloc != null) {
      // returns _curLocationData or null
      LocationData? rloc = cloc.update(pos, btdata);
      if (rloc == cloc) return cloc;
    }
    _curLocationData = nloc;

    findLocation();
    return nloc;
  }

  Future<String?> findLocation(
      {LocationData? location,
      bool userset = false,
      bool update = false}) async {
    String? rslt;
    LocationData? ld = location;
    if (update) ld = await recheck.recheck();
    ld ??= _curLocationData;
    util.log("FIND ${ld?._bluetoothData} ${ld?._gpsPosition}");

    if (ld == null) return rslt;

    KnownLocation test = KnownLocation(ld, null);
    KnownLocation? best;
    double bestscore = -1;
    util.log("BEFORE Known locations: ${_knownLocations.map((kl) => kl.toJson())}");
    for (KnownLocation kl in _knownLocations) {
      double score = kl.score(test);
      util.log("Compute score $score for ${kl.location}");
      if (score > bestscore) {
        bestscore = score;
        best = kl;
      }
    }
    if (best != null && bestscore > useThreshold) {
      if (!userset) best.merge(test);
      rslt = best.location as String;
    }

    if (lastLocation == null || userset || rslt == lastLocation) {
      await _changeLocation(rslt);
      _nextLocation = null;
      _nextCount = 0;
    } else if (rslt == _nextLocation) {
      if (++_nextCount >= stableCount) {
        await _changeLocation(rslt);
        _nextLocation = null;
        _nextCount = 0;
      }
    } else {
      _nextLocation = rslt;
      _nextCount = 1;
    }

    util.sendDataToCedes({
      "type": "DATA",
      "data": ld.toJson(),
      "location": rslt,
      "set": userset,
      "next": _nextLocation,
      "nextCount": _nextCount
    });

    util.log("Returning $rslt");
    util.log("AFTER Known locations: ${_knownLocations.map((kl) => kl.toJson())}");
    return rslt;
  }

  Future<void> _changeLocation(String? loc) async {
    if (lastLocation == loc || loc == null) return;
    lastLocation = loc;
    device.Cedes().updateLocation(loc);
  }

  Future<void> noteLocation(String loc) async {
    LocationData ld = await recheck.recheck();
    String? s = await findLocation(location: ld, userset: true);
    util.log("noteLocation comparison: $s vs. $loc");
    if (s == loc) {
      findLocation(); // merge
    } else {

      // NOTE: Made this change so that we can guarantee uniqueness of names
      List<String?> knownLocationNames = _knownLocations.map((kl) => kl.location).toList();
      if (!knownLocationNames.contains(loc)) {
        KnownLocation nloc = KnownLocation(ld, loc);
        _knownLocations.add(nloc);
        lastLocation = loc;
      }

      // might want to force merge locations if there are too many
      // for a single room
    }
    String data = jsonEncode(_knownLocations);
    util.log("Location data: $data");
    
    storage.saveLocatorData(data);
  }

  Locator._internal();
}

class LocationData {
  Map<String, BluetoothData> _bluetoothData = {};
  Position? _gpsPosition;
  int _count = 1;

  LocationData(this._gpsPosition, List<BluetoothData> bts) {
    _bluetoothData = {for (BluetoothData bt in bts) bt._id: bt};
  }

  LocationData? update(Position? pos, List<BluetoothData> btdata) {
    int ct = 0;
    Map<String, BluetoothData> nmap = {};
    for (BluetoothData bd in btdata) {
      if (bd._rssi == 127) bd._rssi = -127;
      BluetoothData? match = _bluetoothData[bd._id];
      if (match == null) return null; // new bluetooth item
      int delta = (match._rssi - bd._rssi).abs();
      if (delta > 4) return null;
      int nrssi = ((match._rssi * _count + bd._rssi) ~/ (_count + 1));
      nmap[bd._id] = BluetoothData(bd._id, nrssi, bd._name);
      ++ct;
    }
    if (ct != _bluetoothData.length) return null;
    Position? gpos = _gpsPosition;
    Position? npos;
    if (pos != null && gpos != null) {
      if (_gpsPosition != null) {
        double d1 = (pos.latitude - gpos.latitude).abs();
        if (d1 > pos.accuracy / 2) return null;
        double d2 = (pos.longitude - gpos.longitude).abs();
        if (d2 > pos.accuracy / 2) return null;
        double d3 = (pos.altitude - gpos.altitude).abs();
        if (d3 > pos.accuracy / 4) return null;
        double d4 = (pos.speed - gpos.speed).abs();
        if (d4 > pos.speedAccuracy / 2) return null;
      }
      npos = Position(
        latitude: (gpos.latitude * _count + pos.latitude) / (_count + 1),
        longitude: (gpos.longitude * _count + pos.longitude) / (_count + 1),
        accuracy: max(gpos.accuracy, pos.accuracy),
        timestamp: gpos.timestamp,
        altitude: (gpos.altitude * _count + pos.altitude) / (_count + 1),
        altitudeAccuracy: 20,  // FIXME: Added after upgrading packages, adjust later
        heading: gpos.heading,
        headingAccuracy: 20,  // FIXME: Added after upgrading packages, adjust later
        speed: max(gpos.speed, pos.speed),
        speedAccuracy: max(gpos.speedAccuracy, pos.speedAccuracy),
      );
    }

    _bluetoothData = nmap;
    _gpsPosition = npos;
    _count++;
    return this;
  }

  Map<String, dynamic> toJson() {
    List btdata =
        _bluetoothData.values.map((BluetoothData bd) => bd.toJson()).toList();
    return {
      "bluetoothData": btdata,
      "gpsPosition": _gpsPosition?.toJson(),
      "count": _count,
    };
  }
}

class BluetoothData {
  final String _id;
  int _rssi;
  final String _name;

  BluetoothData(this._id, this._rssi, this._name);

  @override
  String toString() {
    return "BT:$_id = $_rssi ($_name)";
  }

  Map<String, dynamic> toJson() {
    return {"id": _id, "rssi": _rssi, "name": _name};
  }
}

class KnownLocation {
  Map<String, double> _bluetoothMap = {};
  Position? _position;
  String? location;
  int _count = 1;

  KnownLocation(LocationData ldata, this.location) {
    _position = ldata._gpsPosition;
    Map<String, double> bmap = {};
    double totsq = 0;
    for (MapEntry<String, BluetoothData> ent in ldata._bluetoothData.entries) {
      double v = ent.value._rssi.toDouble();
      v = (v + 128) / 100;
      if (v < 0) continue;
      if (v > 1) v = 1;
      totsq += v * v;
      bmap[ent.key] = v;
    }
    totsq = sqrt(totsq);
    _bluetoothMap = bmap.map((k, v) => MapEntry(k, v / totsq));
  }

  double score(KnownLocation kl) {
    double score = _btScore(kl);
    util.log("BLUETOOTH SCORE $score");
    Position? p0 = _position;
    Position? p1 = kl._position;
    if (p0 != null && p1 != null) {
      double d0 = util.calculateDistance(
          p0.latitude, p0.longitude, p1.latitude, p1.longitude);
      double d1 = max(p0.accuracy, p1.accuracy);
      util.log("GPS DISTANCE $d0 $d1 $p0 $p1");
      double d2 = d0 / (2 * d1);
      d2 = (1.0 - d2);
      if (d2 < 0) d2 = 0;
      double a0 = (p0.altitude - p1.altitude).abs() / 5;
      double a1 = (1.0 - a0);
      if (a1 < 0) a1 = 0;
      util.log("GPS SCORES $d2 $a1");
      score = d2 * locFraction + a1 * altFraction + score * btFraction;
    }

    return score;
  }

  double _btScore(KnownLocation kl) {
    double score = 0;
    for (MapEntry<String, double> ent in _bluetoothMap.entries) {
      double? kval = kl._bluetoothMap[ent.key];
      if (kval != null) score += kval * ent.value;
    }
    return score;
  }

  void merge(KnownLocation kl) {
    Map<String, double> btmap = {};
    double ct = _count.toDouble();
    double kct = kl._count.toDouble();
    double tct = ct + kct;
    for (MapEntry<String, double> ent in _bluetoothMap.entries) {
      double dv = kl._bluetoothMap[ent.key] ?? 0;
      btmap[ent.key] = (ent.value * ct + dv * kct) / tct;
    }
    for (MapEntry<String, double> ent in kl._bluetoothMap.entries) {
      if (btmap[ent.key] == null) {
        btmap[ent.key] = ent.value * kct / tct;
      }
    }
    Position? p0 = _position;
    Position? p1 = kl._position;
    if (p0 != null && p1 != null) {
      // accuracy should include max distance as well
      _position = Position(
        latitude: (p0.latitude * ct + p1.latitude * kct) / tct,
        longitude: (p0.longitude * ct + p1.longitude * kct) / tct,
        accuracy: max(p0.accuracy, p1.accuracy),
        timestamp: p0.timestamp,
        altitude: (p0.altitude * ct + p1.altitude * kct) / tct,
        altitudeAccuracy: 20,  // FIXME: Added after upgrading packages, adjust later
        heading: p0.heading,
        headingAccuracy: 20,  // FIXME: Added after upgrading packages, adjust later
        speed: max(p0.speed, p1.speed),
        speedAccuracy: max(p0.speedAccuracy, p1.speedAccuracy),
      );
    }
    _count++;
  }

  Map toJson() {
    return {
      "bluetooth": jsonEncode(_bluetoothMap),
      "position": _position?.toJson(),
      "location": location,
      "count": _count,
    };
  }

  KnownLocation.fromJson(Map<String, dynamic> json) {
    _count = json['count'];
    location = json['location'];
    _position = Position.fromMap(json['position']);
    Map<String, dynamic> dmap = jsonDecode(json['bluetooth']);
    for (MapEntry<String, dynamic> ent in dmap.entries) {
      double d = ent.value;
      _bluetoothMap[ent.key] = d;
    }
  }
}












