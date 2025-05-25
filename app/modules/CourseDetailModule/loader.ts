import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

interface Section {
  id: string;
  title: string;
}

interface CourseDetailResponse {
  id: string;
  name: string;
  description: string;
  tutor: string;
  price: number;
  sections: Section[];
}

const COURSE_DETAIL_URL = "api/v1/course/courses";

export async function CourseDetailLoader({ request, params }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect("/login");
  }

  const courseId = params.courseId;
  if (!courseId) {
    throw new Response("Course ID is required", { status: 400 });
  }

  const response = await fetcher<CourseDetailResponse>(
    `${COURSE_DETAIL_URL}/${courseId}`,
    request
  );
  
  if (!response.data) {
    throw new Response("Course not found", { status: 404 });
  }
    
  return response.data;
}
