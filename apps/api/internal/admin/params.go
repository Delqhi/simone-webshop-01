package admin

type CustomerListParams struct {
	Page      int
	Limit     int
	Search    string
	SortBy    string
	SortOrder string
}

type ProductListParams struct {
	Page       int
	Limit      int
	Search     string
	CategoryID string
	IsActive   *bool
	SortBy     string
	SortOrder  string
}

type SupplierListParams struct {
	Page      int
	Limit     int
	Search    string
	Status    string
	SortBy    string
	SortOrder string
}

type BlogListParams struct {
	Page      int
	Limit     int
	Search    string
	Status    string
	Category  string
	SortBy    string
	SortOrder string
}

type PromotionListParams struct {
	Page      int
	Limit     int
	Type      string
	IsActive  *bool
	SortBy    string
	SortOrder string
}
