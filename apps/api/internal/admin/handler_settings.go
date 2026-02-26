package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetSettings(c *gin.Context) {
	settings, err := h.store.GetSettings(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "settings_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": settings})
}

func (h *Handler) UpdateSettings(c *gin.Context) {
	patch := map[string]any{}
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	settings, err := h.store.UpdateSettings(c.Request.Context(), patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "settings_update_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    settings,
		"message": "settings_saved",
	})
}
