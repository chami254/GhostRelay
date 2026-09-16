use jni::JNIEnv;
use jni::objects::{JClass, JString};
use jni::sys::jstring;

use serde::Serialize;

use crate::Identity;

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

#[no_mangle]
pub extern "system" fn Java_expo_modules_ghostrelaysecurity_RustBridge_generateIdentityNative(
    env: JNIEnv,
    _class: JClass,
) -> jstring {
    let identity = Identity::generate();

    let response = IdentityResponse {
        public_key: identity.public_key(),
        signing_public_key: identity.signing_public_key(),
        fingerprint: identity.fingerprint(),
    };

    let json = serde_json::to_string(&response)
        .expect("Failed to serialize identity");

    let output: JString = env
        .new_string(json)
        .expect("Couldn't create Java string");

    output.into_raw()
}