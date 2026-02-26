package checkout

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"simone-webshop/apps/api/internal/http/middleware"
)

type Handler struct {
	store   *Store
	stripe  *StripeClient
	options Options
}

func NewHandler(pool *pgxpool.Pool, options Options) *Handler {
	return &Handler{
		store:   NewStore(pool),
		stripe:  NewStripeClient(options.StripeSecretKey),
		options: options,
	}
}

func customerIDFromContext(c *gin.Context) string {
	v, ok := c.Get(middleware.ClaimsKey)
	if !ok {
		return ""
	}
	claims, ok := v.(*middleware.Claims)
	if !ok || claims.Subject == "" {
		return ""
	}
	if _, err := uuid.Parse(claims.Subject); err != nil {
		return ""
	}
	return claims.Subject
}
