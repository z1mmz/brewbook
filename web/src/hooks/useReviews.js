import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reviewsService from "../services/reviews";

const useReviews = (recipeId) => {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: ["reviews", recipeId],
    queryFn: () => reviewsService.getByRecipe(recipeId),
    enabled: !!recipeId,
  });

  const createReviewMutation = useMutation({
    mutationFn: (review) => reviewsService.createReview(review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", recipeId] });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId) => reviewsService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", recipeId] });
    },
  });

  return {
    reviews: reviewsQuery.data ?? [],
    createReview: (review) => createReviewMutation.mutate(review),
    deleteReview: (reviewId) => deleteReviewMutation.mutate(reviewId),
    isCreating: createReviewMutation.isPending,
  };
};

export default useReviews;
