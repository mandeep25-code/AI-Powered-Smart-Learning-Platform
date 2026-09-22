import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Turn a YouTube watch / share / embed URL into a privacy-enhanced embed URL. */
export function youtubeEmbedUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const idMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  const queryMatch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  const id = idMatch?.[1] || queryMatch?.[1];
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
