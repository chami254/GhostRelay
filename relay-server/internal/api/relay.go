package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"relay-server/internal/models"
	"relay-server/internal/relay"
)

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
