package worker

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const gmailSendScope = "https://www.googleapis.com/auth/gmail.send"

type googleTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
}

func (p *Processor) gmailAccessToken(ctx context.Context) (string, error) {
	p.gmailTokenMu.Lock()
	cached := p.cachedGmailToken
	expires := p.cachedGmailExp
	p.gmailTokenMu.Unlock()

	if cached != "" && time.Now().UTC().Before(expires.Add(-30*time.Second)) {
		return cached, nil
	}

	sa, err := p.loadGoogleServiceAccount()
	if err != nil {
		return "", err
	}
	jwtAssertion, err := buildServiceAccountJWT(sa, strings.TrimSpace(p.options.GmailDelegatedUser), gmailSendScope, time.Now().UTC())
	if err != nil {
		return "", err
	}

	token, ttl, err := requestGoogleAccessToken(ctx, sa.TokenURI, jwtAssertion)
	if err != nil {
		return "", err
	}

	expiry := time.Now().UTC().Add(ttl)
	p.gmailTokenMu.Lock()
	p.cachedGmailToken = token
	p.cachedGmailExp = expiry
	p.gmailTokenMu.Unlock()
	return token, nil
}

func requestGoogleAccessToken(ctx context.Context, tokenURL, jwtAssertion string) (string, time.Duration, error) {
	form := url.Values{}
	form.Set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
	form.Set("assertion", jwtAssertion)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, tokenURL, strings.NewReader(form.Encode()))
	if err != nil {
		return "", 0, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", 0, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		msg := fmt.Sprintf("gmail_token_status_%d", resp.StatusCode)
		if len(respBody) > 0 {
			msg = fmt.Sprintf("%s:%s", msg, sanitizeErrorText(respBody, 300))
		}
		if resp.StatusCode == 400 || resp.StatusCode == 401 || resp.StatusCode == 403 {
			return "", 0, fmt.Errorf("%w: %s", ErrPermanent, msg)
		}
		return "", 0, errors.New(msg)
	}

	var tokenResp googleTokenResponse
	if err := json.Unmarshal(respBody, &tokenResp); err != nil {
		return "", 0, err
	}
	token := strings.TrimSpace(tokenResp.AccessToken)
	if token == "" {
		return "", 0, fmt.Errorf("%w: missing_gmail_access_token", ErrPermanent)
	}
	ttl := time.Duration(tokenResp.ExpiresIn) * time.Second
	if ttl <= 0 {
		ttl = 55 * time.Minute
	}
	return token, ttl, nil
}

func sanitizeErrorText(raw []byte, limit int) string {
	text := strings.TrimSpace(string(raw))
	text = strings.ReplaceAll(text, "\n", " ")
	text = strings.ReplaceAll(text, "\r", " ")
	if len(text) <= limit {
		return text
	}
	return text[:limit]
}
