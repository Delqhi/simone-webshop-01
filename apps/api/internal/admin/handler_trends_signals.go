package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IngestTrendSignals(c *gin.Context) {
	body := struct {
		Items []map[string]any `json:"items"`
	}{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	if len(body.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "empty_signals_payload"})
		return
	}
	out, err := h.store.IngestTrendSignals(c.Request.Context(), body.Items)
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_signal_input"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "trend_signals_ingest_failed"})
		return
	}
	c.JSON(http.StatusAccepted, out)
}
