package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetCustomer(c *gin.Context) {
	item, err := h.store.GetCustomer(c.Request.Context(), c.Param("id"))
	if err != nil {
		if notFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "customer_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "customer_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

func (h *Handler) UpdateCustomer(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.UpdateCustomer(c.Request.Context(), c.Param("id"), body)
	if err != nil {
		switch {
		case err == errDuplicate:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "email_already_exists"})
		case err == errEmptyPatch:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "empty_patch"})
		case notFound(err):
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "customer_not_found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "customer_update_failed"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

func (h *Handler) DeleteCustomer(c *gin.Context) {
	err := h.store.DeleteCustomer(c.Request.Context(), c.Param("id"))
	if err != nil {
		switch {
		case err == errBlocked:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "customer_has_orders"})
		case notFound(err):
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "customer_not_found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "customer_delete_failed"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "customer_deleted"})
}
