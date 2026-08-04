package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"relay-server/internal/api"
	"relay-server/internal/relay"
	"relay-server/internal/storage"
)

func main() {

	router := gin.Default()

	// Initialize storage
	store := storage.NewMemoryStore()

	// Initialize relay service
	relayService := relay.NewRelayService(store)

	// Start automatic cleanup
	relayService.StartCleanupWorker()

	// Register API routes
	api.RegisterRoutes(router, relayService)

	log.Println("=====================================")
	log.Println(" GhostRelay Relay Server")
	log.Println(" Listening on http://localhost:8080")
	log.Println("=====================================")

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}