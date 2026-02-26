package admin

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	store *Store
}

func NewHandler(pool *pgxpool.Pool) *Handler {
	return &Handler{store: NewStore(pool)}
}

func (h *Handler) ListOrders(c *gin.Context) {
	limit := parseInt(c.Query("limit"), 50, 1, 200)
	page := parseInt(c.Query("page"), 1, 1, 100000)
	status := strings.TrimSpace(c.Query("status"))

	items, err := h.store.ListOrders(c.Request.Context(), status, limit, (page-1)*limit)
	if err != nil {
		c.JSON(500, gin.H{"error": "admin_orders_query_failed"})
		return
	}

	c.JSON(200, gin.H{"items": items, "page": page, "limit": limit})
}

func (h *Handler) GetOrder(c *gin.Context) {
	item, err := h.store.GetOrderByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if IsNotFound(err) {
			c.JSON(404, gin.H{"error": "order_not_found"})
			return
		}
		c.JSON(500, gin.H{"error": "admin_order_query_failed"})
		return
	}
	c.JSON(200, item)
}

func (h *Handler) PatchOrder(c *gin.Context) {
	var in PatchOrderInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(400, gin.H{"error": "invalid_json"})
		return
	}

	item, err := h.store.PatchOrder(c.Request.Context(), c.Param("id"), in)
	if err != nil {
		if IsNotFound(err) {
			c.JSON(404, gin.H{"error": "order_not_found"})
			return
		}
		if err.Error() == "empty patch" {
			c.JSON(400, gin.H{"error": "empty_patch"})
			return
		}
		c.JSON(500, gin.H{"error": "admin_order_patch_failed"})
		return
	}

	c.JSON(200, item)
}
