import 'dart:convert';
import 'package:flutter/material.dart';
import 'util.dart' as util;
import 'storage.dart' as storage;

class SearchableDropdown extends StatefulWidget {
  final TextEditingController controller;
  final List<String> initialLocations;
  final Function(String?) onSelected;

  const SearchableDropdown({
    super.key,
    required this.controller,
    required this.initialLocations,
    required this.onSelected,
  });

  @override
  State<StatefulWidget> createState() => _SearchableDropDownState();
}

class _SearchableDropDownState extends State<SearchableDropdown> {
  String? selectedLocation;
  List<String> locations = [];
  late bool _isLoading;

  @override
  void initState() {
    super.initState();
    _isLoading = true;
    _getSavedLocations();
  }

  Future<void> _getSavedLocations() async {
    String? locDataJson = await storage.readLocationData();
    if (locDataJson != null) {
      try {
        List<dynamic> locDataParsed =
            List<dynamic>.from(jsonDecode(locDataJson));
        setState(() {
          locations = locDataParsed
              .map((locData) => locData['location'] as String)
              .toList();
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
    if (_isLoading) {
      return const CircularProgressIndicator();
    }

    return DropdownMenu<String>(
      controller: widget.controller,
      enableFilter: true,
      requestFocusOnTap: true,
      leadingIcon: const Icon(Icons.location_on),
      label: const Text("Location"),
      inputDecorationTheme: const InputDecorationTheme(
        filled: true,
        contentPadding: EdgeInsets.symmetric(vertical: 5.0),
      ),
      onSelected: (String? value) {
        setState(() => selectedLocation = value);
        widget.onSelected(value);
      },
      dropdownMenuEntries: _createMenuEntries(locations),
    );
  }

  List<DropdownMenuEntry<String>> _createMenuEntries(List<String> locations) {
    return locations
        .map((String loc) => DropdownMenuEntry<String>(value: loc, label: loc))
        .toList();
  }
}
