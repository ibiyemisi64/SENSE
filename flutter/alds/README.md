# ALDS
ALDS is a Flutter-based mobile application designed to allow users to report their current location and other relevant information to Catre. 
The app offers functionalities such as saving locations, validating current positions, and customizing theme settings to enhance user experience.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the [online documentation](https://docs.flutter.dev/), which offers tutorials, samples, guidance on mobile development, and a full API reference.

### Local Development Setup

Follow these [directions](https://docs.flutter.dev/get-started/install) to configure your environment for Flutter development based on your OS and application needs.

- For Android development, make note of the following:
  - Set up the Android Emulator for Flutter using these [instructions](https://docs.flutter.dev/get-started/install/windows/mobile#set-up-the-android-emulator).
- You must run VSCode in Administrator mode to build on Windows.

If you run into issues during setup, see [setup troubleshooting](#setup-troubleshooting) below.

### Setup Troubleshooting

#### Android Setup Troubleshooting

- Since the Flutter project was created with an older version of Flutter, the Android setup was outdated. I had to delete the Android folder (or move it somewhere else) and run `flutter create .` in the command line to recreate the Android folder. ([Fix](https://medium.com/@paulsean5/flutter-re-create-351eecf44e46))
  - Flutter has made numerous breaking changes. For example, this issue was caused by a [breaking change](https://docs.flutter.dev/release/breaking-changes/flutter-gradle-plugin-apply). Other breaking changes can be found [here](https://docs.flutter.dev/release/breaking-changes).
- **Error:** A problem occurred configuring project [flutter_blue](https://pub.dev/packages/flutter_blue/versions/0.8.0) ([Fix](https://pub.dev/packages/flutter_blue_plus))
  - **Fix:** Switch to [flutter_blue_plus](https://pub.dev/packages/flutter_blue_plus).
- All subsequent errors were caused by incompatibility of Gradle and Android Gradle Plugin (AGP). Using the AGP updater in Android Studio, I was able to find a combination that worked (AGP 8.3.2 and Gradle 8.9).

#### Windows Setup Troubleshooting

- **Error:** The current VSCode installation is incomplete ([Fix](https://medium.com/flutter-community/fixing-issues-with-flutter-on-windows-9a4bb40eb54))
- **Error:** Nuget is not installed ([Fix](https://stackoverflow.com/questions/71734042/flutter-windows-build-nuget-is-not-installed))
- **Error:** win32 library was outdated ([Fix](#))
  - **Fix:** Upgraded all libraries to the latest version.
  - As a result, one issue arose in the code as a library added some parameters to a constructor. I just added some default values to get rid of the error. These lines are marked by a `FIXME` comment in the `locator.dart`.

#### iOS Emulator on Windows??
- [Flutter Inspector](https://docs.flutter.dev/tools/devtools/inspector)


## Unit Testing Plan

### Local Storage (`storage.dart`)

- [ ] Deleting an item from local storage successfully deletes the item (`removeLocation`)
- [ ] Updating an existing item in local storage successfully updates the item (`updateLocation`)
- [ ] Adding a new item to local storage successfully adds the item

### Saved Locations

- [ ] If no saved locations exist, the page should display "No Saved Locations"
- [ ] If saved locations do exist, each saved location should appear as a card on the page
- [ ] Clicking on the "3 dots" should allow the user to access "Edit" or "Delete" functionalities
- [ ] User should be able to view all their existing saved locations
- [ ] Deleting a Saved Location removes the item from the list of saved locations
- [ ] Deleting a Saved Location, then adding a new saved location (from the Map Page) shows the new item but not the deleted item
- [ ] Deleting a Saved Location, then updating an existing saved location (from the Map Page) updates the existing item and removes the deleted item
- [ ] Deleting a Saved Location does not change the ordering of the other items in the list (since no sort is applied)
- [ ] Editing a Saved Location edits the name of the item
- [ ] Editing a Saved Location does not change the position of the item in the saved locations list (since no sort is applied)

### Map Page

- [ ] The page should render a "circular waiting animation" before the saved locations are completely read from local storage
- [ ] When local storage is successfully retrieved, a map, dropdown, and a "Validate Location" button should render
- [ ] Validating an item with no name should not add that item to saved locations
- [ ] Validating an item that isn't in the saved locations adds it to saved locations
- [ ] Validating an item that is in the saved locations merges the saved location (i.e., the position of the saved location updates)
- [ ] The user should be able to type into the text area of the dropdown
- [ ] If the user does not have saved locations, the dropdown entries should be empty
- [ ] If the user has saved locations, the dropdown entries should be the user's saved locations
- [ ] If the user is in a saved location, the page displays the name of that saved location

### Settings Page

- Toggling the system settings to each of the modes works:
  - [ ] Light
  - [ ] Dark
  - [ ] System
- [ ] An option for theme selection appears, with a dropdown to select between System, Light, and Dark modes

### Navigation Bar

- [ ] Changing between pages doesn't change the content on the page (i.e., re-render the page)
- [ ] When an icon is selected, the icon indicates that it is selected

### Login

- [ ] User should only see their saved locations + theme preferences
- [ ] The same user's saved locations + settings should persist across several logins

## User Testing *(might be a stretch)*
### Map Page User Testing

- [ ] User's current location is marked on the map
- [ ] User's saved locations are marked on the map
- [ ] The map should be centered on the user's current location


## Future Work

If we were able to continue to develop the **ALDS** application, the following tasks are planned to enhance functionality, ensure robustness, and prepare the app for deployment:

- **Fix Existing Tests:**
  - Resolve the `MissingPluginException` related to `flutter_logs`.
  - Address network-related errors by mocking or disabling tile fetching during tests.
  - Ensure all widget tests pass reliably by properly mocking dependencies and handling asynchronous operations.
  
- **Conduct Comprehensive Testing:**
  - Expand unit tests to cover more edge cases and ensure all functionalities work as expected.
  - Implement integration tests to verify the interaction between different components of the app.
  - Perform user acceptance testing (UAT) to gather feedback and make necessary adjustments.

- **Deploy the App to Users:**
  - Prepare the app for deployment on relevant platforms (e.g., Google Play Store, Apple App Store).
  - Optimize app performance and ensure compliance with platform-specific guidelines.
  - Set up continuous integration and continuous deployment (CI/CD) pipelines for streamlined updates and maintenance.

- **Enhance User Interface and Experience:**
  - Improve the design and responsiveness of the map and saved locations pages.
  - Add animations and transitions to make interactions more intuitive and engaging.
  - Implement accessibility features to ensure the app is usable by a wider audience.

- **Expand Functionality:**
  - Integrate additional features such as real-time location sharing, notifications, and data analytics.
  - Enhance privacy settings to give users more control over their data.
  - Incorporate offline capabilities to allow the app to function without an active internet connection.

## Blockers for the Semester

Throughout the semester, we encountered several challenges that have impacted the development and testing of the **ALDS** application:

- **Learning Dart and Flutter:**
  - Gaining proficiency in Dart programming language and Flutter framework has been a significant learning curve.
  - Understanding Flutter's widget tree and state management principles required dedicated effort and time.

- **Figuring Out How to Run Code:**
  - Setting up the development environment correctly, including configuring emulators and handling platform-specific requirements, posed initial challenges.
  - Navigating Flutter's build and run commands to ensure the app functions as intended across different platforms.

- **Figuring Out How to Test Code:**
  - Implementing effective unit and widget tests necessitated a deeper understanding of Flutter's testing frameworks.
  - Overcoming issues related to mocking dependencies, handling asynchronous operations, and resolving plugin-related exceptions were particularly time-consuming.
