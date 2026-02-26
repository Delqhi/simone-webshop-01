package suppliers

import "testing"

func TestVerifySignatureAcceptsValidHMAC(t *testing.T) {
	secret := "test-secret"
	body := []byte(`{"order_id":"o1","status":"shipped"}`)
	header := "sha256=0246576dcea7641446d4b03cf293d8e05a9853d6a75773b0f23b3c1dbc588ccd"
	if !verifySignature(secret, body, header) {
		t.Fatalf("expected valid signature")
	}
}

func TestVerifySignatureRejectsInvalidSignature(t *testing.T) {
	secret := "test-secret"
	body := []byte(`{"order_id":"o1","status":"shipped"}`)
	header := "sha256=deadbeef"
	if verifySignature(secret, body, header) {
		t.Fatalf("expected invalid signature")
	}
}

func TestVerifySignatureAllowsMissingSecretForDev(t *testing.T) {
	if !verifySignature("", []byte(`{}`), "") {
		t.Fatalf("expected permissive behavior when no secret configured")
	}
}
