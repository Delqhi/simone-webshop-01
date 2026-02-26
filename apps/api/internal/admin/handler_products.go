package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListProducts(c *gin.Context) {
	params := ProductListParams{
		Page:       parseInt(c.Query("page"), 1, 1, 100000),
		Limit:      parseInt(c.Query("limit"), 20, 1, 200),
		Search:     c.Query("search"),
		CategoryID: c.Query("category_id"),
		IsActive:   parseOptionalBool(c.Query("is_active")),
		SortBy:     c.Query("sort_by"),
		SortOrder:  c.Query("sort_order"),
	}

	items, total, err := h.store.ListProducts(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "products_query_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"products": items,
			"pagination": gin.H{
				"page":       params.Page,
				"limit":      params.Limit,
				"total":      total,
				"totalPages": ceilPages(total, params.Limit),
			},
		},
	})
}

func (h *Handler) CreateProduct(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.CreateProduct(c.Request.Context(), body)
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "name_and_price_required"})
			return
		}
		if err == errBlocked {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "product_not_autopilot_ready"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "product_create_failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": item})
}
