package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetAutomationHealth(c *gin.Context) {
	health, err := h.store.GetAutomationHealth(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "automation_health_query_failed"})
		return
	}
	c.JSON(http.StatusOK, health)
}

func (h *Handler) GetAutomationPolicy(c *gin.Context) {
	policy, err := h.store.GetAutomationPolicy(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "automation_policy_query_failed"})
		return
	}
	c.JSON(http.StatusOK, policy)
}

func (h *Handler) UpdateAutomationPolicy(c *gin.Context) {
	patch := map[string]any{}
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}

	policy, err := h.store.UpdateAutomationPolicy(c.Request.Context(), patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "automation_policy_update_failed"})
		return
	}
	c.JSON(http.StatusOK, policy)
}

func (h *Handler) TriggerSupplierDispatch(c *gin.Context) {
	queued, err := h.store.TriggerSupplierDispatch(c.Request.Context(), c.Param("id"), "admin_manual_dispatch")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "supplier_dispatch_enqueue_failed"})
		return
	}
	if !queued {
		c.JSON(http.StatusOK, gin.H{"status": "already_queued"})
		return
	}
	c.JSON(http.StatusAccepted, gin.H{"status": "queued"})
}

func (h *Handler) ListOrderSupplierOrders(c *gin.Context) {
	items, err := h.store.ListSupplierOrdersByOrder(c.Request.Context(), c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "supplier_orders_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}
