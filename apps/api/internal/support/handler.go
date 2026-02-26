package support

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

func (h *Handler) ListTickets(c *gin.Context) {
	limit := parseInt(c.Query("limit"), 50, 1, 200)
	page := parseInt(c.Query("page"), 1, 1, 100000)

	items, err := h.store.ListTickets(c.Request.Context(), c.Query("status"), c.Query("priority"), limit, (page-1)*limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "support_tickets_query_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items, "page": page, "limit": limit})
}

func (h *Handler) CreateTicket(c *gin.Context) {
	var payload struct {
		Email    string         `json:"email"`
		Subject  string         `json:"subject"`
		Message  string         `json:"message"`
		Metadata map[string]any `json:"metadata"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	if payload.Subject == "" || payload.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "subject_and_message_required"})
		return
	}

	customerID := ""
	if claims, ok := claimUser(c); ok {
		cid, err := h.store.FindCustomerByUser(c.Request.Context(), claims.Subject)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "support_customer_lookup_failed"})
			return
		}
		customerID = cid
	}

	item, err := h.store.CreateTicket(c.Request.Context(), customerID, payload.Email, payload.Subject, payload.Message, payload.Metadata)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "support_ticket_create_failed"})
		return
	}

	c.JSON(http.StatusCreated, item)
}

func (h *Handler) PatchTicket(c *gin.Context) {
	patch := map[string]any{}
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}

	item, err := h.store.UpdateTicket(c.Request.Context(), c.Param("id"), patch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "support_ticket_update_failed"})
		return
	}

	c.JSON(http.StatusOK, item)
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
