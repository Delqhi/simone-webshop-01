# OpenDocs — SUPABASE.md

OpenDocs supports **optional Supabase integration** in two distinct layers:

1.  **Frontend Sync (Supabase JS):** User auth and realtime document synchronization (Vite environment variables).
2.  **Server-side Provisioning (Postgres):** Automatic creation of real database tables when you insert a "Database" block in a document (Express environment variables).

---

## 🟢 Database Views & Workflows (Best Practices 2026)

OpenDocs uses **Object-Based Whiteboarding**. Every node in a Workflow block and every row in a Database block is a structured record in your Supabase Postgres.

### 1. Unified Data Layer
- **Table View:** Standard relational data entry.
- **Kanban View:** Drag-and-drop status management.
- **Workflow View:** Visual mapping of dependencies and logic flows.

All these views operate on the same provisioned table (e.g., `opendocs_db_xyz`).

---

## 1. Direct Postgres Provisioning (Database Blocks)

When you insert a **Database** block, OpenDocs automatically provisions a real table in your Supabase Postgres database. This allows you to treat documentation tables as real, queryable data structures.

### Requirements
The following environment variables must be set on the **Express server**:
- `SUPABASE_DB_URL`: The direct Postgres connection string (e.g., `postgresql://postgres:password@localhost:54322/postgres`).
- `SUPABASE_DB_SCHEMA`: The target schema (default: `public`).

### How it Works
1.  **Table Creation:** When a Database block is created, OpenDocs generates a deterministic, unique table name: `opendocs_db_<pageId>_<blockId>`. It then executes a `CREATE TABLE` command.
2.  **Schema Evolution:** Adding a property in the UI triggers an `ALTER TABLE ... ADD COLUMN` in the background.
3.  **Data Sync:** Adding or editing rows in the document triggers `INSERT` or `UPSERT` commands to the provisioned table.
4.  **Cleanup:** Deleting the Database block drops the corresponding table from Postgres (best-effort).

---

## 2. Automations (If/Then Rules)

OpenDocs includes an automation engine powered by **Postgres triggers + metadata rules**.

### Status
- ✅ **Implemented (v1):** rules table + rule creation + trigger install (`/api/db/automations/rules/sync`) + explicit run (`/api/db/automations/trigger`).
- ⬜ **Planned:** richer rule builder UI, typed operators (>, <, contains), audit log table, Edge Functions for long-running jobs.

### Setup
1. Call `POST /api/db/automations/install` once per Supabase instance.
2. Create rules with `POST /api/db/automations/rules/create`.
3. Install triggers per table with `POST /api/db/automations/rules/sync`.

### Execution model (v1)
- Trigger: **BEFORE UPDATE** on the provisioned table.
- Rules are matched by `table_name`.
- When condition matches (simple `=` for now), the trigger sets the configured column value.

### Best Practices 2026 notes
- Keep rules deterministic + idempotent.
- Use a dedicated schema or prefix allowlist (`opendocs_db_*`).
- Prefer Edge Functions for external side effects (emails/WhatsApp), and keep DB triggers for pure data updates.

---

## 3. Local Supabase Container

OpenDocs is designed to work with the **Supabase Open Source CLI/Docker** setup.

### Integration Steps
1.  Start your local Supabase: `supabase start`.
2.  Copy the connection details into your `.env` file.
3.  OpenDocs will automatically detect the configuration and enable the "Remote DB" badge on your database blocks.

---

## 4. API Reference for DB Ops

See `API-ENDPOINTS.md` for details on:
- `POST /api/db/table/create`
- `POST /api/db/table/drop`
- `POST /api/db/rows/upsert`
- `POST /api/db/automations/install`

---

## 5. Setup & Configuration

### Environment Variables

To enable Supabase integration in OpenDocs, configure the following environment variables on your **Express server**:

```bash
# Required for server-side database provisioning
SUPABASE_DB_URL=postgresql://postgres:password@localhost:54322/postgres
SUPABASE_DB_SCHEMA=public

# Optional: API authentication token for protected endpoints
API_AUTH_TOKEN=your-secret-token-here

# Optional: Frontend (Vite) environment for realtime sync
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important Security Notes:**
- Store `SUPABASE_DB_URL` and `API_AUTH_TOKEN` **server-side only** (never in Vite environment).
- Frontend access uses `VITE_SUPABASE_URL` with limited anonymous/service role JWT tokens (R1: No secrets in client).
- All direct Postgres operations are **Express-only** for security.

### Connection Pool Configuration

OpenDocs uses a **Node.js pg Pool** for connection management:

```javascript
// server.js (Lines 21-29)
const dbPool = SUPABASE_DB_URL
  ? new Pool({
      connectionString: SUPABASE_DB_URL,
      max: 4,                    // Max concurrent connections
      idleTimeoutMillis: 10_000  // 10s idle timeout
    })
  : null;
```

**Pool Behavior:**
- **Max 4 connections:** Prevents exhaustion on shared hosting.
- **Idle timeout:** Closes connections after 10 seconds of inactivity.
- **Graceful fallback:** If `SUPABASE_DB_URL` is not set, database features disable silently (no errors).

### Frontend vs Server-Side Setup

| Layer | Purpose | Technology | Environment |
|-------|---------|-----------|-------------|
| **Frontend Sync** | Real-time auth & document updates | Supabase JS SDK | `VITE_SUPABASE_*` |
| **Server Provisioning** | Table creation, automations, row sync | Node.js pg Pool | `SUPABASE_DB_URL` |

**Frontend Example:**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Subscribe to realtime table changes
supabase
  .channel(`public:opendocs_db_xyz`)
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('Change received:', payload);
    // Update Zustand store
  })
  .subscribe();
```

**Server Example:**
```javascript
// server.js (Lines 158-175)
app.post('/api/db/table/create', async (req, res) => {
  const { tableName, columns } = req.body;
  
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS public."${tableName}" (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        ${columns.map(c => `"${c.name}" ${mapColType(c.type)}`).join(', ')}
      );
    `;
    
    await dbPool.query(query);
    res.json({ ok: true, tableName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Prerequisites & Requirements Checklist

Before enabling Supabase integration, ensure:

- ✅ **Supabase Project Created:** Either [cloud.supabase.com](https://cloud.supabase.com) or local `supabase start`
- ✅ **PostgreSQL 14+:** Required for UUID, timestamp, and trigger support
- ✅ **Connection String Available:** Direct Postgres URL (not REST API URL)
- ✅ **Network Access:** Express server can reach Supabase Postgres port (default 5432)
- ✅ **Environment Variables:** All required vars set in `.env`
- ✅ **Node.js 18+:** For pg pool and async/await support
- ✅ **Realtime Publications Enabled:** For frontend sync (`ALTER PUBLICATION supabase_realtime ADD TABLE`)

---

## 6. Database Provisioning Workflow

### How Database Blocks Create Real Tables

When you insert a **Database block** in an OpenDocs document, the following sequence occurs:

```
1. User inserts Database block
   ↓
2. Frontend assigns pageId + blockId (via nanoid)
   ↓
3. POST /api/db/table/create called
   ├─ tableName = opendocs_db_<pageId>_<blockId>
   ├─ schema = public (from SUPABASE_DB_SCHEMA)
   └─ columns = [] (empty initially)
   ↓
4. Express executes CREATE TABLE command
   ├─ System columns: id (uuid), created_at, updated_at (auto)
   ├─ Realtime publication: ALTER PUBLICATION supabase_realtime ADD TABLE
   └─ Responds with { ok: true, tableName }
   ↓
5. Frontend updates Zustand store
   ├─ Database block now displays "✓ Synced to Postgres"
   ├─ Badge shows "Remote DB" (green indicator)
   └─ User can add rows and properties
```

### Deterministic Table Naming

OpenDocs uses a **strict naming convention** to ensure idempotent table creation:

```
Table Name Format: opendocs_db_<pageId>_<blockId>

Examples:
  opendocs_db_page123_block456
  opendocs_db_abc789_def012
  opendocs_db_8x7k2m_9p1q3r

Allowlist Regex: ^opendocs_db_[a-z0-9_]+$i

Safety: Prevents SQL injection via qIdent() function (server.js line 380)
```

**Why deterministic?**
- **Idempotent:** Creating the same block twice creates the same table (no duplicates).
- **Portable:** Exporting and re-importing documents preserves table references.
- **Debuggable:** You can query tables directly: `SELECT * FROM public.opendocs_db_page123_block456`

### Column Type Mapping

When you add a property in the Database block UI, OpenDocs maps it to a PostgreSQL column type:

```javascript
// server.js (Lines 388-403)
const typeMapping = {
  'text':     'text',                    // String, unlimited length
  'number':   'double precision',        // Float numbers (64-bit)
  'checkbox': 'boolean',                 // true/false
  'date':     'timestamptz',             // Date + timezone aware
  'select':   'text'                     // Multi-select stored as text
};

// Example: Adding columns
POST /api/db/table/ensure-columns
Body: {
  tableName: 'opendocs_db_xyz',
  columns: [
    { name: 'title', type: 'text' },
    { name: 'priority', type: 'number' },
    { name: 'completed', type: 'checkbox' },
    { name: 'due_date', type: 'date' }
  ]
}

// Generates SQL:
ALTER TABLE public.opendocs_db_xyz
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS priority double precision,
  ADD COLUMN IF NOT EXISTS completed boolean,
  ADD COLUMN IF NOT EXISTS due_date timestamptz;
```

### Auto-Generated System Columns

Every provisioned table includes **3 automatic system columns**:

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `id` | uuid | `gen_random_uuid()` | Primary key (globally unique) |
| `created_at` | timestamptz | `now()` | Row insertion timestamp |
| `updated_at` | timestamptz | `now()` | Last modification timestamp |

**Benefits:**
- Automatic audit trail (when each row was created/modified)
- Globally unique IDs for distributed systems
- Realtime sync uses these columns to detect changes

### Realtime Publication Setup

For frontend realtime subscriptions to work, tables must be published to `supabase_realtime`:

```sql
-- Automatic during table creation (server.js line 439)
ALTER PUBLICATION supabase_realtime ADD TABLE public."opendocs_db_<pageId>_<blockId>";

-- Enables frontend to subscribe:
supabase
  .channel(`public:opendocs_db_xyz`)
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('Row inserted:', payload.new);
  })
  .subscribe();
```

### Step-by-Step Flow with API Examples

**Step 1: Create Table**
```bash
curl -X POST http://localhost:3000/api/db/table/create \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: your-token" \
  -d '{
    "tableName": "opendocs_db_page123_block456",
    "columns": [
      { "name": "title", "type": "text" },
      { "name": "status", "type": "select" }
    ]
  }'

# Response:
{
  "ok": true,
  "tableName": "opendocs_db_page123_block456"
}
```

**Step 2: Insert Row**
```bash
curl -X POST http://localhost:3000/api/db/rows/create \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: your-token" \
  -d '{
    "tableName": "opendocs_db_page123_block456",
    "data": {
      "title": "Fix login bug",
      "status": "in_progress"
    }
  }'

# Response:
{
  "ok": true,
  "rowId": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-02-03T12:34:56Z"
}
```

**Step 3: Realtime Subscription (Frontend)**
```typescript
supabase
  .channel(`public:opendocs_db_page123_block456`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'opendocs_db_page123_block456'
  }, (payload) => {
    if (payload.eventType === 'INSERT') {
      console.log('New row:', payload.new);
      // Update Zustand store: zustand.setRows([...rows, payload.new])
    } else if (payload.eventType === 'UPDATE') {
      console.log('Updated row:', payload.new);
      // Update Zustand store: replace old with new
    }
  })
  .subscribe();
```

---

## 7. Schema Management & Migrations

### Adding Properties Without Downtime

When you add a new property to a Database block, OpenDocs executes an **ALTER TABLE ADD COLUMN** command:

```sql
ALTER TABLE public.opendocs_db_page123_block456
  ADD COLUMN IF NOT EXISTS new_property text;
```

**Key Features:**
- **IF NOT EXISTS:** Idempotent (safe to retry).
- **Non-blocking:** Existing queries continue to work.
- **Backward compatible:** Old rows have NULL for new columns.
- **Zero downtime:** No table locks in PostgreSQL 11+.

### Column Type Evolution

You can safely change a column's type **via schema migration**:

```sql
-- Old type: text
-- New type: double precision (for numbers)

ALTER TABLE public.opendocs_db_xyz
  ALTER COLUMN priority TYPE double precision
    USING priority::numeric::double precision;
```

**Safety:** The `USING` clause tells PostgreSQL how to convert existing data.

### Safe Identifier Handling (qIdent)

OpenDocs sanitizes all table and column names via the **qIdent** function to prevent SQL injection:

```javascript
// server.js (Line 380)
function qIdent(id) {
  // Validates against allowlist regex
  if (!/^[a-z0-9_]+$/i.test(id)) {
    throw new Error(`Invalid identifier: ${id}`);
  }
  return `"${id}"`;  // Quote for safety
}

// Usage:
const query = `ALTER TABLE ${qIdent(tableName)} ADD COLUMN ${qIdent(colName)} text`;
// Result: ALTER TABLE "opendocs_db_xyz" ADD COLUMN "my_column" text;
```

### Idempotent Migration Patterns

All schema operations use **IF EXISTS / IF NOT EXISTS** clauses:

```sql
-- Safe to run multiple times
CREATE TABLE IF NOT EXISTS public.table_name (...);
ALTER TABLE table_name ADD COLUMN IF NOT EXISTS col_name type;
DROP TABLE IF EXISTS old_table CASCADE;
```

**Benefit:** Migrations can be retried without causing errors.

### No-Downtime Schema Changes Best Practices

1. **Always use IF NOT EXISTS / IF NOT EXISTS:**
   ```sql
   ALTER TABLE table_name ADD COLUMN IF NOT EXISTS col text;
   ```

2. **For large tables, add columns with defaults carefully:**
   ```sql
   -- Fast (NULL default, no rewrite)
   ALTER TABLE table_name ADD COLUMN new_col text;
   
   -- Slow (rewrites all rows)
   ALTER TABLE table_name ADD COLUMN new_col text DEFAULT 'value';
   ```

3. **Drop columns only if safe:**
   ```sql
   -- Check dependencies first
   ALTER TABLE table_name DROP COLUMN old_col CASCADE;
   ```

4. **Use transactions for related changes:**
   ```sql
   BEGIN;
   ALTER TABLE table_name ADD COLUMN col1 type1;
   ALTER TABLE table_name ADD COLUMN col2 type2;
   COMMIT;
   ```

---

## 8. Real-time Subscriptions & Sync

### Frontend Supabase Client Initialization

To enable real-time sync in your React components:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Test connection
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('Supabase connected:', session ? 'authenticated' : 'anonymous');
});
```

### Subscribing to Table Changes

```typescript
// src/lib/hooks/useTableSubscription.ts
import { useEffect } from 'react';
import { useStore } from '../store'; // Zustand
import { supabase } from '../supabase';

export function useTableSubscription(tableName: string) {
  const { setRows, deleteRow, upsertRow } = useStore();

  useEffect(() => {
    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            upsertRow(tableName, payload.new);
          } else if (payload.eventType === 'UPDATE') {
            upsertRow(tableName, payload.new);
          } else if (payload.eventType === 'DELETE') {
            deleteRow(tableName, payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);
}

// Usage in component:
export function DatabaseBlock({ blockId, pageId }: Props) {
  const tableName = `opendocs_db_${pageId}_${blockId}`;
  useTableSubscription(tableName);
  // ...
}
```

### Understanding Event Payloads

Postgres sends **3 types of events** through Supabase realtime:

```typescript
// INSERT event
{
  eventType: 'INSERT',
  schema: 'public',
  table: 'opendocs_db_xyz',
  new: { id: 'uuid', title: 'Task 1', created_at: '2026-02-03T12:00:00Z' },
  old: null
}

// UPDATE event
{
  eventType: 'UPDATE',
  schema: 'public',
  table: 'opendocs_db_xyz',
  new: { id: 'uuid', title: 'Task 1 (Updated)', created_at: '...', updated_at: '2026-02-03T13:00:00Z' },
  old: { id: 'uuid', title: 'Task 1', ... }
}

// DELETE event
{
  eventType: 'DELETE',
  schema: 'public',
  table: 'opendocs_db_xyz',
  new: null,
  old: { id: 'uuid', title: 'Task 1', ... }
}
```

### Integration with Zustand State Management

```typescript
// src/store.ts (snippet)
import { create } from 'zustand';

interface DatabaseBlockState {
  rows: Record<string, any[]>;
  upsertRow: (tableName: string, row: any) => void;
  deleteRow: (tableName: string, rowId: string) => void;
  setRows: (tableName: string, rows: any[]) => void;
}

export const useStore = create<DatabaseBlockState>((set) => ({
  rows: {},
  
  upsertRow: (tableName: string, row: any) =>
    set((state) => ({
      rows: {
        ...state.rows,
        [tableName]: (state.rows[tableName] || [])
          .filter((r) => r.id !== row.id)
          .concat(row)
      }
    })),
  
  deleteRow: (tableName: string, rowId: string) =>
    set((state) => ({
      rows: {
        ...state.rows,
        [tableName]: state.rows[tableName]?.filter((r) => r.id !== rowId) || []
      }
    })),
  
  setRows: (tableName: string, rows: any[]) =>
    set((state) => ({
      rows: { ...state.rows, [tableName]: rows }
    }))
}));
```

### Real-time vs Scheduled Sync Trade-offs

| Approach | Latency | Cost | Use Case |
|----------|---------|------|----------|
| **Real-time (Realtime API)** | < 100ms | Higher (persistent connection) | Live dashboards, collaborative editing |
| **Polling (5s interval)** | 2.5s avg | Lower | Occasional updates, non-critical |
| **Webhook (n8n trigger)** | 100-500ms | Variable | External system sync |

**Recommendation:** Use real-time for active users, polling for background sync.

### Performance Optimization Tips

1. **Filter subscriptions to reduce traffic:**
   ```typescript
   .on(
     'postgres_changes',
     {
       event: 'UPDATE',  // Only updates
       schema: 'public',
       table: tableName,
       filter: 'status=eq.in_progress'  // Postgres filter syntax
     },
     callback
   )
   ```

2. **Debounce rapid updates:**
   ```typescript
   const debouncedUpdate = debounce((row) => {
     upsertRow(tableName, row);
   }, 300);
   ```

3. **Unsubscribe from inactive tables:**
   ```typescript
   useEffect(() => {
     // Subscribe only when component mounts
     // Automatically unsubscribe on unmount
     return () => supabase.removeChannel(channel);
   }, []);
   ```

4. **Use batch operations:**
   ```typescript
   const batchUpsert = async (rows: any[]) => {
     const { data, error } = await supabase
       .from('opendocs_db_xyz')
       .upsert(rows);
   };
   ```

---

## 9. If/Then Automations Deep Dive

### Automation Rules Table Structure

OpenDocs stores automation rules in a dedicated table:

```sql
CREATE TABLE IF NOT EXISTS opendocs_automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  table_name text NOT NULL,           -- Target table
  when_column text NOT NULL,          -- Condition column
  when_equals text NOT NULL,          -- Condition value
  then_set_column text NOT NULL,      -- Action column
  then_set_value text NOT NULL        -- Action value
);

-- Example rows:
-- | id | table_name           | when_column | when_equals | then_set_column | then_set_value |
-- |----|----------------------|-------------|-------------|-----------------|----------------|
-- | .. | opendocs_db_xyz      | status      | done        | archived        | true           |
-- | .. | opendocs_db_abc      | priority    | urgent      | notify_slack    | true           |
```

### Creating Rules

Use the API to create automation rules:

```bash
curl -X POST http://localhost:3000/api/db/automations/rules/create \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: your-token" \
  -d '{
    "tableName": "opendocs_db_xyz",
    "whenColumn": "status",
    "whenEquals": "done",
    "thenSetColumn": "archived",
    "thenSetValue": "true"
  }'

# Response:
{
  "ok": true,
  "ruleId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Installing Triggers

Once rules are created, install triggers per table:

```bash
curl -X POST http://localhost:3000/api/db/automations/rules/sync \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: your-token" \
  -d '{
    "tableName": "opendocs_db_xyz"
  }'

# Response:
{
  "ok": true,
  "triggerName": "trig_opendocs_apply_automations_opendocs_db_xyz",
  "rulesApplied": 1
}
```

### Postgres Trigger Function Explanation

OpenDocs creates a **BEFORE UPDATE trigger** that executes a plpgsql function:

```sql
-- server.js (Lines 594-642)
CREATE TRIGGER trig_opendocs_apply_automations_<tableName>
BEFORE UPDATE ON public."<tableName>"
FOR EACH ROW
EXECUTE FUNCTION opendocs_apply_automations('<tableName>');

-- The function:
CREATE OR REPLACE FUNCTION opendocs_apply_automations(tbl text)
RETURNS TRIGGER AS $$
BEGIN
  -- Fetch all rules for this table
  FOR rule IN
    SELECT * FROM opendocs_automation_rules WHERE table_name = tbl
  LOOP
    -- If condition matches, set action
    IF NEW[rule.when_column] = rule.when_equals THEN
      NEW[rule.then_set_column] := rule.then_set_value;
    END IF;
  END LOOP;
  
  RETURN NEW;  -- Return modified row
END;
$$ LANGUAGE plpgsql;
```

**How it works:**
1. User updates a row in the table.
2. Trigger fires **BEFORE UPDATE**.
3. Function fetches all rules for that table.
4. For each rule, check if `when_column = when_equals`.
5. If true, set `then_set_column = then_set_value`.
6. Return the modified row (which is then inserted).

### Execution Flow: BEFORE UPDATE Trigger

```
User updates row (e.g., status = 'done')
  ↓
UPDATE opendocs_db_xyz SET status = 'done' WHERE id = 'xyz'
  ↓
PostgreSQL fires BEFORE UPDATE trigger
  ├─ Trigger: trig_opendocs_apply_automations_opendocs_db_xyz
  └─ Function: opendocs_apply_automations('opendocs_db_xyz')
  ↓
Function fetches rules for opendocs_db_xyz
  └─ Rule: IF status = 'done' THEN archived = 'true'
  ↓
Function checks: NEW.status = 'done'? YES
  ↓
Function sets: NEW.archived = 'true'
  ↓
Function returns modified NEW row
  ↓
PostgreSQL inserts NEW row with archived = 'true'
  ↓
Realtime notifies all subscribers
  └─ { eventType: 'UPDATE', new: { status: 'done', archived: 'true' } }
  ↓
Frontend updates Zustand store
```

### Manual Execution via API

You can manually trigger automations without updating a row:

```bash
curl -X POST http://localhost:3000/api/db/automations/trigger \
  -H "Content-Type: application/json" \
  -H "X-OpenDocs-Token: your-token" \
  -d '{
    "tableName": "opendocs_db_xyz",
    "rowId": "550e8400-e29b-41d4-a716-446655440000"
  }'

# Response:
{
  "ok": true,
  "rowId": "550e8400-e29b-41d4-a716-446655440000",
  "updated_at": "2026-02-03T13:45:00Z"
}
```

### Best Practices for Rule Design

1. **Keep rules deterministic (avoid loops):**
   ```sql
   -- Good: Simple condition → action
   IF status = 'done' THEN archived = 'true' END;
   
   -- Bad: Could create infinite loops
   IF archived = 'true' THEN status = 'done' END;
   ```

2. **Use idempotent actions (safe to repeat):**
   ```sql
   -- Good: Idempotent (same result always)
   SET archived = 'true';
   SET notify_slack = 'false';
   
   -- Bad: Non-idempotent (side effects)
   -- Sending webhooks in triggers is unreliable
   ```

3. **Prefer data mutations over external calls:**
   ```sql
   -- Good: Update columns (reliable)
   SET status = 'archived', updated_at = now();
   
   -- Defer to Edge Functions: webhook calls (better error handling)
   -- Use n8n for: sending emails, posting to Slack, etc.
   ```

4. **Document rule logic in comments:**
   ```sql
   -- Archive old tasks automatically
   -- Rule: IF status = 'done' AND age > 30 days THEN archived = true
   ```

---

## 10. Troubleshooting & Performance

### Common Issues & Solutions

**Issue 1: Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Verify Supabase is running: `docker ps | grep postgres`
- Check `SUPABASE_DB_URL` is correct
- Ensure network access: `psql postgresql://...` from terminal should work
- Check firewall rules for port 5432

**Issue 2: Pool Exhaustion**
```
Error: Client pool is exhausted
```
**Solution:**
- Increase pool size in server.js: `max: 8` (from default 4)
- Check for connection leaks: ensure `.query()` calls always release connections
- Monitor active connections: `SELECT count(*) FROM pg_stat_activity`

**Issue 3: Trigger Function Not Found**
```
ERROR: function opendocs_apply_automations does not exist
```
**Solution:**
- Install automations first: `POST /api/db/automations/install`
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'opendocs_apply_automations'`
- Verify schema is `public` not `custom_schema`

**Issue 4: Realtime Subscription Not Updating**
```
Subscribe works but no events received
```
**Solution:**
- Check table is published: `SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime'`
- Verify permissions: row-level security (RLS) must allow reads
- Test with INSERT directly: `INSERT INTO opendocs_db_xyz (title) VALUES ('test')`
- Check Supabase console for realtime logs

### Connection Pool Metrics & Monitoring

Monitor pool health:

```javascript
// server.js
setInterval(() => {
  if (dbPool) {
    console.log({
      activeConnections: dbPool.totalCount - dbPool.idleCount,
      idleConnections: dbPool.idleCount,
      totalConnections: dbPool.totalCount,
      maxConnections: dbPool.options.max
    });
  }
}, 10000);
```

**Expected values:**
- Active: 0-4 (rarely > 2)
- Idle: 2-4
- Total: ≤ 4 (max configured)

### Rate Limiting Behavior

OpenDocs enforces **60 requests per 60 seconds** per API token:

```javascript
// server.js (Lines 137-149)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;  // 60 seconds
const RATE_LIMIT_MAX = 60;             // 60 requests

app.use((req, res, next) => {
  const token = req.headers['x-opendocs-token'];
  const now = Date.now();
  
  if (!rateLimitMap.has(token)) {
    rateLimitMap.set(token, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  } else {
    const limit = rateLimitMap.get(token);
    if (now > limit.resetTime) {
      limit.count = 1;
      limit.resetTime = now + RATE_LIMIT_WINDOW_MS;
    } else if (limit.count >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    } else {
      limit.count++;
    }
  }
  
  next();
});
```

**If you hit rate limits:**
- Batch operations: Send multiple rows in one request (Upsert supports arrays)
- Increase delay between requests: Use setTimeout with 100ms intervals
- Contact admin to increase `RATE_LIMIT_MAX`

### Performance Optimization Techniques

1. **Use indexes for frequently queried columns:**
   ```sql
   CREATE INDEX idx_opendocs_db_xyz_status ON public.opendocs_db_xyz(status);
   ```

2. **Batch row operations:**
   ```bash
   # Slow: 100 individual requests
   for i in 1..100; do curl -X POST /api/db/rows/create ...; done
   
   # Fast: One batch upsert (if supported)
   POST /api/db/rows/batch-upsert with array of rows
   ```

3. **Filter realtime subscriptions:**
   ```typescript
   .on('postgres_changes', {
     event: 'UPDATE',
     filter: 'status=eq.done'  // Only updates where status='done'
   }, callback)
   ```

4. **Use pooled connections (default):**
   ```javascript
   // Already done in server.js: const dbPool = new Pool({ max: 4 })
   // Never create new Pool instances per request
   ```

### Debug Logging & Error Messages

Enable detailed logging:

```javascript
// server.js (add at top)
if (process.env.DEBUG) {
  console.log('DEBUG: Supabase DB URL:', process.env.SUPABASE_DB_URL);
  console.log('DEBUG: Pool config:', { max: 4, idleTimeoutMillis: 10_000 });
}

// Check specific endpoint logs
app.post('/api/db/table/create', async (req, res) => {
  console.log('POST /api/db/table/create:', req.body);
  try {
    // ...
  } catch (error) {
    console.error('Error creating table:', error.message);
    console.error('SQL:', error.query);  // from pg library
    res.status(500).json({ error: error.message, code: error.code });
  }
});
```

### FAQ: Supabase-Specific Scenarios

**Q: Can I use Supabase Cloud instead of local?**
A: Yes! Use the cloud connection string from [cloud.supabase.com](https://cloud.supabase.com) as `SUPABASE_DB_URL`. Realtime works identically.

**Q: How do I export my data?**
A: Use standard PostgreSQL export: `pg_dump -h host -U user database > backup.sql`

**Q: Can I modify tables directly in psql?**
A: Yes, but changes won't sync to OpenDocs UI unless you also update the block metadata. Use the UI for best results.

**Q: How do I backup/restore?**
A: Use Supabase's backup feature (cloud) or `pg_dump` + `psql` (local).

**Q: Can I use RLS (Row-Level Security)?**
A: Yes, but ensure `VITE_SUPABASE_ANON_KEY` has proper permissions. Test in Supabase dashboard first.

**Q: What if I hit the connection limit?**
A: The server will queue requests and respond with 429 (Too Many Requests). Reduce concurrent requests or increase `max: 8` in pool config.
