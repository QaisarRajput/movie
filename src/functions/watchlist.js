export const WATCHLIST_KEY = "movieApp_watchlist";
export const WATCHLIST_EVENT = "movieapp:watchlist-updated";

const readList = () => {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const emitWatchlistUpdate = (list) => {
  window.dispatchEvent(new CustomEvent(WATCHLIST_EVENT, { detail: { list } }));
};

const normalizeMovie = (movie) => ({
  id: movie.id,
  title: movie.title || movie.title_english || movie.title_long || "Untitled movie",
  slug: movie.slug || "",
  year: movie.year || 0,
  rating: typeof movie.rating === "number" ? movie.rating : 0,
  poster:
    movie.poster ||
    movie.medium_cover_image ||
    movie.large_cover_image ||
    movie.small_cover_image ||
    "",
  medium_cover_image: movie.medium_cover_image || movie.poster || "",
  large_cover_image: movie.large_cover_image || movie.poster || "",
  addedAt: movie.addedAt || Date.now(),
});

export const getWatchlist = () => readList();

export const setWatchlist = (list) => {
  const next = Array.isArray(list) ? list : [];
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  } catch (e) {
    // Ignore storage failures.
  }
  emitWatchlistUpdate(next);
  return next;
};

export const isInWatchlist = (id) => getWatchlist().some((item) => item.id === id);

export const addToWatchlist = (movie) => {
  const list = getWatchlist();
  if (list.some((item) => item.id === movie.id)) {
    return list;
  }
  const next = [normalizeMovie(movie), ...list];
  return setWatchlist(next);
};

export const removeFromWatchlist = (id) => {
  const list = getWatchlist();
  const next = list.filter((item) => item.id !== id);
  return setWatchlist(next);
};

export const toggleWatchlist = (movie) => {
  if (isInWatchlist(movie.id)) {
    removeFromWatchlist(movie.id);
    return false;
  }
  addToWatchlist(movie);
  return true;
};

export const clearWatchlist = () => setWatchlist([]);
