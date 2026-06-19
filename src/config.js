export const YTS_API_MIRRORS = [
	"https://yts.gg/api/v2",
	"https://yts.lt/api/v2",
];

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
export const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || "e3bb103ebc9b65e27f05ca7dd79c3bc0";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || YTS_API_MIRRORS[0];

export default API_BASE_URL;
