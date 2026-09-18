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
// @Description Returns pending encrypted messages for a specific recipient.
// @Tags Messages
// @Produce json
// @Param receiverId path string true "Recipient ID"
// @Success 200 {array} models.Message
// @Router /messages/receiver/{receiverId} [get]
func GetMessages(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		receiverID := c.Param("receiverId")

		if receiverID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "receiverId is required",
			})
			return
		}

		messages := service.GetPendingMessages(receiverID)

		c.JSON(http.StatusOK, messages)
	}
}

// GetInbox godoc
//
// @Summary Retrieve pending messages for a recipient
// @Description Returns pending encrypted messages for the receiverId query parameter.
// @Tags Messages
// @Produce json
// @Param receiverId query string true "Recipient ID"
// @Success 200 {array} models.Message
// @Failure 400 {object} map[string]string
// @Router /messages [get]
func GetInbox(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		receiverID := c.Query("receiverId")

		if receiverID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "receiverId query parameter is required",
			})
			return
		}

		messages := service.GetPendingMessages(receiverID)

		c.JSON(http.StatusOK, messages)
	}
}

// GetMessage godoc
//
// @Summary Retrieve a single message
// @Description Returns a single pending message by ID.
// @Tags Messages
// @Produce json
// @Param id path string true "Message ID"
// @Success 200 {object} models.Message
// @Failure 404 {object} map[string]string
// @Router /messages/{id} [get]
func GetMessage(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		id := c.Param("id")

		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "message id is required",
			})
			return
		}

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

// DeleteMessage godoc
//
// @Summary Delete a delivered message
// @Description Marks a message as delivered and removes it from active delivery.
// @Tags Messages
// @Produce json
// @Param id path string true "Message ID"
// @Success 200 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /messages/{id} [delete]
func DeleteMessage(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		id := c.Param("id")

		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "message id is required",
			})
			return
		}

		if !service.MarkDelivered(id) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "message not found",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status": "deleted",
			"id":     id,
		})
	}
}

// SendMessage godoc
//
// @Summary Send a message
// @Description Accepts a signed encrypted message and stores it in the relay.
// @Tags Messages
// @Accept json
// @Produce json
// @Param request body models.RelayRequest true "Signed encrypted message"
// @Success 201 {object} models.Message
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /messages [post]
func SendMessage(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		var request models.RelayRequest

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		message, err := service.RelayMessage(request)

		if err != nil {

			if err.Error() == "message already exists" {
				c.JSON(http.StatusConflict, gin.H{
					"error": err.Error(),
				})
				return
			}

			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, message)
	}
}
