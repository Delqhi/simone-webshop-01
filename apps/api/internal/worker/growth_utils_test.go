package worker

import "testing"

func TestKillSwitchDomain(t *testing.T) {
	if got := killSwitchDomain("campaign_publish"); got != "campaign_publish" {
		t.Fatalf("expected campaign_publish, got %q", got)
	}
	if got := killSwitchDomain("catalog"); got != "channel_sync" {
		t.Fatalf("expected channel_sync, got %q", got)
	}
}
