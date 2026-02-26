package worker

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSendMailGmailForbiddenIsPermanent(t *testing.T) {
	tokenServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"access_token":"tok_123","expires_in":3600}`))
	}))
	defer tokenServer.Close()

	gmailServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusForbidden)
		_, _ = w.Write([]byte(`{"error":"forbidden"}`))
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

	_, err := processor.sendMail(context.Background(), "buyer@example.com", "Hallo", "Text", nil)
	if err == nil {
		t.Fatalf("expected error")
	}
	if !errors.Is(err, ErrPermanent) {
		t.Fatalf("expected permanent error, got %v", err)
	}
}
