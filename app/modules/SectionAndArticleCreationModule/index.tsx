import React, { useEffect, useState, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { PlusCircle, Edit, Trash2, FileText, GripVertical } from "lucide-react";
import {
  useLoaderData,
  useActionData,
  useFetcher,
  useRevalidator,
} from "react-router"; 

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"; 
import type { 
  Article, 
  Section, 
  SectionAndArticleLoaderData, 
  SectionAndArticleActionData 
} from "./types";


export function SectionAndArticleCreationModule() {
  const { course, sections: initialSections, courseId } = useLoaderData<SectionAndArticleLoaderData>();
  const actionData = useActionData<SectionAndArticleActionData>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  const [sections, setSections] = useState<Section[]>(initialSections || []);
  const [error, setError] = useState<string | null>(null); 

  const [isCreateSectionModalOpen, setCreateSectionModalOpen] = useState(false);
  const [isEditSectionModalOpen, setEditSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const [isCreateArticleModalOpen, setCreateArticleModalOpen] = useState(false);
  const [isEditArticleModalOpen, setEditArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [currentSectionIdForArticle, setCurrentSectionIdForArticle] = useState<string | null>(null);
  
  // Add state for the currently selected article to display in the main content area
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const [itemToDelete, setItemToDelete] = useState<{ type: 'section' | 'article', id: string, sectionId?: string } | null>(null);
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  const newSectionTitleRef = useRef<HTMLInputElement>(null);
  const editSectionTitleRef = useRef<HTMLInputElement>(null);
  const newArticleTitleRef = useRef<HTMLInputElement>(null);
  const newArticleContentRef = useRef<HTMLTextAreaElement>(null);
  const editArticleTitleRef = useRef<HTMLInputElement>(null);
  const editArticleContentRef = useRef<HTMLTextAreaElement>(null);
  
  // Article content editor ref
  const articleContentEditorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSections(initialSections || []);
    
    // After revalidation, try to update the selected article with the latest data
    if (selectedArticle) {
      const sectionWithArticle = initialSections?.find(section => 
        section.articles?.some(article => article.id === selectedArticle.id)
      );
      
      if (sectionWithArticle) {
        const updatedArticle = sectionWithArticle.articles.find(article => article.id === selectedArticle.id);
        if (updatedArticle && JSON.stringify(updatedArticle) !== JSON.stringify(selectedArticle)) {
          setSelectedArticle(updatedArticle);
          if (articleContentEditorRef.current) {
            articleContentEditorRef.current.value = updatedArticle.content;
          }
        }
      } else {
        // If article no longer exists in any section, clear selection
        setSelectedArticle(null);
      }
    }
  }, [initialSections, selectedArticle]);

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        setError(null);
        
        // Handle different intents and update state accordingly
        const intent = fetcher.formData?.get('intent') as string;
        
        if (intent === 'create-section') {
          setCreateSectionModalOpen(false);
          // Clear the input field
          if (newSectionTitleRef.current) {
            newSectionTitleRef.current.value = '';
          }
          // Revalidate the data to refresh sections
          revalidator.revalidate();
        }
        
        if (intent === 'update-section') {
          setEditSectionModalOpen(false);
          // Revalidate the data to refresh sections
          revalidator.revalidate();
        }
        
        if (intent === 'delete-section') {
          setConfirmDeleteDialogOpen(false);
          setSelectedArticle(null); // Clear selected article if its section is deleted
          // Revalidate the data to refresh sections
          revalidator.revalidate();
        }
        
        if (intent === 'create-article') {
          setCreateArticleModalOpen(false);
          // Clear the input fields
          if (newArticleTitleRef.current) {
            newArticleTitleRef.current.value = '';
          }
          if (newArticleContentRef.current) {
            newArticleContentRef.current.value = '';
          }
          // Revalidate the data to refresh sections
          revalidator.revalidate();
        }
        
        if (intent === 'update-article') {
          setEditArticleModalOpen(false);
          
          // After successfully updating an article, update the selectedArticle if needed
          if (actionData.article && selectedArticle && actionData.article.id === selectedArticle.id) {
            setSelectedArticle(actionData.article);
          }
          
          // Revalidate the data to refresh sections
          revalidator.revalidate();
        }
        
        if (intent === 'delete-article') {
          setConfirmDeleteDialogOpen(false);
          
          // Clear selected article if it was deleted
          if (selectedArticle && itemToDelete && itemToDelete.type === 'article' && itemToDelete.id === selectedArticle.id) {
            setSelectedArticle(null);
          }
          
          // Revalidate the data to refresh sections
          revalidator.revalidate();
        }

      } else {
        // @ts-ignore
        setError(actionData.message || "An unspecified error occurred.");
      }
    }
  }, [actionData, revalidator, selectedArticle, itemToDelete]);
  

  const handleCreateSection = () => {
    const title = newSectionTitleRef.current?.value;
    if (title && courseId) {
      const formData = new FormData();
      formData.append("intent", "create-section");
      formData.append("courseId", courseId);
      formData.append("title", title);
      fetcher.submit(formData, { method: "post" });
    }
  };

  const handleEditSection = () => {
    const title = editSectionTitleRef.current?.value;
    if (title && editingSectionId && courseId) {
      const formData = new FormData();
      formData.append("intent", "update-section");
      formData.append("courseId", courseId);
      formData.append("sectionId", editingSectionId);
      formData.append("title", title);
      fetcher.submit(formData, { method: "post" });
    }
  };

  const handleDeleteConfirmation = (type: 'section' | 'article', id: string, sectionId?: string) => {
    setItemToDelete({ type, id, sectionId });
    setConfirmDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!itemToDelete || !courseId) return;

    const formData = new FormData();
    formData.append("courseId", courseId);

    if (itemToDelete.type === 'section') {
      formData.append("intent", "delete-section");
      formData.append("sectionId", itemToDelete.id);
    } else { 
      formData.append("intent", "delete-article");
      formData.append("articleId", itemToDelete.id);
      if (itemToDelete.sectionId) { 
        formData.append("sectionId", itemToDelete.sectionId);
      } else {
        console.error("Section ID missing for article deletion");
        setError("Section ID missing for article deletion.");
        setConfirmDeleteDialogOpen(false);
        return;
      }
    }
    fetcher.submit(formData, { method: "post" });
  };


  const handleCreateArticle = () => {
    const title = newArticleTitleRef.current?.value;
    const content = newArticleContentRef.current?.value;
    if (title && content && currentSectionIdForArticle && courseId) {
      const formData = new FormData();
      formData.append("intent", "create-article");
      formData.append("courseId", courseId);
      formData.append("sectionId", currentSectionIdForArticle);
      formData.append("title", title);
      formData.append("content", content);
      fetcher.submit(formData, { method: "post" });
    }
  };

  const handleEditArticle = () => {
    const title = editArticleTitleRef.current?.value;
    const content = editArticleContentRef.current?.value;

    if (title && content && editingArticleId && currentSectionIdForArticle && courseId) {
      const formData = new FormData();
      formData.append("intent", "update-article");
      formData.append("courseId", courseId);
      formData.append("sectionId", currentSectionIdForArticle);
      formData.append("articleId", editingArticleId);
      formData.append("title", title);
      formData.append("content", content);
      fetcher.submit(formData, { method: "post" });
    }
  };
  
  const openEditSectionModal = (section: Section) => {
    setEditingSectionId(section.id);
    if (editSectionTitleRef.current) editSectionTitleRef.current.value = section.title;
    setEditSectionModalOpen(true);
  };

  const openCreateArticleModal = (sectionId: string) => {
    setCurrentSectionIdForArticle(sectionId);
    setCreateArticleModalOpen(true);
  };
  
  const openEditArticleModal = (article: Article, sectionId: string) => {
    setEditingArticleId(article.id);
    setCurrentSectionIdForArticle(sectionId);
    if (editArticleTitleRef.current) editArticleTitleRef.current.value = article.title;
    if (editArticleContentRef.current) editArticleContentRef.current.value = article.content;
    setEditArticleModalOpen(true);
  };
  
  // Function to select an article to display in the main content area
  const selectArticleForEditing = (article: Article, sectionId: string) => {
    setSelectedArticle(article);
    setCurrentSectionIdForArticle(sectionId);
    if (articleContentEditorRef.current) {
      articleContentEditorRef.current.value = article.content;
    }
  };
  
  // Function to save article content changes
  const handleSaveArticleContent = () => {
    if (!selectedArticle || !currentSectionIdForArticle || !courseId) return;
    
    const content = articleContentEditorRef.current?.value;
    if (!content) return;
    
    const formData = new FormData();
    formData.append("intent", "update-article");
    formData.append("courseId", courseId);
    formData.append("sectionId", currentSectionIdForArticle);
    formData.append("articleId", selectedArticle.id);
    formData.append("title", selectedArticle.title);
    formData.append("content", content);
    
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="container mx-auto p-4">
      {/* @ts-ignore */}
      <h1 className="text-3xl font-bold mb-6">Manage Content for: {course?.title}</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* @ts-ignore */}
      {actionData?.success && actionData.message && (
         <Alert variant="default" className="mb-4 bg-green-100 border-green-400 text-green-700">
           <AlertTitle>Success</AlertTitle>
           {/* @ts-ignore */}
           <AlertDescription>{actionData.message}</AlertDescription>
         </Alert>
      )}

      <div className="flex">
        {/* Sidebar with sections and articles */}
        <div className="w-1/4 bg-gray-50 p-4 border-r border-gray-200 min-h-[70vh] overflow-y-auto">
          <div className="mb-4">
            <Button onClick={() => setCreateSectionModalOpen(true)} className="flex items-center w-full">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Section
            </Button>
          </div>
          
          <div className="space-y-4">
            {(sections || []).map((section: Section, index: number) => (
              <div key={section.id || `section-${index}`} className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 flex items-center justify-between bg-gray-100 rounded-t-lg">
                  <div className="flex items-center">
                    <GripVertical className="mr-2 h-5 w-5 text-gray-400" />
                    <span className="font-semibold">Section {section.position}: {section.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditSectionModal(section)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteConfirmation('section', section.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  {(section.articles || []).length > 0 ? (
                    <div className="space-y-1">
                      {section.articles.map((article: Article, articleIndex: number) => (
                        <div 
                          key={article.id || `article-${articleIndex}`} 
                          className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer ${selectedArticle?.id === article.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                          onClick={() => selectArticleForEditing(article, section.id)}
                        >
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-blue-500" />
                            <span className="text-sm">{article.title}</span>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 hover:opacity-100">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); openEditArticleModal(article, section.id); }}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteConfirmation('article', article.id, section.id); }}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-2 px-3">No articles in this section</p>
                  )}
                  <Button variant="ghost" size="sm" className="w-full text-blue-600 mt-2" onClick={() => openCreateArticleModal(section.id)}>
                    <PlusCircle className="mr-1 h-3 w-3" /> Add Article
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main content - Article editor */}
        <div className="w-3/4 p-4">
          {selectedArticle ? (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedArticle.title}</h2>
                <Button onClick={handleSaveArticleContent} disabled={fetcher.state === 'submitting'}>
                  {fetcher.state === 'submitting' && fetcher.formData?.get('intent') === 'update-article' ? "Saving..." : "Save Changes"}
                </Button>
              </div>
              <div>
                <Label htmlFor="article-content-editor" className="mb-2 block">Content</Label>
                <Textarea 
                  id="article-content-editor" 
                  ref={articleContentEditorRef} 
                  defaultValue={selectedArticle.content}
                  className="min-h-[60vh] font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No article selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an article from the sidebar to edit its content</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Section Modal */}
      <Dialog open={isCreateSectionModalOpen} onOpenChange={setCreateSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="new-section-title">Title</Label>
            <Input id="new-section-title" ref={newSectionTitleRef} placeholder="Enter section title" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleCreateSection} disabled={fetcher.state === 'submitting'}>
              {fetcher.state === 'submitting' && fetcher.formData?.get('intent') === 'create-section' ? "Creating..." : "Create Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Modal */}
      <Dialog open={isEditSectionModalOpen} onOpenChange={setEditSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="edit-section-title">Title</Label>
            <Input id="edit-section-title" ref={editSectionTitleRef} placeholder="Enter section title" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleEditSection} disabled={fetcher.state === 'submitting'}>
             {fetcher.state === 'submitting' && fetcher.formData?.get('intent') === 'update-section' ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Article Modal */}
      <Dialog open={isCreateArticleModalOpen} onOpenChange={setCreateArticleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="new-article-title">Title</Label>
              <Input id="new-article-title" ref={newArticleTitleRef} placeholder="Enter article title" />
            </div>
            <div>
              <Label htmlFor="new-article-content">Content</Label>
              <Textarea id="new-article-content" ref={newArticleContentRef} placeholder="Enter article content" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleCreateArticle} disabled={fetcher.state === 'submitting'}>
              {fetcher.state === 'submitting' && fetcher.formData?.get('intent') === 'create-article' ? "Creating..." : "Create Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Article Modal */}
      <Dialog open={isEditArticleModalOpen} onOpenChange={setEditArticleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-article-title">Title</Label>
              <Input id="edit-article-title" ref={editArticleTitleRef} />
            </div>
            <div>
              <Label htmlFor="edit-article-content">Content</Label>
              <Textarea id="edit-article-content" ref={editArticleContentRef} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleEditArticle} disabled={fetcher.state === 'submitting'}>
              {fetcher.state === 'submitting' && fetcher.formData?.get('intent') === 'update-article' ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={fetcher.state === 'submitting'}>
              {fetcher.state === 'submitting' && (fetcher.formData?.get('intent') as string)?.startsWith('delete-') ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
