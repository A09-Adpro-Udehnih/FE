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

interface CourseReviewResponse {
  id: string;
  course: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updateAt: string;
}

const COURSE_ENROLLED_DETAIL_URL = "api/v1/course/courses/my-courses";
const COURSE_REVIEW_URL = "api/v1/course/reviews/course";

export async function CourseEnrolledDetailLoader({
  request,
  params,
}: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect("/login");
  }

  const courseId = params.courseId;
  if (!courseId) {
    throw new Response("Course ID is required", { status: 400 });
  }

  const searchParams = new URLSearchParams();
  searchParams.append("userId", user.userId);

  const searchParamsString = searchParams.toString();
  const response = await fetcher<CourseEnrolledDetailResponse>(
    `${COURSE_ENROLLED_DETAIL_URL}/${courseId}?${searchParamsString}`,
    request
  );

  const url = new URL(request.url);
  const commentPage = Number(url.searchParams.get("comments") || "0");

  const reviews = await fetcher<CourseReviewResponse[]>(
    `${COURSE_REVIEW_URL}/${courseId}?page=${commentPage}`,
    request
  );

  if (!response.data) {
    throw new Response("Enrolled course not found", { status: 404 });
  }

  console.log(reviews);

  return { course: response.data, reviews: reviews.data, userId: user.userId };
}
