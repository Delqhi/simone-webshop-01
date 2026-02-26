package admin

import (
	"fmt"
	"strconv"
	"strings"
)

func asString(v any) string {
	s, _ := v.(string)
	return strings.TrimSpace(s)
}

func asNullableString(v any) *string {
	s := asString(v)
	if s == "" {
		return nil
	}
	return &s
}

func asBool(v any, fallback bool) bool {
	switch x := v.(type) {
	case bool:
		return x
	case string:
		if strings.EqualFold(strings.TrimSpace(x), "true") {
			return true
		}
		if strings.EqualFold(strings.TrimSpace(x), "false") {
			return false
		}
	}
	return fallback
}

func asInt(v any, fallback int) int {
	switch x := v.(type) {
	case int:
		return x
	case int32:
		return int(x)
	case int64:
		return int(x)
	case float64:
		return int(x)
	case string:
		n, err := strconv.Atoi(strings.TrimSpace(x))
		if err == nil {
			return n
		}
	}
	return fallback
}

func asFloat(v any, fallback float64) float64 {
	switch x := v.(type) {
	case float32:
		return float64(x)
	case float64:
		return x
	case int:
		return float64(x)
	case int64:
		return float64(x)
	case string:
		n, err := strconv.ParseFloat(strings.TrimSpace(x), 64)
		if err == nil {
			return n
		}
	}
	return fallback
}

func asStringSlice(v any) []string {
	if v == nil {
		return []string{}
	}
	switch x := v.(type) {
	case []string:
		return x
	case []any:
		out := make([]string, 0, len(x))
		for _, item := range x {
			s := strings.TrimSpace(fmt.Sprint(item))
			if s != "" {
				out = append(out, s)
			}
		}
		return out
	default:
		return []string{}
	}
}
