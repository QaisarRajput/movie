import { Center, GridItem, SimpleGrid, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useAPIrequest from "../../../adapters/useAPIrequest";
import API_BASE_URL from "../../../config";
import ErrorMessage from "../../ErrorMessage";
import MovieCard from "./../../MovieCard";

const SuggestedMovies = ({ id }) => {
  const { response, error, loading } = useAPIrequest(
    `${API_BASE_URL}/movie_suggestions.json?movie_id=${id}`,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else if (response && response !== null) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [loading, response]);

  useEffect(() => {
    setIsLoading(true);
  }, [id]);

  return (
    <SimpleGrid columns={{ base: 1, xs: 2, md: 4 }} w="full" spacing={3}>
      {error ? <ErrorMessage title="Suggested movies are unavailable" /> : null}
      {response &&
        response.data.movies.map((val, key) => {
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
      {loading ? (
        <GridItem as={Center} colSpan={{ base: 1, xs: 2, md: 4 }}>
          <Spinner />
        </GridItem>
      ) : null}
    </SimpleGrid>
  );
};

export default React.memo(SuggestedMovies);
