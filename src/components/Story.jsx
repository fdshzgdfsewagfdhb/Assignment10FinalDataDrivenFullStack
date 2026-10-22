"use client";

import { React, useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { getStorySnapshotById } from "@/src/lib/firebase/firestore.js";
import { useUser } from "@/src/lib/getUser";
import StoryDetails from "@/src/components/StoryDetails.jsx";
import { updateStoryImage } from "@/src/lib/firebase/storage.js";

const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx"));

export default function Story({
  id,
  initialStory,
  initialUserId,
  children,
}) {
  const [storyDetails, setStoryDetails] = useState(initialStory);
  const [isOpen, setIsOpen] = useState(false);

  const userId = useUser()?.uid || initialUserId;
  const [review, setReview] = useState({
    rating: 0,
    text: "",
  });

  const onChange = (value, name) => {
    setReview({ ...review, [name]: value });
  };

  async function handleStoryImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }

    const imageURL = await updateStoryImage(id, image);
    setStoryDetails({ ...storyDetails, photo: imageURL });
  }

  const handleClose = () => {
    setIsOpen(false);
    setReview({ rating: 0, text: "" });
  };

  useEffect(() => {
    return getStorySnapshotById(id, (data) => {
      setStoryDetails(data);
    });
  }, [id]);

  return (
    <>
      <StoryDetails
        story={storyDetails}
        userId={userId}
        handleStoryImage={handleStoryImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </StoryDetails>
      {userId && (
        <Suspense fallback={<p>Loading...</p>}>
          <ReviewDialog
            isOpen={isOpen}
            handleClose={handleClose}
            review={review}
            onChange={onChange}
            userId={userId}
            id={id}
          />
        </Suspense>
      )}
    </>
  );
}
