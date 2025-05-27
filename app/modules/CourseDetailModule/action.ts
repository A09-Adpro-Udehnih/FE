import { redirect, type ActionFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

const ENROLL_COURSE_URL = "api/v1/course/courses";

export async function CourseDetailAction({ request, params }: ActionFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect("/login");
  }

  const courseId = params.courseId;
  if (!courseId) {
    return { success: false, message: "Course ID is required" };
  }

  // Parse form data if needed
  const formData = await request.formData();
  const action = formData.get("action") as string;

  // Handle enrollment action
  if (action === "enroll") {
    const searchParams = new URLSearchParams();
    searchParams.append('userId', user.userId);
    
    const searchParamsString = searchParams.toString();
    
    try {
      const response = await fetcher(
        `${ENROLL_COURSE_URL}/${courseId}/enroll?${searchParamsString}`,
        request,
        true,
        { method: "POST" }
      );
      
      if (response.success) {
        return {
          success: true, 
          message: "Successfully enrolled in the course",
          redirectTo: `/courseEnrolledDetail/${courseId}`
        };
      } else {
        return {
          success: false, 
          message: response.message || "Failed to enroll in the course"
        };
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      return { 
        success: false, 
        message: "An error occurred while enrolling in the course" 
      };
    }
  }
  
  return { success: false, message: "Unsupported action" };
}