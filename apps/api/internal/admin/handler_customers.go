package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListCustomers(c *gin.Context) {
	params := CustomerListParams{
		Page:      parseInt(c.Query("page"), 1, 1, 100000),
		Limit:     parseInt(c.Query("limit"), 20, 1, 200),
		Search:    c.Query("search"),
		SortBy:    c.Query("sort_by"),
		SortOrder: c.Query("sort_order"),
	}

	items, total, err := h.store.ListCustomers(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "customers_query_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"customers": items,
			"pagination": gin.H{
				"page":       params.Page,
				"limit":      params.Limit,
				"total":      total,
				"totalPages": ceilPages(total, params.Limit),
			},
		},
	})
}

func (h *Handler) CreateCustomer(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.CreateCustomer(c.Request.Context(), body)
	if err != nil {
		switch err {
		case errInvalidInput:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "name_and_email_required"})
		case errDuplicate:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "email_already_exists"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "customer_create_failed"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": item})
}

func ceilPages(total, limit int) int {
	if limit <= 0 {
		return 0
	}
	if total == 0 {
		return 0
	}
	pages := total / limit
	if total%limit != 0 {
		pages++
	}
	return pages
}
