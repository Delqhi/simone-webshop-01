package worker

import (
	"fmt"
	"strings"
)

func buildOrderConfirmationEmail(order *orderAggregate, invoice *invoiceRecord) (string, string) {
	subject := fmt.Sprintf("Bestellbestätigung %s", order.ID)
	lines := []string{
		fmt.Sprintf("Hallo %s,", fullNameFromShipping(order.shippingAddressMap())),
		"",
		"vielen Dank für deine Bestellung bei Simone Shop.",
		fmt.Sprintf("Bestellnummer: %s", order.ID),
		fmt.Sprintf("Rechnungsnummer: %s", invoice.InvoiceNumber),
		fmt.Sprintf("Gesamtbetrag: %s", amountEUR(order.TotalAmount)),
		"",
		"Wir informieren dich per E-Mail, sobald der Versand startet.",
		"",
		"Viele Grüße",
		"Simone Shop",
	}
	return subject, strings.Join(lines, "\n")
}

func buildInvoiceEmail(order *orderAggregate, invoice *invoiceRecord) (string, string) {
	subject := fmt.Sprintf("Rechnung %s zu Bestellung %s", invoice.InvoiceNumber, order.ID)
	lines := []string{
		fmt.Sprintf("Hallo %s,", fullNameFromShipping(order.shippingAddressMap())),
		"",
		"anbei erhältst du deine Rechnung als PDF-Anhang.",
		fmt.Sprintf("Rechnungsnummer: %s", invoice.InvoiceNumber),
		fmt.Sprintf("Bestellnummer: %s", order.ID),
		fmt.Sprintf("Gesamtbetrag: %s", amountEUR(invoice.Total)),
		"",
		"Viele Grüße",
		"Simone Shop",
	}
	return subject, strings.Join(lines, "\n")
}

func buildShipmentEmail(orderID, status, trackingNumber, trackingURL string) (string, string) {
	subject := fmt.Sprintf("Versandupdate %s (%s)", orderID, status)
	lines := []string{
		"Deine Bestellung hat ein neues Versandupdate.",
		fmt.Sprintf("Bestellnummer: %s", orderID),
		fmt.Sprintf("Status: %s", status),
	}
	if trackingNumber != "" {
		lines = append(lines, fmt.Sprintf("Trackingnummer: %s", trackingNumber))
	}
	if trackingURL != "" {
		lines = append(lines, fmt.Sprintf("Tracking-Link: %s", trackingURL))
	}
	lines = append(lines, "", "Viele Grüße", "Simone Shop")
	return subject, strings.Join(lines, "\n")
}
