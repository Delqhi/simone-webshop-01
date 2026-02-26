package admin

import "testing"

func TestScoreItemComparators(t *testing.T) {
	passGE := scoreItem("metric_ge", 99, 98.5, "%", ">=")
	if ok, _ := passGE["ok"].(bool); !ok {
		t.Fatalf("expected >= comparator to pass")
	}

	passLE := scoreItem("metric_le", 1.2, 2.0, "minutes", "<=")
	if ok, _ := passLE["ok"].(bool); !ok {
		t.Fatalf("expected <= comparator to pass")
	}

	failEQ := scoreItem("metric_eq", 1, 0, "count", "==")
	if ok, _ := failEQ["ok"].(bool); ok {
		t.Fatalf("expected == comparator to fail when values differ")
	}
}
