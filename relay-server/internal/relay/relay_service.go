package relay

import (
	"errors"
	"time"

	"relay-server/internal/models"
	"relay-server/internal/storage"
)

type RelayService struct {
	store *storage.MemoryStore
}

func NewRelayService(store *storage.MemoryStore) *RelayService {
	return &RelayService{
		store: store,
	}
}

func (r *RelayService) RegisterIdentity(identity models.Identity) {

	r.store.RegisterIdentity(identity)

}

func (r *RelayService) GetIdentity(id string) (models.Identity, bool) {

	return r.store.GetIdentity(id)

}

func (r *RelayService) RelayMessage(request models.RelayRequest) (models.Message, error) {

	_, senderExists := r.store.GetIdentity(request.SenderID)

	if !senderExists {
		return models.Message{}, errors.New("sender does not exist")
	}

	_, receiverExists := r.store.GetIdentity(request.ReceiverID)

	if !receiverExists {
		return models.Message{}, errors.New("receiver does not exist")
	}

	message := r.store.SaveMessage(request)

	return message, nil
}

func (r *RelayService) GetPendingMessages(receiverID string) []models.Message {

	return r.store.GetMessages(receiverID)

}

func (r *RelayService) MarkDelivered(messageID string) {

	r.store.MarkDelivered(messageID)

}

func (r *RelayService) CleanupExpired() {

	r.store.CleanupExpired()

}

func (r *RelayService) MessageCount() int {

	return r.store.MessageCount()

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