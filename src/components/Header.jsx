"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "@/src/lib/firebase/auth.js";
import { addFakeStoriesAndReviews } from "@/src/lib/firebase/firestore.js";
import { setCookie, deleteCookie } from "cookies-next";
import StoryDialog from "@/src/components/StoryDialog.jsx";

function useUserSession(initialUser) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}

export default function Header({ initialUser }) {
  const user = useUserSession(initialUser);
  const [isWriteOpen, setIsWriteOpen] = useState(false);

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };
  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  const handleWriteStory = (event) => {
    event.preventDefault();
    setIsWriteOpen(true);
  };

  const handleAddSamples = (event) => {
    event.preventDefault();
    addFakeStoriesAndReviews();
  };

  return (
    <>
      <header>
        <Link href="/" className="logo">
          <img src="/friendly-eats.svg" alt="Friendly Tales" />
          Friendly Tales
        </Link>
        {user ? (
          <div className="profile">
            <p>
              <img
                className="profileImage"
                src={user.photoURL || "/profile.svg"}
                alt={user.email}
              />
              {user.displayName}
            </p>

            <div className="menu">
              ...
              <ul>
                <li>{user.displayName}</li>

                <li>
                  <a href="#" onClick={handleWriteStory}>
                    Write a story
                  </a>
                </li>

                <li>
                  <a href="#" onClick={handleAddSamples}>
                    Add sample stories
                  </a>
                </li>

                <li>
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="profile">
            <a href="#" onClick={handleSignIn}>
              <img src="/profile.svg" alt="A placeholder user image" />
              Sign In with Google
            </a>
          </div>
        )}
      </header>
      {user && (
        <StoryDialog
          isOpen={isWriteOpen}
          handleClose={() => setIsWriteOpen(false)}
        />
      )}
    </>
  );
}
