use base64::{engine::general_purpose::STANDARD, Engine};

use chacha20poly1305::{
    aead::{Aead, KeyInit},
    XChaCha20Poly1305,
    Key,
    XNonce,
};

use rand::rngs::OsRng;
use rand::RngCore;

use sha2::{Digest, Sha256};

use x25519_dalek::PublicKey;

use crate::errors::GhostRelayError;
use crate::identity::Identity;

/// Result returned after encryption.
pub struct EncryptedPayload {
    pub ciphertext: String,
    pub nonce: String,
}

pub struct CryptoEngine;

impl CryptoEngine {

    /// Derive a shared secret using X25519 and hash it
    /// into a 256-bit symmetric key.
    fn shared_secret(
        me: &Identity,
        recipient: &PublicKey,
    ) -> [u8; 32] {

        let shared = me.secret().diffie_hellman(recipient);

        let hash = Sha256::digest(shared.as_bytes());

        let mut key = [0u8; 32];
        key.copy_from_slice(&hash);

        key
    }

    /// Encrypt plaintext for a recipient.
    ///
    /// Returns:
    /// - Base64 ciphertext
    /// - Base64 nonce
    pub fn encrypt(
        sender: &Identity,
        recipient: &PublicKey,
        plaintext: &str,
    ) -> Result<EncryptedPayload, GhostRelayError> {

        let key = Self::shared_secret(sender, recipient);

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

    /// Decrypt a payload from a sender.
    pub fn decrypt(
        receiver: &Identity,
        sender: &PublicKey,
        ciphertext: &str,
        nonce: &str,
    ) -> Result<String, GhostRelayError> {

        let key = Self::shared_secret(receiver, sender);

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

    /// Convert a Base64 public key into an X25519 public key.
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

    /// Encode a public key to Base64.
    pub fn public_key_to_base64(
        key: &PublicKey,
    ) -> String {

        STANDARD.encode(key.as_bytes())

    }
}