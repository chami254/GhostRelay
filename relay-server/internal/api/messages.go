package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"relay-server/internal/relay"
)

// GetMessages godoc
//
// @Summary Retrieve pending messages
// @Description Returns all pending encrypted messages for a recipient.
// @Tags Messages
// @Produce json
// @Param receiverId path string true "Recipient ID"
// @Success 200 {array} models.Message
// @Router /messages/{receiverId} [get]
func GetMessages(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		receiverID := c.Param("receiverId")

		messages := service.GetPendingMessages(receiverID)

		c.JSON(http.StatusOK, messages)

	}

}

// DeleteMessage godoc
//
// @Summary Delete a delivered message
// @Description Marks a message as delivered and removes it from the relay.
// @Tags Messages
// @Produce json
// @Param id path string true "Message ID"
// @Success 200 {object} map[string]string
// @Router /messages/{id} [delete]
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