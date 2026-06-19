export const HISTORY_KEY = "movieApp_history";
const MAX_HISTORY = 20;

const readHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const normalizeMovie = (movie) => ({
  id: movie.id,
  title: movie.title || movie.title_english || movie.title_long || "Untitled movie",
  slug: movie.slug || "",
  year: movie.year || 0,
  rating: typeof movie.rating === "number" ? movie.rating : 0,
  medium_cover_image:
    movie.medium_cover_image ||
    movie.large_cover_image ||
    movie.small_cover_image ||
    movie.poster ||
    "",
  large_cover_image: movie.large_cover_image || movie.medium_cover_image || movie.poster || "",
  viewedAt: Date.now(),
});

export const getHistory = () => readHistory();

export const addToHistory = (movie) => {
  const normalized = normalizeMovie(movie);
  const current = getHistory();
  const next = [normalized, ...current.filter((item) => item.id !== normalized.id)].slice(
    0,
    MAX_HISTORY,
  );

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (e) {
    // Ignore storage failures.
  }

  return next;
};
