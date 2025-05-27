import type { ActionFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";

export async function TutorRegistrationAction({ request }: ActionFunctionArgs) {
  console.log("TutorRegistrationAction called");
  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log("Intent:", intent);

  // Submit tutor application
  if (intent === "apply") {
    try {
      console.log("Sending tutor application request...");      const response = await fetcher<{
        status: string | null;
        tutorApplicationId?: string;
      }>(
        "api/v1/course/tutors/registration",
        request, 
        true,
        { method: "POST" }
      );
      
      console.log("Application response:", response);
      return response;
    } catch (error) {
      console.error("Error submitting tutor application:", error);
      return { 
        success: false, 
        code: 500,
        error: "Failed to submit application",
        message: "An error occurred while submitting your tutor application.",
        data: null
      };
    }
  }

  // Cancel tutor application
  if (intent === "cancel") {
    try {
      console.log("Sending cancel tutor application request...");      const response = await fetcher<{
        status?: string | null;
        tutorApplicationId?: string;
      }>(
        "api/v1/course/tutors/registration", 
        request, 
        true,
        { method: "DELETE" }
      );

      console.log("Cancel response:", response);
      return response;
    } catch (error) {
      console.error("Error cancelling tutor application:", error);
      return { 
        success: false, 
        code: 500,
        error: "Failed to cancel application",
        message: "An error occurred while cancelling your tutor application.",
        data: null
      };
    }
  }

  return { 
    success: false, 
    code: 400,
    error: "Invalid request",
    message: "Invalid action intent.",
    data: null
  };
}
