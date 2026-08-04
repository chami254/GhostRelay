//! GhostRelay Security Core
//! Cryptographic primitives used by the GhostRelay ecosystem.

pub mod crypto;
pub mod errors;
pub mod identity;
pub mod message;
pub mod signatures;
pub mod ffi;

// Re-export commonly used types
pub use crypto::CryptoEngine;
pub use errors::GhostRelayError;
pub use identity::Identity;
pub use message::RelayMessage;
pub use signatures::SignatureEngine;