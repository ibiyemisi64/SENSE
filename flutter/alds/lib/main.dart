/*
 * main.dart
 *
 * Purpose:
 *   Entry point for the ALDS (Automatic Location Detection System) Flutter application.
 *   Initializes necessary services, sets up periodic tasks, and handles phone state changes.
 *
 * Copyright 2024 Brown University -- Michael Tu and Kelsie Edie
 *
 * All Rights Reserved
 *
 * Permission to use, copy, modify, and distribute this software and its
 * documentation for any purpose other than its incorporation into a
 * commercial product is hereby granted without fee, provided that the
 * above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Brown University not be used in
 * advertising or publicity pertaining to distribution of the software
 * without specific, written prior permission.
 *
 * BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR ANY PARTICULAR PURPOSE. IN NO EVENT SHALL BROWN UNIVERSITY
 * BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 */

library alds.main;

// ALDS Dart Files
import 'storage.dart' as storage;
import 'globals.dart' as globals;
import 'recheck.dart' as recheck;
import 'device.dart' as device;
import 'util.dart' as util;
import 'locator.dart' as alds_loc;
import 'mainpage.dart';

// Dart Packages 
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:phone_state/phone_state.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  initialize(false);
  runApp(ProviderScope(child: AldsApp()));
}

/// Initializes the application by setting up utilities, storage, locator,
/// periodic tasks, and phone state listeners.
void initialize(bool flag) async {
  await util.setup();
  await storage.setupStorage();
  util.log("STORAGE INITIALIZED");
  
  await recheck.initialize();
  
  alds_loc.Locator loc = alds_loc.Locator();
  await loc.setup();

  Timer.periodic(
      const Duration(seconds: globals.recheckEverySeconds), _handleRecheck);
  Timer.periodic(
      const Duration(seconds: globals.pingEverySeconds), _handleDevice);

  PhoneState.stream.forEach(handlePhoneStream);
  util.log("MAIN INITIALIZED");
}

/// Handles periodic recheck tasks.
void _handleRecheck(Timer timer) async {
  await recheck.recheck();
}

/// Handles periodic device ping tasks.
///
/// Note: This is where user/device registration occurs.
void _handleDevice(Timer timer) async {
  device.Cedes cedes = device.Cedes();
  await cedes.ping();
}

/// Processes incoming phone state changes.
///
/// Updates the device state based on call status.
void handlePhoneStream(PhoneState state) {
  PhoneStateStatus sts = state.status;

  switch (sts) {
    case PhoneStateStatus.CALL_STARTED:
      device.Cedes().updatePhoneState(true);
      break;
    case PhoneStateStatus.CALL_ENDED:
      device.Cedes().updatePhoneState(false);
      break;
    case PhoneStateStatus.CALL_INCOMING:
    case PhoneStateStatus.NOTHING:
      // No action required for incoming calls or no activity.
      break;
  }
}
