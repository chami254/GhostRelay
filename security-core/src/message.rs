use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Encrypted relay message.
///
/// The relay server never sees plaintext.
/// It only stores this encrypted payload until expiry.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RelayMessage {
    /// Unique message identifier.
    pub id: Uuid,

    /// Sender's public key (Base64).
    pub sender: String,

    /// Recipient's public key (Base64).
    pub recipient: String,

    /// Encrypted payload (Base64).
    pub ciphertext: String,

    /// ChaCha20-Poly1305 nonce (Base64).
    pub nonce: String,

    /// Ed25519 signature (Base64).
    pub signature: String,

    /// Creation timestamp.
    pub created_at: DateTime<Utc>,

    /// Expiration timestamp.
    pub expires_at: DateTime<Utc>,
}

impl RelayMessage {
    /// Construct a new encrypted relay message.
    pub fn new(
        sender: String,
        recipient: String,
        ciphertext: String,
        nonce: String,
        signature: String,
        expires_at: DateTime<Utc>,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            sender,
            recipient,
            ciphertext,
            nonce,
            signature,
            created_at: Utc::now(),
            expires_at,
        }
    }

    /// Returns true if the relay message has expired.
    pub fn is_expired(&self) -> bool {
        Utc::now() >= self.expires_at
    }

    /// Remaining lifetime in seconds.
    pub fn seconds_remaining(&self) -> i64 {
        (self.expires_at - Utc::now())
            .num_seconds()
            .max(0)
    }

    /// Convenience helper for relay cleanup.
    pub fn should_delete(&self) -> bool {
        self.is_expired()
    }
}