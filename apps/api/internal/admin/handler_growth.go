package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetGrowthBudgetPolicy(c *gin.Context) {
	item, err := h.store.GetBudgetPolicy(c.Request.Context(), "global", "all")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "budget_policy_query_failed"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) UpdateGrowthBudgetPolicy(c *gin.Context) {
	patch := map[string]any{}
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	item, err := h.store.UpdateBudgetPolicy(c.Request.Context(), "global", "all", patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "budget_policy_update_failed"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) GetAttributionSummary(c *gin.Context) {
	items, err := h.store.GetAttributionSummary(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "attribution_summary_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *Handler) SetKillSwitch(c *gin.Context) {
	in := struct {
		Enabled bool `json:"enabled"`
	}{}
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	item, err := h.store.SetGrowthKillSwitch(c.Request.Context(), c.Param("domain"), in.Enabled)
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_kill_switch_domain"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "kill_switch_update_failed"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) GetRevenueForecastPolicy(c *gin.Context) {
	item, err := h.store.GetRevenueForecastPolicy(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "revenue_forecast_policy_query_failed"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) UpdateRevenueForecastPolicy(c *gin.Context) {
	patch := map[string]any{}
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	item, err := h.store.UpdateRevenueForecastPolicy(c.Request.Context(), patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "revenue_forecast_policy_update_failed"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) GetRevenueForecast(c *gin.Context) {
	item, err := h.store.GetRevenueForecast(c.Request.Context(), c.Query("scenario"))
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_forecast_scenario"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "revenue_forecast_query_failed"})
		return
	}
	c.JSON(http.StatusOK, item)
}
