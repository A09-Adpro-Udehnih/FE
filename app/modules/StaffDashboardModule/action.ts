import { redirect, type ActionFunctionArgs } from "react-router";
import { getSessionCookie, getUserFromRequest } from "~/lib/auth.server";


export async function StaffDashboardAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const type = formData.get("type") as string;
  const action = formData.get("actionType") as "approve" | "reject";

  // ⬇️ Get user and validate
  const user = await getUserFromRequest(request);
  if (!user || user.role !== "STAFF") {
    return redirect("/unauthorized");
  }

  const token = await getSessionCookie(request);
  if (!token) {
    return redirect("/login");
  }

  const apiUrl = `${import.meta.env.VITE_API_URL}api/v1/staff/approval/${action}/${type}/${id}`;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const message = await res.text();
      return Response.json({ success: false, message }, { status: res.status });
    }

    return Response.json({ success: true, message: "Action successful" });
  } catch (err) {
    console.error("Error forwarding approval:", err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
