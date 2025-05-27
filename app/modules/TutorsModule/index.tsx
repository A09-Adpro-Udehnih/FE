import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useNavigate, Link } from "react-router";
import type { TutorApplication } from "./loader";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit,
  FileEdit,
  Loader2,
  Plus,
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

// Define types for course data with sections and articles
interface Article {
  id: string;
  title: string;
  content: string;
  position: number;
  sectionId: string;
  createdAt: string;
}

interface Section {
  id: string;
  title: string;
  position: number;
  courseId: string;
  articles: Article[];
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  tutorId: string;
  sections?: Section[];
  createdAt: string;
}

export const TutorsModule = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { user, tutorApplication, userCourses, error } = useLoaderData<{
    user: any;
    tutorApplication: TutorApplication | null;
    userCourses: Course[] | null;
    error: string | null;
  }>();

  // Redirect based on tutor application status
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!tutorApplication) {
      navigate('/tutorRegistration');
      return;
    }    if (tutorApplication.status !== 'ACCEPTED') {
      navigate('/tutorRegistration');
      return;
    }
  }, [user, tutorApplication, navigate]);

  // If not an accepted tutor, don't render the tutors module content
  if (!user || !tutorApplication || tutorApplication.status !== 'ACCEPTED') {
    return <div className="container py-10 text-center">Redirecting...</div>;
  }

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);
  const [isManageContentDialogOpen, setIsManageContentDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentCourseWithContent, setCurrentCourseWithContent] = useState<Course | null>(null);
  const [courseStudents, setCourseStudents] = useState<string[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isCreateSectionDialogOpen, setIsCreateSectionDialogOpen] = useState(false);
  const [isEditSectionDialogOpen, setIsEditSectionDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [isCreateArticleDialogOpen, setIsCreateArticleDialogOpen] = useState(false);
  const [isEditArticleDialogOpen, setIsEditArticleDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const handleSubmitApplication = () => {
    fetcher.submit(
      { intent: "apply" },
      { method: "POST", action: "/tutors" }
    );
    toast.success("Tutor application submitted successfully");
  };

  const handleCancelApplication = () => {
    fetcher.submit(
      { intent: "cancel" },
      { method: "DELETE", action: "/tutors" }
    );
    toast.success("Tutor application canceled successfully");
  };

  const handleCreateCourse = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("intent", "create-course");
    
    fetcher.submit(formData, {
      method: "POST",
      action: "/tutors",
    });
    
    setIsCreateDialogOpen(false);
    toast.success("Course created successfully");
  };

  const handleEditCourse = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("intent", "update-course");
    formData.append("courseId", currentCourse?.id || "");
    
    fetcher.submit(formData, {
      method: "POST",
      action: "/tutors",
    });
    
    setIsEditDialogOpen(false);
    toast.success("Course updated successfully");
  };

  const handleDeleteCourse = (courseId: string) => {
    const formData = new FormData();
    formData.append("intent", "delete-course");
    formData.append("courseId", courseId);
    
    fetcher.submit(formData, {
      method: "POST",
      action: "/tutors",
    });
    
    toast.success("Course deleted successfully");
  };  const handleViewStudents = async (course: Course) => {
    setCurrentCourse(course);
    setIsStudentsDialogOpen(true);
    setIsLoadingStudents(true);
    
    try {
      console.log('Fetching students for course:', course.id);
      const response = await fetch(`https://api.udehnih.site/api/v1/course/courses/${course.id}/students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });
      
      console.log('Students API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Students API response data:', data);
        
        // Handle both possible response structures
        const students = data.students || data.data?.students || data || [];
        setCourseStudents(students);
        
        if (students.length === 0) {
          toast.info("No students enrolled in this course yet");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Students API error:', errorData);
        toast.error(errorData.message || "Failed to load students");
        setCourseStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
      setCourseStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };  const handleManageContent = async (course: Course) => {
    setCurrentCourseWithContent(course);
    setIsManageContentDialogOpen(true);
    
    try {
      console.log('Loading course content for course:', {
        courseId: course.id,
        courseName: course.name,
        endpoint: `https://api.udehnih.site/api/v1/course/courses/${course.id}/sections`
      });
      
      const response = await fetch(`https://api.udehnih.site/api/v1/course/courses/${course.id}/sections`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      console.log('Sections API response status:', response.status);
      console.log('Sections API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('Sections API response data:', data);
        
        // Handle different possible response structures
        const sections = data.sections || data.data?.sections || data || [];
        setSections(sections);
        
        // Set initial expanded state for sections that have articles
        const expandedSet = new Set<string>();
        sections.forEach((section: Section) => {
          if (section.articles && section.articles.length > 0) {
            expandedSet.add(section.id);
          }
        });
        setExpandedSections(expandedSet);
        
        if (sections.length === 0) {
          toast.info("This course has no sections yet. Create your first section to add content.");
        }
      } else {
        // Get the response text first to see what we're dealing with
        const responseText = await response.text();
        console.error('Sections API failed - Status:', response.status);
        console.error('Sections API failed - Response text:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          console.error('Sections API error (parsed):', errorData);
          toast.error(errorData.message || `Failed to load course content (${response.status})`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          toast.error(`Failed to load course content (${response.status}): ${responseText || 'Unknown error'}`);
        }
        setSections([]);
      }
    } catch (error) {
      console.error("Network error fetching course content:", error);
      toast.error("Network error: Failed to load course content");
      setSections([]);
    }
  };
  // Utility function to refresh course content
  const refreshCourseContent = async () => {
    if (!currentCourseWithContent) return;
    
    try {
      console.log('Refreshing course content for course:', currentCourseWithContent.id);
      const response = await fetch(`https://api.udehnih.site/api/v1/course/courses/${currentCourseWithContent.id}/sections`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Refreshed sections data:', data);
        
        const sections = data.sections || data.data?.sections || data || [];
        setSections(sections);
        
        // Maintain expanded state for sections with articles
        const expandedSet = new Set(expandedSections);
        sections.forEach((section: Section) => {
          if (section.articles && section.articles.length > 0) {
            expandedSet.add(section.id);
          }
        });
        setExpandedSections(expandedSet);
      } else {
        console.error('Failed to refresh course content');
      }
    } catch (error) {
      console.error("Error refreshing course content:", error);
    }
  };
  const handleCreateSection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const position = formData.get("position") as string;
    
    try {
      console.log('Creating section:', { 
        title, 
        position, 
        courseId: currentCourseWithContent?.id,
        endpoint: `https://api.udehnih.site/api/v1/course/courses/${currentCourseWithContent?.id}/sections`
      });
      
      const response = await fetch(`https://api.udehnih.site/api/v1/course/courses/${currentCourseWithContent?.id}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          position: position ? parseInt(position) : null,
        }),
      });
      
      console.log('Section creation response status:', response.status);
      console.log('Section creation response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const result = await response.json();
        console.log('Section created successfully:', result);
        toast.success("Section created successfully");
        setIsCreateSectionDialogOpen(false);
        await refreshCourseContent(); // Use the new refresh function
      } else {
        // Get the response text first to see what we're dealing with
        const responseText = await response.text();
        console.error('Section creation failed - Status:', response.status);
        console.error('Section creation failed - Response text:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          console.error('Section creation error (parsed):', errorData);
          toast.error(errorData.message || `Failed to create section (${response.status})`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          toast.error(`Failed to create section (${response.status}): ${responseText || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error("Network error creating section:", error);
      toast.error("Network error: Failed to create section");
    }
  };
  const handleUpdateSection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const position = formData.get("position") as string;
    
    try {
      console.log('Updating section:', { id: currentSection?.id, title, position });
      const response = await fetch(`${process.env.API_URL}api/v1/course/courses/${currentCourseWithContent?.id}/sections/${currentSection?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          position: position ? parseInt(position) : null,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Section updated successfully:', result);
        toast.success("Section updated successfully");
        setIsEditSectionDialogOpen(false);
        await refreshCourseContent(); // Use the new refresh function
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Section update error:', errorData);
        toast.error(errorData.message || "Failed to update section");
      }
    } catch (error) {
      console.error("Error updating section:", error);
      toast.error("Failed to update section");
    }
  };
  const handleDeleteSection = async (sectionId: string) => {
    try {
      console.log('Deleting section:', sectionId);
      const response = await fetch(`https://api.udehnih.site/api/v1/course/courses/${currentCourseWithContent?.id}/sections/${sectionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (response.ok) {
        console.log('Section deleted successfully');
        toast.success("Section deleted successfully");
        await refreshCourseContent();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Section deletion error:', errorData);
        toast.error(errorData.message || "Failed to delete section");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Failed to delete section");
    }
  };

  const handleCreateArticle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const position = formData.get("position") as string;
    
    try {
      console.log('Creating article:', { title, content, position, sectionId: currentSection?.id });
      const response = await fetch(`https://api.udehnih.site/api/v1/course/courses/${currentCourseWithContent?.id}/sections/${currentSection?.id}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
          position: position ? parseInt(position) : null,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Article created successfully:', result);
        toast.success("Article created successfully");
        setIsCreateArticleDialogOpen(false);
        await refreshCourseContent(); // Use the new refresh function
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Article creation error:', errorData);
        toast.error(errorData.message || "Failed to create article");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Failed to create article");
    }
  };
  const handleUpdateArticle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const position = formData.get("position") as string;
    
    try {
      console.log('Updating article:', { id: currentArticle?.id, title, content, position });
      const response = await fetch(`https://api.udehnih.site/api/v1/course/courses/${currentCourseWithContent?.id}/sections/${currentSection?.id}/articles/${currentArticle?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
          position: position ? parseInt(position) : null,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Article updated successfully:', result);
        toast.success("Article updated successfully");
        setIsEditArticleDialogOpen(false);
        await refreshCourseContent(); // Use the new refresh function
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Article update error:', errorData);
        toast.error(errorData.message || "Failed to update article");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Failed to update article");
    }
  };

  const handleDeleteArticle = async (sectionId: string, articleId: string) => {
    try {
      console.log('Deleting article:', { sectionId, articleId });
      const response = await fetch(`https://api.udehnih.site/api/v1/course/courses/${currentCourseWithContent?.id}/sections/${sectionId}/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (response.ok) {
        console.log('Article deleted successfully');
        toast.success("Article deleted successfully");
        await refreshCourseContent(); // Use the new refresh function
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Article deletion error:', errorData);
        toast.error(errorData.message || "Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Debug logging
  console.log('User data:', user);
  console.log('Tutor application:', tutorApplication);
  console.log('User role:', user?.role);
  console.log('Should show apply button:', user?.role === "student" && !tutorApplication);

  // If user is not logged in
  if (!user) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication required</AlertTitle>
          <AlertDescription>
            Please login to access the tutors section.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If there was an error loading data
  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main content - always show tutor application button for students without accepted application
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            {tutorApplication?.status === "ACCEPTED" || user.role === "teacher" || user.role === "TEACHER"
              ? "Manage your courses and view enrolled students"
              : "Apply to become a tutor and create your own courses"}
          </p>
        </div>

        {/* Application Section */}
        {(user.role === "student" || user.role === "STUDENT") && !tutorApplication && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Apply for Tutor Program</CardTitle>
              <CardDescription className="text-base">
                As a tutor, you'll be able to create and manage your own courses on our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Create Courses</h3>
                  <p className="text-sm text-muted-foreground">Design and publish your own courses with your expertise</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Teach Students</h3>
                  <p className="text-sm text-muted-foreground">Share your knowledge and help students learn new skills</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileEdit className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Manage Content</h3>
                  <p className="text-sm text-muted-foreground">Full control over your course content, pricing, and students</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-2 pb-6">
              <Button size="lg" className="px-8 py-6 text-lg" onClick={handleSubmitApplication}>
                <GraduationCap className="mr-2 h-5 w-5" /> Apply to Become a Tutor
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Application Status Section for Pending/Denied Applications */}
        {(user.role === "student" || user.role === "STUDENT") && tutorApplication && tutorApplication.status !== "ACCEPTED" && (
          <Card>
            <CardHeader>
              <CardTitle>Tutor Application Status</CardTitle>
              <CardDescription>
                Check the status of your tutor application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tutorApplication?.status === "PENDING" && (
                <div className="flex flex-col space-y-4">
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Application Pending</AlertTitle>
                    <AlertDescription>
                      Your application is currently under review. You'll be notified once it's approved.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelApplication}
                  >
                    Cancel Application
                  </Button>
                </div>
              )}

              {tutorApplication?.status === "DENIED" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Application Denied</AlertTitle>
                  <AlertDescription>
                    Your application has been denied. Please contact support for more information.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Status Banner for Accepted Tutors */}
        {(user.role === "student" || user.role === "STUDENT") && tutorApplication?.status === "ACCEPTED" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Your Application was Approved!</AlertTitle>
            <AlertDescription className="text-green-600">
              You can now create and manage your own courses below.
            </AlertDescription>
          </Alert>
        )}

        {/* Courses Management Section */}
        {(tutorApplication?.status === "ACCEPTED" || user.role === "teacher" || user.role === "TEACHER") && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>
                  Manage your courses and view enrolled students
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Create Course
              </Button>
            </CardHeader>
            <CardContent>
              {!userCourses || userCourses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    You haven't created any courses yet.
                  </p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Course
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue="grid">
                  <TabsList className="mb-4">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="grid">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userCourses.map((course) => (
                        <Card key={course.id}>
                          <CardHeader>
                            <CardTitle>{course.name}</CardTitle>
                            <CardDescription>
                              ${course.price.toFixed(2)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-3">{course.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewStudents(course)}
                            >
                              <Users className="mr-2 h-4 w-4" /> Students
                            </Button>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCurrentCourse(course);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleManageContent(course)}
                              >
                                <BookOpen className="mr-2 h-4 w-4" /> Content
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell>${course.price.toFixed(2)}</TableCell>
                            <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewStudents(course)}
                                >
                                  <Users className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentCourse(course);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleManageContent(course)}
                                >
                                  <BookOpen className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        )}

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>User role:</strong> {user?.role}</p>
                <p><strong>Tutor application:</strong> {tutorApplication ? JSON.stringify(tutorApplication) : 'null'}</p>
                <p><strong>Show apply button:</strong> {String((user?.role === "student" || user?.role === "STUDENT") && !tutorApplication)}</p>
                <p><strong>Show courses:</strong> {String(tutorApplication?.status === "ACCEPTED" || user.role === "teacher" || user.role === "TEACHER")}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Course Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Enter the details for your new course
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCourse}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={4} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  required 
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Course</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the details of your course
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCourse}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Course Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  defaultValue={currentCourse?.name} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  rows={4} 
                  defaultValue={currentCourse?.description} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input 
                  id="edit-price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  defaultValue={currentCourse?.price} 
                  required 
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Course</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Students Dialog */}
      <Dialog open={isStudentsDialogOpen} onOpenChange={setIsStudentsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enrolled Students</DialogTitle>
            <DialogDescription>
              Students enrolled in {currentCourse?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingStudents ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : courseStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No students enrolled in this course yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseStudents.map((student) => (
                    <TableRow key={student}>
                      <TableCell>{student}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Course Content Dialog */}
      <Dialog open={isManageContentDialogOpen} onOpenChange={setIsManageContentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Course Content</DialogTitle>
            <DialogDescription>
              Add and organize sections and articles for {currentCourseWithContent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sections</h3>
              <Button onClick={() => setIsCreateSectionDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </div>
            
            {sections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No sections created yet.</p>
                <Button 
                  onClick={() => setIsCreateSectionDialogOpen(true)}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create First Section
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {sections.sort((a, b) => a.position - b.position).map((section) => (
                  <Card key={section.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Collapsible
                          open={expandedSections.has(section.id)}
                          onOpenChange={() => toggleSectionExpanded(section.id)}
                          className="flex-1"
                        >
                          <CollapsibleTrigger className="flex items-center space-x-2">
                            {expandedSections.has(section.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="font-medium">{section.title}</span>
                            <span className="text-sm text-muted-foreground">
                              ({section.articles?.length || 0} articles)
                            </span>
                          </CollapsibleTrigger>
                        </Collapsible>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentSection(section);
                              setIsCreateArticleDialogOpen(true);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentSection(section);
                              setIsEditSectionDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <Collapsible
                      open={expandedSections.has(section.id)}
                      onOpenChange={() => toggleSectionExpanded(section.id)}
                    >
                      <CollapsibleContent>
                        <CardContent>
                          {section.articles && section.articles.length > 0 ? (
                            <div className="space-y-2">
                              {section.articles.sort((a, b) => a.position - b.position).map((article) => (
                                <div key={article.id} className="flex items-center justify-between p-2 border rounded">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{article.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {article.content}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setCurrentSection(section);
                                        setCurrentArticle(article);
                                        setIsEditArticleDialogOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteArticle(section.id, article.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-muted-foreground text-sm">No articles in this section yet.</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  setCurrentSection(section);
                                  setIsCreateArticleDialogOpen(true);
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" /> Add Article
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Section Dialog */}
      <Dialog open={isCreateSectionDialogOpen} onOpenChange={setIsCreateSectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
            <DialogDescription>
              Add a new section to organize your course content
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSection}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="section-title">Section Title</Label>
                <Input id="section-title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-position">Position (optional)</Label>
                <Input 
                  id="section-position" 
                  name="position" 
                  type="number" 
                  min="0" 
                  placeholder="Leave empty for auto-positioning"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateSectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Section</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={isEditSectionDialogOpen} onOpenChange={setIsEditSectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update the section details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSection}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-section-title">Section Title</Label>
                <Input 
                  id="edit-section-title" 
                  name="title" 
                  defaultValue={currentSection?.title}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-section-position">Position</Label>
                <Input 
                  id="edit-section-position" 
                  name="position" 
                  type="number" 
                  min="0" 
                  defaultValue={currentSection?.position}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditSectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Section</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Article Dialog */}
      <Dialog open={isCreateArticleDialogOpen} onOpenChange={setIsCreateArticleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
            <DialogDescription>
              Add content to {currentSection?.title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateArticle}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="article-title">Article Title</Label>
                <Input id="article-title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-content">Content</Label>
                <Textarea 
                  id="article-content" 
                  name="content" 
                  rows={6} 
                  required 
                  placeholder="Enter the article content..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-position">Position (optional)</Label>
                <Input 
                  id="article-position" 
                  name="position" 
                  type="number" 
                  min="0" 
                  placeholder="Leave empty for auto-positioning"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateArticleDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Article</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={isEditArticleDialogOpen} onOpenChange={setIsEditArticleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>
              Update the article content
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateArticle}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-article-title">Article Title</Label>
                <Input 
                  id="edit-article-title" 
                  name="title" 
                  defaultValue={currentArticle?.title}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-article-content">Content</Label>
                <Textarea 
                  id="edit-article-content" 
                  name="content" 
                  rows={6} 
                  defaultValue={currentArticle?.content}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-article-position">Position</Label>
                <Input 
                  id="edit-article-position" 
                  name="position" 
                  type="number" 
                  min="0" 
                  defaultValue={currentArticle?.position}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditArticleDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Article</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};