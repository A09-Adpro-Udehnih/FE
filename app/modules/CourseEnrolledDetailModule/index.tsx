import React from 'react'
import { useLoaderData, useNavigate, Link, useSubmit, useActionData } from 'react-router'
import { BookOpen, User, ArrowLeft, Calendar, FileText, RefreshCcw, X } from "lucide-react"
import { toast, Toaster } from "sonner"
import type { CourseEnrolledDetailLoader } from './loader'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"

export const CourseEnrolledDetailModule = () => {
  const course = useLoaderData<typeof CourseEnrolledDetailLoader>();
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData();
  const [isRefundDialogOpen, setIsRefundDialogOpen] = React.useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState<{id: string; title: string; content: string} | null>(null);

  // Handle action data updates
  React.useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success(actionData.message, {
          description: "Your refund request has been processed."
        });
        
        // Redirect if provided
        if (actionData.redirectTo) {
          setTimeout(() => {
            navigate(actionData.redirectTo);
          }, 1000); // Short delay to show the toast
        }
      } else if (actionData.message) {
        toast.error("Refund Failed", {
          description: actionData.message
        });
      }
      
      // Reset refund processing state
      setIsProcessingRefund(false);
      // Close dialog
      setIsRefundDialogOpen(false);
    }
  }, [actionData, navigate]);

  // Format enrollment date
  const formattedDate = new Date(course.enrollmentDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Go back to enrolled courses page
  const handleBack = () => {
    navigate(-1);
  };

  // Handle article selection
  const handleArticleClick = (article: {id: string; title: string; content: string}) => {
    setSelectedArticle(article);
  };

  const totalArticles = React.useMemo(() => {
    return course.sections.reduce((total, section) => total + section.articles.length, 0);
  }, [course.sections]);

  // Handle refund request
  const handleRefund = () => {
    setIsProcessingRefund(true);
    
    // Create form data with action
    const formData = new FormData();
    formData.append('action', 'refund');
    
    // Submit the form to trigger the action
    submit(formData, { method: 'post' });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={handleBack} 
        className="mb-6 flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to my courses
      </Button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2">
          <div className="rounded-xl bg-white shadow-md">
            {/* Course header */}
            <div className="relative overflow-hidden rounded-t-xl">
              {/* Gradient header background */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-8 text-white">
                <Badge className="bg-white/20 text-white mb-3 hover:bg-white/30">
                  Enrolled Course
                </Badge>
                <h1 className="text-2xl font-bold md:text-3xl">{course.name}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Instructor: {course.tutor}</span>
                </div>
              </div>
            </div>

            {/* Course description */}
            <div className="p-6">
              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">About This Course</h2>
                <p className="text-gray-600">{course.description}</p>
              </div>

              <Separator className="my-6" />

              {/* Course sections */}
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Course Content
                </h2>
                <div className="text-sm text-muted-foreground">
                  <span>{course.sections.length} sections • {totalArticles} articles</span>
                </div>

                <Accordion type="single" collapsible className="mt-4">
                  {course.sections.map((section, index) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="hover:bg-blue-50 rounded-md px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                            {index + 1}
                          </div>
                          <span>{section.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-2 border-l-2 border-blue-100 ml-5">
                        {section.articles.map((article) => (
                          <div key={article.id} className="py-2 border-b last:border-0 border-gray-100">
                            <div 
                              onClick={() => handleArticleClick(article)}
                              className="flex items-center justify-between p-2 rounded-md group transition-colors hover:bg-blue-50 cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-xs font-medium text-blue-600 group-hover:bg-blue-100">
                                  <FileText className="h-3 w-3" />
                                </div>
                                <span className="text-sm font-medium group-hover:text-blue-700">{article.title}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 px-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArticleClick(article);
                                }}
                              >
                                <span className="text-xs">Read</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-6 border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Your enrolled course details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Enrolled on</div>
                    <div className="text-sm text-muted-foreground">{formattedDate}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Course Material</div>
                    <div className="text-sm text-muted-foreground">
                      {course.sections.length} sections • {totalArticles} articles
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Separator className="mb-4" />
              <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Request Refund
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Refund</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to request a refund for this course?
                      This action will revoke your access to course materials.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="font-medium">Course details:</div>
                    <div className="mt-1 text-sm text-gray-600">{course.name}</div>
                    <div className="mt-2 text-sm text-gray-500">Enrolled on: {formattedDate}</div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsRefundDialogOpen(false)}
                      disabled={isProcessingRefund}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleRefund}
                      disabled={isProcessingRefund}
                    >
                      {isProcessingRefund ? (
                        <>
                          <span className="animate-spin mr-2">◌</span>
                          Processing...
                        </>
                      ) : (
                        'Confirm Refund'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Article Popup Dialog */}
      <Dialog open={selectedArticle !== null} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{selectedArticle?.content}</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setSelectedArticle(null)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};