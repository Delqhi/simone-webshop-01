# ADR-0003: Bounded Contexts

## Status
Accepted

## Contexts
- `catalog`
- `cart`
- `checkout`
- `orders`
- `admin`
- `ai`
- `social`
- `support`

## Constraints
- Keine Cross-Context-Imports auf Handler-Ebene.
- Kommunikation über Services, Contracts oder Events.
- Jeder Context hat eigene Handler/Service/Repository-Schicht.
