package middleware

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func AuditMutations(scope string) gin.HandlerFunc {
	return func(c *gin.Context) {
		switch c.Request.Method {
		case http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete:
		default:
			c.Next()
			return
		}

		c.Next()

		subject := "unknown"
		role := "unknown"
		if raw, ok := c.Get(ClaimsKey); ok {
			if claims, ok := raw.(*Claims); ok {
				if claims.Subject != "" {
					subject = claims.Subject
				}
				if claims.Role != "" {
					role = claims.Role
				}
			}
		}

		entry := map[string]any{
			"ts":         time.Now().UTC().Format(time.RFC3339Nano),
			"event":      "audit_mutation",
			"scope":      scope,
			"method":     c.Request.Method,
			"path":       c.Request.URL.Path,
			"status":     c.Writer.Status(),
			"request_id": c.GetString(RequestIDKey),
			"actor_id":   subject,
			"actor_role": role,
		}
		if data, err := json.Marshal(entry); err == nil {
			log.Print(string(data))
			return
		}
		log.Printf("audit_mutation scope=%s method=%s path=%s status=%d request_id=%s actor_id=%s actor_role=%s",
			scope, c.Request.Method, c.Request.URL.Path, c.Writer.Status(), c.GetString(RequestIDKey), subject, role)
	}
}
