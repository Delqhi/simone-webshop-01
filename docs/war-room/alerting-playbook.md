# Alerting Playbook (Funnel Regression)

## Trigger Conditions

- Add-to-cart drop > 20% within 2h rolling window
- Checkout step completion drop > 15% per step within 2h
- Checkout API error rate > 3% for 15 minutes

## Required Event Inputs

- `view_product`
- `add_to_cart`
- `begin_checkout`
- `checkout_step_completed`
- `purchase`

## Response SOP

1. Confirm if regression is global or segment-specific (`b2c` vs `b2b`).
2. Correlate with release or feature flag changes in the same time window.
3. If checkout impacted, rollback latest checkout-related web changes first.
4. Validate Go API `/health`, `/ready`, and Stripe webhook queue throughput.
5. Record incident timeline and permanent corrective action.

## Rollback Priority

1. Restore previous stable checkout UI handlers.
2. Disable active A/B variant if conversion-critical component changed.
3. Keep schema untouched unless an explicit migration rollback script exists.
