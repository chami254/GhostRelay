package relay

import (
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"

	"relay-server/internal/models"
	"relay-server/internal/storage"
)

const (
	MessageAlgorithm = "X25519-SHA256-XChaCha20-Poly1305-Ed25519"

	MessageLifetime = 24 * time.Hour

	AllowedClockSkew = 5 * time.Minute
)

type RelayService struct {
	store *storage.MemoryStore
}

func NewRelayService(store *storage.MemoryStore) *RelayService {
	return &RelayService{
		store: store,
	}
}

func (r *RelayService) RegisterIdentity(identity models.Identity) error {
	if err := validateIdentity(identity); err != nil {
		return err
	}

	return r.store.RegisterIdentity(identity)
}

func (r *RelayService) GetIdentity(id string) (models.Identity, bool) {
	return r.store.GetIdentity(id)
}

func (r *RelayService) RelayMessage(
	request models.RelayRequest,
) (models.Message, error) {

	if err := validateRelayRequest(request); err != nil {
		return models.Message{}, err
	}

	createdAt, expiresAt, err := parseRelayTimestamps(request)
	if err != nil {
		return models.Message{}, err
	}

	sender, senderExists := r.store.GetIdentity(request.SenderID)
	if !senderExists {
		return models.Message{}, errors.New("sender does not exist")
	}

	_, receiverExists := r.store.GetIdentity(request.ReceiverID)
	if !receiverExists {
		return models.Message{}, errors.New("receiver does not exist")
	}

	now := time.Now().UTC()

	// Prevent clients from submitting messages with timestamps
	// significantly ahead of the relay's clock.
	if createdAt.After(now.Add(AllowedClockSkew)) {
		return models.Message{}, errors.New(
			"message creation time is too far in the future",
		)
	}

	// Do not accept messages that have already expired.
	if expiresAt.Before(now) {
		return models.Message{}, errors.New(
			"message has already expired",
		)
	}

	// Enforce the relay's maximum message lifetime.
	if expiresAt.After(createdAt.Add(MessageLifetime)) {
		return models.Message{}, errors.New(
			"message lifetime exceeds relay policy",
		)
	}

	message := models.Message{
		ID:               request.ID,
		SenderID:         request.SenderID,
		ReceiverID:       request.ReceiverID,
		PublicKey:        sender.PublicKey,
		SigningPublicKey: sender.SigningPublicKey,
		Ciphertext:       request.Ciphertext,
		Nonce:            request.Nonce,
		Signature:        request.Signature,
		Algorithm:        request.Algorithm,
		CreatedAt:        createdAt,
		ExpiresAt:        expiresAt,
		Delivered:        false,
	}

	if err := r.store.SaveMessage(message); err != nil {
		return models.Message{}, err
	}

	return message, nil
}

func (r *RelayService) GetPendingMessages(
	receiverID string,
) []models.Message {
	return r.store.GetMessages(receiverID)
}

func (r *RelayService) GetAllPendingMessages() []models.Message {
	return r.store.GetAllMessages()
}

func (r *RelayService) GetMessage(
	messageID string,
) (models.Message, bool) {
	return r.store.GetMessage(messageID)
}

func (r *RelayService) MarkDelivered(messageID string) bool {
	return r.store.MarkDelivered(messageID)
}

func (r *RelayService) CleanupExpired() {
	r.store.CleanupExpired()
}

func (r *RelayService) MessageCount() int {
	return r.store.MessageCount()
}

func (r *RelayService) SaveContact(
	request models.ContactRequest,
) (models.Contact, error) {
	return r.store.SaveContact(request)
}

func (r *RelayService) GetContacts() []models.Contact {
	return r.store.GetContacts()
}

func (r *RelayService) StartCleanupWorker() {
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()

		for range ticker.C {
			r.CleanupExpired()
		}
	}()
}

func validateIdentity(identity models.Identity) error {
	if strings.TrimSpace(identity.ID) == "" {
		return errors.New("identity id is required")
	}

	if strings.TrimSpace(identity.PublicKey) == "" {
		return errors.New("publicKey is required")
	}

	if strings.TrimSpace(identity.SigningPublicKey) == "" {
		return errors.New("signingPublicKey is required")
	}

	publicKey, err := base64.StdEncoding.DecodeString(identity.PublicKey)
	if err != nil {
		return errors.New("publicKey is not valid base64")
	}

	if len(publicKey) != 32 {
		return errors.New("publicKey must decode to 32 bytes")
	}

	signingPublicKey, err := base64.StdEncoding.DecodeString(
		identity.SigningPublicKey,
	)
	if err != nil {
		return errors.New(
			"signingPublicKey is not valid base64",
		)
	}

	if len(signingPublicKey) != ed25519.PublicKeySize {
		return errors.New(
			"signingPublicKey must decode to 32 bytes",
		)
	}

	expectedFingerprint := fingerprint(publicKey)

	if identity.ID != expectedFingerprint {
		return errors.New(
			"identity id does not match publicKey fingerprint",
		)
	}

	return nil
}

func validateRelayRequest(request models.RelayRequest) error {
	if strings.TrimSpace(request.ID) == "" {
		return errors.New("message id is required")
	}

	if strings.TrimSpace(request.SenderID) == "" {
		return errors.New("senderId is required")
	}

	if strings.TrimSpace(request.ReceiverID) == "" {
		return errors.New("receiverId is required")
	}

	if strings.TrimSpace(request.Ciphertext) == "" {
		return errors.New("ciphertext is required")
	}

	if strings.TrimSpace(request.Nonce) == "" {
		return errors.New("nonce is required")
	}

	if strings.TrimSpace(request.Signature) == "" {
		return errors.New("signature is required")
	}

	if request.Algorithm != MessageAlgorithm {
		return fmt.Errorf(
			"unsupported message algorithm: %s",
			request.Algorithm,
		)
	}

	if strings.TrimSpace(request.CreatedAt) == "" {
		return errors.New("createdAt is required")
	}

	if strings.TrimSpace(request.ExpiresAt) == "" {
		return errors.New("expiresAt is required")
	}

	return nil
}

func parseRelayTimestamps(
	request models.RelayRequest,
) (time.Time, time.Time, error) {

	createdAt, err := time.Parse(
		time.RFC3339Nano,
		request.CreatedAt,
	)
	if err != nil {
		return time.Time{}, time.Time{}, errors.New(
			"createdAt must be a valid RFC3339 timestamp",
		)
	}

	expiresAt, err := time.Parse(
		time.RFC3339Nano,
		request.ExpiresAt,
	)
	if err != nil {
		return time.Time{}, time.Time{}, errors.New(
			"expiresAt must be a valid RFC3339 timestamp",
		)
	}

	if !expiresAt.After(createdAt) {
		return time.Time{}, time.Time{}, errors.New(
			"expiresAt must be after createdAt",
		)
	}

	return createdAt.UTC(), expiresAt.UTC(), nil
}

func fingerprint(publicKey []byte) string {
	sum := sha256.Sum256(publicKey)

	parts := make([]string, 16)

	for i := 0; i < 16; i++ {
		parts[i] = fmt.Sprintf("%02X", sum[i])
	}

	return strings.Join(parts, ":")
}
