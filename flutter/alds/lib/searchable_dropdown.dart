import 'dart:convert';

import 'package:flutter/material.dart';
import 'util.dart' as util;
import 'storage.dart' as storage;

class SearchableDropdown extends StatefulWidget {
  const SearchableDropdown({super.key});

  @override
  State<StatefulWidget> createState() => _SearchableDropDownState();
}

class _SearchableDropDownState extends State<SearchableDropdown> {
  final TextEditingController _controller = TextEditingController();
  String? selectedLocation;
  List<String> locations = [];
  late bool _isLoading;

  @override
  void initState() {
    super.initState();

    // Initial state
    // storage.mockLocationData();
    _isLoading = true;
    _getSavedLocations();
  }

  Future<void> _getSavedLocations() async {
    await storage.mockLocationData();
    String? locDataJson = await storage.readLocationData();
    if (locDataJson != null) {
      try {
        List<dynamic> locDataParsed = List<dynamic>.from(jsonDecode(locDataJson));
        setState(() {
          locations = locDataParsed.map((locData) => locData['location'] as String).toList();
          _isLoading = false;
        });
      } catch (e) {
        util.log("Error parsing location data: $e");
        setState(() {
          locations = [];
          _isLoading = false;
        });
      }
    } else {
      setState(() {
        locations = [];
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // If still fetching data, show loading indicator
    if (_isLoading) {
      return const CircularProgressIndicator();
    }

    // Build this widget when the data is finishing loading
    return DropdownMenu<String>(
      controller: _controller,
      enableFilter: true,
      requestFocusOnTap: true,
      leadingIcon: Icon(Icons.location_on),
      label: const Text("Location"),
      inputDecorationTheme: const InputDecorationTheme(
        filled: true, 
        contentPadding: EdgeInsets.symmetric(vertical: 5.0),
      ),
      onSelected: (String? value) => {
        setState(() => selectedLocation = value)
      },
      dropdownMenuEntries: _createMenuEntries(locations),
    );
  }

  List<DropdownMenuEntry<String>> _createMenuEntries(List<String> locations) {
    return locations.map((String loc) => DropdownMenuEntry<String>(value: loc, label: loc)).toList();
  }
}