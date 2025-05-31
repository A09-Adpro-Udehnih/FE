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
  }  // Get course students
  if (intent === "get-students") {
    const courseId = formData.get("courseId");

    if (!courseId) {
      return {
        success: false,
        message: "Course ID is required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/students`, request, true, {
        method: "GET",
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to get course students",
      };
    }
  }

  // Get course sections
  if (intent === "get-sections") {
    const courseId = formData.get("courseId");

    if (!courseId) {
      return {
        success: false,
        message: "Course ID is required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections`, request, true, {
        method: "GET",
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to get course sections",
      };
    }
  }

  // Create section
  if (intent === "create-section") {
    const courseId = formData.get("courseId");
    const title = formData.get("title");
    const position = formData.get("position");

    if (!courseId || !title) {
      return {
        success: false,
        message: "Course ID and title are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections`, request, true, {
        method: "POST",
        body: JSON.stringify({
          title,
          position: position ? parseInt(position as string) : null,
        }),
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to create section",
      };
    }
  }

  // Update section
  if (intent === "update-section") {
    const courseId = formData.get("courseId");
    const sectionId = formData.get("sectionId");
    const title = formData.get("title");
    const position = formData.get("position");

    if (!courseId || !sectionId || !title) {
      return {
        success: false,
        message: "Course ID, section ID, and title are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}`, request, true, {
        method: "PUT",
        body: JSON.stringify({
          title,
          position: position ? parseInt(position as string) : null,
        }),
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to update section",
      };
    }
  }

  // Delete section
  if (intent === "delete-section") {
    const courseId = formData.get("courseId");
    const sectionId = formData.get("sectionId");

    if (!courseId || !sectionId) {
      return {
        success: false,
        message: "Course ID and section ID are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}`, request, true, {
        method: "DELETE",
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete section",
      };
    }
  }

  // Create article
  if (intent === "create-article") {
    const courseId = formData.get("courseId");
    const sectionId = formData.get("sectionId");
    const title = formData.get("title");
    const content = formData.get("content");
    const position = formData.get("position");

    if (!courseId || !sectionId || !title || !content) {
      return {
        success: false,
        message: "Course ID, section ID, title, and content are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}/articles`, request, true, {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
          position: position ? parseInt(position as string) : null,
        }),
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to create article",
      };
    }
  }

  // Update article
  if (intent === "update-article") {
    const courseId = formData.get("courseId");
    const sectionId = formData.get("sectionId");
    const articleId = formData.get("articleId");
    const title = formData.get("title");
    const content = formData.get("content");
    const position = formData.get("position");

    if (!courseId || !sectionId || !articleId || !title || !content) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}/articles/${articleId}`, request, true, {
        method: "PUT",
        body: JSON.stringify({
          title,
          content,
          position: position ? parseInt(position as string) : null,
        }),
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to update article",
      };
    }
  }

  // Delete article
  if (intent === "delete-article") {
    const courseId = formData.get("courseId");
    const sectionId = formData.get("sectionId");
    const articleId = formData.get("articleId");

    if (!courseId || !sectionId || !articleId) {
      return {
        success: false,
        message: "Course ID, section ID, and article ID are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}/articles/${articleId}`, request, true, {
        method: "DELETE",
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete article",
      };
    }
  }

  return {
    success: false,
    message: "Invalid request",
  };
}