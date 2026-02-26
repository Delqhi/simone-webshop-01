package admin

import "testing"

func TestPickRevenueScenario(t *testing.T) {
	policy := defaultRevenueForecastPolicy()

	base, ok := pickRevenueScenario(policy, "base")
	if !ok {
		t.Fatalf("expected base scenario to exist")
	}
	if base.AdSpend != 100000 {
		t.Fatalf("expected base ad spend 100000, got %v", base.AdSpend)
	}

	_, ok = pickRevenueScenario(policy, "unknown")
	if ok {
		t.Fatalf("expected unknown scenario to be rejected")
	}
}

func TestMergeRevenueForecastPolicyPatch(t *testing.T) {
	current := defaultRevenueForecastPolicy()
	next := mergeRevenueForecastPolicy(current, map[string]any{
		"currency": "usd",
		"base": map[string]any{
			"cpc": 0.5,
			"cvr": 3.1,
			"aov": 88.0,
		},
	})

	if next.Currency != "USD" {
		t.Fatalf("expected currency USD, got %s", next.Currency)
	}
	if next.Base.CPC != 0.5 {
		t.Fatalf("expected cpc 0.5, got %v", next.Base.CPC)
	}
	if next.Base.CVR != 3.1 {
		t.Fatalf("expected cvr 3.1, got %v", next.Base.CVR)
	}
	if next.Base.AOV != 88.0 {
		t.Fatalf("expected aov 88.0, got %v", next.Base.AOV)
	}
}

func TestMergeRevenueScenarioBounds(t *testing.T) {
	base := RevenueForecastScenario{
		AdSpend:        1000,
		CPC:            0.7,
		OrganicLiftPct: 35,
		CVR:            2.4,
		AOV:            70,
	}
	next := mergeRevenueScenario(base, map[string]any{
		"ad_spend":         -1,
		"cpc":              0,
		"organic_lift_pct": -8,
		"cvr":              300,
		"aov":              -9,
	})

	if next.AdSpend != 0 {
		t.Fatalf("expected ad_spend clamp to 0, got %v", next.AdSpend)
	}
	if next.CPC != 0.01 {
		t.Fatalf("expected cpc clamp to 0.01, got %v", next.CPC)
	}
	if next.OrganicLiftPct != 0 {
		t.Fatalf("expected organic_lift_pct clamp to 0, got %v", next.OrganicLiftPct)
	}
	if next.CVR != 100 {
		t.Fatalf("expected cvr clamp to 100, got %v", next.CVR)
	}
	if next.AOV != 0 {
		t.Fatalf("expected aov clamp to 0, got %v", next.AOV)
	}
}
