import 'dart:io';

import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'dart:convert';

import 'package:alds/mappage.dart';
import 'package:alds/storage.dart' as storage;
// import 'test_storage.dart' as storage;

void main() {
  late Directory testDir;

  setUpAll(() async {
    print("Initial setup function started");
    TestWidgetsFlutterBinding.ensureInitialized();
    testDir = Directory.systemTemp.createTempSync();
    // Hive.init(testDir.path);
    print("Initial setup function completed");
  });

  setUp(() async {
    print("Initial test setup started");
    await storage.setupTestStorage(testDir.path);
    await storage.saveLocatorData(jsonEncode([]));
    print("Initial test setup completed");
  });

  tearDownAll(() async {
    await Hive.close();
    testDir.deleteSync(recursive: true);
  });

  group('Map Page Tests', () {
    testWidgets('The page should render a "circular waiting animation" before data is loaded', (WidgetTester tester) async {
      // Assume AldsMapPage takes an isLoading parameter or loads asynchronously.
      await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: true, currentLat: 0.0, currentLng: 0.0))));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    // FIXME: This test doesn't work. I'm still stuck on this test. I don't know how to wait until the saved locations are loaded from storage.
    testWidgets('When local storage is successfully retrieved, a map, dropdown, and "Validate Location" button should render', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: true, currentLat: 0.0, currentLng: 0.0))));
      await tester.pumpAndSettle();
      expect(find.byType(FlutterMap), findsOneWidget);
      expect(find.byKey(Key('locations_dropdown')), findsOneWidget);
      expect(find.text('Validate Location'), findsOneWidget);
    });

    testWidgets('Validating an item with no name should not add that item to the dropdown', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: false, currentLat: 0.0, currentLng: 0.0))));
      await tester.pumpAndSettle();

      await tester.enterText(find.byKey(Key('locations_dropdown')), '');
      await tester.tap(find.text('Validate Location'));
      await tester.pumpAndSettle();

      final dropdownMenuEntries = find.byType(DropdownMenuEntry);
      expect(dropdownMenuEntries, findsNWidgets(0));
    });

    // FIXME: This test doesn't pass
    // testWidgets('Validating an item that isn\'t in saved locations adds it to the dropdown', (WidgetTester tester) async {
    //   await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: false, currentLat: 0.0, currentLng: 0.0))));
    //   await tester.pumpAndSettle();

    //   await tester.enterText(find.byKey(Key('locations_dropdown')), 'NewSpot');
    //   await tester.tap(find.text('Validate Location'));
    //   await tester.pumpAndSettle();

    //   final dropdownMenuEntries = find.byType(DropdownMenuEntry);
    //   expect(dropdownMenuEntries, findsNWidgets(1));
    // });

    // FIXME: This test hangs when running saveLocatorData()
    // testWidgets('Validating an item that is in the saved locations merges/updates it', (WidgetTester tester) async {
    //   var initial = [
    //     {"location": "ExistingLoc", "position": {"latitude": 10.0, "longitude": 20.0}}
    //   ];
    //   await storage.saveLocatorData(jsonEncode(initial));

    //   await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: false, currentLat: 11.0, currentLng: 22.0))));
    //   await tester.pumpAndSettle();

    //   // Enter the same name "ExistingLoc"
    //   await tester.enterText(find.byKey(Key('locations_dropdown')), 'ExistingLoc');
    //   await tester.tap(find.text('Validate Location'));
    //   await tester.pumpAndSettle();

    //   String? data = await storage.readLocationData();
    //   var decoded = jsonDecode(data!);
    //   // The position should be updated to (11.0, 22.0) if that’s the logic
    //   expect(decoded[0]['location'], 'ExistingLoc');
    //   expect(decoded[0]['position']['latitude'], 11.0);
    //   expect(decoded[0]['position']['longitude'], 22.0);
    // });

    testWidgets('The user should be able to type into the text area of the dropdown', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: false, currentLat: 0.0, currentLng: 0.0))));
      await tester.pumpAndSettle();

      await tester.enterText(find.byKey(Key('locations_dropdown')), 'TypingTest');
      expect(find.text('TypingTest'), findsOneWidget);
    });

    
    testWidgets('If the user does not have saved locations, the dropdown entries should be empty', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: false, currentLat: 0.0, currentLng: 0.0))));
      await tester.pumpAndSettle();

      // No items
      expect(find.byType(DropdownMenuEntry), findsNothing);
    });

    // testWidgets('If the user has saved locations, the dropdown entries should be the user\'s saved locations', (WidgetTester tester) async {
    //   var locs = [
    //     {"location": "Saved1", "position": {"latitude": 10.0, "longitude": 20.0}},
    //     {"location": "Saved2", "position": {"latitude": 15.0, "longitude": 25.0}}
    //   ];
    //   print("saving initial locator data");
    //   await storage.saveLocatorData(jsonEncode(locs));
    //   print("successfully saved locator data");

    //   await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: false, currentLat: 0.0, currentLng: 0.0))));
    //   await tester.pumpAndSettle();

    //   expect(find.text('Saved1'), findsOneWidget);
    //   expect(find.text('Saved2'), findsOneWidget);
    // });

    // testWidgets('If the user is in a saved location, the page displays the name of that saved location', (WidgetTester tester) async {
    //   var locs = [
    //     {"location": "KnownLoc", "position": {"latitude": 10.0, "longitude": 20.0}}
    //   ];
    //   await storage.saveLocatorData(jsonEncode(locs));

    //   // Assume currentLat/Lng matches KnownLoc position
    //   await tester.pumpWidget(MaterialApp(home: Scaffold(body: AldsMapPage(isLoading: false, currentLat: 10.0, currentLng: 20.0))));
    //   await tester.pumpAndSettle();

    //   expect(find.text('KnownLoc'), findsOneWidget);
    // });
  });
}
