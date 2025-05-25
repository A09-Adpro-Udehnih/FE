import React from 'react'
import { useLoaderData, Link, Form, useNavigation, useSearchParams } from 'react-router'
import { BookOpen, Search, Users, Coins, Loader2, SearchCheck } from "lucide-react"
import type { CourseBrowsingLoader } from './loader'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"


export const CourseBrowsingModule = () => {
  const courses = useLoaderData<typeof CourseBrowsingLoader>();
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
      "from-purple-500 to-indigo-500", // Purple to Indigo
      "from-blue-500 to-purple-500",   // Blue to Purple
      "from-indigo-500 to-blue-500",   // Indigo to Blue
      "from-violet-500 to-indigo-500", // Violet to Indigo
    ];
    
    return gradientStyles[charCode % gradientStyles.length];
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header with gradient background */}
      <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 mb-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Browse Courses</h1>
        <p className="text-purple-100 mb-6">Discover and learn from our expert-led courses</p>
        
        {/* Search Form that will trigger loader on Enter key */}
        <Form ref={formRef} method="get" className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={18} />
            )}
            <Input 
              name="keyword"
              placeholder="Search courses..." 
              className="pl-10 pr-10 bg-white text-gray-800 border-0"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Search Type Selector */}
          <div className="w-full sm:w-[180px]">
            <Select name="type" value={searchType} onValueChange={handleSearchTypeChange}>
              <SelectTrigger className="bg-white text-gray-800 border-0">
                <SearchCheck size={16} className="mr-2 text-purple-600" />
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
            className="transition-all hover:shadow-xl group overflow-hidden bg-white relative"
          >
            {/* Decorative gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-2 w-full bg-gradient-to-r ${getGradientClass(course.id)}`}></div>
            
            <CardHeader className="pb-2 relative">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50"></div>
              
              <div className="flex justify-between items-start relative">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2 text-lg group-hover:text-purple-700 transition-colors">
                    {course.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm mt-1">
                    <Users size={14} />
                    <span>By {course.tutor || "Instructor"}</span>
                  </CardDescription>
                </div>
                <div>
                  {course.price === 0 ? (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700">
                      Free
                    </Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 hover:from-purple-600 hover:to-indigo-700">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center pt-3 border-t">
              <div className="flex items-center space-x-1">
                <Coins size={16} className={course.price === 0 
                  ? "text-green-600" 
                  : "text-purple-600"
                } />
                <span className="font-medium">
                  {course.price === 0 
                  ? 'Free' 
                  : `Rp${course.price.toLocaleString('id-ID')}`}
                </span>
              </div>
              <Button 
                size="sm"
                className={`${course.price === 0 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                  : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                } text-white border-0`}
                asChild
              >
                <Link to={`/courseDetail/${course.id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Show message when no courses found */}
      {courses.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-gradient-to-b from-slate-50 to-white rounded-lg mt-8 shadow-inner">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No courses found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
        </div>
      )}
      
      {/* Loading indicator for empty state */}
      {isLoading && courses.length === 0 && (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 text-purple-600 animate-spin mb-4" />
          <p className="text-gray-600">Searching courses...</p>
        </div>
      )}
    </main>
  );
}