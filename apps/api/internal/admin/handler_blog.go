package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListBlogPosts(c *gin.Context) {
	params := BlogListParams{
		Page:      parseInt(c.Query("page"), 1, 1, 100000),
		Limit:     parseInt(c.Query("limit"), 20, 1, 200),
		Status:    c.Query("status"),
		Category:  c.Query("category"),
		Search:    c.Query("search"),
		SortBy:    c.Query("sort_by"),
		SortOrder: c.Query("sort_order"),
	}

	items, total, err := h.store.ListBlogPosts(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "blog_query_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"posts": items,
			"pagination": gin.H{
				"page":       params.Page,
				"limit":      params.Limit,
				"total":      total,
				"totalPages": ceilPages(total, params.Limit),
			},
		},
	})
}

func (h *Handler) CreateBlogPost(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid_json"})
		return
	}

	item, err := h.store.CreateBlogPost(c.Request.Context(), body)
	if err != nil {
		switch err {
		case errInvalidInput:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "title_required"})
		case errDuplicate:
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "slug_already_exists"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "blog_create_failed"})
		}
		return
	}
	c.JSON(http.StatusCreated, gin.H{"success": true, "data": item})
}
