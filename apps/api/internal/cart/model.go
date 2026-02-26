package cart

import "time"

type AddItemInput struct {
	SKU             string  `json:"sku"`
	VariantName     *string `json:"variant_name"`
	Quantity        int     `json:"quantity"`
	UnitPriceAmount int     `json:"unit_price_amount"`
	ImageURL        *string `json:"image_url"`
}

type PatchItemInput struct {
	Quantity int `json:"quantity"`
}

type Item struct {
	ID              string     `json:"id"`
	UserID          string     `json:"user_id"`
	SKU             string     `json:"sku"`
	VariantName     *string    `json:"variant_name,omitempty"`
	Quantity        int        `json:"quantity"`
	UnitPriceAmount int        `json:"unit_price_amount"`
	ImageURL        *string    `json:"image_url,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       *time.Time `json:"updated_at,omitempty"`
}
