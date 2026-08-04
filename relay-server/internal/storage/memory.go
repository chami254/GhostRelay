package storage

import (
	"sync"
	"time"

	"relay-server/internal/models"

	"github.com/google/uuid"
)

type MemoryStore struct {
	mu sync.RWMutex

	identities map[string]models.Identity

	messages map[string]models.Message
}

func NewMemoryStore() *MemoryStore {

	return &MemoryStore{
		identities: make(map[string]models.Identity),
		messages:   make(map[string]models.Message),
	}

}

func (s *MemoryStore) RegisterIdentity(identity models.Identity) {

	s.mu.Lock()
	defer s.mu.Unlock()

	s.identities[identity.ID] = identity

}

func (s *MemoryStore) GetIdentity(id string) (models.Identity, bool) {

	s.mu.RLock()
	defer s.mu.RUnlock()

	identity, exists := s.identities[id]

	return identity, exists

}

func (s *MemoryStore) SaveMessage(request models.RelayRequest) models.Message {

	s.mu.Lock()
	defer s.mu.Unlock()

	message := models.Message{
		ID:         uuid.New().String(),
		SenderID:   request.SenderID,
		ReceiverID: request.ReceiverID,
		Ciphertext: request.Ciphertext,
		Nonce:      request.Nonce,
		Algorithm:  "X25519-ChaCha20-Poly1305",
		CreatedAt:  time.Now(),
		ExpiresAt:  time.Now().Add(24 * time.Hour),
		Delivered:  false,
	}

	s.messages[message.ID] = message

	return message

}

func (s *MemoryStore) GetMessages(receiverID string) []models.Message {

	s.mu.RLock()
	defer s.mu.RUnlock()

	var pending []models.Message

	now := time.Now()

	for _, msg := range s.messages {

		if msg.ReceiverID != receiverID {
			continue
		}

		if msg.Delivered {
			continue
		}

		if msg.ExpiresAt.Before(now) {
			continue
		}

		pending = append(pending, msg)

	}

	return pending

}

func (s *MemoryStore) MarkDelivered(messageID string) {

	s.mu.Lock()
	defer s.mu.Unlock()

	msg, exists := s.messages[messageID]

	if !exists {
		return
	}

	msg.Delivered = true

	s.messages[messageID] = msg

}

func (s *MemoryStore) CleanupExpired() {

	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now()

	for id, msg := range s.messages {

		if msg.ExpiresAt.Before(now) {

			delete(s.messages, id)

		}

	}

}

func (s *MemoryStore) MessageCount() int {

	s.mu.RLock()
	defer s.mu.RUnlock()

	return len(s.messages)

}