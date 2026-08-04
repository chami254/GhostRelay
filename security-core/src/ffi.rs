use jni::JNIEnv;
use jni::objects::{JClass, JString};
use jni::sys::jstring;

use serde::Serialize;

use crate::Identity;

/// JSON returned to the Android layer.
#[derive(Serialize)]
struct IdentityResponse {
    #[serde(rename = "publicKey")]
    public_key: String,

    #[serde(rename = "fingerprint")]
    fingerprint: String,
}

#[no_mangle]
pub extern "system" fn Java_com_anonymous_ghostrelayclient_security_RustBridge_generateIdentity(
     env: JNIEnv,
    _class: JClass,
) -> jstring {

    let identity = Identity::generate();

    let response = IdentityResponse {
        public_key: identity.public_key(),
        fingerprint: identity.fingerprint(),
    };

    let json = serde_json::to_string(&response)
        .expect("Failed to serialize identity");

    let output: JString = env
        .new_string(json)
        .expect("Couldn't create Java string");

    output.into_raw()
}