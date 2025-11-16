ARG SERVICE=main

FROM rust:1.75-slim as rust-builder

FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y gcc g++ build-essential firejail \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy Rust compiler
COPY --from=rust-builder /usr/local/cargo /usr/local/cargo
COPY --from=rust-builder /usr/local/rustup /usr/local/rustup
ENV PATH="/usr/local/cargo/bin:${PATH}"
ENV RUSTUP_HOME="/usr/local/rustup"
ENV CARGO_HOME="/usr/local/cargo"

WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy firejail profile
COPY firejail.profile /etc/firejail/sandbox.profile

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1000 codr && \
    chown -R codr:codr /app

USER codr

EXPOSE 8000

# Default command (overridden by fly.tomls)
CMD ["python3", "main.py"]

