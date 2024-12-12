/*
 *        widgets.dart  
 * 
 *    Common code for creating widgets
 * 
 */
/*	Copyright 2023 Brown University -- Steven P. Reiss			*/
import 'package:flutter/material.dart';

Widget textFormField({
  String? hint,
  String? label,
  TextEditingController? controller,
  ValueChanged<String>? onChanged,
  VoidCallback? onEditingComplete,
  ValueChanged<String>? onSubmitted,
  String? Function(String?)? validator,
  bool? showCursor,
  int? maxLines,
  TextInputType? keyboardType,
  bool obscureText = false,
}) {
  label ??= hint;
  hint ??= label;
  if (obscureText) maxLines = 1;
  return TextFormField(
    decoration: InputDecoration(
      hintText: hint,
      labelText: label,
      border: const OutlineInputBorder(),
    ),
    validator: validator,
    controller: controller,
    onChanged: onChanged,
    onEditingComplete: onEditingComplete,
    onFieldSubmitted: onSubmitted,
    showCursor: showCursor,
    maxLines: maxLines,
    obscureText: obscureText,
  );
}

TextField textField({
  String? hint,
  String? label,
  TextEditingController? controller,
  ValueChanged<String>? onChanged,
  VoidCallback? onEditingComplete,
  ValueChanged<String>? onSubmitted,
  bool? showCursor,
  int? maxLines,
  TextInputType? keyboardType,
  TextInputAction? textInputAction,
  bool? readOnly,
}) {
  label ??= hint;
  hint ??= label;
  maxLines ??= 1;
  readOnly ??= false;
  keyboardType ??=
      (maxLines == 1 ? TextInputType.text : TextInputType.multiline);
  if (readOnly) showCursor = false;

  return TextField(
    controller: controller,
    onChanged: onChanged,
    onEditingComplete: onEditingComplete,
    onSubmitted: onSubmitted,
    showCursor: showCursor,
    maxLines: maxLines,
    keyboardType: keyboardType,
    textInputAction: textInputAction,
    readOnly: readOnly,
    decoration: InputDecoration(
      hintText: hint,
      labelText: label,
      border: const OutlineInputBorder(),
    ),
  );
}

Widget errorField(String text) {
  return Text(
    text,
    style: const TextStyle(color: Colors.red, fontSize: 16),
  );
}

Widget submitButton(String name, void Function()? action) {
  return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: ElevatedButton(
        onPressed: action,
        child: Text(name),
      ));
}

Widget textButton(String label, void Function()? action) {
  return TextButton(
    style: TextButton.styleFrom(
      textStyle: const TextStyle(fontSize: 14),
    ),
    onPressed: action,
    child: Text(label),
  );
}

Widget topMenu(void Function(String)? handler, List labels) {
  return PopupMenuButton(
    icon: const Icon(Icons.menu_sharp),
    itemBuilder: (context) =>
        labels.map<PopupMenuItem<String>>(_menuItem).toList(),
    onSelected: handler,
  );
}

PopupMenuItem<String> _menuItem(dynamic val) {
  String value = 'Unknown';
  String label = 'Unknown';
  if (val is String) {
    value = val;
    label = val;
  } else if (val is Map<String, String>) {
    for (String k in val.keys) {
      value = k;
      label = val[k] as String;
    }
  }
  return PopupMenuItem<String>(
    value: value,
    child: Text(label),
  );
}

Widget fieldSeparator() {
  return const SizedBox(height: 8);
}

Widget dropDown(List<String> items,
    {String? value, Function(String?)? onChanged}) {
  // value ??= items[0];
  return DropdownButton<String>(
    value: value,
    onChanged: onChanged,
    items: createMenuItems(items),
  );
}

List<DropdownMenuItem<String>> createMenuItems(List<String> items) {
  return items.map<DropdownMenuItem<String>>(createMenuItem).toList();
}

DropdownMenuItem<String> createMenuItem(String value) {
  return DropdownMenuItem<String>(
    value: value,
    child: Text(value),
  );
}

DropdownMenu searchableDropdown(
  double width,
  TextEditingController textController,
  List<String> locations,
  Function(String?)? onSelected,
) {
  return DropdownMenu<String>(
      width: width, 
      controller: textController,
      enableFilter: true,
      requestFocusOnTap: true,
      leadingIcon: Icon(Icons.location_on),
      inputDecorationTheme: const InputDecorationTheme(
        filled: true, 
        contentPadding: EdgeInsets.symmetric(vertical: 5.0),
      ),
      onSelected: onSelected,
      dropdownMenuEntries: createMenuEntries(locations),
  );
}

List<DropdownMenuEntry<String>> createMenuEntries(List<String> locations) {
    return locations.map((String loc) => DropdownMenuEntry<String>(value: loc, label: loc)).toList();
  }

Text heading(String text, {int? headingLevel}) {

  /* With multiple levels of heading, this function can take a heading level. The idea is that we can use a switch statement to output the correctly-formatted heading. */

  return Text(
    text,
    style: TextStyle(
      fontSize: 24.0,
    ),
  );
}

// class SwitchExample extends StatefulWidget {
//   const SwitchExample({
//       super.key, 
//       required this.initVal, 
//       required this.color, 
//       required this.onChanged
//     }
//   );

//   final bool initVal;
//   final MaterialColor? color;
//   final Function(bool)? onChanged;

//   @override
//   State<SwitchExample> createState() => _SwitchExampleState();
// }

// class _SwitchExampleState extends State<SwitchExample> {
//   @override
//   Widget build(BuildContext context) {
//     return Switch(
//       // This bool value toggles the switch.
//       value: widget.initVal,
//       activeColor: widget.color,
//       onChanged: widget.onChanged,
//     );
//   }
// }





