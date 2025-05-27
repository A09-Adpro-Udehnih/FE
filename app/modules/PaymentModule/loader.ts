import type { LoaderFunctionArgs } from "react-router";
import { getSessionCookie } from "~/lib/auth.server";

export async function PaymentLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const paymentId = url.searchParams.get('paymentId');
  
  // Determine which endpoint to call based on query parameters
  let endpoint = '';
  if (paymentId) {
    endpoint = `${process.env.API_URL}api/payments/${paymentId}`;
  } else if (userId) {
    endpoint = `${process.env.API_URL}api/payments/user/${userId}`;
  } else {
    // Default: get pending payments for admin
    endpoint = `${process.env.API_URL}api/admin/payments/pending`;
  }

  console.log("==> Payment Loader fetching from:", endpoint);

  try {
    const token = await getSessionCookie(request);
    const res = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log("==> Payment fetch completed! Status:", res.status);

    if (!res.ok) {
      console.error("==> Payment API call failed:", res.status, await res.text());
      throw new Error(`Failed to load payments: ${res.status}`);
    }

    const result = await res.json();
    console.log("==> Payment fetch successful! Returning data.");
    
    return {
      payments: Array.isArray(result) ? result : [result],
      endpoint,
      userId,
      paymentId
    };
  } catch (error) {
    console.error("==> Payment fetch error:", error);
    return {
      payments: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      endpoint,
      userId,
      paymentId
    };
  }
}