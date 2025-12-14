"""
Code security validator using AST analysis for all languages.

AST analysis provides significantly better accuracy than regex-based validation
and is much harder to bypass with obfuscation techniques.

Goal is to block known dangerous patterns via AST analysis.
Firejail sandbox provides the primary security boundary.
"""

from typing import Tuple

from .query_validator import QueryValidator


class CodeValidator:
    """Validates code against security blocklists using AST analysis"""

    def __init__(self):
        self.validators = {}
        for lang in ["python", "javascript", "rust", "c", "cpp"]:
            self.validators[lang] = QueryValidator(lang)

    def validate(self, code: str, language: str) -> Tuple[bool, str]:
        """
        Validate code is safe to execute

        Returns:
            Tuple of (is_valid, error_message)

        Raises:
            Exception if tree-sitter is not available or parsing fails
        """
        lang_key = language.lower()
        if lang_key not in self.validators:
            return False, f"Unsupported language: {language}"
            
        return self.validators[lang_key].validate(code)
