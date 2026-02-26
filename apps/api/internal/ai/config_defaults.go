package ai

var defaultConfig = map[string]any{
	"id":           "default",
	"provider":     "opencode-zen",
	"model":        "grok-code",
	"personality":  "friendly",
	"language":     "de",
	"systemPrompt": "Du bist der freundliche KI-Assistent fuer den Shop.",
	"temperature":  0.7,
	"maxTokens":    500,
	"welcomeMessage": "Hallo! Wie kann ich helfen?",
	"fallbackMessage": "Entschuldigung, ich bin gerade nicht erreichbar.",
	"enabledFeatures": map[string]any{
		"productRecommendations": true,
		"orderTracking":          true,
		"faq":                    true,
		"humanHandoff":           false,
	},
	"workingHours": map[string]any{
		"enabled":        false,
		"start":          "09:00",
		"end":            "18:00",
		"timezone":       "Europe/Berlin",
		"offlineMessage": "Unser Chat ist derzeit offline.",
	},
}

var providerCatalog = map[string]any{
	"opencode-zen": map[string]any{
		"name": "OpenCode Zen",
		"models": []map[string]any{
			{"id": "grok-code", "name": "Grok Code"},
			{"id": "zen/big-pickle", "name": "Big Pickle"},
		},
	},
	"mistral": map[string]any{
		"name": "Mistral",
		"models": []map[string]any{
			{"id": "mistral-small-latest", "name": "Mistral Small"},
			{"id": "mistral-medium-latest", "name": "Mistral Medium"},
		},
	},
	"groq": map[string]any{
		"name": "Groq",
		"models": []map[string]any{
			{"id": "llama-3.3-70b-versatile", "name": "Llama 3.3 70B"},
		},
	},
	"gemini": map[string]any{
		"name": "Gemini",
		"models": []map[string]any{
			{"id": "gemini-2.0-flash-exp", "name": "Gemini 2.0 Flash"},
		},
	},
}
