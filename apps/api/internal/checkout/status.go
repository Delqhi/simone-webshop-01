package checkout

func paymentStateFromStatuses(paymentStatus, checkoutStatus string) string {
	if paymentStatus == "paid" {
		return "paid"
	}
	if paymentStatus == "payment_failed" || paymentStatus == "failed" {
		return "failed"
	}
	if checkoutStatus == "payment_failed" {
		return "failed"
	}
	return "pending"
}

func toSessionStatusResponse(row *CheckoutSessionStatusRecord) SessionStatusResponse {
	return SessionStatusResponse{
		OrderID:         row.OrderID,
		StripeSessionID: row.StripeSessionID,
		CheckoutURL:     row.CheckoutURL,
		CheckoutStatus:  row.CheckoutStatus,
		PaymentStatus:   row.PaymentStatus,
		OrderStatus:     row.OrderStatus,
		PaymentState:    paymentStateFromStatuses(row.PaymentStatus, row.CheckoutStatus),
	}
}
