package admin

import "context"

func (s *Store) SetGrowthKillSwitch(ctx context.Context, domain string, enabled bool) (map[string]any, error) {
	if !isAllowedKillSwitchDomain(domain) {
		return nil, errInvalidInput
	}
	settings, err := s.GetSettings(ctx)
	if err != nil {
		return nil, err
	}
	switches := map[string]any{}
	if raw, ok := settings["growth_kill_switch"].(map[string]any); ok {
		for k, v := range raw {
			switches[k] = v
		}
	}
	switches[domain] = enabled
	_, err = s.UpdateSettings(ctx, map[string]any{
		"growth_kill_switch": switches,
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{"domain": domain, "enabled": enabled, "switches": switches}, nil
}

func (s *Store) isGrowthKillSwitchEnabled(ctx context.Context, domain string) (bool, error) {
	settings, err := s.GetSettings(ctx)
	if err != nil {
		return false, err
	}
	switches, _ := settings["growth_kill_switch"].(map[string]any)
	value, ok := switches[domain]
	if !ok {
		return false, nil
	}
	return asBool(value, false), nil
}

func isAllowedKillSwitchDomain(domain string) bool {
	switch domain {
	case "checkout", "channel_sync", "campaign_publish", "creator_payouts":
		return true
	default:
		return false
	}
}
