package http

import (
	"github.com/gin-gonic/gin"
	"simone-webshop/apps/api/internal/suppliers"
)

func registerSupplierRoutes(api *gin.RouterGroup, suppliersH *suppliers.Handler) {
	api.POST("/suppliers/webhooks/:supplier", suppliersH.Webhook)
}
