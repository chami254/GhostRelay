use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Protocol identifier for the current GhostRelay message format.
pub const GHOSTRELAY_ALGORITHM: &str = "X25519-SHA256-XChaCha20-Poly1305-Ed25519";

/// Encrypted GhostRelay relay message.
///
/// The relay server handles this structure as an opaque encrypted
/// message packet. It must never receive plaintext or private key
/// material.
///
/// Cryptographic processing is performed by the security core;
/// this structure represents the resulting protocol message.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RelayMessage {
    /// Unique message identifier.
    ///
    /// This identifier is part of the message protocol and is used
    /// for replay and consumption tracking.
    pub id: Uuid,

    /// Sender identity ID / fingerprint.
    pub sender: String,

    /// Recipient identity ID / fingerprint.
    pub recipient: String,

    /// XChaCha20-Poly1305 authenticated ciphertext, Base64 encoded.
    pub ciphertext: String,

    /// XChaCha20-Poly1305 24-byte nonce, Base64 encoded.
    pub nonce: String,

    /// Ed25519 signature over the protocol-defined signed message
    /// representation, Base64 encoded.
    ///
    /// This field is empty before the message is signed.
    pub signature: String,

    /// Cryptographic algorithm identifier.
    pub algorithm: String,

    /// Time at which the message was created.
    pub created_at: DateTime<Utc>,

    /// Time after which the message must no longer be accepted.
    pub expires_at: DateTime<Utc>,
}

impl RelayMessage {
    /// Construct a new relay message.
    ///
    /// The message ID and creation timestamp are generated locally.
    /// The signature is initially empty and is supplied after the
    /// protocol-defined signed representation has been produced.
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
            algorithm: GHOSTRELAY_ALGORITHM.to_string(),
            created_at: Utc::now(),
            expires_at,
        }
    }

    /// Validate the structural requirements of a GhostRelay message.
    ///
    /// This verifies protocol-level fields before cryptographic
    /// signing or verification is performed.
    ///
    /// The signature is intentionally NOT validated here because
    /// unsigned messages are valid input to the signing operation.
    /// Cryptographic signature validation is performed separately
    /// by SignatureEngine::verify().
    pub fn validate(&self) -> Result<(), crate::GhostRelayError> {
        if self.algorithm != GHOSTRELAY_ALGORITHM {
            return Err(crate::GhostRelayError::UnsupportedAlgorithm);
        }

        if self.sender.is_empty() || self.recipient.is_empty() {
            return Err(crate::GhostRelayError::InvalidMessage);
        }

        if self.ciphertext.is_empty() || self.nonce.is_empty() {
            return Err(crate::GhostRelayError::InvalidMessage);
        }

        if self.expires_at <= self.created_at {
            return Err(crate::GhostRelayError::InvalidMessage);
        }

        Ok(())
    }

    /// Returns true if the message has reached or passed its
    /// expiration time.
    pub fn is_expired(&self) -> bool {
        Utc::now() >= self.expires_at
    }

    /// Returns the remaining message lifetime in seconds.
    ///
    /// Expired messages return zero rather than a negative value.
    pub fn seconds_remaining(&self) -> i64 {
        (self.expires_at - Utc::now()).num_seconds().max(0)
    }

    /// Indicates whether the message should be removed by relay
    /// cleanup.
    pub fn should_delete(&self) -> bool {
        self.is_expired()
    }
}
