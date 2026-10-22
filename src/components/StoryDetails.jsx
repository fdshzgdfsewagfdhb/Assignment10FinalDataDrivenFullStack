import React from "react";
import renderStars from "@/src/components/Stars.jsx";
import { lengthLabel } from "@/src/lib/storyMeta.js";

const StoryDetails = ({
  story,
  userId,
  handleStoryImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  if (!story) {
    return <p>Story not found.</p>;
  }

  return (
    <>
      <section className="img__section">
        <img src={story.photo} alt={story.title} />

        <div className="actions">
          {userId && (
            <img
              alt="review"
              className="review"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              src="/review.svg"
            />
          )}
          <label
            onChange={(event) => handleStoryImage(event.target)}
            htmlFor="upload-image"
            className="add"
          >
            <input
              name=""
              type="file"
              id="upload-image"
              className="file-input hidden w-full h-full"
            />

            <img className="add-image" src="/add.svg" alt="Add image" />
          </label>
        </div>

        <div className="details__container">
          <div className="details">
            <h2>{story.title}</h2>

            <div className="story__rating">
              <ul>{renderStars(story.avgRating)}</ul>

              <span>({story.numRatings})</span>
            </div>

            <p>
              {story.genre} | {story.author}
            </p>
            <p>{lengthLabel(story.length)}</p>
            {children}
          </div>
        </div>
      </section>
      <section className="story__body">
        <h3>The story</h3>
        <p>{story.body}</p>
      </section>
    </>
  );
};

export default StoryDetails;
