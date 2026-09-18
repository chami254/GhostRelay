package storage

import (
	"errors"
	"sync"
	"time"

	"relay-server/internal/models"
)

type MemoryStore struct {
	mu sync.RWMutex

	identities map[string]models.Identity
	messages   map[string]models.Message
	contacts   map[string]models.Contact
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		identities: make(map[string]models.Identity),
		messages:   make(map[string]models.Message),
		contacts:   make(map[string]models.Contact),
	}
}

func (s *MemoryStore) RegisterIdentity(
	identity models.Identity,
) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	existing, exists := s.identities[identity.ID]

	if exists {
		if existing.PublicKey != identity.PublicKey ||
			existing.SigningPublicKey != identity.SigningPublicKey {
			return errors.New(
				"identity already exists with different keys",
			)
		}

		return nil
	}

	s.identities[identity.ID] = identity

	return nil
}

func (s *MemoryStore) GetIdentity(
	id string,
) (models.Identity, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	identity, exists := s.identities[id]

	return identity, exists
}

func (s *MemoryStore) SaveMessage(
	message models.Message,
) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.messages[message.ID]; exists {
		return errors.New("message already exists")
	}

	s.messages[message.ID] = message

	return nil
}

func (s *MemoryStore) GetMessages(
	receiverID string,
) []models.Message {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var pending []models.Message

	now := time.Now().UTC()

	for _, msg := range s.messages {
		if msg.ReceiverID != receiverID {
			continue
		}

		if msg.Delivered {
			continue
		}

		if !msg.ExpiresAt.After(now) {
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

	now := time.Now().UTC()

	for _, msg := range s.messages {
		if msg.Delivered {
			continue
		}

		if !msg.ExpiresAt.After(now) {
			continue
		}

		all = append(all, msg)
	}

	return all
}

func (s *MemoryStore) GetMessage(
	messageID string,
) (models.Message, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	msg, exists := s.messages[messageID]

	if !exists {
		return models.Message{}, false
	}

	if !msg.ExpiresAt.After(time.Now().UTC()) {
		return models.Message{}, false
	}

	if msg.Delivered {
		return models.Message{}, false
	}

	return msg, true
}

func (s *MemoryStore) MarkDelivered(
	messageID string,
) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	msg, exists := s.messages[messageID]

	if !exists {
		return false
	}

	msg.Delivered = true

	s.messages[messageID] = msg

	return true
}

func (s *MemoryStore) CleanupExpired() {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UTC()

	for id, msg := range s.messages {
		if !msg.ExpiresAt.After(now) {
			delete(s.messages, id)
		}
	}
}

func (s *MemoryStore) MessageCount() int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return len(s.messages)
}

func (s *MemoryStore) SaveContact(
	request models.ContactRequest,
) (models.Contact, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

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

	contact := models.Contact{
		ID:               identity.ID,
		Name:             "Contact",
		PublicKey:        identity.PublicKey,
		SigningPublicKey: identity.SigningPublicKey,
		Fingerprint:      identity.ID,
		CreatedAt:        time.Now().UTC(),
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
