package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetChannelHealth(c *gin.Context) {
	item, err := h.store.GetChannelHealth(c.Request.Context(), c.Param("channel"))
	if err != nil {
		switch err {
		case errInvalidInput:
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_channel"})
		case errNotConnected:
			c.JSON(http.StatusNotFound, gin.H{"error": "channel_not_connected"})
		default:
			if IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": "channel_not_found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "channel_health_query_failed"})
		}
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) IngestChannelEvents(c *gin.Context) {
	body := struct {
		Items []map[string]any `json:"items"`
	}{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	out, err := h.store.IngestChannelEvents(c.Request.Context(), c.Param("channel"), body.Items)
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_channel_event_payload"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "channel_events_ingest_failed"})
		return
	}
	c.JSON(http.StatusAccepted, out)
}
