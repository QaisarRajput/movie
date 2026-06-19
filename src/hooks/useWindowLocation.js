import { useLocation } from "react-router-dom";
import toProperCase from "./../functions/toProperCase";

const useWindowLocation = () => {
  const location = useLocation();
  let title = "";
  let type = "";
  let genreFromURL = null;

  if (location.pathname === "/movies/new") {
    title = "New Releases";
    type = "year";
    genreFromURL = null;
  } else if (location.pathname === "/movies/rating") {
    title = "Top Rated";
    type = "rating";
    genreFromURL = null;
  } else if (location.pathname === "/movies/likes") {
    title = "Top Likes";
    type = "like_count";
    genreFromURL = null;
  } else if (location.pathname === "/movies/downloads") {
    title = "Top Downloads";
    type = "download_count";
    genreFromURL = null;
  } else if (location.pathname === "/movies/recent") {
    title = "Recently Added";
    type = "date_added";
    genreFromURL = null;
  } else if (location.pathname.startsWith("/movies/language/")) {
    const parts = location.pathname.split("/").filter(Boolean);
    const languageSegment = parts[2] || "";
    const languageLabel = toProperCase(languageSegment);
    const languageCode =
      languageSegment === "hindi"
        ? "hi"
        : languageSegment === "french"
        ? "fr"
        : languageSegment;

    title = `${languageLabel} Movies`;
    type = "year";
    genreFromURL = null;

    return {
      title,
      type,
      genreFromURL,
      languageFromURL: languageCode,
      languageLabel,
    };
  } else if (location.pathname === "/movies/all") {
    title = "All Movies";
    type = "date_added";
    genreFromURL = null;
  } else {
    title = toProperCase(location.pathname.split("/").pop()) + " Movies";
    type = "date_added";
    genreFromURL = location.pathname.split("/").pop();
  }

  return { title, type, genreFromURL, languageFromURL: null, languageLabel: "" };
};

export default useWindowLocation;
