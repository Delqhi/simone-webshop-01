package ai

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Options struct {
	ProviderURL string
	ProviderKey string
	Model       string
}

type Handler struct {
	store      *Store
	options    Options
	httpClient *http.Client
}

func NewHandler(pool *pgxpool.Pool, options Options) *Handler {
	return &Handler{
		store:   NewStore(pool),
		options: options,
		httpClient: &http.Client{
			Timeout: 12 * time.Second,
		},
	}
}

func (h *Handler) TestProvider(c *gin.Context) {
	var payload map[string]any
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": "invalid_json"})
		return
	}

	jobID, err := h.store.EnqueueProviderTest(c.Request.Context(), payload)
	if err != nil {
		c.JSON(500, gin.H{"error": "ai_test_enqueue_failed"})
		return
	}

	c.JSON(202, gin.H{"status": "queued", "job_id": jobID})
}
