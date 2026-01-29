# RULES MASTER INDEX
## Authoritative Source of All Blueprint Rules and Requirements
**Version:** 1.0  
**Created:** 2026-01-29  
**Status:** Authoritative  
**Lines:** 1500+

---

## TABLE OF CONTENTS

1. [Quick Reference - Rule Severity](#quick-reference---rule-severity)
2. [Numbered Rules (RULE -6 to RULE -1)](#numbered-rules-rule--6-to-rule--1)
3. [Supreme Mandates (MANDATE 0.0 to 0.33)](#supreme-mandates-mandate-00-to-033)
4. [Workflow Requirements](#workflow-requirements)
5. [Documentation Standards](#documentation-standards)
6. [Git Requirements](#git-requirements)
7. [Code Quality Rules](#code-quality-rules)
8. [Security Requirements](#security-requirements)
9. [Docker & Infrastructure Rules](#docker--infrastructure-rules)
10. [Blueprint 22 Pillars Reference](#blueprint-22-pillars-reference)
11. [Rule Application Matrix](#rule-application-matrix)

---

## QUICK REFERENCE - RULE SEVERITY

| Severity | Color | Meaning | Action Required |
|----------|-------|---------|-----------------|
| **CRITICAL** | 🔴 | Termination-level offense | Immediate compliance, no exceptions |
| **HIGH** | 🟠 | Mandatory, violations = technical treason | Must follow, enforced strictly |
| **MEDIUM** | 🟡 | Important best practices | Should follow, exceptions documented |
| **LOW** | 🟢 | Recommended guidelines | Follow when applicable |

---

## NUMBERED RULES (RULE -6 to RULE -1)

### 🔴 RULE -6: MANDATORY GIT COMMIT + PUSH AFTER EVERY TASK

| Attribute | Value |
|-----------|-------|
| **ID** | RULE-06 |
| **Severity** | CRITICAL |
| **Category** | Git/Version Control |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 7-46) |
| **When to Apply** | After every completed task, after every test run |

**Full Text:**
```
JEDESMAL ADDEN + COMMITTEN + PUSHEN ZU GITHUB - KEINE AUSNAHMEN!

🚨 NACH JEDER FERTIGEN AUFGABE:
✅ 1. git add -A (alle Änderungen stagen)
✅ 2. git commit -m "feat/fix/docs: beschreibung" (commit mit message)
✅ 3. git push origin main (zu GitHub pushen)

🚨 NACH JEDEM TEST-DURCHLAUF:
✅ Wenn Tests bestehen → SOFORT committen + pushen
✅ Wenn Tests fehlschlagen → Fixen → Tests wiederholen → DANN committen

📋 COMMIT-MESSAGE FORMAT:
feat: neue Funktion hinzugefügt
fix: bug behoben
docs: dokumentation aktualisiert
refactor: code umstrukturiert
test: tests hinzugefügt/aktualisiert
chore: wartungsarbeiten
```

**Why:** Protects against "dumb deletion syndrome" - in GitHub everything is safe with immutable history

---

### 🔴 RULE -5: ABSOLUTE VERBOT VON BLINDEM LÖSCHEN

| Attribute | Value |
|-----------|-------|
| **ID** | RULE-05 |
| **Severity** | CRITICAL |
| **Category** | Data Integrity |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 52-95) |
| **When to Apply** | When encountering unknown elements, containers, services |

**Full Text:**
```
NIEMALS AUS DUMMER BLINDER ANNAHME HERAUS, WEIL ETWAS NICHT BEKANNT IST, EINFACH LÖSCHEN! NIEMALS!

🚨 WAS ABSOLUT VERBOTEN IST:
❌ "Das kenne ich nicht, also lösche ich es mal..."
❌ "Das sieht alt aus, also entferne ich es..."
❌ "Das ist mir unbekannt, also ist es wahrscheinlich falsch..."
❌ "Ich verstehe das nicht, also lösche ich es..."
❌ "Das passt nicht zu meinem Verständnis, also weg damit..."

✅ WAS STATTDESSEN PFLICHT IST:
✅ Bei unbekannten Elementen: RECHERCHIEREN statt löschen
✅ Bei neuen Containern/Services: VERSTEHEN warum sie hinzugefügt wurden
✅ Bei unklaren MCPs: DOKUMENTIEREN und integrieren
✅ Bei Architektur-Änderungen: ABSTIMMEN mit dem Team

📋 PFLICHT-PROTOKOLL BEI NEUEN ELEMENTEN:
1. Element entdeckt → NICHTS löschen!
2. Recherche: Warum existiert das? Wer hat es hinzugefügt?
3. Dokumentation lesen: README, Deployment-Status, lastchanges.md
4. Integration: Zur Architektur hinzufügen (Container Registry, MCP)
5. Dokumentation: Überall dokumentieren (AGENTS.md, lastchanges.md)
```

**Example:** room-30-scira was almost deleted due to blind assumption - container existed and was critical

---

### 🔴 RULE -4: SESSION SHARING MANDATE

| Attribute | Value |
|-----------|-------|
| **ID** | RULE-04 |
| **Severity** | CRITICAL |
| **Category** | Collaboration/Transparency |
| **Source** | `~/.config/opencode/AGENTS.md` (Session Sharing Protocol) |
| **When to Apply** | Every coding task, every session |

**Full Text:**
```
🔗 SESSION SHARING PROTOCOL - ABSOLUTE PFLICHT AB 2026-01-29

🚨 REGEL 1: SESSION TEILEN (MANDATORY)
✅ Bei JEDEM Coding-Task: OpenCode Session teilen
✅ Session URL generieren: https://opncd.ai/share/XXXXXX
✅ Session ID notieren: ses_XXXXXXXXXXXXXXXX
✅ URL in ALLE 4 Dokumente eintragen (siehe unten)

🚨 REGEL 2: SESSION URL DOKUMENTATION (4 ORTE)
✅ 1. /dev/projektname/TASKS.md        → Aktuelle Aufgabe
✅ 2. /dev/projektname/lastchanges.md  → Letzte Änderungen
✅ 3. /dev/projektname/userprompts.md  → User Prompt Log
✅ 4. /dev/projektname/meeting.md      → Kollaboration & Reviews

🚨 REGEL 3: SESSION URL FORMAT
**Session URL:** https://opncd.ai/share/IL2zRiBc
**Session ID:** ses_3f9bc1908ffeVibfrKEY3Kybu5
**Started:** 2026-01-29 11:42 UTC
**Agent:** sisyphus
**Task:** [Kurze Beschreibung der aktuellen Aufgabe]

🚨 REGEL 4: WARUM SESSION SHARING?
• Transparenz: Andere Coder sehen vollständigen Kontext
• Review: Skeptische Betrachtung durch andere Agenten
• Kontinuität: Kein Kontext-Verlust bei Session-Wechsel
• Accountability: Jede Entscheidung ist nachvollziehbar
```

---

### 🔴 RULE -3: TODO CONTINUATION + SWARM DELEGATION

| Attribute | Value |
|-----------|-------|
| **ID** | RULE-03 |
| **Severity** | CRITICAL |
| **Category** | Task Management/Workflow |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 101-264) |
| **When to Apply** | Every task, every phase, all the time |

**Full Text:**
```
⚡ ABSOLUTE PFLICHT: TODO + SWARM = NIEMALS ALLEINE ARBEITEN ⚡

🚨 REGEL 1: TODO-SYSTEM IST PFLICHT
✅ JEDE Aufgabe MUSS in todowrite() erfasst werden
✅ JEDER Fortschritt MUSS sofort aktualisiert werden
✅ JEDE Completion MUSS verifiziert und markiert werden
✅ Format: Parent-Task + Sub-Tasks (hierarchisch)

🚨 REGEL 2: SWARM DELEGATION IST PFLICHT
✅ IMMER mit delegate_task() an Agenten delegieren
✅ IMMER background_tasks parallel starten für Exploration
✅ NIEMALS alleine coden - MINIMUM 3 parallele Tasks
✅ NIEMALS sequentiell wenn parallel möglich

🚨 REGEL 3: KEINE AUSNAHMEN
❌ VERBOTEN: Aufgabe ohne TODO starten
❌ VERBOTEN: Alleine coden ohne delegate_task()
❌ VERBOTEN: Behaupten "fertig" ohne echte Verifikation
❌ VERBOTEN: Tests überspringen

MANDATORY WORKFLOW:
1. 📋 TODO ERFASSEN
   todowrite([
     { id: "task-01", content: "HAUPTAUFGABE", status: "in_progress" },
     { id: "task-01-a", content: "Sub-Task A", status: "pending" },
   ])

2. 🐝 SWARM DELEGATION (PARALLEL!)
   delegate_task(category="X", run_in_background=true, ...)
   delegate_task(category="Y", run_in_background=true, ...)
   delegate_task(subagent="explore", run_in_background=true, ...)

3. ✅ VERIFIKATION (SELBST PRÜFEN!)
   - ls -la [created files]
   - curl [API endpoints]
   - Playwright tests für UI
   - NIEMALS Subagent-Claims blind vertrauen!

4. 📋 TODO AKTUALISIEREN
   todowrite([...tasks mit status: "completed"...])

5. 🔄 LOOP bis 100% COMPLETE

SWARM PROTOCOL (7 AGENTS MINIMUM):
1. [ARCHITECT] System Design + Architecture
2. [SECURITY] Zero-Trust + Pentest + Secrets
3. [PERFORMANCE] Benchmarks + Optimization
4. [TESTING] 100% Coverage + E2E + Chaos
5. [DEVOPS] CI/CD + Infra + Monitoring
6. [DOCUMENTATION] API Docs + README + Swagger
7. [ENTERPRISE] Scale + Compliance + Audit
```

---

### 🔴 RULE -2: MANDATORY CODER WORKFLOW PROTOCOL

| Attribute | Value |
|-----------|-------|
| **ID** | RULE-02 |
| **Severity** | CRITICAL |
| **Category** | Workflow/Process |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 311-429) |
| **When to Apply** | Every single task, no exceptions |

**Full Text:**
```
⚡ MANDATORY 5-PHASE WORKFLOW - EVERY SINGLE TASK ⚡

PHASE 1: CONTEXT ACQUISITION (MANDATORY READS)
✅ 1. lastchanges.md         → Verstehe was zuletzt geändert wurde
✅ 2. conductor.py           → Verstehe die Orchestrierungs-Logik
✅ 3. Blueprint Rules        → Lese BLUEPRINT.md im Projekt-Root
✅ 4. tasks-system           → Lese .tasks/tasks-system.json
✅ 5. Letzte 2 Sessions      → session_read für Kontinuität

PHASE 2: RESEARCH & BEST PRACTICES 2026
✅ 1. Web Search             → Recherchiere Best Practices 2026
✅ 2. GitHub Grep            → Finde produktionsreife Implementierungen
✅ 3. Context7 Docs          → Offizielle Library-Dokumentation
✅ 4. Code Review            → Analysiere Verbesserungspotenzial

PHASE 3: INTERNAL DOCUMENTATION
✅ 1. /dev/ Docs             → Lese relevante Docs in ~/dev/
✅ 2. Elite Guides           → Lese /dev/sin-code/Guides/
✅ 3. Troubleshooting        → Prüfe existierende ts-ticket-XX.md

PHASE 4: MASTER-PLAN CREATION (10-PHASEN CONDUCTOR TRACKS)
✅ Erstelle ULTIMATIVEN 10-Phasen Master-Plan
✅ CEO-Level Ausführlichkeit und Vollumfänglichkeit
✅ Blueprint Rules konform
✅ Tasks-System Rules konform
✅ Parallel-fähig für Multi-Agent Arbeit

PHASE 5: SWARM DELEGATION (MINIMUM 5 PARALLEL TASKS)
✅ Delegiere mindestens 5 Tasks parallel an:
   • Serena MCP (Orchestration)
   • Sisyphus (Implementation)
   • Atlas (Heavy Lifting)
   • Prometheus (Planning)
   • Oracle (Architecture Review)
   • Explore Agents (Code Discovery)
   • Librarian (Documentation)

VIOLATIONS = TECHNICAL TREASON:
- Skipping ANY phase = FORBIDDEN
- Starting implementation before Phase 4 complete = FORBIDDEN
- Delegating fewer than 5 parallel tasks = FORBIDDEN
- Not reading lastchanges.md = FORBIDDEN
- Not researching Best Practices 2026 = FORBIDDEN
```

---

### 🔴 RULE -1.5: THE USER PROMPT LOGBOOK MANDATE

| Attribute | Value |
|-----------|-------|
| **ID** | RULE-015 |
| **Severity** | CRITICAL |
| **Category** | Documentation/Memory |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 268-298) |
| **When to Apply** | Before every start, after every interaction |

**Full Text:**
```
CODER MÜSSEN VOR JEDEM START UND NACH JEDER INTERAKTION 
`/projectname/userprompts.md` LESEN UND AKTUALISIEREN.

LOGBUCH-STRUKTUR & REGELN (MANDATORY):

1. APPEND-ONLY PRINZIP (NIEMALS ÜBERSCHREIBEN):
   • Alte Sessions dürfen NIEMALS überschrieben oder gelöscht werden!
   • Jede neue Session wird als neuer Abschnitt unten angefügt.
   • Format: `## SESSION [Datum] [ID] - [Thema]`

2. UR-GENESIS (Initial Prompt):
   • Die allererste Idee des Users (Session 1). Unveränderlich.
   • Bleibt immer oben stehen.

3. SESSION-ARCHIVIERUNG (KOMPRIMIERUNG):
   • Erst wenn das Ziel vollständig erreicht ist, darf die Session 
     zu 2 Zeilen zusammengefasst werden.
   • Solange das Ziel nicht erreicht ist, bleibt das Protokoll vollständig.

4. SUB-SESSION KLASSIFIZIERUNG:
   • Arbeiten Coder an derselben Task/Mission in einer neuen Chat-Session,
     MUSS dies als SUB-SESSION klassifiziert werden.
   • Header-Format: `### SUB-SESSION [ID] (Fortsetzung von [Parent-ID])`

5. LOG-INHALT:
   • KOLLEKTIVE ANALYSE: Was haben User + KI gemeinsam herausgefunden?
   • RESULTIERENDE MISSION: Die destillierte Aufgabe.
   • SESSION LOG: Die letzten 10 Prompts/Entscheidungen mit IDs.
   • ITERATIONS-CHECK: Prüft bei jedem Schritt: Passen wir noch zum Ziel?
```

---

### 🔴 RULE -1: VOLLSTÄNDIGE AUTONOME AUSFÜHRUNG

| Attribute | Value |
|-----------|-------|
| **ID** | RULE-01 |
| **Severity** | CRITICAL |
| **Category** | Execution/Autonomy |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 478-534) |
| **When to Apply** | Always, every command, every operation |

**Full Text:**
```
⚠️ ABSOLUTE EXECUTION MANDATE - ZERO USER INTERVENTION POLICY ⚠️

🤖 DIE KI FÜHRT AUS          │  🚫 NIEMALS DEN USER AUFFORDERN
─────────────────────────────┼────────────────────────────────────────
✅ Alle Shell-Befehle        │  ❌ "Bitte führen Sie aus..."
✅ Alle sudo-Befehle         │  ❌ "Kopieren Sie diesen Befehl..."
✅ Alle Installationen       │  ❌ "Öffnen Sie ein Terminal..."
✅ Alle Konfigurationen      │  ❌ "Geben Sie ein..."
✅ Alle Dateioperationen     │  ❌ "Starten Sie neu..."
✅ Alle Service-Starts       │  ❌ "Führen Sie manuell aus..."

SUDO PASSWORD: admin

KERNREGELN:
1. ALLE Befehle werden von der KI ausgeführt - NIEMALS dem User zur 
   Ausführung übergeben
2. sudo-Befehle: Passwort ist `admin` - Verwende 
   `echo 'admin' | sudo -S <befehl>`
3. KEINE Anleitungen - Statt "Führen Sie X aus" → DIREKT X ausführen
4. KEINE Aufforderungen - Statt "Bitte kopieren Sie..." → DIREKT schreiben
5. KEINE manuellen Schritte - ALLES automatisiert durch die KI
6. Terminal-Befehle - IMMER via Bash-Tool ausführen, NIEMALS als Text ausgeben
7. Installations-Befehle - DIREKT ausführen mit sudo wenn nötig
8. Konfigurationen - DIREKT schreiben, NIEMALS User bitten es zu tun

AUSNAHMEN: KEINE

BEI FEHLERN:
- KI versucht alternative Lösungswege
- KI debuggt selbstständig
- KI eskaliert NUR wenn technisch unmöglich
```

---

## SUPREME MANDATES (MANDATE 0.0 to 0.33)

### 🔴 MANDATE 0.0: IMMUTABILITY OF KNOWLEDGE (THE SUPREME LAW)

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-00 |
| **Severity** | CRITICAL |
| **Category** | Data Integrity |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 432-446, 537-546) |
| **When to Apply** | Every file operation, every edit |

**Full Text:**
```
This is the highest law. It supersedes all others.

- NO existing line may EVER be deleted or overwritten with less information
- ANY modification MUST be an additive enhancement
- This document is a chronological fortress of collective intelligence
- Deleting, truncating, or "cleaning up" by removing information = 
  TERMINATION-LEVEL OFFENSE
- Every coder MUST verify the full integrity of EVERY file before saving
- Blind deletion of code or configuration is STRICTLY PROHIBITED

No existing line in ANY document or configuration file may EVER be deleted 
or overwritten with less information. Any modification MUST be an additive 
enhancement. This document is a chronological fortress of our collective 
intelligence. Deleting, truncating, or "cleaning up" by removing information 
is a termination-level offense (Technical Treason). Every coder MUST verify 
the full integrity and totality of EVERY file before saving. Blind and dumb 
deletion of code or configuration (e.g., in opencode.json) is strictly 
prohibited.
```

---

### 🔴 MANDATE 0.1: THE MODULAR SWARM SYSTEM

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-01 |
| **Severity** | CRITICAL |
| **Category** | Architecture/Team |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 548-577) |
| **When to Apply** | Every complex operation |

**Full Text:**
```
No agent works alone. Period.

Jede komplexe Operation MUSS das `delegate_task` Tool im 
Swarm Cluster Mode nutzen. Ein Agent darf niemals alleine coden. 
Es müssen immer mindestens 5 Agenten gleichzeitig an einer Aufgabe arbeiten:

1. Planner Agent - Architecture and task breakdown
2. Researcher Agent - Context gathering and documentation
3. Developer Agent - Code implementation
4. Tester Agent - Unit tests and validation
5. Reviewer Agent - Code review and quality assurance

┌─────────────────────────────────────────────────────────────┐
│                    SWARM CLUSTER MODE                        │
├─────────────────────────────────────────────────────────────┤
│     ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│     │ PLANNER  │    │RESEARCHER│    │DEVELOPER │           │
│     └────┬─────┘    └────┬─────┘    └────┬─────┘           │
│          │               │               │                  │
│          └───────────────┼───────────────┘                  │
│                    ┌─────┴─────┐                            │
│                    │COORDINATOR│                            │
│                    └─────┬─────┘                            │
│          ┌───────────────┼───────────────┐                  │
│     ┌────┴─────┐    ┌────┴─────┐    ┌────┴─────┐           │
│     │  TESTER  │    │ REVIEWER │    │ DEPLOYER │           │
│     └──────────┘    └──────────┘    └──────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

### 🔴 MANDATE 0.2: REALITY OVER PROTOTYPE

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-02 |
| **Severity** | CRITICAL |
| **Category** | Code Quality |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 579-588) |
| **When to Apply** | Every code commit |

**Full Text:**
```
NO MOCKS. NO SIMULATIONS. REAL CODE ONLY.

- Simulationen, Mocks und Platzhalter sind STRENGSTENS VERBOTEN
- Jedes Fragment muss REAL funktionieren
- Wir liefern keine Prototypen, sondern fertige Produkte in jedem Commit
- Every API call must hit real endpoints
- Every database operation must use real databases
- Every file operation must write real files
```

---

### 🔴 MANDATE 0.3: THE OMNISCIENCE BLUEPRINT MANDATE

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-03 |
| **Severity** | CRITICAL |
| **Category** | Documentation/Architecture |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 590-597) |
| **When to Apply** | Every project, every module |

**Full Text:**
```
🚨 CRITICAL: Context is the Currency of Intelligence

- BLUEPRINT.md Presence: Jedes Projekt MUSS eine modulare BLUEPRINT.md 
  im Root führen
- Master Drafts Index: Muss auf ~/.opencode/blueprint-vorlage.md (V5.3) 
  basieren und alle 22 Säulen der Macht abdecken
- 🛡️ IMMUTABILITY MANDATE: Master-Vorlagen in 
  /Users/jeremy/dev/sin-code/Blueprint-drafts/ dürfen NIEMALS 
  eigenständig verändert werden
- 📖 500-LINE KNOWLEDGE MANDATE: Jede Blueprint-Vorlage MUSS ein 
  vollumfängliches Elite-Handbuch (500+ Zeilen) sein
```

---

### 🔴 MANDATE 0.4: DOCKER SOVEREIGNTY & INFRASTRUCTURE MASTERY

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-04 |
| **Severity** | HIGH |
| **Category** | Docker/Infrastructure |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 599-615) |
| **When to Apply** | All Docker operations |

**Full Text:**
```
All Docker images must be preserved locally.

- Local Persistence & Saving: Alle Docker-Images MÜSSEN via `docker save` 
  lokal in /Users/jeremy/dev/sin-code/Docker/[projektname]/images/ 
  gesichert werden
- Hierarchical Structure: Jedes Projekt führt sein eigenes Verzeichnis 
  /Users/jeremy/dev/sin-code/Docker/[projektname]/ für Images, Configs, 
  Volumes und Logs
- Guide Conformity: Agenten MÜSSEN die 500+ Zeilen starken Elite-Handbücher 
  in /Users/jeremy/dev/sin-code/docs/dev/elite-guides/ befolgen

/Users/jeremy/dev/sin-code/Docker/
├── [project-name]/
│   ├── images/          # docker save outputs
│   ├── configs/         # docker-compose files
│   ├── volumes/         # persistent data
│   └── logs/            # container logs
└── Guides/              # 500+ line Elite Guides
```

---

### 🔴 MANDATE 0.5: THE CITADEL DOCUMENTATION SOVEREIGNTY

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-05 |
| **Severity** | CRITICAL |
| **Category** | Documentation |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 617-651) |
| **When to Apply** | Every module, every project |

**Full Text:**
```
Every module requires 26-pillar documentation structure.

Jedes Modul, jedes Projekt und jede Integration MUSS eine 
26-PFEILER-STRUKTUR in Docs/[name]/ führen. Jede Datei muss die 
500-Zeilen-Payload-Grenze anstreben.

Standard Pillar Files:
Docs/[module-name]/
├── 01-[name]-overview.md
├── 02-[name]-lastchanges.md
├── 03-[name]-troubleshooting.md
├── 04-[name]-architecture.md
├── 05-[name]-api-reference.md
├── 06-[name]-configuration.md
├── 07-[name]-deployment.md
├── 08-[name]-security.md
├── 09-[name]-performance.md
├── 10-[name]-testing.md
├── 11-[name]-monitoring.md
├── 12-[name]-integration.md
├── 13-[name]-migration.md
├── 14-[name]-backup.md
├── 15-[name]-scaling.md
├── 16-[name]-maintenance.md
├── 17-[name]-compliance.md
├── 18-[name]-accessibility.md
├── 19-[name]-localization.md
├── 20-[name]-analytics.md
├── 21-[name]-support.md
├── 22-[name]-roadmap.md
├── 23-[name]-glossary.md
├── 24-[name]-faq.md
├── 25-[name]-examples.md
└── 26-[name]-appendix.md
```

---

### 🔴 MANDATE 0.6: THE TICKET-BASED TROUBLESHOOTING MANDATE

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-06 |
| **Severity** | HIGH |
| **Category** | Troubleshooting |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 653-677) |
| **When to Apply** | Every error, every failure |

**Full Text:**
```
Every error gets its own ticket file.

Every error and its corresponding solution MUST NOT simply be noted in 
the project's troubleshooting file. Instead, a dedicated ticket file MUST 
be created for EACH failure/fix following this exact protocol:

1. Absolute Path Logic:
   - For project-specific issues: Create the ticket in 
     [PROJECT-ROOT]/troubleshooting/ts-ticket-[XX].md
   - For infrastructure/workspace issues (OpenCode, Docker, Guides, 
     Blueprint): Create the ticket in 
     /Users/jeremy/dev/sin-code/troubleshooting/ts-ticket-[XX].md
   - Note: If the directory troubleshooting/ does not exist, it MUST be 
     created at the root level

2. Ticket Naming: Files MUST be named ts-ticket-[XX].md (e.g., 
   ts-ticket-01.md), incrementing for each new ticket in that specific 
   directory

3. Content Requirements: The coder AI MUST provide a highly detailed 
   explanation including:
   - Problem Statement: Exactly what was the issue?
   - Root Cause Analysis: Why did it happen?
   - Step-by-Step Resolution: How was it fixed? (Detailed steps)
   - Commands & Code: Every command executed and every code change made
   - Sources & References: Links to documentation or internal guides used

4. The "Holy Reference": In the main module troubleshooting file 
   (e.g., Docs/[name]/03-[name]-troubleshooting.md), a permanent reference 
   MUST be added:
   - Format: **Reference Ticket:** @/[project-name]/troubleshooting/ts-ticket-[XX].md

5. Additive Integrity: This process is strictly additive. Tickets are 
   chronological artifacts of the system's growth and recovery. NEVER delete 
   or consolidate tickets into single files.
```

---

### 🔴 MANDATE 0.7: THE SAFE MIGRATION & CONSOLIDATION LAW

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-07 |
| **Severity** | HIGH |
| **Category** | File Operations |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 679-690) |
| **When to Apply** | File consolidation, refactoring |

**Full Text:**
```
No file is deleted without backup.

When files are consolidated, refactored, or recreated based on existing 
ones, you MUST NOT simply create a new file and forget/delete the old one. 
You MUST follow this EXACT protocol:

1. READ TOTALITY: Read the existing file from the first to the very last line
2. PRESERVE (RENAME): Rename the existing file with the suffix _old
3. CREATE & SYNTHESIZE: Create the new file according to Blueprint rules
4. INTEGRATE EVERYTHING: Move ALL information from the _old file into the new one
5. MULTI-VERIFY: Perform at least 3 verification passes
6. CLEANUP: ONLY delete the _old file once the successor is verified
```

---

### 🟠 MANDATE 0.8: SOURCE OF TRUTH HIERARCHY

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-08 |
| **Severity** | HIGH |
| **Category** | Configuration |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 692-701) |
| **When to Apply** | Configuration decisions |

**Full Text:**
```
Configuration priority (highest to lowest):

1. ~/.config/opencode/opencode.json    [PRIMARY - Source of Truth]
2. ~/.config/opencode/AGENTS.md        [THIS FILE - Supreme Mandate]
3. ~/.opencode/                        [LEGACY - Preserved, not edited]
4. [PROJECT]/.opencode/                [Project-specific overrides]
```

---

### 🟠 MANDATE 0.9: CODING STANDARDS ENFORCEMENT

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-09 |
| **Severity** | HIGH |
| **Category** | Code Quality |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 703-712) |
| **When to Apply** | All code writing |

**Full Text:**
```
TypeScript Strict Mode is MANDATORY.

- "strict": true in all tsconfig.json
- NO `any` types without justification
- NO `@ts-ignore` comments
- NO `@ts-expect-error` without ticket reference
- ALL functions must have JSDoc comments
- ALL exports must be documented
```

---

### 🟠 MANDATE 0.10: COMMIT MESSAGE STANDARDS

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-10 |
| **Severity** | MEDIUM |
| **Category** | Git |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 714-729) |
| **When to Apply** | Every commit |

**Full Text:**
```
Conventional Commits required.

Format: <type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Tests
- chore: Maintenance

Example: feat(auth): implement Antigravity OAuth flow
```

---

### 🟠 MANDATE 0.11: SERENA MCP & SWARM DELEGATION

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-11 |
| **Severity** | HIGH |
| **Category** | Orchestration |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 731-737) |
| **When to Apply** | Complex tasks |

**Full Text:**
```
ALWAYS use Serena MCP for orchestration.

- Das Agenten-Cluster arbeitet im permanenten Vibe-Flow
- Serena coordinates all agent activities
- All complex tasks routed through Serena
```

---

### 🟢 MANDATE 0.12: FREE FIRST PHILOSOPHY

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-12 |
| **Severity** | MEDIUM |
| **Category** | Cost/Resources |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 739-748) |
| **When to Apply** | Technology selection |

**Full Text:**
```
Prefer FREE solutions over paid services.

- OpenCode ZEN models = FREE
- Self-hosted MCP servers = FREE
- DuckDuckGo search = FREE (no API key)
- Edge TTS = FREE
- FFmpeg = FREE
- Never pay for what can be self-hosted
```

---

### 🟠 MANDATE 0.13: CEO-LEVEL WORKSPACE ORGANIZATION

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-13 |
| **Severity** | HIGH |
| **Category** | File System |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 750-775+) |
| **When to Apply** | File organization |

**Full Text:**
```
The home directory is a fortress, not a dumping ground.

Your MacBook filesystem MUST follow CEO-level enterprise organization:

/Users/jeremy/
├── Desktop/                          # CLEAN - Only temp work, auto-cleaned daily
├── Documents/                        # Important documents only
├── Downloads/                        # Temp downloads, cleaned weekly
├── Bilder/                           # All images organized
│   └── AI-Screenshots/               # AI tool screenshots (auto-archived)
│       ├── playwright/               # Playwright screenshots
│       ├── skyvern/                  # Skyvern screenshots
│       ├── steel/                    # Steel browser screenshots
│       ├── stagehand/                # Stagehand screenshots
│       ├── opencode/                 # OpenCode screenshots
│       └── archive/                  # Auto-archived (7+ days old)
├── dev/                              # ALL development work
│   ├── projects/                     # Organized projects
│   │   ├── active/                   # Currently active projects
│   │   ├── archive/                  # Completed/inactive projects
│   │   └── experiments/              # POC and testing
│   ├── sin-code/                     # Main SIN ecosystem
│   │   ├── archive/                  # Archived files
│   │   ├── Docker/                   # Docker configs
│   │   ├── Guides/                   # Elite guides (500+ lines)
│   │   ├── Singularity/              # Singularity plugins
│   │   └── troubleshooting/          # Ticket files
│   └── [project-dirs]/               # Active project directories
└── .config/opencode/                 # PRIMARY CONFIG

Rules:
- NO loose files in ~/ - everything has a home
- NO project directories directly in ~/ - use ~/dev/
- Auto-cleanup scripts run daily (Desktop, AI screenshots)
- Downloads cleaned weekly
```

---

### 🟡 MANDATE 0.14: MILLION-LINE CODEBASE AMBITION

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-14 |
| **Severity** | MEDIUM |
| **Category** | Scale/Architecture |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 777-800+) |
| **When to Apply** | Major projects |

**Full Text:**
```
We build empires, not toys.

Every major project MUST aspire to 1,000,000+ lines of production code:

| Metric | Minimum | Target | Elite |
|--------|---------|--------|-------|
| Lines of Code | 100K | 500K | 1M+ |
| Test Coverage | 60% | 80% | 95%+ |
| Documentation | 10K | 50K | 100K+ |
| API Endpoints | 50 | 200 | 500+ |
| Docker Services | 5 | 15 | 26+ |

Current Empire Status:
- SIN-Solver: Target 100K LOC (Captcha solving ecosystem)
- 26-Room Docker: Target 500K LOC (Distributed infrastructure)
- SIN-Code Ecosystem: Target 1M LOC (Complete autonomous system)

Best Practices 2026:
1. Modular Architecture: Every module < 500 lines, composable
2. Type Safety: 100% TypeScript strict mode
3. Test-Driven: Write tests before code
4. Documentation-First: Document before implementing
5. Automation: CI/CD for everything
6. Monitoring: Observability built-in from day one
7. Security: Zero-trust architecture
```

---

### 🟠 MANDATE 0.15: AI SCREENSHOT SOVEREIGNTY

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-15 |
| **Severity** | MEDIUM |
| **Category** | File Management |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 802-825+) |
| **When to Apply** | Screenshot handling |

**Full Text:**
```
AI screenshots NEVER pollute the Desktop.

All AI tools MUST save screenshots to ~/Bilder/AI-Screenshots/[tool]/:

| Tool | Directory | Cleanup |
|------|-----------|---------|
| Playwright | ~/Bilder/AI-Screenshots/playwright/ | 7 days → archive |
| Skyvern | ~/Bilder/AI-Screenshots/skyvern/ | 7 days → archive |
| Steel Browser | ~/Bilder/AI-Screenshots/steel/ | 7 days → archive |
| Stagehand | ~/Bilder/AI-Screenshots/stagehand/ | 7 days → archive |
| OpenCode | ~/Bilder/AI-Screenshots/opencode/ | 7 days → archive |

Auto-Cleanup Schedule:
- Daily 3:00 AM: Desktop cleanup (recordings > 7 days, screenshots > 30 days)
- Daily 4:00 AM: AI screenshot archive (files > 7 days → archive)
- Monthly: Archive cleanup (archives > 30 days deleted)

LaunchAgents:
- ~/Library/LaunchAgents/com.sincode.desktop-cleanup.plist
- ~/Library/LaunchAgents/com.sincode.ai-screenshot-cleanup.plist
```

---

### 🔴 MANDATE 0.16: THE TRINITY DOCUMENTATION STANDARD

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-16 |
| **Severity** | CRITICAL |
| **Category** | Documentation |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 827-865+) |
| **When to Apply** | Every project |

**Full Text:**
```
Docs are not an afterthought. They are the product.

Every project MUST follow this unified documentation structure. 
No stray .md files allowed.

1. Directory Structure (MANDATORY):
/projectname/
├── docs/
│   ├── non-dev/       # For Users: Guides, Tutorials, FAQs, Screenshots
│   ├── dev/           # For Coders: API Ref, Auth, Architecture, Setup
│   ├── project/       # For Team: Deployment, Changelog, Roadmap
│   └── postman/       # For Everyone: Hoppscotch/Postman Collections
├── DOCS.md            # THE RULEBOOK (Index & Standards)
└── README.md          # THE GATEWAY (Points to everything)

2. DOCS.md (The Constitution):
- Must exist in project root.
- Defines the documentation rules for that specific project.
- Acts as the Table of Contents for /docs/.

3. README.md (The Gateway):
- Must use the Document360 Standard:
  1. Introduction: What/Who/Why.
  2. Quick Start: 5-min Copy-Paste Setup.
  3. API Reference: Link to /docs/dev/.
  4. Tutorials: Link to /docs/non-dev/.
  5. Troubleshooting: Common issues.
  6. Changelog & Support: History & Contact.

4. Postman/Hoppscotch Mandate:
- API development requires a maintained collection in /docs/postman/.
- Use Hoppscotch (Room 24) as the standard tool.
```

---

### 🟠 MANDATE 0.17: UNIVERSAL OPENHANDS CODING LAYER

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-17 |
| **Severity** | HIGH |
| **Category** | Architecture |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 867-920+) |
| **When to Apply** | All coding tasks |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL agents, ALL chat interfaces, ALL coding requests

🚨 ALL coding tasks from ANY source MUST be routed through 
   agent-04.1-openhands-codeserver.

Infrastructure:
| Component | Address | Purpose |
|-----------|---------|---------|
| OpenHands Server | 172.20.0.41:3041 | Main coding service |
| CodeServer API | 172.20.0.141:8041 | Universal API gateway |
| Public URL | https://codeserver.delqhi.com | External access |
| Public API | https://codeserver-api.delqhi.com | External API |

Covered Interfaces (ALL MUST USE THIS):
- SIN-Solver Cockpit Chat: POST /webhook/cockpit-chat
- DelqhiChat: POST /webhook/delqhi-chat
- Telegram @DelqhiBot: POST /webhook/telegram
- OpenCode CLI: POST /webhook/opencode-cli
- n8n Workflows: POST /webhook/n8n
- Agent Zero: POST /webhook/agent-zero

Available Slash Commands (29 total):
/code, /code-status, /code-cancel, /tasks
/conversations, /conversation, /conversation-new, /conversation-delete
/files, /file-read, /file-write
/git-status, /git-commit, /git-diff, /git-log
/workspaces, /workspace, /workspace-switch
/models, /model, /model-switch
/config, /agents, /agent
/sessions, /session-save, /session-restore
/logs, /metrics
```

---

### 🟠 MANDATE 0.18: THE SLASH COMMAND PROTOCOL

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-18 |
| **Severity** | MEDIUM |
| **Category** | Automation |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 922-945+) |
| **When to Apply** | AI-autonomous projects |

**Full Text:**
```
Design for Autonomy. Build for Control.

In the AI era, every project must be autonomously manageable by AI agents. 
We do not build static software; we build controllable systems.

1. The /projectname/SLASH.md Mandate:
- Every project MUST have a SLASH.md file in its root.
- This file documents ALL available slash commands for that project.
- It serves as the "Instruction Manual" for AI agents to control the project.

2. The Autonomy Requirement:
- Every mutable entity (titles, descriptions, offers, prices, products, 
  blogs, media) MUST be changeable via:
  A. An API endpoint (documented in /docs/postman/).
  B. A Slash Command (documented in SLASH.md).

3. Slash Command Standard:
- Format: /cmd [action] [target] --param value
- Example: /product update "Super Shoes" --price 99.99
- Implementation: These commands must map to underlying API calls or scripts.

Why? So that future AI swarms can autonomously manage, optimize, and scale 
the business without manual coding for every content change.
```

---

### 🟠 MANDATE 0.19: MODERN CLI TOOLCHAIN

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-19 |
| **Severity** | HIGH |
| **Category** | Tools/Performance |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 947-1095+) |
| **When to Apply** | All CLI operations |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: All OpenCode agents, all bash operations, all CLI scripts
REFERENCE: /Users/jeremy/dev/sin-code/OpenCode/ALTERnative.md (600+ lines)

Forbidden (Legacy) Tools:
❌ grep → Use ripgrep (rg) — 60x faster
❌ find → Use fd or fast-glob — 15x faster
❌ sed → Use sd — 10x faster
❌ awk → Use ugrep or ripgrep — 10x faster
❌ cat/head/tail → Use bat — Syntax highlighting + git integration
❌ ls → Use exa or lsd — 2x faster + colors

Mandatory (2026) Tools:
✅ ripgrep (rg) - Code search, 60x faster than grep
✅ fd - File discovery, 15x faster than find
✅ fast-glob - Node.js globbing, 3-15x faster than glob
✅ sd - Stream editor, 10x faster than sed
✅ tree-sitter - AST parsing, syntax-aware, 99%+ accurate
✅ bat - File viewing with syntax highlighting and git diff
✅ exa/lsd - Directory listing with git integration
✅ Deno/Bun - Runtime, 5-10x startup faster than Node.js

Code Standards:
1. NO grep in scripts - Use rg instead
2. NO find for globbing - Use fd instead
3. NO sed replacements - Use sd instead
4. NO cat for code viewing - Use bat instead
5. AST-based refactoring must use tree-sitter - NOT regex
```

---

### 🟠 MANDATE 0.20: STATUS FOOTER PROTOCOL

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-20 |
| **Severity** | MEDIUM |
| **Category** | Communication |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1096-1155+) |
| **When to Apply** | After code changes |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: All AI coders, all chat sessions, all coding responses

Every AI coder response that involves code changes MUST include a status footer.

Footer Template (MANDATORY):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STATUS UPDATE

Updated:       ☑️ lastchanges.md 
               ☑️ userprompts.md
               ☑️ readme.md
               ☑️ TASKS.md
               ☑️ /docs/

FORTSCHRITT:   ████████░░ 80% (Code geschrieben)  
               ██████░░░░ 60% (Getestet & Verified) 
               ░░░░░░░░░░  0% (Deployment Ready)

Github:        [repo-url]
last-commit:   [timestamp]
Vercel:        [vercel-url] (if applicable)
last-deploy:   [timestamp]
OpenURL:       [public-url]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress Bar Legend:
- ████████████ = 100% Complete
- ██████████░░ = ~83% Complete  
- ████████░░░░ = ~67% Complete
- ██████░░░░░░ = 50% Complete
- ████░░░░░░░░ = ~33% Complete
- ██░░░░░░░░░░ = ~17% Complete
- ░░░░░░░░░░░░ = 0% (Not Started)

When to Include:
- After ANY file modification
- After completing a task/subtask
- Before ending a coding session
- When asked for status update
```

---

### 🔴 MANDATE 0.21: GLOBAL SECRETS REGISTRY

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-21 |
| **Severity** | CRITICAL |
| **Category** | Security |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1156-1243+) |
| **When to Apply** | Secret handling |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL projects, ALL secrets management
STATUS: CRITICAL SECURITY MANDATE

🚨 PROBLEM: KIs sind KRANK im Umgang mit Secrets! Vergesslich, unzuverlässig.

💡 LÖSUNG: Zentrale Secrets-Datenbank in ~/dev/environments-jeremy.md

ABSOLUTE GESETZE:

📋 REGEL 1: ALLE SECRETS MÜSSEN ERFASST WERDEN
✅ JEDES Secret das gefunden, genutzt oder gesehen wird
✅ JEDER API Key, Token, Passwort, Zugangsdaten
✅ JEDER Endpoint, Port, URL, Connection String
✅ ALLES was irgendeine Form von Zugangsdaten darstellt
➡️  MUSS sofort in ~/dev/environments-jeremy.md dokumentiert werden

📋 REGEL 2: NIEMALS LÖSCHEN - NUR HINZUFÜGEN
❌ VERBOTEN: Secrets aus der Datei löschen
❌ VERBOTEN: Einträge überschreiben oder entfernen
❌ VERBOTEN: Datei leeren oder truncaten
✅ ERLAUBT: Neue Secrets hinzufügen
✅ ERLAUBT: Fehler markieren (Label: "DEPRECATED", "ROTATED")
✅ ERLAUBT: User über Fehler informieren (aber SELBST NICHT FIXEN)

📋 REGEL 3: VOLLSTÄNDIGE DOKUMENTATION
Jedes Secret muss enthalten:
• Account/Service Name
• Username/Email
• Password/Token/Key (verschlüsselt wenn möglich)
• Endpoint/URL
• Ports
• Zugehörige Projekte/Verwendungszweck
• Erstellungs-/Rotationsdatum

📋 REGEL 4: DATEI-INTEGRITÄT
• Diese Datei ist APPEND-ONLY
• Chronologische Dokumentation aller Secrets seit Anbeginn
• Löschen = TECHNISCHER HOCHVERRAT
• Nur Hinzufügen erlaubt, nie Subtrahieren

VIOLATIONS = TECHNISCHER HOCHVERRAT:
- Secrets nicht dokumentieren = VERWEIGERUNG DER AUFGABE
- Secrets löschen = SOFORTIGE ESKALATION AN USER
- Datei manipulieren = PROTOKOLLIERUNG ALS KRITISCHER FEHLER
```

---

### 🔴 MANDATE 0.22: VOLLUMFÄNGLICHES PROJEKT-WISSEN

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-22 |
| **Severity** | CRITICAL |
| **Category** | Documentation/Knowledge |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1244-1325+) |
| **When to Apply** | Every project start, every change |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL projects
STATUS: KNOWLEDGE SOVEREIGNTY MANDATE

🎯 PRINZIP: Der User geht davon aus, dass du das Projekt IN- UND AUSWENDIG kennst.

REALITÄT: KIs vergessen alles zwischen Sessions.

LÖSUNG: Lokale AGENTS.md in jedem Projekt-Root als lebendiges Gedächtnis.

MANDATORY WORKFLOW:

🔄 BEI JEDEM PROJEKTSTART:
1. Lese /projektname/AGENTS.md (lokale Projekt-Agents.md)
2. Extrahiere alle projektspezifischen Regeln und Konventionen
3. Adaptiere dein Verhalten entsprechend den lokalen Standards

🔄 BEI JEDER ÄNDERUNG:
1. Vergleiche aktuellen Code/Struktur mit AGENTS.md
2. Bei Abweichung: SOFORT AGENTS.md aktualisieren
3. Dokumentiere neue Patterns, Architektur-Entscheidungen, APIs
4. Verifiziere Konsistenz zwischen Code und Dokumentation

🔄 BEI JEDEM SESSION-ENDE:
1. Aktualisiere AGENTS.md mit neuen Erkenntnissen
2. Dokumentiere Architektur-Änderungen
3. Füge Troubleshooting-Einträge hinzu
4. Commit: git add AGENTS.md && git commit -m "docs: Update AGENTS.md"

REQUIRED CONTENT IN LOCAL AGENTS.MD:
- Projekt-Übersicht (Tech Stack, Architektur, Datenbank)
- Konventionen (Naming, Folder Structure, State Management)
- API-Standards (Base URL, Auth, Versioning)
- Spezielle Regeln (Projektspezifische Anweisungen)
- Troubleshooting (Bekannte Probleme und Lösungen)
- Letzte Änderung: [YYYY-MM-DD]

INTEGRITÄTS-CHECK (VOR JEDER ANTWORT):
- [ ] Habe ich die lokale AGENTS.md gelesen?
- [ ] Sind meine Antworten konform mit den lokalen Konventionen?
- [ ] Muss ich die AGENTS.md aktualisieren?
- [ ] Sind Architektur-Änderungen dokumentiert?
```

---

### 🔴 MANDATE 0.23: PHOTOGRAFISCHES GEDÄCHTNIS

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-23 |
| **Severity** | CRITICAL |
| **Category** | Documentation/Context |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1326-1423+) |
| **When to Apply** | Every session |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL projects
STATUS: CONTEXT PRESERVATION MANDATE

🎯 PRINZIP: Der User geht davon aus, dass du IMMER weißt woran zuletzt gearbeitet wurde.

REALITÄT: KIs haben kein echtes Gedächtnis zwischen Sessions.

LÖSUNG: /projektname/projektname-lastchanges.md als photographisches Gedächtnis.

MANDATORY WORKFLOW:

📖 VOR JEDER SESSION:
1. Lese /projektname/projektname-lastchanges.md
2. Extrahiere: Was wurde zuletzt gemacht?
3. Extrahiere: Was lief schief?
4. Extrahiere: Was sind die nächsten Schritte?
5. Bestätige: "Kontext aus lastchanges.md geladen"

✍️ NACH JEDER INTERAKTION:
1. APPEND zu lastchanges.md (NIEMALS überschreiben!)
2. Strukturierter Eintrag mit Zeitstempel
3. Alle Beobachtungen, Fehler, Lösungen, Erkenntnisse
4. Nächste Schritte und offene Tasks

🔄 SESSION-ENDE:
1. Finaler Eintrag in lastchanges.md
2. Commit: git add projektname-lastchanges.md
3. git commit -m "log: Auto-log $(date '+%Y-%m-%d %H:%M')"

MANDATORY LOG FORMAT:
## [YYYY-MM-DD HH:MM] - [AGENT/TASK-ID]

**Beobachtungen:**
- [Alle neuen Erkenntnisse, Fakten, Entdeckungen]
- [Code-Struktur Analysen]
- [User-Anforderungen Verständnis]

**Fehler:**
- [Exakte Error-Messages]
- [Stacktraces]
- [Ursachen-Analyse]

**Lösungen:**
- [Fix-Code Snippets]
- [Tests die bestanden wurden]
- [Workarounds falls nötig]

**Nächste Schritte:**
- [Offene Tasks]
- [Blocker die gelöst werden müssen]
- [Geplante Features/Änderungen]

**Arbeitsbereich:**
- {task-id}-{pfad/datei}-{status}

MANDATORY HEADER FÜR JEDES PROJEKT:
# [Projektname]-lastchanges.md
**Projekt:** [Name]
**Erstellt:** [YYYY-MM-DD]
**Letzte Änderung:** [YYYY-MM-DD HH:MM]
**Gesamt-Sessions:** [Zahl]

---

## UR-GENESIS - INITIAL PROMPT
[Sitzung 1 - Die allererste User-Anfrage - UNVERÄNDERLICH]

---
```

---

### 🔴 MANDATE 0.24: ALLUMFASSENDES WISSEN

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-24 |
| **Severity** | CRITICAL |
| **Category** | Research/Knowledge |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1424-1509+) |
| **When to Apply** | All planning and coding phases |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL planning and coding phases
STATUS: KNOWLEDGE FRESHNESS MANDATE

🎯 PRINZIP: Der User geht davon aus, dass du ALLWISSEND bist.

REALITÄT: KIs nutzen veraltete Methoden und produzieren Müll.

LÖSUNG: Kontinuierliche Recherche während ALLER Phasen.

MANDATORY RESEARCH WORKFLOW:

📋 PHASE 1: VOR DER PLANUNG
1. Web Search: "[Technologie] Best Practices 2026"
2. GitHub Grep: Produktionsreife Implementierungen finden
3. Context7: Offizielle Dokumentation der neuesten Version
4. Stack Overflow: Aktuelle Lösungen und Patterns

📋 PHASE 2: WÄHREND DER PLANUNG
1. Bei jedem Architektur-Entscheid: Recherchiere Alternativen
2. Vergleiche Patterns: "Welches ist 2026 State-of-the-Art?"
3. Prüfe Deprecations: "Ist diese Methode noch aktuell?"
4. Security Check: "Gibt es neue CVEs für diese Library?"

📋 PHASE 3: WÄHREND DES CODINGS
1. Bei JEDEM Hinweis auf Fehler → SOFORT Recherche starten
2. Error Message kopieren → Google/Bing/DDG suchen
3. Bei Unsicherheit: NIE raten, IMMER nachschlagen
4. Stacktraces analysieren → Root Cause finden

📋 PHASE 4: BEI PROBLEME
1. Fehler aufgetreten → Sofort: websearch_web_search_exa()
2. "[Error Message] solution 2026"
3. Mehrere Quellen vergleichen
4. Verified Lösung implementieren (nicht workarounden!)

RESEARCH SOURCES (IN PRIORITY ORDER):
1. Official Documentation (context7_query-docs)
2. GitHub Repositories (grep_app_searchGitHub)
3. Web Search (websearch_web_search_exa)
4. Stack Overflow / Dev.to / Medium

VERBOTEN (NIEMALS TUN):
❌ "Ich denke, das sollte so funktionieren..."
❌ "Das habe ich mal irgendwo gesehen..."
❌ "Probieren wir es einfach aus..."
❌ "Das ist vermutlich deprecated..."

GEPRIESEN (IMMER TUN):
✅ "Lass mich die aktuelle Dokumentation prüfen..."
✅ "Die offiziellen Best Practices 2026 sagen..."
✅ "Laut der neuesten Version sollten wir..."
✅ "Ich recherchiere das jetzt genau..."
```

---

### 🔴 MANDATE 0.25: SELBSTKRITIK & CRASHTESTS

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-25 |
| **Severity** | CRITICAL |
| **Category** | Quality Assurance |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1510-1618+) |
| **When to Apply** | All code deliveries |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL code deliveries
STATUS: QUALITY ASSURANCE MANDATE

🎯 PRINZIP: Sei dein SCHLIMMSTER PRÜFER und KONTROLLEUR.

CEO-MINDSET: "Vertrauen ist gut, Kontrolle ist besser."

MANDATORY VALIDATION WORKFLOW:

🔍 SCHRITT 1: SCHWACHSTELLEN-ANALYSE
• Wie könnte ich diesen Code zum Crashen bringen?
• Welche Edge-Cases wurden vergessen?
• Ist die Fehlerbehandlung vollständig?
• Gibt es Race Conditions?
• Sind alle Input-Validierungen vorhanden?

🔍 SCHRITT 2: CRASHTESTS
• Ungültige Eingaben testen
• Grenzwerte testen (0, null, undefined, "", [], {})
• Gleichzeitige Requests testen
• Netzwerk-Fehler simulieren
• Datenbank-Connection lost simulieren

🔍 SCHRITT 3: BROWSER-VERIFIKATION
• UI im Browser öffnen und visuell prüfen
• Playwright Tests für kritische Flows
• Mobile/Responsive Testing
• Cross-Browser Testing (Chrome, Firefox, Safari)

🔍 SCHRITT 4: INTEGRATIONSTESTS
• End-to-End Tests durchführen
• API-Integration testen
• Datenbank-Operationen verifizieren
• Externe Services mocken und testen

🔍 SCHRITT 5: PERFORMANCE-TESTS
• Load Testing (100+ gleichzeitige Requests)
• Memory Leak Detection
• Response Time Monitoring (< 200ms P95)

🔍 SCHRITT 6: SECURITY-AUDIT
• OWASP Top 10 Check
• SQL Injection Tests
• XSS Vulnerability Scan
• Secret-Leakage Check

SKEPTIZISMUS-CHECKLISTE:

Code-Qualität:
- [ ] Alle Funktionen haben JSDoc/TSDoc?
- [ ] Keine `any` Types in TypeScript?
- [ ] Error Handling an allen kritischen Punkten?
- [ ] Logging für Debugging vorhanden?

Testing:
- [ ] Unit Tests für alle neuen Funktionen?
- [ ] Integration Tests für API-Endpoints?
- [ ] E2E Tests für User Flows?
- [ ] Edge Cases abgedeckt?

Performance:
- [ ] Ladezeit < 3 Sekunden?
- [ ] Keine N+1 Queries?
- [ ] Caching implementiert wo nötig?
- [ ] Bundle Size optimiert?

Security:
- [ ] Input Validierung?
- [ ] Authentication/Authorization?
- [ ] Secrets nicht im Code?
- [ ] CORS korrekt konfiguriert?

Dokumentation:
- [ ] README aktualisiert?
- [ ] API Docs geschrieben?
- [ ] lastchanges.md aktualisiert?
- [ ] Breaking Changes dokumentiert?

GEWISSENHAFTE ANTWORT:
"Ich bin mir zu 100% sicher, dass alles funktioniert, weil:
1. Alle Tests bestehen (Unit, Integration, E2E)
2. Browser-Verifikation erfolgreich
3. Crashtests bestanden
4. Performance-Tests im grünen Bereich
5. Security-Audit ohne kritische Findings"
```

---

### 🟠 MANDATE 0.26: PHASENPLANUNG & FEHLERVERMEIDUNG

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-26 |
| **Severity** | HIGH |
| **Category** | Project Management |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1619-1694+) |
| **When to Apply** | Complex tasks |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL complex tasks
STATUS: PROJECT MANAGEMENT MANDATE

🎯 PRINZIP: Plane sequentiell, antizipiere Fehler, vermeide sie proaktiv.

MANDATORY PLANNING WORKFLOW:

🎯 SCHRITT 1: MEILENSTEINE DEFINIEREN
Jede Aufgabe muss haben:
• Klare Meilensteine (nicht mehr als 5 pro Phase)
• Definierte Erwartungen (Was ist das gewünschte Ergebnis?)
• Akzeptanzkriterien (Wann ist es "fertig"?)
• Zeitrahmen (Realistische Schätzung)

⚠️ SCHRITT 2: FEHLER-ANTIZIPATION
Vor dem Coding: Liste mögliche Fehler auf:
• "Was könnte bei der Datenbank-Integration schiefgehen?"
• "Welche CORS-Probleme erwarten wir?"
• "Wo könnten Race Conditions auftreten?"
• "Welche Dependencies könnten Konflikte haben?"

🛡️ SCHRITT 3: FEHLERVERMEIDUNG-STRATEGIEN
Für jeden antizipierten Fehler:
• Präventive Maßnahme definieren
• Fallback-Plan erstellen
• Monitoring/Alerting einrichten
• Dokumentation der Lösung vorbereiten

📋 SCHRITT 4: PHASEN-TRACKING
Status für jede Phase:
• PLANNED → IN_PROGRESS → REVIEW → TESTING → DONE
• Blocker dokumentieren
• Risiken aktualisieren
• User bei Blockern sofort informieren

PLANNING TEMPLATE:
## Projekt: [Name]

### Meilensteine
1. [Phase 1] - [Beschreibung]
   - Erwartung: [Was soll erreicht werden]
   - Akzeptanzkriterien: [Messbare Kriterien]
   - Zeitrahmen: [X Stunden/Tage]
   - Status: [PLANNED/IN_PROGRESS/DONE]

### Potenzielle Fehler & Vermeidung
| Fehler | Wahrscheinlichkeit | Prävention | Fallback |
|--------|-------------------|------------|----------|
| [DB Timeout] | Hoch | Connection Pooling | Retry-Logic |
| [CORS Error] | Mittel | Korrekte Headers | Proxy Config |

### Aktuelle Phase
**Phase:** [X von Y]
**Status:** [Status]
**Blocker:** [Keine / Liste]
**Nächster Schritt:** [Was kommt als nächstes]
```

---

### 🟠 MANDATE 0.27: DOCKER KNOWLEDGE BASE

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-27 |
| **Severity** | MEDIUM |
| **Category** | Knowledge Management |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1695-1762+) |
| **When to Apply** | Project setup, documentation |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL projects
STATUS: KNOWLEDGE INFRASTRUCTURE MANDATE

🎯 PRINZIP: Wir nutzen unsere EIGENE Docker-basierte Knowledge Base - 
           nicht externe Tools wie Linear!

UNSERE DOCKER KNOWLEDGE BASE ALS:
✅ Dev-Book
✅ Dev-Docs
✅ WIKI
✅ Sammlung wichtiger Daten
✅ Task-Planer
✅ Meilenstein-Tracker
✅ Projekt-Update-Zentrale

MANDATORY DOCKER KNOWLEDGE WORKFLOW:

🏗️ PROJEKT-SETUP IN UNSERER KNOWLEDGE BASE:
1. Erstelle Projekt-Eintrag in der Docker Knowledge Base
2. Verlinke /projektname/AGENTS.md und /projektname/lastchanges.md
3. Definiere Meilensteine und Epics
4. Erstelle Issues/Tasks für alle Features
5. Nutze Labels für Kategorisierung

📝 DOKUMENTATION IN KNOWLEDGE BASE:
Knowledge-Einträge sind WIKI-Dokumentation:
• Architektur-Entscheidungen
• API-Endpunkte und deren Nutzung
• Deployment-Prozesse
• Troubleshooting-Guides
• Wichtige Konfigurationen

🔄 KONTINUIERLICHES UPDATING:
1. Bei jeder Architektur-Änderung: Knowledge Base aktualisieren
2. Bei jedem Bugfix: Lösung dokumentieren
3. Bei neuen Features: Usage-Guide schreiben
4. Wöchentlich: Projekt-Status-Update in Knowledge Base

📊 BEST PRACTICES 2026 FÜR UNSERE KNOWLEDGE BASE:
• Zyklen/Sprints für iterative Entwicklung nutzen
• Roadmap für Langzeitplanung
• Git-Integration für automatische Updates
• Templates für wiederkehrende Task-Typen
• Docker-Container für hohe Verfügbarkeit und Backup

KEIN LINEAR MEHR:
❌ Externe Tools wie Linear werden NICHT mehr verwendet
✅ Wir nutzen ausschließlich unsere eigene Docker-basierte Knowledge Base
✅ Vollständige Datenhoheit und Self-Hosting
✅ Keine Abhängigkeit von externen Anbietern
```

---

### 🟡 MANDATE 0.28: MARKTANALYSE

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-28 |
| **Severity** | MEDIUM |
| **Category** | Strategy/Competitive |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1763-1832+) |
| **When to Apply** | Major projects |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL major projects
STATUS: COMPETITIVE ANALYSIS MANDATE

🎯 PRINZIP: Ist unser Projekt wirklich an der SPITZE in seinem Gebiet?

MANDATORY MARKET ANALYSIS:

🔍 ANALYSE-DIMENSIONEN:
1. Feature-Vergleich: Was können Konkurrenten?
2. Technologie-Stack: Sind wir auf dem neuesten Stand?
3. Performance: Wie schnell sind wir im Vergleich?
4. UX/UI: Ist unsere Lösung benutzerfreundlicher?
5. Preisgestaltung: Sind wir wettbewerbsfähig?
6. Innovation: Haben wir Unique Selling Points?

📊 BEWERTUNGSSKALA:
Für jede Dimension:
• 🥇 Führend (Top 3 im Markt)
• 🥈 Wettbewerbsfähig (Top 10)
• 🥉 Nachholbedarf (Außerhalb Top 10)

🎯 ZIEL: MINIMUM 🥈 in allen Dimensionen, 🥇 in Kern-Features

🔄 REGELMÄSSIGE REVIEWS:
• Monatlich: Quick-Market-Check
• Quartalsweise: Detaillierte Analyse
• Bei Major Releases: Wettbewerbs-Vergleich

ANALYSIS TEMPLATE:
## Marktanalyse: [Projektname] - [YYYY-MM-DD]

### Konkurrenz
| Konkurrent | Stärken | Schwächen | Unser Vorteil |
|------------|---------|-----------|---------------|
| [Name] | [...] | [...] | [...] |

### Unsere Position
- Feature-Set: [🥇🥈🥉]
- Performance: [🥇🥈🥉]
- UX/UI: [🥇🥈🥉]
- Innovation: [🥇🥈🥉]

### Verbesserungspotenzial
1. [Bereich mit höchster Priorität]
2. [Bereich mit mittlerer Priorität]
3. [Nice-to-have Verbesserungen]

### Nächste Schritte
- [ ] [Aktion 1]
- [ ] [Aktion 2]
```

---

### 🟠 MANDATE 0.29: ARBEITSBEREICH-TRACKING

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-29 |
| **Severity** | HIGH |
| **Category** | Collaboration |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1833-1888+) |
| **When to Apply** | Real-time, every task |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL projects
STATUS: COLLISION AVOIDANCE MANDATE

🎯 PRINZIP: Jeder hat seinen EIGENEN Arbeitsbereich, um Konflikte zu vermeiden.

MANDATORY WORKSPACE TRACKING:

📋 FORMAT (MUST BE UPDATED IN REAL-TIME):

In /projektname/projektname-lastchanges.md UND
In /projektname/projektname-userprompts.md:

## AKTUELLER ARBEITSBEREICH

**{todo};{task-id}-{arbeitsbereich/pfad}-{status}**

Beispiele:
• {Implementiere Login};TASK-001-src/auth/login.ts-IN_PROGRESS
• {Fix Bug #123};BUG-456-src/utils/api.ts-COMPLETED
• {Review Code};REV-789-src/components/-PENDING

📋 REGELN:
1. IMMER aktuell halten (bei jedem Task-Wechsel)
2. Eindeutige Task-IDs verwenden
3. Klare Pfad-Angaben (welche Dateien/Ordner)
4. Status: IN_PROGRESS / COMPLETED / PENDING / BLOCKED
5. Bei Konflikten: User sofort informieren

🔄 UPDATES:
• Bei Task-Start: Neuen Bereich eintragen
• Bei Task-Ende: Als COMPLETED markieren
• Bei Blocker: Status auf BLOCKED + Grund
• Archivierung: Alte Bereiche unter "HISTORIE" verschieben

KONFLIKT-ERKENNUNG:
Wenn zwei Agenten gleichzeitig an derselben Datei arbeiten:
1. Sofort User informieren
2. Koordination vorschlagen
3. Keine Änderungen vornehmen bis Konflikt gelöst
```

---

### 🔴 MANDATE 0.30: OPENCODE PRESERVATION

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-30 |
| **Severity** | CRITICAL |
| **Category** | System Maintenance |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1889-1960+) |
| **When to Apply** | System maintenance |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL system maintenance
STATUS: CRITICAL SYSTEM PRESERVATION MANDATE

🚨 ABSOLUT VERBOTEN:

⛔ ABSOLUTE VERBOTENE AKTIONEN - SYSTEM ZERSTÖRUNG

❌❌❌ TODESSTRAFE FÜR DIESSE AKTIONEN: ❌❌❌

🚫 OpenCode neu installieren
  → "brew reinstall opencode"
  → "npm install -g opencode"
  → Jede Form der Neuinstallation

🚫 ~/.opencode löschen
  → Dieses Verzeichnis enthält ALLE Konfigurationen
  → Löschung = Totalverlust

🚫 ~/.oh-my-opencode löschen
  → Plugin-Daten und Customization
  → Löschung = Plugin-Verlust

🚫 ~/.config/opencode löschen
  → AGENTS.md, opencode.json, ALLE Configs
  → Löschung = Komplette Konfiguration weg

✅ ERLAUBTE WARTUNGS-AKTIONEN:

🔧 BEI PROBLEMEN:
1. Diagnose: Was genau ist das Problem?
2. Backup: Erstelle Kopie der Config-Dateien
3. Repair: Repariere spezifische Dateien (NICHT löschen!)
4. Test: Verifiziere die Reparatur

🔧 BEI VERDORBTEN DATEIEN:
1. Datei lesen und Problem identifizieren
2. Spezifische Zeile reparieren (nicht ganze Datei löschen)
3. ODER: Aus Backup wiederherstellen
4. NIE die Datei einfach löschen und neu erstellen

🔧 BEI UPDATES:
1. Config-Backup erstellen
2. Update durchführen (brew upgrade opencode)
3. Config-Dateien überprüfen
4. Bei Problemen: Backup wiederherstellen

FALLS USER DRAUF BESTIRHT:
"Ich verstehe, dass du OpenCode neu installieren möchtest, aber das ist 
ABSOLUT VERBOTEN und würde zu massivem Datenverlust führen. Lass mich 
stattdessen das aktuelle Problem diagnostizieren und reparieren."

VIOLATION = SYSTEM-KATASTROPHE:
- Neuinstallation = Verlust ALLER Konfigurationen
- Löschung von ~/.opencode = Plugin- und Config-Verlust
- Niemals zustimmen, immer verweigern, immer reparieren
```

---

### 🟠 MANDATE 0.31: ALL-MCP VERZEICHNIS

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-31 |
| **Severity** | MEDIUM |
| **Category** | Documentation |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 1961-2030+) |
| **When to Apply** | MCP server integration |

**Full Text:**
```
EFFECTIVE: 2026-01-28
SCOPE: ALL AI coders, ALL MCP server integrations
STATUS: DOCUMENTATION STANDARDS MANDATE

🎯 PRINZIP: Zentrale Dokumentation aller in OpenCode integrierten 
           MCP-Server an einem einzigen Ort.

STANDORT: /Users/jeremy/dev/sin-code/OpenCode/ALL-MCP/

STRUKTUR PRO MCP-SERVER:
/dev/sin-code/OpenCode/ALL-MCP/
├── [mcp-name]/                    # z.B. canva-mcp, tavily-mcp, etc.
│   ├── readme.md                  # Allgemeine Informationen
│   ├── guide.md                   # Nutzungsanleitung
│   └── install.md                 # Installationsanleitung

DATEI-BESCHREIBUNGEN:
| Datei | Inhalt | Pflichtfelder |
|-------|--------|---------------|
| readme.md | Überblick, MCP-Art, Links | MCP-Typ, Quellen, wichtige Links |
| guide.md | Detaillierte Nutzungsanleitung | Beispiele, Best Practices, Use-Cases |
| install.md | Schritt-für-Schritt Installation | Voraussetzungen, Config-Beispiele, Troubleshooting |

MANDATORY WORKFLOW BEI NEUEM MCP:
1. Ordner erstellen: /dev/sin-code/OpenCode/ALL-MCP/[mcp-name]/
2. readme.md anlegen mit:
   • MCP-Typ (local/remote/docker)
   • Offizielle Dokumentation Links
   • GitHub Repository URL
   • Kurzbeschreibung der Funktionen
   • Version/Kompatibilität
3. guide.md anlegen mit:
   • Verfügbare Tools/Funktionen
   • Code-Beispiele für typische Use-Cases
   • Parameter-Beschreibungen
   • Best Practices 2026
   • Limitationen & Hinweise
4. install.md anlegen mit:
   • Voraussetzungen (Node.js Version, etc.)
   • opencode.json Config-Snippet
   • Environment Variables (falls nötig)
   • Schritt-für-Schritt Anleitung
   • Häufige Installationsprobleme & Lösungen
5. In AGENTS.md unter "Elite Guide References" verlinken

REGELN:
✅ Jeder MCP-Server MUSS in ALL-MCP dokumentiert werden
✅ 3 Dateien sind PFLICHT (readme.md, guide.md, install.md)
✅ Updates am MCP → SOFORT Dokumentation aktualisieren
✅ Links zu offiziellen Docs MÜSSEN funktionieren
✅ Installationsanleitung MUSS getestet sein
```

---

### 🟠 MANDATE 0.32: GITHUB TEMPLATES & REPOSITORY STANDARDS

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-32 |
| **Severity** | HIGH |
| **Category** | GitHub/Repository |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 2031-2200+) |
| **When to Apply** | Repository setup |

**Full Text:**
```
EFFECTIVE: 2026-01-29
SCOPE: ALL AI coders, ALL GitHub repositories
STATUS: REPOSITORY EXCELLENCE MANDATE

🎯 PRINZIP: Jedes Repository MUSS professionelle GitHub-Templates und CI/CD haben.

MANDATORY .github/ DIRECTORY STRUCTURE:

📂 .github/
├── 📂 ISSUE_TEMPLATE/
│   ├── bug_report.md           # Bug Report Template
│   ├── feature_request.md      # Feature Request Template
│   └── config.yml              # Issue Template Config
├── 📂 workflows/
│   ├── ci.yml                  # Continuous Integration
│   ├── release.yml             # Release Automation
│   ├── codeql.yml              # Security Scanning
│   └── dependabot-auto.yml     # Auto-merge Dependabot
├── PULL_REQUEST_TEMPLATE.md    # PR Template with Checklist
├── CODEOWNERS                  # Code Review Assignments
├── dependabot.yml              # Dependency Updates
├── FUNDING.yml                 # Sponsorship Links (optional)
└── SECURITY.md                 # Security Policy

📂 Root Files (MANDATORY):
├── CONTRIBUTING.md             # Contribution Guidelines
├── CODE_OF_CONDUCT.md          # Community Standards
└── LICENSE                     # License File (MIT/Apache/etc.)

MANDATORY COMPLIANCE CHECKLIST:

📋 Templates:
[ ] Bug report template created
[ ] Feature request template created
[ ] PR template with checklist created

📋 CI/CD:
[ ] CI workflow (lint, typecheck, test, build)
[ ] Release workflow (if applicable)
[ ] CodeQL security scanning
[ ] Dependabot configured

📋 Documentation:
[ ] CONTRIBUTING.md written
[ ] CODE_OF_CONDUCT.md present
[ ] LICENSE file present
[ ] SECURITY.md for vulnerability reporting

📋 Access Control:
[ ] CODEOWNERS file configured
[ ] Branch protection rules enabled
[ ] Required reviewers set

VIOLATIONS = REPOSITORY NICHT PRODUCTION-READY:
❌ Repository ohne Issue Templates = UNPROFESSIONELL
❌ Repository ohne CI/CD = DEPLOYMENT RISIKO
❌ Repository ohne CONTRIBUTING.md = CONTRIBUTOR BARRIERE
❌ Repository ohne Branch Protection = SECURITY RISIKO
```

---

### 🔴 MANDATE 0.33: DOCKER CONTAINER AS MCP

| Attribute | Value |
|-----------|-------|
| **ID** | MANDATE-33 |
| **Severity** | CRITICAL |
| **Category** | Docker/MCP Architecture |
| **Source** | `~/.config/opencode/AGENTS.md` (Line 2201-2400+) |
| **When to Apply** | Docker container MCP integration |

**Full Text:**
```
EFFECTIVE: 2026-01-29
SCOPE: ALL AI coders, ALL Docker containers requiring MCP integration
STATUS: CRITICAL ARCHITECTURE MANDATE

🎯 PRINZIP: Docker-Container sind HTTP APIs, KEINE nativen MCP Server. 
           Um sie als MCP zu nutzen, MUSS ein stdio-Wrapper erstellt werden.

📋 DAS PROBLEM:

❌ FALSCH:
Docker Container (HTTP API) ──X──► opencode.json als "remote" MCP
                                    (Funktioniert NICHT!)

✅ RICHTIG:
Docker Container (HTTP API) ──► MCP Wrapper (stdio) ──► opencode.json als "local" MCP
                                (Node.js/Python)         (Funktioniert!)

Warum funktioniert "remote" nicht?
- OpenCode erwartet stdio Kommunikation (stdin/stdout)
- Docker Container sind HTTP Services
- Kein nativer HTTP-Support in OpenCode MCP

🔧 DIE LÖSUNG: MCP WRAPPER PATTERN

Jeder Docker-Container-MCP benötigt:

┌─────────────────────────────────────────────────────────────────┐
│                    MCP WRAPPER ARCHITECTUR                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DOCKER CONTAINER (HTTP API)                                 │
│     └── Express/FastAPI Server                                  │
│     └── Port: 8xxx                                              │
│     └── Endpunkt: /api/...                                      │
│                                                                  │
│  2. MCP WRAPPER (stdio)                                         │
│     └── Wrapper Script (Node.js/Python)                         │
│     └── Konvertiert: stdio ↔ HTTP                               │
│     └── Located in: /mcp-wrappers/[name]-mcp-wrapper.js         │
│                                                                  │
│  3. OPENCODE CONFIG                                             │
│     └── Type: "local" (stdio)                                   │
│     └── Command: ["node", "wrapper.js"]                         │
│     └── Environment: API_URL, API_KEY                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

🚨 WICHTIGE REGELN:

| ❌ VERBOTEN | ✅ PFLICHT |
|-------------|-----------|
| Docker Container als `type: "remote"` in opencode.json | Wrapper als `type: "local"` (stdio) |
| Direkte HTTP URLs in opencode.json MCP config | Wrapper Script dazwischen |
| Hartkodierte IPs (172.20.0.x) | Service Names verwenden |
| Alles in eine docker-compose.yml | Jeder Container = eigene docker-compose.yml |

📖 MUST-READ DOCUMENTATION:

BEFORE working on Docker containers:

1. CONTAINER-REGISTRY.md (/Users/jeremy/dev/SIN-Solver/CONTAINER-REGISTRY.md)
   - Master list of ALL containers
   - Naming convention: {CATEGORY}-{NUMBER}-{INTEGRATION}-{ROLE}
   - Available port numbers
   - Public domain mappings

2. ARCHITECTURE-MODULAR.md (/Users/jeremy/dev/SIN-Solver/ARCHITECTURE-MODULAR.md)
   - Modular architecture guide
   - One container = one docker-compose.yml
   - Directory structure
   - Migration plan

3. MCP WRAPPERS README (/Users/jeremy/dev/SIN-Solver/mcp-wrappers/README.md)
   - How to create new wrappers
   - Examples and templates
   - Testing guidelines

⚡ WORKFLOW: Neuen Container als MCP Hinzufügen:

┌─────────────────────────────────────────────────────────────────┐
│  SCHRITTE FÜR NEUEN DOCKER-CONTAINER-MCP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. 📋 CONTAINER-REGISTRY.md lesen                               │
│     └── Verfügbare Nummer/Port prüfen                           │
│                                                                  │
│  2. 🏗️ Docker Verzeichnis erstellen                             │
│     └── Docker/{category}/{name}/docker-compose.yml             │
│                                                                  │
│  3. 🔧 Container bauen & testen                                  │
│     └── HTTP API Endpunkte definieren                           │
│                                                                  │
│  4. 📝 MCP Wrapper erstellen                                     │
│     └── mcp-wrappers/{name}-mcp-wrapper.js                      │
│                                                                  │
│  5. ⚙️ opencode.json konfigurieren                               │
│     └── Type: "local", Command: Wrapper-Pfad                    │
│                                                                  │
│  6. 🌐 Cloudflare config aktualisieren                           │
│     └── {name}.delqhi.com → container:port                      │
│                                                                  │
│  7. ✅ Testen                                                    │
│     └── opencode --version (sollte keinen Fehler zeigen)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

🎯 ZUSAMMENFASSUNG:

MERKE:
- Docker Container ≠ MCP Server
- Docker Container = HTTP API
- MCP Server = stdio Prozess
- Wrapper = Brücke zwischen beiden

ALLE Docker-Container in diesem Projekt MÜSSEN:
1. Modular sein (eigene docker-compose.yml)
2. Einen MCP Wrapper haben (für OpenCode Integration)
3. Eine delqhi.com URL haben (via Cloudflare)
4. In CONTAINER-REGISTRY.md dokumentiert sein
```

---

## BLUEPRINT 22 PILLARS REFERENCE

| Pillar | Name | Location | Purpose |
|--------|------|----------|---------|
| 01 | Executive Strategy | `01-strategy.md` | Market dominance, fiscal modeling, KPIs |
| 02 | Architecture | `02-architecture.md` | 17-Room distributed fortress |
| 03 | Vibe-Flow Manifesto | `03-vibe-coding.md` | 5-Agent cluster, anti-apology loops |
| 04 | Forensic Error Ledger | `04-forensic-ledger.md` | Error tracking, RCA |
| 05 | Infrastructure | `05-infrastructure.md` | Sovereign deployment |
| 06 | Scientific Code | `06-code-totality.md` | Code standards, patterns |
| 07 | Governance & Ethics | `07-governance.md` | Compliance, ethics |
| 08 | Troubleshooting | `08-troubleshooting.md` | Battle plan, runbooks |
| 09 | Design OS | `09-design-os-governance.md` | Design system |
| 10 | Zenflow & Swarm | `10-zenflow-orchestration.md` | Orchestration patterns |
| 11 | Neuro-Symbolic | `11-neuro-symbolic-logic.md` | Logic frameworks |
| 12 | Recursive Optimization | `12-recursive-optimization.md` | Self-improvement |
| 13 | Antigravity Kit | `13-antigravity-kit.md` | OAuth, models |
| 14 | Forensic Troubleshooting | `14-forensic-troubleshooting.md` | Deep diagnostics |
| 15 | Open Source | `15-os-stewardship.md` | OSS compliance |
| 16 | Singularity Native | `16-singularity-native.md` | Ralph-loop |
| 17 | Observability | `17-observability-governance.md` | Monitoring, financials |
| 18 | Cyber-Sovereignty | `18-cyber-sovereignty.md` | Security hardening |
| 19 | Conductor Tracks | `19-conductor-tracks.md` | 10-Phase plans |
| 20 | OpenCode Operations | `20-opencode-ops.md` | Recovery procedures |
| 21 | Agentic Ethics | `21-ethics-liability.md` | Liability, ethics |
| 22 | Docker Governance | `22-docker-governance.md` | Local Docker rules |

**Location:** `/Users/jeremy/dev/sin-code/Blueprint-drafts/`

---

## RULE APPLICATION MATRIX

### By Task Type

| Task Type | Critical Rules | High Priority | Medium Priority |
|-----------|---------------|---------------|-----------------|
| **New Project** | 0.0, 0.3, 0.5, 0.16 | 0.4, 0.8, 0.13, 0.22 | 0.14, 0.27, 0.28 |
| **Code Changes** | -6, -3, -2, -1, 0.0, 0.2 | 0.9, 0.11, 0.19, 0.25 | 0.10, 0.12, 0.20 |
| **Documentation** | -1.5, 0.0, 0.5, 0.16, 0.23 | 0.6, 0.22, 0.24 | 0.27, 0.31 |
| **Docker Work** | 0.0, 0.4, 0.33 | 0.13, 0.19 | 0.15 |
| **Git Operations** | -6, -5, 0.0 | 0.7, 0.10 | 0.32 |
| **Security** | 0.0, 0.21, 0.25 | 0.30 | - |
| **Troubleshooting** | 0.0, 0.6 | 0.24, 0.25 | - |

### By Frequency

| Frequency | Rules |
|-----------|-------|
| **Every Task** | -6, -3, -2, -1, 0.0, 0.2, 0.20, 0.25 |
| **Every Session** | -1.5, -4, 0.23 |
| **Every Project** | 0.3, 0.5, 0.16, 0.22 |
| **Every Commit** | -6, 0.10 |
| **When Needed** | 0.6, 0.7, 0.21, 0.24, 0.28, 0.33 |

---

## STATISTICS

| Metric | Count |
|--------|-------|
| **Total Rules** | 40 (6 numbered + 33 mandates + 1 blueprint) |
| **Critical Severity** | 23 |
| **High Severity** | 11 |
| **Medium Severity** | 6 |
| **Low Severity** | 0 |
| **Categories** | 12 |
| **Source Files** | 3 |

---

## MAINTENANCE NOTES

**Last Updated:** 2026-01-29  
**Updated By:** sisyphus-junior  
**Version:** 1.0  

**Update Protocol:**
1. When new rules are added to AGENTS.md, update this index
2. Follow MANDATE 0.0: Append-only, never delete
3. Update statistics section
4. Update application matrix if needed
5. Commit with message: `docs: Update RULES-MASTER-INDEX with new rules`

---

*"Omniscience is the result of perfect documentation. If the system knows everything about itself, it cannot fail."*
