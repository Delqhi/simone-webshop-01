package social

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

func (h *Handler) Run(c *gin.Context) {
	target := strings.TrimSpace(c.Param("target"))
	switch target {
	case "trend", "supplier", "social":
		// allowed
	default:
		c.JSON(400, gin.H{"error": "invalid_target"})
		return
	}

	var payload map[string]any
	if err := c.ShouldBindJSON(&payload); err != nil {
		payload = map[string]any{}
	}
	payload["target"] = target

	jobID, err := h.store.EnqueueRun(c.Request.Context(), target, payload)
	if err != nil {
		c.JSON(500, gin.H{"error": "automation_enqueue_failed"})
		return
	}

	c.JSON(202, gin.H{"status": "queued", "target": target, "job_id": jobID})
}
