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
}
