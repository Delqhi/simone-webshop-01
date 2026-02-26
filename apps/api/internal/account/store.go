package account

import (
	"encoding/json"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

func toOptional(value string) *string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}

func metadataToStrings(raw []byte) (company, vatID, purchaseOrderRef *string) {
	if len(raw) == 0 {
		return nil, nil, nil
	}
	meta := map[string]any{}
	if err := json.Unmarshal(raw, &meta); err != nil {
		return nil, nil, nil
	}
	company = toOptional(asString(meta["company_name"]))
	vatID = toOptional(asString(meta["vat_id"]))
	purchaseOrderRef = toOptional(asString(meta["purchase_order_ref"]))
	return company, vatID, purchaseOrderRef
}

func asString(value any) string {
	if s, ok := value.(string); ok {
		return s
	}
	return ""
}
