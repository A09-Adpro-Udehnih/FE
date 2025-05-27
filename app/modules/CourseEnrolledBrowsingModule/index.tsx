import React from 'react'
import { useLoaderData, Link, Form, useNavigation, useSearchParams } from 'react-router'
import { BookOpen, Search, Users, Loader2, SearchCheck, GraduationCap, PlayCircle } from "lucide-react"
import type { CourseEnrolledBrowsingLoader } from './loader'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"

export const CourseEnrolledBrowsingModule = () => {
  const courses = useLoaderData<typeof CourseEnrolledBrowsingLoader>();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  
  // Get search params from URL or use defaults
  const keywordParam = searchParams.get('keyword') || '';
  const typeParam = searchParams.get('type') || 'name';
  
  // Local state for form values
  const [searchTerm, setSearchTerm] = React.useState(keywordParam);
  const [searchType, setSearchType] = React.useState(typeParam);
  
  // Form reference
  const formRef = React.useRef<HTMLFormElement>(null);
  
  // Is currently loading?
  const isLoading = navigation.state !== 'idle';
  
  // Handle search type change (updates state but doesn't submit)
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Generate a gradient color based on course id for visual variety
  const getGradientClass = (courseId: string) => {
    // Extract last character of ID to determine gradient style
    const lastChar = courseId.charAt(courseId.length - 1);
    const charCode = lastChar.charCodeAt(0);
    
    // Different gradient styles based on character code
    const gradientStyles = [
      "from-blue-500 to-indigo-500",     // Blue to Indigo
      "from-indigo-500 to-violet-500",   // Indigo to Violet
      "from-emerald-500 to-cyan-500",    // Emerald to Cyan
      "from-cyan-500 to-blue-500",       // Cyan to Blue
    ];
    
    return gradientStyles[charCode % gradientStyles.length];
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header with gradient background */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="h-7 w-7" />
          <h1 className="text-2xl md:text-3xl font-bold">My Learning</h1>
        </div>
        <p className="text-indigo-100 mb-6">Continue learning with your enrolled courses</p>
        
        {/* Search Form that will trigger loader on Enter key */}
        <Form ref={formRef} method="get" className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={18} />
            )}
            <Input 
              name="keyword"
              placeholder="Search your enrolled courses..." 
              className="pl-10 pr-10 bg-white text-gray-800 border-0"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Search Type Selector */}
          <div className="w-full sm:w-[180px]">
            <Select name="type" value={searchType} onValueChange={handleSearchTypeChange}>
              <SelectTrigger className="bg-white text-gray-800 border-0">
                <SearchCheck size={16} className="mr-2 text-indigo-600" />
                <SelectValue placeholder="Search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Course Name</SelectItem>
                <SelectItem value="keyword">Course Keyword</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Hidden submit button - form submits on Enter key */}
          <button type="submit" hidden />
        </Form>
      </div>

      {/* Courses Section - show with reduced opacity when loading */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isLoading ? 'opacity-70' : ''} transition-opacity`}>
        {courses.map(course => (
          <Card 
            key={course.id} 
            className="transition-all hover:shadow-xl group overflow-hidden bg-white relative flex flex-col"
          >
            {/* Decorative gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-2 w-full bg-gradient-to-r ${getGradientClass(course.id)}`}></div>
            
            <CardHeader className="pb-2 relative">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50"></div>
              
              <div className="flex justify-between items-start relative">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2 text-lg group-hover:text-indigo-700 transition-colors">
                    {course.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm mt-1">
                    <Users size={14} />
                    <span>By {course.tutor || "Instructor"}</span>
                  </CardDescription>
                </div>
                <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                  Enrolled
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2 flex-grow">
              <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center pt-3 border-t mt-auto">
              <div className="text-xs text-muted-foreground">
                Enrolled on {course.enrollmentDate ? new Date(course.enrollmentDate).toLocaleDateString() : 'N/A'}
              </div>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white border-0"
                asChild
              >
                <Link to={`/courseEnrolledDetail/${course.id}`} className="flex items-center gap-1.5">
                  <PlayCircle size={14} />
                  Continue
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Show message when no courses found */}
      {courses.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white rounded-lg mt-8 shadow-inner">
          <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h3 className="text-2xl font-medium text-gray-600">No enrolled courses yet</h3>
          <p className="text-gray-500 mt-2 mb-8 max-w-md mx-auto">
            Begin your learning journey by enrolling in courses that interest you.
          </p>
          <Button 
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-6"
            asChild
          >
            <Link to="/courseBrowsing">Browse Courses</Link>
          </Button>
        </div>
      )}
      
      {/* Loading indicator for empty state */}
      {isLoading && courses.length === 0 && (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading your enrolled courses...</p>
        </div>
      )}
    </main>
  );
}