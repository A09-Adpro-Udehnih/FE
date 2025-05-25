import type { ActionFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";

export async function TutorRegistrationAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  // Submit tutor application
  if (intent === "apply") {
    try {
      const response = await fetcher(
        "/tutors/registration",
        request, 
        true,
        { method: "POST" }
      );
      
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
      const response = await fetcher(
        "/tutors/registration", 
        request, 
        true,
        { method: "DELETE" }
      );

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
