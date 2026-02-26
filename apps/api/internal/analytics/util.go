package analytics

import "strconv"

func parseWindowHours(raw string, fallback int) int {
	v, err := strconv.Atoi(raw)
	if err != nil || v <= 0 {
		return fallback
	}
	if v > 24*30 {
		return 24 * 30
	}
	return v
}

func ratio(base, result int) float64 {
	if base <= 0 {
		return 0
	}
	return (float64(result) / float64(base)) * 100
}

func toFunnelMap(rows []EventCount) map[string]int {
	out := map[string]int{}
	for _, row := range rows {
		out[row.EventType] = row.Count
	}
	return out
}

func toSegmentMap(rows []SegmentCount) map[string]map[string]int {
	out := map[string]map[string]int{}
	for _, row := range rows {
		if _, ok := out[row.Segment]; !ok {
			out[row.Segment] = map[string]int{}
		}
		out[row.Segment][row.EventType] = row.Count
	}
	return out
}
