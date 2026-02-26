package checkout

import "testing"

func TestNormalizeAndValidateSessionRequest(t *testing.T) {
	req := SessionRequest{
		Email:    "buyer@example.com",
		Currency: "eur",
		Items: []SessionItem{
			{SKU: "sku-a", Quantity: 1},
		},
		ShippingAddress: ShippingAddress{
			FirstName: "Max",
			LastName:  "Mustermann",
			Street1:   "Hauptstr. 1",
			City:      "Berlin",
			Zip:       "10115",
			Country:   "DE",
		},
	}
	if err := normalizeAndValidateSessionRequest(&req); err != nil {
		t.Fatalf("expected valid request, got %v", err)
	}
	if req.Currency != "EUR" {
		t.Fatalf("expected normalized currency EUR, got %q", req.Currency)
	}
}

func TestNormalizeAndValidateSessionRequestRejectsMissingAddress(t *testing.T) {
	req := SessionRequest{
		Email:    "buyer@example.com",
		Currency: "EUR",
		Items:    []SessionItem{{SKU: "sku-a", Quantity: 1}},
	}
	if err := normalizeAndValidateSessionRequest(&req); err != errInvalidShippingAddress {
		t.Fatalf("expected errInvalidShippingAddress, got %v", err)
	}
}

func TestBuildPricedItemsAndShippingRule(t *testing.T) {
	products := map[string]CatalogProduct{
		"sku-a": {ID: "prod-a", SKU: "sku-a", Name: "A", UnitPriceAmount: 2500},
		"sku-b": {ID: "prod-b", SKU: "sku-b", Name: "B", UnitPriceAmount: 3000},
	}
	items := []SessionItem{
		{SKU: "sku-a", Quantity: 1},
		{SKU: "sku-b", Quantity: 1},
	}
	priced, subtotal, err := buildPricedItems(items, products)
	if err != nil {
		t.Fatalf("unexpected pricing error: %v", err)
	}
	if len(priced) != 2 {
		t.Fatalf("expected 2 priced items, got %d", len(priced))
	}
	if subtotal != 5500 {
		t.Fatalf("expected subtotal 5500, got %d", subtotal)
	}
	if shippingAmountForSubtotal(subtotal) != 0 {
		t.Fatalf("expected free shipping for subtotal >= 5000")
	}
	if shippingAmountForSubtotal(4999) != 499 {
		t.Fatalf("expected shipping 499 below threshold")
	}
}
