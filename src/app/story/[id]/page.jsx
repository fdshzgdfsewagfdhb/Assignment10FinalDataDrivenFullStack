import Story from "@/src/components/Story.jsx";
import { Suspense } from "react";
import { getStoryById } from "@/src/lib/firebase/firestore.js";
import {
  getAuthenticatedAppForUser,
  getAuthenticatedAppForUser as getUser,
} from "@/src/lib/firebase/serverApp.js";
import ReviewsList, {
  ReviewsListSkeleton,
} from "@/src/components/Reviews/ReviewsList";
import {
  GeminiSummary,
  GeminiSummarySkeleton,
} from "@/src/components/Reviews/ReviewSummary";
import { getFirestore } from "firebase/firestore";

export default async function StoryPage(props) {
  const params = await props.params;
  const { currentUser } = await getUser();
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const story = await getStoryById(
    getFirestore(firebaseServerApp),
    params.id
  );

  return (
    <main className="main__story">
      <Story
        id={params.id}
        initialStory={story}
        initialUserId={currentUser?.uid || ""}
      >
        <Suspense fallback={<GeminiSummarySkeleton />}>
          <GeminiSummary storyId={params.id} />
        </Suspense>
      </Story>
      <Suspense
        fallback={<ReviewsListSkeleton numReviews={story?.numRatings || 0} />}
      >
        <ReviewsList storyId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
}
