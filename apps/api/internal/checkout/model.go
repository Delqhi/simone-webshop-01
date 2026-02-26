package checkout

type Options struct {
	StripeSecretKey  string
	StripeWebhookKey string
	SiteURL          string
}

type SessionRequest struct {
	Email            string          `json:"email"`
	Currency         string          `json:"currency"`
	ShippingMethod   string          `json:"shipping_method"`
	CustomerType     string          `json:"customer_type"`
	CompanyName      string          `json:"company_name"`
	VATID            string          `json:"vat_id"`
	PurchaseOrderRef string          `json:"purchase_order_ref"`
	ShippingAddress  ShippingAddress `json:"shipping_address"`
	Items            []SessionItem   `json:"items"`
}

type ShippingAddress struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Street1   string `json:"street1"`
	Street2   string `json:"street2"`
	City      string `json:"city"`
	Zip       string `json:"zip"`
	Country   string `json:"country"`
	Phone     string `json:"phone"`
}

type SessionItem struct {
	SKU             string `json:"sku"`
	Title           string `json:"title"`
	Quantity        int    `json:"quantity"`
	UnitPriceAmount int    `json:"unit_price_amount"`
}

type SessionResponse struct {
	OrderID         string `json:"order_id"`
	CheckoutURL     string `json:"checkout_url"`
	StripeSessionID string `json:"stripe_session_id"`
	Status          string `json:"status"`
}

type SessionStatusResponse struct {
	OrderID         string `json:"order_id"`
	StripeSessionID string `json:"stripe_session_id"`
	CheckoutURL     string `json:"checkout_url"`
	CheckoutStatus  string `json:"checkout_status"`
	PaymentStatus   string `json:"payment_status"`
	OrderStatus     string `json:"order_status"`
	PaymentState    string `json:"payment_state"`
}

type CheckoutSessionRecord struct {
	OrderID         string
	CheckoutURL     string
	StripeSessionID string
	Status          string
	CustomerEmail   string
	Currency        string
	AmountTotal     int
}

type PricedItem struct {
	ProductID       string
	SKU             string
	Title           string
	Quantity        int
	UnitPriceAmount int
	LineTotalAmount int
}

type StripeSessionInput struct {
	IdempotencyKey string
	OrderID        string
	Email          string
	Currency       string
	Items          []PricedItem
	ShippingAmount int
	SiteURL        string
}

type StripeSessionOutput struct {
	ID         string
	URL        string
	ExpiresAt  int64
	TotalCents int
}

type StripeEventEnvelope struct {
	EventID   string
	EventType string
	OrderID   string
	SessionID string
	Payload   []byte
}

type CheckoutSessionStatusRecord struct {
	OrderID         string
	StripeSessionID string
	CheckoutURL     string
	CheckoutStatus  string
	PaymentStatus   string
	OrderStatus     string
}
