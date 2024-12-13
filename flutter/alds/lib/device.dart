/*
 *      device.dart
 * 
 *    Talk to CATRE as a device
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

library alds.device;

import 'storage.dart' as storage;
import 'dart:convert' as convert;
import 'util.dart' as util;
import 'globals.dart' as globals;
import 'package:http/http.dart' as http;
import 'package:mutex/mutex.dart';
import 'locator.dart';

const String noAuth = '*';

class Cedes {
  static final Cedes _cedes = Cedes._internal();

  factory Cedes() {
    return _cedes;
  }
  Cedes._internal();

  String _authCode = noAuth;
  final _doingPing = Mutex();
  DateTime _nextTime = DateTime.fromMillisecondsSinceEpoch(0);
  String? _lastLoc;
  bool _lastPhone = false;

  Future<void> ping() async {
    await _doingPing.acquire();
    try {
      if (_authCode == noAuth) {
        if (DateTime.now().isAfter(_nextTime)) {
          await _setup();
        } else {
          return;
        }
      }
      if (_authCode != noAuth) {
        storage.AuthData ad = storage.getAuthData();
        Map<String, dynamic>? resp =
            await _sendToCedes('ping', {"uid": ad.userId});
        String sts = "FAIL";
        if (resp != null) sts = resp["status"] ?? "FAIL";
        switch (sts) {
          case "DEVICES":
            await _sendDeviceInfo();
            break;
          case "COMMAND":
            break;
          case "OK":
            break;
          default:
            _authCode = noAuth;
            break;
        }
      }
      _nextTime = DateTime.now()
          .add(const Duration(seconds: globals.accessEverySeconds));
    } finally {
      _doingPing.release();
    }
    if (_authCode != noAuth && _lastLoc == null) {
      Locator loc = Locator();
      String? lloc = loc.lastLocation;
      if (lloc != null) updateLocation(lloc);
    }
    if (_authCode != noAuth && _lastPhone) {
      updatePhoneState(_lastPhone);
    }
  }

  Future<void> updateLocation(String loc) async {
    if (_authCode == noAuth) return;
    await _doingPing.acquire();
    try {
      await _sendToCedes("event", {
        "event": {
          "DEVICE": storage.getDeviceId(),
          "TYPE": "PARAMETER",
          "PARAMETER": "Location",
          "VALUE": loc,
        }
      });
      _lastLoc = loc;
    } finally {
      _doingPing.release();
    }
  }

  Future<void> updatePhoneState(bool onphone) async {
    if (_authCode == noAuth) return;
    await _doingPing.acquire();
    try {
      await _sendToCedes("event", {
        "event": {
          "DEVICE": storage.getDeviceId(),
          "TYPE": "PARAMETER",
          "PARAMETER": "OnPhone",
          "VALUE": onphone,
        }
      });
      _lastPhone = onphone;
    } finally {
      _doingPing.release();
    }
  }

  Future<void> _sendDeviceInfo() async {
    storage.AuthData ad = storage.getAuthData();
    Map<String, dynamic> dev = {};
    dev["UID"] = storage.getDeviceId();
    dev["NAME"] = "ALDS_${ad.userId}";
    dev["LABEL"] = "ALDS locator for ${ad.userId}";
    dev["BRIDGE"] = "generic";
    Map<String, dynamic> p0 = {
      "NAME": "Location",
      "ISSENSOR": true,
      "ISTARGET": false,
      "TYPE": "STRING"
    };
    Map<String, dynamic> p1 = {
      "NAME": "OnPhone",
      "ISSENSOR": true,
      "ISTARGET": false,
      "TYPE": "BOOLEAN",
    };
    dev["TRANSITIONS"] = [];
    dev["PARAMETERS"] = [p0, p1];
    await _sendToCedes("devices", {
      "devices": [dev]
    });
  }

  Future<void> _setup() async {
    if (_authCode != noAuth) return;
    storage.AuthData ad = storage.getAuthData();
    if (ad.userId == '*' || ad.userPass == '*') return;
    Map<String, dynamic>? attach =
        await _sendToCedes("attach", {"uid": ad.userId});
    if (attach == null) return;
    String seed = attach["seed"] ?? "*";
    if (seed == '*') return;
    String p0 = util.hasher(ad.userPass);
    String p1 = util.hasher(p0 + ad.userId);
    String p2 = util.hasher(p1 + seed);
    Map<String, dynamic>? auth =
        await _sendToCedes("authorize", {"uid": ad.userId, "patencoded": p2});
    if (auth == null) return;
    _authCode = auth["token"] ?? noAuth;
  }

  Future<Map<String, dynamic>?> _sendToCedes(String cmd, dynamic data) async {
    var url = Uri.https('sherpa.cs.brown.edu:3333', '/generic/$cmd');
    Map<String, String> headers = {};
    if (_authCode != noAuth) {
      headers['Authorization'] = "Bearer $_authCode";
    }
    headers['content-type'] = 'application/json';
    headers['accept'] = 'application/json';
    var hdata = convert.jsonEncode(data);
    var resp = await http.post(url, body: hdata, headers: headers);
    if (resp.statusCode >= 400) return null;
    var dresp = convert.jsonDecode(resp.body) as Map<String, dynamic>;
    return dresp;
  }
}











