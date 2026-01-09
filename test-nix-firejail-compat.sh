#!/bin/bash
# Quick test: Does Firejail work with Nix-style symlinks?
# Run this to validate the approach before full implementation

set -e

echo "=== Testing Firejail + Nix-style paths compatibility ==="
echo ""

# Create test directory structure mimicking Nix
TEST_DIR=$(mktemp -d)
echo "Test directory: $TEST_DIR"

# Create fake "nix store" structure
mkdir -p $TEST_DIR/nix/store/python-3.11/bin
mkdir -p $TEST_DIR/runtime/bin

# Copy actual Python to fake nix store
cp $(which python3) $TEST_DIR/nix/store/python-3.11/bin/python3

# Create symlink (like Nix approach)
ln -s $TEST_DIR/nix/store/python-3.11/bin/python3 $TEST_DIR/runtime/bin/python3.11

echo "✓ Created Nix-style directory structure"
echo ""

# Test 1: Basic symlink execution
echo "Test 1: Execute via symlink (no Firejail)"
$TEST_DIR/runtime/bin/python3.11 -c "print('Direct execution works ✓')"
echo ""

# Test 2: Firejail with symlink
echo "Test 2: Execute via symlink with Firejail"
WORKSPACE=$(mktemp -d)

firejail \
  --quiet \
  --private=$WORKSPACE \
  --net=none \
  --read-only=$TEST_DIR/nix \
  --read-only=$TEST_DIR/runtime \
  --rlimit-cpu=5 \
  -- $TEST_DIR/runtime/bin/python3.11 -c "print('Firejail + symlink works ✓')" \
  || echo "✗ FAILED: Firejail blocked execution"

rm -rf $WORKSPACE
echo ""

# Test 3: Firejail with profile
echo "Test 3: Execute with actual Firejail profile"
WORKSPACE=$(mktemp -d)

# Create test firejail profile
PROFILE=$(mktemp)
cat > $PROFILE <<EOF
net none
nodbus
noroot
caps.drop all
private-tmp
private-dev
seccomp
read-only $TEST_DIR/nix
read-only $TEST_DIR/runtime
rlimit-cpu 5
EOF

firejail \
  --quiet \
  --profile=$PROFILE \
  --private=$WORKSPACE \
  -- $TEST_DIR/runtime/bin/python3.11 -c "import sys; print(f'Profile test works ✓ Python {sys.version}')" \
  || echo "✗ FAILED: Firejail profile blocked execution"

rm -rf $WORKSPACE
rm $PROFILE
echo ""

# Test 4: Can student code modify /nix/store?
echo "Test 4: Security test - try to modify /nix/store"
WORKSPACE=$(mktemp -d)
PROFILE=$(mktemp)
cat > $PROFILE <<EOF
net none
private-tmp
read-only $TEST_DIR/nix
EOF

firejail \
  --quiet \
  --profile=$PROFILE \
  --private=$WORKSPACE \
  -- $TEST_DIR/runtime/bin/python3.11 -c "
import os
try:
    with open('$TEST_DIR/nix/store/hacked.txt', 'w') as f:
        f.write('pwned')
    print('✗ SECURITY FAIL: Modified /nix/store')
    exit(1)
except Exception as e:
    print(f'✓ Security works: {type(e).__name__}')
" || true

rm -rf $WORKSPACE
rm $PROFILE
echo ""

# Cleanup
rm -rf $TEST_DIR
echo "=== All tests complete ==="
echo ""
echo "If all tests passed, Firejail + Nix compatibility is confirmed."
echo "If any failed, investigate before proceeding with Nix approach."
