package admin

import "time"

type TrendPolicy struct {
	DefaultDecision  string               `json:"default_decision"`
	CountryDefaults  map[string]any       `json:"country_defaults"`
	ChannelDefaults  map[string]any       `json:"channel_defaults"`
	CategoryPolicies []CategoryPolicyRule `json:"category_policies"`
	UpdatedAt        time.Time            `json:"updated_at"`
}

type CategoryPolicyRule struct {
	CategoryKey string    `json:"category_key"`
	Country     string    `json:"country"`
	Channel     string    `json:"channel"`
	PolicyState string    `json:"policy_state"`
	Reason      *string   `json:"reason,omitempty"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type TrendCandidateSummary struct {
	ID             string    `json:"id"`
	ProductID      *string   `json:"product_id,omitempty"`
	Title          string    `json:"title"`
	Cluster        string    `json:"cluster"`
	Score          float64   `json:"score"`
	Lifecycle      string    `json:"lifecycle_state"`
	Decision       string    `json:"decision_state"`
	DecisionReason *string   `json:"decision_reason,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type TrendLaunchSummary struct {
	ID             string     `json:"id"`
	TrendCandidate string     `json:"trend_candidate_id"`
	Channel        string     `json:"channel"`
	Status         string     `json:"status"`
	SpendCapDaily  float64    `json:"spend_cap_daily"`
	StartedAt      *time.Time `json:"started_at,omitempty"`
	StoppedAt      *time.Time `json:"stopped_at,omitempty"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

type BudgetPolicy struct {
	Scope      string    `json:"scope"`
	Channel    string    `json:"channel"`
	DailyCap   float64   `json:"daily_cap"`
	WeeklyCap  float64   `json:"weekly_cap"`
	MonthlyCap float64   `json:"monthly_cap"`
	TargetMER  float64   `json:"target_mer"`
	TargetROAS float64   `json:"target_roas"`
	HardStop   bool      `json:"hard_stop"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type ChannelAccountSummary struct {
	ID              string     `json:"id"`
	Channel         string     `json:"channel"`
	AccountName     string     `json:"account_name"`
	Status          string     `json:"status"`
	ConnectionMode  string     `json:"connection_mode"`
	LastConnectedAt *time.Time `json:"last_connected_at,omitempty"`
	LastHealthAt    *time.Time `json:"last_health_at,omitempty"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type AttributionSummaryItem struct {
	Channel          string  `json:"channel"`
	AttributedOrders int     `json:"attributed_orders"`
	RevenueAmount    float64 `json:"revenue_amount"`
	CostAmount       float64 `json:"cost_amount"`
	MER              float64 `json:"mer"`
}

type GrowthOverview struct {
	UpdatedAt           time.Time `json:"updated_at"`
	OpenBudgetIncidents int       `json:"open_budget_incidents"`
	OpenDLQJobs         int       `json:"open_dlq_jobs"`
	TotalChannels       int       `json:"total_channels"`
	ConnectedChannels   int       `json:"connected_channels"`
}

type RevenueForecastScenario struct {
	AdSpend        float64 `json:"ad_spend"`
	CPC            float64 `json:"cpc"`
	OrganicLiftPct float64 `json:"organic_lift_pct"`
	CVR            float64 `json:"cvr"`
	AOV            float64 `json:"aov"`
}

type RevenueForecastPolicy struct {
	Currency     string                  `json:"currency"`
	Conservative RevenueForecastScenario `json:"conservative"`
	Base         RevenueForecastScenario `json:"base"`
	Scale        RevenueForecastScenario `json:"scale"`
	UpdatedAt    time.Time               `json:"updated_at"`
}

type RevenueForecastResult struct {
	Scenario        string                  `json:"scenario"`
	Currency        string                  `json:"currency"`
	Inputs          RevenueForecastScenario `json:"inputs"`
	PaidClicks      float64                 `json:"paid_clicks"`
	OrganicSessions float64                 `json:"organic_sessions"`
	TotalSessions   float64                 `json:"total_sessions"`
	Orders          float64                 `json:"orders"`
	GMV             float64                 `json:"gmv"`
	MER             float64                 `json:"mer"`
	CAC             float64                 `json:"cac"`
	UpdatedAt       time.Time               `json:"updated_at"`
}
