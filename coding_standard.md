# Coding Standards

## Java (Dr. Reiss's Convention)

### Naming Conventions

- Fields (static variables)
    - Lowercase, use underscore between words
    - Always private (or protected) to avoid naming conflicts
- Local variables
    - Lowercase, no underscore
    - Short names okay if used within a few lines; otherwise, use meaningful names
- Constants (final static fields)
    - Uppercase, underscores separate words
    - Start with package name if external
- Methods
    - camelCase (lowerCamel)
    - Access methods start with *get*, *set*, or *is*
    - Factory methods start with *create* or *new*
- Types (classes, interfaces, enums)
    - CamelCase (UpperCamel)
    - Outer types should start with package name
    - External (visible) inner types should start with package name
- Packages - should always be there!
    - `edu.brown.cs.project.<package>`
- Imports
    - Use single class imports (not on-demand)
    - Use static imports only where names with remain unambiguous

### Ordering Conventions

1. **Header comments** - name, purpose, author(s), copyright(s)
    - Should only have a single purpose! (re: class design)
    - Include names of all authors
    - Always include a copyright statement
2. Main method (if present)
3. Other top-level static factory methods
4. Field definitions (private, static private)
5. Constructors and self-factory methods
6. Access methods
7. Public methods
8. Private methods
9. Inner classes (comment at end of class)
10. Tail comment — note the end of the file

### Formatting

- Maximum 100 chars per line
- Whitespace and comments?
- Indentation rules? 

### Comments

- `//` for inline comments; `/**/` for multi-line comments
- Write **JavaDocs** for external methods and fields
- Block comments between logically separate components

**Example**

```
/********************************************************************************/
/*										*/
/*	[INSERT TEXT HERE] 							*/
/*										*/
/********************************************************************************/
```

- Method should fit on ONE page
- Use blank lines liberally but meaningfully
- In-line comments where the code is non-obvious

### File System Organization

```
root
├── bin
├── lib
├── resources
├── javasrc
│   ├── edu/brown/cs/<root>
└── java (compiler output)
```

## Dart

*Adapt conventions into this language following the same guidelines as Java.*
*Adapt Claude output to Dr. Reiss' coding standard*

### Naming Conventions
- Classes and Types:
    - Use PascalCase (UpperCamelCase)
    - Example: PersonalInfo, HttpRequest
- Variables, Functions, and Parameters:
    - Use lowerCamelCase
    - Example: firstName, calculateTotal()
- Constants and Enums:
    - Use lowerCamelCase
    - Example: `const pi = 3.14`, `final maxUsers = 100`
- Libraries and File Names:
    - Use `lowercase_with_underscores`
    - Example: `dart_utils.dart`, `string_helper.dart`
- Packages:
    - Use `lowercase_with_underscores`
    - Example: `angular_components`
- Private Members:
    - Start with an underscore
    - Example: `_internalMethod()`, `_privateVariable`


### Ordering Conventions
1. Library Imports:
   - List all imports at the top of the file.
   - Sort imports alphabetically.
   - Group imports by type (dart:, package:, relative paths).

2. Class Members:
   - Group members into logical sections (variables, constructors, methods, etc.).
   - Within each section, order members alphabetically.
   - Static members should come before instance members.
   - Private members should come after public members.

3. Method Ordering:
   - Group methods by logical functionality.
   - Within each group, order methods alphabetically.

4. Getter/Setter Ordering:
   - Getters should come before setters for the same property.

### Formatting
- Indentation:
   - Use 2 spaces for indentation, not tabs.
- Line length
   - Aim for a maximum line length of 80 characters.
   - If a line exceeds 80 characters, break it into multiple lines, with the subsequent lines indented by 2 spaces.
- Braces:
   - Use braces for all control flow statements, even if the body is a single line.
   - Place the opening brace on the same line as the statement.
   - Place the closing brace on a new line, aligned with the beginning of the statement.
- Blank lines
   - Use blank lines to separate logical sections of code.
   - Use a single blank line between method definitions.
- Place annotations on their own lines, before the annotated function declaration
- Whitespace:
   - Avoid trailing whitespace at the end of lines.
   - Use a single blank line at the end of the file.

### Comments
- Use single-line comments (`//`) for brief comments.
- Use block comments (`/* */`) for multi-line comments.
- Document public APIs using the documentation comment syntax (`///`).

### File System Organization
```
├── lib/
│   ├── models/
│   │   ├── user.dart
│   │   ├── product.dart
│   │   └── order.dart
│   ├── services/
│   │   ├── auth_service.dart
│   │   └── api_service.dart
│   └── utils/
│       ├── date_utils.dart
│       └── string_utils.dart
├── test/
│   ├── models/
│   │   ├── user_test.dart
│   │   ├── product_test.dart
│   │   └── order_test.dart
│   ├── services/
│   │   ├── auth_service_test.dart
│   │   └── api_service_test.dart
│   └── utils/
│       ├── date_utils_test.dart
│       └── string_utils_test.dart
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   └── background.jpg
│   └── fonts/
│       └── open_sans.ttf
├── pubspec.yaml
└── analysis_options.yaml
```

## JavaScript

### Naming Conventions

### Ordering Conventions

### Formatting

### Comments

### File System Organization
