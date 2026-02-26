package worker

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

type placementEnvelope struct {
	Decisions []placementDecision `json:"decisions"`
}

type placementDecision struct {
	ProductID  string  `json:"product_id"`
	SupplierID string  `json:"supplier_id"`
	Channel    string  `json:"channel"`
	Score      float64 `json:"score"`
	Reason     string  `json:"reason"`
}

func buildSupplierPlacements(items []supplierDispatchItem, candidatesByProduct map[string][]supplierCandidate) ([]supplierPlacement, error) {
	grouped := map[string]supplierPlacement{}

	for _, item := range items {
		productID := strings.TrimSpace(item.ProductID)
		if productID == "" {
			return nil, fmt.Errorf("%w: missing_product_reference_for_item_%s", ErrPermanent, item.SKU)
		}
		candidates := rankCandidates(candidatesByProduct[productID])
		if len(candidates) == 0 {
			return nil, fmt.Errorf("%w: no_ready_supplier_for_product_%s", ErrPermanent, productID)
		}
		chosen := candidates[0]
		key := chosen.ID

		group := grouped[key]
		group.Supplier = chosen
		group.Score = chosenScore(chosen)
		group.Reason = chosenReason(chosen)
		group.Items = append(group.Items, item)
		grouped[key] = group
	}

	envelope := placementEnvelope{Decisions: make([]placementDecision, 0, len(grouped))}
	out := make([]supplierPlacement, 0, len(grouped))
	for _, group := range grouped {
		out = append(out, group)
		envelope.Decisions = append(envelope.Decisions, placementDecision{
			ProductID:  firstProductID(group.Items),
			SupplierID: group.Supplier.ID,
			Channel:    group.Supplier.Channel,
			Score:      group.Score,
			Reason:     group.Reason,
		})
	}

	blob, err := json.Marshal(envelope)
	if err != nil {
		return nil, err
	}
	validated := placementEnvelope{}
	if err := json.Unmarshal(blob, &validated); err != nil {
		return nil, fmt.Errorf("%w: invalid_placement_schema", ErrPermanent)
	}
	for _, decision := range validated.Decisions {
		if strings.TrimSpace(decision.SupplierID) == "" || strings.TrimSpace(decision.Channel) == "" {
			return nil, fmt.Errorf("%w: empty_decision_fields", ErrPermanent)
		}
	}
	return out, nil
}

func rankCandidates(input []supplierCandidate) []supplierCandidate {
	filtered := make([]supplierCandidate, 0, len(input))
	for _, c := range input {
		if c.Channel == "api" && strings.TrimSpace(c.APIEndpoint) == "" {
			continue
		}
		if c.Channel == "email" && strings.TrimSpace(c.ContactEmail) == "" {
			continue
		}
		filtered = append(filtered, c)
	}
	sort.SliceStable(filtered, func(i, j int) bool {
		left := chosenScore(filtered[i])
		right := chosenScore(filtered[j])
		if left == right {
			return filtered[i].ID < filtered[j].ID
		}
		return left > right
	})
	return filtered
}

func chosenScore(c supplierCandidate) float64 {
	score := 1000.0
	if c.IsPrimary {
		score += 250
	}
	score -= float64(c.Priority) * 5
	score -= float64(c.SLAHours)
	score += c.Rating * 12
	if c.Channel == "api" {
		score += 25
	}
	return score
}

func chosenReason(c supplierCandidate) string {
	return fmt.Sprintf("primary=%t priority=%d sla=%dh channel=%s rating=%.2f", c.IsPrimary, c.Priority, c.SLAHours, c.Channel, c.Rating)
}

func firstProductID(items []supplierDispatchItem) string {
	if len(items) == 0 {
		return ""
	}
	return items[0].ProductID
}
