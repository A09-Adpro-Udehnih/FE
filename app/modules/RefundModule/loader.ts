import type { LoaderFunctionArgs } from "react-router";
import { getSessionCookie } from "~/lib/auth.server";

interface RefundResponse {
  id: string;
  paymentId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  requestedAt?: string;
}

export async function RefundLoader({ params, request }: LoaderFunctionArgs) {
  const paymentId = params.paymentId;

  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  try {
    const token = await getSessionCookie(request);
    const res = await fetch(`${process.env.API_URL}api/v1/payment/${paymentId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Payment not found: ${res.status}`);
    }

    return {
      paymentId
    };
  } catch (error) {
    console.error("==> Payment fetch error:", error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      paymentId
    };
  }
}
