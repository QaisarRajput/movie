const FALLBACK_TITLE = "movie";

export const slugify = (value) =>
  String(value || FALLBACK_TITLE)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || FALLBACK_TITLE;

export const getMoviePathFromParts = ({ id, title, year, slug }) => {
  if (!id) return "/movies/all";
  const readableSlug = slugify(slug || `${title || FALLBACK_TITLE}${year ? ` ${year}` : ""}`);
  return `/movie/${readableSlug}-${id}`;
};

export const getMoviePath = (movie) =>
  getMoviePathFromParts({
    id: movie?.id,
    title: movie?.title || movie?.title_english || movie?.title_long,
    year: movie?.year,
    slug: movie?.slug,
  });

export const getMovieIdFromPathname = (pathname) => {
  const match = String(pathname || "").match(/^\/movie\/([^/?#]+)/);
  if (!match) return null;

  const segment = match[1];
  if (/^\d+$/.test(segment)) return segment;

  const endId = segment.match(/-(\d+)$/);
  if (endId) return endId[1];

  return null;
};
