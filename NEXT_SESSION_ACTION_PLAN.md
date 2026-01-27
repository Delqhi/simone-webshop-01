# 🚀 NEXT SESSION ACTION PLAN

**Date:** 2026-01-27
**Status:** Ready to Execute
**Priority:** HIGH - Complete OpenCode Configuration

---

## ✅ WHAT'S ALREADY DONE

- ✅ OpenCode CLI installed and working
- ✅ Configuration fixed (valid schema only)
- ✅ `opencode models` command verified working
- ✅ All documentation created and committed

---

## 🎯 WHAT NEEDS TO BE DONE

### PRIORITY 1: Environment Variables Setup

**Duration:** ~5 minutes

```bash
# Add these to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export STREAMLAKE_API_KEY="d6Kxl1oDRczbtRVoKAFdHTPHTkidAcxnTSE7bBUvum0"
export XIAOMI_API_KEY="sk-e834w7r3sm1e40lagworqazxu2q4zcvzkaqsko775vku1fl7"
export OPENCODE_ZEN_API_KEY="sk-wsoDvbl0JOfbSk5lmYJ5JZEx3fzChVBAn9xdb5NkOKuaDCdjudzFyU2UJ975ozdT"
export TAVILY_API_KEY="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"

# Verify
source ~/.zshrc  # or ~/.bashrc
echo $STREAMLAKE_API_KEY  # Should print the key
```

**Checklist:**
- [ ] Add 4 environment variables to shell profile
- [ ] Source/reload shell
- [ ] Verify each variable with `echo`

---

### PRIORITY 2: Test OpenCode with Models

**Duration:** ~10 minutes

```bash
# Test with Google Gemini
opencode run "Hello! Please test this with Google Gemini 3 Flash. Say 'OpenCode works!'"

# Test with different model
opencode -m google/gemini-3-pro run "Another test with Pro version"

# Test listing models
opencode models
```

**Checklist:**
- [ ] Successfully run with default model
- [ ] Successfully run with explicit Google model
- [ ] Verify response comes back correctly
- [ ] No errors in output

---

### PRIORITY 3: Set Up Agent Assignments

**Duration:** ~15 minutes

```bash
# Check if agents can be configured
opencode agent --help

# List existing agents
opencode agent list

# Assign model to agent (if command exists)
opencode agent set-model all github-copilot/claude-haiku-4-5
opencode agent set-model frontend-ui-ux-engineer google/gemini-3-pro
```

**Expected Outcome:**
- All 11 agents assigned to `github-copilot/claude-haiku-4-5`
- `frontend-ui-ux-engineer` specially assigned to `google/gemini-3-pro`
- No errors during agent configuration

**Checklist:**
- [ ] Understand how to configure agents in OpenCode
- [ ] Assign models to agents
- [ ] Verify agent assignments with list command
- [ ] Document any commands that worked

---

### PRIORITY 4: Test MCP Servers

**Duration:** ~15 minutes

```bash
# Check MCP configuration
opencode mcp list

# Test each MCP server
opencode mcp serena status
opencode mcp tavily status
opencode mcp context7 status
opencode mcp skyvern status

# If MCP servers aren't working, check logs
tail -50 ~/.local/share/opencode/log/*.log
```

**Expected Outcome:**
- All MCP servers listed
- Each server shows "active" or "ready" status
- No critical errors in logs

**Checklist:**
- [ ] Verify Serena MCP accessible
- [ ] Verify Tavily MCP accessible
- [ ] Verify Context7 MCP accessible
- [ ] Verify other MCPs functional
- [ ] Check logs for any warnings

---

## 📋 VALIDATION CHECKLIST

Use this to verify everything works:

### Environment Variables
- [ ] STREAMLAKE_API_KEY is set
- [ ] XIAOMI_API_KEY is set
- [ ] OPENCODE_ZEN_API_KEY is set
- [ ] TAVILY_API_KEY is set

### OpenCode CLI
- [ ] `opencode --version` works
- [ ] `opencode models` lists 100+ models
- [ ] `opencode models google` lists Google models
- [ ] `opencode run "test"` executes successfully

### Models
- [ ] Google Gemini 3 Flash works
- [ ] Google Gemini 3 Pro works
- [ ] GitHub Copilot Claude Haiku works
- [ ] Can switch between models with `-m` flag

### Agents
- [ ] All 11 agents assigned to default model
- [ ] Frontend agent assigned to Gemini 3 Pro
- [ ] Can list agents: `opencode agent list`
- [ ] Can view agent config

### MCP Servers
- [ ] Serena MCP is accessible
- [ ] Tavily MCP is accessible
- [ ] Context7 MCP is accessible
- [ ] Skyvern MCP is accessible

---

## 🚨 TROUBLESHOOTING

### If OpenCode fails:
1. Check environment variables: `echo $STREAMLAKE_API_KEY`
2. Check config is valid: `cat ~/.opencode/opencode.json`
3. Check logs: `tail -100 ~/.local/share/opencode/log/*.log`
4. Reference: `dev/sin-code/SESSION_RECOVERY_2026-01-27.md`

### If models don't work:
1. Verify API keys are exported: `env | grep -i api`
2. Try explicit model: `opencode -m google/gemini-3-flash run "test"`
3. Check OpenCode docs for model availability

### If MCP servers fail:
1. Check each one individually: `opencode mcp [name] status`
2. Install required dependencies (uvx, npx, etc.)
3. Check logs for specific error messages

---

## 📚 REFERENCE FILES

- **Session Recovery:** `/Users/jeremy/dev/sin-code/SESSION_RECOVERY_2026-01-27.md`
- **Configuration Fix:** `/Users/jeremy/dev/sin-code/troubleshooting/CONFIGURATION_FIX_2026-01-27.md`
- **OpenCode Config:** `/Users/jeremy/.opencode/opencode.json`
- **Broken Config (Reference):** `/Users/jeremy/.opencode/opencode.json.broken.backup`

---

## 💡 TIPS

1. **Keep environment variables persistent:** Add to ~/.zshrc or ~/.bashrc
2. **Test incrementally:** Do Priority 1 first, then 2, then 3, then 4
3. **Document results:** Write down what works and what doesn't
4. **Check logs first:** They often explain failures better than error messages
5. **Don't assume:** Test everything with explicit commands

---

## ⏱️ TIME ESTIMATES

| Task | Duration | Status |
|------|----------|--------|
| Environment Variables | 5 min | Ready |
| OpenCode Testing | 10 min | Ready |
| Agent Setup | 15 min | Ready |
| MCP Testing | 15 min | Ready |
| **TOTAL** | **45 min** | **Ready** |

---

## ✨ SUCCESS CRITERIA

**Complete when:**
- All 4 environment variables exported and verified
- `opencode run` works with at least 3 different models
- All 11 agents are configured
- At least 3 MCP servers are verified working
- No critical errors in logs

---

**Next Session Starts Here:** Environment Variables Setup
**Previous Session Complete:** Configuration Crisis Resolution ✅
**Status:** Ready to Execute 🚀

