package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"relay-server/internal/models"
	"relay-server/internal/relay"
)

func RegisterIdentity(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		var identity models.Identity

		if err := c.ShouldBindJSON(&identity); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		identity.CreatedAt = time.Now()

		service.RegisterIdentity(identity)

		c.JSON(http.StatusCreated, identity)

	}

}
