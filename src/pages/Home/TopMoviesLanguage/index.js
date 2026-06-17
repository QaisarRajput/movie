import React, { useEffect, useMemo, useState } from "react";
import MovieCard from "../../../components/MovieCard";
import TopMoviesHeader from "./TopMoviesHeader";
import API_BASE_URL from "../../../config";
import { Center, GridItem, SimpleGrid, Spinner, VStack } from "@chakra-ui/react";

const ITEMS_PER_PAGE = 6;
const MAX_PAGES = 3;
const MAX_MOVIES = ITEMS_PER_PAGE * MAX_PAGES;
const MAX_API_PAGES = 20;

const TopMoviesLanguage = ({ language }) => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadLanguageMovies = async () => {
      setIsLoading(true);
      setPage(1);

      let collected = [];
      const seenIds = new Set();
      let apiPage = 1;

      while (collected.length < MAX_MOVIES && apiPage <= MAX_API_PAGES) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/list_movies.json?sort_by=year&limit=50&page=${apiPage}`
          );

          if (!response.ok) {
            break;
          }

          const data = await response.json();
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
          console.error("TopMoviesLanguage fetch error:", error);
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
      </SimpleGrid>
    </VStack>
  );
};

export default TopMoviesLanguage;
