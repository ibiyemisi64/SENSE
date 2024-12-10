import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'dart:convert';

import 'package:alds/storage.dart' as storage;
import 'package:alds/savedpage.dart'; // For SavedLocation class

void main() {
  late Directory testDir;

  setUpAll(() {
    TestWidgetsFlutterBinding.ensureInitialized();
    testDir = Directory.systemTemp.createTempSync();
    Hive.init(testDir.path);
  });

  setUp(() async {
    await storage.setupTestStorage(testDir.path);
    await storage.saveLocatorData(jsonEncode([]));
  });

  tearDownAll(() {
    testDir.deleteSync(recursive: true);
  });
  group('Local Storage Tests', () {
    test('Deleting an item from local storage successfully deletes the item (removeLocation)', () async {
      var initialData = [
        {"location": "LocToDelete", "position": {"latitude": 10.0, "longitude": 20.0}, "bluetooth": {}}
      ];
      await storage.saveLocatorData(jsonEncode(initialData));

      await storage.removeLocation(SavedLocation("LocToDelete", 10.0, 20.0));

      String? data = await storage.readLocationData();
      expect(data, isNotNull);
      var decoded = jsonDecode(data!);
      expect(decoded.length, 0);
    });

    test('Updating an existing item in local storage successfully updates the item (updateLocation)', () async {
      var initialData = [
        {"location": "OldName", "position": {"latitude": 10.0, "longitude": 20.0}, "bluetooth": {}}
      ];
      await storage.saveLocatorData(jsonEncode(initialData));

      await storage.updateLocation(SavedLocation("OldName", 10.0, 20.0), "NewName");

      String? data = await storage.readLocationData();
      var decoded = jsonDecode(data!);
      expect(decoded[0]["location"], "NewName");
    });

    test('Adding a new item to local storage successfully adds the item', () async {
      String? data = await storage.readLocationData();
      var decoded = jsonDecode(data!);
      expect(decoded.length, 0);

      decoded.add({"location": "NewPlace", "position": {"latitude": 30.0, "longitude": 40.0}, "bluetooth": {}});
      await storage.saveLocatorData(jsonEncode(decoded));

      data = await storage.readLocationData();
      decoded = jsonDecode(data!);
      expect(decoded.length, 1);
      expect(decoded[0]["location"], "NewPlace");
    });
  });
}
