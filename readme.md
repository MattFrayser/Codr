# Code Sandbox Backend
 
A secure multilanguage code execution platform with real-time bidirectional streaming.
 
## Current Supported Languages
 
- Python 3.11
- JavaScript (Node.js 20)
- C (GCC, C11)
- C++ (G++, C++17)
- Rust (rustc)
 
## Architecture
 
The backend consists of two microservices:
 
1. **WebSocket Service**: Handles client connections, authentication, and job management
2. **Worker Service**: Executes code in isolated Firejail sandboxes
 
Communication between services happens via Redis (job queue + pub/sub).
 
## Security
 
Multi-layer security approach:
 
1. **Authentication**: API keys + single-use JWT tokens
2. **Input Validation**: Pydantic schemas, filename sanitization
3. **AST Validation**: Blocks dangerous operations before execution
4. **Firejail Sandboxing**: Process-level isolation with resource limits
 
## Quick Start
 
 
### Installation
 
```bash
# Install dependencies
pip install -r requirements.txt
 
# Copy environment configuration
cp .env.example .env
 
# Edit .env with your configuration
nano .env
```
 
### Running Services
 
**Terminal 1 - WebSocket Service:**
```bash
cd services/websocket
python -m services.websocket
```
 
**Terminal 2 - Worker Service:**
```bash
cd services/worker
python -m services.worker
```
 
**Terminal 3 - Redis:**
```bash
redis-server
```
 
## API Usage
 
### 1. Create Job
 
```bash
curl -X POST http://localhost:8000/api/jobs/create \
  -H "X-API-Key: your-api-key"
```
 
Response:
```json
{
  "job_id": "uuid",
  "job_token": "jwt-token",
  "expires_at": "2024-01-01T00:15:00"
}
```
 
### 2. Execute Code
 
Connect to WebSocket and send:
 
```json
{
  "type": "execute",
  "job_id": "uuid",
  "job_token": "jwt-token",
  "code": "print('Hello World')",
  "language": "python"
}
```
 
Receive streaming output:
 
```json
{
  "type": "output",
  "stream": "stdout",
  "data": "Hello World\n"
}
```
 
Receive completion:
 
```json
{
  "type": "complete",
  "exit_code": 0,
  "execution_time": 0.123
}
```
 
### 3. Send Input (for interactive programs)
 
```json
{
  "type": "input",
  "data": "user input\n"
}
```
 
## Documentation
 
- For more indepth information check out `documentation.md`
 
### Code Quality
 
```bash
# Type checking (if using mypy)
mypy lib/ services/
 
# Linting
flake8 lib/ services/
 
# Format code
black lib/ services/
```
 


