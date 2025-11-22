# System Architecture
 
This is a multilanguage code sandbox executor built with a microservices architecture. The system allows users to submit code in multiple languages (Python, JavaScript, C, C++, Rust) and executes it safely in isolated sandboxes with real-time bidirectional streaming.
 
## Core Architecture
 
### 1. Microservices Over Monolith
 
WebSocket and Worker are split into seperate services
 
- WebSocket service handles real-time client communication
- Worker service handles CPU-intensive code execution
- This allows independent scaling (more workers for high execution load)
- Worker crashes do not affect client connections
- Better resource isolation
 
### 2. Redis as Central Communication Hub
 
Redis is used for both job queue and pub/sub messaging
 
- Single infrastructure dependency reduces complexity
- List-based queue provides simple FIFO job processing
- Pub/Sub enables real-time bidirectional communication
- Built-in TTL for automatic job cleanup
- High performance for both patterns
 
### 3. PTY-Based Execution with Real-Time Streaming
 
Execute code in PTY (pseudo-terminal) with streaming output
 
- Supports interactive programs requiring stdin
- Real-time output streaming via WebSocket
- Better terminal behavior (colors, prompts)
- Single execution path for all languages
 
### 4. Defense-in-Depth Security Model
 
Multiple security layers (AST validation + Firejail sandboxing)
 
- AST validation catches dangerous code before execution
- Firejail provides OS-level isolation during execution
- Neither layer alone is sufficient
- AST validation provides better error messages to users
- Firejail prevents bypass attempts
  
## Data Flow
 
### Job Submission Flow
 
1. Client calls `/api/jobs/create` with API key
2. WebSocket service generates job_id and JWT token
3. Client connects to WebSocket with job_id and token
4. WebSocket service validates JWT (single-use)
5. Client sends code via WebSocket
6. WebSocket service validates code with AST validator
7. Job pushed to Redis queue
8. Worker pops job from queue
9. Worker executes code in Firejail sandbox
10. Worker streams output via Redis Pub/Sub
11. WebSocket service forwards output to client
12. Worker publishes completion event
13. WebSocket closes connection
 
### Real-Time Communication Flow
 
```
User Input:  Client → WebSocket → Redis Pub/Sub → Worker → PTY stdin
Code Output: PTY stdout → Worker → Redis Pub/Sub → WebSocket → Client
```
 
## Security Architecture
 
###  Authentication
- API key for job creation endpoints
- JWT tokens for WebSocket connections
- Single-use token enforcement via Redis
 
### Input Validation
- Pydantic schema validation
- Filename sanitization (path traversal prevention)
- Code size limits 
- Input size limits 
 
### AST Code Validation
- tree-sitter AST parsing for JS, C, C++, Rust
- Python built-in AST module
- Blocks dangerous operations (eval, exec, system calls)
- Blocks dangerous imports (os, sys, subprocess, fs, net)
- Blocks introspection methods for sandbox escapes
 
### Layer 4: Firejail Sandboxing
- Network isolation (net=none)
- Private filesystem
- Resource limits (CPU, memory, file size)
- Seccomp syscall filtering
- No root access
- Read-only system directories
 
# Adding new languages

1. Create executor in `lib/executors/your_language.py`
2. Extend `BaseExecutor` or `CompiledExecutor`
3. Implement `_build_command()` or `_get_compiler_config()`
4. Register in `lib/executors/__init__.py`
5. Add AST validator in `lib/security/`
6. Add blocklists to `lib/models/allowlist.py`
7. Write tests in `tests/lib/executors/`
