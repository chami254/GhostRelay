package models

type RelayRequest struct {
	ID               string `json:"id"`
	SenderID         string `json:"senderId"`
	ReceiverID       string `json:"receiverId"`
	Ciphertext       string `json:"ciphertext"`
	Nonce             string `json:"nonce"`
	Signature        string `json:"signature"`
	Algorithm        string `json:"algorithm"`
	CreatedAt        string `json:"createdAt"`
	ExpiresAt        string `json:"expiresAt"`
}

type RelayResponse struct {
	Success   bool   `json:"success"`
	MessageID string `json:"messageId"`
	Message   string `json:"message"`
}