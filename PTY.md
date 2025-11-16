# PTY Refactor - Industry Standard Approach

## Current Problem

We're trying to detect prompts and manage input/output flow in the backend. This is WRONG.

## Industry Standard (xterm.js, node-pty, Replit)

### Architecture

```
Frontend (Terminal UI)          WebSocket          Backend (PTY)
┌─────────────────────┐                          ┌──────────────┐
│  User types input   │ ──────────────────────> │  Write to    │
│                     │                          │  PTY master  │
│                     │                          │              │
│  Display output     │ <────────────────────── │  Read from   │
│  (including prompts)│                          │  PTY master  │
└─────────────────────┘                          └──────────────┘
```

### Key Principles

1. **Backend is DUMB** - just pipes data
2. **Frontend is SMART** - handles display and input
3. **No prompt detection** - not needed!
4. **Bidirectional streaming** - data flows both ways continuously

## How It Works

### Backend (Python):
```python
while process_running:
    # Read from PTY
    if data_available:
        data = os.read(master_fd, 1024)
        send_to_websocket(data)  # Send immediately

    # Write to PTY (from queue of user inputs)
    if user_input_available:
        input_data = get_from_queue()
        os.write(master_fd, input_data)
```

### Frontend (React):
```javascript
// Receive output
ws.onmessage = (msg) => {
    terminal.write(msg.data)  // Display everything
}

// Send input
terminal.onData((data) => {
    ws.send(data)  // Send keystrokes immediately
})
```


## Why This Works

When Python calls `input("name")`:
1. PTY sends "name" → WebSocket → Frontend displays "name"
2. User types "Matt" in input field (always available)
3. User presses Enter → "Matt\n" → WebSocket → PTY
4. Python's input() receives "Matt"
5. Python continues execution
6. Works EXACTLY like a terminal!

No detection, no waiting, no guessing. Just streaming.
