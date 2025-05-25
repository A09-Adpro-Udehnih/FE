import type { LoaderFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";

export type TutorApplication = {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
};

export type TutorRegistrationResponse = {
  status: string | null;
  tutorApplicationId?: string;
  message?: string;
};

export async function TutorRegistrationLoader({ request }: LoaderFunctionArgs) {
  try {
    const response = await fetcher<TutorRegistrationResponse>(
      '/tutors/registration',
      request,
      true
    );
    
    return response;
  } catch (error) {
    console.error("Error loading tutor registration status:", error);
    return { 
      success: false, 
      code: 500,
      error: "Failed to load tutor application status",
      message: "An error occurred while checking your tutor application status.",
      data: null
    };
  }
}
