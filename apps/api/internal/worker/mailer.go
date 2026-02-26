package worker

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"net/mail"
	"strings"
	"time"

	"github.com/google/uuid"
)

type mailAttachment struct {
	Filename    string
	ContentType string
	Data        []byte
}

func (p *Processor) sendMail(ctx context.Context, to, subject, body string, attachments []mailAttachment) (string, error) {
	if strings.TrimSpace(to) == "" {
		return "", fmt.Errorf("%w: missing_recipient", ErrPermanent)
	}
	if !p.gmailConfigured() {
		return "", fmt.Errorf("%w: gmail_not_configured", ErrPermanent)
	}

	fromHeader := strings.TrimSpace(p.options.GmailSenderFrom)
	messageID := fmt.Sprintf("<%s@simone-shop>", uuid.NewString())
	message := buildMailMessage(fromHeader, to, subject, messageID, body, attachments)

	gmailMessageID, err := p.gmailSendRawMessage(ctx, message)
	if err != nil {
		return "", err
	}
	return gmailMessageID, nil
}

func buildMailMessage(from, to, subject, messageID, body string, attachments []mailAttachment) []byte {
	var buf bytes.Buffer
	buf.WriteString(fmt.Sprintf("From: %s\r\n", from))
	buf.WriteString(fmt.Sprintf("To: %s\r\n", to))
	buf.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	buf.WriteString(fmt.Sprintf("Message-ID: %s\r\n", messageID))
	buf.WriteString("MIME-Version: 1.0\r\n")

	if len(attachments) == 0 {
		buf.WriteString("Content-Type: text/plain; charset=UTF-8\r\n\r\n")
		buf.WriteString(body)
		return buf.Bytes()
	}

	boundary := fmt.Sprintf("simone-%d", time.Now().UnixNano())
	buf.WriteString(fmt.Sprintf("Content-Type: multipart/mixed; boundary=%s\r\n\r\n", boundary))
	buf.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	buf.WriteString("Content-Type: text/plain; charset=UTF-8\r\n\r\n")
	buf.WriteString(body)
	buf.WriteString("\r\n")

	for _, attachment := range attachments {
		buf.WriteString(fmt.Sprintf("--%s\r\n", boundary))
		buf.WriteString(fmt.Sprintf("Content-Type: %s; name=%q\r\n", attachment.ContentType, attachment.Filename))
		buf.WriteString("Content-Transfer-Encoding: base64\r\n")
		buf.WriteString(fmt.Sprintf("Content-Disposition: attachment; filename=%q\r\n\r\n", attachment.Filename))
		encoded := base64.StdEncoding.EncodeToString(attachment.Data)
		for len(encoded) > 76 {
			buf.WriteString(encoded[:76] + "\r\n")
			encoded = encoded[76:]
		}
		buf.WriteString(encoded + "\r\n")
	}

	buf.WriteString(fmt.Sprintf("--%s--\r\n", boundary))
	return buf.Bytes()
}

func extractAddress(raw string) string {
	parsed, err := mail.ParseAddress(raw)
	if err != nil {
		return strings.TrimSpace(raw)
	}
	return parsed.Address
}
