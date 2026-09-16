use x25519_dalek::PublicKey;

use crate::errors::GhostRelayError;
use crate::identity::Identity;

/// Abstraction for X25519 key exchange.
///
/// The key exchange layer is responsible only for deriving the raw
/// X25519 shared secret. It does not perform hashing, encryption,
/// serialization, or message signing.
///
/// Private key material remains owned by `Identity`.
pub struct KeyExchange;

impl KeyExchange {
    /// Derive the raw X25519 shared secret between this identity and
    /// the recipient's public X25519 key.
    ///
    /// Both communicating identities should derive the same 32-byte
    /// shared secret:
    ///
    /// Alice_private × Bob_public
    /// =
    /// Bob_private × Alice_public
    ///
    /// The returned secret must remain inside the security core and
    /// should not be exposed through the React Native layer.
    pub fn derive_shared_secret(
        identity: &Identity,
        recipient_public: &PublicKey,
    ) -> Result<[u8; 32], GhostRelayError> {
        let shared_secret = identity
            .secret()
            .diffie_hellman(recipient_public);

        Ok(*shared_secret.as_bytes())
    }

    /// Convert a Base64-encoded X25519 public key into a `PublicKey`.
    ///
    /// This provides the boundary between serialized public-key data
    /// received from another identity and the X25519 implementation.
    pub fn public_key_from_base64(
        encoded: &str,
    ) -> Result<PublicKey, GhostRelayError> {
        use base64::{engine::general_purpose::STANDARD, Engine};

        let bytes = STANDARD
            .decode(encoded)
            .map_err(|_| GhostRelayError::InvalidPublicKey)?;

        let key: [u8; 32] = bytes
            .try_into()
            .map_err(|_| GhostRelayError::InvalidPublicKey)?;

        Ok(PublicKey::from(key))
    }

    /// Encode an X25519 public key as Base64 for identity exchange.
    pub fn public_key_to_base64(public_key: &PublicKey) -> String {
        use base64::{engine::general_purpose::STANDARD, Engine};

        STANDARD.encode(public_key.as_bytes())
    }
}