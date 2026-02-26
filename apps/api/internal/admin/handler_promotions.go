package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListPromotions(c *gin.Context) {
	params := PromotionListParams{
		Page:      parseInt(c.Query("page"), 1, 1, 100000),
		Limit:     parseInt(c.Query("limit"), 20, 1, 200),
		Type:      c.Query("type"),
		IsActive:  parseOptionalBool(c.Query("is_active")),
		SortBy:    c.Query("sort_by"),
		SortOrder: c.Query("sort_order"),
	}

	items, total, err := h.store.ListPromotions(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "promotions_query_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"promotions": items,
			"pagination": gin.H{
				"page":       params.Page,
				"limit":      params.Limit,
				"total":      total,
				"totalPages": ceilPages(total, params.Limit),
			},
		},
	})
}

func (h *Handler) CreatePromotion(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.CreatePromotion(c.Request.Context(), body)
	if err != nil {
		switch err {
		case errInvalidInput:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "name_and_type_required"})
		case errDuplicate:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "code_already_exists"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "promotion_create_failed"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": item})
}
