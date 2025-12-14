# Firejail security profile for Codr code execution (container-compatible)
# Simplified for Docker/Fly.io environment

# Disable network access
net none

# No D-Bus access
nodbus

# No root access
noroot

# Drop all capabilities
caps.drop all

# Disable shell command history
disable-mnt

# Hide sensitive directories
blacklist /boot
blacklist /media
blacklist /mnt
blacklist /opt
blacklist /run/user
blacklist /srv

# Prevent access to sensitive files even in /tmp
blacklist /tmp/.X11-unix
blacklist /tmp/.ICE-unix
blacklist ${HOME}/.ssh
blacklist ${HOME}/.gnupg

# Private isolated environment
private-tmp
private-dev
private-cache

# Seccomp filter - block dangerous syscalls
seccomp
seccomp.block-secondary

# Read-only paths (protect system files)
read-only /bin
read-only /lib
read-only /lib64
read-only /usr
read-only /etc
read-only /sbin

# Set nice value (lower priority)
nice 10

# Limit resources
rlimit-cpu 10
rlimit-fsize 10485760    # 10MB (was 100KB) - students create logs
rlimit-nproc 60          # 60 processes (was 10) - JVM/Node need 20-30
rlimit-nofile 100        # 100 FDs (was 50) - file I/O exercises

# Timeout (overridden by command-line args)
timeout 00:00:10

# Prevent resource exhaustion attacks
rlimit-sigpending 10     # Limit pending signals
rlimit-msgqueue 100      # Limit message queue size
