import type { ActionFunctionArgs } from "react-router";
import { getSessionCookie } from "~/lib/auth.server";

interface RefundRequest {
  reason: string;
}

interface RefundResponse {
  id: string;
  paymentId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export async function RefundAction({ request }: ActionFunctionArgs) {
  const token = await getSessionCookie(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;

  console.log("==> Refund Action called with type:", actionType);

  try {
    switch (actionType) {
      case "requestRefund": {
        const paymentId = formData.get("paymentId");
        const reason = formData.get("reason");

        if (!paymentId || !reason) {
          throw new Error("Payment ID and reason are required");
        }

        const refundRequest: RefundRequest = {
          reason: reason.toString(),
        };

        const res = await fetch(
          `http://localhost:8083/api/v1/payment/refunds/${paymentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(refundRequest),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to request refund");
        }

        const result = await res.json();
        console.log("==> Refund requested successfully:", result);
        return { success: true, refund: result };
      }

      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  } catch (error) {
    console.error("==> Refund Action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
