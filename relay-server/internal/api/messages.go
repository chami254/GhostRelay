package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"relay-server/internal/models"
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

// GetInbox godoc
//
// @Summary Retrieve all pending messages
// @Description Returns all pending encrypted messages in the relay.
// @Tags Messages
// @Produce json
// @Success 200 {array} models.Message
// @Router /messages [get]
func GetInbox(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		messages := service.GetAllPendingMessages()

		c.JSON(http.StatusOK, messages)

	}

}

// GetMessage godoc
//
// @Summary Retrieve a single message
// @Description Returns a single message by ID.
// @Tags Messages
// @Produce json
// @Param id path string true "Message ID"
// @Success 200 {object} models.Message
// @Router /messages/{id} [get]
func GetMessage(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		id := c.Param("id")

		message, exists := service.GetMessage(id)

		if !exists {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "message not found",
			})
			return
		}

		c.JSON(http.StatusOK, message)

	}

}

// SendMessage godoc
//
// @Summary Send a message
// @Description Accepts a simplified message payload and stores it in the relay.
// @Tags Messages
// @Accept json
// @Produce json
// @Param request body models.SendRequest true "Message"
// @Success 201 {object} models.Message
// @Failure 400 {object} map[string]string
// @Router /messages [post]
func SendMessage(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		var request models.SendRequest

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		message, err := service.RelayMessage(models.RelayRequest{
			SenderID:   request.SenderID,
			ReceiverID: request.ReceiverID,
			Ciphertext: request.Ciphertext,
			Nonce:      request.Nonce,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, message)

	}

}
