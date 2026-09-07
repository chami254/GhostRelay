import ExpoModulesCore
import LocalAuthentication

public class GhostRelaySecurityModule: Module {

    public func definition() -> ModuleDefinition {

        Name("GhostRelaySecurity")

        // ---------------------------------------------------------
        // MODULE TEST
        // ---------------------------------------------------------

        Function("isAvailable") {
            return true
        }

        // ---------------------------------------------------------
        // BIOMETRIC AVAILABILITY
        // ---------------------------------------------------------

        Function("isBiometricAvailable") {

            let context = LAContext()
            var error: NSError?

            let available = context.canEvaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                error: &error
            )

            return available
        }

        // ---------------------------------------------------------
        // BIOMETRIC AUTHENTICATION
        // ---------------------------------------------------------

        AsyncFunction("authenticate") { (promise: Promise) in

            let context = LAContext()

            context.localizedCancelTitle = "Cancel"

            var error: NSError?

            guard context.canEvaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                error: &error
            ) else {

                promise.resolve([
                    "success": false,
                    "error": "biometric_unavailable"
                ])

                return
            }

            let reason =
                "Authenticate to access GhostRelay."

            context.evaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                localizedReason: reason
            ) { success, authenticationError in

                DispatchQueue.main.async {

                    if success {

                        promise.resolve([
                            "success": true,
                            "error": NSNull()
                        ])

                    } else {

                        var errorCode = "authentication_failed"

                        if let laError =
                            authenticationError as? LAError {

                            switch laError.code {

                            case .userCancel:
                                errorCode = "user_cancel"

                            case .systemCancel:
                                errorCode = "system_cancel"

                            case .biometryNotAvailable:
                                errorCode = "not_available"

                            case .biometryNotEnrolled:
                                errorCode = "not_enrolled"

                            case .biometryLockout:
                                errorCode = "lockout"

                            case .authenticationFailed:
                                errorCode = "authentication_failed"

                            case .userFallback:
                                errorCode = "user_fallback"

                            default:
                                errorCode = "unknown"
                            }
                        }

                        promise.resolve([
                            "success": false,
                            "error": errorCode
                        ])
                    }
                }
            }
        }
        .runOnQueue(.main)
    }
}