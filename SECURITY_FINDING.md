# CRITICAL SECURITY FINDING: Firejail --private + --read-only Incompatibility

**Date:** 2026-01-09
**Severity:** HIGH
**Impact:** Nix multi-language implementation plan

---

## Summary

During testing of the proposed Nix-based multi-language support, we discovered that **Firejail's `--private` and `--read-only` flags may not work together correctly**. This creates a potential security vulnerability where student code could modify `/nix/store` binaries.

## Test Results

### ✅ Tests That Passed

1. **Direct execution** - Symlinks work correctly
2. **Basic Firejail** - Firejail executes Nix binaries
3. **Read-only alone** - `--read-only=/nix` works when used alone
4. **Private workspace** - `--private={workdir}` works for isolation

### ❌ Test That Failed (CRITICAL)

**Test 5: Security - Modify /nix/store**

```bash
# Command:
firejail --quiet --private=$WORKSPACE --read-only=/nix /runtime/bin/python3.11 -c "
    with open('/nix/store/hacked.txt', 'w') as f:
        f.write('pwned')
"

# Result:
✗ CRITICAL: Could write to /nix/store! Security bypassed!
```

**Expected:** Write should fail (read-only enforcement)
**Actual:** Write succeeded ❌

## Root Cause Analysis

### Hypothesis 1: Mount Namespace Conflict

When `--private={workdir}` is used:
1. Firejail creates a new mount namespace
2. This new namespace may override or bypass the `--read-only=/nix` flag
3. The `/nix` directory becomes writable in the private namespace

### Hypothesis 2: Flag Order Dependency

The order of `--private` and `--read-only` flags might matter:
- `--read-only` applied first, then `--private` overrides it
- Need to test different flag orderings

### Hypothesis 3: Profile vs Command-Line Flags

Command-line `--read-only` flags might not work the same way as profile-based `read-only` directives.

## Impact on Nix Proposal

### 🔴 Security Risk

If students can write to `/nix/store`:
- Could modify Python/Node/GCC binaries
- Could inject malicious code into language runtimes
- Could bypass all other security measures
- **BLOCKER for production deployment**

### Current Production Usage

Your current code uses:
```python
# From base.py:94-98
base_cmd = [
    "/usr/bin/firejail",
    "--quiet",
    "--profile=/etc/firejail/sandbox.profile",
    "--nodbus",
    f"--private={workdir}",  # ← This flag is used in production!
```

This means the issue could affect the Nix implementation since it also needs `--read-only=/nix`.

## Recommended Next Steps

### Step 1: Deep Dive Investigation (15 minutes)

Run the detailed security test:

```bash
./test-security-deep-dive.sh
```

This will test:
- A: `--read-only` alone (baseline)
- B: `--private` alone (baseline)
- C: Both flags together (the failing case)
- D: Profile-based read-only (alternative approach)
- E: Mount visibility analysis

### Step 2: Based on Results

#### If Test D (profile-based) passes:
✅ **Solution:** Use profile-based read-only enforcement instead of command-line flags

Update the Nix proposal to:
```bash
# In firejail.profile:
noblacklist /nix
read-only /nix
noblacklist /runtime
read-only /runtime
```

Instead of:
```bash
# Command-line (doesn't work):
firejail --private={workdir} --read-only=/nix ...
```

#### If Test D also fails:
⚠️ **Alternative solutions needed:**

1. **Make /nix read-only at filesystem level:**
   ```dockerfile
   # In Dockerfile.nix:
   RUN chmod -R a-w /nix
   RUN chmod -R a-w /runtime
   ```

2. **Use bind mounts instead of --private:**
   ```bash
   firejail --bind={workdir},/home/user ...
   ```

3. **Verify read-only in code:**
   ```python
   # Before execution, check:
   assert not os.access('/nix/store', os.W_OK), "Security check failed"
   ```

4. **Consider alternative to --private flag:**
   - Use `--private-home` instead of `--private={dir}`
   - Use `--private-tmp` only (no full private workspace)

## Test Again After Fixes

Once a solution is identified, re-run the full test suite:

```bash
./test-in-docker.sh
```

All tests should pass, including Test 5 (security).

## Impact on Timeline

If fixes are needed:
- **Profile-based fix:** +1-2 days (low complexity)
- **Filesystem-level fix:** +2-3 days (medium complexity)
- **Architecture change:** +5-7 days (high complexity, might need rethinking)

Add to Phase 3 (Security Testing) timeline in the proposal.

## Decision Point

**DO NOT PROCEED with Nix implementation until:**
- ✅ Test 5 passes (cannot write to /nix/store)
- ✅ All 7 tests pass consistently
- ✅ Security model verified by team security expert
- ✅ Solution documented in implementation plan

**This finding validates the importance of Phase 3 security testing in the proposal.**

---

## References

- Original proposal: `NIX_MULTILANG_ANALYSIS.md`
- Test scripts: `test-in-docker.sh`, `test-security-deep-dive.sh`
- Current executor: `backend/lib/executors/base.py:94-98`
- Firejail profile: `backend/firejail.profile`

## Next Actions

1. [ ] Run `./test-security-deep-dive.sh` to investigate root cause
2. [ ] Document findings in this file
3. [ ] Implement fix (profile-based or filesystem-level)
4. [ ] Re-test with `./test-in-docker.sh`
5. [ ] Update `NIX_MULTILANG_ANALYSIS.md` with findings
6. [ ] Update Nix implementation plan with security fix
