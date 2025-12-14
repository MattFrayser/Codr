; ============================================================================
; JAVASCRIPT BLOCKLIST
; ============================================================================

; === BLOCK NODE.JS SYSTEM MODULES ===
; require('fs'), require('net'), etc.

(call_expression
  function: (identifier) @func
  (#eq? @func "require")
  arguments: (arguments
    (string) @mod_name
    (#match? @mod_name "^['\"](?:node:)?(fs|child_process|net|http|https|dgram|dns|tls|os|process|vm)(?:/.*)?['\"]$")))
@blocked_require

; ES6 imports: import ... from 'fs'
(import_statement
  source: (string) @import_source
  (#match? @import_source "^['\"](?:node:)?(fs|child_process|net|http|https|dgram|dns|tls|os|process|vm)(?:/.*)?['\"]$"))
@blocked_import

; === BLOCK DANGEROUS EVALUATION ===

(call_expression
  function: (identifier) @func
  (#match? @func "^(eval|Function)$"))
@dangerous_call

; Catch obfuscated calls: obj["eval"]()
(call_expression
  function: (subscript_expression
    index: (string) @idx
    (#match? @idx "^['\"](eval|Function)['\"]$")))
@dangerous_call

; === BLOCK GLOBAL PROCESS ACCESS ===

(member_expression
  object: (identifier) @obj
  (#eq? @obj "process")
  property: (property_identifier) @prop
  (#match? @prop "^(binding|dlopen|mainModule|env|exit|kill)$"))
@dangerous_member

; === BLOCK PROTOTYPE POLLUTION ===

(subscript_expression
  index: (string) @prop
  (#match? @prop "^['\"](__proto__|constructor|prototype)['\"]$"))
@dangerous_property
