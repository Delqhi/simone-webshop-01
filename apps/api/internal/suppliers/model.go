package suppliers

type webhookPayload struct {
	EventID         string
	OrderID         string
	Status          string
	TrackingNumber  string
	TrackingURL     string
	ExternalOrderID string
	Raw             map[string]any
}
