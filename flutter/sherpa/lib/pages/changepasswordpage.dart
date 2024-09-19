/*
 * Change Password Page
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
import 'package:http/http.dart' as http;
import 'dart:convert' as convert;
import 'package:sherpa/globals.dart' as globals;
import 'package:sherpa/util.dart' as util;
import 'package:sherpa/widgets.dart' as widgets;
import 'package:sherpa/models/catremodel.dart';
import 'splashpage.dart';

class SherpaChangePasswordWidget extends StatefulWidget {
  final CatreUniverse _theUniverse;

  const SherpaChangePasswordWidget(this._theUniverse, {super.key});

  @override
  State<SherpaChangePasswordWidget> createState() =>
      _SherpaChangePasswordWidgetState();
}

class _SherpaChangePasswordWidgetState
    extends State<SherpaChangePasswordWidget> {
  late CatreUniverse _theUniverse;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String? _curPassword;
  late String _changePasswordError;

  _SherpaChangePasswordWidgetState() {
    _curPassword = null;
    _changePasswordError = '';
  }

  @override
  void initState() {
    _theUniverse = widget._theUniverse;
    super.initState();
  }

  Future<String?> _changePassword() async {
    String usr = _theUniverse.getUserId();
    String pwd = (_curPassword as String);
    String p1 = util.hasher(pwd);
    String p2 = util.hasher(p1 + usr);

    var body = {
      globals.catreSession: globals.sessionId,
      'password': p2,
    };
    var url = Uri.https(util.getServerURL(), "/changePassword");
    var resp = await http.post(url, body: body);
    var jresp = convert.jsonDecode(resp.body) as Map<String, dynamic>;
    if (jresp['status'] == "OK") return null;
    return jresp['message'];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Change Password"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Image.asset(
                    "assets/images/sherpaimage.png",
                    width: MediaQuery.of(context).size.width * 0.5,
                    height: MediaQuery.of(context).size.width * 0.2,
                  ),
                  const Padding(
                    padding: EdgeInsets.all(16.0),
                  ),
                  widgets.textFormField(
                    hint: "Password",
                    label: "New Password",
                    validator: _validatePassword,
                    obscureText: true,
                    context: context,
                    fraction: 0.8,
                  ),
                  widgets.fieldSeparator(),
                  widgets.textFormField(
                    hint: "Confirm Password",
                    label: "Confirm New Passwrd",
                    validator: _validateConfirmPassword,
                    obscureText: true,
                    context: context,
                    fraction: 0.8,
                  ),
                  widgets.fieldSeparator(),
                  widgets.errorField(_changePasswordError),
                  Container(
                    constraints:
                        const BoxConstraints(minWidth: 150, maxWidth: 350),
                    width: MediaQuery.of(context).size.width * 0.4,
                    child:
                        widgets.submitButton("Submit", _handleChangePassword),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleChangePassword() async {
    setState(() {
      _changePasswordError = '';
    });
    if (_formKey.currentState!.validate()) {
      String? rslt = await _changePassword();
      if (rslt != null) {
        setState(() {
          _changePasswordError = rslt;
        });
      } else {
        _gotoHome();
      }
    }
  }

  String? _validateConfirmPassword(String? value) {
    if (value != _curPassword) {
      return "Passwords must match";
    }
    return null;
  }

  String? _validatePassword(String? value) {
    _curPassword = value;
    if (value == null || value.isEmpty) {
      return "Password must not be null";
    } else if (!util.validatePassword(value)) {
      return "Invalid password";
    }
    return null;
  }

  void _gotoHome() {
    widgets.goto(context, const SplashPage());
  }
}

