import { generateFakeStoriesAndReviews } from "@/src/lib/fakeStories.js";
import { lengthFromBody, PLACEHOLDER_COVER } from "@/src/lib/storyMeta.js";

import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase/clientApp";

function mapStoryDoc(docSnap) {
  const data = docSnap.data() || {};
  return {
    id: docSnap.id,
    ...data,
    timestamp: data.timestamp?.toDate?.() || data.timestamp || new Date(),
  };
}

export async function updateStoryImageReference(storyId, publicImageUrl) {
  const storyRef = doc(collection(db, "stories"), storyId);
  if (storyRef) {
    await updateDoc(storyRef, { photo: publicImageUrl });
  }
}

const updateWithRating = async (
  transaction,
  docRef,
  newRatingDocument,
  review
) => {
  const story = await transaction.get(docRef);
  const data = story.data();
  const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
  const newSumRating = (data?.sumRating || 0) + Number(review.rating);
  const newAverage = newSumRating / newNumRatings;

  transaction.update(docRef, {
    numRatings: newNumRatings,
    sumRating: newSumRating,
    avgRating: newAverage,
    lastReviewUserId: review.userId,
  });

  transaction.set(newRatingDocument, {
    ...review,
    timestamp: Timestamp.fromDate(new Date()),
  });
};

export async function addReviewToStory(db, storyId, review) {
  if (!storyId) {
    throw new Error("No story ID has been provided.");
  }

  if (!review) {
    throw new Error("A valid review has not been provided.");
  }

  try {
    const docRef = doc(collection(db, "stories"), storyId);
    const newRatingDocument = doc(
      collection(db, `stories/${storyId}/ratings`),
    );

    await runTransaction(db, (transaction) =>
      updateWithRating(transaction, docRef, newRatingDocument, review),
    );
  } catch (error) {
    console.error(
      "There was an error adding the rating to the story",
      error,
    );
    throw error;
  }
}

export async function addStory(db, { title, genre, body, author, authorId }) {
  if (!title || !genre || !body) {
    throw new Error("A title, genre, and story body are required.");
  }
  if (!authorId) {
    throw new Error("An authenticated author is required.");
  }

  const docRef = await addDoc(collection(db, "stories"), {
    title,
    genre,
    body,
    author,
    authorId,
    length: lengthFromBody(body),
    photo: PLACEHOLDER_COVER,
    avgRating: 0,
    numRatings: 0,
    sumRating: 0,
    timestamp: Timestamp.fromDate(new Date()),
  });

  return docRef.id;
}

function applyQueryFilters(q, { genre, author, length, sort }) {
  if (genre) {
    q = query(q, where("genre", "==", genre));
  }
  if (author) {
    q = query(q, where("author", "==", author));
  }
  if (length) {
    q = query(q, where("length", "==", Number(length)));
  }
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  } else if (sort === "Review") {
    q = query(q, orderBy("numRatings", "desc"));
  }
  return q;
}

export async function getStoryById(db, storyId) {
  if (!storyId) {
    console.log("Error: Invalid ID received: ", storyId);
    return;
  }
  const docRef = doc(db, "stories", storyId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return;
  }
  return mapStoryDoc(docSnap);
}

export async function getStories(firestoreDb, filters = {}) {
  let q = query(collection(firestoreDb, "stories"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((docSnap) => mapStoryDoc(docSnap));
}

export function getStoriesSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "stories"));
  q = applyQueryFilters(q, filters);

  return onSnapshot(q, (querySnapshot) => {
    cb(querySnapshot.docs.map((docSnap) => mapStoryDoc(docSnap)));
  });
}

export function getStorySnapshotById(storyId, cb) {
  if (!storyId) {
    console.log("Error: Invalid ID received: ", storyId);
    return;
  }

  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  const docRef = doc(db, "stories", storyId);
  return onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      return;
    }
    cb(mapStoryDoc(docSnap));
  });
}

export async function getReviewsByStoryId(db, storyId) {
  if (!storyId) {
    console.log("Error: Invalid storyId received: ", storyId);
    return;
  }

  const q = query(
    collection(db, "stories", storyId, "ratings"),
    orderBy("timestamp", "desc")
  );

  const results = await getDocs(q);
  return results.docs.map((docSnap) => {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      timestamp: docSnap.data().timestamp.toDate(),
    };
  });
}

export function getReviewsSnapshotByStoryId(storyId, cb) {
  if (!storyId) {
    console.log("Error: Invalid storyId received: ", storyId);
    return;
  }

  const q = query(
    collection(db, "stories", storyId, "ratings"),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((docSnap) => {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        timestamp: docSnap.data().timestamp.toDate(),
      };
    });
    cb(results);
  });
}

export async function addFakeStoriesAndReviews() {
  const data = await generateFakeStoriesAndReviews();
  for (const { storyData, ratingsData } of data) {
    try {
      const authorId = auth.currentUser?.uid || storyData.authorId;
      const docRef = await addDoc(collection(db, "stories"), {
        ...storyData,
        authorId,
      });

      for (const ratingData of ratingsData) {
        await addDoc(
          collection(db, "stories", docRef.id, "ratings"),
          ratingData
        );
      }
    } catch (e) {
      console.log("There was an error adding the document");
      console.error("Error adding document: ", e);
    }
  }
}
