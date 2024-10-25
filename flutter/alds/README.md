# alds

Phone app to report location and other information to Catre

## Local Development Setup

Follow these [directions](https://docs.flutter.dev/get-started/install) for configure your environment for Flutter development based on your OS and application needs.

For Android development, make note of the following things:

- Set up the Android Emulator for Flutter using these [instructions](https://docs.flutter.dev/get-started/install/windows/mobile#set-up-the-android-emulator)

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
