use base64::{engine::general_purpose::STANDARD, Engine};

use chrono::{DateTime, Utc};

use ed25519_dalek::{
    Signature,
    Signer,
    SigningKey,
    Verifier,
    VerifyingKey,
};

use rand_core::OsRng;
//use uuid::Uuid;

use crate::errors::GhostRelayError;
use crate::message::RelayMessage;

/// Domain separator for GhostRelay message signatures.
///
/// This prevents a GhostRelay message signature from being
/// accidentally interpreted as a signature over unrelated data.
const MESSAGE_SIGNATURE_DOMAIN: &[u8] =
    b"GHOSTRELAY-MESSAGE-V1";

/// Handles Ed25519 digital signing, verification, and
/// deterministic message serialization.
pub struct SignatureEngine;

impl SignatureEngine {
    /// Generate a new Ed25519 keypair.
    pub fn generate_keypair() -> (SigningKey, VerifyingKey) {
        let signing = SigningKey::generate(&mut OsRng);
        let verifying = signing.verifying_key();

        (signing, verifying)
    }

    /// Serialize a GhostRelay message into its canonical,
    /// deterministic binary representation.
    ///
    /// The signature field is deliberately excluded because
    /// the signature is calculated over this representation.
    ///
    /// Encoding:
    ///
    /// DOMAIN
    /// MESSAGE ID
    /// SENDER
    /// RECIPIENT
    /// CIPHERTEXT
    /// NONCE
    /// ALGORITHM
    /// CREATED_AT
    /// EXPIRES_AT
    pub fn serialize_message(
        message: &RelayMessage,
    ) -> Result<Vec<u8>, GhostRelayError> {
        let mut output = Vec::new();

        // Domain separator.
        output.extend_from_slice(MESSAGE_SIGNATURE_DOMAIN);

        // Fixed-size message identifier.
        output.extend_from_slice(message.id.as_bytes());

        // Length-prefixed variable-length fields.
        Self::write_length_prefixed(
            &mut output,
            message.sender.as_bytes(),
        )?;

        Self::write_length_prefixed(
            &mut output,
            message.recipient.as_bytes(),
        )?;

        Self::write_length_prefixed(
            &mut output,
            message.ciphertext.as_bytes(),
        )?;

        Self::write_length_prefixed(
            &mut output,
            message.nonce.as_bytes(),
        )?;

        Self::write_length_prefixed(
            &mut output,
            message.algorithm.as_bytes(),
        )?;

        // Creation timestamp.
        Self::write_timestamp(
            &mut output,
            message.created_at,
        )?;

        // Expiration timestamp.
        Self::write_timestamp(
            &mut output,
            message.expires_at,
        )?;

        Ok(output)
    }

    /// Write a variable-length byte sequence using a fixed
    /// 4-byte big-endian length prefix.
    fn write_length_prefixed(
        output: &mut Vec<u8>,
        data: &[u8],
    ) -> Result<(), GhostRelayError> {
        let length = u32::try_from(data.len())
            .map_err(|_| GhostRelayError::SerializationFailed)?;

        output.extend_from_slice(&length.to_be_bytes());
        output.extend_from_slice(data);

        Ok(())
    }

    /// Serialize a timestamp deterministically as:
    ///
    /// [8-byte seconds][4-byte nanoseconds]
    fn write_timestamp(
        output: &mut Vec<u8>,
        timestamp: DateTime<Utc>,
    ) -> Result<(), GhostRelayError> {
        let seconds = timestamp.timestamp();

        let nanoseconds = timestamp
            .timestamp_subsec_nanos();

        output.extend_from_slice(&seconds.to_be_bytes());
        output.extend_from_slice(&nanoseconds.to_be_bytes());

        Ok(())
    }

    /// Sign arbitrary bytes using Ed25519.
    ///
    /// Higher-level protocol code should normally call
    /// `serialize_message()` first and then pass the resulting
    /// bytes here.
    pub fn sign(
        signing_key: &SigningKey,
        message: &[u8],
    ) -> Result<String, GhostRelayError> {
        let signature = signing_key.sign(message);

        Ok(STANDARD.encode(signature.to_bytes()))
    }

    /// Sign a complete GhostRelay relay message using the
    /// canonical protocol representation.
    pub fn sign_message(
        signing_key: &SigningKey,
        message: &RelayMessage,
    ) -> Result<String, GhostRelayError> {
        let serialized = Self::serialize_message(message)?;

        Self::sign(signing_key, &serialized)
    }

    /// Verify a signature against arbitrary bytes.
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

    /// Verify a signature against a complete GhostRelay
    /// relay message using the canonical representation.
    pub fn verify_message(
        verifying_key: &VerifyingKey,
        message: &RelayMessage,
    ) -> Result<(), GhostRelayError> {
        let serialized = Self::serialize_message(message)?;

        Self::verify(
            verifying_key,
            &serialized,
            &message.signature,
        )
    }

    /// Export an Ed25519 public signing key as Base64.
    pub fn export_public_key(
        verifying_key: &VerifyingKey,
    ) -> String {
        STANDARD.encode(verifying_key.to_bytes())
    }

    /// Import an Ed25519 public signing key from Base64.
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