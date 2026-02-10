# OpenDocs — OPENCLAW.md

> **Best Practices Feb 2026:** Integration via OpenClaw (Open Source Auth/Integration Bridge).

## Vision
We do not use proprietary provider APIs directly in the frontend. Everything flows through **OpenClaw**. This enables:
1.  **Unified Auth:** A single connection to OpenClaw unlocks Meta (WhatsApp/Instagram), LinkedIn, and more.
2.  **Security:** Credentials never leave your local infrastructure.
3.  **AI Control:** The OpenDocs Agent can trigger actions in third-party apps via the OpenClaw bridge.

## Setup (Local Container)
1. Start your local OpenClaw container (Docker).
2. Generate an `OPENCLAW_TOKEN`.
3. Add the URL and Token to your **server** `.env` (Express ENV), not the browser.

## Implementation Roadmap
### Phase 1: Bridge Setup
- [x] ✅ Implemented server-side proxy: `POST /api/integrations/openclaw/send` (token injected server-side)
- [x] ✅ Frontend uses OpenDocs proxy (no OpenClaw token in browser)

### Phase 2: AI Actions
- [x] ✅ Command type: `integration.openclaw.send`
- [x] ✅ Agent executor can call OpenClaw via proxy

### Phase 3: n8n Sync
- [ ] Use OpenClaw as the auth gateway for n8n webhook triggers (planned)

## Environment Variables (server)
- `OPENCLAW_BASE_URL`: e.g., `http://localhost:8080`
- `OPENCLAW_TOKEN`: your secure bridge token (kept server-side)

---

## Setup & Authentication (Complete Guide)

### Docker Container Setup

**1. Pull the OpenClaw Docker Image**

```bash
# Check available OpenClaw versions
docker search openclaw

# Pull the latest stable image
docker pull openclaw:latest

# Run the container locally
docker run -d \
  --name openclaw \
  --restart always \
  -p 8080:8080 \
  -e LOG_LEVEL=info \
  openclaw:latest
```

**2. Verify Container Health**

```bash
# Check if OpenClaw is running
curl -s http://localhost:8080/health | jq .

# Expected response
{
  "status": "healthy",
  "version": "1.2.0",
  "uptime_seconds": 1234
}
```

### Generate Your Token

**3. Create an OpenClaw Bearer Token**

```bash
# Login to OpenClaw dashboard
# http://localhost:8080/dashboard

# Navigate to: Settings → API Tokens
# Click: Generate New Token
# Name: "OpenDocs Server Token"
# Scopes: ["integrations.send", "integrations.manage"]
# Expiration: 365 days

# Copy the token (appears once):
# Token: ocl_1234567890abcdef_1234567890abcdef

# Save to .env
echo "OPENCLAW_TOKEN=ocl_1234567890abcdef_1234567890abcdef" >> .env
```

### Configure Environment Variables

**4. Update .env (Server-Side Only)**

```bash
# .env (Express, NOT exposed to browser)
OPENCLAW_BASE_URL=http://localhost:8080
OPENCLAW_TOKEN=ocl_1234567890abcdef_1234567890abcdef

# NEVER expose these to the browser!
# Frontend will use proxy: POST /api/integrations/openclaw/send
```

### Prerequisites Checklist

- [ ] Docker installed and running (`docker --version`)
- [ ] OpenClaw container healthy (`curl http://localhost:8080/health`)
- [ ] Bearer token generated and stored safely
- [ ] `.env` file updated with OPENCLAW_BASE_URL and OPENCLAW_TOKEN
- [ ] Server restarted (`node server.js`)
- [ ] API proxy endpoint accessible (`POST /api/integrations/openclaw/send`)

---

## API Reference & Endpoints

### OpenClaw API Endpoint

**URL:** `{OPENCLAW_BASE_URL}/api/v1/send/{integrationId}`  
**Method:** `POST`  
**Authentication:** Bearer token (server-side, via proxy)

### Server-Side Proxy Endpoint

**URL:** `/api/integrations/openclaw/send`  
**Method:** `POST`  
**Handler:** `server.js` lines 347–376

### Request Payload Structure

```json
{
  "integrationId": "meta_whatsapp_integration_1",
  "to": "+1234567890",
  "text": "Hello from OpenDocs!",
  "mediaUrl": "https://example.com/image.jpg",
  "mediaType": "image",
  "templateId": "greeting_template",
  "templateParams": {
    "name": "John",
    "company": "Acme Inc"
  }
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `integrationId` | string | ✅ Yes | ID of your OpenClaw integration (Meta, LinkedIn, etc.) |
| `to` | string | ✅ Yes | Recipient phone/email/username |
| `text` | string | ✅ Yes | Message body |
| `mediaUrl` | string | ❌ No | URL to media file (image, video) |
| `mediaType` | string | ❌ No | "image", "video", "document" |
| `templateId` | string | ❌ No | Template ID for structured messages |
| `templateParams` | object | ❌ No | Variables for template substitution |

### Response Format

**Success (200 OK):**

```json
{
  "ok": true,
  "status": "sent",
  "messageId": "msg_1234567890abcdef",
  "timestamp": "2026-02-03T14:30:00Z",
  "recipient": "+1234567890"
}
```

**Error (400/502):**

```json
{
  "ok": false,
  "status": "error",
  "error": "openclaw_upstream_failed",
  "details": "Integration not configured",
  "timestamp": "2026-02-03T14:30:00Z"
}
```

### Error Codes

| Code | HTTP | Cause | Solution |
|------|------|-------|----------|
| `openclaw_not_configured` | 400 | Missing OPENCLAW_TOKEN or BASE_URL | Check .env variables |
| `openclaw_upstream_failed` | 502 | OpenClaw service unreachable | Verify container health |
| `openclaw_proxy_failed` | 500 | Proxy error (malformed request) | Check request payload |
| `integration_not_found` | 400 | integrationId doesn't exist | Verify integration ID in OpenClaw |
| `invalid_recipient` | 400 | Recipient format invalid | Check phone/email format |

---

## Integration Patterns (Real-World Examples)

### Pattern 1: Meta WhatsApp Integration

**Setup:** Connect your WhatsApp Business Account via OpenClaw

```javascript
// commandTypes.ts
case "integration.openclaw.send": {
  const payload = {
    integrationId: "meta_whatsapp_1",
    to: "+1234567890",
    text: "Your order #12345 has shipped!",
    templateId: "order_update",
    templateParams: { orderId: "12345", status: "shipped" }
  };
  
  const response = await apiClient.sendOpenClawMessage(payload);
  return { ok: true, message: `WhatsApp sent to ${payload.to}` };
}
```

**Database Trigger Example:**

```sql
-- When a new Order is created, send WhatsApp notification
CREATE FUNCTION notify_customer_whatsapp()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      'http://localhost:3000/api/integrations/openclaw/send',
      jsonb_build_object(
        'integrationId', 'meta_whatsapp_1',
        'to', NEW.customer_phone,
        'text', 'Your order ' || NEW.order_id || ' is confirmed!',
        'templateId', 'order_confirmation'
      )::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_whatsapp_order
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION notify_customer_whatsapp();
```

### Pattern 2: LinkedIn Integration

**Setup:** Connect your LinkedIn Account via OpenClaw

```typescript
// Send LinkedIn message from AI Agent
async function sendLinkedInMessage(userId: string, message: string) {
  const response = await fetch('/api/integrations/openclaw/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      integrationId: 'linkedin_1',
      to: userId,  // LinkedIn user ID
      text: message,
      type: 'connection_message'
    })
  });
  
  return response.json();
}

// Example: Agent sends LinkedIn outreach
const message = await sendLinkedInMessage('85274691', 'Hi! Let\'s connect.');
```

### Pattern 3: Database Block Sync (Real-Time Updates)

**Scenario:** When a CRM record is updated, notify via OpenClaw

```typescript
// SUPABASE.md: If/Then Automation
const automationRule = {
  name: "Notify on Lead Update",
  table: "leads",
  event: "UPDATE",
  condition: {
    column: "status",
    operator: "changed_to",
    value: "qualified"
  },
  action: {
    type: "webhook",
    url: "http://localhost:3000/api/integrations/openclaw/send",
    payload: {
      integrationId: "meta_whatsapp_1",
      to: "{{ record.phone }}",
      text: "Lead {{ record.name }} is qualified! 🎉"
    }
  }
};
```

### Pattern 4: AI Agent Action (Command Integration)

**Scenario:** OpenDocs AI Agent calls OpenClaw directly

```typescript
// executeCommand.ts (lines 74–76)
case "integration.openclaw.send": {
  const { integrationId, to, text, ...rest } = args;
  
  const response = await apiClient.post('/api/integrations/openclaw/send', {
    integrationId,
    to,
    text,
    ...rest
  });
  
  return {
    ok: response.ok === true,
    message: `Message sent via OpenClaw: ${response.messageId}`
  };
}
```

---

## Client-Side Usage & Security

### Frontend API Client

**Location:** `src/services/apiClient.ts` (lines 43–48)

```typescript
// NEVER expose OpenClaw tokens to the browser!
// All communication flows through the server proxy

async sendOpenClawMessage(
  integrationId: string,
  payload: OpenClawPayload
): Promise<OpenClawResponse> {
  return await postJson('/api/integrations/openclaw/send', {
    integrationId,
    ...payload
  });
}
```

### Command Executor Integration

**Location:** `src/commands/executeCommand.ts`

```typescript
import { apiClient } from '@/services/apiClient';

export async function executeCommand(command: Command): Promise<CommandResult> {
  switch (command.type) {
    case 'integration.openclaw.send':
      try {
        const response = await apiClient.sendOpenClawMessage(
          command.integrationId,
          {
            to: command.to,
            text: command.text,
            mediaUrl: command.mediaUrl
          }
        );
        
        return {
          ok: response.ok,
          message: `Message sent: ${response.messageId}`
        };
      } catch (error) {
        return {
          ok: false,
          error: `OpenClaw error: ${error.message}`
        };
      }
    
    default:
      return { ok: false, error: 'Unknown command' };
  }
}
```

### Type Definitions

**Location:** `src/commands/commandTypes.ts` (line 56)

```typescript
export interface OpenClawCommand extends BaseCommand {
  type: 'integration.openclaw.send';
  integrationId: string;
  to: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
  templateId?: string;
  templateParams?: Record<string, any>;
}
```

### Error Handling & Retry Logic

```typescript
// Retry with exponential backoff
async function sendOpenClawWithRetry(
  integrationId: string,
  payload: any,
  maxRetries = 3
): Promise<any> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await apiClient.sendOpenClawMessage(integrationId, payload);
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

### Security Best Practices

✅ **DO:**
- Keep OPENCLAW_TOKEN server-side only (.env)
- Use proxy endpoint `/api/integrations/openclaw/send`
- Validate integrationId before sending
- Log all OpenClaw API calls (except tokens)
- Implement rate limiting (max 60 req/60s)

❌ **DON'T:**
- Expose OPENCLAW_TOKEN in environment variables sent to browser
- Make direct calls to OpenClaw API from frontend
- Store tokens in localStorage or cookies
- Send sensitive data in message text
- Ignore error responses

---

## Server-Side Proxy (Implementation Details)

### Express Proxy Endpoint

**Location:** `server.js` lines 347–376

```javascript
app.post('/api/integrations/openclaw/send', async (req, res) => {
  const { integrationId, to, text, mediaUrl, mediaType, templateId, templateParams } = req.body;
  
  // 1. Validation
  if (!integrationId || !to || !text) {
    return res.status(400).json({
      ok: false,
      error: 'openclaw_invalid_request',
      details: 'Missing required fields: integrationId, to, text'
    });
  }
  
  // 2. Check environment
  const baseUrl = process.env.OPENCLAW_BASE_URL;
  const token = process.env.OPENCLAW_TOKEN;
  
  if (!baseUrl || !token) {
    return res.status(400).json({
      ok: false,
      error: 'openclaw_not_configured',
      details: 'Server environment not configured'
    });
  }
  
  // 3. Build upstream request (server-side token injection)
  const upstreamUrl = `${baseUrl}/api/v1/send/${integrationId}`;
  
  const upstreamPayload = {
    to,
    text,
    ...(mediaUrl && { mediaUrl }),
    ...(mediaType && { mediaType }),
    ...(templateId && { templateId }),
    ...(templateParams && { templateParams })
  };
  
  try {
    // 4. Forward to OpenClaw (with token injection)
    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // ← Token injected here
      },
      body: JSON.stringify(upstreamPayload)
    });
    
    const data = await response.json();
    
    // 5. Handle upstream errors
    if (!response.ok) {
      console.error(`[OpenClaw] Upstream error:`, data);
      return res.status(response.status).json({
        ok: false,
        error: 'openclaw_upstream_failed',
        details: data.error || 'Unknown upstream error'
      });
    }
    
    // 6. Return success
    res.json({
      ok: true,
      ...data
    });
    
  } catch (error) {
    console.error(`[OpenClaw] Proxy error:`, error);
    res.status(500).json({
      ok: false,
      error: 'openclaw_proxy_failed',
      details: error.message
    });
  }
});
```

### Token Injection Mechanism

```javascript
// ✅ CORRECT: Token is injected server-side
const response = await fetch(upstreamUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENCLAW_TOKEN}`  // ← Server only
  },
  body: JSON.stringify(payload)
});

// ❌ WRONG: Token in frontend request (NEVER do this)
// fetch('/api/v1/send/integration_1', {
//   headers: { 'Authorization': `Bearer ${OPENCLAW_TOKEN}` }  // NO!
// })
```

### Rate Limiting & Performance

**Per-Integration Rate Limits:**
- `60 requests / 60 seconds` (OpenClaw default)
- Burst: `10 requests / 10 seconds` (peak capacity)

**Monitoring & Logging:**

```javascript
// Log all OpenClaw requests (except tokens)
const log = {
  timestamp: new Date().toISOString(),
  integrationId,
  to: maskPhoneNumber(to),
  status: response.status,
  messageId: data.messageId,
  duration: Date.now() - startTime
};

console.log('[OpenClaw]', JSON.stringify(log));
```

---

## Troubleshooting & FAQs

### Common Issues & Solutions

**Issue 1: "openclaw_not_configured" Error**

```
Error: openclaw_not_configured
Details: Server environment not configured
```

**Solution:**
```bash
# Check .env file has both variables
grep OPENCLAW_ .env

# Expected output:
# OPENCLAW_BASE_URL=http://localhost:8080
# OPENCLAW_TOKEN=ocl_...

# Restart server
pkill -f "node server.js"
node server.js
```

**Issue 2: "openclaw_upstream_failed" (503 Service Unavailable)**

```
Error: openclaw_upstream_failed
Details: Service unavailable
```

**Solution:**
```bash
# Check if OpenClaw container is running
docker ps | grep openclaw

# If not running, start it:
docker start openclaw

# Verify health:
curl -s http://localhost:8080/health | jq .
```

**Issue 3: "integration_not_found" (400)**

```
Error: integration_not_found
Details: Integration with ID 'meta_whatsapp_1' not found
```

**Solution:**
```bash
# List available integrations in OpenClaw
curl -s http://localhost:8080/api/v1/integrations \
  -H "Authorization: Bearer ${OPENCLAW_TOKEN}" | jq .

# Create new integration via dashboard:
# http://localhost:8080/dashboard → Integrations → Create
```

**Issue 4: Rate Limiting (429 Too Many Requests)**

```
Error: rate_limit_exceeded
Details: 60 requests per 60 seconds exceeded
```

**Solution:**
```typescript
// Implement request queue (send max 1 per second)
const queue = [];
let sending = false;

async function queueOpenClawRequest(integrationId, payload) {
  queue.push({ integrationId, payload });
  
  if (!sending) {
    sending = true;
    while (queue.length > 0) {
      const request = queue.shift();
      await apiClient.sendOpenClawMessage(request.integrationId, request.payload);
      await new Promise(r => setTimeout(r, 1000));  // 1s between requests
    }
    sending = false;
  }
}
```

### FAQs

**Q: Can I use OpenClaw without a Docker container?**
> A: Yes, you can use OpenClaw Cloud (SaaS) instead. Update OPENCLAW_BASE_URL to the cloud endpoint and keep your token secure.

**Q: What if my integrationId changes?**
> A: Update the integrationId in your command, automation rule, or database trigger. All references point to OpenClaw, not hardcoded values.

**Q: How do I rotate my OpenClaw token?**
> A: Generate a new token in the OpenClaw dashboard, update .env, restart server. Old token expires immediately.

**Q: Can I send bulk messages (100+) at once?**
> A: No, respect rate limits. Use a queue system (see Issue 4 solution). Each integration has 60 req/60s.

**Q: Do OpenClaw messages go through my network?**
> A: Yes. Server → OpenClaw → Provider (Meta, LinkedIn, etc.). All credentials stay local.

**Q: Can I use OpenClaw for SMS and Email?**
> A: OpenClaw v1.2+ supports SMS (Twilio) and Email (Sendgrid). Configure integrations in dashboard.
