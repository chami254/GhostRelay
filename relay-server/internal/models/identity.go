package models

import "time"

type Identity struct {
	ID               string    `json:"id"`
	PublicKey        string    `json:"publicKey"`
	SigningPublicKey string    `json:"signingPublicKey"`
	CreatedAt        time.Time `json:"createdAt"`
}
