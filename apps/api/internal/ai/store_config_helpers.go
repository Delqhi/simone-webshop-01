package ai

import (
	"encoding/json"
	"strings"
)

func buildConfig(provider, model, personality, language, systemPrompt string, temperature float64, maxTokens int, welcomeMessage, fallbackMessage *string, enabledRaw, workingRaw []byte) map[string]any {
	enabledFeatures := map[string]any{}
	workingHours := map[string]any{}
	_ = json.Unmarshal(enabledRaw, &enabledFeatures)
	_ = json.Unmarshal(workingRaw, &workingHours)

	cfg := cloneMap(defaultConfig)
	cfg["provider"] = provider
	cfg["model"] = model
	cfg["personality"] = personality
	cfg["language"] = language
	cfg["systemPrompt"] = systemPrompt
	cfg["temperature"] = temperature
	cfg["maxTokens"] = maxTokens
	cfg["enabledFeatures"] = enabledFeatures
	cfg["workingHours"] = workingHours
	if welcomeMessage != nil {
		cfg["welcomeMessage"] = *welcomeMessage
	}
	if fallbackMessage != nil {
		cfg["fallbackMessage"] = *fallbackMessage
	}
	return cfg
}

func cloneMap(in map[string]any) map[string]any {
	out := make(map[string]any, len(in))
	for k, v := range in {
		if sub, ok := v.(map[string]any); ok {
			out[k] = cloneMap(sub)
			continue
		}
		out[k] = v
	}
	return out
}

func pickString(patch map[string]any, key string, fallback any) string {
	if raw, ok := patch[key]; ok {
		if s, ok := raw.(string); ok {
			return strings.TrimSpace(s)
		}
	}
	if s, ok := fallback.(string); ok {
		return s
	}
	return ""
}

func pickFloat(patch map[string]any, key string, fallback any) float64 {
	if raw, ok := patch[key]; ok {
		switch v := raw.(type) {
		case float64:
			return v
		case float32:
			return float64(v)
		case int:
			return float64(v)
		}
	}
	switch v := fallback.(type) {
	case float64:
		return v
	case int:
		return float64(v)
	default:
		return 0.7
	}
}

func pickInt(patch map[string]any, key string, fallback any) int {
	if raw, ok := patch[key]; ok {
		switch v := raw.(type) {
		case int:
			return v
		case float64:
			return int(v)
		}
	}
	switch v := fallback.(type) {
	case int:
		return v
	case float64:
		return int(v)
	default:
		return 500
	}
}

func pickMap(patch map[string]any, key string, fallback any) map[string]any {
	if raw, ok := patch[key]; ok {
		if m, ok := raw.(map[string]any); ok {
			return m
		}
	}
	if m, ok := fallback.(map[string]any); ok {
		return m
	}
	return map[string]any{}
}
