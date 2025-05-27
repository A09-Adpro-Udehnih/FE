import React from "react";
import type { ReviewRatingModuleLoader } from "./loader";
import { useLoaderData } from "react-router";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";

export const ReviewRatingModuleModule = () => {
  const reviews = useLoaderData<typeof ReviewRatingModuleLoader>();

  const handleEdit = (reviewId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit review:", reviewId);
  };

  const handleDelete = (reviewId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete review:", reviewId);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
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
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(review.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews found. Start by adding your first review!
          </div>
        )}
      </div>
    </main>
  );
};
