/*
 *        editsignpage.dart
 * 
 *    Page for editing a sign
 * 
 */

import 'signdata.dart';
import 'package:http/http.dart' as http;
import 'dart:convert' as convert;
import 'package:flutter/material.dart';
import 'globals.dart' as globals;
import 'widgets.dart' as widgets;
import 'package:url_launcher/url_launcher.dart';
import 'setnamedialog.dart' as setname;

class IQSignSignEditWidget extends StatelessWidget {
  final SignData _signData;
  final List<String> _signNames;

  const IQSignSignEditWidget(this._signData, this._signNames, {super.key});

  @override
  Widget build(BuildContext context) {
    return IQSignSignEditPage(_signData, _signNames);
  }
}

class IQSignSignEditPage extends StatefulWidget {
  final SignData _signData;
  final List<String> _signNames;

  const IQSignSignEditPage(this._signData, this._signNames, {super.key});

  @override
  State<IQSignSignEditPage> createState() => _IQSignSignEditPageState();
}

class _IQSignSignEditPageState extends State<IQSignSignEditPage> {
  SignData _signData = SignData.unknown();
  List<String> _signNames = [];
  List<String> _knownNames = [];
  final TextEditingController _controller = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  bool _replace = false;
  late TextField _nameField;

  _IQSignSignEditPageState();

  @override
  void initState() {
    _signData = widget._signData;
    _knownNames = widget._signNames;
    _signNames = ['Current Sign', ...widget._signNames];
    _nameController.text = _signData.getDisplayName();
    _controller.text = _signData.getSignBody();
    _replace = _knownNames.contains(_signData.getDisplayName());
    _nameField = widgets.textField(
        label: "SignName",
        controller: _nameController,
        onChanged: _nameChanged);
    super.initState();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("iQsign Sign ${_signData.getName()}"),
        actions: [
          widgets.topMenu(_handleCommand, [
            {'MyImages': "Browse My Images"},
            {'FAImages': "Browse Font Awesome Images"},
            {'SVGImages': "Browse Image Library"},
            {'EditSize': "Change Sign Size"},
            {'ChangeName': "Change Sign Name"},
            {'AddImage': "Add New Image to Image Library"},
          ]),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            widgets.textField(
              controller: _controller,
              maxLines: 8,
              showCursor: true,
            ),
            widgets.fieldSeparator(),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
              const Text("Start with:      "),
              Expanded(child: _createNameSelector(val: 'Current Sign')),
            ]),
            widgets.fieldSeparator(),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
              Text(_replace ? "Replace Sign: " : "Create Sign: "),
              Expanded(child: _nameField),
            ]),
            widgets.submitButton("Update", _handleUpdate),
            Image.network(_signData.getImageUrl()),
          ],
        ),
      ),
    );
  }

  void _handleCommand(String cmd) async {
    switch (cmd) {
      case "MyImages":
        var uri = Uri.https("sherpa.cs.brown.edu:3336", "/rest/savedimages",
            {'session': globals.sessionId});
        await _launchURI(uri);
        break;
      case "FAImages":
        await _launchURL("https://fontawesome.com/search?m=free&s=solid");
        break;
      case "SVGImages":
        var uri1 = Uri.https("sherpa.cs.brown.edu:3336", "/rest/svgimages",
            {'session': globals.sessionId});
        await _launchURI(uri1);
        break;
      case "AddImage":
        break;
      case "EditSize":
        break;
      case "ChangeName":
        setname.setNameDialog(context, _signData).then((String nm) {
          if (nm != _signData.getName()) {
            setState(() {
              _signData.setName(nm);
            });
          }
        });
        break;
    }
  }

  Widget _createNameSelector({String? val}) {
    val ??= _signData.getDisplayName();
    return DropdownButton<String>(
      items: _signNames.map<DropdownMenuItem<String>>((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value),
        );
      }).toList(),
      onChanged: (String? value) async {
        if (value != null) await _setSignToSaved(value);
      },
      value: val,
    );
  }

  Future _setSignToSaved(String name) async {
    if (name == "Current Sign") name = "*Current*";
    var url = Uri.https(
      'sherpa.cs.brown.edu:3336',
      "/rest/loadsignimage",
    );
    var resp = await http.post(url, body: {
      'session': globals.sessionId,
      'signname': name,
      'signid': _signData.getSignId().toString(),
    });
    var js = convert.jsonDecode(resp.body) as Map<String, dynamic>;
    if (js['status'] == "OK") {
      String cnts = js['contents'] as String;
      String sname = js['name'] as String;
      setState(() => {_updateText(sname, cnts)});
    }
  }

  void _updateText(String name, String cnts) {
    _nameController.text = name;
    _controller.text = cnts;
  }

  Future _saveSignImage(String name) async {
    var url = Uri.https(
      'sherpa.cs.brown.edu:3336',
      "/rest/savesignimage",
    );
    var resp = await http.post(url, body: {
      'session': globals.sessionId,
      'name': name,
      'signid': _signData.getSignId().toString(),
      'signnamekey': _signData.getNameKey(),
      'signuser': _signData.getSignUserId().toString(),
    });
    var js = convert.jsonDecode(resp.body) as Map<String, dynamic>;
    if (js['status'] != "OK") {
      // handle errors here
    }
  }

  void _handleUpdate() async {
    await _handleUpdateWork();
    setState(() => {
          () {
            _signData.getImageUrl();
          }
        });
  }

  Future _handleUpdateWork() async {
    String name = _nameController.text;
    String cnts = _controller.text;
    if (cnts == "") return;
    _signData.setContents(cnts);
    _signData.setDisplayName(name);
    if (name != '' && !_knownNames.contains(name)) {
      _knownNames.add(name);
    }
    await _updateSign();
    if (name != '') {
      await _saveSignImage(name);
    }
  }

  Future _updateSign() async {
    var url = Uri.https(
      'sherpa.cs.brown.edu:3336',
      "/rest/sign/${_signData.getSignId()}/update",
    );
    var resp = await http.post(url, body: {
      'session': globals.sessionId,
      'signname': _signData.getName(),
      'signid': _signData.getSignId().toString(),
      'signkey': _signData.getNameKey(),
      'signuser': _signData.getSignUserId().toString(),
      'signwidth': _signData.getWidth().toString(),
      'signheight': _signData.getHeight().toString(),
      'signdim': _signData.getDimension(),
      'signdata': _signData.getSignBody(),
    });
    var js = convert.jsonDecode(resp.body) as Map<String, dynamic>;
    if (js['status'] != "OK") {
      // handle errors here
    }
  }

  Future _launchURL(String url) async {
    Uri uri = Uri.parse(url);
    await _launchURI(uri);
  }

  Future _launchURI(Uri uri) async {
    if (!await launchUrl(uri)) {
      throw "Could not launch $uri";
    }
  }

  void _nameChanged(String val) {
    bool kn = false;
    if (val != "") {
      kn = _knownNames.contains(val);
    }
    if (kn != _replace) {
      setState(() => _replace = kn);
    }
  }
}
