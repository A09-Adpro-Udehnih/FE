import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

export type ReviewRatingModuleLoaderResponse = {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export async function ReviewRatingModuleLoader({
  request,
}: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return redirect("/login");
  }

  const response = await fetcher<ReviewRatingModuleLoaderResponse[]>(
    `api/v1/course/reviews/user/${user.userId}`,
    request,
    true
  );

  return response.data;
}
