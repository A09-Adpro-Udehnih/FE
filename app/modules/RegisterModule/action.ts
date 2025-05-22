import type { ActionFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";
import { sessionCookie } from "~/lib/auth.server";

interface RegisterActionResponse {
  email: string;
  fullName: string;
  role: "student" | "teacher";
  token: string;
}

export async function RegisterAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  if (!fullName || !email || !password || !role) {
    return Response.json({
      success: false,
      code: 400,
      error: "Missing required fields",
      message: "Missing required fields",
      data: null,
    });
  }

  const response = await fetcher<RegisterActionResponse>(
    "auth/v1/register",
    request,
    false,
    {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, role }),
    }
  );

  return response;
}
