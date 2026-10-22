import { gemini, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import { getReviewsByStoryId } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";

export async function GeminiSummary({ storyId }) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const reviews = await getReviewsByStoryId(
    getFirestore(firebaseServerApp),
    storyId
  );
  const reviewSeparator = "@";
  const prompt = `
    Based on the following story reviews, 
    where each review is separated by a '${reviewSeparator}' character, 
    create a one-sentence summary of what readers think of the story,
    covering plot, prose, and pacing when those come up.

    Here are the reviews: ${reviews.map((review) => review.text).join(reviewSeparator)}
  `;
  try {
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'GEMINI_API_KEY not set. Set it with "firebase apphosting:secrets:set GEMINI_API_KEY"'
      );
    }

    const ai = genkit({
      plugins: [googleAI()],
      model: gemini('gemini-3.8-flash'),
    });
    const { text } = await ai.generate(prompt);
    return (
      <div className="story__review_summary">
        <p>{text}</p>
        <p>✨ Summarized with Gemini</p>
      </div>
    );
  } catch (e) {
    console.error(e);
    return <p>Error summarizing reviews.</p>;
  }
}

export function GeminiSummarySkeleton() {
  return (
    <div className="story__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}
