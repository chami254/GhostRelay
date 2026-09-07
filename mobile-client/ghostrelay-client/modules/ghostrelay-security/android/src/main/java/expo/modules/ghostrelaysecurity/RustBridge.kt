package expo.modules.ghostrelaysecurity

object RustBridge {

    init {
        System.loadLibrary("ghostrelay")
    }

    external fun generateIdentityNative(): String

    fun generateIdentity(): Map<String, String> {

        val json = generateIdentityNative()

        return try {

            val identity = org.json.JSONObject(json)

            mapOf(
                "publicKey" to identity.getString("publicKey"),
                "fingerprint" to identity.getString("fingerprint")
            )

        } catch (error: Exception) {

            throw IllegalStateException(
                "Invalid identity returned by Rust security core",
                error
            )
        }
    }
}