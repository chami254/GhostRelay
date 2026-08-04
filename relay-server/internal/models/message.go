package models

import "time"

type Message struct {
	ID string `json:"id"`

	SenderID string `json:"senderId"`

	ReceiverID string `json:"receiverId"`

	Ciphertext string `json:"ciphertext"`

	Nonce string `json:"nonce"`

	CreatedAt time.Time `json:"createdAt"`

	ExpiresAt time.Time `json:"expiresAt"`

	Delivered bool `json:"delivered"`

	Algorithm string `json:"algorithm"`
}