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

- Maximum 80 chars per line
- Whitespace:
    - Add a space after commas in argument lists.
    - Add a space before and after binary operators (`+`, `-`, `*`, `/`, etc.).
    - Do not add spaces between a method name and its opening parenthesis.
    - Add a space after keywords like `if`, `for`, `while`, etc., before the opening parenthesis.
- Indentation rules
    - 4 spaces for indentation
    - Use the same indentation that Dr. Reiss uses

### Comments

- `//` for inline comments; `/**/` for multi-line comments
- Write **JavaDocs** for external methods and fields
- Start each file with a copyright statement containing: class name, version info, date, and author.
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
*Dr. Reiss's Organization*

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

**Description**
1. **One File per Class**: Each Dart class is defined in its own file (e.g., `user.dart`, `auth_service.dart`).
2. **Organize by Functionality**: Related classes, interfaces, and utilities are grouped into directories based on their functionality (e.g., `models`, `services`, `utils`).
3. **Separate Libraries**: If the project has multiple logical components or modules, they are separated into their own libraries with a dedicated directory (not shown in this example).
4. **Test Files**: Test files are placed alongside the production code files, in a parallel directory structure (e.g., `user_test.dart`, `auth_service_test.dart`).
5. **Asset Files**: Asset files (images, fonts) are stored in a dedicated `assets` directory at the root of the project.
6. **Configuration Files**: Configuration files (e.g., `pubspec.yaml`, `analysis_options.yaml`) are placed at the root of the project.

## JavaScript

### Naming Conventions
1. Variables/functions: camelCase (e.g. `myVariable`)
2. Constants: uppercase with underscores (e.g. `MAX_SIZE`)
3. Classes: PascalCase (e.g. `UserProfile`)
4. Private properties/methods: start with underscore (e.g. `_privateMethod`)
5. File names: lowercase with hyphens (e.g. `user-profile.js`)
6. Component files: PascalCase (e.g. `UserProfile.js`)
7. Boolean variables: start with "is", "has", "can" (e.g. `isValid`)
8. Arrays: plural nouns (e.g. `users`)
9. Object properties: camelCase (e.g. `firstName`)
10. Function parameters: camelCase, descriptive (e.g. `getUserById(userId)`)

### Ordering Conventions
1. Imports/`require`s
2. Constants
3. Global variables
4. Class definitions
   - Static properties
   - Constructor
   - Static methods
   - Instance methods
   - Getters/setters
5. Function declarations
6. Variable declarations
7. Main execution code

### Formatting
1. Indentation: 2 or 4 spaces (consistent throughout)
2. Braces: same line for functions/loops (e.g. `if (condition) {`)
3. Semicolons: use at end of statements
4. Line length: 80 characters max
5. Spaces: around operators, after commas, after keywords
6. No space: between function name and parentheses
7. Blank lines: separate logical sections
8. Quotes: prefer single quotes for strings
9. Object/array: one line if short, multiple lines if long

### Comments
1. Single-line: `//` for brief explanations
2. Multi-line: `/* */` for longer comments
3. JSDoc: `/** */` for function/class documentation
4. Todo: `// TODO:` for future tasks
5. Avoid obvious comments
6. Use clear, concise language
7. Keep comments up-to-date with code changes
8. Comment complex logic or algorithms
9. Use `// FIXME:` for known issues
10. Inline comments: sparingly, at end of line

### File System Organization
```
project-root/
├── src/
│   ├── components/
│   │   ├── Common/
│   │   ├── Feature1/
│   │   └── Feature2/
│   ├── services/
│   ├── utils/
│   ├── constants/
│   └── styles/
├── public/
│   ├── index.html
│   └── assets/
│       ├── images/
│       └── fonts/
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
├── config/
├── scripts/
├── dist/
├── node_modules/
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

**Description**

1. `src/`: Source code files
   - `components/`: Reusable UI components
   - `services/`: API calls and business logic
   - `utils/`: Helper functions and utilities
   - `constants/`: Shared constant values
   - `styles/`: CSS or styling files
2. `public/`: Publicly accessible files
   - `assets/`: Static resources like images and fonts
3. `tests/`: Test files
   - `unit/`: Unit tests
   - `integration/`: Integration tests
4. `docs/`: Project documentation
5. `config/`: Configuration files
6. `scripts/`: Build and automation scripts
7. `dist/`: Compiled and minified production-ready code
8. `node_modules/`: Third-party dependencies
9. `package.json`: Project metadata and dependencies
10. `README.md`: Project overview and instructions
