package analytics

import "testing"

func findAlert(t *testing.T, alerts []AlertResult, name string) AlertResult {
	t.Helper()
	for _, item := range alerts {
		if item.Name == name {
			return item
		}
	}
	t.Fatalf("alert %s not found", name)
	return AlertResult{}
}

func TestBuildAlerts(t *testing.T) {
	current := WindowCounts{
		AddToCart:            60,
		CheckoutStepComplete: 50,
		BeginCheckout:        100,
		CheckoutError:        5,
	}
	previous := WindowCounts{
		AddToCart:            100,
		CheckoutStepComplete: 100,
	}

	alerts := BuildAlerts(current, previous)
	if len(alerts) != 4 {
		t.Fatalf("expected 4 alerts, got %d", len(alerts))
	}

	if !findAlert(t, alerts, "add_to_cart_drop").Triggered {
		t.Fatalf("expected add_to_cart_drop to trigger")
	}
	if !findAlert(t, alerts, "checkout_step_drop").Triggered {
		t.Fatalf("expected checkout_step_drop to trigger")
	}
	if !findAlert(t, alerts, "checkout_error_rate").Triggered {
		t.Fatalf("expected checkout_error_rate to trigger")
	}
	if findAlert(t, alerts, "telemetry_silence").Triggered {
		t.Fatalf("expected telemetry_silence to remain healthy")
	}
}

func TestBuildAlertsNoBaseline(t *testing.T) {
	alerts := BuildAlerts(WindowCounts{AddToCart: 5}, WindowCounts{})
	if findAlert(t, alerts, "add_to_cart_drop").Triggered {
		t.Fatalf("expected no trigger without baseline")
	}
}

func TestBuildAlertsTelemetrySilence(t *testing.T) {
	alerts := BuildAlerts(WindowCounts{}, WindowCounts{})
	if !findAlert(t, alerts, "telemetry_silence").Triggered {
		t.Fatalf("expected telemetry_silence to trigger when no events are present")
	}
}
