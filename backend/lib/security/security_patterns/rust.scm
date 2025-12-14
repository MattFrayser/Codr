; ============================================================================
; RUST BLOCKLIST
; ============================================================================

; === BLOCK UNSAFE & FFI ===

[
  (unsafe_block)
  (function_item (function_modifiers "unsafe"))
  (function_item (function_modifiers (extern_modifier)))
  (impl_item "unsafe")
  (extern_crate_declaration)
  (foreign_mod_item)
] @unsafe_code

; === BLOCK SYSTEM MODULES ===

(use_declaration
  argument: (scoped_identifier) @use_path
  (#match? @use_path "^std::(fs|net|process|env|os)"))
@blocked_module

; Catch nested uses: use std::{fs, net}
(use_declaration
  argument: (scoped_use_list
    path: (scoped_identifier) @scope
    (#match? @scope "^std$")
    list: (use_list
      (identifier) @mod
      (#match? @mod "^(fs|net|process|env|os)$"))))
@blocked_module
