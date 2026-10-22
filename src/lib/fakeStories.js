import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";
import { lengthFromBody, PLACEHOLDER_COVER } from "@/src/lib/storyMeta.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeStoriesAndReviews() {
  const storiesToAdd = 5;
  const data = [];

  for (let i = 0; i < storiesToAdd; i++) {
    const storyTimestamp = Timestamp.fromDate(getRandomDateBefore());
    const ratingsData = [];

    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(storyTimestamp.toDate())
      );
      const sample =
        randomData.storyReviews[
          randomNumberBetween(0, randomData.storyReviews.length - 1)
        ];

      ratingsData.push({
        rating: sample.rating,
        text: sample.text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      });
    }

    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;

    const body =
      randomData.storyBodies[
        randomNumberBetween(0, randomData.storyBodies.length - 1)
      ];

    const storyData = {
      title:
        randomData.storyTitles[
          randomNumberBetween(0, randomData.storyTitles.length - 1)
        ],
      genre:
        randomData.storyGenres[
          randomNumberBetween(0, randomData.storyGenres.length - 1)
        ],
      author:
        randomData.storyAuthors[
          randomNumberBetween(0, randomData.storyAuthors.length - 1)
        ],
      authorId: `sample-author-${randomNumberBetween(1, 8)}`,
      body,
      length: lengthFromBody(body),
      avgRating,
      numRatings: ratingsData.length,
      sumRating: ratingsData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0
      ),
      photo: PLACEHOLDER_COVER,
      timestamp: storyTimestamp,
    };

    data.push({
      storyData,
      ratingsData,
    });
  }
  return data;
}
