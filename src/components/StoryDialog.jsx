"use client";

import { useLayoutEffect, useRef } from "react";
import { handleStoryFormSubmission } from "@/src/app/actions.js";
import { STORY_GENRES } from "@/src/lib/storyMeta.js";

const StoryDialog = ({ isOpen, handleClose }) => {
  const dialog = useRef();

  useLayoutEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen, dialog]);

  const handleClick = (e) => {
    if (e.target === dialog.current) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialog}
      className="dialog--tall"
      onMouseDown={handleClick}
    >
      <form action={handleStoryFormSubmission}>
        <header>
          <h3>Write a story</h3>
        </header>
        <article>
          <p>
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
            />
          </p>
          <p>
            <label>
              Genre
              <select name="genre" required defaultValue="">
                <option value="" disabled>
                  Choose a genre
                </option>
                {STORY_GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>
          </p>
          <p>
            <textarea
              name="body"
              placeholder="Write your story..."
              required
              rows={10}
            />
          </p>
        </article>
        <footer>
          <menu>
            <button
              autoFocus
              type="button"
              onClick={handleClose}
              className="button--cancel"
            >
              Cancel
            </button>
            <button type="submit" className="button--confirm">
              Publish
            </button>
          </menu>
        </footer>
      </form>
    </dialog>
  );
};

export default StoryDialog;
