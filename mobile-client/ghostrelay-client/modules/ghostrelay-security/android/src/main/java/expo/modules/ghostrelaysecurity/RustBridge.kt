package expo.modules.ghostrelaysecurity

import org.json.JSONObject

object RustBridge {

    init {
        System.loadLibrary("ghostrelay_security")
    }

    // ============================================================
    // JNI declarations
    // ============================================================

    external fun generateIdentityNative(): String

    external fun getIdentityPersistenceNative(): String

    external fun restoreIdentityNative(
        x25519PrivateKey: String,
        signingPrivateKey: String
    ): String

    external fun clearIdentityNative(): String

    external fun encryptNative(
        recipientPublicKey: String,
        plaintext: String
    ): String

    external fun decryptNative(
        senderPublicKey: String,
        ciphertext: String,
        nonce: String
    ): String

    external fun signMessageNative(
        messageJson: String
    ): String

    external fun verifyMessageNative(
        messageJson: String,
        signingPublicKey: String
    ): String

    // ============================================================
    // Internal response parsing
    // ============================================================

    private fun parseJsonObject(json: String): JSONObject {
        val response = JSONObject(json)

        if (response.has("error")) {
            throw IllegalStateException(
                response.getString("error")
            )
        }

        return response
    }

    private fun parseIdentity(json: String): Map<String, String> {
        val identity = parseJsonObject(json)

        return mapOf(
            "publicKey" to identity.getString("publicKey"),
            "signingPublicKey" to identity.getString("signingPublicKey"),
            "fingerprint" to identity.getString("fingerprint")
        )
    }

    // ============================================================
    // Identity
    // ============================================================

    fun generateIdentity(): Map<String, String> {
        return try {
            parseIdentity(
                generateIdentityNative()
            )
        } catch (error: Exception) {
            throw IllegalStateException(
                "Failed to generate GhostRelay identity",
                error
            )
        }
    }

    /**
     * Native-only operation.
     *
     * Returns private identity material for storage by the
     * platform security layer.
     *
     * This method must NEVER be exposed through the
     * React Native / JavaScript API.
     */
    fun getIdentityPersistence(): Map<String, String> {
        return try {
            val response = parseJsonObject(
                getIdentityPersistenceNative()
            )

            mapOf(
                "x25519PrivateKey" to response.getString(
                    "x25519PrivateKey"
                ),
                "signingPrivateKey" to response.getString(
                    "signingPrivateKey"
                )
            )
        } catch (error: Exception) {
            throw IllegalStateException(
                "Failed to retrieve identity persistence material",
                error
            )
        }
    }

    /**
     * Native-only operation.
     *
     * Restores the active Rust identity from private material
     * retrieved from platform secure storage.
     */
    fun restoreIdentity(
        x25519PrivateKey: String,
        signingPrivateKey: String
    ): Map<String, String> {
        return try {
            parseIdentity(
                restoreIdentityNative(
                    x25519PrivateKey,
                    signingPrivateKey
                )
            )
        } catch (error: Exception) {
            throw IllegalStateException(
                "Failed to restore GhostRelay identity",
                error
            )
        }
    }

    /**
     * Native-only operation.
     */
    fun clearIdentity() {
        try {
            val response = parseJsonObject(
                clearIdentityNative()
            )

            if (
                response.has("cleared") &&
                !response.getBoolean("cleared")
            ) {
                throw IllegalStateException(
                    "Rust identity was not cleared"
                )
            }
        } catch (error: Exception) {
            throw IllegalStateException(
                "Failed to clear GhostRelay identity",
                error
            )
        }
    }

    // ============================================================
    // Encryption
    // ============================================================

    fun encrypt(
        recipientPublicKey: String,
        plaintext: String
    ): Map<String, String> {
        return try {
            val response = parseJsonObject(
                encryptNative(
                    recipientPublicKey,
                    plaintext
                )
            )

            mapOf(
                "ciphertext" to response.getString("ciphertext"),
                "nonce" to response.getString("nonce")
            )
        } catch (error: Exception) {
            throw IllegalStateException(
                "Failed to encrypt message",
                error
            )
        }
    }

    // ============================================================
    // Decryption
    // ============================================================

    fun decrypt(
        senderPublicKey: String,
        ciphertext: String,
        nonce: String
    ): String {
        return try {
            val result = decryptNative(
                senderPublicKey,
                ciphertext,
                nonce
            )

            // Rust returns plaintext directly on success.
            // Error responses are JSON objects, so detect them
            // before returning the plaintext.
            if (result.trimStart().startsWith("{")) {
                val response = JSONObject(result)

                if (response.has("error")) {
                    throw IllegalStateException(
                        response.getString("error")
                    )
                }
            }

            result
        } catch (error: Exception) {
            throw IllegalStateException(
                "Failed to decrypt message",
                error
            )
        }
    }

    // ============================================================
    // Signatures
    // ============================================================

    fun signMessage(
        messageJson: String
    ): String {
        return try {
            val result = signMessageNative(messageJson)

            // Rust returns the Base64 signature directly on success.
            // Error responses are JSON objects.
            if (result.trimStart().startsWith("{")) {
                val response = JSONObject(result)

                if (response.has("error")) {
                    throw IllegalStateException(
                        response.getString("error")
                    )
                }
            }

            result
        } catch (error: Exception) {
            throw IllegalStateException(
                "Failed to sign message",
                error
            )
        }
    }

    fun verifyMessage(
        messageJson: String,
        signingPublicKey: String
    ): Boolean {
        return try {
            val response = parseJsonObject(
                verifyMessageNative(
                    messageJson,
                    signingPublicKey
                )
            )

            response.getBoolean("verified")
        } catch (error: Exception) {
            throw IllegalStateException(
                "Failed to verify message",
                error
            )
        }
    }
}