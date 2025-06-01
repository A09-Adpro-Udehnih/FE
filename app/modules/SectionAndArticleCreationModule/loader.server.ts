import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";
import type { SectionAndArticleLoaderData } from "./types";

export async function SectionAndArticleCreationLoader({ request, params }: LoaderFunctionArgs): Promise<SectionAndArticleLoaderData> {
  try {
    const user = await getUserFromRequest(request);
    const courseId = params.courseId;

    if (!user) {
      throw new Response("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      throw new Response("Course ID is required", { status: 400 });
    }

    // Get courses with sections using the /mine endpoint
    const coursesResponse = await fetcher(`api/v1/course/courses/mine`, request);

    console.log("Courses response:", coursesResponse);

    if (!coursesResponse.success) {
      throw new Response("Failed to fetch courses", { 
        status: coursesResponse.code || 500 
      });
    }

    // The API returns { courses: [...], code: 200, success: true }
    // which matches exactly what we need
    const courses = coursesResponse.courses || [];
    const course = courses.find((c: any) => c.id === courseId);

    if (!course) {
      throw new Response("Course not found", { status: 404 });
    }

    // Extract sections from the course (they're nested in the course object)
    const sections = course.sections || [];

    return {
      course: course as any,
      sections: sections as any,
      courseId
    };

  } catch (error) {
    console.error('Loader error:', error);
    
    // If it's already a Response, re-throw it
    if (error instanceof Response) {
      throw error;
    }
    
    // Otherwise, create a generic error response
    throw new Response("Internal Server Error", { status: 500 });
  }
}
