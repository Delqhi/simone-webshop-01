package analytics

import "time"

type EventInput struct {
	Type       string         `json:"type"`
	OccurredAt time.Time      `json:"occurredAt"`
	Segment    string         `json:"segment"`
	Route      string         `json:"route"`
	Payload    map[string]any `json:"payload"`
}

type EventCount struct {
	EventType string `json:"eventType"`
	Count     int    `json:"count"`
}

type SegmentCount struct {
	Segment   string `json:"segment"`
	EventType string `json:"eventType"`
	Count     int    `json:"count"`
}

type WindowCounts struct {
	ViewProduct          int `json:"viewProduct"`
	AddToCart            int `json:"addToCart"`
	BeginCheckout        int `json:"beginCheckout"`
	CheckoutStepComplete int `json:"checkoutStepCompleted"`
	Purchase             int `json:"purchase"`
	CheckoutError        int `json:"checkoutError"`
}

type AlertResult struct {
	Name      string         `json:"name"`
	Triggered bool           `json:"triggered"`
	Severity  string         `json:"severity"`
	Threshold string         `json:"threshold"`
	Metrics   map[string]any `json:"metrics"`
	Reason    string         `json:"reason"`
}

type ExperimentMetric struct {
	ExperimentID         string  `json:"experimentId"`
	Variant              string  `json:"variant"`
	Exposures            int     `json:"exposures"`
	CheckoutStarts       int     `json:"checkoutStarts"`
	Purchases            int     `json:"purchases"`
	CheckoutConversionPc float64 `json:"checkoutConversionPct"`
	PurchaseConversionPc float64 `json:"purchaseConversionPct"`
}
