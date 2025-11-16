"""
Central repository for all security blocked patterns used by AST validators.

This file contains all blocked operations, modules, patterns, and identifiers
for each supported language. All patterns are used by language-specific AST
validators to prevent dangerous code execution.
"""

# ============================================================================
# PYTHON SECURITY PATTERNS
# ============================================================================

# Python functions/operations that are always blocked
PYTHON_BLOCKED_OPERATIONS = {
    # Code execution
    'eval', 'exec', 'compile', '__import__',

    # File operations
    'open', 'file',

    # Introspection (used for sandbox escapes)
    'globals', 'locals', 'vars', 'dir', 'getattr', 'setattr', 'delattr',
    'hasattr', '__builtins__',

    # System
    'exit', 'quit', 'help',
}

# Python modules that are always blocked
PYTHON_BLOCKED_MODULES = {
    # File system and OS
    'os', 'sys', 'io', 'pathlib', 'glob', 'shutil', 'tempfile',

    # Process and subprocess
    'subprocess', 'multiprocessing', 'threading', 'asyncio',

    # Network
    'socket', 'urllib', 'http', 'ftplib', 'smtplib', 'ssl',
    'requests', 'httplib', 'urllib2', 'urllib3',

    # Code execution
    'importlib', 'imp', 'code', 'codeop', 'runpy',

    # System access
    'ctypes', 'pty', 'pwd', 'grp', 'resource',
    'signal', 'platform', 'sysconfig',

    # Serialization that can execute code
    'pickle', 'shelve', 'marshal', 'dill',
}

# Dunder attributes that are safe to access
PYTHON_SAFE_DUNDERS = {'__str__', '__repr__', '__len__', '__init__'}

# ============================================================================
# JAVASCRIPT SECURITY PATTERNS
# ============================================================================

# JavaScript operations/functions that are blocked
JAVASCRIPT_BLOCKED_OPERATIONS = {
    # Code execution
    'eval', 'Function',

    # Module system
    'require', 'import',

    # Global objects
    'process', 'global', '__dirname', '__filename', 'module', 'exports',
}

# JavaScript Node.js modules that are blocked
JAVASCRIPT_BLOCKED_MODULES = {
    # File system
    'fs', 'path',

    # System and process
    'os', 'child_process', 'cluster', 'worker_threads',

    # Network
    'net', 'http', 'https', 'http2', 'dgram', 'dns', 'tls',

    # Code execution
    'v8', 'vm', 'repl', 'readline',
}

# Dangerous member expressions and patterns
JAVASCRIPT_DANGEROUS_PATTERNS = [
    'process.binding',       # Access to internal bindings
    'process.mainModule',    # Access to main module
    'global.process',        # Global process access
    'globalThis.',           # Global scope access
    'module.constructor',    # Constructor access
    'this.constructor',      # Constructor access via this
]

# Standalone identifiers that are blocked
JAVASCRIPT_BLOCKED_IDENTIFIERS = [
    'process',
    'global',
    '__dirname',
    '__filename',
]

# ============================================================================
# C/C++ SECURITY PATTERNS
# ============================================================================

# C/C++ dangerous functions
C_CPP_BLOCKED_FUNCTIONS = {
    # System and process
    'system', 'exec', 'execl', 'execle', 'execlp', 'execv', 'execve',
    'execvp', 'execvpe', 'popen', 'fork', 'vfork',

    # File operations (Firejail handles this, but extra safety)
    'fopen', 'open', 'creat', 'remove', 'unlink', 'rmdir',
    'rename', 'link', 'symlink', 'chmod', 'chown',

    # Network (should be blocked by Firejail)
    'socket', 'connect', 'bind', 'listen', 'accept',

    # Dynamic loading
    'dlopen', 'dlsym',
}

# C/C++ dangerous header files
C_CPP_BLOCKED_HEADERS = [
    'sys/',          # System headers
    'unistd.h',      # Unix system calls
    'fcntl.h',       # File control
    'dlfcn.h',       # Dynamic linking
    'netinet/',      # Network headers
    'arpa/',         # ARPA network headers
    'netdb.h',       # Network database
]

# ============================================================================
# RUST SECURITY PATTERNS
# ============================================================================

# Rust blocked operations (standard library modules)
RUST_BLOCKED_OPERATIONS = {
    # File system and I/O
    'std::fs', 'std::io::Write', 'std::io::Read', 'std::path',

    # Network
    'std::net',

    # System and process
    'std::process', 'std::os', 'std::env',
}

