# GhostRelay
Design and implementation of an ephemeral zero-trust communication protocol using a stateless relay architecture.

GhostRelay is an experimental implementation of an ephemeral zero-trust communication protocol.

The project explores secure communication through a stateless relay architecture where messages are end-to-end encrypted, delivered once, and destroyed immediately after retrieval.

## Current Status

 Documentation Phase

## Project Goals

- Zero-trust relay
- End-to-end encryption
- Client-side key generation
- One-time message retrieval
- Automatic message destruction
- Minimal metadata retention

## Repository Structure

/docs
/protocol
/threat-model
/security-core
/relay-server
/mobile-client
/marketing-site


# Features

- End-to-End Encryption
- Anonymous Identity Generation
- Public Key Fingerprinting
- Secure Relay Messaging
- Read Once Messages
- Automatic Relay Expiration
- QR Identity Sharing
- Cross Platform Mobile Client
- Rust Native Cryptography
- Go High Performance Relay Server

---

# Project Architecture

```
                     GhostRelay

        ┌────────────────────────────┐
        │ React Native Mobile Client │
        └──────────────┬─────────────┘
                       │
             Native Kotlin Bridge
                       │
        ┌──────────────▼─────────────┐
        │     Rust Security Core     │
        │ Encryption & Identity      │
        └──────────────┬─────────────┘
                       │
                Encrypted Payload
                       │
        ┌──────────────▼─────────────┐
        │      Go Relay Server       │
        │ Message Transport Layer    │
        └────────────────────────────┘
```

---

# Technology Stack

## Frontend

- React Native
- Expo
- TypeScript
- React Navigation
- React Native Screens
- React Native Gesture Handler

## Native Android

- Kotlin
- Android Studio
- Gradle

## Cryptography

- Rust
- UniFFI
- Tokio

## Backend

- Go
- Gorilla Mux
- REST API

---

# Folder Structure

```
GhostRelay

mobile-client/
│
├── app/
├── assets/
├── src/
│   ├── api/
│   ├── components/
│   ├── navigation/
│   ├── screens/
│   ├── native/
│   ├── theme/
│   └── utils/
│
├── android/
├── ios/
└── package.json

relay-server/

security-core/
```

---

# Requirements

Before installing GhostRelay ensure the following are installed.

- Node.js 20+
- npm
- Rust
- Cargo
- Go 1.24+
- Android Studio
- Android SDK
- Java 17
- Git

---

# Installation

Clone the repository.

```bash
git clone https://github.com/<username>/GhostRelay.git
```

Move into the project.

```bash
cd GhostRelay/mobile-client
```

Install dependencies.

```bash
npm install
```

---

# Running the Mobile Application

Start the Expo development server.

```bash
npx expo start
```

Run on Android.

```bash
npx expo run:android
```

Or launch directly using Android Studio.

---

# Building the APK

Generate a debug APK.

```bash
cd android

gradlew assembleDebug
```

APK Output

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Install onto a device.

```bash
adb install app-debug.apk
```

---

# Running the Relay Server

Move into the server directory.

```bash
cd relay-server
```

Download dependencies.

```bash
go mod tidy
```

Run the server.

```bash
go run main.go
```

By default the relay server starts on

```
http://localhost:8080
```

---

# Running the Rust Security Core

Move into the Rust project.

```bash
cd security-core
```

Build.

```bash
cargo build
```

Run tests.

```bash
cargo test
```

---

# Development Workflow

1. Start the Go relay server.

2. Start the Rust security core.

3. Launch the React Native application.

4. Connect an Android device.

5. Test secure messaging.

---

# API Documentation

Swagger/OpenAPI support will be added in a future release.

After implementation the API documentation will be accessible through

```
http://localhost:8080/swagger
```

---

# Current Project Status

Current development progress includes

- User Interface
- Navigation
- Native Android Integration
- Rust Identity Generation
- Secure Messaging UI
- Relay Server Foundation
- APK Packaging
- Project Documentation

Currently under development

- Relay Integration
- End-to-End Encryption Pipeline
- Swagger Documentation
- Remote Relay Deployment

---

# Future Improvements

- Message Attachments
- Voice Notes
- Group Messaging
- Onion Routing
- Decentralized Relays
- Offline Message Queue
- Desktop Client
- iOS Support
- Push Notifications

---

# Contributing

Fork the repository.

Create a feature branch.

```bash
git checkout -b feature/new-feature
```

Commit your changes.

```bash
git commit -m "Added new feature"
```

Push your branch.

```bash
git push origin feature/new-feature
```

Create a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Authors

Athman Ibrahim

Bachelor of Science in Computer Science (Network Security)

Mount Kenya University

---

# Acknowledgements

Special thanks to the open-source communities behind

- React Native
- Expo
- Rust
- Go
- Android
- UniFFI
- React Navigation

whose tools and libraries made the development of GhostRelay possible.

---

**GhostRelay**

*"Secure Communication. Anonymous by Design."*
