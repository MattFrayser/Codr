# 🚀 Deploy Codr to Fly.io - Step by Step Guide

## Prerequisites

### 1. Install Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Verify installation
fly version
```

### 2. Sign Up / Login to Fly.io

```bash
# Sign up (if new user)
fly auth signup

# Or login (if existing user)
fly auth login
```

This will open your browser for authentication.

---

## Step 1: Set Up Redis

You need a Redis instance for job storage. Two options:

### Option A: Upstash Redis (Recommended - Free Tier)

1. Go to https://upstash.com/
2. Sign up/login
3. Create a new Redis database
4. Copy the connection URL (format: `rediss://default:password@host:6379`)

### Option B: Fly.io Redis

```bash
# Create a Redis instance
fly redis create codr-redis --region sea

# Save the connection URL shown
# Format: redis://default:password@codr-redis.internal:6379
```

**Save your Redis URL** - you'll need it in Step 4!

---

## Step 2: Prepare Backend for Deployment

### Fix Endpoint Mismatch (IMPORTANT)

Your frontend calls `/api/submit_code` but backend has `/api/submit`.

**Option 1: Update Backend** (Recommended)
```bash
cd /Users/matt/Projects/codeSandboxes/codr/backend
```

Edit `api/submit.py` line 21:
```python
@router.post("/api/submit_code", response_model=JobResponse)
```

**Option 2: Update Frontend**
Edit `nextjs/app/api/code/route.ts` line 79:
```typescript
const backendUrl = `${API_URL}/api/submit`;
```

### Verify Dockerfile exists

```bash
cd /Users/matt/Projects/codeSandboxes/codr/backend
ls Dockerfile fly.toml
```

Both should exist ✅

---

## Step 3: Initialize Fly App

```bash
cd /Users/matt/Projects/codeSandboxes/codr/backend

# Launch the app (this creates it but doesn't deploy yet)
fly launch --no-deploy

# You'll be prompted:
# - App name: (press enter to auto-generate or type: codr-backend)
# - Region: (choose closest to you, e.g., sea for Seattle)
# - PostgreSQL: NO (we're using Redis)
# - Redis: NO (we already have one)
```

This creates/updates `fly.toml`.

---

## Step 4: Set Environment Secrets

```bash
# Set API key (choose a strong random key)
fly secrets set API_KEY=your-super-secret-api-key-here

# Set Redis URL (from Step 1)
fly secrets set REDIS_URL="rediss://default:password@your-redis-host:6379"

# Optional: Set CORS origins
fly secrets set CORS_ORIGINS="https://your-frontend-domain.com,https://www.your-frontend-domain.com"

# Verify secrets are set
fly secrets list
```

**Important:**
- Generate a strong API key: `openssl rand -base64 32`
- Use the exact Redis URL from Step 1
- Don't include trailing slashes in URLs

---

## Step 5: Deploy Backend

```bash
cd /Users/matt/Projects/codeSandboxes/codr/backend

# Deploy to Fly.io
fly deploy --ha=false

# This will:
# 1. Build the Docker image (takes 5-10 minutes first time)
# 2. Push to Fly.io registry
# 3. Deploy to your selected region
# 4. Start the app
```

**Expected output:**
```
==> Building image
==> Pushing image to fly
==> Deploying image
--> v0 deployed successfully

Visit your new application at:
  https://codr-backend.fly.dev
```

---

## Step 6: Verify Deployment

### Check App Status

```bash
# View app status
fly status

# Should show:
# Status: running
# Health Checks: passing
```

### Test Health Endpoint

```bash
# Test health check
curl https://your-app-name.fly.dev/health

# Should return:
# {"status":"healthy","service":"codr-api","redis":"connected"}
```

### View API Docs

```bash
# Open API documentation
open https://your-app-name.fly.dev/docs
```

### Test Code Execution

```bash
# Submit a test job
curl -X POST https://your-app-name.fly.dev/api/submit_code \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-super-secret-api-key-here" \
  -d '{
    "code": "print(\"Hello from Fly.io!\")",
    "language": "python",
    "filename": "test.py"
  }'

# Should return:
# {"job_id":"abc-123-xyz","status":"queued","message":"Job submitted successfully"}
```

---

## Step 7: Monitor & Debug

### View Logs

```bash
# View real-time logs
fly logs

# View recent logs
fly logs --recent

# Follow logs continuously
fly logs -f
```

### SSH into Container

```bash
# SSH into running container
fly ssh console

# Check if Firejail exists
which firejail

# Test Python
python3 --version

# Exit
exit
```

### Check Resources

```bash
# View app resources/metrics
fly scale show

# Check current VM size
fly vm status
```

---

## Step 8: Update Frontend Configuration

Update your Next.js frontend to point to the deployed backend:

```bash
cd /Users/matt/Projects/codeSandboxes/codr/nextjs
```

Update `.env.local` or `.env.production`:
```env
API_URL=https://your-app-name.fly.dev
API_KEY=your-super-secret-api-key-here
```

Then deploy your frontend (Vercel/Fly.io/etc).

---

## Troubleshooting

### Issue: Build Fails

```bash
# Check Dockerfile syntax
docker build -t test .

# If it works locally, check fly logs
fly logs
```

### Issue: App Crashes on Startup

```bash
# View crash logs
fly logs --recent

# Common causes:
# - Missing Redis URL secret
# - Invalid Redis URL format
# - Port not matching (should be 8000)
```

### Issue: Health Check Failing

```bash
# Check if Redis is accessible
fly ssh console
redis-cli -u $REDIS_URL ping

# Should return: PONG
```

### Issue: "No such file: firejail"

This is expected locally on macOS. On Fly.io (Ubuntu), Firejail is installed via Dockerfile.

Verify by SSH:
```bash
fly ssh console
firejail --version
```

### Issue: Timeout Errors

Increase memory or timeout in `fly.toml`:
```toml
[[vm]]
  memory = '2gb'  # Increase from 1gb
  cpus = 2
```

Then redeploy:
```bash
fly deploy
```

---

## Scaling & Configuration

### Change VM Resources

```bash
# Scale to 2GB RAM
fly scale memory 2048

# Scale to 2 CPUs
fly scale vm shared-cpu-2x

# View pricing
fly platform vm-sizes
```

### Always-On vs Auto-Stop

**Current config** (in fly.toml):
```toml
auto_stop_machines = false
auto_start_machines = true
min_machines_running = 1
```

This keeps 1 instance always running (recommended for this app).

### Multiple Regions

```bash
# Add region
fly scale count 2 --region sea,iad

# This runs 1 instance in Seattle, 1 in Virginia
```

---

## Costs Estimate

With current configuration:
- **VM**: shared-cpu-1x, 1GB RAM, always-on = ~$1.94/mo
- **Redis**: Upstash free tier = $0
- **Bandwidth**: 160GB included = $0

**Total: ~$2/mo** for always-on service

---

## Useful Commands

```bash
# Restart app
fly apps restart

# Scale down (stop)
fly scale count 0

# Scale up (start)
fly scale count 1

# View all apps
fly apps list

# Destroy app (careful!)
fly apps destroy codr-backend

# Open dashboard
fly dashboard

# View secrets
fly secrets list

# Update secret
fly secrets set API_KEY=new-key
```

---

## Deployment Checklist

Before deploying:
- [ ] Redis URL obtained and tested
- [ ] API key generated (strong random key)
- [ ] Endpoint mismatch fixed (`/api/submit` vs `/api/submit_code`)
- [ ] Dockerfile exists with all language runtimes
- [ ] fly.toml configured correctly
- [ ] Secrets set via `fly secrets set`

After deploying:
- [ ] Health check returns `{"status":"healthy"}`
- [ ] API docs accessible at `/docs`
- [ ] Test code execution for Python works
- [ ] Test code execution for JavaScript works
- [ ] Test code execution for C works
- [ ] Test code execution for C++ works
- [ ] Test code execution for Rust works
- [ ] SSE streaming works
- [ ] Security validation blocks dangerous code
- [ ] Frontend connects successfully

---

## Next Steps

1. ✅ Deploy backend to Fly.io
2. ✅ Verify all 5 languages work
3. ✅ Test SSE streaming
4. ✅ Deploy frontend with correct API_URL
5. ✅ Test end-to-end flow
6. 🎉 You're live!

---

## Support

- Fly.io Docs: https://fly.io/docs/
- Community: https://community.fly.io/
- Status: https://status.fly.io/

**Your app will be live at:**
```
https://your-app-name.fly.dev
```
