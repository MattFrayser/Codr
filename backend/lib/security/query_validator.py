"""
High-performance query-based validator using Tree-sitter queries.
Single validator for all languages
"""

from tree_sitter import Language, Parser, Query
from typing import Tuple, Dict
from pathlib import Path
import tree_sitter_python, tree_sitter_javascript, tree_sitter_rust, tree_sitter_c, tree_sitter_cpp

class QueryValidator:
    LANGUAGE_CONFIG = {
        "python":     (tree_sitter_python, "python.scm"),
        "javascript": (tree_sitter_javascript, "javascript.scm"),
        "js":         (tree_sitter_javascript, "javascript.scm"),
        "rust":       (tree_sitter_rust, "rust.scm"),
        "c":          (tree_sitter_c, "c_cpp.scm"),
        "cpp":        (tree_sitter_cpp, "c_cpp.scm"),
        "c++":        (tree_sitter_cpp, "c_cpp.scm"),
    }

    #  avoid re-compiling per instance
    _QUERY_CACHE = {}

    def __init__(self, language: str):
        self.language_name = language.lower()
        if self.language_name not in self.LANGUAGE_CONFIG:
            raise ValueError(f"Unsupported language: {language}")

        ts_module, query_file = self.LANGUAGE_CONFIG[self.language_name]

        self.ts_language = Language(ts_module.language())
        self.parser = Parser(self.ts_language)

        if self.language_name not in self._QUERY_CACHE:
            query_path = Path(__file__).parent / "security_patterns" / query_file
            if not query_path.exists():
                raise FileNotFoundError(f"Missing patterns file: {query_path}")
                
            with open(query_path, "r") as f:
                # Expensive operation, done once
                self._QUERY_CACHE[self.language_name] = self.ts_language.query(f.read())

        self.query = self._QUERY_CACHE[self.language_name]

    def validate(self, code: str) -> Tuple[bool, str]:
        try:
            tree = self.parser.parse(bytes(code, "utf8"))
        except Exception as e:
            return False, f"Parser error: {e}"

        if tree.root_node.has_error:
            return False, "Syntax error in code"

        captures = self.query.captures(tree.root_node)

        if captures:
            capture_name, nodes = next(iter(captures.items()))
            node = nodes[0]
            error_msg = capture_name.replace("_", " ").capitalize()# snake_case capture to readable error
            snippet = code[node.start_byte:min(node.end_byte, node.start_byte + 50)]
            return False, f"{error_msg}: {snippet}"

        return True, ""


