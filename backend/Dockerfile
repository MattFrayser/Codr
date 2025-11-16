# Multi-stage build for Codr backend
# Stage 1: Build Rust (needed for rustc)
FROM rust:1.75-slim as rust-builder

# Stage 2: Main application image
FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install system dependencies and language runtimes
RUN apt-get update && apt-get install -y \
    # Python
    python3.11 \
    python3-pip \
    python3.11-venv \
    # Node.js
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    # C/C++ compilers
    && apt-get install -y \
    gcc \
    g++ \
    build-essential \
    # Firejail for sandboxing
    && apt-get install -y firejail \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy Rust compiler from builder stage
COPY --from=rust-builder /usr/local/cargo /usr/local/cargo
COPY --from=rust-builder /usr/local/rustup /usr/local/rustup
ENV PATH="/usr/local/cargo/bin:${PATH}"
ENV RUSTUP_HOME="/usr/local/rustup"
ENV CARGO_HOME="/usr/local/cargo"

# Verify installations
RUN python3 --version && \
    node --version && \
    gcc --version && \
    g++ --version && \
    rustc --version && \
    firejail --version

# Create app directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy Firejail profile
COPY firejail.profile /etc/firejail/sandbox.profile

# Copy application code
COPY . .

# Create a non-root user for running the application
RUN useradd -m -u 1000 codr && \
    chown -R codr:codr /app

# Switch to non-root user
USER codr

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Start the application
CMD ["python3", "main.py"]
