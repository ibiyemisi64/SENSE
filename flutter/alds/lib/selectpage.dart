/*
 *      selectpage.dart 
 *    
 *    Main page for specifying/viewing/selecting room
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

import 'package:flutter/material.dart';

import 'storage.dart' as storage;
import 'util.dart' as util;
import 'widgets.dart' as widgets;
import "locator.dart";

class AldsSelect extends StatelessWidget {
  const AldsSelect({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ALDS Location Selector',
      theme: util.getTheme(),
      home: const AldsSelectWidget(),
    );
  }
}

class AldsSelectWidget extends StatefulWidget {
  const AldsSelectWidget({super.key});

  @override
  State<AldsSelectWidget> createState() => _AldsSelectWidgetState();
}

class _AldsSelectWidgetState extends State<AldsSelectWidget> {
  final TextEditingController _curController = TextEditingController();

  _AldsSelectWidgetState();

  @override
  void initState() {
    super.initState();
    Locator loc = Locator();
    _curController.text = loc.lastLocation ?? "";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("ALDS Location Selector"),
          actions: [
            widgets.topMenu(_handleCommand, [
              {'ShowLoginData': 'Show/Edit Login Data'},
              {'EditLocations': 'Edit Locations'}
            ]),
          ],
        ),
        body: Center(
            child: RefreshIndicator(
                onRefresh: _handleUpdate,
                child: ListView(children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      const Text("Current Location:   "),
                      Expanded(
                          child: widgets.textField(
                              controller: _curController, readOnly: true)),
                    ],
                  ),
                  widgets.fieldSeparator(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      const Text('Alternatives:  '),
                      Expanded(child: _createLocationSelector())
                    ],
                  ),
                  widgets.submitButton("Validate", _handleValidate),
                ]))));
  }

  Widget _createLocationSelector() {
    String? cur = _curController.text;
    if (cur == '') cur = null;

    return FutureBuilder<List<String>>(
      future: storage.getLocations(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator();
        }

        if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        }

        final locations = snapshot.data ?? [];
        return widgets.searchableDropdown(
          _curController,
          locations,
          (String? value) {
            setState(() {
              _curController.text = value ?? '';
            });
          },
        );
      },
    );
  }

  Future<void> _locationSelected(String? value) async {
    util.log("SET CURRENT TO $value");
    setState(() => _curController.text = value ?? "");
  }

  void _handleCommand(String cmd) async {
    switch (cmd) {
      case "ShowLoginData":
        // FIXME: Dropdown options don't lead anywhere
        break;
      case 'EditLocations':
        // FIXME: Dropdown options don't lead anywhere
        break;
    }
  }

  void _handleValidate() async {
    String txt = _curController.text;
    Locator loc = Locator();
    loc.noteLocation(txt);
    util.log("VALIDATE location as $txt");
  }

  Future<void> _handleUpdate() async {
    Locator loc = Locator();
    String? where = await loc.findLocation();
    await _locationSelected(where);
  }
}











