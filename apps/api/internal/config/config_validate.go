package config

import (
	"fmt"
	"net/url"
	"strings"
)

func (c Config) ValidateAPI() error {
	problems := []string{}

	if strings.TrimSpace(c.DatabaseURL) == "" {
		problems = append(problems, "DATABASE_URL is required")
	}
	if len(c.CORSAllowlist) == 0 {
		problems = append(problems, "CORS_ALLOWLIST must contain at least one origin")
	}
	for _, origin := range c.CORSAllowlist {
		parsed, err := url.Parse(origin)
		if err != nil || parsed.Scheme == "" || parsed.Host == "" {
			problems = append(problems, fmt.Sprintf("invalid CORS origin %q", origin))
			continue
		}
		if c.Environment == "production" && strings.Contains(parsed.Host, "localhost") {
			problems = append(problems, fmt.Sprintf("localhost origin not allowed in production: %q", origin))
		}
	}

	if c.JWTRequired {
		if strings.TrimSpace(c.SupabaseJWKSURL) == "" {
			problems = append(problems, "SUPABASE_JWKS_URL is required when JWT_REQUIRED=true")
		}
		if strings.TrimSpace(c.SupabaseIssuer) == "" {
			problems = append(problems, "SUPABASE_ISSUER is required when JWT_REQUIRED=true")
		}
		if strings.TrimSpace(c.SupabaseAudience) == "" {
			problems = append(problems, "SUPABASE_AUDIENCE is required when JWT_REQUIRED=true")
		}
	}

	if c.Environment == "production" {
		required := map[string]string{
			"STRIPE_SECRET_KEY":     c.StripeSecretKey,
			"STRIPE_WEBHOOK_SECRET": c.StripeWebhookKey,
			"SITE_URL":              c.SiteURL,
			"SUPPLIER_WEBHOOK_SECRET": c.SupplierWebhookSecret,
		}
		appendMissing(&problems, required)
	}

	return validateProblems("API", problems)
}

func (c Config) ValidateWorker() error {
	problems := []string{}
	if strings.TrimSpace(c.DatabaseURL) == "" {
		problems = append(problems, "DATABASE_URL is required")
	}
	if c.Environment == "production" {
		if strings.TrimSpace(c.GoogleServiceAccountJSONB64) == "" && strings.TrimSpace(c.GoogleServiceAccountFile) == "" {
			problems = append(problems, "GOOGLE_SERVICE_ACCOUNT_JSON_B64 or GOOGLE_SERVICE_ACCOUNT_FILE is required")
		}
		required := map[string]string{
			"GMAIL_DELEGATED_USER": c.GmailDelegatedUser,
			"GMAIL_SENDER_FROM":    c.GmailSenderFrom,
			"BILLING_COMPANY_NAME": c.BillingCompanyName,
			"BILLING_ADDRESS":      c.BillingAddress,
			"BILLING_TAX_ID":       c.BillingTaxID,
			"BILLING_VAT_ID":       c.BillingVATID,
		}
		appendMissing(&problems, required)
		if strings.TrimSpace(c.GmailAPIBaseURL) == "" {
			problems = append(problems, "GMAIL_API_BASE_URL must be set")
		} else if parsed, err := url.Parse(c.GmailAPIBaseURL); err != nil || parsed.Scheme == "" || parsed.Host == "" {
			problems = append(problems, "GMAIL_API_BASE_URL must be a valid URL")
		}
	}
	return validateProblems("worker", problems)
}

func appendMissing(problems *[]string, required map[string]string) {
	for key, value := range required {
		if strings.TrimSpace(value) == "" {
			*problems = append(*problems, fmt.Sprintf("%s is required", key))
		}
	}
}

func validateProblems(scope string, problems []string) error {
	if len(problems) == 0 {
		return nil
	}
	return fmt.Errorf("invalid %s configuration: %s", scope, strings.Join(problems, "; "))
}
