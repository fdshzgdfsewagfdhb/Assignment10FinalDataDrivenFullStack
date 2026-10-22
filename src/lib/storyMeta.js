export const STORY_GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Romance",
  "Horror",
  "Literary",
  "Historical",
  "Slice of Life",
];

export const STORY_LENGTHS = [
  { value: 1, label: "Flash" },
  { value: 2, label: "Short" },
  { value: 3, label: "Medium" },
  { value: 4, label: "Long" },
];

export const PLACEHOLDER_COVER = "/cover-placeholder.svg";

export function lengthFromBody(body) {
  const words = (body || "").trim().split(/\s+/).filter(Boolean).length;
  if (words < 80) return 1;
  if (words < 150) return 2;
  if (words < 250) return 3;
  return 4;
}

export function lengthLabel(length) {
  return STORY_LENGTHS.find((item) => item.value === Number(length))?.label || "";
}
