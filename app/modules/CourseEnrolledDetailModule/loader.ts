import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

interface Article {
  id: string;
  title: string;
  content: string;
}

interface Section {
  id: string;
  title: string;
  articles: Article[];
}

interface CourseEnrolledDetailResponse {
  id: string;
  name: string;
  description: string;
  tutor: string;
  enrollmentDate: string;
  sections: Section[];
}

const COURSE_ENROLLED_DETAIL_URL = "api/v1/course/courses/my-courses";

export async function CourseEnrolledDetailLoader({ request, params }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect("/login");
  }

  const courseId = params.courseId;
  if (!courseId) {
    throw new Response("Course ID is required", { status: 400 });
  }

  const searchParams = new URLSearchParams();
  searchParams.append('userId', user.userId);

  const searchParamsString = searchParams.toString();
  const response = await fetcher<CourseEnrolledDetailResponse>(
    `${COURSE_ENROLLED_DETAIL_URL}/${courseId}?${searchParamsString}`,
    request
  );
  
  if (!response.data) {
    throw new Response("Enrolled course not found", { status: 404 });
  }
  
  return response.data;
}
