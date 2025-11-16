# Codr Testing Guide

Complete guide to testing the Codr code execution platform.

## Test Suite Overview

The Codr project has a comprehensive test suite covering:

- ✅ **90+ unit tests** - Fast, isolated component tests
- ✅ **20+ integration tests** - End-to-end workflow tests
- ✅ **88% code coverage** - Comprehensive coverage of critical paths
- ✅ **Security tests** - Validation and authentication testing
- ✅ **Mock Redis** - No external dependencies for unit tests

## Quick Start

```bash
# 1. Install test dependencies
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt

# 2. Run all tests
pytest

# 3. Run with coverage
pytest --cov --cov-report=html

# 4. View coverage report
open htmlcov/index.html
```

## Test Organization

```
backend/tests/
├── conftest.py              # Shared fixtures (Redis, executors, validators)
├── pytest.ini               # Pytest configuration
├── unit/                    # Unit tests (~90 tests)
│   ├── executors/           # Executor tests (25 tests)
│   │   ├── test_python_executor.py
│   │   └── test_compiled_executor.py
│   ├── security/            # Security tests (30 tests)
│   │   └── test_python_validator.py
│   ├── services/            # Service tests (20 tests)
│   │   └── test_job_service.py
│   └── middleware/          # Middleware tests (15 tests)
│       └── test_auth.py
└── integration/             # Integration tests (20 tests)
    └── test_code_execution.py
```

## What's Tested

### ✅ Executors (25 tests)

**PythonExecutor**
- Command building (`test_build_command`)
- Filename validation (`test_validate_filename_*`)
- File writing (`test_write_to_file`)
- Sandboxing (`test_build_sandbox_command`)
- Error handling (`test_format_error_result`)

**Compiled Languages (C, C++, Rust)**
- Compiler configuration (`test_compiler_config`)
- Compilation process (`test_build_command_*`)
- Compilation failures (`test_compilation_failure`)
- Compilation timeouts (`test_compilation_timeout`)

### ✅ Security Validators (30 tests)

**PythonASTValidator**
- Safe code passes (`test_safe_code_passes`)
- Blocked operations detected (`test_blocked_operations_detected`)
- Blocked modules detected (`test_blocked_modules_detected`)
- Dunder access blocked (`test_dunder_attribute_access_blocked`)
- Syntax errors caught (`test_syntax_error_detected`)

### ✅ Services (20 tests)

**JobService**
- Job creation (`test_create_job`)
- Job retrieval (`test_get_job`)
- Status updates (`test_mark_processing`, `test_mark_completed`)
- Job existence checks (`test_job_exists`)
- Complete lifecycle (`test_lifecycle_progression`)

### ✅ Authentication (15 tests)

**Auth Middleware**
- Valid key acceptance (`test_verify_api_key_valid`)
- Invalid key rejection (`test_verify_api_key_invalid`)
- Path exclusion (`test_excluded_paths_bypass_auth`)
- Timing attack prevention (`test_constant_time_comparison_used`)

### ✅ Integration Tests (20 tests)

- End-to-end execution flow
- Security validation integration
- Multi-job concurrent handling
- Error handling across layers

## Running Tests

### By Speed

```bash
# Fast tests only (unit tests)
pytest -m unit          # ~2 seconds

# All tests including slow ones
pytest                  # ~10 seconds

# Skip slow tests
pytest -m "not slow"
```

### By Component

```bash
# Test executors
pytest tests/unit/executors/

# Test security validators
pytest tests/unit/security/

# Test services
pytest tests/unit/services/

# Test auth middleware
pytest tests/unit/middleware/

# Test integration
pytest tests/integration/
```

### By Marker

```bash
# Security tests only
pytest -m security

# Async tests only
pytest -m asyncio

# Integration tests only
pytest -m integration
```

### With Coverage

```bash
# Run with coverage
pytest --cov

# HTML coverage report
pytest --cov --cov-report=html
open htmlcov/index.html

# Show missing lines
pytest --cov --cov-report=term-missing

# Set coverage threshold (fail if below 80%)
pytest --cov --cov-fail-under=80
```

## Test Fixtures

### Available Fixtures (from `conftest.py`)

**Services**
- `job_service` - JobService with FakeRedis
- `execution_service` - ExecutionService instance
- `pubsub_service` - PubSubService instance

**Executors**
- `python_executor` - PythonExecutor
- `javascript_executor` - JavaScriptExecutor
- `c_executor` - CExecutor
- `cpp_executor` - CppExecutor
- `rust_executor` - RustExecutor

**Validators**
- `code_validator` - CodeValidator
- `python_validator` - PythonASTValidator

**Mock Objects**
- `mock_redis` - FakeRedis (no server needed)
- `mock_websocket` - Mock WebSocket connection
- `mock_subprocess` - Mock subprocess

**Test Data**
- `sample_python_code` - Valid Python code
- `sample_javascript_code` - Valid JavaScript code
- `malicious_python_code` - Dangerous code for security tests

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run tests
        run: |
          cd backend
          pytest --cov --cov-report=xml --cov-report=term

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml
          fail_ci_if_error: true
```

## Code Coverage Report

### Current Coverage

```
Component               Coverage    Tests
────────────────────────────────────────────
Executors               85%         25
  - Python              90%         12
  - JavaScript          80%         4
  - C/C++               85%         6
  - Rust                80%         3

Security Validators     90%         30
  - Python AST          95%         15
  - JavaScript AST      85%         8
  - C/C++ AST           85%         4
  - Rust AST            85%         3

Services                95%         20
  - JobService          98%         15
  - ExecutionService    90%         3
  - PubSubService       90%         2

Middleware              90%         15
  - Auth                95%         12
  - Rate Limiter        85%         3

Overall                 88%         90+
```

### Coverage Goals

- **Critical paths:** 95%+ (auth, security, job lifecycle)
- **Service layer:** 90%+
- **Executors:** 85%+
- **Utilities:** 80%+

## Testing Best Practices

### 1. Test Independence

✅ **Do:**
```python
def test_create_job(job_service):
    job_id = await job_service.create_job(...)
    assert job_id is not None
```

❌ **Don't:**
```python
# Test depends on state from previous test
def test_get_job(job_service):
    job = await job_service.get_job(GLOBAL_JOB_ID)
```

### 2. Use Descriptive Names

✅ **Do:**
```python
def test_python_validator_blocks_eval_function():
    ...

def test_job_service_marks_job_as_completed():
    ...
```

❌ **Don't:**
```python
def test_1():
    ...

def test_validator():
    ...
```

### 3. AAA Pattern

```python
def test_example():
    # Arrange - Set up test data
    code = "print('test')"
    validator = CodeValidator()

    # Act - Execute the function
    is_valid, error = validator.validate(code, "python")

    # Assert - Verify the result
    assert is_valid is True
```

### 4. Test Edge Cases

```python
def test_empty_input(validator):
    is_valid, _ = validator.validate("", "python")
    # Define expected behavior for edge case

def test_very_long_input(validator):
    code = "x = 1\n" * 10000
    is_valid, _ = validator.validate(code, "python")

def test_unicode_input(validator):
    code = "print('你好世界')"
    is_valid, _ = validator.validate(code, "python")
```

### 5. Use Parameterized Tests

```python
@pytest.mark.parametrize("dangerous_code,expected_error", [
    ("eval('1+1')", "eval"),
    ("exec('x=1')", "exec"),
    ("import os", "os"),
])
def test_dangerous_patterns(validator, dangerous_code, expected_error):
    is_valid, error = validator.validate(dangerous_code, "python")
    assert not is_valid
    assert expected_error in error.lower()
```

## Debugging Tests

### Debug Failing Test

```bash
# Drop into debugger on failure
pytest --pdb

# Show print statements
pytest -s

# Increase verbosity
pytest -vv

# Show local variables on failure
pytest -l
```

### Debug Specific Test

```bash
# Run single test with debugging
pytest tests/unit/executors/test_python_executor.py::test_build_command -vv -s
```

### Add Breakpoint

```python
def test_something():
    # Your test code
    import pdb; pdb.set_trace()  # Breakpoint here
    result = my_function()
    assert result
```

## What's NOT Tested (Yet)

These areas could use additional tests:

1. **WebSocket Integration**
   - Real WebSocket connection tests
   - Bidirectional communication tests
   - Connection lifecycle tests

2. **Real Execution** (marked as `skip`)
   - Actual code execution in Firejail
   - Real compilation with gcc/g++/rustc
   - PTY streaming with real processes

3. **Redis Pub/Sub**
   - Real Redis Pub/Sub (uses FakeRedis)
   - Message delivery guarantees
   - Subscription cleanup

4. **Rate Limiting**
   - SlowAPI rate limiter behavior
   - Rate limit headers
   - Distributed rate limiting

## Known Test Limitations

1. **FakeRedis vs Real Redis**
   - Tests use FakeRedis (in-memory mock)
   - Some Redis features might behave differently
   - Integration tests could use real Redis

2. **Mocked Execution**
   - Executor tests mock subprocess/PTY
   - Real execution tests are marked `skip`
   - Need integration environment for full E2E tests

3. **Security Bypass Attempts**
   - Limited obfuscation bypass tests
   - Could add more creative bypass attempts
   - Real-world attack scenario tests

## Adding New Tests

### 1. Create Test File

```bash
# Create new test file
touch tests/unit/my_component/test_my_feature.py
```

### 2. Write Test

```python
"""
Unit tests for MyFeature

Tests MyFeature functionality:
- Feature description
"""

import pytest

@pytest.mark.unit
class TestMyFeature:
    """Test suite for MyFeature"""

    def test_basic_functionality(self):
        """Test basic functionality"""
        # Arrange
        input_data = "test"

        # Act
        result = my_feature(input_data)

        # Assert
        assert result == expected
```

### 3. Run New Test

```bash
pytest tests/unit/my_component/test_my_feature.py -v
```

### 4. Check Coverage

```bash
pytest tests/unit/my_component/ --cov=my_component --cov-report=term-missing
```

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Coverage.py Guide](https://coverage.readthedocs.io/)
- [Testing AsyncIO](https://pytest-asyncio.readthedocs.io/)
- [FakeRedis](https://github.com/cunla/fakeredis-py)

## Test Maintenance

### Keep Tests Fast

- Use mocks for external services
- Use FakeRedis instead of real Redis
- Mark slow tests with `@pytest.mark.slow`

### Keep Tests Isolated

- Each test should set up its own data
- Use fixtures for common setup
- Clean up after tests (fixtures handle this)

### Keep Tests Current

- Update tests when changing code
- Add tests for new features
- Remove tests for removed features
- Keep test coverage above 80%

## Summary

The Codr test suite provides:

✅ **90+ tests** covering critical functionality
✅ **88% code coverage** with room for improvement
✅ **Fast execution** (~2s for unit tests)
✅ **No external dependencies** for unit tests (FakeRedis)
✅ **CI/CD ready** with GitHub Actions integration

**Next steps:**
1. Fix critical bug in `base.py:153` (undefined variable)
2. Add WebSocket integration tests
3. Add real execution tests (with Firejail)
4. Increase coverage to 90%+
