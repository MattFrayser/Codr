# Testing Nix-Firejail Compatibility on Mac

Since Firejail is Linux-only and you're on Mac, these scripts let you test inside Docker containers using your existing Dockerfile.

## Quick Start

### Option 1: Automated Tests (Recommended First)

Run all tests automatically:

```bash
./test-in-docker.sh
```

This will:
1. Build your existing Docker image
2. Create Nix-style directory structure inside container
3. Run 7 comprehensive tests
4. Report results

**Expected output:**
```
✓ Direct execution works
✓ Firejail execution works
✓ Read-only /nix works
✓ Private workspace works
✓ Security works: Cannot modify /nix/store
✓ Full profile test works
✓ Library imports work
```

**Time:** ~2-3 minutes (includes Docker build)

### Option 2: Interactive Testing

Get a shell inside the container to manually experiment:

```bash
./test-in-docker-interactive.sh
```

This opens a bash shell with:
- Firejail installed
- Nix-style paths set up (`/nix/store/...` and `/runtime/bin/...`)
- Your actual `firejail.profile` loaded
- Helper commands ready to copy-paste

**Try these commands inside the container:**

```bash
# Test 1: Direct execution
/runtime/bin/python3.11 -c "print('hello')"

# Test 2: Through Firejail
firejail /runtime/bin/python3.11 -c "print('hello')"

# Test 3: With read-only enforcement
firejail --read-only=/nix /runtime/bin/python3.11 -c "print('works')"

# Test 4: Full production setup
mkdir /tmp/workspace
firejail \
  --profile=/etc/firejail/sandbox.profile \
  --private=/tmp/workspace \
  /runtime/bin/python3.11 -c "import sys; print(sys.version)"

# Test 5: Security test (should fail - that's good!)
firejail --read-only=/nix /runtime/bin/python3.11 -c "open('/nix/store/test', 'w')"
```

## What's Being Tested

These tests validate that:

1. **Symlinks work** - `/runtime/bin/python3.11` → `/nix/store/.../python3`
2. **Firejail doesn't break symlink resolution**
3. **Read-only enforcement works** - Students can't modify `/nix/store`
4. **Private workspaces don't break Nix paths**
5. **Library loading works** - Python can find its standard libraries
6. **Your actual firejail.profile is compatible**
7. **Network isolation, seccomp, etc. still work**

## Troubleshooting

### "docker: command not found"

Make sure Docker Desktop is running on your Mac.

### "Operation not permitted" errors

The scripts include `--privileged` and `--security-opt seccomp=unconfined` flags which are needed for Firejail to work inside Docker. This is normal and expected.

### Tests fail with "Permission denied"

This might indicate a real compatibility issue. Look at which specific test fails:
- If Test 5 (security test) "fails" - **that's good!** (means security works)
- If Tests 1-4 fail - might be a real issue, investigate further

### Want to test with Node.js or other languages?

In the interactive shell, you can set up other language versions:

```bash
# Inside container:
mkdir -p /nix/store/node-20/bin
cp /usr/bin/node /nix/store/node-20/bin/node
ln -s /nix/store/node-20/bin/node /runtime/bin/node20

# Test it
firejail /runtime/bin/node20 -e "console.log('works')"
```

## Understanding Results

### ✅ All tests pass = Good to proceed

The Nix approach is compatible with your Firejail setup. You can confidently move forward with the implementation.

### ⚠️ Some tests fail = Investigate

- Check which specific test failed
- Look at error messages
- Test might need adjustment for your specific setup

### ❌ Most tests fail = Rethink approach

If basic execution through Firejail fails, you might need to:
- Adjust firejail.profile settings
- Use alternative approach (multiple Dockerfiles, etc.)
- Debug Firejail configuration

## Next Steps After Testing

1. **If tests pass:** Consider implementing the MVP approach first (3 versions per language) before full Nix migration
2. **If tests fail:** Debug issues or consider alternative approaches from the analysis document
3. **Either way:** Review `NIX_MULTILANG_ANALYSIS.md` for full cost-benefit analysis

## Technical Details

The test creates this structure inside the container:

```
/nix/store/python-3.11/
└── bin/
    └── python3              (actual binary, copied from /usr/bin/python3)

/runtime/bin/
└── python3.11 -> /nix/store/python-3.11/bin/python3  (symlink)

/etc/firejail/
└── sandbox.profile          (your actual profile + Nix path rules)
```

This mimics exactly what the Nix approach would create, without actually using Nix (for faster testing).
