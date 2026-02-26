# ADR-0005: Eventing Model

## Status
Accepted

## Events
- `order.created`
- `payment.succeeded`
- `fulfillment.started`
- `shipment.updated`
- `ai.chat.requested`
- `social.post.requested`

## Decision
- Outbox-Tabelle in Postgres als zentrale Entkopplung.
- Worker lesen/publizieren über outbox/inbox Muster.
- Event-Payloads werden in `packages/contracts/events` versioniert.
