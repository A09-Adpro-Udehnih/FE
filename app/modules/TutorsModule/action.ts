import type { ActionFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";

export async function TutorsAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  // Submit tutor application
  if (intent === "apply") {
    try {
      const response = await fetcher("api/v1/course/tutors/registration", request, true, {
        method: "POST",
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to submit tutor application",
      };
    }
  }

  // Cancel tutor application
  if (intent === "cancel") {
    try {
      const response = await fetcher("api/v1/course/tutors/registration", request, true, {
        method: "DELETE",
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to cancel tutor application",
      };
    }
  }

  // Create new course
  if (intent === "create-course") {
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");

    if (!name || !description || !price) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }    try {
      const response = await fetcher("api/v1/course/courses", request, true, {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
        }),
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to create course",
      };
    }
  }

  // Update course
  if (intent === "update-course") {
    const courseId = formData.get("courseId");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");    if (!courseId || !name || !description || !price) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}`, request, true, {
        method: "PUT",
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
        }),
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to update course",
      };
    }
  }

  // Delete course
  if (intent === "delete-course") {
    const courseId = formData.get("courseId");

    if (!courseId) {
      return {
        success: false,
        message: "Course ID is required",
      };
    }    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}`, request, true, {
        method: "DELETE",
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete course",
      };
    }
  }
  return {
    success: false,
    message: "Invalid request",
  };
}