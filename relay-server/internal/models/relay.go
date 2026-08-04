package models

type RelayRequest struct {
	SenderID string `json:"senderId"`

	ReceiverID string `json:"receiverId"`

	Ciphertext string `json:"ciphertext"`

	Nonce string `json:"nonce"`
}

type RelayResponse struct {
	Success bool `json:"success"`

	MessageID string `json:"messageId"`

	Message string `json:"message"`
}