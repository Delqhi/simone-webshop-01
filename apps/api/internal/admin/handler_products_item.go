package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetProduct(c *gin.Context) {
	item, err := h.store.GetProduct(c.Request.Context(), c.Param("id"))
	if err != nil {
		if notFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "product_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "product_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

func (h *Handler) UpdateProduct(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.UpdateProduct(c.Request.Context(), c.Param("id"), body)
	if err != nil {
		switch {
		case err == errEmptyPatch:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "empty_patch"})
		case err == errBlocked:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "product_not_autopilot_ready"})
		case notFound(err):
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "product_not_found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "product_update_failed"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

func (h *Handler) DeleteProduct(c *gin.Context) {
	err := h.store.DeleteProduct(c.Request.Context(), c.Param("id"))
	if err != nil {
		if notFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "product_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "product_delete_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "product_deleted"})
}
