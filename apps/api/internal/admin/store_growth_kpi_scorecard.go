package admin

import (
	"context"
	"time"
)

func (s *Store) GetKPIScorecard(ctx context.Context) ([]map[string]any, error) {
	items := make([]map[string]any, 0, 6)

	paymentToSupplier, err := s.paymentToSupplierRate(ctx)
	if err != nil {
		return nil, err
	}
	items = append(items, scoreItem("payment_to_supplier_order_placed", paymentToSupplier, 98.5, "%", ">="))

	paymentToMail, err := s.paymentToConfirmationMailRate(ctx)
	if err != nil {
		return nil, err
	}
	items = append(items, scoreItem("payment_to_order_confirmation_email_sent", paymentToMail, 99.0, "%", ">="))

	criticalDLQ, err := s.criticalDLQ24h(ctx)
	if err != nil {
		return nil, err
	}
	items = append(items, scoreItem("critical_dlq_24h", criticalDLQ, 0, "count", "=="))

	matchRate, err := s.channelEventMatchRate(ctx)
	if err != nil {
		return nil, err
	}
	items = append(items, scoreItem("channel_event_match_rate", matchRate, 90.0, "%", ">="))

	latencyP95, err := s.adminToChannelLatencyP95(ctx)
	if err != nil {
		return nil, err
	}
	items = append(items, scoreItem("admin_action_to_channel_effect_latency_p95", latencyP95, 2.0, "minutes", "<="))

	return items, nil
}

func scoreItem(name string, current, target float64, unit, comparator string) map[string]any {
	ok := false
	switch comparator {
	case ">=":
		ok = current >= target
	case "<=":
		ok = current <= target
	case "==":
		ok = current == target
	}
	return map[string]any{
		"metric":     name,
		"current":    round2(current),
		"target":     target,
		"unit":       unit,
		"comparator": comparator,
		"ok":         ok,
		"updated_at": time.Now().UTC(),
	}
}
