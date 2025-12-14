; ============================================================================
; PYTHON BLOCKLIST
; ============================================================================

; === BLOCK SYSTEM CAPABILITIES ===
; imports that provide File I/O, Networking, or Process Control.

; Standard import 'import os'
(import_statement
  (dotted_name
    (identifier) @mod_name
    (#match? @mod_name "^(os|sys|subprocess|socket|urllib|requests|importlib|pickle|ftplib)$")))
@blocked_module

; Aliased import 'import os as x'
(import_statement
  (aliased_import
    name: (dotted_name
      (identifier) @mod_name
      (#match? @mod_name "^(os|sys|subprocess|socket|urllib|requests|importlib|pickle|ftplib)$"))))
@blocked_module

;  From import 'from os import ...'
(import_from_statement
  module_name: (dotted_name
    (identifier) @mod_name
    (#match? @mod_name "^(os|sys|subprocess|socket|urllib|requests|importlib|pickle|ftplib)$")))
@blocked_module

; === BLOCK DANGEROUS PRIMITIVES ===
; built-in functions that execute code or access internals.

(call
  function: (identifier) @func_name
  (#match? @func_name "^(eval|exec|compile|__import__|globals|locals|vars|getattr|setattr|delattr|exit|quit)$"))
@blocked_operation

; === BLOCK INTROSPECTION ESCAPES ===
; Prevents accessing internal Python structures to bypass the sandbox.

(attribute
  attribute: (identifier) @attr
  (#match? @attr "^(__builtins__|__subclasses__|__bases__|__mro__|__globals__)$"))
@dangerous_attribute
