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
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";

// Define types for course data
interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  tutorId: string;
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
    }

    if (tutorApplication.status !== 'ACCEPTED') {
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
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [courseStudents, setCourseStudents] = useState<string[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

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
  };

  const handleViewStudents = async (course: Course) => {
    setCurrentCourse(course);
    setIsStudentsDialogOpen(true);
    setIsLoadingStudents(true);
    
    const formData = new FormData();
    formData.append("intent", "get-course-students");
    formData.append("courseId", course.id);
    
    try {
      const response = await fetch("/tutors", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        setCourseStudents(data.students || []);
      } else {
        toast.error("Failed to load students");
      }
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setIsLoadingStudents(false);
    }
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
    </div>
  );
};