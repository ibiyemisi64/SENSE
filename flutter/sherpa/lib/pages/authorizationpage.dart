/*
 *        autorizationpage.dart
 *
 *    top-level interface to Catre models
 *
 **/
/*      Copyright 2023 Brown University -- Steven P. Reiss                      */
/// *******************************************************************************
///  Copyright 2023, Brown University, Providence, RI.                           *
///                                                                              *
///                       All Rights Reserved                                    *
///                                                                              *
///  Permission to use, copy, modify, and distribute this software and its       *
///  documentation for any purpose other than its incorporation into a           *
///  commercial product is hereby granted without fee, provided that the         *
///  above copyright notice appear in all copies and that both that              *
///  copyright notice and this permission notice appear in supporting            *
///  documentation, and that the name of Brown University not be used in         *
///  advertising or publicity pertaining to distribution of the software         *
///  without specific, written prior permission.                                 *
///                                                                              *
///  BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS               *
///  SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND           *
///  FITNESS FOR ANY PARTICULAR PURPOSE.  IN NO EVENT SHALL BROWN UNIVERSITY     *
///  BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY         *
///  DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,             *
///  WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS              *
///  ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE         *
///  OF THIS SOFTWARE.                                                           *
///                                                                              *
///*******************************************************************************/

import 'package:flutter/material.dart';
import 'package:sherpa/widgets.dart' as widgets;
import 'package:sherpa/models/catremodel.dart';

class SherpaAuthorizeWidget extends StatefulWidget {
  final CatreUniverse _theUniverse;

  const SherpaAuthorizeWidget(this._theUniverse, {super.key});

  @override
  State<SherpaAuthorizeWidget> createState() => _SherpaAuthorizeWidgetState();
}

class _SherpaAuthorizeWidgetState extends State<SherpaAuthorizeWidget> {
  late CatreUniverse _theUniverse;
  CatreBridge? _bridgeData;
  String? _curBridge;

  _SherpaAuthorizeWidgetState();

  @override
  void initState() {
    _theUniverse = widget._theUniverse;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Configure Device Bridges"),
      ),
      body: widgets.sherpaPage(
        context,
        Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  const Text(
                    "Configure Bridge:   ",
                    style: TextStyle(
                        fontWeight: FontWeight.bold, color: Colors.brown),
                  ),
                  widgets.fieldSeparator(),
                  Expanded(child: _createBridgeSelector()),
                ],
              ),
              ..._getBridgeAuthorizations(),
              widgets.fieldSeparator(),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: <Widget>[
                  widgets.submitButton(
                    "Accept",
                    _saveAction,
                    enabled: _isActionValid(),
                  ),
                  widgets.submitButton("Cancel", _revertAction),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _createBridgeSelector() {
    List<String> names = _theUniverse.getBridgeNames();
    _curBridge ??= names[0];
    _bridgeData = _theUniverse.getBridge(_curBridge as String);
    return widgets.dropDownWidget<String>(
      _theUniverse.getBridgeNames(),
      onChanged: _bridgeSelected,
      value: _curBridge,
    );
  }

  Future<void> _bridgeSelected(String? value) async {
    if (value == null) return;
    setState(() {
      _curBridge = value;
      _bridgeData = _theUniverse.getBridge(value);
    });
  }

  List<Widget> _getBridgeAuthorizations() {
    if (_bridgeData == null || _bridgeData!.isSingle()) {
      return _getBridgeFields();
    }
    List<Widget> rslt = [];
    int count = _bridgeData!.getCount();
    for (int i = 0; i <= count; ++i) {
      List<Widget> wl1 = _getBridgeFields(index: i);
      Widget w2 = widgets.boxWidgets(wl1, width: 4);
      rslt.add(w2);
    }

    return rslt;
  }

  List<Widget> _getBridgeFields({int index = -1}) {
    List<Widget> rslt = [];
    if (_bridgeData != null) {
      List<CatreBridgeField> flds = _bridgeData!.getFields();
      for (CatreBridgeField fld in flds) {
        String? v = fld.getValue(index);
        v ??= "";

        rslt.add(widgets.fieldSeparator());
        TextEditingController ctrl = TextEditingController(text: v);
        Widget w1 = widgets.textField(
          hint: fld.getHint(),
          controller: ctrl,
          onChanged: (nv) => _setBridgeFieldValue(fld, index, nv),
          showCursor: true,
        );
        rslt.add(Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            Flexible(flex: 1, child: Text("${fld.getLabel()}: ")),
            const Spacer(),
            Flexible(flex: 10, child: w1),
          ],
        ));
      }
    }
    return rslt;
  }

  void _setBridgeFieldValue(CatreBridgeField fld, int index, String v) {
    fld.setValue(index, v);
  }

  bool _isActionValid() {
    if (_bridgeData == null) return false;
    int ct = _bridgeData!.getCount();
    for (int i = 0; i < ct; ++i) {
      for (CatreBridgeField fld in _bridgeData!.getFields()) {
        String? v = fld.getValue(i);
        if (v == null || v.isEmpty) {
          if (!fld.isOptional()) return false;
        }
      }
    }
    if (ct == 0) return false;
    return true;
  }

  void _saveAction() async {
    await _bridgeData?.addOrUpdateBridge();
    setState(() {});
  }

  void _revertAction() {
    setState(() {
      _bridgeData?.revert();
    });
  }
}


/* end of module authorizationpage.dart */




