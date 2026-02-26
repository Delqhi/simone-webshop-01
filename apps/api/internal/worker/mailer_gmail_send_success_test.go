package worker

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
)

func TestSendMailWithGmailAPIAndTokenCache(t *testing.T) {
	var tokenHits int32
	tokenServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		atomic.AddInt32(&tokenHits, 1)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"access_token":"tok_123","expires_in":3600}`))
	}))
	defer tokenServer.Close()

	var sendHits int32
	gmailServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		atomic.AddInt32(&sendHits, 1)
		if got := r.Header.Get("Authorization"); got != "Bearer tok_123" {
			t.Fatalf("unexpected auth header: %s", got)
		}
		var body struct {
			Raw string `json:"raw"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Fatalf("decode body failed: %v", err)
		}
		decoded, err := base64.RawURLEncoding.DecodeString(body.Raw)
		if err != nil {
			t.Fatalf("decode raw payload failed: %v", err)
		}
		if !strings.Contains(string(decoded), "Subject: Hallo") {
			t.Fatalf("expected subject in mime payload")
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"id":"gmail-msg-1"}`))
	}))
	defer gmailServer.Close()

	processor := &Processor{
		options: Options{
			GoogleServiceAccountJSONB64: testServiceAccountJSONB64(t, tokenServer.URL),
			GmailDelegatedUser:          "info@um-24.de",
			GmailSenderFrom:             "Simone Shop <info@um-24.de>",
			GmailAPIBaseURL:             gmailServer.URL,
		},
	}

	messageID1, err := processor.sendMail(context.Background(), "buyer@example.com", "Hallo", "Text", nil)
	if err != nil {
		t.Fatalf("first send failed: %v", err)
	}
	messageID2, err := processor.sendMail(context.Background(), "buyer@example.com", "Hallo 2", "Text", nil)
	if err != nil {
		t.Fatalf("second send failed: %v", err)
	}
	if messageID1 == "" || messageID2 == "" {
		t.Fatalf("expected gmail message ids")
	}
	if atomic.LoadInt32(&tokenHits) != 1 {
		t.Fatalf("expected one token hit due to cache, got %d", tokenHits)
	}
	if atomic.LoadInt32(&sendHits) != 2 {
		t.Fatalf("expected two send hits, got %d", sendHits)
	}
}

func TestSendMailMissingConfigIsPermanent(t *testing.T) {
	processor := &Processor{options: Options{}}
	_, err := processor.sendMail(context.Background(), "buyer@example.com", "Hallo", "Text", nil)
	if !errors.Is(err, ErrPermanent) {
		t.Fatalf("expected permanent error, got %v", err)
	}
}
