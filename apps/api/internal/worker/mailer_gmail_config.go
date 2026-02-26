package worker

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

type googleServiceAccount struct {
	ClientEmail string `json:"client_email"`
	PrivateKey  string `json:"private_key"`
	TokenURI    string `json:"token_uri"`
}

func (p *Processor) gmailConfigured() bool {
	if strings.TrimSpace(p.options.GmailDelegatedUser) == "" || strings.TrimSpace(p.options.GmailSenderFrom) == "" {
		return false
	}
	return strings.TrimSpace(p.options.GoogleServiceAccountJSONB64) != "" || strings.TrimSpace(p.options.GoogleServiceAccountFile) != ""
}

func (p *Processor) loadGoogleServiceAccount() (*googleServiceAccount, error) {
	raw := strings.TrimSpace(p.options.GoogleServiceAccountJSONB64)
	if raw != "" {
		decoded, err := base64.StdEncoding.DecodeString(raw)
		if err != nil {
			return nil, fmt.Errorf("%w: invalid_service_account_b64", ErrPermanent)
		}
		return decodeServiceAccount(decoded)
	}

	filePath := strings.TrimSpace(p.options.GoogleServiceAccountFile)
	if filePath == "" {
		return nil, fmt.Errorf("%w: missing_service_account_credentials", ErrPermanent)
	}
	content, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("%w: service_account_file_read_failed", ErrPermanent)
	}
	return decodeServiceAccount(content)
}

func decodeServiceAccount(raw []byte) (*googleServiceAccount, error) {
	var sa googleServiceAccount
	if err := json.Unmarshal(raw, &sa); err != nil {
		return nil, fmt.Errorf("%w: invalid_service_account_json", ErrPermanent)
	}
	sa.ClientEmail = strings.TrimSpace(sa.ClientEmail)
	sa.PrivateKey = strings.TrimSpace(sa.PrivateKey)
	sa.TokenURI = strings.TrimSpace(sa.TokenURI)
	if sa.TokenURI == "" {
		sa.TokenURI = "https://oauth2.googleapis.com/token"
	}
	if sa.ClientEmail == "" || sa.PrivateKey == "" {
		return nil, fmt.Errorf("%w: incomplete_service_account_credentials", ErrPermanent)
	}
	return &sa, nil
}

func (p *Processor) gmailBaseURL() string {
	base := strings.TrimSpace(p.options.GmailAPIBaseURL)
	if base == "" {
		return "https://gmail.googleapis.com"
	}
	return strings.TrimSuffix(base, "/")
}
