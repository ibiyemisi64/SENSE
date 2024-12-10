import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'dart:convert';

import 'package:alds/savedpage.dart';
import 'package:alds/storage.dart' as storage;

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
  group('Saved Locations Page Tests', () {
    testWidgets('If no saved locations exist, the page should display "No Saved Locations"', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();
      expect(find.text('No Saved Locations'), findsOneWidget);
    });

    testWidgets('If saved locations do exist, each saved location should appear as a card on the page', (WidgetTester tester) async {
      var testLocs = [
        {"location": "Location 1", "position": {"latitude": 10.0, "longitude": 20.0}},
        {"location": "Location 2", "position": {"latitude": 30.0, "longitude": 40.0}}
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      expect(find.byType(Card), findsNWidgets(2));
      expect(find.text('Location 1'), findsOneWidget);
      expect(find.text('Location 2'), findsOneWidget);
    });

    testWidgets('Clicking on the "3 dots" should allow the user to access "Edit" or "Delete" functionalities', (WidgetTester tester) async {
      var testLocs = [
        {"location": "Location 1", "position": {"latitude": 10.0, "longitude": 20.0}}
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.more_vert));
      await tester.pumpAndSettle();
      expect(find.text('Edit'), findsOneWidget);
      expect(find.text('Delete'), findsOneWidget);
    });

    testWidgets('User should be able to view all their existing saved locations', (WidgetTester tester) async {
      var testLocs = [
        {"location": "Loc A", "position": {"latitude": 10.0, "longitude": 20.0}},
        {"location": "Loc B", "position": {"latitude": 15.0, "longitude": 25.0}},
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      expect(find.text('Loc A'), findsOneWidget);
      expect(find.text('Loc B'), findsOneWidget);
    });

    testWidgets('Deleting a Saved Location removes the item from the list of saved locations', (WidgetTester tester) async {
      var testLocs = [
        {"location": "DeleteMe", "position": {"latitude": 10.0, "longitude": 20.0}}
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();
      expect(find.text('DeleteMe'), findsOneWidget);

      await tester.tap(find.byIcon(Icons.more_vert));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Delete'));
      await tester.pumpAndSettle();

      expect(find.text('DeleteMe'), findsNothing);
      expect(find.text('No Saved Locations'), findsOneWidget);
    });

    testWidgets('Deleting a Saved Location, then adding a new saved location shows the new item but not the deleted item', (WidgetTester tester) async {
      var testLocs = [
        {"location": "Loc1", "position": {"latitude": 10.0, "longitude": 20.0}}
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      // Delete Loc1
      await tester.tap(find.byIcon(Icons.more_vert));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Delete'));
      await tester.pumpAndSettle();
      expect(find.text('Loc1'), findsNothing);

      // Add a new location (simulate from Map Page)
      var newLoc = [
        {"location": "NewLoc", "position": {"latitude": 30.0, "longitude": 40.0}}
      ];
      await storage.saveLocatorData(jsonEncode(newLoc));

      // Rebuild widget
      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      expect(find.text('Loc1'), findsNothing);
      expect(find.text('NewLoc'), findsOneWidget);
    });

    testWidgets('Deleting a Saved Location, then updating an existing saved location updates the existing item and removes the deleted item', (WidgetTester tester) async {
      var testLocs = [
        {"location": "Loc1", "position": {"latitude": 10.0, "longitude": 20.0}},
        {"location": "Loc2", "position": {"latitude": 15.0, "longitude": 25.0}},
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      // Delete Loc1
      await tester.tap(find.byIcon(Icons.more_vert).at(0));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Delete'));
      await tester.pumpAndSettle();
      expect(find.text('Loc1'), findsNothing);

      // Update Loc2's name to Loc2Updated (simulate from Map Page)
      var data = await storage.readLocationData();
      var decoded = jsonDecode(data!);
      var idx = decoded.indexWhere((e) => e["location"] == "Loc2");
      decoded[idx]["location"] = "Loc2Updated";
      await storage.saveLocatorData(jsonEncode(decoded));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();
      expect(find.text('Loc1'), findsNothing);
      expect(find.text('Loc2Updated'), findsOneWidget);
    });

    testWidgets('Deleting a Saved Location does not change the ordering of the other items in the list (no sort applied)', (WidgetTester tester) async {
      var testLocs = [
        {"location": "LocA", "position": {"latitude": 10.0, "longitude": 20.0}},
        {"location": "LocB", "position": {"latitude": 12.0, "longitude": 22.0}},
        {"location": "LocC", "position": {"latitude": 14.0, "longitude": 24.0}},
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      // Delete LocB
      await tester.tap(find.byIcon(Icons.more_vert).at(1)); // second item
      await tester.pumpAndSettle();
      await tester.tap(find.text('Delete'));
      await tester.pumpAndSettle();

      // Now LocA and LocC remain in the same order (A then C)
      // Verify order by checking their appearance in the list
      final locAIndex = tester.getTopLeft(find.text('LocA')).dy;
      final locCIndex = tester.getTopLeft(find.text('LocC')).dy;
      expect(locAIndex < locCIndex, isTrue);
    });

    testWidgets('Editing a Saved Location edits the name of the item', (WidgetTester tester) async {
      var testLocs = [
        {"location": "OldName", "position": {"latitude": 10.0, "longitude": 20.0}}
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.more_vert));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Edit'));
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), 'NewName');
      await tester.tap(find.text('Save'));
      await tester.pumpAndSettle();

      expect(find.text('OldName'), findsNothing);
      expect(find.text('NewName'), findsOneWidget);
    });

    testWidgets('Editing a Saved Location does not change the position of the item in the saved locations list (no sort applied)', (WidgetTester tester) async {
      var testLocs = [
        {"location": "FirstLoc", "position": {"latitude": 10.0, "longitude": 20.0}},
        {"location": "SecondLoc", "position": {"latitude": 12.0, "longitude": 22.0}}
      ];
      await storage.saveLocatorData(jsonEncode(testLocs));

      await tester.pumpWidget(MaterialApp(home: AldsSavedLocationsPage()));
      await tester.pumpAndSettle();

      // Edit "FirstLoc" to "FirstLocEdited"
      await tester.tap(find.byIcon(Icons.more_vert).at(0));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Edit'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField), 'FirstLocEdited');
      await tester.tap(find.text('Save'));
      await tester.pumpAndSettle();

      // The order should remain: FirstLocEdited, SecondLoc
      final firstIndex = tester.getTopLeft(find.text('FirstLocEdited')).dy;
      final secondIndex = tester.getTopLeft(find.text('SecondLoc')).dy;
      expect(firstIndex < secondIndex, isTrue);
    });
  });
}
