#!/bin/bash
# Deep dive into the security issue found in Test 5
# Investigate why --private + --read-only doesn't work

cd "$(dirname "$0")/backend"

echo "Building Docker image..."
docker build -t codr-firejail-test . -q

echo ""
echo "=== Investigating Security Issue ==="
echo ""

docker run --rm -it \
  --user root \
  --privileged \
  --security-opt seccomp=unconfined \
  codr-firejail-test bash -c '
set -e

# Setup
mkdir -p /nix/store/test
mkdir -p /runtime/bin
cp /usr/bin/python3 /runtime/bin/python-test
echo "Setup complete"
echo ""

# Test A: read-only ONLY (no --private)
echo "Test A: --read-only=/nix (no --private)"
firejail \
  --quiet \
  --read-only=/nix \
  /runtime/bin/python-test -c "
try:
    open(\"/nix/store/test/file1.txt\", \"w\").write(\"test\")
    print(\"  ✗ FAIL: Could write to /nix/store\")
except Exception as e:
    print(f\"  ✓ PASS: Blocked write ({type(e).__name__})\")
"
echo ""

# Test B: --private ONLY (no read-only)
echo "Test B: --private=/tmp/workspace (no --read-only)"
mkdir -p /tmp/workspace-b
firejail \
  --quiet \
  --private=/tmp/workspace-b \
  /runtime/bin/python-test -c "
try:
    open(\"/nix/store/test/file2.txt\", \"w\").write(\"test\")
    print(\"  ✗ FAIL: Could write to /nix/store\")
except Exception as e:
    print(f\"  ✓ PASS: Blocked write ({type(e).__name__})\")
"
rm -rf /tmp/workspace-b
echo ""

# Test C: BOTH --private AND --read-only (the failing case)
echo "Test C: --private + --read-only (BOTH)"
mkdir -p /tmp/workspace-c
firejail \
  --quiet \
  --private=/tmp/workspace-c \
  --read-only=/nix \
  /runtime/bin/python-test -c "
try:
    open(\"/nix/store/test/file3.txt\", \"w\").write(\"test\")
    print(\"  ✗ FAIL: Could write to /nix/store\")
except Exception as e:
    print(f\"  ✓ PASS: Blocked write ({type(e).__name__})\")
"
rm -rf /tmp/workspace-c
echo ""

# Test D: Using noblacklist + read-only (alternative approach)
echo "Test D: Using noblacklist + read-only in profile"
PROFILE=$(mktemp)
cat > $PROFILE <<EOF
private-tmp
noblacklist /nix
read-only /nix
EOF

mkdir -p /tmp/workspace-d
firejail \
  --quiet \
  --profile=$PROFILE \
  --private=/tmp/workspace-d \
  /runtime/bin/python-test -c "
try:
    open(\"/nix/store/test/file4.txt\", \"w\").write(\"test\")
    print(\"  ✗ FAIL: Could write to /nix/store\")
except Exception as e:
    print(f\"  ✓ PASS: Blocked write ({type(e).__name__})\")
"
rm -rf /tmp/workspace-d
rm $PROFILE
echo ""

# Test E: Check if /nix is actually mounted
echo "Test E: Check /nix visibility inside --private namespace"
mkdir -p /tmp/workspace-e
firejail \
  --quiet \
  --private=/tmp/workspace-e \
  --read-only=/nix \
  /runtime/bin/python-test -c "
import os
print(f\"  /nix exists: {os.path.exists(\"/nix\")}\")
print(f\"  /nix/store exists: {os.path.exists(\"/nix/store\")}\")
if os.path.exists(\"/nix/store/test\"):
    print(f\"  /nix/store/test exists: True\")
    try:
        files = os.listdir(\"/nix/store/test\")
        print(f\"  Files in /nix/store/test: {files}\")
    except Exception as e:
        print(f\"  Cannot list /nix/store/test: {e}\")
"
rm -rf /tmp/workspace-e
echo ""

echo "=== Analysis ==="
echo ""
echo "If Test C failed (could write to /nix):"
echo "  - This is a CRITICAL security issue"
echo "  - The Nix approach needs a different security strategy"
echo "  - Options:"
echo "    1. Use profile-based read-only (Test D)"
echo "    2. Make /nix read-only at filesystem level (in Dockerfile)"
echo "    3. Use bind mounts instead of --private"
echo ""
echo "If Test D passed:"
echo "  - Using profile configuration works better than command-line flags"
echo "  - Update the proposal to use profile-based read-only enforcement"
'
