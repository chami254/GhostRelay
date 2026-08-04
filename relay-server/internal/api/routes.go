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

	router.GET("/messages/:receiverId", GetMessages(service))

	router.DELETE("/messages/:id", DeleteMessage(service))
}