package worker

import (
	"encoding/json"
	"fmt"
	"strings"
)

func orderIDFromPayload(job Job) (string, map[string]any, error) {
	payload, err := payloadMap(job.Payload)
	if err != nil {
		return "", nil, fmt.Errorf("%w: invalid payload", ErrPermanent)
	}

	rawOrderID := asString(payload["order_id"])
	if rawOrderID == "" {
		rawOrderID = asString(payload["orderId"])
	}
	if rawOrderID == "" {
		rawOrderID = normalizeUUID(job.DedupeKey)
	}
	if rawOrderID == "" {
		return "", nil, fmt.Errorf("%w: missing order id", ErrPermanent)
	}
	orderID := normalizeUUID(rawOrderID)
	if orderID == "" {
		return "", nil, fmt.Errorf("%w: invalid order id", ErrPermanent)
	}

	return orderID, payload, nil
}

func mustJSON(raw map[string]any) string {
	body, err := json.Marshal(raw)
	if err != nil {
		return "{}"
	}
	return string(body)
}

func sanitizeIdentifier(raw, fallback string) string {
	value := strings.TrimSpace(raw)
	if value == "" {
		return fallback
	}
	return value
}

func fullNameFromShipping(address map[string]any) string {
	first := strings.TrimSpace(asString(address["first_name"]))
	last := strings.TrimSpace(asString(address["last_name"]))
	name := strings.TrimSpace(strings.Join([]string{first, last}, " "))
	if name == "" {
		return "Kunde"
	}
	return name
}
