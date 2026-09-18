package expo.modules.ghostrelaysecurity

import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class GhostRelaySecurityModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("GhostRelaySecurity")

        // ========================================================
        // Device authentication
        // ========================================================

        Function("isBiometricAvailable") {
            BiometricAuthenticator.isAvailable(
                appContext.reactContext
            )
        }

        AsyncFunction("authenticate") { promise: Promise ->
            BiometricAuthenticator.authenticate(
                appContext.reactContext,
                promise
            )
        }

        // ========================================================
        // Identity
        // ========================================================

        AsyncFunction("generateIdentity") {
            RustBridge.generateIdentity()
        }

        // ========================================================
        // Encryption
        // ========================================================

        AsyncFunction("encrypt") {
            recipientPublicKey: String,
            plaintext: String ->

            RustBridge.encrypt(
                recipientPublicKey,
                plaintext
            )
        }

        // ========================================================
        // Decryption
        // ========================================================

        AsyncFunction("decrypt") {
            senderPublicKey: String,
            ciphertext: String,
            nonce: String ->

            RustBridge.decrypt(
                senderPublicKey,
                ciphertext,
                nonce
            )
        }

        // ========================================================
        // Message signing
        // ========================================================

        AsyncFunction("signMessage") {
            messageJson: String ->

            RustBridge.signMessage(
                messageJson
            )
        }

        // ========================================================
        // Message verification
        // ========================================================

        AsyncFunction("verifyMessage") {
            messageJson: String,
            signingPublicKey: String ->

            RustBridge.verifyMessage(
                messageJson,
                signingPublicKey
            )
        }

        // ========================================================
        // IMPORTANT:
        //
        // getIdentityPersistence()
        // restoreIdentity()
        // clearIdentity()
        //
        // are deliberately NOT exposed here.
        //
        // They remain native-only operations.
        // ========================================================
    }
}