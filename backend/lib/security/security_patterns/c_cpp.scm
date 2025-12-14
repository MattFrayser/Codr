; ============================================================================
; C/C++ BLOCKLIST
; ============================================================================

; === BLOCK SYSTEM CALLS ===
; external commands and dangerous low-level ops.

(call_expression
  function: (identifier) @func
  (#match? @func "^(system|exec|execl|execle|execv|execve|execvp|popen|fork|vfork|dlopen|dlsym|socket|connect|bind|listen|accept)$"))
@dangerous_call

; === BLOCK SYSTEM HEADERS ===
; headers that expose OS primitives.

(preproc_include
  path: [
    (string_literal)
    (system_lib_string)
  ] @header
  (#match? @header ".*(unistd|sys/|netinet|arpa|dlfcn|signal).*"))
@blocked_include

; === BLOCK INLINE ASSEMBLY ===
(gnu_asm_expression) @inline_assembly
