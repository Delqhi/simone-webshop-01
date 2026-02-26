package analytics

func BuildAlerts(current, previous WindowCounts) []AlertResult {
	alerts := []AlertResult{
		buildDropAlert(
			"add_to_cart_drop",
			"warning",
			"drop > 20% vs previous window",
			previous.AddToCart,
			current.AddToCart,
			20,
		),
		buildDropAlert(
			"checkout_step_drop",
			"warning",
			"drop > 15% vs previous window",
			previous.CheckoutStepComplete,
			current.CheckoutStepComplete,
			15,
		),
		buildCheckoutErrorAlert(current),
		buildTelemetrySilenceAlert(current),
	}
	return alerts
}

func buildDropAlert(name, severity, threshold string, previous, current, limit int) AlertResult {
	result := AlertResult{
		Name:      name,
		Severity:  severity,
		Threshold: threshold,
		Metrics: map[string]any{
			"previous": previous,
			"current":  current,
			"dropPct":  0.0,
		},
		Reason: "no regression",
	}
	if previous <= 0 {
		result.Reason = "insufficient previous baseline"
		return result
	}
	if current >= previous {
		return result
	}

	dropPct := (float64(previous-current) / float64(previous)) * 100
	result.Metrics["dropPct"] = dropPct
	if dropPct > float64(limit) {
		result.Triggered = true
		result.Reason = "threshold exceeded"
	}
	return result
}

func buildCheckoutErrorAlert(current WindowCounts) AlertResult {
	result := AlertResult{
		Name:      "checkout_error_rate",
		Severity:  "critical",
		Threshold: "error rate > 3% of begin_checkout",
		Metrics: map[string]any{
			"beginCheckout": current.BeginCheckout,
			"checkoutError": current.CheckoutError,
			"errorRatePct":  0.0,
		},
		Reason: "no regression",
	}
	if current.BeginCheckout <= 0 {
		result.Reason = "no checkout starts in current window"
		return result
	}

	errorRate := (float64(current.CheckoutError) / float64(current.BeginCheckout)) * 100
	result.Metrics["errorRatePct"] = errorRate
	if errorRate > 3 {
		result.Triggered = true
		result.Reason = "threshold exceeded"
	}
	return result
}

func buildTelemetrySilenceAlert(current WindowCounts) AlertResult {
	totalEvents := current.ViewProduct +
		current.AddToCart +
		current.BeginCheckout +
		current.CheckoutStepComplete +
		current.Purchase

	result := AlertResult{
		Name:      "telemetry_silence",
		Severity:  "critical",
		Threshold: "total funnel events == 0",
		Metrics: map[string]any{
			"totalEvents": totalEvents,
		},
		Reason: "telemetry healthy",
	}

	if totalEvents == 0 {
		result.Triggered = true
		result.Reason = "no funnel events in window"
	}
	return result
}
