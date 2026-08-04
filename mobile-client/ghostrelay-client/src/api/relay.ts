import { api } from "./client";
import { RelayRequest } from "./types";

export async function relayMessage(message: RelayRequest) {
  const response = await api.post("/relay", message);
  return response.data;
}

export async function getMessages(receiverId: string) {
  const response = await api.get(`/messages/${receiverId}`);
  return response.data;
}

export async function deleteMessage(id: string) {
  return api.delete(`/messages/${id}`);
}