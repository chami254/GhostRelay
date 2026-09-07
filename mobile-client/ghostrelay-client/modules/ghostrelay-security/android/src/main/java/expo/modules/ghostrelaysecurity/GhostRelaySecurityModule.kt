package expo.modules.ghostrelaysecurity

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class GhostRelaySecurityModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("GhostRelaySecurity")

        Function("isAvailable") {
            true
        }

        Function("isBiometricAvailable") {

            val context = appContext.reactContext
                ?: return@Function false

            val biometricManager =
                BiometricManager.from(context)

            biometricManager.canAuthenticate(
                BiometricManager.Authenticators.BIOMETRIC_STRONG
            ) == BiometricManager.BIOMETRIC_SUCCESS
        }

        AsyncFunction("authenticate") { promise: Promise ->

            val activity = appContext.currentActivity

            if (activity !is FragmentActivity) {
                promise.reject(
                    "NO_ACTIVITY",
                    "GhostRelay requires a FragmentActivity for biometric authentication.",
                    null
                )
                return@AsyncFunction
            }

            val context = appContext.reactContext

            if (context == null) {
                promise.reject(
                    "NO_CONTEXT",
                    "GhostRelay React context is unavailable.",
                    null
                )
                return@AsyncFunction
            }

            val biometricManager =
                BiometricManager.from(context)

            val availability =
                biometricManager.canAuthenticate(
                    BiometricManager.Authenticators.BIOMETRIC_STRONG
                )

            if (availability != BiometricManager.BIOMETRIC_SUCCESS) {

                promise.reject(
                    "BIOMETRIC_UNAVAILABLE",
                    "Biometric authentication is not available on this device.",
                    null
                )

                return@AsyncFunction
            }

            val executor =
                ContextCompat.getMainExecutor(activity)

            val biometricPrompt =
                BiometricPrompt(
                    activity,
                    executor,
                    object : BiometricPrompt.AuthenticationCallback() {

                        override fun onAuthenticationSucceeded(
                            result: BiometricPrompt.AuthenticationResult
                        ) {
                            promise.resolve("success")
                        }

                        override fun onAuthenticationError(
                            errorCode: Int,
                            errString: CharSequence
                        ) {
                            promise.reject(
                                "BIOMETRIC_ERROR",
                                errString.toString(),
                                null
                            )
                        }

                        override fun onAuthenticationFailed() {
                            /*
                             * Do not reject here.
                             *
                             * Android may allow the user to try
                             * another fingerprint/face scan.
                             */
                        }
                    }
                )

            val promptInfo =
                BiometricPrompt.PromptInfo.Builder()
                    .setTitle("GhostRelay Security")
                    .setSubtitle(
                        "Authenticate to access GhostRelay"
                    )
                    .setDescription(
                        "Verify your identity before accessing the secure messaging system."
                    )
                    .setNegativeButtonText("Cancel")
                    .build()

            biometricPrompt.authenticate(promptInfo)
        }
    }
}