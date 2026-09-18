package models

import "time"

type ContactRequest struct {
	PublicKey string `json:"publicKey"`
}

type Contact struct {
	ID               string    `json:"id"`
	Name             string    `json:"name"`
	PublicKey        string    `json:"publicKey"`
	SigningPublicKey string    `json:"signingPublicKey"`
	Fingerprint      string    `json:"fingerprint"`
	CreatedAt        time.Time `json:"createdAt"`
}
