package worker

type supplierDispatchItem struct {
	ProductID       string
	SKU             string
	Title           string
	Quantity        int
	UnitPriceAmount int
}

type supplierCandidate struct {
	ID           string
	Name         string
	Status       string
	Channel      string
	ContactEmail string
	APIEndpoint  string
	APIKey       string
	SLAHours     int
	Priority     int
	IsPrimary    bool
	Rating       float64
}

type supplierPlacement struct {
	Supplier supplierCandidate
	Items    []supplierDispatchItem
	Score    float64
	Reason   string
}

type supplierDispatchResult struct {
	ExternalOrderID string
	ResponsePayload map[string]any
}
