package ai

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const chatSystemPrompt = `Du bist der KI-Assistent für Simone Shop.
Du antwortest auf Deutsch, konkret, hilfreich und kurz.
Nutze keine erfundenen Bestelldaten.
Wenn Daten fehlen, sage das transparent und gib den nächsten sinnvollen Schritt an.`

type chatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type chatRequest struct {
	Messages []chatMessage `json:"messages"`
	Context  struct {
		SessionID string `json:"session_id"`
		UserID    string `json:"user_id"`
	} `json:"context"`
}

func (h *Handler) Chat(c *gin.Context) {
	var in chatRequest
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(400, gin.H{"error": "invalid_json"})
		return
	}
	if len(in.Messages) == 0 {
		c.JSON(400, gin.H{"error": "messages_required"})
		return
	}

	latest := strings.TrimSpace(in.Messages[len(in.Messages)-1].Content)
	if latest == "" {
		c.JSON(400, gin.H{"error": "empty_message"})
		return
	}

	reply, provider, err := h.generateChatReply(c.Request.Context(), in.Messages)
	if err != nil {
		reply = fallbackReply(latest)
		provider = "local"
	}
	sessionID := strings.TrimSpace(in.Context.SessionID)
	if sessionID == "" {
		sessionID = uuid.NewString()
	}

	eventID, enqueueErr := h.store.EnqueueChatRequested(c.Request.Context(), sessionID, map[string]any{
		"session_id": sessionID,
		"user_id":    strings.TrimSpace(in.Context.UserID),
		"message":    latest,
		"response":   reply,
		"provider":   provider,
	})
	if enqueueErr != nil {
		c.JSON(500, gin.H{"error": "ai_chat_event_enqueue_failed"})
		return
	}

	c.JSON(200, gin.H{
		"success":  true,
		"message":  reply,
		"provider": provider,
		"event_id": eventID,
	})
}

func fallbackReply(message string) string {
	lower := strings.ToLower(message)
	switch {
	case strings.Contains(lower, "versand"):
		return "Der Standardversand dauert in der Regel 2-4 Werktage. Ab 50 EUR ist der Versand kostenlos."
	case strings.Contains(lower, "rückgabe"), strings.Contains(lower, "retoure"):
		return "Du kannst Artikel innerhalb von 30 Tagen zurückgeben. Der Support hilft dir direkt bei der Abwicklung."
	case strings.Contains(lower, "bestellung"), strings.Contains(lower, "order"):
		return "Wenn du mir deine Bestellnummer gibst, kann ich dir die nächsten Schritte und Support-Optionen zeigen."
	default:
		return "Ich helfe dir gern bei Produktwahl, Versand, Bestellung und Rückgabe. Was ist dir gerade am wichtigsten?"
	}
}
