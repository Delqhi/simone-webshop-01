package admin

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetChannels(c *gin.Context) {
	items, err := h.store.ListChannelAccounts(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "channels_query_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *Handler) StartChannelConnect(c *gin.Context) {
	item, err := h.store.StartChannelConnect(c.Request.Context(), c.Param("channel"))
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_channel"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "channel_connect_start_failed"})
		return
	}
	c.JSON(http.StatusAccepted, item)
}

func (h *Handler) CompleteChannelConnect(c *gin.Context) {
	in := struct {
		StateToken      string         `json:"state_token"`
		AccountExternal string         `json:"account_external_id"`
		AuthSnapshot    map[string]any `json:"auth_snapshot"`
		HealthSnapshot  map[string]any `json:"health_snapshot"`
	}{}
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	item, err := h.store.CompleteChannelConnect(
		c.Request.Context(),
		c.Param("channel"),
		in.StateToken,
		in.AccountExternal,
		in.AuthSnapshot,
		in.HealthSnapshot,
	)
	if err != nil {
		switch err {
		case errInvalidInput:
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_channel_connect_payload"})
		case errBlocked:
			c.JSON(http.StatusConflict, gin.H{"error": "channel_connect_session_invalid"})
		default:
			if strings.Contains(err.Error(), "missing_channel_access_token") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "missing_channel_access_token"})
				return
			}
			if strings.Contains(err.Error(), "missing_channel_endpoints") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "missing_channel_endpoints"})
				return
			}
			if strings.Contains(err.Error(), "invalid_channel_endpoint") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_channel_endpoint"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "channel_connect_complete_failed"})
		}
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) TriggerChannelCatalogSync(c *gin.Context) {
	item, err := h.store.TriggerChannelSync(c.Request.Context(), c.Param("channel"), "catalog", map[string]any{})
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_channel"})
			return
		}
		if err == errKillSwitch {
			c.JSON(http.StatusConflict, gin.H{"error": "channel_sync_kill_switched"})
			return
		}
		if err == errNotConnected {
			c.JSON(http.StatusConflict, gin.H{"error": "channel_not_connected"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "channel_catalog_sync_failed"})
		return
	}
	c.JSON(http.StatusAccepted, item)
}

func (h *Handler) TriggerChannelCampaignPublish(c *gin.Context) {
	body := map[string]any{}
	if c.Request.ContentLength > 0 {
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
			return
		}
	}
	item, err := h.store.TriggerChannelSync(c.Request.Context(), c.Param("channel"), "campaign_publish", body)
	if err != nil {
		if err == errInvalidInput {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_channel"})
			return
		}
		if err == errKillSwitch {
			c.JSON(http.StatusConflict, gin.H{"error": "campaign_publish_kill_switched"})
			return
		}
		if err == errNotConnected {
			c.JSON(http.StatusConflict, gin.H{"error": "channel_not_connected"})
			return
		}
		if err == errBudgetCap {
			c.JSON(http.StatusConflict, gin.H{"error": "budget_cap_exceeded"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "channel_campaign_publish_failed"})
		return
	}
	c.JSON(http.StatusAccepted, item)
}
