package expo.modules.ghostrelaysecurity

import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class GhostRelaySecurityModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("GhostRelaySecurity")

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

        AsyncFunction("generateIdentity") {
            RustBridge.generateIdentity()
        }
    }
}