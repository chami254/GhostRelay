package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"relay-server/internal/models"
	"relay-server/internal/relay"
)

// RelayMessage godoc
//
// @Summary Relay an encrypted message
// @Description Accepts an encrypted payload and stores it in the relay for the intended recipient.
// @Tags Relay
// @Accept json
// @Produce json
// @Param request body models.RelayRequest true "Encrypted Message"
// @Success 201 {object} models.Message
// @Failure 400 {object} map[string]string
// @Router /relay [post]
func RelayMessage(service *relay.RelayService) gin.HandlerFunc {

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

			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})

			return
		}

		c.JSON(http.StatusCreated, message)

	}

}
