package admin

import "errors"

var (
	errDuplicate    = errors.New("duplicate")
	errConflict     = errors.New("conflict")
	errBlocked      = errors.New("blocked")
	errKillSwitch   = errors.New("kill_switch")
	errCompliance   = errors.New("compliance_blocked")
	errBudgetCap    = errors.New("budget_cap_exceeded")
	errNotConnected = errors.New("channel_not_connected")
	errEmptyPatch   = errors.New("empty_patch")
	errInvalidInput = errors.New("invalid_input")
)
