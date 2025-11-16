# Firejail security profile for Codr code execution
# This profile provides defense-in-depth sandboxing

# Disable network access
net none

# No D-Bus access
nodbus

# No root access
noroot

# Drop all capabilities
caps.drop all

# Disable 3D acceleration
nodvd
notv
novideo
no3d

# Disable sound
nosound

# Disable multicast
nomulticast

# Disable automount
noautomount

# Disable U2F
nou2f

# Make /tmp, /var/tmp private
private-tmp

# Hide sensitive directories
blacklist /boot
blacklist /media
blacklist /mnt
blacklist /opt
blacklist /run/user
blacklist /srv

# Seccomp filter - block dangerous syscalls
seccomp
seccomp.block-secondary

# Disable shell command history
disable-mnt

# Read-only paths
read-only /bin
read-only /lib
read-only /lib64
read-only /usr
read-only /etc
read-only /sbin

# Set nice value (lower priority)
nice 10

# Limit resources (these are overridden by command-line args but provide defaults)
rlimit-as 300000000
rlimit-cpu 5
rlimit-fsize 1000000
rlimit-nproc 10
rlimit-nofile 50

# Disable X11
x11 none

# Apparmor (if available)
apparmor

# Timeout (overridden by command-line args)
timeout 00:00:10
