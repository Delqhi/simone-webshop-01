import express from "express";
import "dotenv/config";
import crypto from "crypto";
import { parse } from "url";
import pg from "pg";
import { healthMiddleware, readinessMiddleware, livenessMiddleware } from "./src/monitoring/health.js";
import { metricsMiddleware, metricsHandler, resetMetricsHandler } from "./src/monitoring/metrics.js";
import { loggingMiddleware, logsHandler, clearLogsHandler } from "./src/monitoring/logging.js";
import { mockN8nService, mockSupabaseService, mockOpenClawService } from "./src/api/mock-services/index.js";
import { createCacheMiddleware, getCacheManager } from "./src/middleware/cache-manager.js";
import { createRateLimitMiddleware } from "./src/middleware/rate-limiter.js";
import { createErrorMiddleware } from "./src/middleware/error-handler.js";
import { AuthError } from "./src/utils/error-types.js";

const { Pool } = pg;

const PORT = Number(process.env.PORT || 3000);

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com";
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || "moonshotai/kimi-k2.5";

const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN || ""; // optional; if set → required
const CORS_ORIGIN = process.env.CORS_ORIGIN || ""; // optional

// Supabase Postgres (local container) — optional but required for provisioning
const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL || "";
const SUPABASE_DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA || "public";

const dbPool = SUPABASE_DB_URL
  ? new Pool({ connectionString: SUPABASE_DB_URL, max: 4, idleTimeoutMillis: 10_000 })
  : null;

if (SUPABASE_DB_URL) {
  console.log(`[OpenDocs] Supabase DB connected: ${SUPABASE_DB_SCHEMA} schema`);
} else {
  console.log("[OpenDocs] Supabase DB URL not set. Database blocks will be local-only.");
}

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 60);

const WEBSITE_FETCH_TIMEOUT_MS = Number(process.env.WEBSITE_FETCH_TIMEOUT_MS || 12_000);
const WEBSITE_FETCH_MAX_BYTES = Number(process.env.WEBSITE_FETCH_MAX_BYTES || 750_000);
const WEBSITE_ALLOW_PRIVATE_IPS = process.env.WEBSITE_ALLOW_PRIVATE_IPS === "true";

if (!NVIDIA_API_KEY) {
  console.error("\n[OpenDocs] Missing NVIDIA_API_KEY. Set it in your environment.");
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

// Basic request id
app.use((req, res, next) => {
  const rid = req.header("x-request-id") || crypto.randomUUID();
  res.setHeader("x-request-id", rid);
  // @ts-ignore
  req.rid = rid;
  next();
});

// Basic CORS (only if configured)
app.use((req, res, next) => {
  if (CORS_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-OpenDocs-Token, X-Request-Id");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") return res.status(204).end();
  }
  next();
});

const rateLimitMiddleware = createRateLimitMiddleware();
app.use(rateLimitMiddleware);

// Monitoring Middleware Pipeline
app.use(healthMiddleware);
app.use(readinessMiddleware);
app.use(livenessMiddleware);
app.use(metricsMiddleware);
app.use(loggingMiddleware);

const cacheMiddleware = createCacheMiddleware({
  endpointTTLs: {
    "/api/health": 30_000,
    "/api/n8n/workflows": 60_000,
    "/api/supabase/tables": 120_000
  },
  noCachePatterns: [
    "/api/nvidia/",
    "/api/agent/",
    "/api/website/",
    "/api/metrics",
    "/api/logs"
  ]
});
app.use(cacheMiddleware);

function requireApiAuth(req, res, next) {
  if (!API_AUTH_TOKEN) return next();
  const token = req.header("x-opendocs-token") || "";
  if (!token || token !== API_AUTH_TOKEN) {
    return next(new AuthError("Missing or invalid API token"));
  }
  next();
}

// Public
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    product: "OpenDocs",
    model: NVIDIA_MODEL,
    features: {
      ai: true,
      agent: true,
      github: true,
      website: true,
      images: true,
    },
  });
});

// Protected API
app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  return requireApiAuth(req, res, next);
});

async function nvidiaChat({ messages, temperature = 0.2, stream = false }) {
  const resp = await fetch(`${NVIDIA_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": stream ? "text/event-stream" : "application/json",
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages,
      temperature,
      stream,
      max_tokens: stream ? 2048 : undefined,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`NVIDIA error: ${resp.status} ${text}`);
  }
  
  if (stream) {
    return resp.body;
  }
  
  return resp.json();
}

app.post("/api/nvidia/chat", async (req, res) => {
  try {
    const { messages, temperature, stream = false } = req.body || {};
    
    if (stream) {
      const streamBody = await nvidiaChat({ messages, temperature, stream: true });
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      streamBody.pipe(res);
    } else {
      // Keep non-streaming for backward compatibility
      const json = await nvidiaChat({ messages, temperature, stream: false });
      res.json(json);
    }
  } catch (e) {
    res.status(500).json({ error: "nvidia_chat_failed", message: String(e?.message || e) });
  }
});

// Minimal, safe-ish website fetch (SSRF mitigations: blocks private IPs unless allowed)
function isPrivateIp(host) {
  // Only basic checks; production should resolve DNS + check ip range. For now, block localhost and obvious private ranges.
  const h = (host || "").toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "0.0.0.0") return true;
  if (h.startsWith("127.")) return true;
  if (h.startsWith("10.")) return true;
  if (h.startsWith("192.168.")) return true;
  if (h.startsWith("172.")) {
    const parts = h.split(".");
    const second = Number(parts[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

async function fetchWebsiteText(urlStr) {
  const u = new URL(urlStr);
  if (!/^https?:$/.test(u.protocol)) throw new Error("Only http/https allowed");
  if (!WEBSITE_ALLOW_PRIVATE_IPS && isPrivateIp(u.hostname)) {
    throw new Error("Blocked private/localhost URL");
  }

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), WEBSITE_FETCH_TIMEOUT_MS);

  const resp = await fetch(urlStr, {
    signal: ac.signal,
    redirect: "follow",
    headers: {
      "User-Agent": "OpenDocsBot/2026 (+https://opendocs.local)",
      Accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.8,*/*;q=0.1",
    },
  }).finally(() => clearTimeout(t));

  if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);

  const reader = resp.body?.getReader();
  if (!reader) {
    const full = await resp.text();
    return full.slice(0, WEBSITE_FETCH_MAX_BYTES);
  }

  const decoder = new TextDecoder();
  let total = 0;
  let out = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > WEBSITE_FETCH_MAX_BYTES) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

function htmlToSummary(html) {
  // cheap extraction (no extra deps): title + h1/h2 + text snippets
  const title = (html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] || "").replace(/\s+/g, " ").trim();
  const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gis)].slice(0, 5).map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gis)].slice(0, 8).map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);

  return { title, h1s, h2s, text };
}

app.post("/api/website/analyze", async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string") return res.status(400).json({ error: "bad_request" });

    const html = await fetchWebsiteText(url);
    const summary = htmlToSummary(html);

    const system =
      "You are OpenDocs. Analyze the provided website summary and generate a clear, ultra-simple step-by-step documentation/guide. Output as JSON with folders/pages and blocks.";

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: JSON.stringify({ url, summary }, null, 2),
      },
    ];

    const json = await nvidiaChat({ messages, temperature: 0.2 });
    res.json({ url, summary, llm: json });
  } catch (e) {
    res.status(500).json({ error: "website_analyze_failed", message: String(e?.message || e) });
  }
});

app.post("/api/github/analyze", async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string") return res.status(400).json({ error: "bad_request" });

    // Minimal fetch: raw README if github.com/owner/repo
    const parsed = parse(url);
    const parts = (parsed.pathname || "").split("/").filter(Boolean);
    if (parts.length < 2) return res.status(400).json({ error: "bad_github_url" });
    const owner = parts[0];
    const repo = parts[1];

    const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`;
    const readmeResp = await fetch(readmeUrl);
    const readme = readmeResp.ok ? await readmeResp.text() : "";

    const system =
      "You are OpenDocs. Analyze the repository README and infer project purpose, setup, architecture and usage. Output as JSON with folders/pages and blocks.";

    const messages = [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify({ url, owner, repo, readme: readme.slice(0, 12000) }, null, 2) },
    ];

    const json = await nvidiaChat({ messages, temperature: 0.2 });
    res.json({ url, owner, repo, llm: json });
  } catch (e) {
    res.status(500).json({ error: "github_analyze_failed", message: String(e?.message || e) });
  }
});

app.post("/api/images/search", async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query || typeof query !== "string") return res.status(400).json({ error: "bad_request" });

    const system =
      "You are OpenDocs. Provide 5-10 relevant, high-quality image URLs for documentation (screenshots/diagrams) with titles and source domains. Output JSON array.";
    const messages = [
      { role: "system", content: system },
      { role: "user", content: query },
    ];

    const json = await nvidiaChat({ messages, temperature: 0.2 });
    res.json({ query, llm: json });
  } catch (e) {
    res.status(500).json({ error: "images_search_failed", message: String(e?.message || e) });
  }
});

// Agent plan endpoint: reply + commands
app.post("/api/agent/plan", async (req, res) => {
  try {
    const { prompt, context } = req.body || {};
    if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "bad_request" });

    const system = `You are the OpenDocs AI Operator. Your goal is to help users manage their relational documentation, databases, and automations.

Output STRICT JSON only: { "reply": "...", "commands": [...] }

Commands MUST follow this schema:
- { "type": "docs.page.create", "title": "..." }
- { "type": "docs.block.insertAfter", "pageId": "...", "afterBlockId": "...", "blockType": "...", "initial": { ... } }
- { "type": "docs.block.update", "pageId": "...", "blockId": "...", "patch": { ... } }
- { "type": "docs.block.delete", "pageId": "...", "blockId": "..." }
- { "type": "docs.block.toggleLock", "pageId": "...", "blockId": "..." }
- { "type": "integration.openclaw.send", "integrationId": "...", "to": "...", "text": "..." }
- { "type": "db.row.insert", "pageId": "...", "blockId": "...", "data": { ... } }
- { "type": "n8n.node.connect", "pageId": "...", "blockId": "...", "sourceNodeBlockId": "..." }

Available block types: heading1, heading2, heading3, paragraph, code, table, database, workflow, draw, n8n, callout, checklist, mermaid, image, video, link, file, aiPrompt.

CONTEXT: ${JSON.stringify(context)}
If the user wants to CREATE content, use 'docs.block.insertAfter'. 
If the user wants to EDIT the current block, use 'docs.block.update'. 
Respect Hard Locks (R2): if a block or page is marked as locked in context, do not propose delete or update commands for it.`;

    const messages = [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ];

    const json = await nvidiaChat({ messages, temperature: 0.1 });
    res.json({ llm: json });
  } catch (e) {
    res.status(500).json({ error: "agent_plan_failed", message: String(e?.message || e) });
  }
});

// -----------------------------
// OpenClaw integration proxy (optional)
// -----------------------------
const OPENCLAW_BASE_URL = process.env.OPENCLAW_BASE_URL || "";
const OPENCLAW_TOKEN = process.env.OPENCLAW_TOKEN || "";

app.post("/api/integrations/openclaw/send", async (req, res) => {
  try {
    const { integrationId, to, text } = req.body || {};
    if (![integrationId, to, text].every((x) => typeof x === "string" && x.length)) {
      return res.status(400).json({ error: "bad_request" });
    }
    
    if (!OPENCLAW_BASE_URL || !OPENCLAW_TOKEN) {
      const message = await mockOpenClawService.sendMessage({ integrationId, to, text });
      return res.json({ 
        ok: true,
        messageId: message.id,
        integrationId: message.integrationId,
        to: message.to,
        text: message.text,
        timestamp: message.timestamp
      });
    }
    
    const resp = await fetch(`${OPENCLAW_BASE_URL.replace(/\/$/, "")}/api/v1/send/${encodeURIComponent(integrationId)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENCLAW_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, text }),
    });
    if (!resp.ok) {
      const msg = await resp.text().catch(() => "");
      return res.status(502).json({ error: "openclaw_upstream_failed", status: resp.status, message: msg });
    }
    const json = await resp.json().catch(() => ({}));
    res.json({ ok: true, result: json });
  } catch (e) {
    res.status(500).json({ error: "openclaw_proxy_failed", message: String(e?.message || e) });
  }
});

app.get("/api/openclaw/channels", async (_req, res) => {
  try {
    const channels = await mockOpenClawService.listChannels();
    res.json({ ok: true, channels });
  } catch (e) {
    res.status(500).json({ error: "openclaw_list_channels_failed", message: String(e?.message || e) });
  }
});

app.get("/api/openclaw/channels/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "bad_request" });
    
    const messages = await mockOpenClawService.listMessages(id);
    res.json({ ok: true, channelId: id, messages });
  } catch (e) {
    res.status(500).json({ error: "openclaw_list_messages_failed", message: String(e?.message || e) });
  }
});

// Supabase DB provisioning (optional)
// -----------------------------
function qIdent(name) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) throw new Error(`Invalid identifier: ${name}`);
  return `"${name.replace(/"/g, '""')}"`;
}

function mapColType(t) {
  switch (t) {
    case "text":
      return "text";
    case "number":
      return "double precision";
    case "checkbox":
      return "boolean";
    case "date":
      return "timestamptz";
    case "select":
      return "text"; // store option id or name
    default:
      throw new Error(`Unsupported column type: ${t}`);
}
}

app.post("/api/db/table/create", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      const { tableName, columns } = req.body || {};
      if (!tableName || typeof tableName !== "string") return res.status(400).json({ error: "bad_request" });
      if (!Array.isArray(columns) || columns.length === 0) return res.status(400).json({ error: "bad_request" });
      
      return res.json({ 
        ok: true, 
        tableName,
        mock: true,
        message: "Table created in mock database (SUPABASE_DB_URL not configured)",
        columns: columns.map(c => ({ name: c.name, type: c.type }))
      });
    }

    const { tableName, columns } = req.body || {};
    if (!tableName || typeof tableName !== "string") return res.status(400).json({ error: "bad_request" });
    if (!Array.isArray(columns) || columns.length === 0) return res.status(400).json({ error: "bad_request" });

    const tn = qIdent(tableName);
    const schema = qIdent(SUPABASE_DB_SCHEMA);

    const colsSql = columns
      .map((c) => {
        if (!c?.name || typeof c.name !== "string") throw new Error("Column name missing");
        const cn = qIdent(c.name);
        const ct = mapColType(c.type);
        return `${cn} ${ct}`;
      })
      .join(",\n  ");

    const sql = `CREATE TABLE IF NOT EXISTS ${schema}.${tn} (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  ${colsSql}
);`;

    await dbPool.query(sql);

    // optional: realtime publication
    await dbPool.query(`DO $$ BEGIN
      BEGIN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE ${SUPABASE_DB_SCHEMA}.${tableName}';
      EXCEPTION WHEN others THEN
        -- ignore if publication missing or already added
        NULL;
      END;
    END $$;`);

    res.json({ ok: true, tableName });
  } catch (e) {
    res.status(500).json({ error: "db_create_failed", message: String(e?.message || e) });
  }
});

app.post("/api/db/table/ensure-columns", async (req, res) => {
  try {
    if (!dbPool) return res.status(400).json({ error: "db_not_configured" });
    const { tableName, columns } = req.body || {};
    if (!tableName || !Array.isArray(columns)) return res.status(400).json({ error: "bad_request" });

    const tn = qIdent(tableName);
    const schema = qIdent(SUPABASE_DB_SCHEMA);

    for (const c of columns) {
      const cn = qIdent(c.name);
      const ct = mapColType(c.type);
      await dbPool.query(`ALTER TABLE ${schema}.${tn} ADD COLUMN IF NOT EXISTS ${cn} ${ct};`);
    }

    res.json({ ok: true, tableName });
  } catch (e) {
    res.status(500).json({ error: "db_alter_failed", message: String(e?.message || e) });
  }
});

app.post("/api/db/rows/create", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      const { tableName, rowId } = req.body || {};
      if (!tableName || !rowId) return res.status(400).json({ error: "bad_request" });
      
      return res.json({ 
        ok: true, 
        tableName,
        rowId,
        mock: true,
        message: "Row created in mock database (SUPABASE_DB_URL not configured)",
        timestamp: new Date().toISOString()
      });
    }
    
    const { tableName, rowId } = req.body || {};
    const tn = qIdent(tableName);
    const schema = qIdent(SUPABASE_DB_SCHEMA);
    await dbPool.query(`INSERT INTO ${schema}.${tn} (id) VALUES ($1) ON CONFLICT (id) DO NOTHING;`, [rowId]);
    res.json({ ok: true, tableName, rowId });
  } catch (e) {
    res.status(500).json({ error: "db_row_create_failed", message: String(e?.message || e) });
  }
});

app.post("/api/db/rows/upsert", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      const { tableName, rowId, data } = req.body || {};
      if (!tableName || !rowId) return res.status(400).json({ error: "bad_request" });
      
      return res.json({ 
        ok: true, 
        tableName,
        rowId,
        mock: true,
        data: data || {},
        message: "Row upserted in mock database (SUPABASE_DB_URL not configured)",
        timestamp: new Date().toISOString()
      });
    }
    
    const { tableName, rowId, data } = req.body || {};
    const tn = qIdent(tableName);
    const schema = qIdent(SUPABASE_DB_SCHEMA);

    const keys = Object.keys(data).filter((k) => /^[a-zA-Z0-9_]+$/.test(k));
    if (keys.length === 0) {
      return res.json({ ok: true, message: "no_data" });
    }

    const setSql = keys.map((k, i) => `${qIdent(k)} = $${i + 2}`).join(", ");
    const colsSql = keys.map((k) => qIdent(k)).join(", ");
    const valsSql = keys.map((_, i) => `$${i + 2}`).join(", ");

    const sql = `
      INSERT INTO ${schema}.${tn} (id, ${colsSql}, updated_at)
      VALUES ($1, ${valsSql}, now())
      ON CONFLICT (id) DO UPDATE SET
        ${setSql},
        updated_at = now();
    `;

    await dbPool.query(sql, [rowId, ...keys.map((k) => data[k])]);
    res.json({ ok: true, tableName, rowId });
  } catch (e) {
    res.status(500).json({ error: "db_row_upsert_failed", message: String(e?.message || e) });
  }
});

app.post("/api/db/rows/delete", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      const { tableName, rowId } = req.body || {};
      if (!tableName || !rowId) return res.status(400).json({ error: "bad_request" });
      
      return res.json({ 
        ok: true, 
        tableName,
        rowId,
        mock: true,
        message: "Row deleted from mock database (SUPABASE_DB_URL not configured)",
        timestamp: new Date().toISOString()
      });
    }
    
    const { tableName, rowId } = req.body || {};
    const tn = qIdent(tableName);
    const schema = qIdent(SUPABASE_DB_SCHEMA);
    await dbPool.query(`DELETE FROM ${schema}.${tn} WHERE id = $1;`, [rowId]);
    res.json({ ok: true, tableName, rowId });
  } catch (e) {
    res.status(500).json({ error: "db_row_delete_failed", message: String(e?.message || e) });
  }
});

app.post("/api/db/table/drop", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      const { tableName } = req.body || {};
      if (!tableName || typeof tableName !== "string") return res.status(400).json({ error: "bad_request" });
      
      return res.json({ 
        ok: true, 
        tableName,
        mock: true,
        message: "Table dropped from mock database (SUPABASE_DB_URL not configured)",
        timestamp: new Date().toISOString()
      });
    }

    const { tableName } = req.body || {};
    if (!tableName || typeof tableName !== "string") return res.status(400).json({ error: "bad_request" });

    const tn = qIdent(tableName);
    const schema = qIdent(SUPABASE_DB_SCHEMA);

    await dbPool.query(`DROP TABLE IF EXISTS ${schema}.${tn} CASCADE;`);
    res.json({ ok: true, tableName });
  } catch (e) {
    res.status(500).json({ error: "db_drop_failed", message: String(e?.message || e) });
  }
});

app.post("/api/db/automations/install", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      return res.json({ 
        ok: true,
        mock: true,
        message: "Automation rules installed in mock database (SUPABASE_DB_URL not configured)",
        timestamp: new Date().toISOString()
      });
    }

    // Minimal rules table for if/then automations
    const schema = qIdent(SUPABASE_DB_SCHEMA);
    await dbPool.query(`CREATE TABLE IF NOT EXISTS ${schema}.opendocs_automation_rules (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamptz NOT NULL DEFAULT now(),
      table_name text NOT NULL,
      when_column text NOT NULL,
      when_equals text NOT NULL,
      then_set_column text NOT NULL,
      then_set_value text NOT NULL
    );`);

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "automations_install_failed", message: String(e?.message || e) });
  }
});

app.post("/api/db/automations/rules/create", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      const { tableName, whenColumn, whenEquals, thenSetColumn, thenSetValue } = req.body || {};
      if (![tableName, whenColumn, whenEquals, thenSetColumn].every((x) => typeof x === "string" && x.length)) {
        return res.status(400).json({ error: "bad_request" });
      }
      
      return res.json({ 
        ok: true,
        id: `mock-automation-${Date.now()}`,
        mock: true,
        tableName,
        whenColumn,
        whenEquals,
        thenSetColumn,
        thenSetValue: String(thenSetValue ?? ""),
        message: "Automation rule created in mock database (SUPABASE_DB_URL not configured)",
        timestamp: new Date().toISOString()
      });
    }

    const { tableName, whenColumn, whenEquals, thenSetColumn, thenSetValue } = req.body || {};
    if (![tableName, whenColumn, whenEquals, thenSetColumn].every((x) => typeof x === "string" && x.length)) {
      return res.status(400).json({ error: "bad_request" });
    }

    const schema = qIdent(SUPABASE_DB_SCHEMA);
    const r = await dbPool.query(
      `INSERT INTO ${schema}.opendocs_automation_rules(table_name, when_column, when_equals, then_set_column, then_set_value)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id;`,
      [tableName, whenColumn, whenEquals, thenSetColumn, String(thenSetValue ?? "")]
    );

    res.json({ ok: true, id: r.rows[0]?.id });
  } catch (e) {
    res.status(500).json({ error: "automation_rule_create_failed", message: String(e?.message || e) });
  }
});

/**
 * Sync Automations: Installs a real Postgres trigger on the table to execute rules instantly.
 * Best Practices Feb 2026: generic trigger, safe dynamic column access, allowlist.
 */
app.post("/api/db/automations/rules/sync", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      const { tableName } = req.body || {};
      if (!tableName || typeof tableName !== "string") return res.status(400).json({ error: "bad_request" });
      
      return res.json({ 
        ok: true, 
        tableName,
        mock: true,
        trigger: "mock-trigger-opendocs-apply-automations",
        message: "Automation rules synced in mock database (SUPABASE_DB_URL not configured)",
        timestamp: new Date().toISOString()
      });
    }
    
    const { tableName } = req.body || {};
    if (!tableName || typeof tableName !== "string") return res.status(400).json({ error: "bad_request" });
    if (!/^opendocs_db_[a-z0-9_]+$/i.test(tableName)) {
      return res.status(400).json({ error: "bad_request", message: "table_not_allowed" });
    }

    const schema = qIdent(SUPABASE_DB_SCHEMA);
    const safeTable = qIdent(tableName);

    await dbPool.query(`
      CREATE OR REPLACE FUNCTION ${schema}.opendocs_apply_automations()
      RETURNS TRIGGER AS $$
      DECLARE
        rule RECORD;
        current_value text;
      BEGIN
        FOR rule IN
          SELECT when_column, when_equals, then_set_column, then_set_value
          FROM ${schema}.opendocs_automation_rules
          WHERE table_name = TG_TABLE_NAME
        LOOP
          EXECUTE format('SELECT ($1).%I::text', rule.when_column)
            INTO current_value
            USING NEW;
          IF current_value = rule.when_equals THEN
            NEW := jsonb_populate_record(NEW, jsonb_build_object(rule.then_set_column, rule.then_set_value));
          END IF;
        END LOOP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await dbPool.query(`DROP TRIGGER IF EXISTS trig_opendocs_apply_automations ON ${schema}.${safeTable};`);
    await dbPool.query(`
      CREATE TRIGGER trig_opendocs_apply_automations
      BEFORE UPDATE ON ${schema}.${safeTable}
      FOR EACH ROW
      EXECUTE FUNCTION ${schema}.opendocs_apply_automations();
    `);

    res.json({ ok: true, trigger: "trig_opendocs_apply_automations" });
  } catch (e) {
    res.status(500).json({ error: "automation_sync_failed", message: String(e?.message || e) });
  }
});

// Automation Trigger: Executes rules for a specific row
app.post("/api/db/automations/trigger", async (req, res) => {
  try {
    // Mock database when SUPABASE_DB_URL not configured
    if (!dbPool) {
      const { tableName, rowId } = req.body || {};
      if (!tableName || !rowId) return res.status(400).json({ error: "bad_request" });
      
      return res.json({ 
        ok: true, 
        tableName,
        rowId,
        mock: true,
        executed: 0,
        message: "Automation triggered in mock database (SUPABASE_DB_URL not configured) - no rules configured",
        timestamp: new Date().toISOString()
      });
    }
    
    const { tableName, rowId } = req.body || {};
    if (!tableName || !rowId) return res.status(400).json({ error: "bad_request" });

    const schema = qIdent(SUPABASE_DB_SCHEMA);
    const safeTable = qIdent(tableName);

    // 1. Find matching rules
    const rulesRes = await dbPool.query(
      `SELECT * FROM ${schema}.opendocs_automation_rules WHERE table_name = $1`,
      [tableName]
    );

    if (rulesRes.rows.length === 0) return res.json({ ok: true, executed: 0 });

    // 2. Fetch the current row data
    const rowRes = await dbPool.query(
      `SELECT * FROM ${schema}.${safeTable} WHERE id = $1`,
      [rowId]
    );
    const row = rowRes.rows[0];
    if (!row) return res.status(404).json({ error: "row_not_found" });

    let count = 0;
    for (const rule of rulesRes.rows) {
      const currentValue = String(row[rule.when_column]);
      if (currentValue === rule.when_equals) {
        // 3. Execute the "Then" action
        await dbPool.query(
          `UPDATE ${schema}.${safeTable} SET ${qIdent(rule.then_set_column)} = $1, updated_at = now() WHERE id = $2`,
          [rule.then_set_value, rowId]
        );
        count++;
      }
    }

    res.json({ ok: true, executed: count });
  } catch (e) {
    res.status(500).json({ error: "automation_trigger_failed", message: String(e?.message || e) });
  }
});

app.post("/api/supabase/tables/provision", async (req, res) => {
  try {
    const { tableName, columns } = req.body || {};
    if (!tableName || !Array.isArray(columns) || columns.length === 0) {
      return res.status(400).json({ error: "bad_request" });
    }
    
    const normalizedColumns = columns.map(c => 
      typeof c === 'string' 
        ? { name: c, type: 'text' }
        : c
    );
    
    try {
      if (!dbPool) throw new Error("No DB pool");
      
      const tn = qIdent(tableName);
      const schema = qIdent(SUPABASE_DB_SCHEMA);
      
      const colsSql = normalizedColumns
        .map((c) => {
          if (!c?.name || typeof c.name !== "string") throw new Error("Column name missing");
          const cn = qIdent(c.name);
          const ct = mapColType(c.type);
          return `${cn} ${ct}`;
        })
        .join(",\n  ");
      
      const sql = `CREATE TABLE IF NOT EXISTS ${schema}.${tn} (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        ${colsSql}
      );`;
      
      await dbPool.query(sql);
      return res.json({ ok: true, tableName });
    } catch (dbErr) {
      const table = await mockSupabaseService.provisionTable({ tableName, columns: normalizedColumns });
      return res.json({ 
        ok: true,
        tableName: table.name,
        columns: table.columns,
        rowCount: table.rowCount
      });
    }
  } catch (e) {
    res.status(500).json({ error: "supabase_provision_table_failed", message: String(e?.message || e) });
  }
});

app.get("/api/supabase/tables", async (_req, res) => {
  try {
    const tables = await mockSupabaseService.listTables();
    res.json({ ok: true, tables });
  } catch (e) {
    res.status(500).json({ error: "supabase_list_tables_failed", message: String(e?.message || e) });
  }
});

app.get("/api/supabase/tables/:id", async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) return res.status(400).json({ error: "bad_request" });
    
    let table = await mockSupabaseService.getTable(id);
    if (!table) {
      table = (await mockSupabaseService.listTables()).find(t => t.name === id);
    }
    
    res.json({ ok: true, table });
  } catch (e) {
    res.status(500).json({ error: "supabase_get_table_failed", message: String(e?.message || e) });
  }
});

app.post("/api/supabase/rules", async (req, res) => {
  try {
    const { tableName, whenColumn, whenEquals, thenSetColumn, thenSetValue } = req.body || {};
    if (!tableName || !whenColumn || !thenSetColumn) {
      return res.status(400).json({ error: "bad_request" });
    }
    
    const rule = await mockSupabaseService.createRule({
      tableName,
      whenColumn,
      whenEquals,
      thenSetColumn,
      thenSetValue
    });
    
    res.json({ 
      ok: true,
      ruleId: rule.id,
      tableName: rule.tableName,
      whenColumn: rule.whenColumn,
      thenSetColumn: rule.thenSetColumn
    });
  } catch (e) {
    res.status(500).json({ error: "supabase_create_rule_failed", message: String(e?.message || e) });
  }
});

app.post("/api/supabase/automations/trigger", async (req, res) => {
  try {
    const { tableId, rowId, tableName } = req.body || {};
    const table = tableId || tableName;
    
    if (!table || !rowId) {
      return res.status(400).json({ error: "bad_request" });
    }
    
    const automation = await mockSupabaseService.triggerAutomation({ tableName: table, rowId });
    res.json({ 
      ok: true,
      automationId: automation.id,
      status: automation.status,
      executed: automation.executed
    });
  } catch (e) {
    res.status(500).json({ error: "supabase_trigger_automation_failed", message: String(e?.message || e) });
  }
});

// -----------------------------
// n8n integration proxy (optional)
// -----------------------------
const N8N_BASE_URL = process.env.N8N_BASE_URL || "";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

async function n8nRequest(path, init = {}) {
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    // Return comprehensive mock data when n8n is not configured
    throw new Error("n8n_not_configured");
  }
  const url = `${N8N_BASE_URL.replace(/\/$/, "")}${path}`;
  const resp = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": N8N_API_KEY,
      ...(init.headers || {}),
    },
  });
  if (!resp.ok) {
    const msg = await resp.text().catch(() => "");
    throw new Error(`n8n_upstream_failed: ${resp.status} ${msg}`);
  }
  return resp.json();
}

async function getWorkflow(workflowId) {
  return await n8nRequest(`/api/v1/workflows/${encodeURIComponent(workflowId)}`, { method: "GET" });
}

async function updateWorkflow(workflowId, payload) {
  return await n8nRequest(`/api/v1/workflows/${encodeURIComponent(workflowId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

app.get("/api/n8n/nodes", async (_req, res) => {
  try {
    const data = await n8nRequest("/api/v1/nodes", { method: "GET" });
    res.json(data);
  } catch (e) {
    try {
      const nodes = await mockN8nService.getNodes();
      return res.json({ ok: true, nodes });
    } catch (mockErr) {
      res.status(500).json({ error: "n8n_nodes_failed", message: String(mockErr?.message || mockErr) });
    }
  }
});

app.post("/api/n8n/workflows/create", async (req, res) => {
  let title = undefined;
  try {
    const { title: reqTitle } = req.body || {};
    title = reqTitle;
    if (!title || typeof title !== "string") return res.status(400).json({ error: "bad_request" });
    const payload = {
      name: title,
      nodes: [],
      connections: {},
      settings: {},
      active: false,
    };
    const data = await n8nRequest("/api/v1/workflows", { method: "POST", body: JSON.stringify(payload) });
    res.json({ ok: true, id: data.id });
  } catch (e) {
    try {
      const workflow = await mockN8nService.createWorkflow({ name: title });
      return res.json({
        ok: true,
        id: workflow.id,
        name: workflow.name,
        nodes: workflow.nodes,
        connections: workflow.connections,
        settings: workflow.settings,
        active: workflow.active,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt
      });
    } catch (mockErr) {
      res.status(500).json({ error: "n8n_workflow_create_failed", message: String(mockErr?.message || mockErr) });
    }
  }
});

app.post("/api/n8n/nodes/update", async (req, res) => {
  try {
    const { workflowId, nodeId, config } = req.body || {};
    if (!workflowId || !config || !config.nodeType) return res.status(400).json({ error: "bad_request" });

    const wf = await getWorkflow(workflowId);
    const nodes = Array.isArray(wf.nodes) ? wf.nodes : [];
    const connections = wf.connections || {};

    let node = nodes.find((n) => n.id === nodeId || n.name === nodeId);
    if (!node) {
      node = {
        id: nodeId || `node-${Date.now()}`,
        name: config.name || `Node ${nodes.length + 1}`,
        type: config.nodeType,
        typeVersion: 1,
        position: [200 + nodes.length * 40, 200 + nodes.length * 20],
        parameters: config.parameters || {},
        disabled: !!config.disabled,
      };
      nodes.push(node);
    } else {
      node.name = config.name || node.name;
      node.type = config.nodeType || node.type;
      node.parameters = config.parameters || node.parameters || {};
      node.disabled = !!config.disabled;
    }

    await updateWorkflow(workflowId, { ...wf, nodes, connections });
    res.json({ ok: true, nodeId: node.id || node.name });
  } catch (e) {
    res.status(500).json({ error: "n8n_node_update_failed", message: String(e?.message || e) });
  }
});

app.post("/api/n8n/nodes/connect", async (req, res) => {
  try {
    const { workflowId, sourceNodeId, targetNodeId } = req.body || {};
    if (!workflowId || !sourceNodeId || !targetNodeId) return res.status(400).json({ error: "bad_request" });

    const wf = await getWorkflow(workflowId);
    const nodes = Array.isArray(wf.nodes) ? wf.nodes : [];
    const connections = wf.connections || {};

    const source = nodes.find((n) => n.id === sourceNodeId || n.name === sourceNodeId);
    const target = nodes.find((n) => n.id === targetNodeId || n.name === targetNodeId);
    if (!source || !target) return res.status(400).json({ error: "node_not_found" });

    const srcName = source.name;
    const tgtName = target.name;
    connections[srcName] = connections[srcName] || { main: [] };
    connections[srcName].main = connections[srcName].main || [];
    connections[srcName].main[0] = connections[srcName].main[0] || [];
    connections[srcName].main[0].push({ node: tgtName, type: "main", index: 0 });

    await updateWorkflow(workflowId, { ...wf, nodes, connections });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "n8n_connect_failed", message: String(e?.message || e) });
  }
});

app.post("/api/n8n/nodes/toggle", async (req, res) => {
  try {
    const { workflowId, nodeId, disabled } = req.body || {};
    if (!workflowId || !nodeId || typeof disabled !== "boolean") return res.status(400).json({ error: "bad_request" });

    const wf = await getWorkflow(workflowId);
    const nodes = Array.isArray(wf.nodes) ? wf.nodes : [];
    const connections = wf.connections || {};

    const node = nodes.find((n) => n.id === nodeId || n.name === nodeId);
    if (!node) return res.status(400).json({ error: "node_not_found" });
    node.disabled = disabled;

    await updateWorkflow(workflowId, { ...wf, nodes, connections });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "n8n_toggle_failed", message: String(e?.message || e) });
  }
});

app.post("/api/n8n/workflows/execute", async (req, res) => {
  let workflowId = undefined;
  try {
    const { workflowId: reqWorkflowId } = req.body || {};
    workflowId = reqWorkflowId;
    if (!workflowId) return res.status(400).json({ error: "bad_request" });
    
    const data = await n8nRequest(`/api/v1/workflows/${encodeURIComponent(workflowId)}/execute`, { method: "POST" });
    res.json({ ok: true, executionId: data.executionId });
  } catch (e) {
    try {
      const execution = await mockN8nService.executeWorkflow(workflowId);
      return res.json({
        ok: true,
        executionId: execution.id,
        status: execution.status,
        data: execution.data,
        startTime: execution.startTime,
        endTime: execution.endTime
      });
    } catch (mockErr) {
      res.status(500).json({ error: "n8n_execute_failed", message: String(mockErr?.message || mockErr) });
    }
  }
});

// Fetch YouTube transcript helper function
async function fetchYouTubeTranscript(videoId) {
  try {
    // Fetch the YouTube video page to get captions
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch YouTube page');
    }
    
    const html = await response.text();
    
    // Extract caption track URL from the YouTube page
    const captionRegex = /\"captionTracks\":\[(\{[^]]+\})\]/;
    const match = html.match(captionRegex);
    
    if (!match || !match[1]) {
      console.log('No captions found for video');
      return null;
    }
    
    // Parse the caption track JSON
    let captionTracks;
    try {
      captionTracks = JSON.parse(`[${match[1]}]`);
    } catch {
      console.log('Failed to parse caption tracks');
      return null;
    }
    
    // Find a valid caption track (prefer English)
    const track = captionTracks.find(t => 
      t.kind === 'asr' || 
      t.languageCode?.startsWith('en') || 
      !track
    );
    
    if (!track || !track.baseUrl) {
      console.log('No valid caption track found');
      return null;
    }
    
    // Fetch the transcript XML
    const transcriptResponse = await fetch(track.baseUrl);
    if (!transcriptResponse.ok) {
      throw new Error('Failed to fetch transcript');
    }
    
    const transcriptXml = await transcriptResponse.text();
    
    // Parse XML and convert to text
    const transcriptRegex = /<text start="([\d\.]+)" dur="([\d\.]+)">([^<]+)<\/text>/g;
    let match2;
    let transcriptText = '';
    
    while ((match2 = transcriptRegex.exec(transcriptXml)) !== null) {
      const start = match2[1];
      const duration = match2[2];
      const text = match2[3].replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      transcriptText += `[${start}s] ${text}\n`;
    }
    
    return transcriptText.trim() || null;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
}

app.post("/api/video/analyze", async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string") return res.status(400).json({ error: "bad_request", message: "URL is required" });

    // Extract YouTube video ID
    let videoId = null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        videoId = u.searchParams.get("v");
      } else if (u.hostname === "youtu.be") {
        videoId = u.pathname.split("/").filter(Boolean)[0];
      }
    } catch {}

    if (!videoId) {
      return res.status(400).json({ error: "bad_request", message: "Invalid YouTube URL" });
    }

    // Fetch transcript
    let transcript = await fetchYouTubeTranscript(videoId);
    
    if (!transcript) {
      // Fallback to mock transcript
      transcript = `This is a mock transcript for video ${videoId}. In production, this would contain the actual subtitles content extracted from YouTube.`;
    }

    const system = `You are OpenDocs Video AI. Analyze the YouTube video transcript and:
1. Segment into logical scenes (5-10 second clips based on content shifts)
2. Mark each scene as important (true) or unimportant (false) based on content relevance
3. For each scene, include: start time, end time, duration, and description
Return ONLY valid JSON with: { transcript: "...", scenes: [{ id, start, end, duration, description, important }] }`;

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: `Transcript:\n${transcript}\n\nAnalyze and segment into scenes.`,
      },
    ];

    const json = await nvidiaChat({ messages, temperature: 0.1 });
    
    // Parse AI response - might be embedded in message content
    let scenes = [];
    let aiTranscript = transcript;
    
    if (json?.choices?.[0]?.message?.content) {
      try {
        const content = json.choices[0].message.content;
        // Try to extract JSON from content
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          aiTranscript = parsed.transcript || transcript;
          scenes = parsed.scenes || [];
        }
      } catch {
        // If JSON parsing fails, try direct access
        scenes = json?.scenes || [];
      }
    } else if (json?.scenes) {
      scenes = json.scenes;
    }
    
    // Fallback: create mock scenes if AI didn't return proper structure
    if (!scenes || scenes.length === 0) {
      const lines = transcript.split('\n').filter(l => l.trim());
      scenes = lines.map((line, index) => ({
        id: `scene-${index}`,
        start: index * 5,
        end: (index + 1) * 5,
        duration: 5,
        description: line.substring(0, 100),
        important: index < Math.ceil(lines.length / 3) // Mark first third as important
      }));
    }
    
    res.json({ 
      url, 
      videoId,
      transcript: aiTranscript, 
      scenes: scenes,
      analyzed: true
    });
  } catch (e) {
    console.error('Video analysis error:', e);
    res.status(500).json({ error: "video_analyze_failed", message: String(e?.message || e) });
  }
});


app.get("/api/n8n/workflows", async (_req, res) => {
  try {
    const workflows = await mockN8nService.listWorkflows();
    res.json({ ok: true, workflows });
  } catch (e) {
    res.status(500).json({ error: "n8n_list_workflows_failed", message: String(e?.message || e) });
  }
});

app.get("/api/n8n/workflows/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "bad_request" });
    
    const workflow = await mockN8nService.getWorkflow(id);
    res.json({ ok: true, workflow });
  } catch (e) {
    res.status(500).json({ error: "n8n_get_workflow_failed", message: String(e?.message || e) });
  }
});

// Monitoring Endpoints
app.get("/health", healthMiddleware);
app.get("/ready", readinessMiddleware);
app.get("/live", livenessMiddleware);
app.get("/metrics", metricsHandler);
app.post("/metrics/reset", resetMetricsHandler);
app.get("/logs", logsHandler);
app.post("/logs/clear", clearLogsHandler);

app.get("/api/cache/stats", requireApiAuth, (_req, res) => {
  const stats = getCacheManager().getStats();
  res.json({
    cache: stats,
    timestamp: new Date().toISOString()
  });
});

app.use(createErrorMiddleware());

app.listen(PORT, () => {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║                      🚀 OpenDocs Server                      ║");
  console.log(`║  URL:         http://localhost:${PORT}${" ".repeat(Math.max(1, 33 - String(PORT).length))}║`);
  console.log(`║  Model:       ${NVIDIA_MODEL}${" ".repeat(Math.max(1, 44 - NVIDIA_MODEL.length))}║`);
  console.log("║  API:         /api/* (auth optional via API_AUTH_TOKEN)       ║");
  console.log("║  Endpoints:   /api/nvidia/chat | /api/agent/plan              ║");
  console.log("║              /api/github/analyze | /api/website/analyze       ║");
  console.log("║              /api/db/table/* | /api/db/automations/*          ║");
  console.log("║  Monitoring:  /health | /ready | /live | /metrics | /logs    ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
  console.log("[OpenDocs] Server is now running and listening...");
});