# Interactive Input Implementation

This document describes the implementation of real-time interactive input functionality for the Codr code execution platform.

## Architecture Overview

The implementation uses **WebSocket + Redis Pub/Sub** to enable:
- Real-time bidirectional communication between frontend and backend
- Live output streaming from code execution
- Interactive input prompts with user responses
- Horizontal scalability across multiple backend servers

```
Frontend (WebSocket) <---> Backend Server A <---> Redis Pub/Sub <---> Backend Server B (Executor)
```

## Components Modified

### Backend Changes

1. **`backend/api/models/allowlist.py`**
   - Removed `input` and `raw_input` from `PYTHON_BLOCKED_OPERATIONS`
   - Allows Python's `input()` function to work

2. **`backend/api/services/pubsub_service.py`** (NEW)
   - Redis Pub/Sub service for real-time messaging
   - Publishes: output, input requests, completion events
   - Subscribes: channels for job-specific communication
   - Methods:
     - `publish_output()` - Stream stdout/stderr
     - `publish_input_request()` - Request user input
     - `publish_input_response()` - Send user input to executor
     - `wait_for_input_response()` - Wait for user to respond
     - `subscribe_to_channels()` - Listen for job events

3. **`backend/api/websocket.py`** (NEW)
   - WebSocket endpoint: `/ws/execute`
   - Handles bidirectional communication
   - Message protocol:
     - Client → Server: `{type: 'execute', code, language}`
     - Client → Server: `{type: 'input_response', data}`
     - Server → Client: `{type: 'output', stream, data}`
     - Server → Client: `{type: 'input_request', prompt}`
     - Server → Client: `{type: 'complete', exit_code, execution_time}`

4. **`backend/executors/base.py`**
   - Added `execute_interactive()` method
   - Streams output line-by-line via callback
   - Supports stdin piping for interactive input
   - Uses threading to read stdout/stderr concurrently

5. **`backend/api/services/execution_service.py`**
   - Added `execute_job_interactive()` method
   - Bridges executor callbacks with Redis Pub/Sub
   - Handles real-time output streaming
   - Manages input request/response flow

6. **`backend/main.py`**
   - Registered WebSocket router
   - Added `/ws/execute` endpoint to API

7. **`backend/requirements.txt`**
   - Updated `redis` package to include `[hiredis]` for async support

### Frontend Changes

1. **`nextjs/app/hooks/useWebSocketExecution.ts`** (NEW)
   - React hook for WebSocket-based code execution
   - Manages WebSocket connection lifecycle
   - Handles real-time output streaming
   - Manages interactive input state
   - Returns:
     - `outputLines` - Array of output with type info
     - `isWaitingForInput` - Boolean for input state
     - `execute()` - Start code execution
     - `sendInput()` - Send user input

2. **`nextjs/app/components/InteractiveTerminalOutput.tsx`** (NEW)
   - Terminal component with interactive input field
   - Auto-scrolls to bottom on new output
   - Shows input prompt when waiting for input
   - Color-coded output (stdout, stderr, system, input)
   - Input field appears/disappears based on state

3. **`nextjs/app/components/ide.tsx`**
   - Switched from `useCodeExecution` to `useWebSocketExecution`
   - Replaced `TerminalOutput` with `InteractiveTerminalOutput`
   - Updated event handlers for WebSocket execution

## How It Works

### Execution Flow

1. **User clicks "Run"**
   - Frontend establishes WebSocket connection to `/ws/execute`
   - Sends execute message with code and language

2. **Backend creates job**
   - Validates code for security
   - Creates job record in Redis
   - Starts execution in background thread
   - Subscribes to Redis Pub/Sub channels for the job

3. **Code execution begins**
   - Executor starts subprocess with stdin/stdout/stderr pipes
   - Background threads read stdout/stderr line-by-line
   - Each line published to Redis channel: `job:{job_id}:output`

4. **Output streaming**
   - Backend subscribes to output channel
   - Forwards each line to WebSocket client
   - Frontend displays in terminal in real-time

5. **Input request (if code calls `input()`)**
   - Executor publishes to `job:{job_id}:input_request`
   - Backend forwards to WebSocket client
   - Frontend shows input field in terminal
   - User types response and presses Enter

6. **Input response**
   - Frontend sends input via WebSocket
   - Backend publishes to `job:{job_id}:input_response`
   - Executor receives input, writes to subprocess stdin
   - Code continues execution

7. **Completion**
   - Executor publishes completion event
   - Backend forwards to WebSocket
   - Frontend displays execution time and exit code
   - WebSocket connection closes

## Redis Channels Used

For each job with ID `job_id`:

- `job:{job_id}:output` - Stdout/stderr streaming
- `job:{job_id}:input_request` - Executor requests input
- `job:{job_id}:input_response` - User provides input
- `job:{job_id}:complete` - Execution finished

## Horizontal Scaling

The Redis Pub/Sub architecture enables horizontal scaling:

1. User connects to **Server A** via WebSocket
2. Server A creates job and subscribes to Redis channels
3. **Server B** picks up execution (via load balancer)
4. Server B executor publishes to Redis channels
5. Server A receives from Redis, forwards to user's WebSocket
6. Input flows: User → Server A → Redis → Server B → Executor

This allows:
- Multiple backend servers handling different jobs
- Load balancing across servers
- Fault tolerance (if executor server crashes, another can pick up)

## Language Support

All languages now support interactive input:

- **Python**: `input()` function
- **JavaScript**: `readline()` or similar libraries
- **C**: `scanf()`, `getchar()`, `fgets()`
- **C++**: `cin`, `getline()`
- **Rust**: `std::io::stdin().read_line()`

## Testing

Test files are provided in `/test_interactive/`:

- `test_python.py` - Python input test
- `test_c.c` - C input test
- `test_cpp.cpp` - C++ input test
- `test_rust.rs` - Rust input test

Each test demonstrates:
1. Simple string input
2. Integer input
3. Multiple inputs with calculations

## Security Considerations

1. **Input still sandboxed**: All execution happens in Firejail sandbox
2. **No file system access**: Input doesn't bypass file restrictions
3. **Network still disabled**: Input doesn't enable network access
4. **Timeout enforced**: Long-running input requests timeout
5. **Validation**: Code still validated before execution

## Known Limitations

1. **Input detection**: Current implementation doesn't auto-detect when code is waiting for input. The executor needs to explicitly call the input callback.
2. **Buffering**: Some languages may buffer output, causing delays in streaming
3. **Binary data**: Currently only supports text input/output

## Future Enhancements

1. **Auto-detect input**: Monitor subprocess state to detect when waiting for input
2. **Pre-execution stdin**: Allow users to provide all inputs before execution
3. **Timeout configuration**: Per-language timeout settings for input
4. **Input history**: Save/recall previous inputs
5. **Binary I/O**: Support for binary input/output data

## Troubleshooting

### WebSocket won't connect
- Check if backend is running on expected port
- Verify CORS settings allow WebSocket connections
- Check browser console for errors

### Input field doesn't appear
- Verify Redis is running and accessible
- Check backend logs for Pub/Sub errors
- Ensure `input` function is not still blocked in allowlist

### Output not streaming
- Check if Redis Pub/Sub channels are being created
- Verify executor is calling output callback
- Look for threading issues in executor

### Horizontal scaling issues
- Ensure all backend servers can access Redis
- Verify Pub/Sub messages are being published
- Check network connectivity between servers and Redis
