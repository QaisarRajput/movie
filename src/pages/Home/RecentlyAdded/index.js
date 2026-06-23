import {
  GridItem,
  Heading,
  Button,
  VStack,
  Box,
  Center,
  Spinner,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import MovieCard from "../../../components/MovieCard";
import ErrorMessage from "../../../components/ErrorMessage";
import useAPIrequest from "../../../adapters/useAPIrequest";
import API_BASE_URL from "../../../config";
import { Link } from "react-router-dom";

const RecentlyAdded = () => {
  const { response, error, loading } = useAPIrequest(
    `${API_BASE_URL}/list_movies.json?sort_by=date_added`,
  );

  return (
    <VStack spacing={6} align="start" py={6}>
      <Stack
        w="full"
        spacing={{ base: 3, lg: 6 }}
        direction={{ base: "column", lg: "column" }}
        align={{ base: "start", sm: "start" }}
      >
        <Heading
          textTransform="uppercase"
          as="h4"
          fontSize={{ base: "lg", lg: "md" }}
        >
          Recently Added
        </Heading>
        <Box as="hr" w="full" />
      </Stack>
      {error ? <ErrorMessage title="Recently added is unavailable" /> : null}
      <SimpleGrid columns={{ base: 2, xs: 2, sm: 3 }} spacing={6} w="full">
        {response &&
          response.data.movies.slice(0, 6).map((val, key) => {
            return (
              <GridItem key={key} w="full">
                <MovieCard
                  img={val["medium_cover_image"]}
                  title={val["title_english"]}
                  year={val["year"]}
                  slug={val["slug"]}
                  isLoading={loading}
                  rating={val["rating"]}
                  id={val["id"]}
                  maxCardW={{ base: "148px", sm: "180px", md: "220px" }}
                />
              </GridItem>
            );
          })}
      </SimpleGrid>
      {response && (
        <Button as={Link} to="/movies/recent" w="full" colorScheme="green">
          View More
        </Button>
      )}
      {loading && (
        <Center w="full">
          <Spinner />
        </Center>
      )}
    </VStack>
  );
};

export default RecentlyAdded;
