import type { LoaderFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";

export type TutorApplication = {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
};

export type TutorRegistrationResponse = {
  success: boolean;
  code: number;
  error: string | null;
  message: string;
  data: {
    status: string | null;
    tutorApplicationId?: string | null;
    isDeletedOrDenied?: boolean;
    isPending?: boolean;
  };
};

export async function TutorRegistrationLoader({ request }: LoaderFunctionArgs) {  
  try {
    // The backend returns data directly, not wrapped in a "data" property
    const response = await fetcher<{
      status?: string;
      tutorApplicationId?: string;    }>("api/v1/course/tutors/registration", request, true);
      console.log("TutorRegistrationLoader raw API response:", response);
      // The backend API returns { code, success, status, tutorApplicationId } directly
    // The fetcher casts this as GeneralResponse<T>, but the actual structure is flat
    const status = (response as any)?.status || null;
    const tutorApplicationId = (response as any)?.tutorApplicationId || null;
    
    console.log("Parsed status:", status);
    console.log("Parsed tutorApplicationId:", tutorApplicationId);
    
    // Determine application state based on response structure
    const hasTutorAppId = !!tutorApplicationId;
    
    // If there's no status but we have a tutorApplicationId, it's likely PENDING
    const isPending = response.success && hasTutorAppId && !status;
    
    // If there's no tutorApplicationId but the request was successful,
    // this likely means the application was DENIED or deleted
    const isDeletedOrDenied = response.success && !hasTutorAppId && !status;
    
    return {
      success: response.success,
      code: response.code,
      error: response.error || null,
      message: response.message || 
        (isDeletedOrDenied ? "Your application has been denied or deleted." : 
         isPending ? "Your application is pending review." : ""),
      data: {
        status: isPending ? "PENDING" : status,
        tutorApplicationId: tutorApplicationId,
        isDeletedOrDenied: isDeletedOrDenied,
        isPending: isPending
      }
    };
  } catch (error) {
    console.error("Error loading tutor registration status:", error);
    return { 
      success: false, 
      code: 500,
      error: "Failed to load tutor application status",
      message: "An error occurred while checking your tutor application status.",
      data: { status: null }
    };
  }
}
