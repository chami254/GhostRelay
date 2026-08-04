use thiserror::Error;

#[derive(Debug, Error)]
pub enum GhostRelayError {

    // ===========================
    // Identity
    // ===========================

    #[error("Failed to generate cryptographic identity.")]
    IdentityGeneration,

    #[error("Invalid public key.")]
    InvalidPublicKey,

    #[error("Invalid private key.")]
    InvalidPrivateKey,

    #[error("Invalid fingerprint.")]
    InvalidFingerprint,

    // ===========================
    // Encryption
    // ===========================

    #[error("Failed to encrypt message.")]
    EncryptionFailed,

    #[error("Failed to decrypt message.")]
    DecryptionFailed,

    #[error("Shared secret generation failed.")]
    SharedSecretFailed,

    #[error("Invalid nonce.")]
    InvalidNonce,

    #[error("Invalid ciphertext.")]
    InvalidCiphertext,

    // ===========================
    // Signatures
    // ===========================

    #[error("Failed to sign message.")]
    SignatureFailed,

    #[error("Signature verification failed.")]
    VerificationFailed,

    // ===========================
    // Encoding
    // ===========================

    #[error("Base64 decoding failed.")]
    Base64DecodeFailed,

    #[error("Base64 encoding failed.")]
    Base64EncodeFailed,

    #[error("Invalid UTF-8 data.")]
    Utf8Error,

    // ===========================
    // Relay Messages
    // ===========================

    #[error("Message has expired.")]
    MessageExpired,

    #[error("Message not found.")]
    MessageNotFound,

    #[error("Message has already been consumed.")]
    MessageConsumed,

    // ===========================
    // Serialization
    // ===========================

    #[error("Serialization failed.")]
    SerializationFailed,

    #[error("Deserialization failed.")]
    DeserializationFailed,

    // ===========================
    // System
    // ===========================

    #[error("Internal security error.")]
    InternalError,

    #[error("Unknown security error.")]
    Unknown,

    #[error("Invalid signature.")]
    InvalidSignature,
}