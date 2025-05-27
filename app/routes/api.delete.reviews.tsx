import { type ActionFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";

export async function action({ request }: ActionFunctionArgs) {
  const CREATE_REVIEW_URL = "api/v1/course/reviews";
  const body = await request.json();

  const response = await fetcher(
    `${CREATE_REVIEW_URL}/${body.id}`,
    request,
    true,
    {
      method: "DELETE",
    }
  );

  if (!response.success) {
    return Response.json(
      { error: response.message },
      { status: response.code }
    );
  }

  return Response.json(
    { message: "Review deleted successfully" },
    { status: 200 }
  );
}
