package analytics

import (
	"net/http"
	"sort"
	"time"

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

func (h *Handler) IngestEvent(c *gin.Context) {
	var in EventInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	if in.Type == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "event_type_required"})
		return
	}
	if in.OccurredAt.IsZero() {
		in.OccurredAt = time.Now().UTC()
	}
	if in.Payload == nil {
		in.Payload = map[string]any{}
	}

	if err := h.store.InsertEvent(
		c.Request.Context(),
		in,
		requestID(c),
		c.GetHeader("user-agent"),
		c.ClientIP(),
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "analytics_insert_failed"})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"status": "accepted"})
}

func requestID(c *gin.Context) string {
	if id := c.GetString(middleware.RequestIDKey); id != "" {
		return id
	}
	return c.GetHeader("x-request-id")
}

func (h *Handler) Funnel(c *gin.Context) {
	hours := parseWindowHours(c.Query("hours"), 24)
	end := time.Now().UTC()
	start := end.Add(-time.Duration(hours) * time.Hour)

	totals, err := h.store.CountByEventType(c.Request.Context(), start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "analytics_funnel_query_failed"})
		return
	}
	bySegment, err := h.store.CountBySegment(c.Request.Context(), start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "analytics_segment_query_failed"})
		return
	}

	funnel := toFunnelMap(totals)
	c.JSON(http.StatusOK, gin.H{
		"windowHours": hours,
		"start":       start,
		"end":         end,
		"totals":      totals,
		"bySegment":   toSegmentMap(bySegment),
		"funnel":      funnel,
		"conversion": gin.H{
			"viewToCart":         ratio(funnel["view_product"], funnel["add_to_cart"]),
			"cartToCheckout":     ratio(funnel["add_to_cart"], funnel["begin_checkout"]),
			"checkoutToPurchase": ratio(funnel["begin_checkout"], funnel["purchase"]),
		},
	})
}

func (h *Handler) Alerts(c *gin.Context) {
	hours := parseWindowHours(c.Query("hours"), 2)
	end := time.Now().UTC()
	currentStart := end.Add(-time.Duration(hours) * time.Hour)
	previousStart := currentStart.Add(-time.Duration(hours) * time.Hour)

	current, err := h.store.CountWindow(c.Request.Context(), currentStart, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "analytics_current_window_failed"})
		return
	}
	previous, err := h.store.CountWindow(c.Request.Context(), previousStart, currentStart)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "analytics_previous_window_failed"})
		return
	}

	alerts := BuildAlerts(current, previous)
	sort.SliceStable(alerts, func(i, j int) bool {
		if alerts[i].Triggered == alerts[j].Triggered {
			return alerts[i].Name < alerts[j].Name
		}
		return alerts[i].Triggered && !alerts[j].Triggered
	})

	c.JSON(http.StatusOK, gin.H{
		"windowHours": hours,
		"current":     current,
		"previous":    previous,
		"alerts":      alerts,
	})
}

func (h *Handler) Experiments(c *gin.Context) {
	hours := parseWindowHours(c.Query("hours"), 24)
	end := time.Now().UTC()
	start := end.Add(-time.Duration(hours) * time.Hour)

	items, err := h.store.ExperimentMetrics(c.Request.Context(), start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "analytics_experiment_query_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"windowHours": hours,
		"start":       start,
		"end":         end,
		"items":       items,
	})
}
