package orders

import "time"

type Order struct {
	ID             string      `json:"id"`
	Status         string      `json:"status"`
	Currency       string      `json:"currency"`
	TotalAmount    *int        `json:"total_amount,omitempty"`
	Total          *float64    `json:"total,omitempty"`
	PaymentStatus  string      `json:"payment_status"`
	TrackingNumber *string     `json:"tracking_number,omitempty"`
	TrackingURL    *string     `json:"tracking_url,omitempty"`
	CreatedAt      time.Time   `json:"created_at"`
	UpdatedAt      time.Time   `json:"updated_at"`
	Items          []OrderItem `json:"items,omitempty"`
}

type OrderItem struct {
	ID              string   `json:"id"`
	ProductID       *string  `json:"product_id,omitempty"`
	SKU             *string  `json:"sku,omitempty"`
	Title           *string  `json:"title,omitempty"`
	Variant         *string  `json:"variant,omitempty"`
	Quantity        int      `json:"quantity"`
	Price           *float64 `json:"price,omitempty"`
	UnitPriceAmount *int     `json:"unit_price_amount,omitempty"`
}
