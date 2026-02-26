package worker

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type gmailSendMessageRequest struct {
	Raw string `json:"raw"`
}

type gmailSendMessageResponse struct {
	ID string `json:"id"`
}

func (p *Processor) gmailSendRawMessage(ctx context.Context, message []byte) (string, error) {
	accessToken, err := p.gmailAccessToken(ctx)
	if err != nil {
		return "", err
	}

	payload, _ := json.Marshal(gmailSendMessageRequest{
		Raw: base64.RawURLEncoding.EncodeToString(message),
	})
	endpoint := p.gmailBaseURL() + "/gmail/v1/users/me/messages/send"

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(payload))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 20 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		message := fmt.Sprintf("gmail_send_status_%d", resp.StatusCode)
		if len(respBody) > 0 {
			message = fmt.Sprintf("%s:%s", message, sanitizeErrorText(respBody, 300))
		}
		if resp.StatusCode == 400 || resp.StatusCode == 401 || resp.StatusCode == 403 {
			return "", fmt.Errorf("%w: %s", ErrPermanent, message)
		}
		return "", errors.New(message)
	}

	var sendResp gmailSendMessageResponse
	if err := json.Unmarshal(respBody, &sendResp); err != nil {
		return "", err
	}
	if strings.TrimSpace(sendResp.ID) == "" {
		return "", fmt.Errorf("%w: missing_gmail_message_id", ErrPermanent)
	}
	return sendResp.ID, nil
}
