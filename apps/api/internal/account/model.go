package account

import "time"

type Address struct {
	ID        string  `json:"id"`
	Name      *string `json:"name,omitempty"`
	FirstName string  `json:"first_name"`
	LastName  string  `json:"last_name"`
	Street1   string  `json:"street1"`
	Street2   *string `json:"street2,omitempty"`
	City      string  `json:"city"`
	Zip       string  `json:"zip"`
	Country   string  `json:"country"`
	Phone     *string `json:"phone,omitempty"`
	IsDefault bool    `json:"is_default"`
}

type Profile struct {
	ID               string    `json:"id"`
	Email            string    `json:"email"`
	FirstName        *string   `json:"first_name,omitempty"`
	LastName         *string   `json:"last_name,omitempty"`
	Name             *string   `json:"name,omitempty"`
	Phone            *string   `json:"phone,omitempty"`
	Role             string    `json:"role"`
	CompanyName      *string   `json:"company_name,omitempty"`
	VATID            *string   `json:"vat_id,omitempty"`
	PurchaseOrderRef *string   `json:"purchase_order_ref,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	Addresses        []Address `json:"addresses"`
}

type UpdateInput struct {
	FirstName        *string `json:"first_name"`
	LastName         *string `json:"last_name"`
	Name             *string `json:"name"`
	Phone            *string `json:"phone"`
	CompanyName      *string `json:"company_name"`
	VATID            *string `json:"vat_id"`
	PurchaseOrderRef *string `json:"purchase_order_ref"`
}
