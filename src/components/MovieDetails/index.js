import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Image,
  Heading,
  HStack,
  VStack,
  Text,
  Divider,
  Badge,
  Box,
  useColorModeValue,
  Wrap,
  Center,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import useAPIrequest from "../../adapters/useAPIrequest";
import API_BASE_URL from "../../config";
import { IoTime } from "react-icons/io5";
import { AiFillLike, AiFillStar } from "react-icons/ai";
import { FaDownload, FaLanguage } from "react-icons/fa";
import Trailer from "./Trailer";
import SuggestedMovies from "./SuggestedMovies";
import MagnetUrl from "./MagnetUrl";
// import Watch from "./Watch";

const MovieDetails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const location = useLocation();
  const history = useHistory();

  const query = new URLSearchParams(location.search);
  const searchMovieId = query.get("movie_id");
  const pathMovieIdMatch = location.pathname.match(/^\/movie\/(\d+)/);
  const id = searchMovieId || (pathMovieIdMatch ? pathMovieIdMatch[1] : null);

  useEffect(() => {
    if (id) {
      onOpen();
    }
  }, [query, id, onOpen]);

  const handleClose = () => {
    history.replace({
      pathname: "/",
      search: "",
    });
    onClose();
  };

  const { response } = useAPIrequest(
    `${API_BASE_URL}/movie_details.json?movie_id=${id}`,
  );

  const starColor = useColorModeValue("green.500", "green.200");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (response && response !== null) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [response]);

  useEffect(() => {
    setIsLoading(true);
  }, [id]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://movie.hubs.dpdns.org";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalOverlay />
      <ModalContent mx={6}>
        <ModalHeader pb={6} />
        <ModalCloseButton />
        <ModalBody pb={3}>
          {response && (
            <>
              <Helmet>
                <title>{response.data.movie["title_long"]} | Movie Download Online</title>
                <meta
                  name="description"
                  content={
                    response.data.movie["description_full"] ||
                    response.data.movie["summary_long"] ||
                    "Download movies with magnet links from Movie Download Online."
                  }
                />
                <meta property="og:title" content={response.data.movie["title_long"]} />
                <meta
                  property="og:description"
                  content={
                    response.data.movie["description_full"] ||
                    response.data.movie["summary_long"] ||
                    "Download movies with magnet links from Movie Download Online."
                  }
                />
                <meta
                  property="og:image"
                  content={
                    response.data.movie["large_cover_image"] ||
                    response.data.movie["medium_cover_image"]
                  }
                />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:type" content="video.movie" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={response.data.movie["title_long"]} />
                <meta
                  name="twitter:description"
                  content={
                    response.data.movie["description_full"] ||
                    response.data.movie["summary_long"] ||
                    "Download movies with magnet links from Movie Download Online."
                  }
                />
                <meta
                  name="twitter:image"
                  content={
                    response.data.movie["large_cover_image"] ||
                    response.data.movie["medium_cover_image"]
                  }
                />
              </Helmet>
              <VStack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                w="full"
                align="start"
                spacing={6}
              >
                <Image
                  width={{ base: "100%", sm: "200px" }}
                  rounded="md"
                  src={response.data.movie["large_cover_image"]}
                ></Image>
                <VStack spacing={3} w="full" align="start">
                  <Heading as="h1" align="left">
                    {response.data.movie["title_long"]}
                  </Heading>
                  <Divider />
                  <Wrap spacing={3} wrap="wrap" justify="flex-start" w="full">
                    {response.data.movie["genres"].map((val, key) => {
                      return <Badge key={key}>{val}</Badge>;
                    })}
                  </Wrap>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={AiFillStar} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["rating"] > 0
                        ? response.data.movie["rating"].toFixed(1) + " / 10"
                        : "No rating"}
                    </Text>
                  </HStack>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={AiFillLike} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["like_count"] > 0
                        ? response.data.movie["like_count"].toLocaleString()
                        : "No Likes"}
                    </Text>
                  </HStack>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={FaDownload} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["download_count"] > 0
                        ? response.data.movie["download_count"].toLocaleString()
                        : "No Downloads"}
                    </Text>
                  </HStack>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={FaLanguage} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["language"] !== ""
                        ? response.data.movie["language"].toUpperCase()
                        : "Unknown"}
                    </Text>
                  </HStack>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={IoTime} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["runtime"] > 0
                        ? response.data.movie["runtime"] + " Minutes"
                        : "Unknown"}
                    </Text>
                  </HStack>
                </VStack>
              </Stack>
              {response.data.movie["yt_trailer_code"] !== "" && (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Trailer
                  </Heading>
                  <Trailer ytID={response.data.movie["yt_trailer_code"]} />
                </>
              )}
              
              {/* <Watch torrents={response.data.movie.torrents} /> */}
              
              <Divider />
              <Heading as="h3" fontSize="lg" align="left" w="full">
                Magnet Links
              </Heading>
              <Wrap spacing={3} wrap="wrap" align="start" w="full">
                  <MagnetUrl torrents={response.data.movie.torrents} movie={response.data.movie["title_long"]}/>
              </Wrap>
              <Divider />
              <Heading as="h3" fontSize="lg" align="left" w="full">
                Torrents
              </Heading>
              <Wrap spacing={3} wrap="wrap" align="start" w="full">
                {response.data.movie["torrents"] &&
                  response.data.movie["torrents"].map((val, key) => {
                    return (
                      <Button
                        as="a"
                        href={val.url}
                        colorScheme="green"
                        leftIcon={<FaDownload />}
                        key={key}
                      >
                        {val.quality}.{val.type} ({val.size})
                      </Button>
                    );
                  })}
              </Wrap>
              <Divider />
              {response.data.movie["description_full"] && (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Description
                  </Heading>
                  <Text align="left" w="full">
                    {response.data.movie["description_full"]}
                  </Text>
                </>
              )}
              <Heading as="h3" fontSize="lg" align="left" w="full">
                Suggested Movies
              </Heading>
              <SuggestedMovies id={id} />
            </VStack>
            </>
          )}
          {isLoading && (
            <Center w="full" pb={3}>
              <Spinner />
            </Center>
          )}
          
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MovieDetails;
