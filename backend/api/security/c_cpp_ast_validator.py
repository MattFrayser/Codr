"""
C/C++ AST Validator

Validates C and C++ code using tree-sitter AST analysis.
Much more accurate than regex for handling macros, preprocessor directives, etc.
"""

from tree_sitter import Tree, Node
from typing import Tuple, Optional
from .ast_validator import BaseASTValidator
from ..models.allowlist import (
    C_CPP_BLOCKED_FUNCTIONS,
    C_CPP_BLOCKED_HEADERS,
)


class CCppASTValidator(BaseASTValidator):
    """
    Validates C/C++ code using AST analysis

    Checks for:
    - Dangerous function calls (system, exec*, popen, etc.)
    - Blocked header includes (sys/, unistd.h, etc.)
    - Inline assembly
    - Socket operations
    - File operations
    - Dynamic loading (dlopen, dlsym)
    """

    def validate(self, tree: Tree, code: str) -> Tuple[bool, str]:
        """
        Validate C/C++ code using AST

        Args:
            tree: Parsed AST tree
            code: Original source code

        Returns:
            Tuple of (is_valid, error_message)
        """
        self.code_bytes = bytes(code, 'utf8')
        root = tree.root_node

        # Check for dangerous function calls
        result = self._check_function_calls(root)
        if not result[0]:
            return result

        # Check for dangerous includes
        result = self._check_includes(root)
        if not result[0]:
            return result

        # Check for inline assembly
        result = self._check_inline_assembly(root)
        if not result[0]:
            return result

        return True, ""

    def _check_function_calls(self, root: Node) -> Tuple[bool, str]:
        """
        Check all function calls for dangerous operations

        Detects:
        - system(), exec*(), popen(), fork()
        - socket(), connect(), bind()
        - fopen(), open(), remove()
        - dlopen(), dlsym()
        """
        calls = self.walker.find_nodes_by_type(root, 'call_expression')

        for call in calls:
            func_name = self._get_function_name(call)

            if not func_name:
                continue

            # Check if function is blocked
            if func_name in C_CPP_BLOCKED_FUNCTIONS:
                return False, f"Blocked function: {func_name}()"

            # Also check for common variations
            if func_name.startswith('exec') or func_name.startswith('_exec'):
                return False, f"Blocked function: {func_name}()"

        return True, ""

    def _check_includes(self, root: Node) -> Tuple[bool, str]:
        """
        Check #include directives for dangerous headers

        Detects:
        - #include <sys/xxx>
        - #include <unistd.h>
        - #include <fcntl.h>
        - #include <dlfcn.h>
        """
        # Find all preprocessor include directives
        includes = self.walker.find_nodes_by_type(root, 'preproc_include')

        for include in includes:
            header_path = self._get_include_path(include)

            if not header_path:
                continue

            # Check for blocked header paths
            for blocked in C_CPP_BLOCKED_HEADERS:
                if blocked in header_path:
                    return False, f"Blocked header: {header_path}"

        return True, ""

    def _check_inline_assembly(self, root: Node) -> Tuple[bool, str]:
        """
        Check for inline assembly

        Detects:
        - asm(...)
        - __asm(...)
        - __asm__(...)
        """
        # Look for asm statements (tree-sitter may parse these differently)
        # Check for any node containing 'asm'
        all_nodes = []

        def collector(node):
            all_nodes.append(node)

        self.walker.walk(root, collector)

        for node in all_nodes:
            node_text = self._get_node_text(node)

            # Check for inline assembly keywords
            if 'asm' in node_text.lower() and ('__asm' in node_text or 'asm(' in node_text):
                # Make sure it's not in a comment or string
                if node.type not in ['comment', 'string_literal', 'char_literal']:
                    return False, "Inline assembly not allowed"

        return True, ""

    def _get_function_name(self, call_node: Node) -> Optional[str]:
        """
        Extract function name from a call expression

        Handles:
        - Direct calls: func()
        - Member calls: obj.method() or obj->method()
        - Function pointers: (*ptr)()

        Args:
            call_node: call_expression node

        Returns:
            Function name or None
        """
        function = self._find_child_by_field(call_node, 'function')
        if not function:
            return None

        if function.type == 'identifier':
            return self._get_node_text(function)
        elif function.type == 'field_expression':
            # obj.method or obj->method
            field = self._find_child_by_field(function, 'field')
            if field:
                return self._get_node_text(field)
        elif function.type == 'pointer_expression':
            # Function pointer dereference
            argument = self._find_child_by_field(function, 'argument')
            if argument and argument.type == 'identifier':
                return self._get_node_text(argument)

        return None

    def _get_include_path(self, include_node: Node) -> Optional[str]:
        """
        Extract include path from #include directive

        Handles:
        - #include <header.h>
        - #include "header.h"

        Args:
            include_node: preproc_include node

        Returns:
            Header path or None
        """
        # Find the string literal or system_lib_string child
        for child in include_node.children:
            if child.type in ['string_literal', 'system_lib_string']:
                text = self._get_node_text(child)
                # Remove quotes or angle brackets
                text = text.strip('"<>')
                return text

        return None
