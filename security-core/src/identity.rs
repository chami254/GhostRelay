use base64::{engine::general_purpose::STANDARD, Engine};

use ed25519_dalek::{SigningKey, VerifyingKey};

use rand_core::OsRng;

use sha2::{Digest, Sha256};

use x25519_dalek::{PublicKey, StaticSecret};

/// A GhostRelay cryptographic identity.
///
/// Each identity owns two separate cryptographic key systems:
///
/// - X25519: key agreement
/// - Ed25519: digital signatures
///
/// Private key material remains inside the security core.
/// Public keys may be exported for identity exchange.
pub struct Identity {
    x25519_secret: StaticSecret,
    x25519_public: PublicKey,
    signing_key: SigningKey,
    verifying_key: VerifyingKey,
}

impl Identity {
    /// Generate a new GhostRelay identity.
    ///
    /// This creates:
    /// - a fresh X25519 keypair for key agreement
    /// - a fresh Ed25519 keypair for signatures
    pub fn generate() -> Self {
        let x25519_secret = StaticSecret::random_from_rng(OsRng);
        let x25519_public = PublicKey::from(&x25519_secret);

        let signing_key = SigningKey::generate(&mut OsRng);
        let verifying_key = signing_key.verifying_key();

        Self {
            x25519_secret,
            x25519_public,
            signing_key,
            verifying_key,
        }
    }

    /// Restore a GhostRelay identity from its private key material.
    ///
    /// The public keys and fingerprint are regenerated from the
    /// supplied private keys. They are therefore not independently
    /// trusted during restoration.
    ///
    /// This function is intended for the native/platform secure
    /// storage boundary and must never be exposed to React Native
    /// JavaScript.
    pub(crate) fn restore(x25519_private_key: &[u8; 32], signing_private_key: &[u8; 32]) -> Self {
        let x25519_secret = StaticSecret::from(*x25519_private_key);
        let x25519_public = PublicKey::from(&x25519_secret);

        let signing_key = SigningKey::from_bytes(signing_private_key);
        let verifying_key = signing_key.verifying_key();

        Self {
            x25519_secret,
            x25519_public,
            signing_key,
            verifying_key,
        }
    }

    // =========================================================
    // X25519
    // =========================================================

    /// Export the X25519 public key as Base64.
    pub fn public_key(&self) -> String {
        STANDARD.encode(self.x25519_public.as_bytes())
    }

    /// Export the X25519 private key as Base64.
    ///
    /// This is intended only for the native/platform secure-storage
    /// boundary. It must never be exposed to React Native JavaScript.
    pub(crate) fn private_key(&self) -> String {
        STANDARD.encode(self.x25519_secret.to_bytes())
    }

    /// Borrow the X25519 public key internally.
    pub fn public(&self) -> &PublicKey {
        &self.x25519_public
    }

    /// Borrow the X25519 secret internally.
    pub(crate) fn secret(&self) -> &StaticSecret {
        &self.x25519_secret
    }

    /// Export the raw X25519 public key bytes.
    pub fn public_bytes(&self) -> [u8; 32] {
        self.x25519_public.to_bytes()
    }

    /// Generate the GhostRelay identity fingerprint.
    ///
    /// The fingerprint is the first 16 bytes of SHA-256 over
    /// the X25519 public key, represented as uppercase hexadecimal
    /// byte pairs separated by colons.
    pub fn fingerprint(&self) -> String {
        let hash = Sha256::digest(self.x25519_public.as_bytes());

        hash[..16]
            .iter()
            .map(|b| format!("{:02X}", b))
            .collect::<Vec<String>>()
            .join(":")
    }

    // =========================================================
    // Ed25519
    // =========================================================

    /// Export the Ed25519 verifying/public key as Base64.
    pub fn signing_public_key(&self) -> String {
        STANDARD.encode(self.verifying_key.to_bytes())
    }

    /// Export the Ed25519 private signing key as Base64.
    ///
    /// This is intended only for the native/platform secure-storage
    /// boundary. It must never be exposed to React Native JavaScript.
    pub(crate) fn signing_private_key(&self) -> String {
        STANDARD.encode(self.signing_key.to_bytes())
    }

    /// Borrow the Ed25519 signing key internally.
    pub(crate) fn signing_key(&self) -> &SigningKey {
        &self.signing_key
    }

    /// Borrow the Ed25519 verifying key internally.
    pub fn verifying_key(&self) -> &VerifyingKey {
        &self.verifying_key
    }
}
