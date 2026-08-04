package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Health(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"status":  "online",
		"service": "GhostRelay Relay",
		"version": "0.1.0",
	})

}