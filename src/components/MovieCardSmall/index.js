import {
  AspectRatio,
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
  WATCHLIST_EVENT,
  isInWatchlist,
  toggleWatchlist as toggleWatchlistItem,
} from "../../functions/watchlist";
import { getMoviePathFromParts } from "../../functions/movieUrl";

const MovieCard = ({ img, title, year, rating, isLoading, aspect, id, slug }) => {
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading === true) {
      setImageIsLoading(true);
    }
  }, [isLoading]);

  useEffect(() => {
    const syncState = () => setIsSaved(isInWatchlist(id));
    syncState();

    window.addEventListener(WATCHLIST_EVENT, syncState);
    window.addEventListener("storage", syncState);

    return () => {
      window.removeEventListener(WATCHLIST_EVENT, syncState);
      window.removeEventListener("storage", syncState);
    };
  }, [id]);

  const handleToggleWatchlist = (event) => {
    event.stopPropagation();
    const saved = toggleWatchlistItem({ id, title, year, rating, poster: img, slug });
    setIsSaved(saved);
  };

  return (
    <VStack
      cursor="pointer"
      onClick={() => navigate(getMoviePathFromParts({ id, title, year, slug }))}
      align="start"
      _hover={{ transform: "scale(1.05)" }}
      transition=".25s ease-in-out"
      maxW="220px"
      pos="relative"
    >
      <Skeleton rounded="lg" w="full" isLoaded={!isLoading && !imageIsLoading}>
        <AspectRatio ratio={aspect ? aspect : 2 / 3} w="full" objectFit="cover">
          <Image
            alt={title}
            fit="cover"
            rounded="lg"
            src={img}
            loading="lazy"
            onLoad={() => setImageIsLoading(false)}
          />
        </AspectRatio>
      </Skeleton>
      <IconButton
        position="absolute"
        top={2}
        right={2}
        size="sm"
        icon={isSaved ? <BsBookmarkFill /> : <BsBookmark />}
        aria-label={isSaved ? "Remove from watchlist" : "Add to watchlist"}
        colorScheme={isSaved ? "orange" : "green"}
        onClick={handleToggleWatchlist}
      />
      <Skeleton maxW="full" isLoaded={!isLoading}>
        <Heading maxW="full" as="h3" fontSize="xs" isTruncated title={title}>
          {title}
        </Heading>
      </Skeleton>
      <Skeleton width="min" isLoaded={!isLoading}>
        <HStack width="full" align="center" fontSize="xs">
          {year > 0 && <Text>{year}</Text>}
          <Box
            as={AiFillStar}
            fontSize="10px"
            color={useColorModeValue("green.500", "green.200")}
          />
          <Text
            whiteSpace="nowrap"
            display="flex"
            dir="row"
            fontWeight="semibold"
            fontSize="xs"
          >
            {rating > 0 ? rating.toFixed(1) + " / 10" : "No rating"}
          </Text>
        </HStack>
      </Skeleton>
    </VStack>
  );
};

export default React.memo(MovieCard);
