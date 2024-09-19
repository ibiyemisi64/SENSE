/*
 *        signdata.dart
 * 
 *    Information and methods about a sign
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

import 'dart:math';

class SignData {
  late String _name;
  late String _displayName;
  late int _width;
  late int _height;
  late String _nameKey;
  late String _signDim;
  late String _signUrl;
  late String _imageUrl;
  late String _localImageUrl;
  late String _signBody;
  late int _signId;
  late int _signUser;

  SignData(d) {
    update(d);
  }

  SignData.unknown() {
    _name = "UNKNOWN";
    _displayName = "UNKNOWN";
    _width = 0;
    _height = 0;
    _nameKey = "";
    _signDim = "16by9";
    _signUrl = "";
    _imageUrl = "";
    _localImageUrl = "";
    _signId = 0;
    _signBody = "";
    _signUser = 0;
  }

  void update(d) {
    _name = d['name'] as String;
    _displayName = d['displayname'] as String;
    _width = d['width'] as int;
    _height = d['height'] as int;
    _nameKey = d['namekey'] as String;
    _signDim = d['dim'] as String;
    _signUrl = d['signurl'] as String;
    _imageUrl = d['imageurl'] as String;
    _localImageUrl = d['localimageurl'] as String;
    _signId = d['signid'] as int;
    _signBody = d['signbody'] as String;
    _signUser = d['signuser'] as int;
  }

  String getName() {
    return _name;
  }

  String getDisplayName() {
    return _displayName;
  }

  int getWidth() {
    return _width;
  }

  int getHeight() {
    return _height;
  }

  String getNameKey() {
    return _nameKey;
  }

  String getDimension() {
    return _signDim;
  }

  String getSignUrl() {
    return _signUrl;
  }

  String getImageUrl() {
    return "$_imageUrl?${Random().nextInt(1000000)}";
  }

  String getLocalImageUrl([bool preview = false]) {
    String s = _localImageUrl;
    if (preview) {
      s = s.replaceAll("/image", "/imagePREVIEW");
    }
    return "$s?${Random().nextInt(1000000)}";
  }

  String getSignBody() {
    return _signBody;
  }

  int getSignId() {
    return _signId;
  }

  int getSignUserId() {
    return _signUser;
  }

  void setContents(String cnts) {
    _signBody = cnts;
  }

  void setDisplayName(String name) {
    _displayName = name;
  }

  void setName(String name) {
    _name = name;
  }

  void setSize(int wd, int ht, String dim) {
    _width = wd;
    _height = ht;
    _signDim = dim;
  }
}     // end of signdata.dart

