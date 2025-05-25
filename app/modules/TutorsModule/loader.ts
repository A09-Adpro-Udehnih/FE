import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

export interface TutorApplication {
  id: string;
  studentId: string;
  status: "PENDING" | "ACCEPTED" | "DENIED";
  createdAt: string;
}

export async function TutorsLoader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return { 
      user: null,
      tutorApplication: null,
      userCourses: null,
      error: null 
    };
  }

  try {
    // Check if user has a tutor application
    let applicationResponse;
    try {
      const response = await fetcher<{
        status: string;
        tutorApplicationId?: string; 
      }>("/tutors/registration", request, true);
      
      applicationResponse = {
        success: response.success,
        data: {
          id: response.data?.tutorApplicationId || "",
          status: response.data?.status || null,
          studentId: user.userId || user.sub || "",
          createdAt: new Date().toISOString()
        },
        message: response.message
      };
    } catch (error) {
      console.log('Failed to fetch tutor application:', error);
      applicationResponse = { success: false, data: null, message: 'Not found' };
    }
    
    // If user is a tutor, fetch their courses
    let coursesResponse = null;
    const isTeacher = user.role === "teacher" || user.role === "TEACHER";
    const isAcceptedTutor = applicationResponse.success && applicationResponse.data?.status === "ACCEPTED";
    
    if (isTeacher || isAcceptedTutor) {
      try {
        const response = await fetcher<{ courses: any[] }>("/courses/mine", request, true);
        
        coursesResponse = {
          success: response.success,
          courses: response.data?.courses || [],
          message: response.message
        };
      } catch (error) {
        console.log('Failed to fetch courses:', error);
        coursesResponse = { success: false, courses: [], message: 'Failed to load courses' };
      }
    }

    return {
      user,
      tutorApplication: applicationResponse.success ? applicationResponse.data : null,
      userCourses: coursesResponse?.success ? coursesResponse.courses : null,
      error: null
    };
  } catch (error) {
    return {
      user,
      tutorApplication: null,
      userCourses: null,
      error: "Failed to load tutor data"
    };
  }
}