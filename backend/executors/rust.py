from typing import List, Tuple
from .compiled_base import CompiledExecutor


class RustExecutor(CompiledExecutor):
    """Rust code executor with rustc compilation"""

    def _get_compiler_config(self) -> Tuple[str, List[str]]:
        """
        Get Rustc compiler and compilation flags

        Returns:
            Tuple of (compiler, flags)
        """
        compiler = 'rustc'
        flags = []  # No additional flags needed for basic compilation
        return (compiler, flags)
