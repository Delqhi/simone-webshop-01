package checkout

import (
	"encoding/json"
	"io"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v82"
)

func (h *Handler) StripeWebhook(c *gin.Context) {
	if strings.TrimSpace(h.options.StripeWebhookKey) == "" {
		c.JSON(500, gin.H{"error": "stripe_webhook_not_configured"})
		return
	}
	rawBody, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid_body"})
		return
	}
	signature := strings.TrimSpace(c.GetHeader("Stripe-Signature"))
	event, err := verifyStripeSignature(rawBody, signature, h.options.StripeWebhookKey)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid_stripe_signature"})
		return
	}

	envelope, handled, err := buildStripeEventEnvelope(event, rawBody)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid_stripe_event_payload"})
		return
	}
	if !handled {
		c.JSON(200, gin.H{"status": "ignored", "event_type": string(event.Type)})
		return
	}

	duplicate, err := h.store.ProcessStripeEvent(c.Request.Context(), envelope)
	if err != nil {
		c.JSON(500, gin.H{"error": "stripe_webhook_processing_failed"})
		return
	}
	if duplicate {
		c.JSON(200, gin.H{"status": "duplicate", "provider": "stripe"})
		return
	}
	c.JSON(200, gin.H{"status": "processed", "provider": "stripe"})
}

func buildStripeEventEnvelope(event stripe.Event, payload []byte) (StripeEventEnvelope, bool, error) {
	eventType := string(event.Type)
	if !isHandledStripeEventType(eventType) {
		return StripeEventEnvelope{}, false, nil
	}
	if event.Data == nil {
		return StripeEventEnvelope{}, false, io.EOF
	}
	var data map[string]any
	if err := json.Unmarshal(event.Data.Raw, &data); err != nil {
		return StripeEventEnvelope{}, false, err
	}
	metadata := asMap(data["metadata"])
	orderID := firstNonEmpty(
		asString(metadata["order_id"]),
		asString(metadata["orderId"]),
		asString(data["client_reference_id"]),
	)
	sessionID := ""
	if strings.HasPrefix(eventType, "checkout.session.") {
		sessionID = asString(data["id"])
	}

	return StripeEventEnvelope{
		EventID:   event.ID,
		EventType: eventType,
		OrderID:   orderID,
		SessionID: sessionID,
		Payload:   payload,
	}, true, nil
}

func isHandledStripeEventType(eventType string) bool {
	switch eventType {
	case "checkout.session.completed",
		"checkout.session.async_payment_succeeded",
		"checkout.session.expired",
		"payment_intent.payment_failed":
		return true
	default:
		return false
	}
}

func asMap(v any) map[string]any {
	out, ok := v.(map[string]any)
	if !ok {
		return map[string]any{}
	}
	return out
}

func asString(v any) string {
	value, ok := v.(string)
	if !ok {
		return ""
	}
	return strings.TrimSpace(value)
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
	}
	return ""
}
