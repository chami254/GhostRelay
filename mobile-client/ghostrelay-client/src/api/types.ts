export interface Identity {
  id: string;
  publicKey: string;
  signingPublicKey: string;
  fingerprint?: string;
  createdAt?: string;
}

export interface RelayRequest {
  id: string;
  senderId: string;
  receiverId: string;
  ciphertext: string;
  nonce: string;
  signature: string;
  algorithm: string;
  createdAt: string;
  expiresAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  ciphertext: string;
  nonce: string;
  signature: string;
  algorithm: string;
  createdAt: string;
  expiresAt: string;
  publicKey: string;
  signingPublicKey: string;
}