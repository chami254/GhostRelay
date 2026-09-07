package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Health godoc
//
// @Summary Health Check
// @Description Checks whether the GhostRelay relay server is running.
// @Tags Health
// @Produce json
// @Success 200 {object} map[string]string
// @Router /health [get]
func Health(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"status":  "online",
		"service": "GhostRelay Relay",
		"version": "0.1.0",
	})
}