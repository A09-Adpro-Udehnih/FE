import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

interface Section {
  id: string;
  title: string;
}

interface CourseBrowsingModuleResponse {
  id: string;
  name: string;
  description: string;
  tutor: string;
  price: number;
}

const COURSE_BROWSING_URL = "api/v1/course/courses";

export async function CourseBrowsingLoader({ request }: LoaderFunctionArgs) {
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
  if (keyword) {
    searchParams.append('keyword', keyword);
    searchParams.append('type', type);
  }
  
  // Fetch courses from API
  const searchParamsString = searchParams.toString();
  const coursesResponse = await fetcher<CourseBrowsingModuleResponse[]>(
    `${searchParamsString ? `${COURSE_BROWSING_URL}?${searchParamsString}` : COURSE_BROWSING_URL}`,
    request
  );
  return coursesResponse.data;
}
