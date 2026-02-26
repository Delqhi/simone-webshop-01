package admin

import "github.com/google/uuid"

func validUUIDOrEmpty(v string) string {
	if _, err := uuid.Parse(v); err != nil {
		return ""
	}
	return v
}
