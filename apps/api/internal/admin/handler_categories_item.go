package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetCategory(c *gin.Context) {
	item, err := h.store.GetCategory(c.Request.Context(), c.Param("id"))
	if err != nil {
		if notFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "category_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "category_query_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

func (h *Handler) UpdateCategory(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.UpdateCategory(c.Request.Context(), c.Param("id"), body)
	if err != nil {
		switch {
		case err == errDuplicate:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "slug_already_exists"})
		case err == errEmptyPatch:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "empty_patch"})
		case notFound(err):
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "category_not_found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "category_update_failed"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

func (h *Handler) DeleteCategory(c *gin.Context) {
	err := h.store.DeleteCategory(c.Request.Context(), c.Param("id"))
	if err != nil {
		switch {
		case err == errBlocked:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "category_has_products"})
		case notFound(err):
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "category_not_found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "category_delete_failed"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "category_deleted"})
}
