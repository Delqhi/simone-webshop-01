package worker

import (
	"errors"
	"testing"
)

func TestBuildSupplierPlacementsGroupsBySupplier(t *testing.T) {
	items := []supplierDispatchItem{
		{ProductID: "p1", SKU: "sku-1", Quantity: 1},
		{ProductID: "p2", SKU: "sku-2", Quantity: 2},
	}
	candidates := map[string][]supplierCandidate{
		"p1": {
			{ID: "s1", Channel: "email", ContactEmail: "a@example.com", Priority: 1, IsPrimary: true, SLAHours: 24},
		},
		"p2": {
			{ID: "s1", Channel: "email", ContactEmail: "a@example.com", Priority: 2, IsPrimary: true, SLAHours: 24},
			{ID: "s2", Channel: "api", APIEndpoint: "https://api.example.com", Priority: 9, SLAHours: 72},
		},
	}

	placements, err := buildSupplierPlacements(items, candidates)
	if err != nil {
		t.Fatalf("unexpected placement error: %v", err)
	}
	if len(placements) != 1 {
		t.Fatalf("expected one supplier group, got %d", len(placements))
	}
	if placements[0].Supplier.ID != "s1" {
		t.Fatalf("expected supplier s1, got %s", placements[0].Supplier.ID)
	}
	if len(placements[0].Items) != 2 {
		t.Fatalf("expected two items in grouped supplier order, got %d", len(placements[0].Items))
	}
}

func TestBuildSupplierPlacementsFailsWhenNoSupplierReady(t *testing.T) {
	items := []supplierDispatchItem{{ProductID: "p1", SKU: "sku-1", Quantity: 1}}
	_, err := buildSupplierPlacements(items, map[string][]supplierCandidate{"p1": {}})
	if err == nil {
		t.Fatalf("expected no supplier error")
	}
	if !errors.Is(err, ErrPermanent) {
		t.Fatalf("expected permanent error, got %v", err)
	}
}
