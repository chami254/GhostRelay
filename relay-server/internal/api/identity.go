package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"relay-server/internal/models"
	"relay-server/internal/relay"
)

// RegisterIdentity godoc
//
// @Summary Register a new identity
// @Description Registers a user's public identity with the GhostRelay relay.
// @Tags Identity
// @Accept json
// @Produce json
// @Param identity body models.Identity true "Identity"
// @Success 201 {object} models.Identity
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /identity [post]
// @Router /identity/register [post]
func RegisterIdentity(service *relay.RelayService) gin.HandlerFunc {

	return func(c *gin.Context) {

		var identity models.Identity

		if err := c.ShouldBindJSON(&identity); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		identity.CreatedAt = time.Now().UTC()

		if err := service.RegisterIdentity(identity); err != nil {
			c.JSON(http.StatusConflict, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, identity)
	}
}
