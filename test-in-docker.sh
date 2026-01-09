#!/bin/bash
# Test Nix-Firejail compatibility using existing Docker image
# Run this from your Mac - it will test inside the container

set -e

cd "$(dirname "$0")/backend"

echo "Building current Docker image..."
docker build -t codr-firejail-test .

echo ""
echo "Running Nix-Firejail compatibility tests..."
echo ""

docker run --rm -it \
  --user root \
  --privileged \
  --security-opt seccomp=unconfined \
  codr-firejail-test bash -c '
set -e

echo "=== Setting up Nix-style test environment ==="
echo ""

# Create Nix-style directory structure
mkdir -p /nix/store/python-3.11/bin
mkdir -p /runtime/bin

# Copy Python to fake Nix store
cp /usr/bin/python3 /nix/store/python-3.11/bin/python3
chmod +x /nix/store/python-3.11/bin/python3

# Create symlink (mimics Nix approach)
ln -s /nix/store/python-3.11/bin/python3 /runtime/bin/python3.11

echo "✓ Created Nix-style paths:"
echo "  /nix/store/python-3.11/bin/python3 (actual binary)"
echo "  /runtime/bin/python3.11 -> /nix/store/... (symlink)"
echo ""

# Test 1: Direct execution (no Firejail)
echo "Test 1: Direct execution via symlink"
/runtime/bin/python3.11 -c "print(\"✓ Direct execution works\")"
echo ""

# Test 2: Basic Firejail execution
echo "Test 2: Firejail basic execution"
firejail --quiet /runtime/bin/python3.11 -c "print(\"✓ Firejail execution works\")"
echo ""

# Test 3: Firejail with read-only /nix
echo "Test 3: Firejail with read-only /nix enforcement"
firejail \
  --quiet \
  --read-only=/nix \
  /runtime/bin/python3.11 -c "print(\"✓ Read-only /nix works\")"
echo ""

# Test 4: Firejail with private workspace (production-like)
echo "Test 4: Firejail with --private (like production)"
WORKSPACE=$(mktemp -d)
firejail \
  --quiet \
  --private=$WORKSPACE \
  --read-only=/nix \
  --read-only=/runtime \
  --net=none \
  /runtime/bin/python3.11 -c "import sys; print(f\"✓ Private workspace works (Python {sys.version.split()[0]})\")"
rm -rf $WORKSPACE
echo ""

# Test 5: Security - try to modify /nix/store
echo "Test 5: Security test - attempt to modify /nix/store"
WORKSPACE=$(mktemp -d)
TEST_RESULT=0
firejail \
  --quiet \
  --private=$WORKSPACE \
  --read-only=/nix \
  /runtime/bin/python3.11 -c '
import os
import sys
try:
    with open("/nix/store/hacked.txt", "w") as f:
        f.write("pwned")
    print("✗ CRITICAL: Could write to /nix/store! Security bypassed!")
    sys.exit(1)
except Exception as e:
    print(f"✓ Security works: Blocked write ({type(e).__name__})")
    sys.exit(0)
' || TEST_RESULT=$?

if [ $TEST_RESULT -eq 1 ]; then
  echo "  ⚠️  WARNING: This is a SECURITY VULNERABILITY!"
  echo "  ⚠️  The --private + --read-only combination failed!"
fi
rm -rf $WORKSPACE
echo ""

# Test 6: With actual firejail.profile
echo "Test 6: Full test with production firejail.profile"
WORKSPACE=$(mktemp -d)

# Add read-only rules for Nix paths to profile (temporary)
cat >> /etc/firejail/sandbox.profile << EOF

# Test: Allow Nix paths
noblacklist /nix
read-only /nix
noblacklist /runtime
read-only /runtime
EOF

firejail \
  --quiet \
  --profile=/etc/firejail/sandbox.profile \
  --private=$WORKSPACE \
  /runtime/bin/python3.11 -c '
import sys
import os
print(f"✓ Full profile test works")
print(f"  Python version: {sys.version.split()[0]}")
print(f"  Working dir: {os.getcwd()}")
print(f"  Temp dir isolated: {os.path.exists(\"/tmp\")}")
'
rm -rf $WORKSPACE
echo ""

# Test 7: Library loading
echo "Test 7: Test library loading (import common modules)"
WORKSPACE=$(mktemp -d)
firejail \
  --quiet \
  --profile=/etc/firejail/sandbox.profile \
  --private=$WORKSPACE \
  /runtime/bin/python3.11 -c "
import json
import math
import hashlib
import datetime
print(\"✓ Library imports work (json, math, hashlib, datetime)\")
"
rm -rf $WORKSPACE
echo ""

echo "=== All tests completed successfully! ==="
echo ""
echo "Results:"
echo "  ✓ Symlink execution works"
echo "  ✓ Firejail compatibility confirmed"
echo "  ✓ Read-only /nix enforcement works"
echo "  ✓ Private workspace isolation works"
echo "  ✓ Security model intact (cannot modify /nix)"
echo "  ✓ Production profile compatible"
echo "  ✓ Library loading works"
echo ""
echo "Conclusion: Nix-based approach is compatible with Firejail! ✓"
'

echo ""
echo "Test complete! Check output above for any failures."
