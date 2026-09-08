const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  "http://192.168.1.8:8080";

export { API_BASE_URL };

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    }
  );

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;

    try {
      const errorBody: unknown = await response.json();

      if (
        typeof errorBody === "object" &&
        errorBody !== null &&
        "message" in errorBody &&
        typeof errorBody.message === "string"
      ) {
        errorMessage = errorBody.message;
      }
    } catch {
      // The response does not contain a JSON error body.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}