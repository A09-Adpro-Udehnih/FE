import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useFetcher } from 'react-router';
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
  Plus,
  Trash2, 
  ArrowLeft, 
  FileText,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Types for course structure
interface Section {
  id: string;
  title: string;
  articles: Article[];
}

interface Article {
  id: string;
  title: string;
  content: string;
}

export const CourseCreationModule = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: crypto.randomUUID(),
      title: 'Introduction',
      articles: [
        {
          id: crypto.randomUUID(),
          title: 'Getting Started',
          content: 'Welcome to this course! In this section, we will...'
        }
      ]
    }
  ]);

  const handleCourseDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: `New Section ${prev.length + 1}`,
        articles: []
      }
    ]);
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId ? { ...section, title } : section
      )
    );
  };

  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const addArticle = (sectionId: string) => {
    setSections(prev =>
      prev.map(section => {
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
    );
  };

  const updateArticle = (sectionId: string, articleId: string, field: 'title' | 'content', value: string) => {
    setSections(prev => 
      prev.map(section => {
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
    );
  };

  const deleteArticle = (sectionId: string, articleId: string) => {
    setSections(prev => 
      prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            articles: section.articles.filter(article => article.id !== articleId)
          };
        }
        return section;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseData.name || !courseData.description || !courseData.price) {
      toast.error("Please fill in all course details");
      return;
    }
    
    if (sections.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    
    // Check if any section has no articles
    const emptySections = sections.filter(section => section.articles.length === 0);
    if (emptySections.length > 0) {
      toast.error(`Section "${emptySections[0].title}" has no articles`);
      return;
    }

    fetcher.submit(
      {
        intent: 'create-course-with-content',
        name: courseData.name,
        description: courseData.description,
        price: courseData.price,
        sections: JSON.stringify(sections)
      },
      { method: 'post' }
    );
    
    toast.success("Creating course...", {
      description: "Your course will be available soon."
    });
  };

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
      
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
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
                value={courseData.name}
                onChange={handleCourseDataChange}
                placeholder="e.g. Introduction to React"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleCourseDataChange}
                placeholder="Brief description of your course"
                rows={4}
                required
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
                value={courseData.price}
                onChange={handleCourseDataChange}
                placeholder="e.g. 19.99"
                required
              />
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
        
        <div className="mb-6">
          <Accordion type="multiple" className="w-full">
            {sections.map((section, sectionIndex) => (
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
                      deleteSection(section.id);
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
                              onClick={() => deleteArticle(section.id, article.id)}
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
        
        <div className="flex justify-end mt-8">
          <Button
            type="button"
            variant="outline"
            className="mr-4"
            onClick={() => navigate('/tutors')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Course...
              </>
            ) : (
              'Create Course'
            )}
          </Button>
        </div>
      </form>
    </main>
  );
};
