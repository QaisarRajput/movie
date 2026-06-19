import {
  AspectRatio,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Select,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  WATCHLIST_EVENT,
  clearWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../../functions/watchlist";
import { getMoviePathFromParts } from "../../functions/movieUrl";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const bgColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const loadWatchlist = () => setWatchlist(getWatchlist());
    loadWatchlist();

    window.addEventListener(WATCHLIST_EVENT, loadWatchlist);
    window.addEventListener("storage", loadWatchlist);

    return () => {
      window.removeEventListener(WATCHLIST_EVENT, loadWatchlist);
      window.removeEventListener("storage", loadWatchlist);
    };
  }, []);

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "year") return (b.year || 0) - (a.year || 0);
    if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
    return (b.addedAt || 0) - (a.addedAt || 0);
  });

  return (
    <VStack spacing={6} align="stretch" py={6}>
      <Heading as="h1" fontSize="3xl">
        Watchlist
      </Heading>
      <HStack justify="space-between" wrap="wrap" spacing={3}>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          maxW={{ base: "full", sm: "220px" }}
          variant="filled"
          size="sm"
        >
          <option value="recent">Sort: Recently Added</option>
          <option value="rating">Sort: Rating</option>
          <option value="year">Sort: Year</option>
          <option value="title">Sort: Title</option>
        </Select>
        {watchlist.length > 0 ? (
          <Button size="sm" variant="outline" colorScheme="red" onClick={clearWatchlist}>
            Remove All
          </Button>
        ) : null}
      </HStack>
      {watchlist.length === 0 ? (
        <Center py={16} bg={bgColor} rounded="xl">
          <VStack spacing={4}>
            <Text color="gray.500">Your watchlist is empty.</Text>
            <Button as={Link} to="/movies/" colorScheme="green">
              Browse Movies
            </Button>
          </VStack>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {sortedWatchlist.map((item) => (
            <Box
              key={item.id}
              p={4}
              rounded="xl"
              bg={bgColor}
            >
              {(item.poster || item.medium_cover_image || item.large_cover_image) ? (
                <AspectRatio ratio={2 / 3} mb={3} w="full">
                  <Image
                    src={item.poster || item.medium_cover_image || item.large_cover_image}
                    alt={item.title || "Saved movie"}
                    rounded="md"
                    objectFit="cover"
                    loading="lazy"
                  />
                </AspectRatio>
              ) : null}
              <Heading as="h3" fontSize="lg" mb={2}>
                {item.title || "Untitled movie"}
              </Heading>
              <Text mb={2}>Year: {item.year || "Unknown"}</Text>
              <Text mb={2}>
                Rating: {typeof item.rating === "number" ? `${item.rating.toFixed(1)} / 10` : "N/A"}
              </Text>
              <HStack spacing={2}>
                <Button
                  as={Link}
                  to={getMoviePathFromParts({
                    id: item.id,
                    title: item.title,
                    year: item.year,
                    slug: item.slug,
                  })}
                  colorScheme="green"
                  size="sm"
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  onClick={() => removeFromWatchlist(item.id)}
                >
                  Remove
                </Button>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default Watchlist;