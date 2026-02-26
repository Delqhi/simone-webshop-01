package checkout

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func (h *Handler) SessionStatus(c *gin.Context) {
	sessionID := strings.TrimSpace(c.Query("session_id"))
	orderID := strings.TrimSpace(c.Query("order_id"))
	if sessionID == "" && orderID == "" {
		c.JSON(400, gin.H{"error": "session_id_or_order_id_required"})
		return
	}

	row, err := h.store.GetCheckoutSessionStatus(c.Request.Context(), sessionID, orderID)
	if err != nil {
		c.JSON(500, gin.H{"error": "checkout_session_status_query_failed"})
		return
	}
	if row == nil {
		c.JSON(404, gin.H{"error": "checkout_session_not_found"})
		return
	}

	c.JSON(200, toSessionStatusResponse(row))
}
