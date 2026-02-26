package worker

import "testing"

func TestIsCriticalJobType(t *testing.T) {
	if !isCriticalJobType("payment.succeeded") {
		t.Fatalf("expected payment.succeeded to be critical")
	}
	if !isCriticalJobType("supplier.order.requested") {
		t.Fatalf("expected supplier.order.requested to be critical")
	}
	if isCriticalJobType("trend.analysis.requested") {
		t.Fatalf("expected trend.analysis.requested to be non-critical")
	}
}
