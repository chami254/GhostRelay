import axios from "axios";

export const api = axios.create({
  baseURL: "http://YOUR_PC_IP:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const API_BASE_URL = "http://192.168.1.100:8080";

// Android Emulator:
// http://10.0.2.2:8080

// Physical Phone:
// Replace with your PC's LAN IP

export async function apiFetch(
  endpoint: string,
  options?: RequestInit
) {

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    }
  );

  if (!response.ok) {

    throw new Error(
      `HTTP ${response.status}`
    );

  }

  return response.json();

}