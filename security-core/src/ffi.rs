use std::sync::{Mutex, OnceLock};

use base64::{engine::general_purpose::STANDARD, Engine};

use jni::objects::{JClass, JString};
use jni::sys::jstring;
use jni::JNIEnv;

use serde::Serialize;

use crate::{crypto::CryptoEngine, message::RelayMessage, signatures::SignatureEngine, Identity};

/// The currently active cryptographic identity for this
/// application process.
///
/// The identity is kept inside the Rust security core and is
/// never exposed to React Native JavaScript.
static ACTIVE_IDENTITY: OnceLock<Mutex<Option<Identity>>> = OnceLock::new();

fn active_identity() -> &'static Mutex<Option<Identity>> {
    ACTIVE_IDENTITY.get_or_init(|| Mutex::new(None))
}

// =============================================================
// JNI response types
// =============================================================

/// Public identity information returned to the native layer.
///
/// No private key material is included.
#[derive(Serialize)]
struct IdentityResponse {
    #[serde(rename = "publicKey")]
    public_key: String,

    #[serde(rename = "signingPublicKey")]
    signing_public_key: String,

    #[serde(rename = "fingerprint")]
    fingerprint: String,
}

/// Private identity material used only by the native/platform
/// secure-storage boundary.
///
/// This response must never be exposed to React Native JavaScript.
#[derive(Serialize)]
struct IdentityPersistenceResponse {
    #[serde(rename = "x25519PrivateKey")]
    x25519_private_key: String,

    #[serde(rename = "signingPrivateKey")]
    signing_private_key: String,
}

/// Encryption result returned across the native boundary.
#[derive(Serialize)]
struct EncryptionResponse {
    ciphertext: String,
    nonce: String,
}

/// Generic successful verification result.
#[derive(Serialize)]
struct VerificationResponse {
    verified: bool,
}

/// Native error response.
///
/// The JavaScript-facing module should translate these into
/// application-level errors rather than exposing private
/// cryptographic material.
#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

// =============================================================
// JNI helpers
// =============================================================

fn identity_response(identity: &Identity) -> IdentityResponse {
    IdentityResponse {
        public_key: identity.public_key(),
        signing_public_key: identity.signing_public_key(),
        fingerprint: identity.fingerprint(),
    }
}

fn error_response(error: impl std::fmt::Display) -> String {
    serde_json::to_string(&ErrorResponse {
        error: error.to_string(),
    })
    .unwrap_or_else(|_| r#"{"error":"InternalError"}"#.to_string())
}

fn serialize_response<T: Serialize>(value: &T) -> String {
    serde_json::to_string(value)
        .unwrap_or_else(|_| r#"{"error":"SerializationFailed"}"#.to_string())
}

fn read_jstring(env: &mut JNIEnv, value: JString) -> Result<String, String> {
    env.get_string(&value)
        .map(|value| value.to_string_lossy().into_owned())
        .map_err(|_| "InvalidString".to_string())
}

fn return_string(env: &mut JNIEnv, value: String) -> jstring {
    env.new_string(value)
        .map(|output| output.into_raw())
        .unwrap_or(std::ptr::null_mut())
}

// =============================================================
// Identity generation
// =============================================================

/// Generate a new GhostRelay identity and make it the active
/// identity for the current application process.
///
/// Only public identity information is returned here.
///
/// Persistent private material must be retrieved separately
/// through getIdentityPersistenceNative() and must be handled
/// exclusively by the native/platform secure-storage layer.
#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_generateIdentityNative(
    mut env: JNIEnv,
    _class: JClass,
) -> jstring {
    let identity = Identity::generate();

    let response = identity_response(&identity);

    match active_identity().lock() {
        Ok(mut active) => {
            *active = Some(identity);
        }

        Err(_) => {
            return return_string(&mut env, error_response("IdentityStoreUnavailable"));
        }
    }

    return_string(&mut env, serialize_response(&response))
}

// =============================================================
// Identity persistence
// =============================================================

/// Export private identity material for platform secure storage.
///
/// IMPORTANT:
/// This function is a native-only persistence boundary.
/// Its result must never be exposed to React Native JavaScript.
///
/// Android/Kotlin should protect this material using the platform
/// secure-storage mechanism and biometric access policy.
#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_getIdentityPersistenceNative(
    mut env: JNIEnv,
    _class: JClass,
) -> jstring {
    let active = match active_identity().lock() {
        Ok(active) => active,
        Err(_) => {
            return return_string(&mut env, error_response("IdentityStoreUnavailable"));
        }
    };

    let identity = match active.as_ref() {
        Some(identity) => identity,
        None => {
            return return_string(&mut env, error_response("IdentityNotInitialized"));
        }
    };

    let response = IdentityPersistenceResponse {
        x25519_private_key: identity.private_key(),
        signing_private_key: identity.signing_private_key(),
    };

    return_string(&mut env, serialize_response(&response))
}

/// Restore the active GhostRelay identity from private material
/// retrieved by the native/platform secure-storage layer.
///
/// The public keys and fingerprint are derived again from the
/// supplied private keys.
#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_restoreIdentityNative(
    mut env: JNIEnv,
    _class: JClass,
    x25519_private_key: JString,
    signing_private_key: JString,
) -> jstring {
    let x25519_private_key = match read_jstring(&mut env, x25519_private_key) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let signing_private_key = match read_jstring(&mut env, signing_private_key) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let x25519_bytes = match STANDARD.decode(x25519_private_key) {
        Ok(bytes) => match bytes.try_into() {
            Ok(bytes) => bytes,
            Err(_) => {
                return return_string(&mut env, error_response("InvalidPrivateKey"));
            }
        },

        Err(_) => {
            return return_string(&mut env, error_response("InvalidPrivateKey"));
        }
    };

    let signing_bytes = match STANDARD.decode(signing_private_key) {
        Ok(bytes) => match bytes.try_into() {
            Ok(bytes) => bytes,
            Err(_) => {
                return return_string(&mut env, error_response("InvalidPrivateKey"));
            }
        },

        Err(_) => {
            return return_string(&mut env, error_response("InvalidPrivateKey"));
        }
    };

    let identity = Identity::restore(&x25519_bytes, &signing_bytes);

    let response = identity_response(&identity);

    match active_identity().lock() {
        Ok(mut active) => {
            *active = Some(identity);
        }

        Err(_) => {
            return return_string(&mut env, error_response("IdentityStoreUnavailable"));
        }
    }

    return_string(&mut env, serialize_response(&response))
}

/// Clear the in-memory Rust identity.
///
/// This is used when the application explicitly logs out or
/// resets the local identity.
///
/// Persistent secure-storage deletion remains the responsibility
/// of the native/platform layer.
#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_clearIdentityNative(
    mut env: JNIEnv,
    _class: JClass,
) -> jstring {
    match active_identity().lock() {
        Ok(mut active) => {
            *active = None;

            return_string(&mut env, r#"{"cleared":true}"#.to_string())
        }

        Err(_) => return_string(&mut env, error_response("IdentityStoreUnavailable")),
    }
}

// =============================================================
// Encryption
// =============================================================

/// Encrypt plaintext using the currently active identity.
///
/// The recipient's X25519 public key is supplied as Base64.
///
/// The private X25519 key never crosses the JNI boundary.
#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_encryptNative(
    mut env: JNIEnv,
    _class: JClass,
    recipient_public_key: JString,
    plaintext: JString,
) -> jstring {
    let recipient_public_key = match read_jstring(&mut env, recipient_public_key) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let plaintext = match read_jstring(&mut env, plaintext) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let recipient = match CryptoEngine::public_key_from_base64(&recipient_public_key) {
        Ok(key) => key,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let active = match active_identity().lock() {
        Ok(active) => active,
        Err(_) => {
            return return_string(&mut env, error_response("IdentityStoreUnavailable"));
        }
    };

    let identity = match active.as_ref() {
        Some(identity) => identity,
        None => {
            return return_string(&mut env, error_response("IdentityNotInitialized"));
        }
    };

    let encrypted = match CryptoEngine::encrypt(identity, &recipient, &plaintext) {
        Ok(payload) => payload,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let response = EncryptionResponse {
        ciphertext: encrypted.ciphertext,
        nonce: encrypted.nonce,
    };

    return_string(&mut env, serialize_response(&response))
}

// =============================================================
// Decryption
// =============================================================

/// Decrypt a received payload using the currently active identity.
///
/// The sender's X25519 public key, ciphertext and nonce are public
/// message material. The receiver's private key remains inside
/// the Rust security core.
#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_decryptNative(
    mut env: JNIEnv,
    _class: JClass,
    sender_public_key: JString,
    ciphertext: JString,
    nonce: JString,
) -> jstring {
    let sender_public_key = match read_jstring(&mut env, sender_public_key) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let ciphertext = match read_jstring(&mut env, ciphertext) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let nonce = match read_jstring(&mut env, nonce) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let sender = match CryptoEngine::public_key_from_base64(&sender_public_key) {
        Ok(key) => key,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let active = match active_identity().lock() {
        Ok(active) => active,
        Err(_) => {
            return return_string(&mut env, error_response("IdentityStoreUnavailable"));
        }
    };

    let identity = match active.as_ref() {
        Some(identity) => identity,
        None => {
            return return_string(&mut env, error_response("IdentityNotInitialized"));
        }
    };

    let plaintext = match CryptoEngine::decrypt(identity, &sender, &ciphertext, &nonce) {
        Ok(plaintext) => plaintext,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    return_string(&mut env, plaintext)
}

// =============================================================
// Message signing
// =============================================================

/// Sign a complete GhostRelay RelayMessage.
///
/// The message is supplied as JSON. Deterministic serialization
/// remains entirely inside Rust.
///
/// The active identity's fingerprint must match message.sender.
/// This prevents the native layer from asking the signing key
/// to authenticate a message claiming to belong to another identity.
#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_signMessageNative(
    mut env: JNIEnv,
    _class: JClass,
    message_json: JString,
) -> jstring {
    let message_json = match read_jstring(&mut env, message_json) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let message: RelayMessage = match serde_json::from_str(&message_json) {
        Ok(message) => message,
        Err(_) => {
            return return_string(&mut env, error_response("DeserializationFailed"));
        }
    };
    if let Err(error) = message.validate() {
        return return_string(&mut env, error_response(error));
    }

    let active = match active_identity().lock() {
        Ok(active) => active,
        Err(_) => {
            return return_string(&mut env, error_response("IdentityStoreUnavailable"));
        }
    };

    let identity = match active.as_ref() {
        Some(identity) => identity,
        None => {
            return return_string(&mut env, error_response("IdentityNotInitialized"));
        }
    };

    if message.sender != identity.fingerprint() {
        return return_string(&mut env, error_response("InvalidMessageSender"));
    }

    let signature = match SignatureEngine::sign_message(identity.signing_key(), &message) {
        Ok(signature) => signature,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    return_string(&mut env, signature)
}

// =============================================================
// Message signature verification
// =============================================================

/// Verify a complete GhostRelay RelayMessage.
///
/// Verification uses only the supplied Ed25519 public key.
/// No private identity material is required.
#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_verifyMessageNative(
    mut env: JNIEnv,
    _class: JClass,
    message_json: JString,
    signing_public_key: JString,
) -> jstring {
    let message_json = match read_jstring(&mut env, message_json) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let signing_public_key = match read_jstring(&mut env, signing_public_key) {
        Ok(value) => value,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    let message: RelayMessage = match serde_json::from_str(&message_json) {
        Ok(message) => message,
        Err(_) => {
            return return_string(&mut env, error_response("DeserializationFailed"));
        }
    };
    if let Err(error) = message.validate() {
        return return_string(&mut env, error_response(error));
    }

    let verifying_key = match SignatureEngine::import_public_key(&signing_public_key) {
        Ok(key) => key,
        Err(error) => {
            return return_string(&mut env, error_response(error));
        }
    };

    match SignatureEngine::verify_message(&verifying_key, &message) {
        Ok(()) => {
            let response = VerificationResponse { verified: true };

            return_string(&mut env, serialize_response(&response))
        }

        Err(crate::GhostRelayError::VerificationFailed) => {
            let response = VerificationResponse { verified: false };

            return_string(&mut env, serialize_response(&response))
        }

        Err(error) => return_string(&mut env, error_response(error)),
    }
}
