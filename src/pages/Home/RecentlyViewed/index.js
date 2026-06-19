import { GridItem, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getHistory } from "../../../functions/history";
import MovieCardSmall from "../../../components/MovieCardSmall";

const RecentlyViewed = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(getHistory().slice(0, 6));
  }, []);

  if (movies.length === 0) {
    return null;
  }

  return (
    <VStack spacing={4} align="start" py={6} w="full">
      <Heading as="h2" fontSize="lg">
        Recently Viewed
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} w="full">
        {movies.map((movie) => (
          <GridItem key={movie.id}>
            <MovieCardSmall
              id={movie.id}
              img={movie.medium_cover_image}
              title={movie.title}
              year={movie.year}
              slug={movie.slug}
              rating={movie.rating}
              isLoading={false}
            />
          </GridItem>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default RecentlyViewed;
