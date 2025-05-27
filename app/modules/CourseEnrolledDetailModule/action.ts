import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getUserFromRequest } from "~/lib/auth.server";
import { fetcher } from "~/lib/fetch.server";

const UNENROLL_COURSE_URL = "api/v1/course/courses";

export async function CourseEnrolledDetailAction({ request, params }: ActionFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect("/login");
  }

  const courseId = params.courseId;
  if (!courseId) {
    return { success: false, message: "Course ID is required" };
  }

  // Parse form data
  const formData = await request.formData();
  const action = formData.get("action") as string;

  // Handle refund/unenroll action
  if (action === "refund") {
    const searchParams = new URLSearchParams();
    searchParams.append('userId', user.userId);
    
    const searchParamsString = searchParams.toString();
    
    try {
      const response = await fetcher(
        `${UNENROLL_COURSE_URL}/${courseId}/unenroll?${searchParamsString}`,
        request,
        true,
        { method: "DELETE" }
      );
      
      if (response.success) {
        return {
          success: true, 
          message: "Successfully unenrolled from the course",
          redirectTo: "/courseEnrolledBrowsing"
        };
      } else {
        return {
          success: false, 
          message: response.message || "Failed to unenroll from the course"
        };
      }
    } catch (error) {
      console.error("Unenroll error:", error);
      return { 
        success: false, 
        message: "An error occurred while processing your refund request" 
      };
    }
  }
  
  return { success: false, message: "Unsupported action" };
}
