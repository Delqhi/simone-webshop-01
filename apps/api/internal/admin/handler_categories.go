package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListCategories(c *gin.Context) {
	includeProducts := c.Query("include_products") == "true"
	items, err := h.store.ListCategories(c.Request.Context(), includeProducts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "categories_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
}

func (h *Handler) CreateCategory(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.CreateCategory(c.Request.Context(), body)
	if err != nil {
		switch err {
		case errInvalidInput:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "name_and_slug_required"})
		case errDuplicate:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "slug_already_exists"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "category_create_failed"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": item})
}
