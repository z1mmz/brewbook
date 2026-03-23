import { useContext } from "react";
import { VStack, HStack, Text, Button, Heading, Box } from "@chakra-ui/react";
import useReviews from "../../hooks/useReviews";
import LoginContext from "../../contexts/loginContext";

const StarDisplay = ({ rating }) => (
  <Text color="orange.400">{"★".repeat(rating) + "☆".repeat(5 - rating)}</Text>
);

function ReviewList({ recipeId }) {
  const { reviews, deleteReview } = useReviews(recipeId);
  const { loggedInUser } = useContext(LoginContext);

  if (reviews.length === 0) {
    return <Text color="gray.500">No reviews yet. Be the first!</Text>;
  }

  return (
    <VStack align="stretch" gap={3}>
      {reviews.map((review) => (
        <Box key={review.id} p={3} borderWidth="1px" borderRadius="md">
          <HStack justify="space-between">
            <HStack>
              <StarDisplay rating={review.rating} />
              <Text fontWeight="bold" fontSize="sm">
                {review.user?.username}
              </Text>
            </HStack>
            {loggedInUser && loggedInUser.id === review.user?.id && (
              <Button
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={() => deleteReview(review.id)}
              >
                Delete
              </Button>
            )}
          </HStack>
          <Text mt={1}>{review.content}</Text>
          {review.bean && (
            <Text fontSize="xs" opacity={0.6} mt={1}>
              Brewed with: {review.bean.name} by {review.bean.roaster}
            </Text>
          )}
        </Box>
      ))}
    </VStack>
  );
}

export default ReviewList;
