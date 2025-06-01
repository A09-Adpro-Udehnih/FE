import type { ActionFunctionArgs } from "react-router";
import { fetcher } from "~/lib/fetch.server";
import type { SectionAndArticleActionData } from "./types";

export async function SectionAndArticleCreationAction({ request, params }: ActionFunctionArgs): Promise<SectionAndArticleActionData> {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const courseId = params.courseId;

  if (!courseId) {
    return {
      success: false,
      message: "Course ID is required",
    };
  }

  // Create section
  if (intent === "create-section") {
    const title = formData.get("title");
    // const position = formData.get("position"); // Position is handled by backend

    if (!title) {
      return {
        success: false,
        message: "Section title is required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections`, request, true, {
        method: "POST",
        body: JSON.stringify({
          title,
          // position: position ? parseInt(position as string) : null, // Backend handles position
        }),
      });
      // Assuming fetcher returns a compatible type or SectionAndArticleActionData wraps it
      return response as SectionAndArticleActionData;
    } catch (error) {
      return {
        success: false,
        message: "Failed to create section",
      };
    }
  }

  // Update section
  if (intent === "update-section") {
    const sectionId = formData.get("sectionId");
    const title = formData.get("title");
    // const position = formData.get("position");

    if (!sectionId || !title) {
      return {
        success: false,
        message: "Section ID and title are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}`, request, true, {
        method: "PUT",
        body: JSON.stringify({
          title,
          // position: position ? parseInt(position as string) : null,
        }),
      });
      return response as SectionAndArticleActionData;
    } catch (error) {
      return {
        success: false,
        message: "Failed to update section",
      };
    }
  }

  // Delete section
  if (intent === "delete-section") {
    const sectionId = formData.get("sectionId");

    if (!sectionId) {
      return {
        success: false,
        message: "Section ID is required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}`, request, true, {
        method: "DELETE",
      });
      return response as SectionAndArticleActionData;
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete section",
      };
    }
  }

  // Create article
  if (intent === "create-article") {
    const sectionId = formData.get("sectionId");
    const title = formData.get("title");
    const content = formData.get("content");
    // const position = formData.get("position");

    if (!sectionId || !title || !content) {
      return {
        success: false,
        message: "Section ID, title, and content are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}/articles`, request, true, {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
          // position: position ? parseInt(position as string) : null,
        }),
      });
      return response as SectionAndArticleActionData;
    } catch (error) {
      return {
        success: false,
        message: "Failed to create article",
      };
    }
  }

  // Update article
  if (intent === "update-article") {
    const sectionId = formData.get("sectionId");
    const articleId = formData.get("articleId");
    const title = formData.get("title");
    const content = formData.get("content");
    // const position = formData.get("position");

    if (!sectionId || !articleId || !title || !content) {
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
          // position: position ? parseInt(position as string) : null,
        }),
      });
      return response as SectionAndArticleActionData;
    } catch (error) {
      return {
        success: false,
        message: "Failed to update article",
      };
    }
  }

  // Delete article
  if (intent === "delete-article") {
    const sectionId = formData.get("sectionId");
    const articleId = formData.get("articleId");

    if (!sectionId || !articleId) {
      return {
        success: false,
        message: "Section ID and article ID are required",
      };
    }

    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections/${sectionId}/articles/${articleId}`, request, true, {
        method: "DELETE",
      });
      return response as SectionAndArticleActionData;
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete article",
      };
    }
  }

  // Get sections - This intent seems out of place for an action that modifies data.
  // Actions typically handle POST/PUT/DELETE. Loaders handle GET.
  // If this is truly needed, ensure fetcher's response for GET matches SectionAndArticleActionData.
  if (intent === "get-sections") {
    try {
      const response = await fetcher(`api/v1/course/courses/${courseId}/sections`, request, true, {
        method: "GET",
      });
      return response as SectionAndArticleActionData;
    } catch (error) {
      return {
        success: false,
        message: "Failed to get course sections",
      };
    }
  }

  return {
    success: false,
    message: "Invalid request",
  };
}
