use base64::{engine::general_purpose::STANDARD, Engine};

use chacha20poly1305::{
    aead::{Aead, KeyInit},
    Key,
    XChaCha20Poly1305,
    XNonce,
};

use rand::rngs::OsRng;
use rand::RngCore;

use sha2::{Digest, Sha256};

use x25519_dalek::PublicKey;

use crate::errors::GhostRelayError;
use crate::identity::Identity;
use crate::key_exchange::KeyExchange;

/// Result returned after encryption.
///
/// Both fields are Base64 encoded so they can safely cross
/// the native/client/network boundaries.
pub struct EncryptedPayload {
    pub ciphertext: String,
    pub nonce: String,
}

pub struct CryptoEngine;

impl CryptoEngine {
    /// Derive the symmetric encryption key from an X25519
    /// shared secret.
    ///
    /// X25519 produces a 32-byte shared secret. SHA-256 is used
    /// here as the KDF to produce the 32-byte key consumed by
    /// XChaCha20-Poly1305.
    fn encryption_key(
        identity: &Identity,
        recipient: &PublicKey,
    ) -> Result<[u8; 32], GhostRelayError> {
        let shared_secret =
            KeyExchange::derive_shared_secret(identity, recipient)?;

        let hash = Sha256::digest(shared_secret);

        let mut key = [0u8; 32];
        key.copy_from_slice(&hash);

        Ok(key)
    }

    /// Encrypt plaintext for a recipient.
    ///
    /// The encryption process is:
    ///
    /// 1. Perform X25519 key exchange.
    /// 2. Derive a 32-byte encryption key using SHA-256.
    /// 3. Generate a fresh random 24-byte XChaCha20 nonce.
    /// 4. Encrypt using XChaCha20-Poly1305.
    /// 5. Base64 encode ciphertext and nonce.
    pub fn encrypt(
        sender: &Identity,
        recipient: &PublicKey,
        plaintext: &str,
    ) -> Result<EncryptedPayload, GhostRelayError> {
        let key = Self::encryption_key(sender, recipient)?;

        let cipher =
            XChaCha20Poly1305::new(Key::from_slice(&key));

        let mut nonce_bytes = [0u8; 24];
        OsRng.fill_bytes(&mut nonce_bytes);

        let nonce = XNonce::from_slice(&nonce_bytes);

        let ciphertext = cipher
            .encrypt(nonce, plaintext.as_bytes())
            .map_err(|_| GhostRelayError::EncryptionFailed)?;

        Ok(EncryptedPayload {
            ciphertext: STANDARD.encode(ciphertext),
            nonce: STANDARD.encode(nonce_bytes),
        })
    }

    /// Decrypt a payload received from a sender.
    ///
    /// The receiver derives the same X25519 shared secret using:
    ///
    /// receiver private key × sender public key
    ///
    /// This produces the same symmetric encryption key used
    /// during encryption.
    pub fn decrypt(
        receiver: &Identity,
        sender: &PublicKey,
        ciphertext: &str,
        nonce: &str,
    ) -> Result<String, GhostRelayError> {
        let key = Self::encryption_key(receiver, sender)?;

        let cipher =
            XChaCha20Poly1305::new(Key::from_slice(&key));

        let nonce_bytes = STANDARD
            .decode(nonce)
            .map_err(|_| GhostRelayError::InvalidNonce)?;

        if nonce_bytes.len() != 24 {
            return Err(GhostRelayError::InvalidNonce);
        }

        let ciphertext_bytes = STANDARD
            .decode(ciphertext)
            .map_err(|_| GhostRelayError::InvalidCiphertext)?;

        let plaintext = cipher
            .decrypt(
                XNonce::from_slice(&nonce_bytes),
                ciphertext_bytes.as_ref(),
            )
            .map_err(|_| GhostRelayError::DecryptionFailed)?;

        String::from_utf8(plaintext)
            .map_err(|_| GhostRelayError::InvalidCiphertext)
    }

    /// Convert a Base64-encoded X25519 public key into
    /// an X25519 public key.
    pub fn public_key_from_base64(
        encoded: &str,
    ) -> Result<PublicKey, GhostRelayError> {
        let bytes = STANDARD
            .decode(encoded)
            .map_err(|_| GhostRelayError::InvalidPublicKey)?;

        let key: [u8; 32] = bytes
            .try_into()
            .map_err(|_| GhostRelayError::InvalidPublicKey)?;

        Ok(PublicKey::from(key))
    }

    /// Encode an X25519 public key as Base64.
    pub fn public_key_to_base64(
        key: &PublicKey,
    ) -> String {
        STANDARD.encode(key.as_bytes())
    }
}