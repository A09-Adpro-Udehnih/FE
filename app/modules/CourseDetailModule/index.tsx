import React from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { BookOpen, User, ArrowLeft, DollarSign, CheckCircle, ShoppingCart, LockIcon } from "lucide-react"
import type { CourseDetailLoader } from './loader'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"

export const CourseDetailModule = () => {
  const course = useLoaderData<typeof CourseDetailLoader>();
  const navigate = useNavigate();

  // Go back to course browse page
  const handleBack = () => {
    navigate(-1);
  };

  // Placeholder for enrollment function
  const handleEnroll = () => {
    // This is just a placeholder - will be implemented in future
    console.log('Enrollment requested for course:', course.id);
    
    // You could show a toast notification here that enrollment is not yet implemented
    alert("Enrollment functionality will be implemented soon!");
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
        Back to courses
      </Button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2">
          <div className="rounded-xl bg-white shadow-md">
            {/* Course header */}
            <div className="relative overflow-hidden rounded-t-xl">
              {/* Gradient header background */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
                <Badge className={`mb-3 ${
                  course.price === 0
                    ? "bg-green-500/20 text-white hover:bg-green-500/30"
                    : "bg-purple-500/20 text-white hover:bg-purple-500/30"
                }`}>
                  {course.price === 0 ? "Free Course" : "Premium Course"}
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
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Course Content
                </h2>
                <div className="text-sm text-muted-foreground">
                  <span>{course.sections.length} sections available</span>
                </div>

                <Accordion type="single" collapsible className="mt-4">
                  {course.sections.map((section, index) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="hover:bg-purple-50 rounded-md px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-800">
                            {index + 1}
                          </div>
                          <span>{section.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-2 border-l-2 border-purple-100 ml-5">
                        <div className="py-3 text-sm bg-purple-50/50 rounded-md p-3 text-center">
                          <div className="flex justify-center mb-2">
                            <LockIcon className="h-5 w-5 text-purple-400" />
                          </div>
                          <p className="text-purple-600 font-medium mb-1">Content available after enrollment</p>
                          <p className="text-gray-600">Enroll now to access all course materials</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Enrollment and Price */}
        <div>
          <Card className="sticky top-6 border-purple-100">
            <CardHeader className="pb-3">
              <CardTitle>Course Enrollment</CardTitle>
              <CardDescription>
                {course.price === 0 
                  ? "Enroll for free today" 
                  : "Unlock premium course content"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`text-center p-6 rounded-lg ${
                  course.price === 0
                    ? "bg-green-50 text-green-700"
                    : "bg-purple-50 text-purple-700"
                }`}>
                  <div className="font-bold text-2xl mb-1">
                    {course.price === 0 
                      ? "FREE" 
                      : `Rp${course.price.toLocaleString('id-ID')}`}
                  </div>
                  <div className="text-sm opacity-80">
                    {course.price === 0 
                      ? "No payment required" 
                      : "One-time payment"}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-purple-600" />
                    <span className="text-sm">Access to all course materials</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-purple-600" />
                    <span className="text-sm">{course.sections.length} sections covering all topics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-purple-600" />
                    <span className="text-sm">Learn from expert instructors</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-purple-600" />
                    <span className="text-sm">Lifetime access to content</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleEnroll}
                className={`w-full ${
                  course.price === 0
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                } text-white`}
              >
                <div className="flex items-center gap-2">
                  {course.price === 0 ? (
                    <>
                      <BookOpen className="h-4 w-4" />
                      Enroll Now - Free
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Buy Now
                    </>
                  )}
                </div>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
};