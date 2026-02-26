package worker

import "testing"

func TestResolveChannelEndpoint(t *testing.T) {
	auth := map[string]any{
		"api_base_url":              "https://api.example.com",
		"catalog_sync_endpoint":     "https://sync.example.com/catalog",
		"campaign_publish_endpoint": "https://sync.example.com/campaigns",
	}
	if got := resolveChannelEndpoint("catalog", auth); got != "https://sync.example.com/catalog" {
		t.Fatalf("unexpected catalog endpoint: %q", got)
	}
	if got := resolveChannelEndpoint("campaign_publish", auth); got != "https://sync.example.com/campaigns" {
		t.Fatalf("unexpected campaign endpoint: %q", got)
	}
	delete(auth, "campaign_publish_endpoint")
	if got := resolveChannelEndpoint("campaign_publish", auth); got != "https://api.example.com/campaigns/publish" {
		t.Fatalf("unexpected fallback campaign endpoint: %q", got)
	}
}

func TestExtractChannelAccessToken(t *testing.T) {
	auth := map[string]any{"api_key": "key-123"}
	if got := extractChannelAccessToken(auth); got != "key-123" {
		t.Fatalf("unexpected api_key token: %q", got)
	}
	auth["access_token"] = "access-456"
	if got := extractChannelAccessToken(auth); got != "access-456" {
		t.Fatalf("unexpected access_token preference: %q", got)
	}
}

func TestExtractExternalCampaignID(t *testing.T) {
	payload := map[string]any{
		"provider_result": map[string]any{"campaign_id": "cmp_abc"},
	}
	if got := extractExternalCampaignID(payload); got != "cmp_abc" {
		t.Fatalf("unexpected campaign id: %q", got)
	}
}
