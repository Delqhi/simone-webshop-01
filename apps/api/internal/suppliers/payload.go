package suppliers

import (
	"encoding/json"
	"fmt"
	"strings"
)

func decodeWebhookPayload(raw []byte) (webhookPayload, error) {
	input := map[string]any{}
	if err := json.Unmarshal(raw, &input); err != nil {
		return webhookPayload{}, err
	}

	payload := webhookPayload{
		EventID:         firstValue(input, "event_id", "eventId", "id"),
		OrderID:         firstValue(input, "order_id", "orderId"),
		Status:          firstValue(input, "status"),
		TrackingNumber:  firstValue(input, "tracking_number", "trackingNumber"),
		TrackingURL:     firstValue(input, "tracking_url", "trackingUrl"),
		ExternalOrderID: firstValue(input, "external_order_id", "externalOrderId"),
		Raw:             input,
	}

	if strings.TrimSpace(payload.OrderID) == "" {
		return webhookPayload{}, fmt.Errorf("missing_order_id")
	}
	if strings.TrimSpace(payload.Status) == "" {
		return webhookPayload{}, fmt.Errorf("missing_status")
	}
	return payload, nil
}

func firstValue(input map[string]any, keys ...string) string {
	for _, key := range keys {
		if raw, ok := input[key]; ok {
			if s, ok := raw.(string); ok && strings.TrimSpace(s) != "" {
				return strings.TrimSpace(s)
			}
		}
	}
	return ""
}
