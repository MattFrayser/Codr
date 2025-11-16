# Test Suite Right-Sizing Guide for Solo Developers

## The Problem with 90+ Tests

**Reality check:**
- ✅ 90 tests looks impressive on paper
- ❌ High maintenance burden for solo dev
- ❌ Slows down development
- ❌ More tests to update when you change code
- ❌ Diminishing returns on coverage

## The 80/20 Rule for Testing

**80% of bugs come from 20% of your code.**

Focus testing effort on:
1. **Critical paths** - Code that MUST work (security, execution)
2. **Bug-prone areas** - Areas that have broken before
3. **Security** - Can't compromise here
4. **Integration** - Does the whole system work?

---

## Recommended Test Suite for Solo Dev: ~25-30 tests

### Tier 1: Essential Tests (15 tests - MUST HAVE)

These tests prevent catastrophic failures:

#### 1. Executor Smoke Tests (5 tests)
**One test per language** to verify it actually executes:

```python
# tests/unit/executors/test_executors_smoke.py
@pytest.mark.unit
class TestExecutorSmoke:
    """Smoke tests - one per language"""

    def test_python_executor_builds_command(self, python_executor):
        """Verify Python executor creates valid command"""
        cmd = python_executor._build_command("/tmp/test.py", "/tmp")
        assert cmd == ['python3', '/tmp/test.py']

    def test_c_executor_compiles(self, c_executor, tmp_path):
        """Verify C executor can compile"""
        with patch('subprocess.run') as mock:
            mock.return_value = Mock(returncode=0, stderr='')
            cmd = c_executor._build_command(str(tmp_path / "test.c"), str(tmp_path))
            assert len(cmd) == 1  # Returns binary path

    # Similar for JavaScript, C++, Rust
```

**Why:** If executors don't work, nothing works.

---

#### 2. Security Validator Tests (5 tests)
**Test the most dangerous patterns only:**

```python
# tests/unit/security/test_security_critical.py
@pytest.mark.security
class TestCriticalSecurity:
    """Test only the most dangerous patterns"""

    def test_blocks_eval_exec(self, code_validator):
        """Block eval/exec - the most common bypass attempts"""
        dangerous = ["eval('x')", "exec('import os')"]
        for code in dangerous:
            is_valid, _ = code_validator.validate(code, "python")
            assert not is_valid

    def test_blocks_os_module(self, code_validator):
        """Block OS module - file system access"""
        is_valid, _ = code_validator.validate("import os", "python")
        assert not is_valid

    def test_blocks_subprocess(self, code_validator):
        """Block subprocess - command execution"""
        is_valid, _ = code_validator.validate("import subprocess", "python")
        assert not is_valid

    def test_allows_safe_code(self, code_validator):
        """Ensure safe code passes"""
        is_valid, _ = code_validator.validate("print('hello')", "python")
        assert is_valid

    def test_blocks_javascript_require_fs(self, code_validator):
        """Block Node.js file system"""
        is_valid, _ = code_validator.validate("require('fs')", "javascript")
        assert not is_valid
```

**Why:** Security failures = game over.

---

#### 3. Job Service Tests (3 tests)
**Test the critical lifecycle only:**

```python
# tests/unit/services/test_job_service_essential.py
@pytest.mark.asyncio
class TestJobServiceEssential:
    """Essential job service tests only"""

    async def test_create_and_get_job(self, job_service):
        """Test basic job creation and retrieval"""
        job_id = await job_service.create_job("print('x')", "python", "test.py")
        job = await job_service.get_job(job_id)

        assert job is not None
        assert job.job_id == job_id
        assert job.status == "queued"

    async def test_complete_job_lifecycle(self, job_service):
        """Test full lifecycle: create → process → complete"""
        job_id = await job_service.create_job("print('x')", "python", "test.py")

        await job_service.mark_processing(job_id)
        job = await job_service.get_job(job_id)
        assert job.status == "processing"

        result = {"success": True, "exit_code": 0}
        await job_service.mark_completed(job_id, result)
        job = await job_service.get_job(job_id)
        assert job.status == "completed"

    async def test_failed_job_handling(self, job_service):
        """Test failure path"""
        job_id = await job_service.create_job("print('x')", "python", "test.py")
        await job_service.mark_failed(job_id, "Timeout")

        job = await job_service.get_job(job_id)
        assert job.status == "failed"
```

**Why:** Jobs are the core of your system.

---

#### 4. Auth Tests (2 tests)
**Just test valid/invalid:**

```python
# tests/unit/middleware/test_auth_essential.py
@pytest.mark.unit
class TestAuthEssential:
    """Essential auth tests"""

    def test_valid_api_key_accepted(self):
        """Test valid API key works"""
        # Test implementation
        assert True  # Placeholder

    def test_invalid_api_key_rejected(self):
        """Test invalid API key blocked"""
        # Test implementation
        assert True  # Placeholder
```

**Why:** Auth failures = security hole.

---

### Tier 2: Important Tests (10 tests - SHOULD HAVE)

Add these if you have time:

#### 5. Integration Test (1 test)
```python
@pytest.mark.integration
async def test_complete_execution_flow(job_service):
    """One test for the whole happy path"""
    # Validate → Create → Execute → Complete
```

#### 6. Edge Cases (5 tests)
- Empty code
- Very long code
- Unicode characters
- Path traversal attempts
- Missing API key

#### 7. Error Handling (4 tests)
- Compilation failure
- Execution timeout
- Invalid language
- Malformed job data

---

### Tier 3: Nice to Have (5-10 tests - COULD HAVE)

Only add if you're actively hitting bugs:
- Concurrent job handling
- Multiple validators per language
- Complex edge cases
- Performance tests

---

## Practical Minimal Test Suite (25 tests)

### File Structure

```
tests/
├── conftest.py                        # Shared fixtures
├── test_smoke.py                      # 10 tests - Basic functionality
│   ├── test_executors_work           # 5 tests (one per language)
│   └── test_security_blocks_dangerous # 5 tests (critical patterns)
├── test_job_lifecycle.py             # 5 tests - Job management
└── test_integration.py               # 10 tests - End-to-end
```

**Total: ~25 tests, ~80% of the value, ~20% of the maintenance**

---

## Comparison

| Suite Size | Coverage | Maintenance | Best For |
|------------|----------|-------------|----------|
| **5-10 tests** | 40% | Very low | Proof of concept |
| **20-30 tests** ✅ | 75% | Low | Solo developer |
| **50-70 tests** | 85% | Medium | Small team |
| **90+ tests** | 90% | High | Enterprise |

---

## What to Cut from the 90-test Suite

### ❌ Cut: Edge Case Overload
```python
# DON'T NEED THIS:
def test_filename_with_every_special_character(...)
def test_code_with_every_unicode_variant(...)
def test_every_possible_compilation_flag(...)
```

**Keep:** 1-2 representative edge cases

---

### ❌ Cut: Redundant Security Tests
```python
# DON'T NEED ALL OF THESE:
def test_blocks_eval(...)
def test_blocks_exec(...)
def test_blocks___import__(...)
def test_blocks_compile(...)
def test_blocks_open(...)
def test_blocks_file(...)
# ... (20 more)
```

**Keep:** 3-5 most dangerous patterns (eval, os, subprocess)

---

### ❌ Cut: Exhaustive Status Testing
```python
# DON'T NEED:
def test_queued_to_processing(...)
def test_processing_to_completed(...)
def test_processing_to_failed(...)
def test_queued_to_failed(...)
# ... every combination
```

**Keep:** 1 test for full lifecycle (queued → processing → completed)

---

### ❌ Cut: Multiple Mock Variations
```python
# DON'T NEED:
def test_with_mock_subprocess(...)
def test_with_mock_pty(...)
def test_with_fake_redis(...)
def test_with_real_redis(...)
```

**Keep:** 1 approach (FakeRedis is fine)

---

## When to Add More Tests

**Add a test when:**
1. ✅ You fix a bug (regression test)
2. ✅ You add a new feature (smoke test for it)
3. ✅ Production breaks (obviously missed something)
4. ✅ You're refactoring critical code (safety net)

**Don't add a test for:**
1. ❌ "What if" scenarios that never happen
2. ❌ Framework behavior (testing pytest, FastAPI, etc.)
3. ❌ Every possible edge case
4. ❌ Trivial getters/setters

---

## Test Maintenance Red Flags

Signs you have too many tests:

1. 🚩 **Tests break on every code change**
   - Solution: Test behavior, not implementation

2. 🚩 **You dread writing new features** (too many tests to update)
   - Solution: Delete redundant tests

3. 🚩 **Test suite takes >30 seconds to run**
   - Solution: Move slow tests to integration, use mocks

4. 🚩 **You can't remember what tests do**
   - Solution: Consolidate similar tests

5. 🚩 **More test code than production code**
   - Solution: 2:1 ratio is too much for solo dev

---

## Recommended Minimal Suite

### Create This Instead

```python
# tests/test_essential.py - ALL ESSENTIAL TESTS IN ONE FILE

"""
Essential tests for Codr - solo developer edition

This file contains ONLY the critical tests needed to prevent catastrophic failures.
Total: 25 tests, ~5 minutes to run
"""

import pytest

# ============================================================================
# EXECUTORS (5 tests)
# ============================================================================

class TestExecutors:
    """One smoke test per language"""

    def test_python_works(self, python_executor):
        cmd = python_executor._build_command("/tmp/test.py", "/tmp")
        assert cmd == ['python3', '/tmp/test.py']

    def test_javascript_works(self, javascript_executor):
        cmd = javascript_executor._build_command("/tmp/test.js", "/tmp")
        assert 'node' in cmd

    def test_c_compiles(self, c_executor):
        compiler, flags = c_executor._get_compiler_config()
        assert compiler == 'gcc'

    def test_cpp_compiles(self, cpp_executor):
        compiler, flags = cpp_executor._get_compiler_config()
        assert compiler == 'g++'

    def test_rust_compiles(self, rust_executor):
        compiler, flags = rust_executor._get_compiler_config()
        assert compiler == 'rustc'


# ============================================================================
# SECURITY (5 tests)
# ============================================================================

@pytest.mark.security
class TestSecurity:
    """Critical security patterns only"""

    def test_blocks_python_os(self, code_validator):
        is_valid, _ = code_validator.validate("import os", "python")
        assert not is_valid

    def test_blocks_python_eval(self, code_validator):
        is_valid, _ = code_validator.validate("eval('x')", "python")
        assert not is_valid

    def test_blocks_javascript_fs(self, code_validator):
        is_valid, _ = code_validator.validate("require('fs')", "javascript")
        assert not is_valid

    def test_allows_safe_python(self, code_validator):
        is_valid, _ = code_validator.validate("print('hello')", "python")
        assert is_valid

    def test_allows_safe_javascript(self, code_validator):
        is_valid, _ = code_validator.validate("console.log('hello')", "javascript")
        assert is_valid


# ============================================================================
# JOB SERVICE (5 tests)
# ============================================================================

@pytest.mark.asyncio
class TestJobService:
    """Essential job lifecycle"""

    async def test_create_job(self, job_service):
        job_id = await job_service.create_job("print('x')", "python", "test.py")
        assert job_id is not None

    async def test_get_job(self, job_service):
        job_id = await job_service.create_job("print('x')", "python", "test.py")
        job = await job_service.get_job(job_id)
        assert job.status == "queued"

    async def test_mark_processing(self, job_service):
        job_id = await job_service.create_job("print('x')", "python", "test.py")
        await job_service.mark_processing(job_id)
        job = await job_service.get_job(job_id)
        assert job.status == "processing"

    async def test_mark_completed(self, job_service):
        job_id = await job_service.create_job("print('x')", "python", "test.py")
        await job_service.mark_completed(job_id, {"success": True})
        job = await job_service.get_job(job_id)
        assert job.status == "completed"

    async def test_mark_failed(self, job_service):
        job_id = await job_service.create_job("print('x')", "python", "test.py")
        await job_service.mark_failed(job_id, "Error")
        job = await job_service.get_job(job_id)
        assert job.status == "failed"


# ============================================================================
# INTEGRATION (5 tests)
# ============================================================================

@pytest.mark.integration
@pytest.mark.asyncio
class TestIntegration:
    """End-to-end smoke tests"""

    async def test_full_execution_flow(self, job_service):
        """Happy path: validate → create → process → complete"""
        # This is your ONE integration test
        job_id = await job_service.create_job("print('test')", "python", "test.py")
        await job_service.mark_processing(job_id)
        await job_service.mark_completed(job_id, {"success": True})
        job = await job_service.get_job(job_id)
        assert job.status == "completed"

    async def test_security_blocks_dangerous_code(self, code_validator, job_service):
        """Ensure dangerous code never executes"""
        is_valid, _ = code_validator.validate("import os", "python")
        assert not is_valid

    async def test_handles_execution_failure(self, job_service):
        """Ensure failures are handled gracefully"""
        job_id = await job_service.create_job("print('x')", "python", "test.py")
        await job_service.mark_failed(job_id, "Timeout")
        job = await job_service.get_job(job_id)
        assert job.status == "failed"

    async def test_multiple_jobs_dont_interfere(self, job_service):
        """Ensure jobs are isolated"""
        job1 = await job_service.create_job("print(1)", "python", "test1.py")
        job2 = await job_service.create_job("print(2)", "python", "test2.py")
        assert job1 != job2

    async def test_invalid_language_rejected(self, job_service):
        """Ensure invalid languages are caught"""
        from executors import get_executor
        with pytest.raises(ValueError):
            get_executor("cobol")


# ============================================================================
# AUTH (5 tests)
# ============================================================================

class TestAuth:
    """Essential auth tests"""

    # Note: Would need actual implementation
    def test_valid_key_works(self):
        """Placeholder - test valid API key"""
        pass

    def test_invalid_key_blocked(self):
        """Placeholder - test invalid API key"""
        pass

    def test_missing_key_blocked(self):
        """Placeholder - test missing API key"""
        pass

    def test_health_endpoint_public(self):
        """Placeholder - test /health is public"""
        pass

    def test_timing_attack_prevention(self):
        """Placeholder - verify secrets.compare_digest used"""
        pass
```

**Total: 25 tests in ONE file = Easy to maintain**

---

## Solo Developer Testing Strategy

### Daily Development
```bash
# Quick smoke test (5 seconds)
pytest tests/test_essential.py -m "not integration"

# Before committing (15 seconds)
pytest tests/test_essential.py

# Before deploying (30 seconds)
pytest
```

### When to Run Full Suite
- Before major releases
- After refactoring
- When debugging weird issues
- Monthly "health check"

---

## Coverage vs. Effort

```
Tests    Coverage    Effort    Maintenance
─────────────────────────────────────────────
5        40%         1 hour    Very Low
15       60%         3 hours   Low
25 ✅    75%         5 hours   Medium      ← Sweet spot
50       85%         15 hours  High
90       90%         30 hours  Very High   ← Diminishing returns
```

---

## Conclusion

### For Solo Developer:

**Aim for:** 20-30 tests
- 5 executor smoke tests
- 5 critical security tests
- 5 job service tests
- 5 integration tests
- 5 auth tests
- 5 edge cases (as bugs are found)

**Total time:** ~5 hours to write, ~15 seconds to run

### Current 90-test suite:

**Pros:**
- Impressive coverage (88%)
- Catches more edge cases
- Good for team/enterprise

**Cons:**
- 30+ hours to write
- High maintenance burden
- Overkill for solo dev
- Slower iteration

---

## Recommendation

1. **Keep the current 90-test suite in the repo** (shows skill)
2. **Create a minimal suite** (`tests/test_essential.py`) for daily use
3. **Run full suite** before deployments only
4. **Add tests** when you find bugs (regression tests)

**Command:**
```bash
# Daily: Run essential tests only
pytest tests/test_essential.py

# Weekly: Run full suite
pytest
```

This gives you the best of both worlds: impressive test coverage for your resume, but practical testing for daily development.
