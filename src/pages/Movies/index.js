import {
  Heading,
  Divider,
  SimpleGrid,
  GridItem,
  VStack,
  Spacer,
  Button,
  HStack,
  useColorModeValue,
  Center,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAPIrequest from "../../adapters/useAPIrequest";
import API_BASE_URL from "../../config";
import fetchYtsWithMirrors from "../../adapters/fetchYtsWithMirrors";
import MovieCard from "../../components/MovieCard";
import ErrorMessage from "../../components/ErrorMessage";
import useWindowLocation from "../../hooks/useWindowLocation";
import Pagination from "./Pagination";
import SortControls from "./SortControls";

const ITEMS_PER_PAGE = 6;
const MAX_PAGES = 3;
const MAX_MOVIES = ITEMS_PER_PAGE * MAX_PAGES;
const MAX_API_PAGES = 20;

const parseNumberParam = (value, fallback) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(9, Math.max(0, parsed));
};

const Movies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search")?.trim() || "";
  const qualityParam = searchParams.get("quality") || "all";
  const genreParam = searchParams.get("genre") || "all";
  const orderByParam = searchParams.get("order_by") || "desc";
  const ratingParam = parseNumberParam(searchParams.get("rating"), 0);
  const pageParam = Math.max(1, parseNumberParam(searchParams.get("page"), 1));
  const { title, type, genreFromURL, languageFromURL, languageLabel } = useWindowLocation();
  const [page, setPage] = useState(pageParam);

  const [quality, setQuality] = useState(qualityParam);
  const [genre, setGenre] = useState(genreParam);
  const [orderBy, setOrderBy] = useState(orderByParam);
  const [rating, setRating] = useState(ratingParam);

  // Language-specific local pagination
  const [languageMovies, setLanguageMovies] = useState([]);
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(false);
  const [languageError, setLanguageError] = useState(null);

  const sortBy = languageFromURL ? "year" : type;

  const { response, error, loading } = useAPIrequest(
    languageFromURL
      ? `${API_BASE_URL}/list_movies.json?sort_by=year&limit=1&page=1`
      : `${API_BASE_URL}/list_movies.json?` +
          (genreFromURL ? "" : "sort_by=" + sortBy + "&") +
          (searchTerm ? "query_term=" + encodeURIComponent(searchTerm) + "&" : "") +
          "quality=" +
          quality +
          "&genre=" +
          genre +
          "&minimum_rating=" +
          rating +
          "&order_by=" +
          orderBy +
          "&page=" +
          page,
  );

  useEffect(() => {
    if (genreFromURL) {
      setGenre(genreFromURL);
    } else {
      setGenre(genreParam);
    }
  }, [genreFromURL, genreParam]);

  useEffect(() => {
    setQuality(qualityParam);
    setOrderBy(orderByParam);
    setRating(ratingParam);
    setPage(pageParam);
  }, [qualityParam, orderByParam, ratingParam, pageParam]);

  useEffect(() => {
    const nextParams = new URLSearchParams(location.search);

    if (quality !== "all") nextParams.set("quality", quality);
    else nextParams.delete("quality");

    if (!genreFromURL && genre !== "all") nextParams.set("genre", genre);
    else nextParams.delete("genre");

    if (orderBy !== "desc") nextParams.set("order_by", orderBy);
    else nextParams.delete("order_by");

    if (rating > 0) nextParams.set("rating", String(rating));
    else nextParams.delete("rating");

    if (page > 1) nextParams.set("page", String(page));
    else nextParams.delete("page");

    if (searchTerm) nextParams.set("search", searchTerm);

    const current = location.search.startsWith("?") ? location.search.slice(1) : location.search;
    const next = nextParams.toString();

    if (next !== current) {
      navigate(`${location.pathname}${next ? `?${next}` : ""}`, { replace: true });
    }
  }, [
    genre,
    genreFromURL,
    location.pathname,
    location.search,
    navigate,
    orderBy,
    page,
    quality,
    rating,
    searchTerm,
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadLanguageMovies = async (lang) => {
      setIsLoadingLanguage(true);
      setLanguageError(null);
      setPage(1);
      let collected = [];
      const seenIds = new Set();
      let apiPage = 1;

      while (collected.length < MAX_MOVIES && apiPage <= MAX_API_PAGES) {
        try {
          const data = await fetchYtsWithMirrors(
            `/list_movies.json?sort_by=year&limit=50&page=${apiPage}`
          );
          const pageMovies = data?.data?.movies ?? [];

          const filtered = pageMovies.filter(
            (m) => m.language === lang && !seenIds.has(m.id)
          );

          filtered.forEach((m) => {
            seenIds.add(m.id);
            collected.push(m);
          });

          apiPage += 1;
        } catch (e) {
          setLanguageError(e);
          break;
        }
      }

      if (!isMounted) return;
      setLanguageMovies(collected.slice(0, MAX_MOVIES));
      setIsLoadingLanguage(false);
    };

    if (languageFromURL) {
      loadLanguageMovies(languageFromURL);
    } else {
      setLanguageMovies([]);
      setIsLoadingLanguage(false);
      setLanguageError(null);
    }

    return () => {
      isMounted = false;
    };
  }, [languageFromURL]);

  const hasError = languageFromURL
    ? Boolean(languageError)
    : Boolean(error) || (Boolean(response) && response.status !== "ok");

  const isLoading = languageFromURL ? isLoadingLanguage : loading;
  const moviesList = languageFromURL
    ? languageMovies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    : response?.data?.movies || [];
  const hasMovies = moviesList.length > 0;
  const canonicalHref =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "https://movie.hubs.dpdns.org/movies/all";
  const pageTitle = searchTerm
    ? `Search Results: ${searchTerm} | Movie Download Online`
    : `${title} | Movie Download Online`;
  const pageDescription = searchTerm
    ? `Search movie results for ${searchTerm}. Filter by quality, genre, and rating.`
    : `Browse ${title.toLowerCase()} with filters for quality, genre, and minimum rating.`;

  const handleQualityChange = (nextQuality) => {
    setPage(1);
    setQuality(nextQuality);
  };

  const handleGenreChange = (nextGenre) => {
    setPage(1);
    setGenre(nextGenre);
  };

  const handleOrderByChange = (nextOrderBy) => {
    setPage(1);
    setOrderBy(nextOrderBy);
  };

  const handleRatingChange = (nextRating) => {
    setPage(1);
    setRating(nextRating);
  };

  return (
    <VStack
      spacing={6}
      p={{ base: 3, md: 6 }}
      bg={useColorModeValue("gray.300", "gray.700")}
      rounded="xl"
      mb={6}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonicalHref} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalHref} />
      </Helmet>
      <HStack alignSelf="start" w="full">
        <Heading as="h1" fontSize="3xl">
          {searchTerm ? `Search Results: ${searchTerm}` : title}
        </Heading>
        <Spacer />
        <Button as={Link} to="/" size="sm">
          Back to Home
        </Button>
      </HStack>
      <Divider />
      <SortControls
        displayGenre={!genreFromURL}
        quality={quality}
        genre={genre}
        orderBy={orderBy}
        rating={rating}
        setQuality={handleQualityChange}
        setGenre={handleGenreChange}
        setOrderBy={handleOrderByChange}
        setRating={handleRatingChange}
      />
      {hasError ? (
        <ErrorMessage
          title={languageFromURL ? "Language movies are unavailable" : "Could not load movies"}
        />
      ) : null}
      <SimpleGrid
        w="full"
        columns={{ base: 1, xs: 2, sm: 3, lg: 4 }}
        spacing={{ base: 3, md: 6 }}
      >
        {!hasError &&
          moviesList.map((val, key) => {
            return (
              <GridItem key={key}>
                <MovieCard
                  img={val["medium_cover_image"]}
                  title={val["title_english"]}
                  year={val["year"]}
                  slug={val["slug"]}
                  isLoading={isLoading}
                  rating={val["rating"]}
                  id={val["id"]}
                />
              </GridItem>
            );
          })}
        {isLoading && (
          <GridItem as={Center} colSpan={{ xs: 2, sm: 3, xl: 4 }}>
            <Spinner />
          </GridItem>
        )}
      </SimpleGrid>
      {!hasError &&
        (languageFromURL ? languageMovies.length > 0 : response?.data?.movie_count > 0) && (
        <Pagination
          setPage={setPage}
          page={page}
          limit={languageFromURL ? ITEMS_PER_PAGE : response?.data?.limit || 20}
          movie_count={languageFromURL ? languageMovies.length : response?.data?.movie_count || 0}
        />
      )}
      {!hasError && !isLoading && !hasMovies && !languageFromURL && (
        <Center w="full" py={10} color="gray.500">
          No movies found for this filter combination.
        </Center>
      )}
      {languageFromURL && !isLoadingLanguage && languageMovies.length === 0 && (
        <Center w="full" py={10} color="gray.500">
          No {languageLabel || "language"} movies found in the scanned catalog window.
        </Center>
      )}
    </VStack>
  );
};

export default Movies;
