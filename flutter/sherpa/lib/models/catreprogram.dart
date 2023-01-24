/*
 *        catreprogram.dart
 * 
 *    Dart representation of a CATRE program w/ conditions and actions
 * 
 **/
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
///*******************************************************************************/

import 'catredata.dart';
import 'triggertime.dart';

/// *****
///      CatreProgram : the current user program
/// *****

class CatreProgram extends CatreData {
  late List<CatreRule> _theRules;

  CatreProgram.build(dynamic data) : super(data as Map<String, dynamic>) {
    _theRules = buildList("RULES", CatreRule.build);
  }

  List<CatreRule> getRules() => _theRules;
} // end of CatreProgram

/// *****
///      CatreRule : description of a single rule
/// *****

class CatreRule extends CatreData {
  late CatreCondition _condition;
  late List<CatreAction> _actions;

  CatreRule.build(dynamic data) : super(data as Map<String, dynamic>) {
    _condition = buildItem("CONDITION", CatreCondition.build);
    _actions = buildList("ACTIONS", CatreAction.build);
  }

  num getPriority() => getNum("PRIORITY");

  CatreCondition getCondition() => _condition;

  List<CatreAction> getActions() => _actions;
}

/// *****
///      CatreCondition : description of condition of a rule
/// *****

class CatreCondition extends CatreData {
  CatreParamRef? _paramRef;
  CatreCondition? _subCondition;
  CatreTimeSlot? _timeSlot;
  CatreTriggerTime? _triggerTime;
  List<CatreCalendarMatch>? _calendarFields;

  CatreCondition.build(dynamic data) : super(data as Map<String, dynamic>) {
    _paramRef = optItem("PARAMREF", CatreParamRef.build);
    _subCondition = optItem("CONDITION", CatreCondition.build);
    _timeSlot = optItem("EVENT", CatreTimeSlot.build);
    String? t = optString("TIME");
    if (t != null) _triggerTime = CatreTriggerTime(t);
    _calendarFields = optList("FIELDS", CatreCalendarMatch.build);
  }

  String getConditionType() => getString("TYPE");
  bool isTrigger() => getBool("TRIGGER");
  CatreCondition getSubcondition() => _subCondition as CatreCondition;

// Parameter conditions
//      isTrigger

  String getOperator() => getString("OPERATOR");
  String getTargetValue() => getString("STATE");
  CatreParamRef getParameterReference() => _paramRef as CatreParamRef;

// Disable conditions
  String getDeviceId() => getString("DEVICE");
  bool isCheckForEnabled() => getBool("ENABLED");

// Debounce conditions
//        getSubCondition
  num getOnTime() => getNum("ONTIME");
  num getOffTime() => getNum("OFFTIME");

// Duration conditions
//    getSubcondition(), isTrigger
  num getMinTime() => getNum("MINTIME");
  num getMaxTime() => getNum("MAXTIME");

// Latch conditions
//    getSubcondition
  num? getResetTime() => optNum("RESETTIME");
  num getResetAfter() => getNum("RESETAFTER");
  num getOffAfter() => getNum("OFFAFTER");

// Range conditions
//    getParameterReference, isTrigger
  num? getLowValue() => optNum("LOW");
  num? getHighValue() => optNum("HIGH");

// Timer conditions
  CatreTimeSlot getTimeSlot() => _timeSlot as CatreTimeSlot;

// TriggerTime conditions
  CatreTriggerTime getTriggerTime() => _triggerTime as CatreTriggerTime;

// CalendarEvent conditions
//      getParameterReference
  List<CatreCalendarMatch> getFields() =>
      _calendarFields as List<CatreCalendarMatch>;
}

/// *****
///      CatreAction : description of action of a rule
/// *****

class CatreAction extends CatreData {
  late CatreTransitionRef _transition;

  CatreAction.build(dynamic data) : super(data as Map<String, dynamic>) {
    _transition = buildItem("TRANSITION", CatreTransitionRef.build);
  }

  CatreTransitionRef getTransitionRef() => _transition;

  Map<String, dynamic> getValues() {
    return catreData["PARAMETERS"] as Map<String, dynamic>;
  }
}

/// *****
///      CatreParamRef : description of reference to a parameter
/// *****

class CatreParamRef extends CatreData {
  CatreParamRef.build(dynamic data) : super(data as Map<String, dynamic>);

  String getDeviceId() => getString("DEVICE");
  String getParameterName() => getString("PARAMETER");
}

/// *****
///      CatreTransitionRef : reference to a transition
/// *****

class CatreTransitionRef extends CatreData {
  CatreTransitionRef.build(dynamic data) : super(data as Map<String, dynamic>);

  String getDeviceId() => getString("DEVICE");
  String getTransitionName() => getString("TRANSITION");
}

/// *****
///      CatreTimeSlot :: desription of a time slot for a condition
/// *****

class CatreTimeSlot extends CatreData {
  CatreTimeSlot.build(dynamic data) : super(data as Map<String, dynamic>);

  num? getFromDate() => optNum("FROMDATE");
  num? getFromTime() => optNum("FROMTIME");
  num? getToDate() => optNum("TODATE");
  num? getToTime() => optNum("TOTIME");
  String getDays() => getString("DAYS");
  num getRepeatInterval() => getNum("INTERVAL");
  List<num>? getExcludeDates() => optNumList("EXCLUDE");
}

/// *****
///      CatreCalendarMatch -- description of a field match for calendar
/// *****

class CatreCalendarMatch extends CatreData {
  CatreCalendarMatch.build(dynamic data) : super(data as Map<String, dynamic>);

  String getFieldName() => getString("NAME");
  String getNullType() => getString("NULL");
  String getMatchType() => getString("MATCH");
  String? getMatchValue() => optString("MATCHVALUE");
}
