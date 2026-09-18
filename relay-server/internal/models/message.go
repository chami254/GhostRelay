package models

import "time"

type Message struct {
	ID               string    `json:"id"`
	SenderID         string    `json:"senderId"`
	ReceiverID       string    `json:"receiverId"`
	PublicKey        string    `json:"publicKey"`
	SigningPublicKey string    `json:"signingPublicKey"`
	Ciphertext       string    `json:"ciphertext"`
	Nonce            string    `json:"nonce"`
	Signature        string    `json:"signature"`
	Algorithm        string    `json:"algorithm"`
	CreatedAt        time.Time `json:"createdAt"`
	ExpiresAt        time.Time `json:"expiresAt"`
	Delivered        bool      `json:"delivered"`
}
