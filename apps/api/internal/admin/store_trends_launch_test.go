package admin

import "testing"

func TestNormalizeChannelsFiltersAndDedupes(t *testing.T) {
	in := []string{" tiktok ", "meta", "meta", "unknown", "snapchat"}
	got := normalizeChannels(in)
	if len(got) != 3 {
		t.Fatalf("expected 3 channels, got %d", len(got))
	}
	if got[0] != "tiktok" || got[1] != "meta" || got[2] != "snapchat" {
		t.Fatalf("unexpected normalized channels: %#v", got)
	}
}

func TestNormalizeCountryScope(t *testing.T) {
	got := normalizeCountryScope([]string{"de", "US", "de", "  ", "at"})
	if len(got) != 3 {
		t.Fatalf("expected 3 countries, got %d", len(got))
	}
	if got[0] != "DE" || got[1] != "US" || got[2] != "AT" {
		t.Fatalf("unexpected normalized countries: %#v", got)
	}
}

func TestResolveTrendDecision(t *testing.T) {
	decision := resolveTrendDecision("allow", map[string]any{"DE": "allow"}, map[string]any{"tiktok": "deny"}, "DE", "tiktok")
	if decision != "deny" {
		t.Fatalf("expected deny, got %q", decision)
	}
	decision = resolveTrendDecision("allow", map[string]any{"DE": "review_required"}, map[string]any{}, "DE", "meta")
	if decision != "review_required" {
		t.Fatalf("expected review_required, got %q", decision)
	}
	decision = resolveTrendDecision("review_required", map[string]any{}, map[string]any{}, "US", "meta")
	if decision != "review_required" {
		t.Fatalf("expected default review_required, got %q", decision)
	}
}
