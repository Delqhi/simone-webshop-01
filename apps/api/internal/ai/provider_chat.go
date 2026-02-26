package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

type providerResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func (h *Handler) generateChatReply(ctx context.Context, messages []chatMessage) (string, string, error) {
	providerKey := strings.TrimSpace(h.options.ProviderKey)
	providerURL := strings.TrimSpace(h.options.ProviderURL)
	if providerKey == "" || providerURL == "" {
		return "", "", errors.New("provider_not_configured")
	}

	trimmed := make([]map[string]string, 0, len(messages)+1)
	trimmed = append(trimmed, map[string]string{
		"role":    "system",
		"content": chatSystemPrompt,
	})
	for _, message := range messages {
		role := strings.TrimSpace(message.Role)
		content := strings.TrimSpace(message.Content)
		if role == "" || content == "" {
			continue
		}
		trimmed = append(trimmed, map[string]string{"role": role, "content": content})
	}
	if len(trimmed) <= 1 {
		return "", "", errors.New("no_valid_messages")
	}

	body, err := json.Marshal(map[string]any{
		"model":       strings.TrimSpace(h.options.Model),
		"messages":    trimmed,
		"temperature": 0.4,
		"max_tokens":  500,
		"stream":      false,
	})
	if err != nil {
		return "", "", err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, providerURL, bytes.NewReader(body))
	if err != nil {
		return "", "", err
	}
	req.Header.Set("Authorization", "Bearer "+providerKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := h.httpClient.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", "", errors.New("provider_non_2xx")
	}

	var parsed providerResponse
	if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
		return "", "", err
	}
	if len(parsed.Choices) == 0 {
		return "", "", errors.New("provider_empty_choices")
	}

	reply := strings.TrimSpace(parsed.Choices[0].Message.Content)
	if reply == "" {
		return "", "", errors.New("provider_empty_reply")
	}
	return reply, "opencode", nil
}
