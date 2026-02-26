package promotions

import (
	"strconv"
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

func (h *Handler) ListActive(c *gin.Context) {
	segment := strings.ToLower(strings.TrimSpace(c.Query("segment")))
	if segment != "" && segment != "b2c" && segment != "b2b" {
		c.JSON(400, gin.H{"error": "invalid_segment"})
		return
	}
	placement := strings.ToLower(strings.TrimSpace(c.Query("placement")))
	if placement != "" && placement != "header" && placement != "pdp" && placement != "cart" {
		c.JSON(400, gin.H{"error": "invalid_placement"})
		return
	}
	limit := parseInt(c.Query("limit"), 3, 1, 20)

	items, err := h.store.ListActive(c.Request.Context(), ActivePromotionQuery{
		Segment:   segment,
		Placement: placement,
		Limit:     limit,
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "promotions_active_query_failed"})
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
