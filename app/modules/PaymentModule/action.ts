import type { ActionFunctionArgs } from "react-router";
import { getSessionCookie } from "~/lib/auth.server";
import { redirect } from "react-router";

export async function PaymentAction({ request }: ActionFunctionArgs) {
  const token = await getSessionCookie(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;

  console.log("==> Payment Action called with type:", actionType);

  try {
    switch (actionType) {
      case "createPayment": {
        const paymentData = {
          userId: formData.get("userId"),
          courseId: formData.get("courseId"),
          amount: parseFloat(formData.get("amount") as string),
          method: formData.get("method"),
          bankAccount: formData.get("bankAccount"),
          cardNumber: formData.get("cardNumber"),
          cardCvc: formData.get("cardCvc"),
        };

        const res = await fetch(`${process.env.API_URL}api/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(paymentData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create payment");
        }

        const result = await res.json();
        console.log("==> Payment created successfully:", result);
        return { success: true, payment: result };
      }

      case "updatePaymentStatus": {
        const paymentId = formData.get("paymentId") as string;
        const status = formData.get("status") as string;

        const res = await fetch(
          `${process.env.API_URL}api/admin/payments/${paymentId}/status?status=${status}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update payment status");
        }

        const result = await res.json();
        console.log("==> Payment status updated successfully:", result);
        return { success: true, payment: result };
      }

      case "requestRefund": {
        const paymentId = formData.get("paymentId") as string;
        const reason = formData.get("reason") as string;

        const res = await fetch(
          `${process.env.API_URL}api/payments/${paymentId}/refund`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ reason }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to request refund");
        }

        const result = await res.json();
        console.log("==> Refund requested successfully:", result);
        return { success: true, payment: result };
      }

      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  } catch (error) {
    console.error("==> Payment Action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}