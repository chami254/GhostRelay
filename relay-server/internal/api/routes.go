package api

import (
	"github.com/gin-gonic/gin"

	"relay-server/internal/relay"
)

func RegisterRoutes(
	router *gin.Engine,
	service *relay.RelayService,
) {

	router.GET("/health", Health)

	// Identity registration.
	// /identity is retained for current clients.
	// /identity/register is retained for the documented API.
	router.POST("/identity", RegisterIdentity(service))
	router.POST("/identity/register", RegisterIdentity(service))

	// Legacy relay endpoint.
	// Uses the same signed message contract as /messages.
	router.POST("/relay", RelayMessage(service))

	// Message retrieval.
	router.GET("/messages", GetInbox(service))
	router.GET(
		"/messages/receiver/:receiverId",
		GetMessages(service),
	)

	router.GET("/messages/:id", GetMessage(service))
	router.POST("/messages", SendMessage(service))
	router.DELETE("/messages/:id", DeleteMessage(service))

	// Contacts.
	router.POST("/contacts", SaveContact(service))
	router.GET("/contacts", GetContacts(service))
}
