package admin

import "testing"

func TestIsAllowedKillSwitchDomain(t *testing.T) {
	if !isAllowedKillSwitchDomain("campaign_publish") {
		t.Fatalf("expected campaign_publish to be allowed")
	}
	if isAllowedKillSwitchDomain("unknown") {
		t.Fatalf("expected unknown domain to be rejected")
	}
}
