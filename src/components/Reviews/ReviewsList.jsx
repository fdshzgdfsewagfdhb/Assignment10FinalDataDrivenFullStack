import React from "react";
import { getReviewsByStoryId } from "@/src/lib/firebase/firestore.js";
import ReviewsListClient from "@/src/components/Reviews/ReviewsListClient";
import { ReviewSkeleton } from "@/src/components/Reviews/Review";
import { getFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";

export default async function ReviewsList({ storyId, userId }) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const reviews = await getReviewsByStoryId(
    getFirestore(firebaseServerApp),
    storyId
  );

  return (
    <ReviewsListClient
      initialReviews={reviews}
      storyId={storyId}
      userId={userId}
    />
  );
}

export function ReviewsListSkeleton({ numReviews }) {
  return (
    <article>
      <ul className="reviews">
        <ul>
          {Array(numReviews)
            .fill(0)
            .map((value, index) => (
              <ReviewSkeleton key={`loading-review-${index}`} />
            ))}
        </ul>
      </ul>
    </article>
  );
}
