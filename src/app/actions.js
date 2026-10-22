"use server";

import { addReviewToRestaurant } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// This is a Server Action

// new function from step 8
// Note: Next.js documentation URL is now: https://nextjs.org/docs/app/guides/forms
export async function handleReviewFormSubmission(data) {
    // const { app } = await getAuthenticatedAppForUser();
    // ETHAN NOTE: RETRIEVE currentUser FROM SERVER-SIDE FIREBASE AUTH FOR SECURITY
    const { app, currentUser } = await getAuthenticatedAppForUser();
    const db = getFirestore(app);

    // console.log( JSON.stringify( currentUser ) );

    await addReviewToRestaurant(db, data.get("restaurantId"), {
            text: data.get("text"),
            rating: data.get("rating"),

            // This came from a hidden form field.
            // userId: data.get("userId"),
            // ETHAN NOTE: INSTEAD OF LETTING USERID BE PASSED FROM CLIENT IN HIDDEN FORM
            // FIELD, USE THE SERVER-SIDE FIREBASE AUTH RESULT FOR currentUser.uid
            // THIS WILL BE MORE SECURE SINCE NOT RELYING ON CLIENT POSTED USERID
            userId: currentUser.uid,
    });
}

/*
// original placeholder functions from start of tutorial
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
// Replace the function below
export async function handleReviewFormSubmission(data) {}
*/
















/* old code
"use server";

import { addReviewToRestaurant } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// This is a Server Action
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
// Replace the function below

export async function handleReviewFormSubmission(data) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  await addReviewToRestaurant(db, data.get("restaurantId"), {
    text: data.get("text"),
    rating: data.get("rating"),

    // This came from a hidden form field.
    userId: data.get("userId"),
  });
}
*/