package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequireRoles(roles ...string) gin.HandlerFunc {
	allow := map[string]struct{}{}
	for _, r := range roles {
		allow[r] = struct{}{}
	}

	return func(c *gin.Context) {
		v, ok := c.Get(ClaimsKey)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "claims missing"})
			c.Abort()
			return
		}
		claims, ok := v.(*Claims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "claims invalid"})
			c.Abort()
			return
		}
		if _, ok := allow[claims.Role]; !ok {
			c.JSON(http.StatusForbidden, gin.H{"error": "insufficient role"})
			c.Abort()
			return
		}
		c.Next()
	}
}
