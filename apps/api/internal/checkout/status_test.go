package checkout

import "testing"

func TestPaymentStateFromStatuses(t *testing.T) {
	tests := []struct {
		name           string
		paymentStatus  string
		checkoutStatus string
		expected       string
	}{
		{
			name:           "paid from payment status",
			paymentStatus:  "paid",
			checkoutStatus: "requires_payment",
			expected:       "paid",
		},
		{
			name:           "failed from checkout status",
			paymentStatus:  "pending",
			checkoutStatus: "payment_failed",
			expected:       "failed",
		},
		{
			name:           "pending default",
			paymentStatus:  "pending",
			checkoutStatus: "requires_payment",
			expected:       "pending",
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			got := paymentStateFromStatuses(tc.paymentStatus, tc.checkoutStatus)
			if got != tc.expected {
				t.Fatalf("expected %q, got %q", tc.expected, got)
			}
		})
	}
}
