import StoryListings from "@/src/components/StoryListings.jsx";
import { getStories } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

export const dynamic = "force-dynamic";

export default async function Home(props) {
  const searchParams = await props.searchParams;
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const stories = await getStories(
    getFirestore(firebaseServerApp),
    searchParams
  );
  return (
    <main className="main__home">
      <StoryListings
        initialStories={stories}
        searchParams={searchParams}
      />
    </main>
  );
}
