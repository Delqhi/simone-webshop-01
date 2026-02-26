package admin

import (
	"context"
	"encoding/json"
)

func (s *Store) GetAutomationPolicy(ctx context.Context) (AutomationPolicy, error) {
	settings, err := s.GetSettings(ctx)
	if err != nil {
		return AutomationPolicy{}, err
	}
	return policyFromSettings(settings), nil
}

func (s *Store) UpdateAutomationPolicy(ctx context.Context, patch map[string]any) (AutomationPolicy, error) {
	current, err := s.GetAutomationPolicy(ctx)
	if err != nil {
		return AutomationPolicy{}, err
	}
	next := mergePolicyPatch(current, patch)
	blob, err := json.Marshal(next)
	if err != nil {
		return AutomationPolicy{}, err
	}
	_, err = s.UpdateSettings(ctx, map[string]any{
		"automation_policy": json.RawMessage(blob),
	})
	if err != nil {
		return AutomationPolicy{}, err
	}
	return next, nil
}

func policyFromSettings(settings map[string]any) AutomationPolicy {
	policyRaw, _ := settings["automation_policy"].(map[string]any)
	return mergePolicyPatch(defaultAutomationPolicy(), policyRaw)
}

func defaultAutomationPolicy() AutomationPolicy {
	return AutomationPolicy{
		CatalogEnabled:             true,
		CheckoutEnabled:            true,
		SupplierFulfillmentEnabled: true,
		MailingEnabled:             true,
		MaxRetryAttempts:           10,
		AlertThresholdMinutes:      20,
	}
}

func mergePolicyPatch(base AutomationPolicy, patch map[string]any) AutomationPolicy {
	if patch == nil {
		return base
	}
	if v, ok := patch["catalog_enabled"]; ok {
		base.CatalogEnabled = toBool(v, base.CatalogEnabled)
	}
	if v, ok := patch["checkout_enabled"]; ok {
		base.CheckoutEnabled = toBool(v, base.CheckoutEnabled)
	}
	if v, ok := patch["supplier_fulfillment_enabled"]; ok {
		base.SupplierFulfillmentEnabled = toBool(v, base.SupplierFulfillmentEnabled)
	}
	if v, ok := patch["mailing_enabled"]; ok {
		base.MailingEnabled = toBool(v, base.MailingEnabled)
	}
	if v, ok := patch["max_retry_attempts"]; ok {
		base.MaxRetryAttempts = clampInt(toInt(v, base.MaxRetryAttempts), 1, 30)
	}
	if v, ok := patch["alert_threshold_minutes"]; ok {
		base.AlertThresholdMinutes = clampInt(toInt(v, base.AlertThresholdMinutes), 1, 240)
	}
	return base
}

func toBool(raw any, fallback bool) bool {
	v, ok := raw.(bool)
	if !ok {
		return fallback
	}
	return v
}

func toInt(raw any, fallback int) int {
	switch v := raw.(type) {
	case int:
		return v
	case int64:
		return int(v)
	case float64:
		return int(v)
	default:
		return fallback
	}
}

func clampInt(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}
