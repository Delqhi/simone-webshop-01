package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) CreateCreator(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	item, err := h.store.CreateCreator(c.Request.Context(), body)
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_creator_payload"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "creator_create_failed"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *Handler) ListAffiliateOffers(c *gin.Context) {
	limit := parseInt(c.Query("limit"), 50, 1, 200)
	page := parseInt(c.Query("page"), 1, 1, 100000)
	items, err := h.store.ListAffiliateOffers(c.Request.Context(), limit, (page-1)*limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "affiliate_offer_list_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items, "page": page, "limit": limit})
}

func (h *Handler) CreateAffiliateOffer(c *gin.Context) {
	body := map[string]any{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	item, err := h.store.CreateAffiliateOffer(c.Request.Context(), body)
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_affiliate_offer_payload"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "affiliate_offer_create_failed"})
		return
	}
	c.JSON(http.StatusCreated, item)
}
