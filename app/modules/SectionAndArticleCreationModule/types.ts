
// Define basic types for Section and Article
export interface Article {
  id: string;
  title: string;
  content: string;
  position: number;
  // add other article properties as needed
}

export interface Section {
  id: string;
  title: string;
  position: number;
  articles: Article[];
  // add other section properties as needed
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  // add other course properties as needed
}

// Loader data type
export interface SectionAndArticleLoaderData {
  course: Course;
  sections: Section[];
  courseId: string;
}

// Action data type
export interface SectionAndArticleActionData {
  success?: boolean;
  error?: string;
  message?: string;
  section?: Section;
  article?: Article;
}
