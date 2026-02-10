# N8N Workflows & Automation

> **n8n** is a FREE, fair-code workflow automation platform that integrates directly into OpenDocs. This guide covers local setup, workflow creation, common patterns, and production best practices.

---

## 1. Quick Start & Local n8n Setup

### What is n8n?

n8n is a visual workflow orchestration platform that enables you to:
- **Automate repetitive tasks** without code (or with code for complex logic)
- **Connect APIs & databases** through a drag-and-drop interface
- **Schedule recurring jobs** using cron expressions
- **Transform & enrich data** with multi-step workflows
- **Trigger actions conditionally** based on If/Then logic

**Common Use Cases:**
- Database → Email notifications (new record alerts)
- API → Database sync (pull data from external API, store in Supabase)
- Data transformation (clean, enrich, validate data)
- Conditional routing (different actions based on conditions)
- Scheduled backups & data exports

### Docker Setup (Local Development)

**Prerequisite:** Docker installed & running.

```bash
# 1. Pull n8n Docker image
docker pull n8n

# 2. Start n8n container (port 5678)
docker run -d \
  --name n8n-dev \
  -p 5678:5678 \
  -e N8N_HOST=localhost \
  -e WEBHOOK_URL=http://localhost:5678 \
  n8n

# 3. Verify container is running
docker ps | grep n8n-dev

# 4. Check n8n health endpoint
curl -s http://localhost:5678/api/v1/health | python3 -m json.tool
```

**Expected Output:**
```json
{
  "status": "ok",
  "version": "1.x.x"
}
```

### Frontend Registration & Server Connection

**Step 1: Open n8n UI**
```
http://localhost:5678
```

**Step 2: Create Owner Account**
- Email: your-email@example.com
- Password: strong-password-here
- Click "Continue"

**Step 3: Generate API Token**
1. Open n8n UI → Account Settings (bottom left, user icon)
2. Click "API Tokens" tab
3. Click "+ Create API Token"
4. Name: "OpenDocs Integration"
5. Scopes: Select all (or at minimum: workflows:read, workflows:write, nodes:read)
6. Copy token → Save in `.env` file as `N8N_API_TOKEN`

**Step 4: Verify Connection**
```bash
# Test API connectivity
curl -X GET http://localhost:5678/api/v1/workflows \
  -H "X-N8N-API-KEY: your-api-token"

# Should return: {"data":[]} (empty workflows list)
```

### First Workflow Creation (Manual Test)

**In n8n UI:**

1. Click "+ New" button (top left)
2. Name: "Test Workflow"
3. Add node:
   - Click "+" icon in center
   - Search for "HTTP Request"
   - Select "HTTP Request" node
4. Configure HTTP Request node:
   - Method: GET
   - URL: `https://jsonplaceholder.typicode.com/posts/1`
5. Click "Execute node" (play button)
6. View result in sidebar (should show post data)
7. Save workflow (Ctrl+S)

**✅ Success:** You see JSON post data in the output panel.

---

## 2. Module Ecosystem Overview

### Available Node Categories

n8n includes 400+ pre-built modules (nodes) organized by category:

| Category | Purpose | Common Nodes |
|----------|---------|--------------|
| **HTTP & REST** | External API calls, webhooks | HTTP Request, Webhook, REST API |
| **Database** | SQL queries, data operations | Postgres, MySQL, MongoDB, Supabase |
| **Data Transform** | Format conversion, parsing | Set, Split, Merge, Transform |
| **Conditional Logic** | If/Then, routing, filters | If, Switch, Filter, Expression |
| **Communication** | Emails, messages, notifications | Gmail, Slack, Discord, Telegram |
| **Files & Storage** | File operations, cloud storage | AWS S3, Google Drive, File Trigger |
| **Scheduling** | Time-based triggers | Cron, Date Trigger, Timer |
| **AI & ML** | OpenAI, Hugging Face, embeddings | ChatGPT, Image Gen, Summarization |
| **Custom Code** | JavaScript/Python execution | Function, Python, Code |

### Core n8n Nodes (In Every Workflow)

**Trigger Nodes** (workflow entry points):
- **Webhook Trigger:** Listen for HTTP POST requests
- **Cron Trigger:** Run on schedule (e.g., every day at 9 AM)
- **File Trigger:** Run when file is created/modified
- **Database Trigger:** Run when table record is inserted/updated

**Action Nodes** (perform work):
- **HTTP Request:** Call external APIs
- **Database Query:** Execute SQL queries
- **Set Data:** Create/modify variables
- **Send Email:** Send email notifications

**Control Flow Nodes** (route execution):
- **If/Then:** Branch based on condition
- **Switch:** Route based on expression value
- **Error Handler:** Catch & handle errors

### Module Filtering & Search

**In n8n UI:**

1. Click "+" button to add node
2. Search by keyword: "HTTP", "Postgres", "Gmail", etc.
3. Filter by category (top tabs: Core, Communication, Data, etc.)
4. Star favorite modules for quick access

**Tip:** Most common modules:
- HTTP Request (nearly every workflow)
- If/Then (conditional logic)
- Set Data (data transformation)
- Database Query (Postgres, MySQL, Supabase)
- Send Email / Slack (notifications)

### Custom Node Creation (Advanced)

For operations not covered by pre-built nodes, create custom code:

```javascript
// In n8n: Add "Function" node

// Input: $input.all() returns array of workflow items
const items = $input.all();

return items.map((item) => ({
  ...item.json,
  timestamp: new Date().toISOString(),
  customField: item.json.name.toUpperCase()
}));
```

---

## 3. Creating Workflows in OpenDocs UI

### Workflow Block Insertion (Slash Menu)

In OpenDocs documents, add n8n workflows directly:

**Step 1: Insert Workflow Block**
1. Place cursor in document
2. Type `/workflow` (or search slash menu)
3. Select "N8N Workflow"
4. Click "Create Workflow" button (opens n8n modal)

**Step 2: Workflow Modal Opens**
- Shows n8n interface embedded in modal
- All n8n UI features available
- Automatically saved when you close modal

### Adding Nodes (Drag-and-Drop)

**In Workflow Modal:**

1. **Add Starting Node** (trigger):
   - Click "+" in center
   - Search for "Webhook Trigger" or "Cron Trigger"
   - Click to add

2. **Connect First Node:**
   - Red dot on right side = output
   - Click and drag to "+" below to add next node

3. **Add Action Node:**
   - Search for "HTTP Request"
   - Configure URL, method, headers
   - Connect to previous node

4. **Add Conditional Logic (Optional):**
   - Add "If/Then" node
   - Set condition (e.g., status === 200)
   - Route success/error paths

### Node Configuration

Each node has configuration panel (right sidebar):

**Example: HTTP Request Node**
```
Method: GET | POST | PUT | DELETE
URL: https://api.example.com/endpoint
Headers: 
  - Content-Type: application/json
  - Authorization: Bearer YOUR_TOKEN
Query Parameters:
  - page: 1
  - limit: 100
Body: (for POST/PUT)
```

**Example: If/Then Node**
```
Condition: 
  - If: {{ $json.status }}
  - equals: 200
  - Then route: "True" path
  - Else route: "False" path
```

### Connection Drawing (Visual Node Linking)

**Workflow Execution Flow:**

```
[Webhook Trigger] 
        ↓
[HTTP Request: Fetch Data]
        ↓
[If/Then: Check Status]
      ↙    ↘
   Success  Error
      ↓       ↓
  [Save to DB] [Send Alert]
      ↓       ↓
[Finish]  [Finish]
```

**In UI:**
- Red dots = input ports
- Orange dots = output ports
- Click & drag from output to input to connect
- Arrows show data flow direction

### Workflow Testing (Preview & Debug)

**Test Individual Node:**
1. Hover over any node
2. Click "Execute node" (play button)
3. View output in right sidebar
4. Check execution time & data

**Test Full Workflow:**
1. Click "Execute" (top toolbar)
2. Workflow runs from trigger through all nodes
3. View execution log (right sidebar)
4. Each node shows input/output data
5. Execution time: total duration

**Debug Mode:**
- All executions logged in "Executions" tab
- Click past execution to view full trace
- See data transformation at each step
- Identify where workflow fails

---

## 4. Common Workflow Patterns

### Pattern 1: API → Database Sync

**Use Case:** Fetch data from external API every day, store in Supabase.

**Nodes:**
1. **Cron Trigger:** "Every day at 9 AM"
2. **HTTP Request:** GET https://jsonplaceholder.typicode.com/posts
3. **Set Data:** Extract & transform fields
4. **Supabase Query:** INSERT INTO posts (title, body, userId)
5. **Send Email:** Notify on success

**Flow:**
```
Cron (daily) → HTTP GET → Transform → DB Insert → Email Alert
```

### Pattern 2: Database → Notification

**Use Case:** When new user signs up, send welcome email + Slack notification.

**Nodes:**
1. **Database Trigger:** Postgres on INSERT to users table
2. **If/Then:** Check user.email_verified === true
3. **Gmail:** Send welcome email
4. **Slack:** Send channel notification
5. **Set Data:** Mark user as notified

**Flow:**
```
DB Trigger → Verify Email → Email + Slack → Mark Done
```

### Pattern 3: Multi-Step Data Transform

**Use Case:** CSV upload → clean data → validate → store → export.

**Nodes:**
1. **File Trigger:** On CSV file upload
2. **Read CSV:** Parse file into array
3. **Function (Custom):** Clean & normalize fields
4. **If/Then:** Validate required fields
5. **Batch:** Process in chunks (500 per batch)
6. **Database Query:** INSERT cleaned data
7. **Set Data:** Generate export file
8. **Send File:** Email CSV export back

**Flow:**
```
File Upload → Parse → Clean → Validate → Batch → Insert → Export
```

### Pattern 4: Conditional Logic & Routing

**Use Case:** Process orders based on amount (small/medium/large).

**Nodes:**
1. **Webhook Trigger:** Receive order data
2. **If/Then:** Branch by order.amount
   - Path 1: amount < 100 → Auto-approve
   - Path 2: amount 100-500 → Send for review
   - Path 3: amount > 500 → Escalate
3. **Database Query:** Update order status per path
4. **Slack:** Notify appropriate team

**Flow:**
```
Webhook → Switch on Amount → 3 Paths → DB Update → Notifications
```

### Pattern 5: Scheduled Jobs & Cleanup

**Use Case:** Daily maintenance: archive old records, generate reports.

**Nodes:**
1. **Cron Trigger:** "Every day at 2 AM"
2. **Database Query:** SELECT * FROM logs WHERE created_at < 30 days ago
3. **Function:** Generate JSON export
4. **AWS S3:** Archive to backup bucket
5. **Database Query:** DELETE FROM logs WHERE created_at < 30 days ago
6. **Send Email:** Confirm cleanup completed

**Flow:**
```
Cron → Query Old Data → Archive → Delete → Confirm
```

---

## 5. Debugging & Testing Workflows

### Enable Debug Mode

**In n8n UI:**

1. Open workflow
2. Click "Settings" (gear icon, top right)
3. Toggle "Debug Mode" ON
4. Every execution logs detailed data

**Debug Panel Shows:**
- Input data to each node
- Output data from each node
- Execution time per node
- Error messages (if any)
- Variable values at each step

### Inspect Node Outputs

**To see what data flows between nodes:**

1. Execute workflow (click play)
2. Click on any node in visualization
3. Right sidebar shows:
   - Input JSON (what node received)
   - Output JSON (what node produced)
   - Execution time (ms)

**Example Output:**
```json
// HTTP Request node output
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident...",
  "body": "quia et suscipit..."
}
```

### Test Individual Nodes

**Without running full workflow:**

1. Add node to workflow
2. Hover over node
3. Click "Execute node" (play icon)
4. View output immediately
5. Useful for testing HTTP requests, database queries

**Tip:** Test nodes in order as you build to catch issues early.

### View Execution History

**In n8n UI:**

1. Open workflow
2. Click "Executions" tab (right sidebar)
3. Browse past runs:
   - Successful (green checkmark)
   - Failed (red X)
   - Incomplete (yellow clock)
4. Click execution to see full trace

**Execution Details Show:**
- Start & end times
- Duration (total)
- Input data
- Output data
- Error messages

### Common Debugging Patterns

**Issue: Node returns empty data**
- Solution: Check input data (left sidebar)
- Verify previous node executed successfully
- Check If/Then logic (may have filtered data)

**Issue: Database insert fails**
- Solution: Check column names match schema
- Verify data types (string vs number)
- Ensure authentication token is valid

**Issue: API request times out**
- Solution: Increase timeout (node settings)
- Check API endpoint URL is correct
- Verify API token/authentication is valid

**Issue: Conditional branch not triggered**
- Solution: Log variable values before If/Then
- Use expression debugger to test condition
- Check variable name capitalization

---

## 6. Production Best Practices

### Error Handling (Try/Catch Pattern)

**Pattern: Catch workflow errors gracefully**

**Nodes:**
1. Main workflow steps (HTTP, Database, etc.)
2. **Error Handler** (node) → catches any errors
3. Log error (for debugging)
4. Send alert (Slack, email)
5. Exit gracefully (don't cascade errors)

**Example:**
```
[HTTP Request] ← Success path
      ↓
[Process Data]
      ↓
[Save to DB]
      ↓
   Success!

If any node fails → Error Handler:
  - Log error details
  - Send Slack alert
  - Retry after 1 minute (optional)
  - Mark workflow as failed
```

### Rate Limiting (Batch Operations)

**Pattern: Avoid overwhelming external APIs**

```
[Fetch 1000 records] 
      ↓
[Batch node: 50 records per batch]
      ↓
[Loop: Process each batch]
      ↓
[HTTP Request with delay: 100ms between requests]
      ↓
[Database Insert]
```

**Configuration:**
- Batch size: 50-100 items per request (check API limits)
- Delay: 100-500ms between requests (avoid rate limiting)
- Retry: 3 attempts with exponential backoff

### Monitoring & Alerting

**Track workflow health:**

```javascript
// In Function node:
return [{
  "workflow_name": "API Sync Daily",
  "execution_date": new Date().toISOString(),
  "status": "success",
  "records_processed": 1000,
  "duration_seconds": 45,
  "next_run": "tomorrow 9 AM"
}];
```

**Log to database:**
- Store execution metrics in workflow_logs table
- Track success rate, duration, record counts
- Alert if error rate > 5% or duration > 2x normal

**Send alerts:**
- Slack: Daily summary (success count, errors, duration)
- Email: Weekly report with metrics & trends
- Dashboard: Real-time workflow status

### Backup & Versioning

**Export workflows regularly:**

```bash
# Export single workflow as JSON
curl -X GET http://localhost:5678/api/v1/workflows/123 \
  -H "X-N8N-API-KEY: your-token" > workflow-backup.json

# Keep version history in git
git add workflow-backup.json
git commit -m "n8n: Update API sync workflow (added error handling)"
```

**Best practice:** Export workflows before making changes, store in version control.

### Security (No Credentials in Flows)

**❌ NEVER do this:**
```javascript
// DON'T: Hardcode credentials
const password = "my-secret-password";
const apiKey = "sk-1234567890abcdef";
```

**✅ DO this instead:**

1. **Store credentials in n8n:**
   - Account Settings → Credentials
   - Create credential entry (Postgres connection, API Key, etc.)
   - Reference in node configuration

2. **Use environment variables:**
   - In Docker: set ENV vars
   - In n8n: access via `process.env.VAR_NAME`

3. **Server-side token injection** (for OpenDocs integration):
   - Keep tokens in backend environment variables
   - Proxy requests through server
   - Never expose tokens to client

---

## 7. Troubleshooting Common Issues

### Issue 1: "Workflow fails silently"

**Symptoms:** Workflow runs but no data appears in database.

**Solutions:**
1. Enable Debug Mode (Settings → Debug Mode ON)
2. Check execution log (Executions tab)
3. Click each node to view input/output
4. Look for red X marks (failed nodes)
5. Click failed node → see error message

### Issue 2: "Timeout errors"

**Symptoms:** "Request timeout after 30s"

**Solutions:**
1. Check API endpoint is responding (test in curl)
2. Increase node timeout: Node Settings → Request Timeout: 60s
3. Optimize query (add WHERE clause, index database)
4. Batch large requests (process 100 items, loop 10x)

### Issue 3: "Database connection drops"

**Symptoms:** "Lost connection to database", random INSERT failures

**Solutions:**
1. Check connection string is correct (Settings → Credentials)
2. Verify database is running: `docker ps | grep postgres`
3. Increase connection pool: Credentials → Connection Limit: 20
4. Add retry logic: If/Then → Retry on error (3 attempts)

### Issue 4: "Memory issues / crashes"

**Symptoms:** n8n process crashes with large datasets, "out of memory"

**Solutions:**
1. Process data in batches (Batch node: 100-500 items per batch)
2. Delete old executions: Executions tab → Delete
3. Increase Docker memory: `docker run -m 2gb ...`
4. Stream large files (read chunk by chunk, not all at once)

---

## 8. FAQs & Advanced Patterns

### Q: Can I use n8n standalone outside OpenDocs?

**A:** Yes! n8n works independently:
- Run `docker run -p 5678:5678 n8n` for full control
- Create & manage workflows entirely in n8n UI
- OpenDocs integration is optional convenience feature

### Q: How do I trigger workflows from OpenDocs UI?

**A:** Three methods:

1. **Webhook Trigger:**
   - In workflow: Add "Webhook Trigger" node
   - Copy webhook URL (right sidebar)
   - Add button in OpenDocs that POSTs to webhook

2. **Database Trigger:**
   - Workflow triggered automatically on database INSERT/UPDATE
   - No manual trigger needed (autonomous)

3. **Scheduled Trigger:**
   - Cron Trigger runs on schedule (9 AM daily, etc.)
   - No manual trigger (autonomous)

### Q: What are performance limits?

**Limits & Recommendations:**
- Concurrent executions: Max 10 parallel workflows (docker resource dependent)
- Request timeout: Default 30s (increase per node if needed)
- Batch size: Process 50-500 items per batch (depends on item size)
- Execution history: Keep last 1000 executions (archive older to storage)

### Advanced Pattern: Multi-Tenant Workflows

**Scenario:** Different workflows per customer (Supabase multi-tenant).

```
[Webhook Trigger] → { tenantId: 123, data: {...} }
         ↓
[If/Then] check tenantId in allowed list
         ↓
[Set Data] filter database query by tenantId
         ↓
[Database Query] SELECT * FROM orders WHERE tenant_id = 123
         ↓
[Process] apply tenant-specific logic
         ↓
[Save] INSERT results to tenant bucket
```

**Key:** Every query filters by `tenant_id` to prevent cross-tenant data leaks.

---

## Next Steps

1. **Start local n8n:** `docker run -d -p 5678:5678 n8n`
2. **Create first workflow:** Use Pattern #1 (API → Database)
3. **Test in OpenDocs:** Insert workflow block, verify execution
4. **Monitor:** Check executions tab, view logs
5. **Deploy:** Export workflow, store in git, document in team wiki

**Questions?** Reference API-ENDPOINTS.md for integration details, or ARCHITECTURE.md for design principles.
