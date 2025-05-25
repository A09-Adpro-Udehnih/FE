import { getSessionCookie } from "./auth.server";

export type GeneralResponse<T> = {
  success: boolean;
  code: number;
  error: string | null;
  message: string;
  data: T;
};

export const fetcher = async <T>(
  url: string,
  request: Request,
  authenticated: boolean = true,
  options?: RequestInit
) => {  const token = await getSessionCookie(request);
  const apiUrl = process.env.API_URL || 'http://localhost:8080';
  const fullUrl = `${apiUrl}${url}`;
  
  console.log(`Fetching from: ${fullUrl}`);
  console.log(`Authorization: ${token ? 'Bearer token present' : 'No token'}`);
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && authenticated ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      code: response.status,
      error: response.statusText,
      message: response.statusText,
      data: null,
    } as GeneralResponse<T>;
  }

  // Safely handle the response text and JSON parsing
  try {
    const text = await response.text();

    // Handle empty response
    if (!text || text.trim() === "") {
      return {
        success: true,
        code: 204,
        error: null,
        message: "No content",
        data: null as unknown as T,
      } as GeneralResponse<T>;
    }

    // Parse JSON with error handling
    try {
      const data = JSON.parse(text);
      return data as GeneralResponse<T>;
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError, "Raw response:", text);
      return {
        success: false,
        code: 500,
        error: "Invalid JSON response",
        message: "The server returned invalid JSON data",
        data: null as unknown as T,
      } as GeneralResponse<T>;
    }
  } catch (error) {
    console.error("Error handling response:", error);
    return {
      success: false,
      code: 500,
      error: "Failed to process response",
      message: "An error occurred while processing the server response",
      data: null as unknown as T,
    } as GeneralResponse<T>;
  }
};
