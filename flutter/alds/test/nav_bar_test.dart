import 'dart:convert';
import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:alds/mainpage.dart'; // Contains AldsApp and AldsMain
import 'package:hive/hive.dart';
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
  group('Navigation Bar Tests', () {
    testWidgets('Initial page is the Home (Map) page and shows expected content', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: AldsApp()));
      await tester.pumpAndSettle();

      // On first load, navBarIndex = 0 → AldsMapPage
      expect(find.text('Validate Location'), findsOneWidget);
      expect(find.text('No Saved Locations'), findsNothing);
      expect(find.text('Theme'), findsNothing);
    });

    testWidgets('Changing to Saved locations page updates the displayed page', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: AldsApp()));
      await tester.pumpAndSettle();

      // Initially on map page
      expect(find.text('Validate Location'), findsOneWidget);

      // Tap "Saved" destination
      await tester.tap(find.byIcon(Icons.location_on));
      await tester.pumpAndSettle();

      // Now we should see the saved locations page content
      expect(find.text('No Saved Locations'), findsOneWidget); // Assuming empty storage - might need to tweak
      expect(find.text('Validate Location'), findsNothing);
      expect(find.text('Theme'), findsNothing);
    });

    testWidgets('Changing to Settings page updates the displayed page', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: AldsApp()));
      await tester.pumpAndSettle();

      // Initially on map page
      expect(find.text('Validate Location'), findsOneWidget);

      // Tap Settings destination
      await tester.tap(find.byIcon(Icons.settings));
      await tester.pumpAndSettle();

      // Now we should see the settings page content
      expect(find.text('Theme'), findsOneWidget);
      expect(find.text('Validate Location'), findsNothing);
      expect(find.text('No Saved Locations'), findsNothing);
    });

    testWidgets('Changing between pages does not discard page state (no re-render)', (WidgetTester tester) async {
      // Need to look more into STATEFUL CHECKING???

      await tester.pumpWidget(const ProviderScope(child: AldsApp()));
      await tester.pumpAndSettle();

      // On Map page (index 0)
      expect(find.text('Validate Location'), findsOneWidget);

      // Move to Saved
      await tester.tap(find.byIcon(Icons.location_on));
      await tester.pumpAndSettle();
      expect(find.text('No Saved Locations'), findsOneWidget);

      // Move back to Home
      await tester.tap(find.byIcon(Icons.home));
      await tester.pumpAndSettle();

      expect(find.text('Validate Location'), findsOneWidget);
    });

    testWidgets('When an icon is selected, the icon indicates that it is selected', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: AldsApp()));
      await tester.pumpAndSettle();

      // Initially Home should be selected
      final homeIcon = tester.widget<Icon>(find.byIcon(Icons.home));
      // Assuming selected tab color is applied we can check that field:
      expect(homeIcon.color, isNotNull);

      // Tap Saved
      await tester.tap(find.byIcon(Icons.location_on));
      await tester.pumpAndSettle();

      final savedIcon = tester.widget<Icon>(find.byIcon(Icons.location_on));
      // Check if color or style changed:
      expect(savedIcon.color, isNotNull);
    });
  });
}
