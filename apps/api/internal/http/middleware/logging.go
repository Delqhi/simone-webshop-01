package middleware

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func Logging() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)

		record := map[string]any{
			"ts":         time.Now().UTC().Format(time.RFC3339Nano),
			"method":     c.Request.Method,
			"path":       c.Request.URL.Path,
			"status":     c.Writer.Status(),
			"latency_ms": float64(latency.Microseconds()) / 1000.0,
			"request_id": c.GetString(RequestIDKey),
			"client_ip":  c.ClientIP(),
			"user_agent": c.Request.UserAgent(),
		}
		if body, err := json.Marshal(record); err == nil {
			log.Print(string(body))
			return
		}
		log.Printf("method=%s path=%s status=%d latency=%s request_id=%s",
			c.Request.Method, c.Request.URL.Path, c.Writer.Status(), latency.String(), c.GetString(RequestIDKey))
	}
}
