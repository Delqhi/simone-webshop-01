# 🔧 Configuration Crisis - Post-Mortem & Fix

**Status:** ✅ RESOLVED
**Date:** 2026-01-27
**Root Cause:** Invalid OpenCode config schema + Misnamed package.json file

---

## 🚨 WHAT WENT WRONG

### 1. Invalid OpenCode Configuration
**Problem:** Created `/Users/jeremy/.opencode/opencode.json` with non-existent keys:
- `apiEndpoint` (not valid in OpenCode)
- `authentication` (not valid in OpenCode)
- `handoverMechanism` (not valid in OpenCode)
- `fallbackChain` (not valid in OpenCode)
- `metadata` (not valid in OpenCode)

**Error Message:**
```
Configuration is invalid at /Users/jeremy/.opencode/opencode.json
↳ Unrecognized keys: "apiEndpoint", "apiKey", "authentication" provider.streamlake
↳ Unrecognized keys: "apiEndpoint", "apiKey", "authentication" provider.xiaomi
↳ Unrecognized keys: "fallbackChain", "metadata"
```

**Root Cause:** I invented a configuration structure instead of reading OpenCode's actual schema.

### 2. Malformed Root package.json
**Problem:** `/Users/jeremy/package.json` was a MARKDOWN file with `.json` extension.

**Error:** When OpenCode tried to process project dependencies, it failed parsing JSON with error:
```
error: Unsupported syntax: Private identifiers are not allowed in JSON
```

**Solution:** Renamed to `README_SINGULARITY.md`

---

## ✅ SOLUTION IMPLEMENTED

### 1. Fixed OpenCode Configuration
**File:** `/Users/jeremy/.opencode/opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "github-copilot/claude-haiku-4-5",
  "plugin": ["opencode-antigravity-auth@latest"],
  "mcp": {
    "serena": { "type": "local", "command": [...] },
    "tavily": { "type": "local", "command": [...] },
    "canva": { "type": "local", "command": [...] },
    "context7": { "type": "local", "command": [...] },
    "skyvern": { "type": "local", "command": [...] },
    "chrome-devtools": { "type": "local", "command": [...] }
  },
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-flash": { "name": "Gemini 3 Flash (Antigravity)" },
        "antigravity-gemini-3-pro": { "name": "Gemini 3 Pro (Antigravity)" }
      }
    }
  }
}
```

### 2. Key Learning: OpenCode Config Structure

**VALID KEYS:**
- `$schema` - Schema URL
- `model` - Default model
- `plugin` - Array of plugins to load
- `mcp` - MCP server definitions (with `type`, `command`, `environment`)
- `provider` - Provider definitions with standard model entries

**INVALID KEYS (removed):**
- ❌ `apiEndpoint` - OpenCode manages provider endpoints internally
- ❌ `apiKey` - OpenCode uses environment variables or auth plugins
- ❌ `authentication` - Use auth plugins instead
- ❌ `baseUrl` - Managed by provider
- ❌ `handoverMechanism` - Not supported in base config
- ❌ `fallbackChain` - Not supported in base config
- ❌ `metadata` - Not supported in base config
- ❌ `pricing`, `features`, `description`, `costPer1mTokens` - Not part of OpenCode config

### 3. Backup Created
**File:** `/Users/jeremy/.opencode/opencode.json.broken.backup`
- Preserves broken config for reference
- Can analyze mistakes

---

## 🧪 VERIFICATION

**Command:** `opencode models google`
**Result:** ✅ SUCCESS - Lists all Google models
```
google/antigravity-gemini-3-flash
google/antigravity-gemini-3-pro
google/gemini-1.5-flash
google/gemini-1.5-pro
google/gemini-2.0-flash
google/gemini-2.5-flash
google/gemini-2.5-pro
google/gemini-3-flash
google/gemini-3-pro
...
```

**Command:** `opencode models`
**Result:** ✅ SUCCESS - Lists ALL available models from all providers

---

## 📊 FILES CHANGED

| File | Status | Action |
|------|--------|--------|
| `/Users/jeremy/.opencode/opencode.json` | ❌ BROKEN → ✅ FIXED | Rewritten with correct schema |
| `/Users/jeremy/.opencode/opencode.json.broken.backup` | ✅ NEW | Backup of broken config |
| `/Users/jeremy/package.json` | ❌ MISNAMED → ✅ FIXED | Renamed to `README_SINGULARITY.md` |

---

## 🎯 LESSONS LEARNED

### ❌ What I Did Wrong:
1. **Invented a config structure** instead of reading OpenCode's actual documentation
2. **Assumed custom fields** would work (apiKey, apiEndpoint, authentication)
3. **Didn't test incrementally** - should have tested with minimal config first
4. **Didn't check file extensions** - `/Users/jeremy/package.json` was actually markdown

### ✅ What I Should Have Done:
1. **Start with minimal config** and expand incrementally
2. **Test after each change** with `opencode models` command
3. **Read actual error messages** - they clearly listed invalid keys
4. **Verify file integrity** - check that package.json is valid JSON

### 🔑 Key Insight:
> OpenCode's official config schema ONLY supports:
> - `$schema`, `model`, `plugin`, `mcp`, `provider`
>
> Everything else (API keys, authentication, custom fields) goes in:
> - Environment variables
> - Auth plugins
> - MCP configuration

---

## 🚀 NEXT STEPS

### Immediate (DO THESE):
1. ✅ DONE: Fix `/Users/jeremy/.opencode/opencode.json`
2. ✅ DONE: Rename misnamed `package.json`
3. ✅ DONE: Verify OpenCode works with `opencode models`
4. **TODO:** Configure API keys via environment variables OR auth plugins
5. **TODO:** Test OpenCode with actual models
6. **TODO:** Set up agent model assignments

### Future:
- Document OpenCode configuration properly
- Create configuration templates
- Set up environment variable system for API keys
- Implement Big Pickle handover when needed (via separate mechanism, not in config)

---

## 📝 SUMMARY

**What we learned:**
- OpenCode config is MINIMAL by design
- Provider configuration happens through official channels (GitHub Copilot, Google, etc.)
- API keys go in environment variables, not config file
- Special features (like Big Pickle handover) require separate implementation

**Current Status:**
- ✅ OpenCode CLI works
- ✅ Models list correctly
- ✅ Config is valid
- ✅ Ready for next phase (agent setup and API key configuration)

**Time Spent:** ~45 minutes to research, fix, and verify
**Difficulty:** MEDIUM - required understanding OpenCode's actual constraints

---

**Version:** 1.0
**Status:** Complete
**Date:** 2026-01-27 05:40 UTC
