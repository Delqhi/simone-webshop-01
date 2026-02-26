package promotions

import "time"

type ActivePromotionQuery struct {
	Segment   string
	Placement string
	Limit     int
}

type PromotionBanner struct {
	ID             string     `json:"id"`
	Name           string     `json:"name"`
	Type           string     `json:"type"`
	Code           *string    `json:"code,omitempty"`
	BannerText     string     `json:"bannerText"`
	BannerColor    string     `json:"bannerColor"`
	Placement      string     `json:"placement"`
	SegmentScope   string     `json:"segmentScope"`
	DiscountValue  float64    `json:"discountValue"`
	DiscountPct    float64    `json:"discountPercentage"`
	MinimumOrder   float64    `json:"minimumOrder"`
	StartDate      time.Time  `json:"startDate"`
	EndDate        *time.Time `json:"endDate,omitempty"`
}
