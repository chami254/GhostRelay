package storage

import (
	"errors"
	"sync"
	"time"

	"relay-server/internal/models"

	"github.com/google/uuid"
)

type MemoryStore struct {
	mu sync.RWMutex

	identities map[string]models.Identity

	messages map[string]models.Message

	contacts map[string]models.Contact
}

func NewMemoryStore() *MemoryStore {

	return &MemoryStore{
		identities: make(map[string]models.Identity),
		messages:   make(map[string]models.Message),
		contacts:   make(map[string]models.Contact),
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

func (s *MemoryStore) GetAllMessages() []models.Message {

	s.mu.RLock()
	defer s.mu.RUnlock()

	var all []models.Message

	now := time.Now()

	for _, msg := range s.messages {

		if msg.Delivered {
			continue
		}

		if msg.ExpiresAt.Before(now) {
			continue
		}

		all = append(all, msg)

	}

	return all

}

func (s *MemoryStore) GetMessage(messageID string) (models.Message, bool) {

	s.mu.RLock()
	defer s.mu.RUnlock()

	msg, exists := s.messages[messageID]

	return msg, exists

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

func (s *MemoryStore) SaveContact(request models.ContactRequest) (models.Contact, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	/*
	 * A contact is associated with an already registered
	 * GhostRelay identity by matching its public key.
	 *
	 * The identity ID is the fingerprint registered during
	 * identity creation.
	 */
	var identity models.Identity
	var found bool

	for _, registeredIdentity := range s.identities {
		if registeredIdentity.PublicKey == request.PublicKey {
			identity = registeredIdentity
			found = true
			break
		}
	}

	if !found {
		return models.Contact{}, errors.New(
			"no registered identity matches the supplied public key",
		)
	}

	/*
	 * The identity fingerprint is now the contact ID.
	 *
	 * This is important because /messages validates
	 * receiverId against the identity registry.
	 */
	contact := models.Contact{
		ID:          identity.ID,
		Name:        "Contact",
		PublicKey:   identity.PublicKey,
		Fingerprint: identity.ID,
		CreatedAt:   time.Now(),
	}

	s.contacts[contact.ID] = contact

	return contact, nil
}

func (s *MemoryStore) GetContacts() []models.Contact {

	s.mu.RLock()
	defer s.mu.RUnlock()

	var contacts []models.Contact

	for _, contact := range s.contacts {
		contacts = append(contacts, contact)
	}

	return contacts

}
