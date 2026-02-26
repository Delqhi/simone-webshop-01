package admin

import (
	"context"
	"time"
)

func (s *Store) GetTrendPolicy(ctx context.Context) (TrendPolicy, error) {
	settings, err := s.GetSettings(ctx)
	if err != nil {
		return TrendPolicy{}, err
	}
	raw, _ := settings["trend_policy"].(map[string]any)
	policy := defaultTrendPolicy()
	policy = mergeTrendPolicy(policy, raw)
	categoryPolicies, err := s.listCategoryPolicies(ctx)
	if err != nil {
		return TrendPolicy{}, err
	}
	policy.CategoryPolicies = categoryPolicies
	return policy, nil
}

func (s *Store) UpdateTrendPolicy(ctx context.Context, patch map[string]any) (TrendPolicy, error) {
	current, err := s.GetTrendPolicy(ctx)
	if err != nil {
		return TrendPolicy{}, err
	}
	next := mergeTrendPolicy(current, patch)
	_, err = s.UpdateSettings(ctx, map[string]any{
		"trend_policy": map[string]any{
			"default_decision": next.DefaultDecision,
			"country_defaults": next.CountryDefaults,
			"channel_defaults": next.ChannelDefaults,
			"updated_at":       time.Now().UTC().Format(time.RFC3339),
		},
	})
	if err != nil {
		return TrendPolicy{}, err
	}
	if rules := parseCategoryPoliciesPatch(patch["category_policies"]); len(rules) > 0 {
		if err := s.upsertCategoryPolicies(ctx, rules); err != nil {
			return TrendPolicy{}, err
		}
		next.CategoryPolicies, err = s.listCategoryPolicies(ctx)
		if err != nil {
			return TrendPolicy{}, err
		}
	}
	next.UpdatedAt = time.Now().UTC()
	return next, nil
}

func defaultTrendPolicy() TrendPolicy {
	return TrendPolicy{
		DefaultDecision: "review_required",
		CountryDefaults: map[string]any{
			"DE": "allow",
			"US": "allow",
		},
		ChannelDefaults: map[string]any{
			"tiktok":         "allow",
			"meta":           "allow",
			"youtube_google": "review_required",
			"pinterest":      "review_required",
			"snapchat":       "review_required",
		},
		CategoryPolicies: []CategoryPolicyRule{},
		UpdatedAt:        time.Now().UTC(),
	}
}

func mergeTrendPolicy(base TrendPolicy, patch map[string]any) TrendPolicy {
	if patch == nil {
		return base
	}
	if v := asString(patch["default_decision"]); v != "" {
		base.DefaultDecision = v
	}
	if m, ok := patch["country_defaults"].(map[string]any); ok {
		base.CountryDefaults = mergeStringAnyMap(base.CountryDefaults, m)
	}
	if m, ok := patch["channel_defaults"].(map[string]any); ok {
		base.ChannelDefaults = mergeStringAnyMap(base.ChannelDefaults, m)
	}
	base.UpdatedAt = time.Now().UTC()
	return base
}

func mergeStringAnyMap(base, patch map[string]any) map[string]any {
	out := map[string]any{}
	for k, v := range base {
		out[k] = v
	}
	for k, v := range patch {
		out[k] = v
	}
	return out
}
