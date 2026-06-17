import {
  AspectRatio,
  Box,
  Heading,
  HStack,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useHistory } from "react-router-dom";

const MovieCard = ({ img, title, year, rating, isLoading, aspect, id }) => {
  const [imageIsLoading, setImageIsLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    if (isLoading === true) {
      setImageIsLoading(true);
    }
  }, [isLoading]);

  return (
    <VStack
      cursor="pointer"
      onClick={() => history.push(`/movie/${id}`)}
      align="start"
      _hover={{ transform: "scale(1.05)" }}
      transition=".25s ease-in-out"
      maxW="200px"
    >
      <Skeleton rounded="lg" w="full" isLoaded={!isLoading && !imageIsLoading}>
        <AspectRatio ratio={aspect ? aspect : 2 / 3} w="full" objectFit="cover">
          <Image
            alt={title}
            fit="cover"
            rounded="lg"
            src={img}
            onLoad={() => setImageIsLoading(false)}
          />
        </AspectRatio>
      </Skeleton>
      <Skeleton maxW="full" isLoaded={!isLoading}>
        <Heading maxW="full" as="h3" fontSize="md" isTruncated title={title}>
          {title}
        </Heading>
      </Skeleton>
      <Skeleton width="min" isLoaded={!isLoading}>
        <HStack width="full" align="center">
          {year > 0 && <Text>{year}</Text>}
          <Box
            as={AiFillStar}
            fontSize="20px"
            color={useColorModeValue("green.500", "green.200")}
          />
          <Text
            whiteSpace="nowrap"
            display="flex"
            dir="row"
            fontWeight="semibold"
          >
            {rating > 0 ? rating.toFixed(1) + " / 10" : "No rating"}
          </Text>
        </HStack>
      </Skeleton>
    </VStack>
  );
};

export default MovieCard;
