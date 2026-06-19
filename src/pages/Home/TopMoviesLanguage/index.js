import React, { useEffect, useMemo, useState } from "react";
import MovieCard from "../../../components/MovieCard";
import ErrorMessage from "../../../components/ErrorMessage";
import TopMoviesHeader from "./TopMoviesHeader";
import fetchYtsWithMirrors from "../../../adapters/fetchYtsWithMirrors";
import { Center, GridItem, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";

const ITEMS_PER_PAGE = 6;
const MAX_PAGES = 3;
const MAX_MOVIES = ITEMS_PER_PAGE * MAX_PAGES;
const MAX_API_PAGES = 20;

const TopMoviesLanguage = ({ language }) => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadLanguageMovies = async () => {
      setIsLoading(true);
      setError(null);
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

          const filteredMovies = pageMovies.filter(
            (movie) => movie.language === language && !seenIds.has(movie.id)
          );

          filteredMovies.forEach((movie) => {
            seenIds.add(movie.id);
            collected.push(movie);
          });

          apiPage += 1;
        } catch (error) {
          setError(error);
          break;
        }
      }

      if (!isMounted) return;
      setMovies(collected.slice(0, MAX_MOVIES));
      setIsLoading(false);
    };

    loadLanguageMovies();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const totalPages = useMemo(
    () => Math.max(1, Math.min(MAX_PAGES, Math.ceil(movies.length / ITEMS_PER_PAGE))),
    [movies.length]
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleMovies = useMemo(
    () => movies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [movies, page]
  );

  return (
    <VStack py={6}>
      <TopMoviesHeader
        setPage={setPage}
        page={page}
        maxPage={totalPages}
        language={language}
      />
      {error ? <ErrorMessage title="Language movies are unavailable" /> : null}
      {!isLoading ? (
        <Text fontSize="sm" color="gray.500" alignSelf="start">
          Showing best matches from the first {MAX_API_PAGES} result pages.
        </Text>
      ) : null}
      <SimpleGrid
        w="full"
        columns={{ base: 1, xs: 2, sm: 3 }}
        row={2}
        spacing={6}
      >
        {visibleMovies.map((val, key) => (
          <GridItem key={key}>
            <MovieCard
              img={val.medium_cover_image}
              title={val.title_english}
              year={val.year}
              slug={val.slug}
              isLoading={isLoading}
              rating={val.rating}
              id={val.id}
            />
          </GridItem>
        ))}
        {isLoading && (
          <GridItem as={Center} colSpan={3}>
            <Spinner />
          </GridItem>
        )}
        {!isLoading && movies.length === 0 ? (
          <GridItem as={Center} colSpan={3} color="gray.500" py={8}>
            No movies found for this language in the scanned catalog window.
          </GridItem>
        ) : null}
      </SimpleGrid>
    </VStack>
  );
};

export default TopMoviesLanguage;
