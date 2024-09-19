/*
 *      actionpage.dart
 *
 *   Overview page for the viewing and editing conditions
 */
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
import 'package:sherpa/util.dart' as util;

/// ******
///   Widget definitions
/// ******

class SherpaActionWidget extends StatefulWidget {
  final CatreDevice _forDevice;
  final CatreRule _forRule;
  final CatreAction _forAction;

  const SherpaActionWidget(this._forDevice, this._forRule, this._forAction,
      {super.key});

  @override
  State<SherpaActionWidget> createState() => _SherpaActionWidgetState();
}

class _SherpaActionWidgetState extends State<SherpaActionWidget> {
  late CatreAction _forAction;
  late CatreDevice _forDevice;
  late CatreRule _forRule;

  final TextEditingController _labelControl = TextEditingController(text: "");
  final TextEditingController _descControl = TextEditingController(text: "");
  bool _labelMatchesDescription = false;

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  _SherpaActionWidgetState();

  @override
  initState() {
    _forAction = widget._forAction;
    _forDevice = widget._forDevice;
    _forRule = widget._forRule;
    _labelControl.text = _forAction.getLabel();
    _descControl.text = _forAction.getDescription();
    _labelMatchesDescription = _labelControl.text == _descControl.text;
    _labelControl.addListener(_labelListener);
    _descControl.addListener(_descriptionListener);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    String ttl = "Action Editor for ${_forDevice.getName()}";

    return Scaffold(
      appBar: AppBar(title: Text(ttl), actions: [
        widgets.topMenuAction([
          widgets.MenuAction('Accept', _saveAction),
          widgets.MenuAction('Revert', _revertAction),
        ]),
      ]),
      body: widgets.sherpaPage(
        context,
        Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              widgets.fieldSeparator(),
              _actionLabel(),
              widgets.fieldSeparator(),
              _actionDescription(),
              widgets.fieldSeparator(),
              _transitionSelector(),
              ..._createParameterWidgets(),
              // add parameter widgets
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

  Widget _actionLabel() {
    return widgets.textFormField(
      hint: "Descriptive label for action",
      label: "Action Label",
      onChanged: _setLabel,
      controller: _labelControl,
    );
  }

  Widget _actionDescription() {
    return widgets.textFormField(
        hint: "Detailed action description",
        label: "Action Description",
        controller: _descControl,
        onChanged: _setDescription,
        maxLines: 3);
  }

  Widget _transitionSelector() {
    List<CatreTransition> trns = findValidTransitions();

    return widgets.dropDownWidget(
      trns,
      labeler: (CatreTransition tr) => tr.getLabel(),
      value: _forAction.getTransition(),
      onChanged: _setTransition,
      label: "${_forDevice.getName()}: Action",
    );
  }

  List<CatreTransition> findValidTransitions() {
    bool trig = _forRule.isTrigger();

    List<CatreTransition> rslt = [];
    for (CatreTransition ct in _forDevice.getTransitions()) {
      String typ = ct.getTransitionType();
      switch (typ) {
        case "STATE_CHANGE":
        case "TEMPORARY_CHANGE":
          if (trig) continue;
          break;
        case "TRIGGER":
          if (!trig) continue;
          break;
      }
      rslt.add(ct);
    }

    return rslt;
  }

  List<Widget> _createParameterWidgets() {
    List<Widget> rslt = [];
    List<_ActionParameter> sensors = getParameters();
    for (_ActionParameter ap in sensors) {
      Widget? w1 = ap.getValueWidget(context);
      if (w1 != null) {
        rslt.add(widgets.fieldSeparator());
        if (ap.needsLabel()) {
          rslt.add(Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Flexible(flex: 1, child: Text("${ap.name}: ")),
              const Spacer(),
              Flexible(flex: 10, child: w1),
            ],
          ));
        } else {
          rslt.add(Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              const Spacer(),
              Flexible(flex: 10, child: w1),
            ],
          ));
        }
      }
    }
    return rslt;
  }

  List<_ActionParameter> getParameters() {
    List<_ActionParameter> plst = [];
    if (!_forAction.isValid()) return plst;
    CatreTransition ct = _forAction.getTransition();
    for (CatreParameter cp in ct.getParameters()) {
      plst.add(_ActionParameter(_forAction, cp));
    }
    return plst;
  }

  void _setLabel(String? v) {
    if (v != null) {
      setState(() {
        _forAction.setLabel(v);
      });
    }
  }

  void _setDescription(String? v) {
    if (v != null) {
      setState(() {
        _forAction.setDescription(v);
      });
    }
  }

  void _setTransition(CatreTransition? ct) {
    if (ct == null) return;
    setState(() {
      _forAction.setTransition(ct);
    });
  }

  void _labelListener() {
    if (_labelMatchesDescription) {
      _descControl.text = _labelControl.text;
    }
  }

  void _descriptionListener() {
    if (_labelMatchesDescription) {
      if (_labelControl.text != _descControl.text) {
        _labelMatchesDescription = false;
      }
    }
  }

  bool _isActionValid() {
    _forAction.setLabel(_labelControl.text);
    _forAction.setName(_labelControl.text);
    _forAction.setDescription(_descControl.text);
    if (_labelControl.text.isEmpty) return false;
    if (_labelControl.text.startsWith('Undefined')) return false;
    if (_descControl.text.isEmpty) return false;
    if (_descControl.text.startsWith('Undefined')) return false;
    // might want other checks here if we don't ensure validity in the setXXX methods
    return true;
  }

  void _saveAction() {
    setState(() {
      _forAction.push();
      Navigator.pop(context);
    });
  }

  void _revertAction() {
    setState(() {
      if (!_forAction.pop()) _forAction.revert();
    });
  }
}

class _ActionParameter {
  final CatreAction _action;
  final CatreParameter _parameter;
  const _ActionParameter(this._action, this._parameter);

  String get name {
    return _parameter.getLabel();
  }

  dynamic get value {
    return _action.getValue(_parameter);
  }

  bool needsLabel() {
    switch (_parameter.getParameterType()) {
      case "TIME":
      case "DATE":
      case "INTEGER":
      case "REAL":
      case "STRING":
        return false;
    }
    return true;
  }

  Widget? getValueWidget(BuildContext context) {
    Widget? w;
    dynamic value = _action.getValue(_parameter);
    switch (_parameter.getParameterType()) {
      case "BOOLEAN":
      case "ENUM":
      case "STRINGLIST":
      case "ENUMREF":
        List<String>? vals = _parameter.getValues();
        if (vals != null && vals.isNotEmpty) {
          value ??= vals[0];
          w = widgets.dropDownWidget(
            vals,
            value: value,
            onChanged: _setValue,
          );
        }
        break;
      case "TIME":
        widgets.TimeFormField tff = widgets.TimeFormField(
          context,
          hint: name,
          onChanged: _setValue,
        );
        w = tff.widget;
        break;
      case "DATETIME":
        break;
      case "DATE":
        widgets.DateFormField dff = widgets.DateFormField(
          context,
          hint: name,
          initialDate: value,
          onChanged: _setValue,
        );
        w = dff.widget;
        break;
      case "INTEGER":
        int vint = util.getIntValue(value, _parameter.getMinValue());
        w = widgets.integerField(
            min: _parameter.getMinValue().toInt(),
            max: _parameter.getMaxValue().toInt(),
            value: vint,
            label: name,
            onChanged: _setValue);
        break;
      case "REAL":
        double vdbl = util.getDoubleValue(value, _parameter.getMaxValue());
        w = widgets.doubleField(
            min: _parameter.getMinValue().toDouble(),
            max: _parameter.getMaxValue().toDouble(),
            value: vdbl,
            decimals: 1,
            label: name,
            onChanged: _setValue);
        break;
      case "STRING":
        String? v = value?.toString();
        TextEditingController ctrl = TextEditingController(text: v);
        w = widgets.textField(
          hint: "Value for $name",
          controller: ctrl,
          onChanged: _setValue,
          showCursor: true,
        );
        break;
    }

    return w;
  }

  void _setValue(dynamic val) {
    _action.setValue(_parameter, val);
  }
}

