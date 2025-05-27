import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

interface CourseEnrolledResponse {
  id: string;
  name: string;
  description: string;
  tutor: string;
  enrollmentDate: string;
}

const ENROLLED_COURSES_URL = "api/v1/course/courses/my-courses";

export async function CourseEnrolledBrowsingLoader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect("/login");
  }

  // Get search parameters from URL
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || '';
  const keyword = url.searchParams.get('keyword') || '';

  // Construct API URL with query parameters
  const searchParams = new URLSearchParams();
  searchParams.append('userId', user.userId);
  if (keyword) {
    searchParams.append('keyword', keyword);
    searchParams.append('type', type);
  }

  // Fetch enrolled courses from API
  const searchParamsString = searchParams.toString();
  const coursesResponse = await fetcher<CourseEnrolledResponse[]>(
    `${ENROLLED_COURSES_URL}?${searchParamsString}`,
    request
  );

  return coursesResponse.data;
}
