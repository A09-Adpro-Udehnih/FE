import type { LoaderFunctionArgs } from "react-router";
import { getSessionCookie } from "~/lib/auth.server";

interface RefundResponse {
  id: string;
  paymentId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export async function RefundLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const refundId = url.searchParams.get("refundId");

  // Determine which endpoint to call
  const endpoint = refundId
    ? `http://localhost:8083/api/v1/payment/refunds/${refundId}`
    : `http://localhost:8083/api/v1/payment/refunds/pending`;

  console.log("==> Refund Loader fetching from:", endpoint);

  try {
    const token = await getSessionCookie(request);
    const res = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log("==> Refund fetch completed! Status:", res.status);

    if (!res.ok) {
      console.error("==> Refund API call failed:", res.status, await res.text());
      throw new Error(`Failed to load refund: ${res.status}`);
    }

    const result = await res.json();
    console.log("==> Refund fetch successful! Returning data.");

    return {
      refunds: Array.isArray(result) ? result : [result],
      endpoint,
      refundId
    };
  } catch (error) {
    console.error("==> Refund fetch error:", error);
    return {
      refunds: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      endpoint,
      refundId
    };
  }
}
