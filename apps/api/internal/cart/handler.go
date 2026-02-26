package cart

import (
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

func (h *Handler) AddItem(c *gin.Context) {
	claims, ok := claimsFromContext(c)
	if !ok {
		c.JSON(401, gin.H{"error": "claims_missing"})
		return
	}

	var in AddItemInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(400, gin.H{"error": "invalid_json"})
		return
	}
	if in.SKU == "" || in.Quantity <= 0 || in.UnitPriceAmount <= 0 {
		c.JSON(400, gin.H{"error": "invalid_cart_item"})
		return
	}

	item, err := h.store.UpsertItem(c.Request.Context(), claims.Subject, in)
	if err != nil {
		c.JSON(500, gin.H{"error": "cart_upsert_failed"})
		return
	}
	c.JSON(201, item)
}

func (h *Handler) PatchItem(c *gin.Context) {
	claims, ok := claimsFromContext(c)
	if !ok {
		c.JSON(401, gin.H{"error": "claims_missing"})
		return
	}

	var in PatchItemInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(400, gin.H{"error": "invalid_json"})
		return
	}
	if in.Quantity <= 0 {
		c.JSON(400, gin.H{"error": "quantity_must_be_positive"})
		return
	}

	item, err := h.store.PatchItem(c.Request.Context(), claims.Subject, c.Param("sku"), in.Quantity)
	if err != nil {
		if IsNotFound(err) {
			c.JSON(404, gin.H{"error": "cart_item_not_found"})
			return
		}
		c.JSON(500, gin.H{"error": "cart_patch_failed"})
		return
	}
	c.JSON(200, item)
}

func (h *Handler) DeleteItem(c *gin.Context) {
	claims, ok := claimsFromContext(c)
	if !ok {
		c.JSON(401, gin.H{"error": "claims_missing"})
		return
	}

	if err := h.store.DeleteItem(c.Request.Context(), claims.Subject, c.Param("sku")); err != nil {
		c.JSON(500, gin.H{"error": "cart_delete_failed"})
		return
	}
	c.JSON(200, gin.H{"status": "deleted", "sku": c.Param("sku")})
}

func claimsFromContext(c *gin.Context) (*middleware.Claims, bool) {
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
