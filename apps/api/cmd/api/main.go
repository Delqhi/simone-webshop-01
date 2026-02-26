package main

import (
	"log"

	"simone-webshop/apps/api/internal/config"
	"simone-webshop/apps/api/internal/db"
	"simone-webshop/apps/api/internal/http"
)

func main() {
	cfg := config.Load()
	if err := cfg.ValidateAPI(); err != nil {
		log.Fatalf("invalid api configuration: %v", err)
	}

	pool, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer pool.Close()

	r := http.NewRouter(cfg, pool)
	log.Printf("api listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("api server failed: %v", err)
	}
}
