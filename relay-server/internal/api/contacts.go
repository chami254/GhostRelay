package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"relay-server/internal/models"
	"relay-server/internal/relay"
)

// SaveContact godoc
//
// @Summary Save a contact
// @Description Saves a trusted contact using their registered public key.
// @Tags Contacts
// @Accept json
// @Produce json
// @Param request body models.ContactRequest true "Contact"
// @Success 201 {object} models.Contact
// @Failure 400 {object} map[string]string
// @Router /contacts [post]
func SaveContact(service *relay.RelayService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request models.ContactRequest

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		if request.PublicKey == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "publicKey is required",
			})
			return
		}

		contact, err := service.SaveContact(request)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, contact)
	}
}

// GetContacts godoc
//
// @Summary Get all contacts
// @Description Returns all saved contacts.
// @Tags Contacts
// @Produce json
// @Success 200 {array} models.Contact
// @Router /contacts [get]
func GetContacts(service *relay.RelayService) gin.HandlerFunc {
	return func(c *gin.Context) {
		contacts := service.GetContacts()

		c.JSON(http.StatusOK, contacts)
	}
}