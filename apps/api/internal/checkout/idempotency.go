package checkout

import (
	"strings"

	"github.com/google/uuid"
)

func orderIDFromIdempotencyKey(key string) string {
	normalized := strings.TrimSpace(key)
	if normalized == "" {
		return uuid.NewString()
	}
	return uuid.NewSHA1(uuid.NameSpaceOID, []byte("checkout:"+normalized)).String()
}
