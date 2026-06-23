import { GridItem, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getHistory } from "../../../functions/history";
import MovieCard from "../../../components/MovieCard";

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
      <SimpleGrid columns={{ base: 2, xs: 2, sm: 3 }} spacing={6} w="full">
        {movies.map((movie) => (
          <GridItem key={movie.id}>
            <MovieCard
              id={movie.id}
              img={movie.medium_cover_image}
              title={movie.title}
              year={movie.year}
              slug={movie.slug}
              rating={movie.rating}
              isLoading={false}
              maxCardW={{ base: "148px", sm: "180px", md: "220px" }}
            />
          </GridItem>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default RecentlyViewed;
