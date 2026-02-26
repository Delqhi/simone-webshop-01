package worker

import (
	"context"
	"errors"
)

type Job struct {
	ID          string
	QueueName   string
	JobType     string
	DedupeKey   string
	Payload     []byte
	Attempt     int
	MaxAttempts int
}

type Handler interface {
	Handle(context.Context, Job) error
}

var ErrPermanent = errors.New("permanent")
