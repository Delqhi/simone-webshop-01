package checkout

import "testing"

func TestOrderIDFromIdempotencyKeyIsStable(t *testing.T) {
	a1 := orderIDFromIdempotencyKey("abc-123")
	a2 := orderIDFromIdempotencyKey("abc-123")
	b := orderIDFromIdempotencyKey("different-key")

	if a1 == "" || a2 == "" || b == "" {
		t.Fatalf("expected non-empty order ids")
	}
	if a1 != a2 {
		t.Fatalf("expected same key to produce same order id")
	}
	if a1 == b {
		t.Fatalf("expected different keys to produce different order ids")
	}
}
