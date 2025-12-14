import pytest
from lib.security.query_validator import QueryValidator

class TestUniversalValidator:
    
    def test_python_security(self):
        v = QueryValidator("python")
        
        # Should Block
        assert not v.validate("eval('1+1')")[0]
        assert not v.validate("import os")[0]
        assert not v.validate("from sys import exit")[0]
        assert not v.validate("class X: pass\nprint(X.__subclasses__())")[0]
        
        # Should Pass
        assert v.validate("print('Hello')")[0]
        assert v.validate("def add(a,b): return a+b")[0]
        assert v.validate("import math")[0]

    def test_javascript_obfuscation(self):
        v = QueryValidator("javascript")
        
        # Direct
        assert not v.validate("eval('x')")[0]
        # Obfuscated / Subscript
        assert not v.validate("window['eval']('x')")[0]
        assert not v.validate("obj['constructor']")[0]
        
    def test_rust_unsafe(self):
        v = QueryValidator("rust")
        assert not v.validate("unsafe { }")[0]
        assert not v.validate("extern \"C\" fn x() {}")[0]
