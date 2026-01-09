#!/bin/bash
# Interactive testing session in Docker container
# Run this from your Mac to get a shell inside the container with test setup ready

cd "$(dirname "$0")/backend"

echo "Building Docker image..."
docker build -t codr-firejail-test . || exit 1

echo ""
echo "Starting interactive container..."
echo "The container includes:"
echo "  - Firejail (already installed)"
echo "  - Your actual firejail.profile"
echo "  - All current language runtimes"
echo ""
echo "Setting up Nix-style test environment inside container..."
echo ""

docker run --rm -it \
  --user root \
  --privileged \
  --security-opt seccomp=unconfined \
  codr-firejail-test bash -c '
# Setup function for easy re-running
setup_nix_test() {
  echo "Setting up Nix-style directory structure..."

  # Clean up any previous test
  rm -rf /nix /runtime 2>/dev/null

  # Create Nix-style paths
  mkdir -p /nix/store/python-3.11/bin
  mkdir -p /runtime/bin

  # Copy Python to fake Nix store
  cp /usr/bin/python3 /nix/store/python-3.11/bin/python3
  chmod +x /nix/store/python-3.11/bin/python3

  # Create symlink
  ln -s /nix/store/python-3.11/bin/python3 /runtime/bin/python3.11

  # Add read-only rules for Nix paths to profile
  grep -q "noblacklist /nix" /etc/firejail/sandbox.profile || cat >> /etc/firejail/sandbox.profile << EOF

# Nix support
noblacklist /nix
read-only /nix
noblacklist /runtime
read-only /runtime
EOF

  echo "✓ Setup complete!"
  echo ""
}

# Run setup
setup_nix_test

echo "=== Interactive Testing Session ==="
echo ""
echo "Nix-style directory structure created:"
echo "  /nix/store/python-3.11/bin/python3 (actual binary)"
echo "  /runtime/bin/python3.11 -> symlink"
echo ""
echo "Try these test commands:"
echo ""
echo "# 1. Direct execution:"
echo "   /runtime/bin/python3.11 -c \"print(\"hello\")\""
echo ""
echo "# 2. Basic Firejail:"
echo "   firejail /runtime/bin/python3.11 -c \"print(\"hello\")\""
echo ""
echo "# 3. With read-only /nix:"
echo "   firejail --read-only=/nix /runtime/bin/python3.11 -c \"print(\"works\")\""
echo ""
echo "# 4. Full production-like test:"
echo "   mkdir /tmp/workspace"
echo "   firejail --profile=/etc/firejail/sandbox.profile --private=/tmp/workspace /runtime/bin/python3.11 -c \"import sys; print(sys.version)\""
echo ""
echo "# 5. Security test (should FAIL to write):"
echo "   firejail --read-only=/nix /runtime/bin/python3.11 -c \"open(\"/nix/store/test\", \"w\")\""
echo ""
echo "# Re-run setup if needed:"
echo "   setup_nix_test"
echo ""
echo "Type \"exit\" when done testing."
echo ""

# Start interactive shell
bash
'
