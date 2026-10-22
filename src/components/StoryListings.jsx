"use client";

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getStoriesSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";
import { lengthLabel } from "@/src/lib/storyMeta.js";

const StoryItem = ({ story }) => (
  <li key={story.id}>
    <Link href={`/story/${story.id}`}>
      <ActiveStory story={story} />
    </Link>
  </li>
);

const ActiveStory = ({ story }) => (
  <div>
    <ImageCover photo={story.photo} name={story.title} />
    <StoryCardDetails story={story} />
  </div>
);

const ImageCover = ({ photo, name }) => (
  <div className="image-cover">
    <img src={photo} alt={name} />
  </div>
);

const StoryCardDetails = ({ story }) => (
  <div className="story__details">
    <h2>{story.title}</h2>
    <StoryRating story={story} />
    <StoryMetadata story={story} />
  </div>
);

const StoryRating = ({ story }) => (
  <div className="story__rating">
    <ul>{renderStars(story.avgRating)}</ul>
    <span>({story.numRatings})</span>
  </div>
);

const StoryMetadata = ({ story }) => (
  <div className="story__meta">
    <p>
      {story.genre} | {story.author}
    </p>
    <p>{lengthLabel(story.length)}</p>
  </div>
);

export default function StoryListings({ initialStories, searchParams }) {
  const router = useRouter();

  const initialFilters = {
    author: searchParams.author || "",
    genre: searchParams.genre || "",
    length: searchParams.length || "",
    sort: searchParams.sort || "",
  };

  const [stories, setStories] = useState(initialStories);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getStoriesSnapshot((data) => {
      setStories(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="stories">
        {stories.map((story) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}
