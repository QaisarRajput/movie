import {
  Box,
  Button,
  Center,
  GridItem,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
//import NewRelease from "./NewRelease";
import RecentlyAdded from "./RecentlyAdded";
import RecentlyViewed from "./RecentlyViewed";
import TopMovies from "./TopMovies";
import TopMoviesLanguage from "./TopMoviesLanguage";


const Home = () => {
  const canonicalHref =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "https://movie.hubs.dpdns.org/";

  return (
    <>
      <Helmet>
        <title>Movie Download Online - Discover and Download Movies</title>
        <meta
          name="description"
          content="Discover top-rated and recently added movies with torrent and magnet links, watch providers, and rich filtering."
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonicalHref} />
        <meta property="og:title" content="Movie Download Online - Discover and Download Movies" />
        <meta
          property="og:description"
          content="Browse popular movies, explore categories, and open movie details with torrents, trailers, and watch providers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalHref} />
      </Helmet>
      <SimpleGrid columns={4} row={1} spacing={6} pb={{ base: 0, md: 6 }}>
      <GridItem colSpan={1} display={{ base: "none", lg: "block" }}>
        <RecentlyAdded />
      </GridItem>
      <GridItem
        colSpan={{ base: 4, lg: 3 }}
        bg={useColorModeValue("gray.300", "gray.700")}
        p={{ base: 3, md: 6 }}
        rounded="xl"
      >

        {//<NewRelease /> 
        }
        <Box display={{ base: "block", lg: "none" }}>
          <RecentlyAdded />
        </Box>
        <TopMovies type="download_count" />
        <RecentlyViewed />
        <TopMoviesLanguage language="hi" />
        <TopMoviesLanguage language="fr" />
        {
        //<TopMovies type="like_count" />
        //<TopMovies type="download_count" />
        }
        <Center w="full">
          <Button as={Link} to="/movies/all" colorScheme="green">
            Discover More Movies
          </Button>
        </Center>
      </GridItem>
      </SimpleGrid>
    </>
  );
};

export default Home;
