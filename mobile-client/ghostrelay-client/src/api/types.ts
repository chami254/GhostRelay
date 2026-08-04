export interface Identity {
  id: string;
  publicKey: string;
  createdAt?: string;
}

export interface RelayRequest {
  senderId: string;
  receiverId: string;
  ciphertext: string;
  nonce: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  ciphertext: string;
  nonce: string;
  createdAt: string;
}