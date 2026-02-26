package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetPromotion(c *gin.Context) {
	item, err := h.store.GetPromotion(c.Request.Context(), c.Param("id"))
	if err != nil {
		if notFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "promotion_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "promotion_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

func (h *Handler) UpdatePromotion(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.UpdatePromotion(c.Request.Context(), c.Param("id"), body)
	if err != nil {
		switch {
		case err == errDuplicate:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "code_already_exists"})
		case err == errEmptyPatch:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "empty_patch"})
		case notFound(err):
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "promotion_not_found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "promotion_update_failed"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

func (h *Handler) DeletePromotion(c *gin.Context) {
	err := h.store.DeletePromotion(c.Request.Context(), c.Param("id"))
	if err != nil {
		if notFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "promotion_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "promotion_delete_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "promotion_deleted"})
}
