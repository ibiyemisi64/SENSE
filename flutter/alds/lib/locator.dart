/*
 * locator.dart
 *
 * Purpose:
 *   Code to store and update current location information based on GPS and Bluetooth data.
 *
 * Copyright 2024 Brown University -- Steven Reiss, Kelsie Edie, and Micheal Tu
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

import 'package:geolocator/geolocator.dart';
import 'dart:math';
import 'dart:convert';

import 'util.dart' as util;
import 'recheck.dart' as recheck;
import 'storage.dart' as storage;
import 'device.dart' as device;

class LocatorConfig {
  final double btFraction;
  final double locFraction;
  final double altFraction;
  final double useThreshold;
  final int stableCount;

  const LocatorConfig({
    this.btFraction = 0.7,
    this.locFraction = 0.15,
    this.altFraction = 0.15,
    this.useThreshold = 0.25, // Threshold altered for demonstration purposes
    this.stableCount = 3,
  });
}

class Locator {
  LocationData? _curLocationData;
  List<KnownLocation> _knownLocations = [];
  String? lastLocation;
  String? _nextLocation;
  int _nextCount = 0;

  final LocatorConfig config;

  static final Locator _locator = Locator._internal();

  factory Locator({LocatorConfig config = const LocatorConfig()}) {
    return _locator;
  }

  Locator._internal() : config = const LocatorConfig();

  /// Initializes the Locator by reading stored location data.
  Future<void> setup() async {
    String? s = await storage.readLocationData();
    if (s != null) {
      var decoded = jsonDecode(s) as List;
      _knownLocations = decoded
          .map((json) => KnownLocation.fromJson(json))
          .whereType<KnownLocation>()
          .toList();
    } else {
      _knownLocations = [];
    }
  }

  /// Removes a location from the known locations list.
  void removeLocation(String location) {
    util.log("Removing location: $location");
    _knownLocations.removeWhere((kl) => kl.location == location);
    lastLocation = null; // Reset the last location
    util.log("AFTER removing: $_knownLocations");
  }

  /// Updates the current location data with new GPS and Bluetooth data.
  /// Attempts to merge with existing location if consistent; otherwise, sets new.
  LocationData updateLocation(Position? pos, List<BluetoothData> btdata) {
    if (btdata.isEmpty && pos == null) {
      util.log("No position or BT data provided for updateLocation.");
      return _curLocationData ?? LocationData(null, []);
    }

    LocationData newLocation = LocationData(pos, btdata);
    LocationData? currentLocation = _curLocationData;

    if (currentLocation != null) {
      LocationData? updatedLocation = currentLocation.update(pos, btdata);
      if (updatedLocation == currentLocation) return currentLocation; // Successfully merged
      util.log("Current location data not merged; using new data set.");
    }

    _curLocationData = newLocation;
    findLocation();
    return newLocation;
  }

  /// Attempts to find a known location that matches the current data.
  /// If found above threshold, updates lastLocation accordingly.
  Future<String?> findLocation({
    LocationData? location,
    bool userset = false,
    bool update = false,
  }) async {
    String? result;
    LocationData? ld = location;

    if (update) ld = await recheck.recheck();
    ld ??= _curLocationData;

    util.log("FIND ${ld?._bluetoothData} ${ld?._gpsPosition}");
    if (ld == null) return result;

    KnownLocation test = KnownLocation(ld, null);
    KnownLocation? best;
    double bestScore = -1;

    util.log("BEFORE Known locations: ${_knownLocations.map((kl) => kl.toJson())}");

    for (KnownLocation kl in _knownLocations) {
      double score = _scoreMatch(kl, test);
      util.log("Compute score $score for ${kl.location}");
      if (score > bestScore) {
        bestScore = score;
        best = kl;
      }
    }

    if (best != null && bestScore > config.useThreshold) {
      if (!userset) {
        _mergeLocation(best, test);
      }
      result = best.location;
    }

    await _handleStableLocationChange(result, userset, ld);
    return result;
  }

  /// Handles the stability of location changes before committing.
  Future<void> _handleStableLocationChange(
      String? result, bool userset, LocationData ld) async {
    if (lastLocation == null || userset || result == lastLocation) {
      await _changeLocation(result);
      _nextLocation = null;
      _nextCount = 0;
    } else if (result == _nextLocation) {
      if (++_nextCount >= config.stableCount) {
        await _changeLocation(result);
        _nextLocation = null;
        _nextCount = 0;
      }
    } else {
      _nextLocation = result;
      _nextCount = 1;
    }

    util.sendDataToCedes({
      "type": "DATA",
      "data": ld.toJson(),
      "location": result,
      "set": userset,
      "next": _nextLocation,
      "nextCount": _nextCount
    });
  }

  /// Merges two known locations to improve data quality.
  void _mergeLocation(KnownLocation base, KnownLocation newKl) {
    base.merge(newKl);
  }

  /// Calculates a match score between two known locations.
  double _scoreMatch(KnownLocation kl, KnownLocation test) {
    // Bluetooth vector similarity
    double btScore = kl.btScore(test);
    util.log("BLUETOOTH SCORE $btScore");

    double score = btScore * config.btFraction;

    // Position/Altitude scoring if available
    Position? p0 = kl.position;
    Position? p1 = test.position;
    if (p0 != null && p1 != null) {
      // Distance check
      double distance = util.calculateDistance(
          p0.latitude, p0.longitude, p1.latitude, p1.longitude);
      double maxAccuracy = max(p0.accuracy, p1.accuracy);
      double locScore = (1.0 - (distance / (2 * maxAccuracy)));
      locScore = locScore.clamp(0, 1);

      // Altitude check
      double altDifference = (p0.altitude - p1.altitude).abs() / 5;
      double altScore = (1.0 - altDifference).clamp(0, 1);

      util.log("GPS SCORES loc:$locScore alt:$altScore");
      score += locScore * config.locFraction + altScore * config.altFraction;
    }

    return score;
  }

  /// Changes the current location if it differs from the last known location.
  Future<void> _changeLocation(String? loc) async {
    if (lastLocation == loc || loc == null) return;
    lastLocation = loc;
    device.Cedes().updateLocation(loc);
  }

  /// Notes a user-set location. Merges if it matches an existing location; otherwise, adds a new one.
  Future<void> noteLocation(String loc) async {
    LocationData ld = await recheck.recheck();
    String? existingLoc = await findLocation(location: ld, userset: true);

    util.log("noteLocation comparison: $existingLoc vs. $loc");
    if (existingLoc == loc) {
      // Already known location - merge it in
      await findLocation();
    } else {
      // Ensure uniqueness of location names
      List<String?> knownLocationNames =
          _knownLocations.map((kl) => kl.location).toList();
      if (!knownLocationNames.contains(loc)) {
        KnownLocation newLoc = KnownLocation(ld, loc);
        _knownLocations.add(newLoc);
        lastLocation = loc;
      }
    }

    // Reinitialize the Locator singleton
    Locator._internal();
  }
}

class LocationData {
  Map<String, BluetoothData> _bluetoothData = {};
  Position? _gpsPosition;
  int _count = 1;

  LocationData(this._gpsPosition, List<BluetoothData> btList) {
    // Normalize and store Bluetooth data
    for (BluetoothData bt in btList) {
      if (bt.rssi == 127) bt.rssi = -127; // Fix invalid RSSI
      _bluetoothData[bt.id] = bt;
    }
  }

  /// Updates current location with new data. Returns null if inconsistent.
  LocationData? update(Position? pos, List<BluetoothData> btdata) {
    // Create a map of new Bluetooth data and compare
    Map<String, BluetoothData> newMap = {};
    int count = 0;

    // Check for new or missing Bluetooth IDs
    Set<String> oldKeys = _bluetoothData.keys.toSet();
    Set<String> newKeys = btdata.map((e) => e.id).toSet();

    if (oldKeys != newKeys) {
      util.log("Bluetooth set changed; can't merge. Old: $oldKeys New: $newKeys");
      return null;
    }

    for (BluetoothData bd in btdata) {
      BluetoothData? match = _bluetoothData[bd.id];
      if (match == null) return null;
      int delta = (match.rssi - bd.rssi).abs();
      if (delta > 4) return null;
      int mergedRssi = ((match.rssi * _count + bd.rssi) ~/ (_count + 1));
      newMap[bd.id] = BluetoothData(bd.id, mergedRssi, bd.name);
      ++count;
    }

    if (count != _bluetoothData.length) {
      util.log("Bluetooth count mismatch after merge attempt");
      return null;
    }

    // Check GPS consistency
    Position? existingPos = _gpsPosition;
    Position? newPos;
    if (pos != null && existingPos != null) {
      if (!_isGpsConsistent(existingPos, pos)) return null;

      newPos = Position(
        latitude: (existingPos.latitude * _count + pos.latitude) / (_count + 1),
        longitude: (existingPos.longitude * _count + pos.longitude) / (_count + 1),
        accuracy: max(existingPos.accuracy, pos.accuracy),
        timestamp: existingPos.timestamp,
        altitude: (existingPos.altitude * _count + pos.altitude) / (_count + 1),
        altitudeAccuracy: 20,
        heading: existingPos.heading,
        headingAccuracy: 20,
        speed: max(existingPos.speed, pos.speed),
        speedAccuracy: max(existingPos.speedAccuracy, pos.speedAccuracy),
      );
    } else {
      // If no previous GPS or new GPS, keep the existing
      newPos = pos ?? existingPos;
    }

    _bluetoothData = newMap;
    _gpsPosition = newPos;
    _count++;
    return this;
  }

  /// Checks if the new GPS position is consistent with the existing one.
  bool _isGpsConsistent(Position oldPos, Position newPos) {
    double latDiff = (newPos.latitude - oldPos.latitude).abs();
    if (latDiff > newPos.accuracy / 2) return false;

    double lonDiff = (newPos.longitude - oldPos.longitude).abs();
    if (lonDiff > newPos.accuracy / 2) return false;

    double altDiff = (newPos.altitude - oldPos.altitude).abs();
    if (altDiff > newPos.accuracy / 4) return false;

    double speedDiff = (newPos.speed - oldPos.speed).abs();
    if (speedDiff > newPos.speedAccuracy / 2) return false;

    return true;
  }

  /// Converts the LocationData to JSON format.
  Map<String, dynamic> toJson() {
    List btDataList =
        _bluetoothData.values.map((BluetoothData bd) => bd.toJson()).toList();
    return {
      "bluetoothData": btDataList,
      "gpsPosition": _gpsPosition?.toJson(),
      "count": _count,
    };
  }
}

class BluetoothData {
  final String id;
  int rssi;
  final String name;

  BluetoothData(this.id, this.rssi, this.name);

  @override
  String toString() {
    return "BT:$id = $rssi ($name)";
  }

  /// Converts the BluetoothData to JSON format.
  Map<String, dynamic> toJson() {
    return {"id": id, "rssi": rssi, "name": name};
  }
}

class KnownLocation {
  Map<String, double> _bluetoothMap = {};
  Position? _position;
  String? location;
  int _count = 1;

  Position? get position => _position;

  KnownLocation(LocationData ldata, this.location) {
    _initFromLocationData(ldata);
  }

  /// Initializes KnownLocation from LocationData.
  void _initFromLocationData(LocationData ldata) {
    _position = ldata._gpsPosition;
    Map<String, double> bMap = {};
    double totalSquare = 0;

    for (MapEntry<String, BluetoothData> entry in ldata._bluetoothData.entries) {
      double value = (entry.value.rssi + 128) / 100;
      if (value < 0) continue;
      value = value.clamp(0, 1);
      totalSquare += value * value;
      bMap[entry.key] = value;
    }

    double norm = totalSquare > 0 ? sqrt(totalSquare) : 1.0;
    _bluetoothMap = bMap.map((k, v) => MapEntry(k, v / norm));
  }

  /// Calculates the Bluetooth score between two KnownLocations.
  double btScore(KnownLocation kl) {
    double score = 0;
    for (MapEntry<String, double> entry in _bluetoothMap.entries) {
      double? klValue = kl._bluetoothMap[entry.key];
      if (klValue != null) score += klValue * entry.value;
    }
    return score;
  }

  /// Merges another KnownLocation into this one to improve data quality.
  void merge(KnownLocation kl) {
    Map<String, double> mergedMap = {};
    double currentCount = _count.toDouble();
    double klCount = kl._count.toDouble();
    double totalCount = currentCount + klCount;

    // Merge Bluetooth signatures
    for (MapEntry<String, double> entry in _bluetoothMap.entries) {
      double klValue = kl._bluetoothMap[entry.key] ?? 0;
      mergedMap[entry.key] =
          (entry.value * currentCount + klValue * klCount) / totalCount;
    }

    for (MapEntry<String, double> entry in kl._bluetoothMap.entries) {
      if (!mergedMap.containsKey(entry.key)) {
        mergedMap[entry.key] = entry.value * klCount / totalCount;
      }
    }

    // Merge positions
    Position? p0 = _position;
    Position? p1 = kl._position;
    if (p0 != null && p1 != null) {
      _position = Position(
        latitude: (p0.latitude * currentCount + p1.latitude * klCount) / totalCount,
        longitude: (p0.longitude * currentCount + p1.longitude * klCount) / totalCount,
        accuracy: max(p0.accuracy, p1.accuracy),
        timestamp: p0.timestamp,
        altitude: (p0.altitude * currentCount + p1.altitude * klCount) / totalCount,
        altitudeAccuracy: 20,
        heading: p0.heading,
        headingAccuracy: 20,
        speed: max(p0.speed, p1.speed),
        speedAccuracy: max(p0.speedAccuracy, p1.speedAccuracy),
      );
    } else if (p1 != null && p0 == null) {
      // If no previous position, adopt p1
      _position = p1;
    }

    _bluetoothMap = mergedMap;
    _count++;
  }

  /// Converts the KnownLocation to JSON format.
  Map<String, dynamic> toJson() {
    return {
      "bluetooth": jsonEncode(_bluetoothMap),
      "position": _position?.toJson(),
      "location": location,
      "count": _count,
    };
  }

  /// Creates a KnownLocation instance from JSON data.
  KnownLocation.fromJson(Map<String, dynamic> json) {
    _count = json['count'] ?? 1;
    location = json['location'];
    if (json['position'] != null) {
      _position = Position.fromMap(json['position']);
    }

    Map<String, dynamic> decodedBluetooth = jsonDecode(json['bluetooth']);
    for (MapEntry<String, dynamic> entry in decodedBluetooth.entries) {
      double? value = double.tryParse(entry.value.toString());
      if (value != null) {
        _bluetoothMap[entry.key] = value;
      } else {
        util.log("Invalid Bluetooth value for key ${entry.key}");
      }
    }
  }
}
