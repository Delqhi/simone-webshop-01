package worker

type Options struct {
	GoogleServiceAccountJSONB64 string
	GoogleServiceAccountFile    string
	GmailDelegatedUser          string
	GmailSenderFrom             string
	GmailAPIBaseURL             string

	BillingCompanyName string
	BillingAddress     string
	BillingTaxID       string
	BillingVATID       string
	InvoiceOutputDir   string

	N8NWebhookURL   string
	N8NSharedSecret string
}
