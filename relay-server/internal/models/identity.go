package models

import "time"

type Identity struct {
	ID        string    `json:"id"`
	PublicKey string    `json:"publicKey"`
	Alias      string    `json:"alias"`
	CreatedAt time.Time `json:"createdAt"`
}