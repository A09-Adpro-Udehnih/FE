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
    tutorApplicationId?: string;
  };
};

export async function TutorRegistrationLoader({ request }: LoaderFunctionArgs) {
  try {
    const response = await fetcher<{
      status: string | null;
      tutorApplicationId?: string;
    }>("/tutors/registration", request, true);

    // Transform the response to match our expected structure
    return {
      success: response.success,
      code: response.code,
      error: response.error,
      message: response.message,
      data: {
        status: response.data?.status || null,
        tutorApplicationId: response.data?.tutorApplicationId
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
