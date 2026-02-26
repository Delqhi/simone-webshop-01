package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListCreatives(c *gin.Context) {
	limit := parseInt(c.Query("limit"), 50, 1, 200)
	page := parseInt(c.Query("page"), 1, 1, 100000)
	items, err := h.store.ListCreatives(c.Request.Context(), limit, (page-1)*limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "creative_list_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items, "page": page, "limit": limit})
}

func (h *Handler) CreateCreative(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	item, err := h.store.CreateCreative(c.Request.Context(), body)
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_creative_payload"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "creative_create_failed"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *Handler) ListCreators(c *gin.Context) {
	limit := parseInt(c.Query("limit"), 50, 1, 200)
	page := parseInt(c.Query("page"), 1, 1, 100000)
	items, err := h.store.ListCreators(c.Request.Context(), limit, (page-1)*limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "creator_list_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items, "page": page, "limit": limit})
}
