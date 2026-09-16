use chrono::{Duration, Utc};

use ghostrelay_security::{
    CryptoEngine,
    Identity,
    KeyExchange,
    RelayMessage,
    SignatureEngine,
    GHOSTRELAY_ALGORITHM,
};

#[test]
fn identity_generation_produces_required_public_material() {
    let identity = Identity::generate();

    assert!(!identity.public_key().is_empty());
    assert!(!identity.signing_public_key().is_empty());
    assert!(!identity.fingerprint().is_empty());

    // X25519 public key = 32 bytes = 44 Base64 characters.
    assert_eq!(identity.public_key().len(), 44);

    // Ed25519 public key = 32 bytes = 44 Base64 characters.
    assert_eq!(identity.signing_public_key().len(), 44);

    // 16-byte SHA-256 fingerprint represented as
    // 16 hexadecimal byte pairs separated by 15 colons.
    assert_eq!(identity.fingerprint().len(), 47);
}

#[test]
fn independently_generated_identities_are_different() {
    let alice = Identity::generate();
    let bob = Identity::generate();

    assert_ne!(alice.public_key(), bob.public_key());
    assert_ne!(alice.signing_public_key(), bob.signing_public_key());
    assert_ne!(alice.fingerprint(), bob.fingerprint());
}

#[test]
fn x25519_key_exchange_is_symmetric() {
    let alice = Identity::generate();
    let bob = Identity::generate();

    let alice_shared =
        KeyExchange::derive_shared_secret(&alice, bob.public())
            .expect("Alice failed to derive shared secret");

    let bob_shared =
        KeyExchange::derive_shared_secret(&bob, alice.public())
            .expect("Bob failed to derive shared secret");

    assert_eq!(alice_shared, bob_shared);
}

#[test]
fn public_key_base64_round_trip_succeeds() {
    let identity = Identity::generate();

    let encoded = identity.public_key();

    let decoded =
        KeyExchange::public_key_from_base64(&encoded)
            .expect("Failed to decode public key");

    let reencoded =
        KeyExchange::public_key_to_base64(&decoded);

    assert_eq!(encoded, reencoded);
}

#[test]
fn encryption_decryption_round_trip_succeeds() {
    let alice = Identity::generate();
    let bob = Identity::generate();

    let plaintext = "Hello GhostRelay";

    let encrypted =
        CryptoEngine::encrypt(&alice, bob.public(), plaintext)
            .expect("Encryption failed");

    assert!(!encrypted.ciphertext.is_empty());
    assert!(!encrypted.nonce.is_empty());

    let decrypted =
        CryptoEngine::decrypt(
            &bob,
            alice.public(),
            &encrypted.ciphertext,
            &encrypted.nonce,
        )
        .expect("Decryption failed");

    assert_eq!(decrypted, plaintext);
}

#[test]
fn encryption_produces_different_nonces() {
    let alice = Identity::generate();
    let bob = Identity::generate();

    let first =
        CryptoEngine::encrypt(&alice, bob.public(), "message")
            .expect("First encryption failed");

    let second =
        CryptoEngine::encrypt(&alice, bob.public(), "message")
            .expect("Second encryption failed");

    assert_ne!(first.nonce, second.nonce);
}

#[test]
fn wrong_recipient_cannot_decrypt_message() {
    let alice = Identity::generate();
    let bob = Identity::generate();
    let mallory = Identity::generate();

    let encrypted =
        CryptoEngine::encrypt(&alice, bob.public(), "secret")
            .expect("Encryption failed");

    let result =
        CryptoEngine::decrypt(
            &mallory,
            alice.public(),
            &encrypted.ciphertext,
            &encrypted.nonce,
        );

    assert!(result.is_err());
}

#[test]
fn tampered_ciphertext_is_rejected() {
    let alice = Identity::generate();
    let bob = Identity::generate();

    let encrypted =
        CryptoEngine::encrypt(&alice, bob.public(), "secret")
            .expect("Encryption failed");

    let mut tampered = encrypted.ciphertext.clone();

    let replacement = if tampered.starts_with('A') {
        'B'
    } else {
        'A'
    };

    tampered.replace_range(0..1, &replacement.to_string());

    let result =
        CryptoEngine::decrypt(
            &bob,
            alice.public(),
            &tampered,
            &encrypted.nonce,
        );

    assert!(result.is_err());
}

#[test]
fn invalid_nonce_is_rejected() {
    let alice = Identity::generate();
    let bob = Identity::generate();

    let encrypted =
        CryptoEngine::encrypt(&alice, bob.public(), "secret")
            .expect("Encryption failed");

    let invalid_nonce = "invalid";

    let result =
        CryptoEngine::decrypt(
            &bob,
            alice.public(),
            &encrypted.ciphertext,
            invalid_nonce,
        );

    assert!(result.is_err());
}

#[test]
fn message_uses_expected_algorithm_identifier() {
    let expires_at = Utc::now() + Duration::hours(24);

    let message = RelayMessage::new(
        "sender".to_string(),
        "recipient".to_string(),
        "ciphertext".to_string(),
        "nonce".to_string(),
        "signature".to_string(),
        expires_at,
    );

    assert_eq!(message.algorithm, GHOSTRELAY_ALGORITHM);
}

#[test]
fn message_serialization_is_deterministic() {
    let expires_at = Utc::now() + Duration::hours(24);

    let message = RelayMessage::new(
        "sender".to_string(),
        "recipient".to_string(),
        "ciphertext".to_string(),
        "nonce".to_string(),
        "signature".to_string(),
        expires_at,
    );

    let first =
        SignatureEngine::serialize_message(&message)
            .expect("First serialization failed");

    let second =
        SignatureEngine::serialize_message(&message)
            .expect("Second serialization failed");

    assert_eq!(first, second);
}

#[test]
fn message_signature_verification_succeeds() {
    let sender = Identity::generate();

    let expires_at = Utc::now() + Duration::hours(24);

    let mut message = RelayMessage::new(
        sender.fingerprint(),
        "recipient".to_string(),
        "ciphertext".to_string(),
        "nonce".to_string(),
        String::new(),
        expires_at,
    );

    let signing_keypair =
        SignatureEngine::generate_keypair();

    message.signature =
        SignatureEngine::sign_message(
            &signing_keypair.0,
            &message,
        )
        .expect("Signing failed");

    SignatureEngine::verify_message(
        &signing_keypair.1,
        &message,
    )
    .expect("Signature verification failed");
}

#[test]
fn modified_message_fails_signature_verification() {
    let signing_keypair =
        SignatureEngine::generate_keypair();

    let expires_at = Utc::now() + Duration::hours(24);

    let mut message = RelayMessage::new(
        "sender".to_string(),
        "recipient".to_string(),
        "original-ciphertext".to_string(),
        "nonce".to_string(),
        String::new(),
        expires_at,
    );

    message.signature =
        SignatureEngine::sign_message(
            &signing_keypair.0,
            &message,
        )
        .expect("Signing failed");

    // Modify a field covered by the signature.
    message.ciphertext =
        "modified-ciphertext".to_string();

    let result =
        SignatureEngine::verify_message(
            &signing_keypair.1,
            &message,
        );

    assert!(result.is_err());
}

#[test]
fn modified_recipient_fails_signature_verification() {
    let signing_keypair =
        SignatureEngine::generate_keypair();

    let expires_at = Utc::now() + Duration::hours(24);

    let mut message = RelayMessage::new(
        "sender".to_string(),
        "recipient-a".to_string(),
        "ciphertext".to_string(),
        "nonce".to_string(),
        String::new(),
        expires_at,
    );

    message.signature =
        SignatureEngine::sign_message(
            &signing_keypair.0,
            &message,
        )
        .expect("Signing failed");

    message.recipient =
        "recipient-b".to_string();

    let result =
        SignatureEngine::verify_message(
            &signing_keypair.1,
            &message,
        );

    assert!(result.is_err());
}

#[test]
fn expired_message_is_detected() {
    let expires_at =
        Utc::now() - Duration::seconds(1);

    let message = RelayMessage::new(
        "sender".to_string(),
        "recipient".to_string(),
        "ciphertext".to_string(),
        "nonce".to_string(),
        "signature".to_string(),
        expires_at,
    );

    assert!(message.is_expired());
    assert!(message.should_delete());
    assert_eq!(message.seconds_remaining(), 0);
}

#[test]
fn active_message_is_not_expired() {
    let expires_at =
        Utc::now() + Duration::hours(24);

    let message = RelayMessage::new(
        "sender".to_string(),
        "recipient".to_string(),
        "ciphertext".to_string(),
        "nonce".to_string(),
        "signature".to_string(),
        expires_at,
    );

    assert!(!message.is_expired());
    assert!(!message.should_delete());
    assert!(message.seconds_remaining() > 0);
}