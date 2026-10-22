"use server";

import { addReviewToStory, addStory } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { redirect } from "next/navigation";

export async function handleReviewFormSubmission(data) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    const db = getFirestore(firebaseServerApp);

    if (!currentUser) {
      throw new Error("You must be signed in to add a review.");
    }

    await addReviewToStory(db, data.get("storyId"), {
            text: data.get("text"),
            rating: data.get("rating"),
            userId: currentUser.uid,
    });
}

export async function handleStoryFormSubmission(data) {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  if (!currentUser) {
    throw new Error("You must be signed in to write a story.");
  }

  const storyId = await addStory(db, {
    title: data.get("title")?.trim(),
    genre: data.get("genre"),
    body: data.get("body")?.trim(),
    author: currentUser.displayName || currentUser.email || "Anonymous",
    authorId: currentUser.uid,
  });

  redirect(`/story/${storyId}`);
}
