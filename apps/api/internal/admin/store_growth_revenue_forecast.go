package admin

import (
	"context"
	"strings"
	"time"
)

func (s *Store) GetRevenueForecastPolicy(ctx context.Context) (RevenueForecastPolicy, error) {
	settings, err := s.GetSettings(ctx)
	if err != nil {
		return RevenueForecastPolicy{}, err
	}
	raw, _ := settings["revenue_forecast_policy"].(map[string]any)
	policy := defaultRevenueForecastPolicy()
	policy = mergeRevenueForecastPolicy(policy, raw)
	return policy, nil
}

func (s *Store) UpdateRevenueForecastPolicy(ctx context.Context, patch map[string]any) (RevenueForecastPolicy, error) {
	current, err := s.GetRevenueForecastPolicy(ctx)
	if err != nil {
		return RevenueForecastPolicy{}, err
	}
	next := mergeRevenueForecastPolicy(current, patch)
	now := time.Now().UTC()
	next.UpdatedAt = now

	_, err = s.UpdateSettings(ctx, map[string]any{
		"revenue_forecast_policy": map[string]any{
			"currency":     next.Currency,
			"conservative": revenueScenarioMap(next.Conservative),
			"base":         revenueScenarioMap(next.Base),
			"scale":        revenueScenarioMap(next.Scale),
			"updated_at":   now.Format(time.RFC3339),
		},
	})
	if err != nil {
		return RevenueForecastPolicy{}, err
	}
	return next, nil
}

func (s *Store) GetRevenueForecast(ctx context.Context, scenario string) (RevenueForecastResult, error) {
	scenario = strings.ToLower(strings.TrimSpace(scenario))
	if scenario == "" {
		scenario = "base"
	}
	policy, err := s.GetRevenueForecastPolicy(ctx)
	if err != nil {
		return RevenueForecastResult{}, err
	}

	inputs, ok := pickRevenueScenario(policy, scenario)
	if !ok {
		return RevenueForecastResult{}, errInvalidInput
	}

	paidClicks := safeDivide(inputs.AdSpend, maxFloat(inputs.CPC, 0.01))
	organicSessions := paidClicks * (maxFloat(inputs.OrganicLiftPct, 0) / 100.0)
	totalSessions := paidClicks + organicSessions
	orders := totalSessions * (clamp(inputs.CVR, 0, 100) / 100.0)
	gmv := orders * maxFloat(inputs.AOV, 0)

	result := RevenueForecastResult{
		Scenario:        scenario,
		Currency:        policy.Currency,
		Inputs:          inputs,
		PaidClicks:      round2(paidClicks),
		OrganicSessions: round2(organicSessions),
		TotalSessions:   round2(totalSessions),
		Orders:          round2(orders),
		GMV:             round2(gmv),
		MER:             round2(safeDivide(gmv, inputs.AdSpend)),
		CAC:             round2(safeDivide(inputs.AdSpend, orders)),
		UpdatedAt:       time.Now().UTC(),
	}
	return result, nil
}
