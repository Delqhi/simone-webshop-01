package support

import (
	"encoding/json"
	"strconv"
)

func jsonUnmarshal(raw []byte, out any) error {
	if len(raw) == 0 {
		return nil
	}
	return json.Unmarshal(raw, out)
}

func parseInt(raw string, fallback, min, max int) int {
	v, err := strconv.Atoi(raw)
	if err != nil {
		v = fallback
	}
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}
