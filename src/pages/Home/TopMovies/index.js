import {
  Center,
  GridItem,
  SimpleGrid,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import MovieCard from "../../../components/MovieCard";
import ErrorMessage from "../../../components/ErrorMessage";
import TopMoviesHeader from "./TopMoviesHeader";
import useAPIrequest from "../../../adapters/useAPIrequest";
import API_BASE_URL from "../../../config";

const TopMovies = ({ type }) => {
  const [page, setPage] = useState(1);

  const { response, error, loading } = useAPIrequest(
    `${API_BASE_URL}/list_movies.json?sort_by=${type}&limit=6&page=${page}`,
  );

  return (
    <VStack py={6}>
      <TopMoviesHeader
        setPage={setPage}
        page={page}
        setIsLoading={() => {}}
        type={type}
      />
      {error ? (
        <ErrorMessage title="Top movies are unavailable" />
      ) : null}
      <SimpleGrid
        w="full"
        columns={{ base: 1, xs: 2, sm: 3 }}
        row={2}
        spacing={6}
      >
        {response &&
          response.data.movies.map((val, key) => {
            return (
              <GridItem key={key}>
                <MovieCard
                  img={val["medium_cover_image"]}
                  title={val["title_english"]}
                  year={val["year"]}
                  slug={val["slug"]}
                  isLoading={loading}
                  rating={val["rating"]}
                  id={val["id"]}
                />
              </GridItem>
            );
          })}
        {loading && (
          <GridItem as={Center} colSpan={3}>
            <Spinner />
          </GridItem>
        )}
      </SimpleGrid>
    </VStack>
  );
};

export default TopMovies;
