package worker

import (
	"context"
	"fmt"
)

func (p *Processor) handleSupplierOrderRequested(ctx context.Context, job Job) error {
	orderID, payload, err := orderIDFromPayload(job)
	if err != nil {
		return err
	}

	enabled, err := p.isSupplierFulfillmentEnabled(ctx)
	if err != nil {
		return err
	}
	if !enabled {
		return nil
	}

	order, err := p.loadOrderAggregate(ctx, orderID)
	if err != nil {
		return err
	}
	if order == nil {
		return fmt.Errorf("%w: order_not_found", ErrPermanent)
	}
	if order.PaymentStatus != "paid" {
		return fmt.Errorf("order_not_paid_yet")
	}

	if _, err := p.transitionOrderStatus(ctx, orderID, "processing"); err != nil {
		return err
	}
	items, err := p.loadDispatchItems(ctx, orderID)
	if err != nil {
		return err
	}
	candidatesByProduct, err := p.candidatesByProduct(ctx, items)
	if err != nil {
		return err
	}
	placements, err := buildSupplierPlacements(items, candidatesByProduct)
	if err != nil {
		return err
	}

	dispatchFailed := false
	for _, placement := range placements {
		if err := p.dispatchOneSupplierOrder(ctx, order, placement, payload); err != nil {
			dispatchFailed = true
		}
	}
	if dispatchFailed {
		return fmt.Errorf("supplier_dispatch_incomplete")
	}

	if _, err := p.transitionOrderStatus(ctx, orderID, "supplier_ordered"); err != nil {
		return err
	}
	if err := p.emitFulfillmentCompleted(ctx, orderID, map[string]any{
		"order_id": orderID,
		"source":   "supplier.order.requested",
	}); err != nil {
		return err
	}
	return p.postAutomationEvent(ctx, job.JobType, payload)
}

func (p *Processor) candidatesByProduct(ctx context.Context, items []supplierDispatchItem) (map[string][]supplierCandidate, error) {
	out := map[string][]supplierCandidate{}
	for _, item := range items {
		if _, ok := out[item.ProductID]; ok {
			continue
		}
		candidates, err := p.loadSupplierCandidates(ctx, item.ProductID)
		if err != nil {
			return nil, err
		}
		out[item.ProductID] = candidates
	}
	return out, nil
}

func (p *Processor) dispatchOneSupplierOrder(ctx context.Context, order *orderAggregate, placement supplierPlacement, source map[string]any) error {
	state, err := p.getSupplierOrderState(ctx, order.ID, placement.Supplier.ID)
	if err != nil {
		return err
	}
	if state != nil && state.Status == "placed" {
		return nil
	}

	request := buildSupplierOrderRequest(order, placement)
	if err := p.markSupplierOrderDispatching(ctx, order.ID, placement, request); err != nil {
		return err
	}

	result, dispatchErr := p.dispatchSupplierOrder(ctx, order, placement)
	event := map[string]any{
		"order_id":        order.ID,
		"supplier_id":     placement.Supplier.ID,
		"status":          "dispatching",
		"request_payload": request,
		"source":          source,
	}
	if dispatchErr != nil {
		event["status"] = "failed"
		_ = p.markSupplierOrderFailed(ctx, order.ID, placement, dispatchErr.Error(), result.ResponsePayload)
		event["error"] = dispatchErr.Error()
		event["response_payload"] = result.ResponsePayload
		_ = p.emitSupplierOrderEvent(ctx, "supplier.order.failed", order.ID, event)
		return dispatchErr
	}

	if err := p.markSupplierOrderPlaced(ctx, order.ID, placement, result); err != nil {
		return err
	}
	event["status"] = "placed"
	event["external_order_id"] = result.ExternalOrderID
	event["response_payload"] = result.ResponsePayload
	return p.emitSupplierOrderEvent(ctx, "supplier.order.placed", order.ID, event)
}

func (p *Processor) handleSupplierOrderPlaced(ctx context.Context, job Job) error {
	orderID, payload, err := orderIDFromPayload(job)
	if err != nil {
		return err
	}
	_, err = p.transitionOrderStatus(ctx, orderID, "supplier_ordered")
	if err != nil {
		return err
	}
	return p.postAutomationEvent(ctx, job.JobType, payload)
}

func (p *Processor) handleSupplierOrderFailed(ctx context.Context, job Job) error {
	_, payload, err := orderIDFromPayload(job)
	if err != nil {
		return err
	}
	return p.postAutomationEvent(ctx, job.JobType, payload)
}
