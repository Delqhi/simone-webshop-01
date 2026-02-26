# Channel Connect Playbook (Admin)

Dieses Dokument beschreibt die produktionsrelevante Konfiguration für:

- `POST /api/v1/admin/channels/{channel}/connect/start`
- `POST /api/v1/admin/channels/{channel}/connect/complete`
- `POST /api/v1/admin/channels/{channel}/catalog/sync`
- `POST /api/v1/admin/channels/{channel}/campaigns/publish`

## Unterstützte Channels

- `tiktok`
- `meta`
- `youtube_google`
- `pinterest`
- `snapchat`

## connect/start Antwort

`connect/start` liefert:

- `state_token`
- `required_auth_fields`
- `optional_auth_fields`

Diese Felder sind die verbindliche Vorlage für `auth_snapshot`.

## connect/complete Payload

Beispiel:

```json
{
  "state_token": "STATE_FROM_CONNECT_START",
  "account_external_id": "acct_123",
  "auth_snapshot": {
    "account_name": "default",
    "access_token": "secret-token",
    "api_base_url": "https://provider.example.com"
  },
  "health_snapshot": {
    "status": "healthy",
    "last_check": "2026-02-26T12:00:00Z"
  }
}
```

## Validierungsregeln (hart)

- Token muss vorhanden sein: `access_token` oder `api_token` oder `api_key`
- Endpunkte müssen vorhanden sein:
  - entweder `api_base_url`
  - oder beide: `catalog_sync_endpoint` und `campaign_publish_endpoint`
- Endpunkte müssen `https://` verwenden
- fehlende Endpunkte werden aus `api_base_url` ergänzt:
  - `/catalog/sync`
  - `/campaigns/publish`

Bei Verstoß liefert `connect/complete` `400` mit einem präzisen Fehlercode:

- `missing_channel_access_token`
- `missing_channel_endpoints`
- `invalid_channel_endpoint`

## Laufzeitverhalten Worker

- `catalog/sync` und `campaigns/publish` rufen echte Provider-Endpunkte auf
- 4xx (außer 429) gelten als permanent und gehen in Permanent-Error-Handling
- 5xx/429 gehen in Retry/Backoff
- bei Max-Attempts: DLQ + Incident-Eintrag
