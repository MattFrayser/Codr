# Interactive Input Test Files

This directory contains test files for verifying interactive input functionality across all supported languages.

## Test Files

- `test_python.py` - Python interactive input test
- `test_c.c` - C interactive input test
- `test_cpp.cpp` - C++ interactive input test
- `test_rust.rs` - Rust interactive input test

## What Each Test Does

Each test file performs the following operations:

1. **Simple string input**: Prompts for a name and greets the user
2. **Integer input**: Asks for age and confirms it
3. **Multiple inputs**: Requests multiple values and performs a calculation

## How to Test

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. Start the frontend:
   ```bash
   cd nextjs
   npm run dev
   ```

3. Open the IDE in your browser (usually http://localhost:3000)

4. For each language:
   - Copy the corresponding test file code into the editor
   - Select the appropriate language from the dropdown
   - Click "Run"
   - Enter the requested input values in the terminal when prompted

## Expected Behavior

- The terminal should display prompts in real-time
- An input field should appear when the program waits for input
- After entering each value, the program should continue execution
- All output should stream to the terminal in real-time
- The execution should complete successfully with the calculated result

## Troubleshooting

If input doesn't work:
- Check browser console for WebSocket errors
- Verify Redis is running and accessible
- Check backend logs for Pub/Sub connection errors
- Ensure the WebSocket endpoint is properly registered in FastAPI
