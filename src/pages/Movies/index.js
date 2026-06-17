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
import { Link } from "react-router-dom";
import useAPIrequest from "../../adapters/useAPIrequest";
import API_BASE_URL from "../../config";
import MovieCard from "../../components/MovieCard";
import useWidnowLocation from "../../hooks/useWidnowLocation";
import Pagination from "./Pagination";
import SortControls from "./SortControls";

const ITEMS_PER_PAGE = 6;
const MAX_PAGES = 3;
const MAX_MOVIES = ITEMS_PER_PAGE * MAX_PAGES;
const MAX_API_PAGES = 20;

const Movies = () => {
  const { title, type, genreFromURL, languageFromURL, languageLabel } = useWidnowLocation();
  const [page, setPage] = useState(1);

  const [quality, setQuality] = useState("all");
  const [genre, setGenre] = useState("all");
  const [orderBy, setOrderBy] = useState("desc");
  const [rating, setRating] = useState(0);

  // Language-specific local pagination
  const [languageMovies, setLanguageMovies] = useState([]);
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(false);

  const sortBy = languageFromURL ? "year" : type;

  const { response } = useAPIrequest(
    languageFromURL
      ? `${API_BASE_URL}/list_movies.json?sort_by=year&limit=1&page=1`
      : `${API_BASE_URL}/list_movies.json?` +
          (genreFromURL ? "" : "sort_by=" + sortBy + "&") +
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (genreFromURL !== null) {
      setGenre(genreFromURL);
    } else {
      setGenre("all");
    }
  }, [genreFromURL]);

  useEffect(() => {
    let isMounted = true;

    const loadLanguageMovies = async (lang) => {
      setIsLoadingLanguage(true);
      setPage(1);
      let collected = [];
      const seenIds = new Set();
      let apiPage = 1;
      let hasMore = true;

      while (collected.length < MAX_MOVIES && apiPage <= MAX_API_PAGES) {
        try {
          const res = await fetch(
            `${API_BASE_URL}/list_movies.json?sort_by=year&limit=50&page=${apiPage}`
          );

          if (!res.ok) {
            break;
          }

          const data = await res.json();
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
          console.error("Movies language fetch error:", e);
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
    }

    return () => {
      isMounted = false;
    };
  }, [languageFromURL]);

  useEffect(() => {
    if (languageFromURL) {
      setIsLoading(false);
    } else if (response && response !== null) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [response, languageFromURL]);

  useEffect(() => {
    if (!languageFromURL) {
      setIsLoading(true);
    }
  }, [quality, genre, orderBy, rating, type, languageFromURL]);

  return (
    <VStack
      spacing={6}
      p={{ base: 3, md: 6 }}
      bg={useColorModeValue("gray.300", "gray.700")}
      rounded="xl"
      mb={6}
    >
      <HStack alignSelf="start" w="full">
        <Heading as="h1" fontSize="3xl">
          {title}
        </Heading>
        <Spacer />
        <Button as={Link} to="/" size="sm">
          Back to Home
        </Button>
      </HStack>
      <Divider />
      <SortControls
        displayGenre={!genreFromURL}
        rating={rating}
        setQuality={setQuality}
        setGenre={setGenre}
        setOrderBy={setOrderBy}
        setRating={setRating}
      />
      <SimpleGrid
        w="full"
        columns={{ base: 1, xs: 2, sm: 3, lg: 4 }}
        spacing={{ base: 3, md: 6 }}
      >
        {(languageFromURL
          ? languageMovies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
          : (response && response.data.movies) || []
        ).map((val, key) => {
          return (
            <GridItem key={key}>
              <MovieCard
                img={val["medium_cover_image"]}
                title={val["title_english"]}
                year={val["year"]}
                isLoading={languageFromURL ? isLoadingLanguage : isLoading}
                rating={val["rating"]}
                id={val["id"]}
              />
            </GridItem>
          );
        })}
        {(languageFromURL ? isLoadingLanguage : isLoading) && (
          <GridItem as={Center} colSpan={{ xs: 2, sm: 3, xl: 4 }}>
            <Spinner />
          </GridItem>
        )}
      </SimpleGrid>
      {(languageFromURL ? languageMovies.length > 0 : response) && (
        <Pagination
          setPage={setPage}
          setIsLoading={setIsLoading}
          page={page}
          limit={languageFromURL ? ITEMS_PER_PAGE : response.data.limit}
          movie_count={languageFromURL ? languageMovies.length : response.data["movie_count"]}
        />
      )}
      {languageFromURL && !isLoadingLanguage && languageMovies.length === 0 && (
        <Center w="full" py={10} color="gray.500">
          No {languageLabel || "language"} movies found in the first {MAX_PAGES} pages.
        </Center>
      )}
    </VStack>
  );
};

export default Movies;
