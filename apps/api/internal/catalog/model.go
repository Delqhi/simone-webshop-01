package catalog

import "time"

type ProductFilter struct {
	Search   string
	Category string
	Limit    int
	Offset   int
}

type Product struct {
	ID            string    `json:"id"`
	SKU           string    `json:"sku,omitempty"`
	Name          string    `json:"name"`
	Slug          string    `json:"slug,omitempty"`
	Description   string    `json:"description,omitempty"`
	Price         float64   `json:"price"`
	OriginalPrice *float64  `json:"originalPrice,omitempty"`
	Images        []string  `json:"images"`
	Stock         int       `json:"stock"`
	IsActive      bool      `json:"isActive"`
	CategoryID    *string   `json:"categoryId,omitempty"`
	CategoryName  *string   `json:"categoryName,omitempty"`
	CategorySlug  *string   `json:"categorySlug,omitempty"`
	Rating        *float64  `json:"rating,omitempty"`
	ReviewCount   *int      `json:"reviewCount,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type Category struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description *string   `json:"description,omitempty"`
	Image       *string   `json:"image,omitempty"`
	IsActive    bool      `json:"isActive"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
