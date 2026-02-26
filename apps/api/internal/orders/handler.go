package orders

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"simone-webshop/apps/api/internal/http/middleware"
)

type Handler struct {
	store *Store
}

func NewHandler(pool *pgxpool.Pool) *Handler {
	return &Handler{store: NewStore(pool)}
}

func (h *Handler) ListOrders(c *gin.Context) {
	claims, ok := claimUser(c)
	if !ok {
		c.JSON(401, gin.H{"error": "claims_missing"})
		return
	}

	limit := parseInt(c.Query("limit"), 20, 1, 200)
	page := parseInt(c.Query("page"), 1, 1, 100000)
	items, err := h.store.ListOrdersByUser(c.Request.Context(), claims.Subject, limit, (page-1)*limit)
	if err != nil {
		c.JSON(500, gin.H{"error": "orders_query_failed"})
		return
	}

	c.JSON(200, gin.H{"items": items, "page": page, "limit": limit})
}

func (h *Handler) GetOrder(c *gin.Context) {
	claims, ok := claimUser(c)
	if !ok {
		c.JSON(401, gin.H{"error": "claims_missing"})
		return
	}

	item, err := h.store.GetOrderByUser(c.Request.Context(), claims.Subject, c.Param("id"))
	if err != nil {
		if IsNotFound(err) {
			c.JSON(404, gin.H{"error": "order_not_found"})
			return
		}
		c.JSON(500, gin.H{"error": "order_query_failed"})
		return
	}

	c.JSON(200, item)
}

func claimUser(c *gin.Context) (*middleware.Claims, bool) {
	v, ok := c.Get(middleware.ClaimsKey)
	if !ok {
		return nil, false
	}
	claims, ok := v.(*middleware.Claims)
	if !ok || claims.Subject == "" {
		return nil, false
	}
	return claims, true
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
