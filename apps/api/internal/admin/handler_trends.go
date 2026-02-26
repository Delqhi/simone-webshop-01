package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetTrendPolicy(c *gin.Context) {
	policy, err := h.store.GetTrendPolicy(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "trend_policy_query_failed"})
		return
	}
	c.JSON(http.StatusOK, policy)
}

func (h *Handler) UpdateTrendPolicy(c *gin.Context) {
	patch := map[string]any{}
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	policy, err := h.store.UpdateTrendPolicy(c.Request.Context(), patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "trend_policy_update_failed"})
		return
	}
	c.JSON(http.StatusOK, policy)
}

func (h *Handler) ListTrendCandidates(c *gin.Context) {
	limit := parseInt(c.Query("limit"), 50, 1, 200)
	page := parseInt(c.Query("page"), 1, 1, 100000)
	decision := c.Query("decision")
	items, err := h.store.ListTrendCandidates(c.Request.Context(), decision, limit, (page-1)*limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "trend_candidates_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items, "page": page, "limit": limit})
}

func (h *Handler) ApproveTrendCandidate(c *gin.Context) {
	out, err := h.store.ApproveTrendCandidate(c.Request.Context(), c.Param("id"))
	if err != nil {
		if IsNotFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "trend_candidate_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "trend_candidate_approve_failed"})
		return
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) LaunchTrendCandidate(c *gin.Context) {
	in := struct {
		Channels      []string `json:"channels"`
		SpendCapDaily float64  `json:"spend_cap_daily"`
	}{}
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	items, err := h.store.LaunchTrendCandidate(c.Request.Context(), c.Param("id"), in.Channels, in.SpendCapDaily)
	if err != nil {
		switch err {
		case errKillSwitch:
			c.JSON(http.StatusConflict, gin.H{"error": "campaign_publish_kill_switched"})
		case errNotConnected:
			c.JSON(http.StatusConflict, gin.H{"error": "channel_not_connected"})
		case errCompliance:
			c.JSON(http.StatusConflict, gin.H{"error": "trend_launch_compliance_blocked"})
		case errBudgetCap:
			c.JSON(http.StatusConflict, gin.H{"error": "budget_cap_exceeded"})
		case errBlocked:
			c.JSON(http.StatusConflict, gin.H{"error": "trend_candidate_requires_approval"})
		case errInvalidInput:
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_launch_input"})
		default:
			if IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": "trend_candidate_not_found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "trend_candidate_launch_failed"})
		}
		return
	}
	c.JSON(http.StatusAccepted, gin.H{"items": items})
}

func (h *Handler) GetTrendPerformance(c *gin.Context) {
	items, err := h.store.GetTrendPerformance(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "trend_performance_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}
