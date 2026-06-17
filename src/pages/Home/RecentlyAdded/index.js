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
import React, { useEffect, useState } from "react";
import MovieCardSmall from "../../../components/MovieCardSmall";
import useAPIrequest from "../../../adapters/useAPIrequest";
import API_BASE_URL from "../../../config";
import { Link } from "react-router-dom";

const RecentlyAdded = () => {
  const { response } = useAPIrequest(
    `${API_BASE_URL}/list_movies.json?sort_by=date_added`,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (response && response !== null) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [response]);

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
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
        {response &&
          response.data.movies.slice(0, 16).map((val, key) => {
            return (
              <GridItem key={key} w="full">
                <MovieCardSmall
                  img={val["medium_cover_image"]}
                  
                  title={val["title_english"]}
                  year={val["year"]}
                  isLoading={isLoading}
                  rating={val["rating"]}
                  id={val["id"]}
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
      {isLoading && (
        <Center w="full">
          <Spinner />
        </Center>
      )}
    </VStack>
  );
};

export default RecentlyAdded;
