package http

import (
	"github.com/gin-gonic/gin"
	"simone-webshop/apps/api/internal/admin"
	"simone-webshop/apps/api/internal/ai"
	"simone-webshop/apps/api/internal/http/middleware"
)

func registerAdminRoutes(api *gin.RouterGroup, authn *middleware.Authenticator, adminH *admin.Handler, aiH *ai.Handler) {
	adminG := api.Group("/admin", authn.Middleware(), middleware.RequireRoles("admin", "ops"))
	adminG.Use(middleware.AuditMutations("admin"))

	registerAdminCustomerRoutes(adminG, adminH)
	registerAdminCatalogRoutes(adminG, adminH)
	registerAdminContentRoutes(adminG, adminH)
	registerAdminOpsRoutes(adminG, adminH, aiH)
}

func registerAdminCustomerRoutes(adminG *gin.RouterGroup, adminH *admin.Handler) {
	adminG.GET("/customers", adminH.ListCustomers)
	adminG.POST("/customers", adminH.CreateCustomer)
	adminG.GET("/customers/:id", adminH.GetCustomer)
	adminG.PUT("/customers/:id", adminH.UpdateCustomer)
	adminG.PATCH("/customers/:id", adminH.UpdateCustomer)
	adminG.DELETE("/customers/:id", adminH.DeleteCustomer)
}

func registerAdminCatalogRoutes(adminG *gin.RouterGroup, adminH *admin.Handler) {
	adminG.GET("/products", adminH.ListProducts)
	adminG.POST("/products", adminH.CreateProduct)
	adminG.GET("/products/:id", adminH.GetProduct)
	adminG.PUT("/products/:id", adminH.UpdateProduct)
	adminG.PATCH("/products/:id", adminH.UpdateProduct)
	adminG.DELETE("/products/:id", adminH.DeleteProduct)

	adminG.GET("/suppliers", adminH.ListSuppliers)
	adminG.POST("/suppliers", adminH.CreateSupplier)
	adminG.GET("/suppliers/:id", adminH.GetSupplier)
	adminG.PUT("/suppliers/:id", adminH.UpdateSupplier)
	adminG.PATCH("/suppliers/:id", adminH.UpdateSupplier)
	adminG.DELETE("/suppliers/:id", adminH.DeleteSupplier)

	adminG.GET("/categories", adminH.ListCategories)
	adminG.POST("/categories", adminH.CreateCategory)
	adminG.GET("/categories/:id", adminH.GetCategory)
	adminG.PUT("/categories/:id", adminH.UpdateCategory)
	adminG.PATCH("/categories/:id", adminH.UpdateCategory)
	adminG.DELETE("/categories/:id", adminH.DeleteCategory)
}

func registerAdminContentRoutes(adminG *gin.RouterGroup, adminH *admin.Handler) {
	adminG.GET("/pages", adminH.ListPages)
	adminG.POST("/pages", adminH.CreatePage)
	adminG.GET("/pages/:id", adminH.GetPage)
	adminG.PUT("/pages/:id", adminH.UpdatePage)
	adminG.PATCH("/pages/:id", adminH.UpdatePage)
	adminG.DELETE("/pages/:id", adminH.DeletePage)

	adminG.GET("/blog", adminH.ListBlogPosts)
	adminG.POST("/blog", adminH.CreateBlogPost)
	adminG.GET("/blog/:id", adminH.GetBlogPost)
	adminG.PUT("/blog/:id", adminH.UpdateBlogPost)
	adminG.PATCH("/blog/:id", adminH.UpdateBlogPost)
	adminG.DELETE("/blog/:id", adminH.DeleteBlogPost)

	adminG.GET("/promotions", adminH.ListPromotions)
	adminG.POST("/promotions", adminH.CreatePromotion)
	adminG.GET("/promotions/:id", adminH.GetPromotion)
	adminG.PUT("/promotions/:id", adminH.UpdatePromotion)
	adminG.PATCH("/promotions/:id", adminH.UpdatePromotion)
	adminG.DELETE("/promotions/:id", adminH.DeletePromotion)
}

func registerAdminOpsRoutes(adminG *gin.RouterGroup, adminH *admin.Handler, aiH *ai.Handler) {
	adminG.GET("/settings", adminH.GetSettings)
	adminG.PUT("/settings", adminH.UpdateSettings)
	adminG.PATCH("/settings", adminH.UpdateSettings)

	adminG.GET("/orders", adminH.ListOrders)
	adminG.GET("/orders/:id", adminH.GetOrder)
	adminG.PATCH("/orders/:id", adminH.PatchOrder)
	adminG.POST("/orders/:id/supplier-dispatch", adminH.TriggerSupplierDispatch)
	adminG.GET("/orders/:id/supplier-orders", adminH.ListOrderSupplierOrders)

	adminG.GET("/automation/health", adminH.GetAutomationHealth)
	adminG.GET("/automation/policy", adminH.GetAutomationPolicy)
	adminG.PUT("/automation/policy", adminH.UpdateAutomationPolicy)

	adminG.GET("/trends/policy", adminH.GetTrendPolicy)
	adminG.PUT("/trends/policy", adminH.UpdateTrendPolicy)
	adminG.GET("/trends/candidates", adminH.ListTrendCandidates)
	adminG.POST("/trends/signals/ingest", adminH.IngestTrendSignals)
	adminG.POST("/trends/:id/approve", adminH.ApproveTrendCandidate)
	adminG.POST("/trends/:id/launch", adminH.LaunchTrendCandidate)
	adminG.GET("/trends/performance", adminH.GetTrendPerformance)

	adminG.GET("/growth/budget-policy", adminH.GetGrowthBudgetPolicy)
	adminG.PUT("/growth/budget-policy", adminH.UpdateGrowthBudgetPolicy)
	adminG.GET("/revenue/forecast-policy", adminH.GetRevenueForecastPolicy)
	adminG.PUT("/revenue/forecast-policy", adminH.UpdateRevenueForecastPolicy)
	adminG.GET("/revenue/forecast", adminH.GetRevenueForecast)

	adminG.GET("/channels", adminH.GetChannels)
	adminG.GET("/channels/:channel/health", adminH.GetChannelHealth)
	adminG.POST("/channels/:channel/connect/start", adminH.StartChannelConnect)
	adminG.POST("/channels/:channel/connect/complete", adminH.CompleteChannelConnect)
	adminG.POST("/channels/:channel/catalog/sync", adminH.TriggerChannelCatalogSync)
	adminG.POST("/channels/:channel/campaigns/publish", adminH.TriggerChannelCampaignPublish)
	adminG.POST("/channels/:channel/events/ingest", adminH.IngestChannelEvents)

	adminG.GET("/attribution/summary", adminH.GetAttributionSummary)
	adminG.GET("/kpi/scorecard", adminH.GetKPIScorecard)
	adminG.GET("/creatives", adminH.ListCreatives)
	adminG.POST("/creatives", adminH.CreateCreative)
	adminG.GET("/creators", adminH.ListCreators)
	adminG.POST("/creators", adminH.CreateCreator)
	adminG.GET("/affiliate/offers", adminH.ListAffiliateOffers)
	adminG.POST("/affiliate/offers", adminH.CreateAffiliateOffer)
	adminG.POST("/kill-switch/:domain", adminH.SetKillSwitch)

	adminG.GET("/ai/config", aiH.GetConfig)
	adminG.PUT("/ai/config", aiH.UpdateConfig)
	adminG.POST("/ai/test", aiH.TestProvider)
}
