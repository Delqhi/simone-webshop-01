package worker

import "testing"

func TestAllowedOrderTransitionMatrix(t *testing.T) {
	cases := []struct {
		current string
		next    string
		allowed bool
	}{
		{current: "confirmed", next: "processing", allowed: true},
		{current: "processing", next: "supplier_ordered", allowed: true},
		{current: "supplier_ordered", next: "shipped", allowed: true},
		{current: "shipped", next: "delivered", allowed: true},
		{current: "confirmed", next: "supplier_ordered", allowed: false},
		{current: "processing", next: "delivered", allowed: false},
	}

	for _, tc := range cases {
		got := isAllowedOrderTransition(tc.current, tc.next)
		if got != tc.allowed {
			t.Fatalf("transition %s -> %s expected %v got %v", tc.current, tc.next, tc.allowed, got)
		}
	}
}

func TestOrderStatusFromShipment(t *testing.T) {
	if got := orderStatusFromShipment("in_transit", "processing"); got != "shipped" {
		t.Fatalf("expected shipped, got %q", got)
	}
	if got := orderStatusFromShipment("delivered", "shipped"); got != "delivered" {
		t.Fatalf("expected delivered, got %q", got)
	}
	if got := orderStatusFromShipment("unknown", "supplier_ordered"); got != "supplier_ordered" {
		t.Fatalf("expected fallback supplier_ordered, got %q", got)
	}
}
