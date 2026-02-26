package admin

import "testing"

func TestMergeTrendPolicyAppliesPatch(t *testing.T) {
	base := defaultTrendPolicy()
	updated := mergeTrendPolicy(base, map[string]any{
		"default_decision": "allow",
		"country_defaults": map[string]any{"US": "review_required"},
	})
	if updated.DefaultDecision != "allow" {
		t.Fatalf("expected default decision allow, got %q", updated.DefaultDecision)
	}
	if updated.CountryDefaults["US"] != "review_required" {
		t.Fatalf("expected patched country decision, got %#v", updated.CountryDefaults["US"])
	}
}

func TestParseCategoryPoliciesPatch(t *testing.T) {
	input := []any{
		map[string]any{
			"category_key": "electronics",
			"country":      "de",
			"channel":      "tiktok",
			"policy_state": "deny",
			"reason":       "platform limit",
		},
		map[string]any{
			"category_key": "",
			"policy_state": "allow",
		},
	}
	rules := parseCategoryPoliciesPatch(input)
	if len(rules) != 1 {
		t.Fatalf("expected 1 valid rule, got %d", len(rules))
	}
	if rules[0].CategoryKey != "electronics" || rules[0].Country != "DE" || rules[0].Channel != "tiktok" || rules[0].PolicyState != "deny" {
		t.Fatalf("unexpected parsed rule: %#v", rules[0])
	}
}
