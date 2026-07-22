GhostRelay Protocol Specification
(GPS)

Version 1.0
Status: Draft

1. Introduction

The GhostRelay Protocol (GPS) defines the communication rules governing secure message exchange between GhostRelay clients through an untrusted intermediary relay. The protocol specifies the procedures for identity establishment, public key exchange, message encryption, relay interaction, message retrieval, and secure disposal while ensuring that private cryptographic material never leaves the client device.

2. Protocol Objectives

##Confidentiality

Only the intended recipient can read the message.

##Integrity

Any modification to a message must be detectable.

##Authenticity

Recipients should be able to verify that a message originated from the expected sender.

##Ephemerality

Messages should exist only for the minimum duration necessary for delivery.

##Metadata Minimization

The relay should learn as little as possible about communicating parties.

##Zero Trust

The relay must never be trusted with plaintext or private keys.

3. Design Principles

##DP-01
Private keys never leave the client.

##DP-02
All encryption occurs locally.

##DP-03
The relay transports encrypted payloads only.

##DP-04
Messages are deleted after retrieval or expiration.

##DP-05
Identity establishment occurs outside the communication channel.

##DP-06
Protocol simplicity is preferred over unnecessary complexity.

4. Terminology

| Term          | Definition                                  |

| Client        | GhostRelay mobile application               |
| Relay         | Temporary message forwarding server         |
| Payload       | Encrypted message data                      |
| Header        | Non-sensitive routing information           |
| Sender        | User initiating communication               |
| Recipient     | Intended receiver                           |
| Shared Secret | Symmetric key derived through key agreement |
| Fingerprint   | Short identifier derived from a public key  |

5. Protocol Overview

Client
  ↓
Generate Keys
  ↓
Exchange Public Keys
  ↓
Derive Shared Secret
  ↓
Encrypt
  ↓
Relay
  ↓
Retrieve
  ↓
Decrypt
  ↓
Delete

6. Protocol Lifecycle

##Phase 1: Identity Initialization

    Client starts
      ↓
    Generate X25519 key pair
      ↓
    Store private key securely
      ↓
    Display public key

##Phase 2: Trust Establishment

    -Users exchange public keys.

    -Out of band.

    -QR code.

    -Manual copy.

    -Trusted messenger.

    -No relay involvement.

##Phase 3: Shared Secret Derivation

    -Each client independently derives the same shared secret.

    -No transmission occurs.

##Phase 4: Message Preparation

    Compose message.
      ↓
    Encrypt.
      ↓
    Generate authentication tag.
      ↓
    Create packet.

##Phase 5: Relay Transport

    Upload packet.
      ↓
    Relay validates format.
      ↓
    Store in RAM.
      ↓
    Await retrieval.

##Phase 6: Message Retrieval

    Recipient requests.
      ↓
    Relay returns packet.
      ↓
    Relay deletes packet.

##Phase 7: Client Processing

    Authenticate.
      ↓
    Decrypt.
      ↓
    Display.
      ↓
    Erase plaintext.


7. Packet Specification


8. Cryptographic Operations
9. Relay Behaviour
10. Client Behaviour
11. Error Handling
12. Security Considerations
13. Protocol State Machine
14. Future Extensions