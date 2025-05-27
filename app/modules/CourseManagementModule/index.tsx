import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate, useParams, useFetcher } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '~/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '~/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { 
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Save,
  Trash2,
  Users,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

// Types for course structure
interface Article {
  id: string;
  title: string;
  content: string;
}

interface Section {
  id: string;
  title: string;
  articles: Article[];
}

interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  tutorId: string;
  sections: Section[];
}

interface Student {
  id: string;
  email: string;
  enrollmentDate: string;
}

export const CourseManagementModule = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  // This would normally come from a loader
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<{sectionId: string, articleId: string} | null>(null);

  // Simulate loading course data
  useEffect(() => {
    // In a real application, this would be fetched from an API
    setTimeout(() => {
      setCourse({
        id: courseId || 'mock-id',
        name: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
        price: 49.99,
        tutorId: 'tutor-123',
        sections: [
          {
            id: 'section-1',
            title: 'Getting Started with HTML',
            articles: [
              {
                id: 'article-1',
                title: 'HTML Basics',
                content: 'HTML (HyperText Markup Language) is the standard language for creating web pages and web applications.'
              },
              {
                id: 'article-2',
                title: 'HTML Elements',
                content: 'HTML elements are represented by tags. Tags come in pairs like <h1> and </h1>.'
              }
            ]
          },
          {
            id: 'section-2',
            title: 'CSS Fundamentals',
            articles: [
              {
                id: 'article-3',
                title: 'CSS Syntax',
                content: 'CSS (Cascading Style Sheets) is used to style and layout web pages.'
              }
            ]
          }
        ]
      });
      
      // Mock enrolled students
      setEnrolledStudents([
        {
          id: 'student-1',
          email: 'student1@example.com',
          enrollmentDate: '2023-05-15'
        },
        {
          id: 'student-2',
          email: 'student2@example.com',
          enrollmentDate: '2023-05-20'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, [courseId]);

  const handleCourseDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!course) return;
    
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    if (!course) return;
    
    setCourse({
      ...course,
      sections: course.sections.map(section => 
        section.id === sectionId ? { ...section, title } : section
      )
    });
  };

  const addSection = () => {
    if (!course) return;
    
    setCourse({
      ...course,
      sections: [
        ...course.sections,
        {
          id: crypto.randomUUID(),
          title: `New Section ${course.sections.length + 1}`,
          articles: []
        }
      ]
    });
  };

  const confirmDeleteSection = (sectionId: string) => {
    setSectionToDelete(sectionId);
    setIsDeleteDialogOpen(true);
  };

  const deleteSection = () => {
    if (!course || !sectionToDelete) return;
    
    setCourse({
      ...course,
      sections: course.sections.filter(section => section.id !== sectionToDelete)
    });
    
    setSectionToDelete(null);
    setIsDeleteDialogOpen(false);
    toast.success("Section deleted successfully");
  };

  const addArticle = (sectionId: string) => {
    if (!course) return;
    
    setCourse({
      ...course,
      sections: course.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            articles: [
              ...section.articles,
              {
                id: crypto.randomUUID(),
                title: `New Article ${section.articles.length + 1}`,
                content: ''
              }
            ]
          };
        }
        return section;
      })
    });
  };

  const confirmDeleteArticle = (sectionId: string, articleId: string) => {
    setArticleToDelete({sectionId, articleId});
    setIsDeleteDialogOpen(true);
  };

  const deleteArticle = () => {
    if (!course || !articleToDelete) return;
    
    setCourse({
      ...course,
      sections: course.sections.map(section => {
        if (section.id === articleToDelete.sectionId) {
          return {
            ...section,
            articles: section.articles.filter(article => article.id !== articleToDelete.articleId)
          };
        }
        return section;
      })
    });
    
    setArticleToDelete(null);
    setIsDeleteDialogOpen(false);
    toast.success("Article deleted successfully");
  };

  const updateArticle = (sectionId: string, articleId: string, field: 'title' | 'content', value: string) => {
    if (!course) return;
    
    setCourse({
      ...course,
      sections: course.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            articles: section.articles.map(article => 
              article.id === articleId ? { ...article, [field]: value } : article
            )
          };
        }
        return section;
      })
    });
  };

  const handleSaveCourse = () => {
    if (!course) return;
    
    fetcher.submit(
      {
        intent: 'update-course',
        courseId: course.id,
        name: course.name,
        description: course.description,
        price: course.price.toString(),
        sections: JSON.stringify(course.sections)
      },
      { method: 'post' }
    );
    
    toast.success("Saving course changes...");
  };

  if (isLoading) {
    return (
      <main className="container py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading course details...</span>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Course not found or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate('/tutors')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </main>
    );
  }

  return (
    <main className="container py-10">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/tutors')} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tutor Dashboard
      </Button>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Course</h1>
        <Button onClick={handleSaveCourse} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="students">Enrolled Students</TabsTrigger>
        </TabsList>
        
        {/* Course Content Tab */}
        <TabsContent value="content">
          <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
          
          <div className="mb-6">
            <Accordion type="multiple" className="w-full">
              {course.sections.map((section, sectionIndex) => (
                <AccordionItem key={section.id} value={section.id}>
                  <div className="flex items-center">
                    <AccordionTrigger className="flex-grow">
                      {section.title} ({section.articles.length} articles)
                    </AccordionTrigger>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="mr-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteSection(section.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <AccordionContent>
                    <div className="pl-4 border-l-2 border-muted space-y-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                        <Input
                          id={`section-title-${section.id}`}
                          value={section.title}
                          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        />
                      </div>
                      
                      <h4 className="text-sm font-medium mt-4 mb-2">Articles</h4>
                      
                      {section.articles.map((article, articleIndex) => (
                        <Card key={article.id} className="mb-4">
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Article {articleIndex + 1}
                              </CardTitle>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => confirmDeleteArticle(section.id, article.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="py-3 space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor={`article-title-${article.id}`}>Title</Label>
                              <Input
                                id={`article-title-${article.id}`}
                                value={article.title}
                                onChange={(e) => updateArticle(section.id, article.id, 'title', e.target.value)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`article-content-${article.id}`}>Content</Label>
                              <Textarea
                                id={`article-content-${article.id}`}
                                value={article.content}
                                onChange={(e) => updateArticle(section.id, article.id, 'content', e.target.value)}
                                rows={4}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addArticle(section.id)}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Article
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <Button
              type="button"
              variant="outline"
              onClick={addSection}
              className="w-full mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </TabsContent>
        
        {/* Course Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Basic information about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={course.name}
                  onChange={handleCourseDetailsChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={course.description}
                  onChange={handleCourseDetailsChange}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={course.price}
                  onChange={handleCourseDetailsChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Enrolled Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>
                Students currently enrolled in this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No students enrolled yet</p>
                  <p className="text-sm text-muted-foreground">
                    When students enroll in your course, they'll appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {sectionToDelete ? 
                "Are you sure you want to delete this section and all its articles?" :
                "Are you sure you want to delete this article?"
              }
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action cannot be undone.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={sectionToDelete ? deleteSection : deleteArticle}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};
