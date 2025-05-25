import React from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { BookOpen, User, CheckCircle, ArrowLeft, Clock, Coins } from "lucide-react"
import type { CourseDetailLoader } from './loader'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"

export const CourseDetailModule = () => {
  const course = useLoaderData<typeof CourseDetailLoader>();
  const navigate = useNavigate();

  // Go back to courses page
  const handleBack = () => {
    navigate(-1);
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
                  <span>{course.sections.length} sections</span>
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
                      <AccordionContent className="px-4 py-2 text-muted-foreground">
                        <div className="flex items-center gap-2 py-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>Section content will be available after enrollment</span>
                        </div>
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
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle>Enroll in this course</CardTitle>
              <CardDescription>Access this course and start learning today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="mb-4 flex items-center gap-2">
                  <Coins className={course.price === 0 
                    ? "text-green-600 h-5 w-5" 
                    : "text-purple-600 h-5 w-5"
                  } />
                  <span className="text-2xl font-bold">
                    {course.price === 0 
                      ? 'Free' 
                      : `Rp${course.price.toLocaleString('id-ID')}`
                    }
                  </span>
                </div>
                
                <Badge className={course.price === 0 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                  : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                }>
                  {course.price === 0 ? 'Free Course' : 'Premium Course'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span className="text-sm">Full access to course materials</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span className="text-sm">Certificate upon completion</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span className="text-sm">Lifetime access</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700">
                Enroll Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}