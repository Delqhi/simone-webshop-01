package admin

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetKPIScorecard(c *gin.Context) {
	items, err := h.store.GetKPIScorecard(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "kpi_scorecard_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"items":      items,
		"updated_at": time.Now().UTC(),
	})
}
