package middleware

import "testing"

func TestNormalizeRole(t *testing.T) {
	tests := []struct {
		name   string
		claims Claims
		want   string
	}{
		{
			name:   "direct admin role",
			claims: Claims{Role: "admin"},
			want:   "admin",
		},
		{
			name: "app metadata authenticated maps to customer",
			claims: Claims{
				AppMetadata: map[string]any{
					"role": "authenticated",
				},
			},
			want: "customer",
		},
		{
			name: "roles array maps support",
			claims: Claims{
				UserMetadata: map[string]any{
					"roles": []any{"viewer", "support"},
				},
			},
			want: "support",
		},
		{
			name: "unknown role returns empty",
			claims: Claims{
				AppMetadata: map[string]any{
					"role": "viewer",
				},
			},
			want: "",
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			if got := normalizeRole(&tc.claims); got != tc.want {
				t.Fatalf("normalizeRole() = %q, want %q", got, tc.want)
			}
		})
	}
}
