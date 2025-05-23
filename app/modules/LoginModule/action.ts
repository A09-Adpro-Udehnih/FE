import { redirect, type ActionFunctionArgs } from "react-router";
import { sessionCookie } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

interface LoginActionResponse {
  email: string;
  fullName: string;
  role: "student" | "teacher";
  token: string;
}

export async function LoginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return Response.json({
      success: false,
      message: "Missing required fields",
    });
  }

  const response = await fetcher<LoginActionResponse>(
    "auth/v1/login",
    request,
    false,
    { method: "POST", body: JSON.stringify({ email, password }) }
  );

  console.log(response);

  if (response.success) {
    const cookie = await sessionCookie.serialize(response.data.token);
    return redirect("/", { headers: { "Set-Cookie": cookie } });
  }

  return response;
}
