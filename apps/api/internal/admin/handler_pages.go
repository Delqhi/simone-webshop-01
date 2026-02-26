package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListPages(c *gin.Context) {
	items, err := h.store.ListPages(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "pages_query_failed"})
		return
	}
	if len(items) == 0 {
		items = fallbackPages()
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
}

func (h *Handler) CreatePage(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.CreatePage(c.Request.Context(), body)
	if err != nil {
		switch err {
		case errInvalidInput:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "title_and_slug_required"})
		case errDuplicate:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "slug_already_exists"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "page_create_failed"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": item})
}
