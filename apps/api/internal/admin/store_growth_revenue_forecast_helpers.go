package admin

import (
	"math"
	"strings"
	"time"
)

func defaultRevenueForecastPolicy() RevenueForecastPolicy {
	return RevenueForecastPolicy{
		Currency: "EUR",
		Conservative: RevenueForecastScenario{
			AdSpend:        50000,
			CPC:            0.90,
			OrganicLiftPct: 20,
			CVR:            2.0,
			AOV:            65,
		},
		Base: RevenueForecastScenario{
			AdSpend:        100000,
			CPC:            0.70,
			OrganicLiftPct: 35,
			CVR:            2.4,
			AOV:            72,
		},
		Scale: RevenueForecastScenario{
			AdSpend:        150000,
			CPC:            0.55,
			OrganicLiftPct: 60,
			CVR:            2.8,
			AOV:            78,
		},
		UpdatedAt: time.Now().UTC(),
	}
}

func mergeRevenueForecastPolicy(base RevenueForecastPolicy, patch map[string]any) RevenueForecastPolicy {
	if patch == nil {
		return base
	}
	if v := strings.TrimSpace(strings.ToUpper(asString(patch["currency"]))); v != "" {
		base.Currency = v
	}
	if raw, ok := patch["conservative"].(map[string]any); ok {
		base.Conservative = mergeRevenueScenario(base.Conservative, raw)
	}
	if raw, ok := patch["base"].(map[string]any); ok {
		base.Base = mergeRevenueScenario(base.Base, raw)
	}
	if raw, ok := patch["scale"].(map[string]any); ok {
		base.Scale = mergeRevenueScenario(base.Scale, raw)
	}
	base.UpdatedAt = time.Now().UTC()
	return base
}

func mergeRevenueScenario(base RevenueForecastScenario, patch map[string]any) RevenueForecastScenario {
	if patch == nil {
		return base
	}
	if v, ok := patch["ad_spend"]; ok {
		base.AdSpend = maxFloat(asFloat(v, base.AdSpend), 0)
	}
	if v, ok := patch["cpc"]; ok {
		base.CPC = maxFloat(asFloat(v, base.CPC), 0.01)
	}
	if v, ok := patch["organic_lift_pct"]; ok {
		base.OrganicLiftPct = maxFloat(asFloat(v, base.OrganicLiftPct), 0)
	}
	if v, ok := patch["cvr"]; ok {
		base.CVR = clamp(asFloat(v, base.CVR), 0, 100)
	}
	if v, ok := patch["aov"]; ok {
		base.AOV = maxFloat(asFloat(v, base.AOV), 0)
	}
	return base
}

func pickRevenueScenario(policy RevenueForecastPolicy, scenario string) (RevenueForecastScenario, bool) {
	switch scenario {
	case "conservative":
		return policy.Conservative, true
	case "base":
		return policy.Base, true
	case "scale":
		return policy.Scale, true
	default:
		return RevenueForecastScenario{}, false
	}
}

func revenueScenarioMap(in RevenueForecastScenario) map[string]any {
	return map[string]any{
		"ad_spend":         in.AdSpend,
		"cpc":              in.CPC,
		"organic_lift_pct": in.OrganicLiftPct,
		"cvr":              in.CVR,
		"aov":              in.AOV,
	}
}

func safeDivide(num, den float64) float64 {
	if den <= 0 {
		return 0
	}
	return num / den
}

func round2(v float64) float64 {
	return math.Round(v*100) / 100
}

func clamp(v, minV, maxV float64) float64 {
	if v < minV {
		return minV
	}
	if v > maxV {
		return maxV
	}
	return v
}

func maxFloat(v, minV float64) float64 {
	if v < minV {
		return minV
	}
	return v
}
