package expo.modules.ghostrelaysecurity

import android.content.Context
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.Promise

object BiometricAuthenticator {

    fun isAvailable(context: Context?): Boolean {

        if (context == null) {
            return false
        }

        val biometricManager = BiometricManager.from(context)

        return biometricManager.canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_STRONG
        ) == BiometricManager.BIOMETRIC_SUCCESS
    }

    fun authenticate(
        context: Context?,
        promise: Promise
    ) {

        val activity = context as? FragmentActivity

        if (activity == null) {
            promise.resolve(
                mapOf(
                    "authenticated" to false,
                    "method" to "unavailable",
                    "message" to "GhostRelay requires an Android activity."
                )
            )
            return
        }

        val biometricManager = BiometricManager.from(activity)

        val availability = biometricManager.canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_STRONG
        )

        if (availability != BiometricManager.BIOMETRIC_SUCCESS) {
            promise.resolve(
                mapOf(
                    "authenticated" to false,
                    "method" to "unavailable",
                    "errorCode" to availability
                )
            )
            return
        }

        val executor = ContextCompat.getMainExecutor(activity)

        val biometricPrompt = BiometricPrompt(
            activity,
            executor,
            object : BiometricPrompt.AuthenticationCallback() {

                override fun onAuthenticationSucceeded(
                    result: BiometricPrompt.AuthenticationResult
                ) {
                    promise.resolve(
                        mapOf(
                            "authenticated" to true,
                            "method" to "biometric"
                        )
                    )
                }

                override fun onAuthenticationFailed() {
                    promise.resolve(
                        mapOf(
                            "authenticated" to false,
                            "method" to "failed"
                        )
                    )
                }

                override fun onAuthenticationError(
                    errorCode: Int,
                    errString: CharSequence
                ) {
                    promise.resolve(
                        mapOf(
                            "authenticated" to false,
                            "method" to "error",
                            "errorCode" to errorCode,
                            "message" to errString.toString()
                        )
                    )
                }
            }
        )

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("GhostRelay Security")
            .setSubtitle("Authenticate to access GhostRelay")
            .setDescription(
                "Verify your identity before accessing the secure messaging system."
            )
            .setAllowedAuthenticators(
                BiometricManager.Authenticators.BIOMETRIC_STRONG
            )
            .build()

        biometricPrompt.authenticate(promptInfo)
    }
}