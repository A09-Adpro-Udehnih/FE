import { redirect, type LoaderFunctionArgs } from "react-router";
import { getSessionCookie, getUserFromRequest } from "~/lib/auth.server";

export async function StaffDashboardLoader({ request }: LoaderFunctionArgs) {
  console.log("==> StaffDashboardLoader started");

  // Get user menggunakan helper yang sudah ada
  const user = await getUserFromRequest(request);
  if (!user) {
    console.log("==> No user found, redirecting to login");
    return redirect("/login");
  }

  // Validasi role user
  if (user.role !== 'STAFF') {
    console.log("==> User role is not STAFF:", user.role);
    return redirect("/unauthorized");
  }

  console.log("==> Role check passed:", user.role);
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