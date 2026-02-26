package catalog

import (
	"errors"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	store *Store
}

func NewHandler(pool *pgxpool.Pool) *Handler {
	return &Handler{store: NewStore(pool)}
}

func (h *Handler) ListProducts(c *gin.Context) {
	limit := parseInt(c.Query("limit"), 24, 1, 200)
	page := parseInt(c.Query("page"), 1, 1, 100000)
	filter := ProductFilter{
		Search:   strings.TrimSpace(c.Query("search")),
		Category: strings.TrimSpace(c.Query("category")),
		Limit:    limit,
		Offset:   (page - 1) * limit,
	}

	items, err := h.store.ListProducts(c.Request.Context(), filter)
	if err != nil {
		c.JSON(500, gin.H{"error": "products_query_failed"})
		return
	}
	c.JSON(200, gin.H{"items": items, "page": page, "limit": limit})
}

func (h *Handler) GetProduct(c *gin.Context) {
	item, err := h.store.GetProduct(c.Request.Context(), c.Param("id"))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(404, gin.H{"error": "product_not_found"})
			return
		}
		c.JSON(500, gin.H{"error": "product_query_failed"})
		return
	}
	c.JSON(200, item)
}

func (h *Handler) ListCategories(c *gin.Context) {
	items, err := h.store.ListCategories(c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{"error": "categories_query_failed"})
		return
	}
	c.JSON(200, gin.H{"items": items})
}

func parseInt(raw string, fallback, min, max int) int {
	v, err := strconv.Atoi(raw)
	if err != nil {
		return fallback
	}
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}
