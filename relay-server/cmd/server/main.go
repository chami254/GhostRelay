// @title GhostRelay API
// @version 1.0
// @description GhostRelay Secure Messaging Relay Server
// @host localhost:8080
// @BasePath /

package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"relay-server/internal/api"
	"relay-server/internal/relay"
	"relay-server/internal/storage"
)

func main() {
	// Use release mode in production.
	// Render can set GIN_MODE=release as an environment variable.
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// Initialize in-memory storage.
	store := storage.NewMemoryStore()

	// Initialize relay service.
	relayService := relay.NewRelayService(store)

	// Start automatic message cleanup.
	relayService.StartCleanupWorker()

	// Register API routes.
	api.RegisterRoutes(router, relayService)

	// Render provides the PORT environment variable.
	// Fall back to 8080 for local development.
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	log.Println("=====================================")
	log.Println(" GhostRelay Relay Server")
	log.Printf(" Listening on 0.0.0.0:%s", port)
	log.Println("=====================================")

	if err := router.Run("0.0.0.0:" + port); err != nil {
		log.Fatal(err)
	}
}
