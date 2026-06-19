import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE,
} from "../config";

export const hasTMDBKey = Boolean(TMDB_API_KEY);

const buildURL = (path, params = {}) => {
  const query = new URLSearchParams({ api_key: TMDB_API_KEY, ...params });
  return `${TMDB_BASE_URL}${path}?${query.toString()}`;
};

const request = async (path, params = {}) => {
  if (!TMDB_API_KEY) return null;

  try {
    const response = await fetch(buildURL(path, params));
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
};

export const findMovieByImdbId = async (imdbId) => {
  if (!imdbId) return null;
  const data = await request(`/find/${imdbId}`, {
    external_source: "imdb_id",
  });
  return data?.movie_results?.[0] || null;
};

export const getMovieDetails = async (tmdbId) => {
  if (!tmdbId) return null;
  return request(`/movie/${tmdbId}`, {
    append_to_response: "credits",
  });
};

export const getWatchProviders = async (tmdbId) => {
  if (!tmdbId) return null;
  const data = await request(`/movie/${tmdbId}/watch/providers`);
  return data?.results || null;
};

export const getPersonExternalIds = async (personId) => {
  if (!personId) return null;
  return request(`/person/${personId}/external_ids`);
};

export const buildTMDBImageURL = (path, size = "w500") => {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};
