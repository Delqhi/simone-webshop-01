package http

import (
	"github.com/gin-gonic/gin"
	"simone-webshop/apps/api/internal/http/middleware"
	"simone-webshop/apps/api/internal/support"
)

func registerSupportRoutes(api *gin.RouterGroup, authn *middleware.Authenticator, supportH *support.Handler) {
	supportWrite := api.Group("/support", authn.Middleware(), middleware.RequireRoles("customer", "admin", "ops", "support"))
	supportWrite.POST("/tickets", supportH.CreateTicket)

	supportOps := api.Group("/support", authn.Middleware(), middleware.RequireRoles("admin", "ops", "support"))
	supportOps.GET("/tickets", supportH.ListTickets)
	supportOps.PATCH("/tickets/:id", supportH.PatchTicket)
}
