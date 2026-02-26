package account

import (
	"net/http"

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

func (h *Handler) GetMe(c *gin.Context) {
	claims, ok := claimUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "claims_missing"})
		return
	}

	profile, err := h.store.GetByUserID(c.Request.Context(), claims.Subject)
	if err != nil {
		if IsNotFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "account_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "account_query_failed"})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func (h *Handler) PatchMe(c *gin.Context) {
	claims, ok := claimUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "claims_missing"})
		return
	}

	var in UpdateInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}

	profile, err := h.store.PatchByUserID(c.Request.Context(), claims.Subject, in)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "account_update_failed"})
		return
	}

	c.JSON(http.StatusOK, profile)
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
