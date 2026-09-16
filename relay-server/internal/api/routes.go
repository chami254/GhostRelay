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

	router.POST("/identity", RegisterIdentity(service))

	router.POST("/relay", RelayMessage(service))

	router.GET("/messages", GetInbox(service))

	router.GET("/messages/receiver/:receiverId", GetMessages(service))

	router.GET("/messages/:id", GetMessage(service))

	router.POST("/messages", SendMessage(service))

	router.DELETE("/messages/:id", DeleteMessage(service))

	router.POST("/contacts", SaveContact(service))

	router.GET("/contacts", GetContacts(service))
}
