package admin

import "testing"

func TestNormalizeChannelAuthSnapshotAcceptsBaseURL(t *testing.T) {
	auth, err := normalizeChannelAuthSnapshot("tiktok", map[string]any{
		"api_base_url": "https://api.example.com/",
		"api_key":      "secret",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if auth["access_token"] != "secret" {
		t.Fatalf("expected access_token fallback, got %#v", auth["access_token"])
	}
	if auth["catalog_sync_endpoint"] != "https://api.example.com/catalog/sync" {
		t.Fatalf("unexpected catalog endpoint: %#v", auth["catalog_sync_endpoint"])
	}
	if auth["campaign_publish_endpoint"] != "https://api.example.com/campaigns/publish" {
		t.Fatalf("unexpected campaign endpoint: %#v", auth["campaign_publish_endpoint"])
	}
}

func TestNormalizeChannelAuthSnapshotRejectsMissingToken(t *testing.T) {
	_, err := normalizeChannelAuthSnapshot("meta", map[string]any{
		"api_base_url": "https://api.example.com",
	})
	if err == nil {
		t.Fatalf("expected token validation error")
	}
}

func TestNormalizeChannelAuthSnapshotRejectsInvalidEndpoint(t *testing.T) {
	_, err := normalizeChannelAuthSnapshot("meta", map[string]any{
		"access_token":              "token",
		"catalog_sync_endpoint":     "http://insecure.example.com/catalog",
		"campaign_publish_endpoint": "https://api.example.com/campaigns",
	})
	if err == nil {
		t.Fatalf("expected invalid endpoint error")
	}
}

func TestChannelProfileHasRequiredFields(t *testing.T) {
	profile := channelProfile("youtube_google")
	if len(profile.RequiredAuthFields) == 0 {
		t.Fatalf("expected required fields for channel profile")
	}
}
