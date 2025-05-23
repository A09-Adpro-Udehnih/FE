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
) => {
  const token = await getSessionCookie(request);
  const response = await fetch(`${process.env.API_URL}${url}`, {
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

  return response.json() as Promise<GeneralResponse<T>>;
};
