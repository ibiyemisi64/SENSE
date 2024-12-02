# alds

Phone app to report location and other information to Catre

## Unit Testing

### Local Storage

- [ ] Deleting an item from local storage actually deletes the item
- [ ] Updating an item in local storage ...
- [ ] Adding an item to local storage ...

### Saved Locations

- [ ] Deleting an item from the Saved Locations page removes the item from local storage
- [ ] Editing a Saved Location edits the name of the item in local storage

### Map Page

- [ ] Validating an item that isn't in the saved locations adds it to saved locations
- [ ] Validating an item that is in the saved locations merges the saved location (i.e. the position of the saved location updates)
- [ ] Dropdown entries are our saved locations
- [ ] If the user is in a saved location, it outputs the name of that saved location

### Settings Page

- Toggling the system settings to each of the modes works:
  - [ ] Light
  - [ ] Dark
  - [ ] System

### Navigation Bar

- [ ] Changing between pages doesn't change the content on the page (i.e. re-render the page)

## User Testing (things I don't think we can user test)

### Map Page

- [ ] User's current location is the center of the map, and a marker marks the user's location
- [ ] User's saved locations appear on the map

## Local Development Setup

Follow these [directions](https://docs.flutter.dev/get-started/install) for configure your environment for Flutter development based on your OS and application needs.

- For Android development, make note of the following things:
  - Set up the Android Emulator for Flutter using these [instructions](https://docs.flutter.dev/get-started/install/windows/mobile#set-up-the-android-emulator)
- You must run VSCode in Administrator mode to build on Windows.

If you run into issues during setup, see [troubleshooting tips](#setup-troubleshooting) below.

## Functionality

The main page is implemented in `selectpage.dart`. Currently, this only contains a dropdown, "Validate" button, and a template sidebar (this sidebar has no functionality currently). The dropdown is used to select saved locations. "Validate" button initiates the validation procedure for the location.

## Components to Improve On

- SelectPage
  - Interactive map
  - Saved Locations page to view and modify saved locations
- Sign-In Page
- Settings Page
  - Interface to configure user privacy settings

## Setup Troubleshooting

### Android Setup Troubleshooting

- Since the Flutter project was created with an older version of Flutter, the Android setup was outdated. I had to delete the Android folder (or move it somewhere else), and run `flutter create .` in the command line to recreate the Android folder. ([Fix](https://medium.com/@paulsean5/flutter-re-create-351eecf44e46))
  - Flutter has made a ton of breaking changes. For example, this issue was caused by a [breaking change](https://docs.flutter.dev/release/breaking-changes/flutter-gradle-plugin-apply). Other breaking changes can be found [here](https://docs.flutter.dev/release/breaking-changes).
- Error: A problem occurred configuring project [flutter_blue](https://pub.dev/packages/flutter_blue/versions/0.8.0) (Fix: Switch to [flutter_blue_plus](https://pub.dev/packages/flutter_blue_plus))
- All subsequent errors were caused by incompatibility of Gradle and Android Gradle Plugin (AGP). Using the AGP updater in Android Studio, I was able to find a combination that worked (AGP 8.3.2 and Gradle 8.9).

### Windows Setup Troubleshooting

- Error: The current VSCode installation is incomplete ([Fix](https://medium.com/flutter-community/fixing-issues-with-flutter-on-windows-9a4bb40eb54))
- Error: Nuget is not installed ([Fix](https://stackoverflow.com/questions/71734042/flutter-windows-build-nuget-is-not-installed))
- Error: win32 library was outdated (Fix: I upgraded all libraries to the latest version)
  - As a result, one issue arose in the code as a library added some parameters to a constructor. I just added some random values to get rid of the error. These lines are marked by a `FIXME` comment in the `locator.dart`.

### iOS Emulator on Windows??

- [Flutter Inspector](https://docs.flutter.dev/tools/devtools/inspector)

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
