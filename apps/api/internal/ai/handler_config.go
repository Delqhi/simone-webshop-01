package ai

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetConfig(c *gin.Context) {
	cfg, err := h.store.GetConfig(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ai_config_query_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"config":    cfg,
		"providers": providerCatalog,
		"personalities": []gin.H{
			{"id": "friendly", "name": "Freundlich"},
			{"id": "professional", "name": "Professionell"},
			{"id": "casual", "name": "Locker"},
		},
		"languages": []gin.H{
			{"id": "de", "name": "Deutsch"},
			{"id": "en", "name": "Englisch"},
			{"id": "auto", "name": "Auto"},
		},
	})
}

func (h *Handler) UpdateConfig(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}

	if providerRaw, ok := body["provider"]; ok {
		if provider, ok := providerRaw.(string); !ok || providerCatalog[provider] == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_provider"})
			return
		}
	}
	if temperatureRaw, ok := body["temperature"]; ok {
		temperature, ok := temperatureRaw.(float64)
		if !ok || temperature < 0 || temperature > 2 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "temperature_out_of_range"})
			return
		}
	}
	if maxTokensRaw, ok := body["maxTokens"]; ok {
		maxTokens, ok := maxTokensRaw.(float64)
		if !ok || maxTokens < 100 || maxTokens > 4000 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "max_tokens_out_of_range"})
			return
		}
	}

	cfg, err := h.store.UpdateConfig(c.Request.Context(), body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ai_config_update_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"config":  cfg,
		"message": "ai_config_saved",
	})
}
