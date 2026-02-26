package checkout

import (
	"testing"

	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"
)

func TestVerifyStripeSignatureValidAndInvalid(t *testing.T) {
	secret := "whsec_test_secret"
	payload := []byte(`{"id":"evt_123","type":"checkout.session.completed","data":{"object":{"id":"cs_test"}}}`)
	signed := webhook.GenerateTestSignedPayload(&webhook.UnsignedPayload{
		Payload: payload,
		Secret:  secret,
	})

	event, err := verifyStripeSignature(payload, signed.Header, secret)
	if err != nil {
		t.Fatalf("expected valid signature, got %v", err)
	}
	if event.ID != "evt_123" {
		t.Fatalf("unexpected event id %q", event.ID)
	}
	if _, err := verifyStripeSignature(payload, "t=123,v1=invalid", secret); err == nil {
		t.Fatalf("expected invalid signature error")
	}
}

func TestBuildStripeEventEnvelope(t *testing.T) {
	event := stripe.Event{
		ID:   "evt_123",
		Type: stripe.EventType("checkout.session.completed"),
		Data: &stripe.EventData{
			Raw: []byte(`{"id":"cs_test_123","metadata":{"order_id":"3b72c2fb-5f9d-4fd0-a13d-987a9764e073"}}`),
		},
	}
	envelope, handled, err := buildStripeEventEnvelope(event, []byte(`{"id":"evt_123"}`))
	if err != nil {
		t.Fatalf("unexpected envelope error: %v", err)
	}
	if !handled {
		t.Fatalf("expected checkout.session.completed to be handled")
	}
	if envelope.OrderID != "3b72c2fb-5f9d-4fd0-a13d-987a9764e073" {
		t.Fatalf("unexpected order id %q", envelope.OrderID)
	}
	if envelope.SessionID != "cs_test_123" {
		t.Fatalf("unexpected session id %q", envelope.SessionID)
	}
}
