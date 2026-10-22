import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/lib/firebase/clientApp";
import { updateStoryImageReference } from "@/src/lib/firebase/firestore";

export async function updateStoryImage(storyId, image) {
  try {
    if (!storyId) {
      throw new Error("No story ID has been provided.");
    }

    if (!image || !image.name) {
      throw new Error("A valid image has not been provided.");
    }

    const publicImageUrl = await uploadImage(storyId, image);
    await updateStoryImageReference(storyId, publicImageUrl);

    return publicImageUrl;
  } catch (error) {
    console.error("Error processing request:", error);
  }
}

async function uploadImage(storyId, image) {
  const filePath = `images/${storyId}/${image.name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);

  return await getDownloadURL(newImageRef);
}
