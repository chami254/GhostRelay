use base64::{engine::general_purpose::STANDARD, Engine};

use ed25519_dalek::{
    Signature,
    SigningKey,
    VerifyingKey,
    Signer,
    Verifier,
};

use rand_core::OsRng;

use crate::errors::GhostRelayError;

/// Handles digital signing and verification.
pub struct SignatureEngine;

impl SignatureEngine {
    /// Generate a new Ed25519 keypair.
    pub fn generate_keypair() -> (SigningKey, VerifyingKey) {

        let signing = SigningKey::generate(&mut OsRng);
        let verifying = signing.verifying_key();

        (signing, verifying)

    }

    /// Sign plaintext or ciphertext.
    pub fn sign(
        signing_key: &SigningKey,
        message: &[u8],
    ) -> Result<String, GhostRelayError> {

        let signature = signing_key.sign(message);

        Ok(
            STANDARD.encode(signature.to_bytes())
        )

    }

    /// Verify a signature.
    pub fn verify(
        verifying_key: &VerifyingKey,
        message: &[u8],
        signature: &str,
    ) -> Result<(), GhostRelayError> {

        let bytes = STANDARD
            .decode(signature)
            .map_err(|_| GhostRelayError::InvalidSignature)?;

        let bytes: [u8; 64] = bytes
            .try_into()
            .map_err(|_| GhostRelayError::InvalidSignature)?;

        let signature = Signature::from_bytes(&bytes);

        verifying_key
            .verify(message, &signature)
            .map_err(|_| GhostRelayError::VerificationFailed)?;

        Ok(())

    }

    /// Export public signing key.
    pub fn export_public_key(
        verifying_key: &VerifyingKey,
    ) -> String {

        STANDARD.encode(
            verifying_key.to_bytes()
        )

    }

    /// Import public signing key.
    pub fn import_public_key(
        key: &str,
    ) -> Result<VerifyingKey, GhostRelayError> {

        let bytes = STANDARD
            .decode(key)
            .map_err(|_| GhostRelayError::InvalidPublicKey)?;

        let bytes: [u8; 32] = bytes
            .try_into()
            .map_err(|_| GhostRelayError::InvalidPublicKey)?;

        VerifyingKey::from_bytes(&bytes)
            .map_err(|_| GhostRelayError::InvalidPublicKey)

    }
}