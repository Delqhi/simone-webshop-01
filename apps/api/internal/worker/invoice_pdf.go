package worker

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func buildInvoicePDF(order *orderAggregate, invoiceNumber string, opts Options) []byte {
	lines := []string{
		opts.BillingCompanyName,
		opts.BillingAddress,
		fmt.Sprintf("Steuer-Nr: %s | USt-IdNr: %s", opts.BillingTaxID, opts.BillingVATID),
		"",
		fmt.Sprintf("Rechnung %s", invoiceNumber),
		fmt.Sprintf("Rechnungsdatum: %s", time.Now().UTC().Format("02.01.2006")),
		fmt.Sprintf("Leistungsdatum: %s", time.Now().UTC().Format("02.01.2006")),
		fmt.Sprintf("Bestellung: %s", order.ID),
		"",
		fmt.Sprintf("Kunde: %s", fullNameFromShipping(order.shippingAddressMap())),
		fmt.Sprintf("E-Mail: %s", order.Email),
		"",
	}

	for _, item := range order.Items {
		lineTotal := item.Quantity * item.UnitPriceAmount
		lines = append(lines, fmt.Sprintf("%dx %s (%s)  %s", item.Quantity, item.Title, item.SKU, amountEUR(lineTotal)))
	}

	lines = append(lines,
		"",
		fmt.Sprintf("Zwischensumme (brutto): %s", amountEUR(order.SubtotalAmount)),
		fmt.Sprintf("Versand (brutto): %s", amountEUR(order.ShippingAmount)),
		fmt.Sprintf("Enthaltene MwSt (19%%): %s", amountEUR(order.TaxAmount)),
		fmt.Sprintf("Gesamt (brutto): %s", amountEUR(order.TotalAmount)),
	)

	stream := buildPDFTextStream(lines)
	return buildSinglePagePDF(stream)
}

func writeInvoicePDF(outputDir, invoiceNumber string, pdf []byte) (string, string, error) {
	dir := strings.TrimSpace(outputDir)
	if dir == "" {
		dir = "/tmp/simone-invoices"
	}
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", "", err
	}

	filename := strings.ReplaceAll(invoiceNumber, "/", "-") + ".pdf"
	fullPath := filepath.Join(dir, filename)
	if err := os.WriteFile(fullPath, pdf, 0o644); err != nil {
		return "", "", err
	}

	sum := sha256.Sum256(pdf)
	return fullPath, hex.EncodeToString(sum[:]), nil
}

func buildPDFTextStream(lines []string) string {
	var b strings.Builder
	b.WriteString("BT\n/F1 11 Tf\n50 790 Td\n")
	for _, line := range lines {
		b.WriteString(fmt.Sprintf("(%s) Tj\n0 -15 Td\n", escapePDFLine(line)))
	}
	b.WriteString("ET\n")
	return b.String()
}

func buildSinglePagePDF(stream string) []byte {
	objects := []string{
		"<< /Type /Catalog /Pages 2 0 R >>",
		"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
		"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
		fmt.Sprintf("<< /Length %d >>\nstream\n%sendstream", len(stream), stream),
	}

	var out strings.Builder
	out.WriteString("%PDF-1.4\n")
	offsets := []int{0}
	for i, obj := range objects {
		offsets = append(offsets, out.Len())
		out.WriteString(fmt.Sprintf("%d 0 obj\n%s\nendobj\n", i+1, obj))
	}
	xrefOffset := out.Len()
	out.WriteString(fmt.Sprintf("xref\n0 %d\n", len(objects)+1))
	out.WriteString("0000000000 65535 f \n")
	for i := 1; i < len(offsets); i++ {
		out.WriteString(fmt.Sprintf("%010d 00000 n \n", offsets[i]))
	}
	out.WriteString(fmt.Sprintf("trailer\n<< /Size %d /Root 1 0 R >>\n", len(objects)+1))
	out.WriteString(fmt.Sprintf("startxref\n%d\n%%%%EOF\n", xrefOffset))
	return []byte(out.String())
}

func escapePDFLine(raw string) string {
	s := strings.ReplaceAll(raw, "\\", "\\\\")
	s = strings.ReplaceAll(s, "(", "\\(")
	s = strings.ReplaceAll(s, ")", "\\)")
	return s
}

func amountEUR(cents int) string {
	return fmt.Sprintf("%.2f EUR", float64(cents)/100.0)
}
