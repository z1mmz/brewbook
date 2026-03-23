import { useContext, useState } from "react";
import { VStack, HStack, Button, Text, Textarea } from "@chakra-ui/react";
import useReviews from "../../hooks/useReviews";
import useBeans from "../../hooks/useBeans";
import LoginContext from "../../contexts/loginContext";

function StarPicker({ value, onChange }) {
  return (
    <HStack gap={1}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          fontSize="2xl"
          color={star <= value ? "orange.400" : "gray.300"}
          cursor="pointer"
          onClick={() => onChange(star)}
          lineHeight="1"
        >
          ★
        </Text>
      ))}
    </HStack>
  );
}

function ReviewForm({ recipeId }) {
  const { loggedInUser } = useContext(LoginContext);
  const { createReview, isCreating } = useReviews(recipeId);
  const { beans } = useBeans();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [beanId, setBeanId] = useState("");
  const [error, setError] = useState(null);

  if (!loggedInUser) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!content.trim()) {
      setError("Please write a review.");
      return;
    }
    createReview({ recipe: recipeId, rating, content: content.trim(), bean: beanId || null });
    setRating(0);
    setContent("");
    setBeanId("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" gap={3}>
        <Text fontWeight="semibold">Leave a review</Text>
        <StarPicker value={rating} onChange={setRating} />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this recipe..."
          rows={3}
        />
        {beans.length > 0 && (
          <select
            value={beanId}
            onChange={(e) => setBeanId(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">— Beans used (optional) —</option>
            {beans.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.roaster}
              </option>
            ))}
          </select>
        )}
        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
        <Button type="submit" loading={isCreating} alignSelf="flex-start">
          Submit Review
        </Button>
      </VStack>
    </form>
  );
}

export default ReviewForm;
