package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/MicahParks/keyfunc/v2"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"simone-webshop/apps/api/internal/config"
)

const ClaimsKey = "claims"

type Claims struct {
	Role         string         `json:"role"`
	AppMetadata  map[string]any `json:"app_metadata,omitempty"`
	UserMetadata map[string]any `json:"user_metadata,omitempty"`
	jwt.RegisteredClaims
}

type Authenticator struct {
	cfg  config.Config
	jwks *keyfunc.JWKS
}

func NewAuthenticator(cfg config.Config) (*Authenticator, error) {
	if cfg.SupabaseJWKSURL == "" {
		if cfg.JWTRequired {
			return nil, fmt.Errorf("SUPABASE_JWKS_URL is required when JWT_REQUIRED=true")
		}
		return &Authenticator{cfg: cfg}, nil
	}
	jwks, err := keyfunc.Get(cfg.SupabaseJWKSURL, keyfunc.Options{})
	if err != nil {
		return nil, fmt.Errorf("jwks init failed: %w", err)
	}
	return &Authenticator{cfg: cfg, jwks: jwks}, nil
}

func (a *Authenticator) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer ")
		if token == "" {
			if a.cfg.JWTRequired {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
				c.Abort()
				return
			}
			c.Set(ClaimsKey, &Claims{
				Role: "guest",
				RegisteredClaims: jwt.RegisteredClaims{
					Subject: "guest",
				},
			})
			c.Next()
			return
		}

		claims := &Claims{}
		parserOptions := make([]jwt.ParserOption, 0, 2)
		if strings.TrimSpace(a.cfg.SupabaseIssuer) != "" {
			parserOptions = append(parserOptions, jwt.WithIssuer(a.cfg.SupabaseIssuer))
		}
		if strings.TrimSpace(a.cfg.SupabaseAudience) != "" {
			parserOptions = append(parserOptions, jwt.WithAudience(a.cfg.SupabaseAudience))
		}
		parser := jwt.NewParser(parserOptions...)
		parsed, err := parser.ParseWithClaims(token, claims, a.keyfunc)
		if err != nil || !parsed.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}
		claims.Role = normalizeRole(claims)
		if claims.Role == "" {
			c.JSON(http.StatusForbidden, gin.H{"error": "invalid role"})
			c.Abort()
			return
		}
		c.Set(ClaimsKey, claims)
		c.Next()
	}
}

func (a *Authenticator) keyfunc(t *jwt.Token) (any, error) {
	if a.jwks == nil {
		return nil, errors.New("jwks not configured")
	}
	return a.jwks.Keyfunc(t)
}
