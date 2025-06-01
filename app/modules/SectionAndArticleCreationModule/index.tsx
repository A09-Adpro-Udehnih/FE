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

  const [itemToDelete, setItemToDelete] = useState<{ type: 'section' | 'article', id: string, sectionId?: string } | null>(null);
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  const newSectionTitleRef = useRef<HTMLInputElement>(null);
  const editSectionTitleRef = useRef<HTMLInputElement>(null);
  const newArticleTitleRef = useRef<HTMLInputElement>(null);
  const newArticleContentRef = useRef<HTMLTextAreaElement>(null);
  const editArticleTitleRef = useRef<HTMLInputElement>(null);
  const editArticleContentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSections(initialSections || []);
  }, [initialSections]);

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
          // Revalidate the data to refresh sections
          revalidator.revalidate();
        }
        
        if (intent === 'delete-article') {
          setConfirmDeleteDialogOpen(false);
          // Revalidate the data to refresh sections
          revalidator.revalidate();
        }

      } else {
        // @ts-ignore
        setError(actionData.message || "An unspecified error occurred.");
      }
    }
  }, [actionData, revalidator]);
  

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


      <div className="mb-6">
        <Button onClick={() => setCreateSectionModalOpen(true)} className="flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Section
        </Button>
      </div>

      <Accordion type="multiple" className="w-full space-y-3">
        {(sections || []).map((section: Section, index: number) => (
          <AccordionItem value={section.id || `section-${index}`} key={section.id || `section-${index}`} className="bg-gray-50 rounded-lg shadow">
            <AccordionTrigger className="hover:bg-gray-100 px-4 py-3 rounded-t-lg w-full text-left">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <GripVertical className="mr-2 h-5 w-5 text-gray-400" />
                  <span className="font-semibold text-lg">Section {section.position}: {section.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openEditSectionModal(section); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteConfirmation('section', section.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 border-t border-gray-200">
              <div className="space-y-2 mb-3">
                {(section.articles || []).map((article: Article, articleIndex: number) => ( 
                  <div key={article.id || `article-${articleIndex}`} className="flex items-center justify-between p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      <span>Article {article.position}: {article.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Button variant="outline" size="sm" onClick={() => openEditArticleModal(article, section.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteConfirmation('article', article.id, section.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700" onClick={() => openCreateArticleModal(section.id)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Article
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

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
