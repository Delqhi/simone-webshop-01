package middleware

import "strings"

func normalizeRole(claims *Claims) string {
	candidates := []string{
		claims.Role,
		stringValue(claims.AppMetadata, "role"),
		stringValue(claims.UserMetadata, "role"),
	}
	candidates = append(candidates, stringValues(claims.AppMetadata, "roles")...)
	candidates = append(candidates, stringValues(claims.UserMetadata, "roles")...)

	for _, candidate := range candidates {
		switch strings.ToLower(strings.TrimSpace(candidate)) {
		case "admin":
			return "admin"
		case "ops":
			return "ops"
		case "support":
			return "support"
		case "customer", "authenticated", "user", "member":
			return "customer"
		}
	}

	return ""
}

func stringValue(values map[string]any, key string) string {
	if len(values) == 0 {
		return ""
	}
	if value, ok := values[key]; ok {
		if parsed, ok := value.(string); ok {
			return parsed
		}
	}
	return ""
}

func stringValues(values map[string]any, key string) []string {
	if len(values) == 0 {
		return nil
	}
	value, ok := values[key]
	if !ok {
		return nil
	}
	switch typed := value.(type) {
	case []string:
		return typed
	case []any:
		out := make([]string, 0, len(typed))
		for _, raw := range typed {
			if parsed, ok := raw.(string); ok && strings.TrimSpace(parsed) != "" {
				out = append(out, parsed)
			}
		}
		return out
	default:
		return nil
	}
}
