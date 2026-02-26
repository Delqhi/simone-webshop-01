package worker

import "context"

func (p *Processor) handleFulfillmentCompleted(ctx context.Context, job Job) error {
	_, payload, err := orderIDFromPayload(job)
	if err != nil {
		return err
	}
	return p.postAutomationEvent(ctx, job.JobType, payload)
}
