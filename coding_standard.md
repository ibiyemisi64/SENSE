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

- Write **JavaDocs** for external methods and fields
- Block comments between logically separate components
- Method should fit on ONE page

```
/********************************************************************************/
/*										*/
/*	[INSERT TEXT HERE] 							*/
/*										*/
/********************************************************************************/
```

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

### Naming Conventions

### Ordering Conventions

### Formatting

### Comments

### File System Organization

## JavaScript

### Naming Conventions

### Ordering Conventions

### Formatting

### Comments

### File System Organization
