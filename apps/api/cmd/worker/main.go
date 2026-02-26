package main

import (
	"context"
	"log"
	"os"
	"time"

	"simone-webshop/apps/api/internal/config"
	"simone-webshop/apps/api/internal/db"
	"simone-webshop/apps/api/internal/events"
	"simone-webshop/apps/api/internal/worker"
)

func main() {
	cfg := config.Load()
	if err := cfg.ValidateWorker(); err != nil {
		log.Fatalf("invalid worker configuration: %v", err)
	}

	pool, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer pool.Close()

	ctx := context.Background()
	store := worker.NewStore(pool)
	processor := worker.NewProcessor(pool, worker.Options{
		GoogleServiceAccountJSONB64: cfg.GoogleServiceAccountJSONB64,
		GoogleServiceAccountFile:    cfg.GoogleServiceAccountFile,
		GmailDelegatedUser:          cfg.GmailDelegatedUser,
		GmailSenderFrom:             cfg.GmailSenderFrom,
		GmailAPIBaseURL:             cfg.GmailAPIBaseURL,
		BillingCompanyName:          cfg.BillingCompanyName,
		BillingAddress:              cfg.BillingAddress,
		BillingTaxID:                cfg.BillingTaxID,
		BillingVATID:                cfg.BillingVATID,
		InvoiceOutputDir:            cfg.InvoiceOutputDir,
		N8NWebhookURL:               cfg.N8NWebhookURL,
		N8NSharedSecret:             cfg.N8NSharedSecret,
	})
	workerName := os.Getenv("WORKER_NAME")
	if workerName == "" {
		workerName = "api-worker"
	}

	for {
		outboxProcessed, err := events.ProcessOutbox(ctx, pool)
		if err != nil {
			log.Printf("outbox cycle failed: %v", err)
		}

		queueProcessed, qErr := worker.ProcessQueues(ctx, store, processor, workerName, 25)
		if qErr != nil {
			log.Printf("queue cycle failed: %v", qErr)
		}

		log.Printf("worker cycle completed, outbox_processed=%d queue_processed=%d", outboxProcessed, queueProcessed)
		time.Sleep(5 * time.Second)
	}
}
