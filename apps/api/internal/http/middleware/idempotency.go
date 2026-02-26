package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func RequireIdempotency() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == http.MethodPost || c.Request.Method == http.MethodPatch {
			key := strings.TrimSpace(c.GetHeader("Idempotency-Key"))
			if key == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "missing Idempotency-Key"})
				c.Abort()
				return
			}
		}
		c.Next()
	}
}
