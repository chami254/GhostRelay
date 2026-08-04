use base64::{engine::general_purpose::STANDARD, Engine};
use rand_core::OsRng;
use sha2::{Digest, Sha256};
use x25519_dalek::{PublicKey, StaticSecret};
use zeroize::Zeroize;

#[derive(Clone)]
pub struct Identity {
    secret: StaticSecret,
    public: PublicKey,
}

impl Identity {
    /// Generate a new X25519 identity.
    pub fn generate() -> Self {
        let secret = StaticSecret::random_from_rng(OsRng);
        let public = PublicKey::from(&secret);

        Self { secret, public }
    }

    /// Export the public key as Base64.
    pub fn public_key(&self) -> String {
        STANDARD.encode(self.public.as_bytes())
    }

    /// Export the private key as Base64.
    ///
    /// This should only be used by the native layer
    /// (Android/iOS) for secure storage.
    pub fn private_key(&self) -> String {
        STANDARD.encode(self.secret.to_bytes())
    }

    /// Generate a human-readable fingerprint
    /// from the public key.
    pub fn fingerprint(&self) -> String {
        let hash = Sha256::digest(self.public.as_bytes());

        hash[..16]
            .iter()
            .map(|b| format!("{:02X}", b))
            .collect::<Vec<String>>()
            .join(":")
    }

    /// Borrow the public key internally.
    pub fn public(&self) -> &PublicKey {
        &self.public
    }

    /// Borrow the private key internally.
    pub fn secret(&self) -> &StaticSecret {
        &self.secret
    }

    /// Export the raw public key bytes.
    pub fn public_bytes(&self) -> [u8; 32] {
        self.public.to_bytes()
    }

    /// Export the raw private key bytes.
    pub fn private_bytes(&self) -> [u8; 32] {
        self.secret.to_bytes()
    }
}

impl Drop for Identity {
    fn drop(&mut self) {
        let mut bytes = self.secret.to_bytes();
        bytes.zeroize();
    }
}