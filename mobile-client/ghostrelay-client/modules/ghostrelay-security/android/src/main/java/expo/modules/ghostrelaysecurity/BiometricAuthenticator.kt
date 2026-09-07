package expo.modules.ghostrelaysecurity

import android.content.Context
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

object BiometricAuthenticator {

    fun isAvailable(context: Context?): Boolean {

        if (context == null) {
            return false
        }

        val manager = BiometricManager.from(context)

        val result = manager.canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_STRONG
        )

        return result == BiometricManager.BIOMETRIC_SUCCESS
    }

    suspend fun authenticate(
        context: Context?
    ): Map<String, Any> = suspendCoroutine { continuation ->

        val activity = context as? FragmentActivity

        if (activity == null) {
            continuation.resume(
                mapOf(
                    "authenticated" to false,
                    "method" to "unavailable"
                )
            )
            return@suspendCoroutine
        }

        val executor = ContextCompat.getMainExecutor(activity)

        val biometricPrompt = BiometricPrompt(
            activity,
            executor,
            object : BiometricPrompt.AuthenticationCallback() {

                override fun onAuthenticationSucceeded(
                    result: BiometricPrompt.AuthenticationResult
                ) {
                    continuation.resume(
                        mapOf(
                            "authenticated" to true,
                            "method" to "biometric"
                        )
                    )
                }

                override fun onAuthenticationFailed() {
                    continuation.resume(
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
                    continuation.resume(
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