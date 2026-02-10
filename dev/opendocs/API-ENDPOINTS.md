# OpenDocs — API-ENDPOINTS.md

> **Best Practices Feb 2026:** Version your APIs, document auth, rate limits, and request/response schemas.

---

## 🔐 Auth & Headers

### Rate Limiting
- Applies to all `/api/*` endpoints
- Configure via server environment variables:
  - `RATE_LIMIT_WINDOW_MS=60000` (1 minute window)
  - `RATE_LIMIT_MAX=60` (60 requests per window)
- Response headers:
  - `X-RateLimit-Limit: 60`
  - `X-RateLimit-Remaining: 45`
  - `X-RateLimit-Reset: 1707500000000`

### Authentication
- **Public endpoints:** `/api/health`
- **Protected endpoints:** All other `/api/*` (when `API_AUTH_TOKEN` is set)
- **Header:** `X-OpenDocs-Token: <your-token>`

### Observability
- Client may send: `X-Request-Id: <uuid>`
- Server returns the same ID in response headers

---

## 🏥 Health

### `GET /api/health`
Public health check endpoint.

**Request:**
```bash
curl http://localhost:3000/api/health
```

**Response (200 OK):**
```json
{
  "ok": true,
  "product": "OpenDocs",
  "model": "moonshotai/kimi-k2.5",
  "features": {
    "ai": true,
    "agent": true,
    "github": true,
    "website": true,
    "images": true
  }
}
```

---

## 🤖 LLM & AI

### `POST /api/nvidia/chat`
Proxy to NVIDIA NIM API for direct LLM access.

**Request:**
```bash
curl -X POST http://localhost:3000/api/nvidia/chat \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: <token>" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are OpenDocs."},
      {"role": "user", "content": "Hello!"}
    ],
    "temperature": 0.2
  }'
```

**Response (200 OK):**
```json
{
  "id": "chat-123",
  "choices": [{
    "message": {"role": "assistant", "content": "Hello! How can I help?"},
    "finish_reason": "stop"
  }]
}
```

### `POST /api/agent/plan`
AI Agent planning endpoint. Returns structured commands for OpenDocs automation.

**Request:**
```bash
curl -X POST http://localhost:3000/api/agent/plan \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: <token>" \
  -d '{
    "prompt": "Create a table with 3 columns: Name, Status, Priority",
    "context": {
      "pageId": "page-123",
      "action": "create_block"
    }
  }'
```

**Response (200 OK):**
```json
{
  "llm": {
    "reply": "I'll create a table block for you.",
    "commands": [
      {
        "type": "docs.block.insertAfter",
        "pageId": "page-123",
        "blockType": "table",
        "initial": {
          "columns": [
            {"id": "col-1", "name": "Name"},
            {"id": "col-2", "name": "Status"},
            {"id": "col-3", "name": "Priority"}
          ],
          "rows": []
        }
      }
    ]
  }
}
```

**Available Command Types:**
- `docs.page.create` - Create new page
- `docs.block.insertAfter` - Insert block after specified block
- `docs.block.update` - Update existing block
- `docs.block.delete` - Delete block
- `docs.block.toggleLock` - Toggle lock status
- `db.row.insert` - Insert database row
- `n8n.node.connect` - Connect n8n nodes
- `integration.openclaw.send` - Send OpenClaw message

---

## 🔍 Analysis

### `POST /api/github/analyze`
Analyze a GitHub repository README and generate documentation structure.

**Request:**
```bash
curl -X POST http://localhost:3000/api/github/analyze \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: <token>" \
  -d '{"url": "https://github.com/facebook/react"}'
```

**Response (200 OK):**
```json
{
  "url": "https://github.com/facebook/react",
  "owner": "facebook",
  "repo": "react",
  "llm": {
    "reply": "Analysis complete",
    "commands": [...]
  }
}
```

### `POST /api/website/analyze`
Scrape and analyze a website, generate documentation.

**Request:**
```bash
curl -X POST http://localhost:3000/api/website/analyze \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: <token>" \
  -d '{"url": "https://example.com"}'
```

**Response (200 OK):**
```json
{
  "url": "https://example.com",
  "summary": {
    "title": "Example Domain",
    "h1s": ["Example Domain"],
    "h2s": [],
    "text": "..."
  },
  "llm": {
    "reply": "Documentation generated",
    "commands": [...]
  }
}
```

### `POST /api/images/search`
Search for relevant images for documentation.

**Request:**
```bash
curl -X POST http://localhost:3000/api/images/search \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: <token>" \
  -d '{"query": "database architecture diagram"}'
```

**Response (200 OK):**
```json
{
  "query": "database architecture diagram",
  "llm": {
    "content": "[{\"url\": \"https://...\", \"title\": \"...\"}]"
  }
}
```

## Supabase Postgres Provisioning (Database blocks)
> Requires `SUPABASE_DB_URL`.

### `POST /api/db/table/create`
Create a table for an OpenDocs Database block.
Input:
```json
{ "tableName": "opendocs_db_<page>_<block>", "columns": [{"name":"name","type":"text"}] }
```

### `POST /api/db/table/drop`
Drop the provisioned table.
Input: `{ "tableName": "..." }`

### `POST /api/db/table/ensure-columns`
Idempotent schema migration for newly added properties.
Input:
```json
{ "tableName": "...", "columns": [{"name":"status","type":"select"}] }
```

### `POST /api/db/rows/create`
Reserve a row id.
Input: `{ "tableName": "...", "rowId": "uuid" }`

### `POST /api/db/rows/upsert`
Upsert row data.
Input:
```json
{ "tableName": "...", "rowId": "uuid", "data": {"name":"A","status":"opt_1"} }
```

### `POST /api/db/rows/delete`
Delete a row.
Input: `{ "tableName": "...", "rowId": "uuid" }`

## Automations (If/Then) — v1
> **Status:** Implemented (v1). Rules can be executed via `trigger` and triggers can be installed via `rules/sync`.

## n8n Integration (Workflow Nodes)
> **Status:** Implemented (server proxy + UI block).

### `POST /api/n8n/nodes`
Lists available n8n node modules.

### `POST /api/n8n/workflows/create`
Creates a workflow in n8n.

### `POST /api/n8n/nodes/update`
Creates/updates a node in an n8n workflow.

### `POST /api/n8n/nodes/connect`
Connects two nodes in a workflow.

### `POST /api/n8n/nodes/toggle`
Enables/disables a node.

### `POST /api/db/automations/install`
Installs the rules table `opendocs_automation_rules`.

### `POST /api/db/automations/rules/create`
Creates a rule row.
Input:
```json
{ "tableName": "opendocs_db_*", "whenColumn": "status", "whenEquals": "Done", "thenSetColumn": "closed_at", "thenSetValue": "2026-02-09T00:00:00Z" }
```

### `POST /api/db/automations/rules/sync`
Installs/updates a Postgres trigger for the given table so rules run server-side on updates.
Input:
```json
{ "tableName": "opendocs_db_<page>_<block>" }
```

### `POST /api/db/automations/trigger`
Executes rules for a single row (explicit execution path; useful for manual runs / debugging).
Input:
```json
{ "tableName": "opendocs_db_<page>_<block>", "rowId": "uuid" }
```
