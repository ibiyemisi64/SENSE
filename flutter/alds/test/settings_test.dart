import 'dart:convert';
import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:alds/settingspage.dart'; // Hypothetical
import 'package:alds/storage.dart' as storage;

void main() {
  late Directory testDir;

  setUpAll(() {
    TestWidgetsFlutterBinding.ensureInitialized();
    testDir = Directory.systemTemp.createTempSync();
  });

  setUp(() async {
    await storage.setupTestStorage(testDir.path);
    await storage.saveLocatorData(jsonEncode([]));
  });

  tearDownAll(() async {
    await Hive.close();
    testDir.deleteSync(recursive: true);
  });

  group('Settings Page Tests', () {

  //   testWidgets('An option for theme selection appears, with a dropdown to select between System, Light, and Dark modes', (WidgetTester tester) async {
  //     await tester.pumpWidget(ProviderScope(child: MaterialApp(home: Scaffold(body: AldsSettingsPage()))));

  //     final themeDropdown = find.byKey(Key("theme_dropdown"));
  //     expect(themeDropdown, findsOneWidget);

  //     // Expand dropdown
  //     await tester.tap(themeDropdown);
  //     await tester.pumpAndSettle();

  //     expect(find.text('System'), findsOneWidget);
  //     expect(find.text('Light'), findsOneWidget);
  //     expect(find.text('Dark'), findsOneWidget);
  // });

  //   testWidgets('Toggling the system settings to each of the modes works (Light, Dark, System)', (WidgetTester tester) async {
  //     await tester.pumpWidget(ProviderScope(child: MaterialApp(home: Scaffold(body: AldsSettingsPage()))));
      
  //     final themeDropdown = find.byKey(Key("theme_dropdown"));
  //     expect(themeDropdown, findsOneWidget);

  //     // Light
  //     await tester.tap(themeDropdown);
  //     await tester.pumpAndSettle();
  //     await tester.tap(find.text('Light').last);
  //     await tester.pumpAndSettle();
  //     expect(storage.readThemePref(), 'Light');

  //     // Dark
  //     await tester.tap(themeDropdown);
  //     await tester.pumpAndSettle();
  //     await tester.tap(find.text('Dark').last);
  //     await tester.pumpAndSettle();
  //     expect(storage.readThemePref(), 'Dark');

  //     // System
  //     await tester.tap(themeDropdown);
  //     await tester.pumpAndSettle();
  //     await tester.tap(find.text('System').last);
  //     await tester.pumpAndSettle();
  //     expect(storage.readThemePref(), 'System');
  //   });
  });
}
