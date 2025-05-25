import type { LoaderFunctionArgs } from "react-router";
import { getSessionCookie } from "~/lib/auth.server";

export async function StaffDashboardLoader({ request }: LoaderFunctionArgs) {
  // Langsung tuju ke backend staff di port 8082
  const fullUrl = `${import.meta.env.VITE_API_URL}api/v1/staff/resources/dashboard`;

  console.log("==> Loader fetching directly from:", fullUrl);

  try {
    const token = await getSessionCookie(request);
    const res = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log("==> Fetch completed! Status:", res.status);

    if (!res.ok) {
      console.error("==> API call failed:", res.status, await res.text());
      throw new Error(`Failed to load staff dashboard: ${res.status}`);
    }

    console.log("==> Fetch successful! Returning data.");
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("==> Fetch function caught an error:", error);
    throw error;
  }
}