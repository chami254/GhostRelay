package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"relay-server/internal/relay"
)

func GetMessages(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		receiverID := c.Param("receiverId")

		messages := service.GetPendingMessages(receiverID)

		c.JSON(http.StatusOK, messages)

	}

}

func DeleteMessage(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		id := c.Param("id")

		service.MarkDelivered(id)

		c.JSON(http.StatusOK, gin.H{
			"status": "deleted",
			"id":     id,
		})

	}

}
