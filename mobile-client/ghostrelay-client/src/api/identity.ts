import { api } from "./client";
import { Identity } from "./types";

export async function registerIdentity(identity: Identity) {
  const response = await api.post("/identity", identity);
  return response.data;
}