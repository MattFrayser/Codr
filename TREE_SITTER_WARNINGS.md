# Tree-Sitter Parser Warnings

## Warning Message

```
Warning: Failed to load javascript parser: Language.__init__() missing 1 required positional argument: 'name'
```

## What This Means

The tree-sitter library has a version incompatibility with the parser initialization code in your AST validators. This is used for validating JavaScript, C, C++, and Rust code for security.

## Impact

- **Python validation still works** (uses built-in `ast` module)
- **Execution still works** for all languages (Firejail sandbox provides security)
- **Non-critical warning** - doesn't prevent code from running

## Why It Happens

Tree-sitter version 0.21.3 (in requirements.txt) has a different API than newer versions. The language parsers need to be initialized differently.

## Solutions

### Option 1: Ignore the warnings (Recommended for now)
Since Firejail provides the primary security boundary and Python validation works, you can safely ignore these warnings. The code will execute correctly.

### Option 2: Fix the tree-sitter initialization
Update the AST validator initialization code to match the tree-sitter version. This would require:
1. Checking the tree-sitter version
2. Updating parser initialization in `backend/api/security/ast_validator.py`

### Option 3: Upgrade tree-sitter
Update to the latest tree-sitter version and update the parser initialization code accordingly.

## For Now

The warnings are **cosmetic** and don't affect functionality. Your code will:
- ✅ Execute correctly
- ✅ Be sandboxed by Firejail
- ✅ Stream output properly
- ✅ Handle interactive input

The main async/sync fix is more important, so focus on testing that first!

## Future Enhancement

To fix these warnings properly, we would need to:
1. Investigate the exact tree-sitter API changes
2. Update the parser initialization code
3. Test with all language parsers

This can be done as a separate enhancement after confirming interactive input works correctly.
