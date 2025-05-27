import { type ActionFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";

const CREATE_REVIEW_URL = "api/v1/course/reviews";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();

  const response = await fetcher(
    CREATE_REVIEW_URL,
    request,
    true,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  if (!response.success) {
    return Response.json(
      { error: response.message },
      { status: response.code }
    );
  }

  return Response.json(
    { message: "Review created successfully" },
    { status: 200 }
  );
}
