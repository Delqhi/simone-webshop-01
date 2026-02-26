# World-Best Go-Live Plan (Faktenbasiert)

Stand: **26.02.2026**

## Zieldefinition

\"Weltbester Shop\" wird in diesem Projekt ausschliesslich als messbarer Zielzustand verwendet, nicht als Marketingbehauptung.

## Harte KPI-Gates

1. `payment -> supplier_order_placed >= 98.5%`
2. `payment -> order_confirmation_email_sent >= 99%`
3. `critical DLQ = 0` (rolling 24h)
4. `channel event match rate >= 90%`
5. `admin action -> channel effect latency p95 < 2 min`
6. keine Doppelmutation in Replay-Tests (Payment/Invoice/Supplier)

## Umsetzungsbloecke mit Exit-Gates

1. Block A: Core-Haertung
   - Idempotenz-/Replay-Sicherheit fuer Payment, Invoice, Supplier-Dispatch
   - Exit: Replay-Tests gruen, keine Doppelmutation
2. Block B: Trend-Engine
   - Cross-Category Trend-Ingestion und Policy-Matrix (allow/review/deny)
   - Exit: Candidate->Approve->Launch laeuft ohne manuelle SQL
3. Block C: Channel-Livebetrieb
   - TikTok, Meta, YouTube/Google, Pinterest, Snapchat produktionsnah verbinden
   - Exit: Connect + Catalog Sync + Campaign Publish + Conversion ingest je Kanal
4. Block D: Creative/Creator/Affiliate
   - Assets, Creator-Scoring, Provisionslogik, Conversion-Pfad
   - Exit: vollstaendige Kampagnensteuerung im Admin
5. Block E: Profit-Control
   - Attribution + Budget-Policy + Revenue-Forecast im Admin
   - Exit: MER/ROAS/CAC Guardrails aktiv und alert-faehig
6. Block F: Autonomous Optimization
   - Auto-scale winners, auto-pause losers, compliance-safe publish
   - Exit: 7 Tage stabiler autonomer Lauf ohne kritische Incidents

## No-Lie Regel

Jede Aussage in Statusreports muss als `CODE`, `METRIC` oder `SOURCE` belegbar sein.
