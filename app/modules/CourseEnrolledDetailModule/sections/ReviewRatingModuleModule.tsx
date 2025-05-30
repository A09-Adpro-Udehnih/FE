import React, { useEffect, useMemo, useState } from "react";
import { useLoaderData, useSearchParams, useRevalidator } from "react-router";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Star,
  X,
} from "lucide-react";
import type { CourseEnrolledDetailLoader } from "../loader";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

interface ReviewFormData {
  rating: number;
  comment: string;
}

export const ReviewRatingModuleModule = () => {
  const { reviews, userId, course } =
    useLoaderData<typeof CourseEnrolledDetailLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();
  const currentPage = Number(searchParams.get("comments") || "0");
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  useEffect(() => {
    revalidator.revalidate();
  }, [currentPage]);

  const handleEdit = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      setEditingReviewId(reviewId);
      setFormData({
        rating: review.rating,
        comment: review.comment,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setFormData({ rating: 0, comment: "" });
  };

  const handleDelete = async (reviewId: string) => {
    const response = await fetch("/api/delete/reviews", {
      method: "DELETE",
      body: JSON.stringify({ id: reviewId }),
    });

    if (response.status !== 200) {
      toast.error("Failed to delete review");
      return;
    }

    toast.success("Review deleted successfully");
    revalidator.revalidate();
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ comments: newPage.toString() });
  };

  const handleSubmitReview = async () => {
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!formData.comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingReviewId) {
        const response = await fetch("/api/edit/reviews", {
          method: "PUT",
          body: JSON.stringify({ id: editingReviewId, ...formData }),
        });

        if (response.status !== 200) {
          toast.error("Failed to update review");
          setIsSubmitting(false);
          return;
        }
        toast.success("Review updated successfully");
      } else {
        const response = await fetch("/api/create/reviews", {
          method: "POST",
          body: JSON.stringify({
            rating: formData.rating,
            comment: formData.comment,
            userId,
            courseId: course.id,
          }),
        });

        if (response.status !== 200) {
          toast.error("Failed to submit review");
          setIsSubmitting(false);
          return;
        }
        toast.success("Review submitted successfully");
      }
      setFormData({ rating: 0, comment: "" });
      setEditingReviewId(null);
      revalidator.revalidate();
    } catch (error) {
      toast.error(
        editingReviewId ? "Failed to update review" : "Failed to submit review"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort reviews to show user's reviews first
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (a.userId === userId && b.userId !== userId) return -1;
      if (a.userId !== userId && b.userId === userId) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reviews, userId]);

  const hasUserReview = useMemo(() => {
    return reviews.some((review) => review.userId === userId);
  }, [reviews, userId]);

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    // If we have less than 10 items, we don't need pagination
    if (reviews.length < ITEMS_PER_PAGE) {
      return [];
    }

    let startPage = Math.max(0, currentPage - halfMaxPages);
    let endPage = startPage + maxPagesToShow - 1;

    // Adjust if we're near the end
    if (endPage > currentPage + 2) {
      endPage = currentPage + 2;
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, reviews.length]);

  const hasNextPage = reviews.length === ITEMS_PER_PAGE;

  const renderReviewForm = (isEditing = false) => (
    <div className="mb-8 bg-background border rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit Review" : "Write a Review"}
        </h2>
        {isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelEdit}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= formData.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Comment</label>
          <Textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="Share your thoughts about this course..."
            className="min-h-[100px]"
          />
        </div>
        <Button
          onClick={handleSubmitReview}
          disabled={isSubmitting || revalidator.state === "loading"}
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Submitting..."
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </Button>
      </div>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Reviews</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || revalidator.state === "loading"}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {pageNumbers.length > 0 && (
            <div className="flex items-center gap-1">
              {pageNumbers.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={revalidator.state === "loading"}
                  className="w-8 h-8 p-0"
                >
                  {pageNum + 1}
                </Button>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage || revalidator.state === "loading"}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {editingReviewId
        ? renderReviewForm(true)
        : !hasUserReview && renderReviewForm()}

      <div className="space-y-4">
        {revalidator.state === "loading" && (
          <div className="text-center py-4 text-gray-500">
            Loading reviews...
          </div>
        )}
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className={`bg-background border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
              review.userId === userId ? "border-blue-200" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-5 h-5 ${
                          index < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </span>
                  {review.userId === userId && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Your review
                    </span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-400">
                  {review.comment}
                </p>
              </div>
              {review.userId === userId && (
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(review.id)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {reviews.length === 0 && revalidator.state !== "loading" && (
          <div className="text-center py-8 text-gray-500">
            No reviews found.
          </div>
        )}
      </div>
    </main>
  );
};
