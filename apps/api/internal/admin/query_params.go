package admin

import (
	"strconv"
	"strings"
)

func parseInt(raw string, fallback, min, max int) int {
	v, err := strconv.Atoi(raw)
	if err != nil {
		return fallback
	}
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}

func normalizeSortOrder(raw string) string {
	if strings.EqualFold(strings.TrimSpace(raw), "asc") {
		return "asc"
	}
	return "desc"
}

func parseOptionalBool(raw string) *bool {
	val := strings.TrimSpace(strings.ToLower(raw))
	if val == "true" {
		v := true
		return &v
	}
	if val == "false" {
		v := false
		return &v
	}
	return nil
}

func pickSortColumn(raw, fallback string, allow map[string]string) string {
	key := strings.TrimSpace(raw)
	if key == "" {
		return fallback
	}
	if col, ok := allow[key]; ok {
		return col
	}
	return fallback
}
