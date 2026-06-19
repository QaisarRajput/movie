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
  WrapItem,
  Center,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import useAPIrequest from "../../adapters/useAPIrequest";
import API_BASE_URL from "../../config";
import { IoTime } from "react-icons/io5";
import { AiFillLike, AiFillStar } from "react-icons/ai";
import {
  FaDownload,
  FaLanguage,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import Trailer from "./Trailer";
import SuggestedMovies from "./SuggestedMovies";
import MagnetUrl from "./MagnetUrl";
import {
  buildTMDBImageURL,
  findMovieByImdbId,
  getMovieDetails,
  getPersonExternalIds,
  getWatchProviders,
  hasTMDBKey,
} from "../../adapters/tmdb";
import {
  WATCHLIST_EVENT,
  isInWatchlist,
  toggleWatchlist,
} from "../../functions/watchlist";
import { addToHistory } from "../../functions/history";
import { getMovieIdFromPathname } from "../../functions/movieUrl";
// import Watch from "./Watch";

const MovieDetails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const searchMovieId = query.get("movie_id");
  const pathMovieId = getMovieIdFromPathname(location.pathname);
  const id = pathMovieId || searchMovieId;

  useEffect(() => {
    if (id) {
      onOpen();
    }
  }, [id, onOpen]);

  const handleClose = () => {
    navigate("/", { replace: true });
    onClose();
  };

  const { response } = useAPIrequest(
    `${API_BASE_URL}/movie_details.json?movie_id=${id}`,
  );

  const starColor = useColorModeValue("green.500", "green.200");
  const crewCardBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const overlayFrom = useColorModeValue("rgba(255,255,255,0.98)", "rgba(26,32,44,0.96)");
  const overlayTo = useColorModeValue("rgba(255,255,255,0.72)", "rgba(26,32,44,0.68)");
  const iconShadow = useColorModeValue("0 1px 1px rgba(255,255,255,0.65)", "0 1px 2px rgba(0,0,0,0.45)");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [tmdbMovie, setTmdbMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState([]);
  const [personExternalIds, setPersonExternalIds] = useState({});

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

  useEffect(() => {
    if (id) {
      setIsSaved(isInWatchlist(Number(id)));
    }

    const syncState = () => {
      if (id) setIsSaved(isInWatchlist(Number(id)));
    };

    window.addEventListener(WATCHLIST_EVENT, syncState);
    window.addEventListener("storage", syncState);

    return () => {
      window.removeEventListener(WATCHLIST_EVENT, syncState);
      window.removeEventListener("storage", syncState);
    };
  }, [id]);

  useEffect(() => {
    if (response?.data?.movie) {
      addToHistory(response.data.movie);
    }
  }, [response]);

  useEffect(() => {
    let isMounted = true;

    const enrichMovie = async () => {
      const movie = response?.data?.movie;
      if (!movie?.imdb_code) {
        if (!isMounted) return;
        setTmdbMovie(null);
        setWatchProviders([]);
        return;
      }

      const found = await findMovieByImdbId(movie.imdb_code);
      if (!isMounted) return;

      if (hasTMDBKey && found?.id) {
        const [details, providers] = await Promise.all([
          getMovieDetails(found.id),
          getWatchProviders(found.id),
        ]);

        if (!isMounted) return;

        setTmdbMovie(details || null);

        const byCountry = providers?.US || providers?.IN || null;
        setWatchProviders(byCountry?.flatrate || byCountry?.rent || byCountry?.buy || []);
      } else {
        setTmdbMovie(null);
        setWatchProviders([]);
      }
    };

    enrichMovie();

    return () => {
      isMounted = false;
    };
  }, [response]);

  useEffect(() => {
    let isMounted = true;

    const loadPersonExternalIds = async () => {
      if (!tmdbMovie?.credits) {
        if (isMounted) setPersonExternalIds({});
        return;
      }

      const topCast = (tmdbMovie.credits.cast || []).slice(0, 8);
      const topDirectors = (tmdbMovie.credits.crew || [])
        .filter((person) => person.job === "Director")
        .slice(0, 4);

      const uniquePeople = [
        ...new Map(
          [...topCast, ...topDirectors]
            .filter((person) => person?.id)
            .map((person) => [person.id, person]),
        ).values(),
      ];

      if (!uniquePeople.length) {
        if (isMounted) setPersonExternalIds({});
        return;
      }

      const records = await Promise.all(
        uniquePeople.map(async (person) => {
          const ids = await getPersonExternalIds(person.id);
          return [person.id, ids];
        }),
      );

      if (!isMounted) return;

      const nextExternalIds = {};
      records.forEach(([personId, ids]) => {
        if (ids) {
          nextExternalIds[personId] = ids;
        }
      });

      setPersonExternalIds(nextExternalIds);
    };

    loadPersonExternalIds();

    return () => {
      isMounted = false;
    };
  }, [tmdbMovie]);

  const handleToggleWatchlist = () => {
    if (!response?.data?.movie) return;
    const saved = toggleWatchlist(response.data.movie);
    setIsSaved(saved);
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://movie.hubs.dpdns.org";
  const movie = response?.data?.movie || null;
  const directors =
    tmdbMovie?.credits?.crew
      ?.filter(
        (person, index, arr) =>
          person.job === "Director" && arr.findIndex((p) => p.id === person.id) === index,
      )
      .slice(0, 4) || [];
  const topCast = (tmdbMovie?.credits?.cast || []).slice(0, 8);
  const title = movie?.title_long || movie?.title || "Movie Details";
  const description =
    movie?.description_full ||
    movie?.summary_long ||
    "Browse movie details, torrents, magnet links, trailer, and watch providers.";
  const poster =
    movie?.large_cover_image ||
    movie?.medium_cover_image ||
    "https://movie.hubs.dpdns.org/favicons/android-chrome-512x512.png";

  const getSocialLinks = (personId) => {
    const ids = personExternalIds[personId];
    if (!ids) return [];

    const links = [];
    if (ids.instagram_id) {
      links.push({ key: "instagram", href: `https://instagram.com/${ids.instagram_id}`, icon: FaInstagram, label: "Instagram" });
    }
    if (ids.twitter_id) {
      links.push({ key: "twitter", href: `https://x.com/${ids.twitter_id}`, icon: FaTwitter, label: "X" });
    }
    return links;
  };

  const renderPersonTile = (person, subtitle) => {
    const socialLinks = getSocialLinks(person.id).slice(0, 3);

    return (
      <WrapItem key={`${person.id}-${subtitle}`}>
        <Box
          position="relative"
          overflow="hidden"
          borderWidth="1px"
          borderColor={crewCardBorder}
          rounded="xl"
          w={{ base: "110px", sm: "124px" }}
          h={{ base: "152px", sm: "166px" }}
          role="group"
          shadow="sm"
          _hover={{
            ".person-overlay": {
              transform: "translateY(105%)",
            },
          }}
        >
          <Image
            src={buildTMDBImageURL(person.profile_path, "w185")}
            alt={person.name}
            w="full"
            h="full"
            objectFit="cover"
            loading="lazy"
            transition="transform 0.35s ease"
            _groupHover={{ transform: "scale(1.04)" }}
          />

          <Box
            className="person-overlay"
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            h="20%"
            px={2}
            py={1.5}
            bgGradient={`linear(to-t, ${overlayFrom}, ${overlayTo})`}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            transform="translateY(0%)"
            transition="transform 0.28s ease"
            _hover={{
              transform: "translateY(0%) !important",
            }}
            _focusWithin={{
              transform: "translateY(0%) !important",
            }}
          >
            <HStack
              justify="space-between"
              spacing={1.5}
              align="center"
              w="full"
            >
              <VStack align="start" spacing={0} minW={0} flex="1">
                <Text
                  fontSize="11px"
                  fontWeight="semibold"
                  lineHeight="1.1"
                  noOfLines={1}
                  fontFamily="'Space Grotesk', 'Poppins', sans-serif"
                >
                  {person.name}
                </Text>
                <Text
                  fontSize="9px"
                  opacity={0.82}
                  noOfLines={1}
                  lineHeight="1"
                  fontFamily="'Space Grotesk', 'Poppins', sans-serif"
                >
                  {subtitle}
                </Text>
              </VStack>
              <HStack spacing={0.5} flexShrink={0}>
                {socialLinks.map((social) => (
                  <Box
                    as="a"
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${person.name} ${social.label}`}
                    color={social.key === "instagram" ? "pink.500" : "twitter.500"}
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ opacity: 0.85 }}
                  >
                    <Box as={social.icon} boxSize={6} sx={{ filter: `drop-shadow(${iconShadow})` }} />
                  </Box>
                ))}
              </HStack>
            </HStack>
          </Box>
        </Box>
      </WrapItem>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalOverlay />
      <ModalContent mx={6}>
        <ModalHeader pb={6} />
        <ModalCloseButton />
        <ModalBody pb={3}>
          {movie && (
            <>
              <Helmet>
                <title>{title} | Movie Download Online</title>
                <meta name="description" content={description} />
                <meta name="robots" content="index,follow" />
                <link rel="canonical" href={currentUrl.split("?")[0]} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={poster} />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:type" content="video.movie" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={poster} />
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
                  src={movie["large_cover_image"] || movie["medium_cover_image"]}
                  loading="lazy"
                ></Image>
                <VStack spacing={3} w="full" align="start">
                  <Heading as="h1" align="left">
                    {movie["title_long"] || movie["title"]}
                  </Heading>
                  <Button
                    size="sm"
                    colorScheme={isSaved ? "orange" : "green"}
                    leftIcon={isSaved ? <BsBookmarkFill /> : <BsBookmark />}
                    onClick={handleToggleWatchlist}
                  >
                    {isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
                  </Button>
                  <Divider />
                  <Wrap spacing={3} wrap="wrap" justify="flex-start" w="full">
                    {(movie["genres"] || []).map((val, key) => {
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
                      {movie["rating"] > 0
                        ? movie["rating"].toFixed(1) + " / 10"
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
                      {movie["like_count"] > 0
                        ? movie["like_count"].toLocaleString()
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
                      {movie["download_count"] > 0
                        ? movie["download_count"].toLocaleString()
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
                      {movie["language"] !== ""
                        ? movie["language"].toUpperCase()
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
                      {movie["runtime"] > 0
                        ? movie["runtime"] + " Minutes"
                        : "Unknown"}
                    </Text>
                  </HStack>
                </VStack>
              </Stack>
              {movie["yt_trailer_code"] !== "" && (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Trailer
                  </Heading>
                  <Trailer ytID={movie["yt_trailer_code"]} />
                </>
              )}
              
              {/* <Watch torrents={response.data.movie.torrents} /> */}
              
              <Divider />
              <Heading as="h3" fontSize="lg" align="left" w="full">
                Magnet Links
              </Heading>
              <Wrap spacing={2} wrap="wrap" align="start" w="full">
                    <MagnetUrl torrents={movie.torrents} movie={movie["title_long"] || movie["title"]}/>
              </Wrap>
              <Divider />
              <Heading as="h3" fontSize="lg" align="left" w="full">
                Torrents
              </Heading>
              <Wrap spacing={2} wrap="wrap" align="start" w="full">
                {movie["torrents"] &&
                  movie["torrents"].map((val, key) => {
                    return (
                      <Box
                        as="a"
                        href={val.url}
                        w={{ base: "108px", sm: "120px" }}
                        h={{ base: "78px", sm: "84px" }}
                        rounded="lg"
                        borderWidth="1px"
                        borderColor="green.300"
                        bgGradient="linear(to-br, green.50, white)"
                        p={2}
                        display="flex"
                        flexDir="column"
                        justifyContent="space-between"
                        transition="all 0.2s ease"
                        _hover={{ transform: "translateY(-2px)", shadow: "md", borderColor: "green.400" }}
                        key={key}
                      >
                        <HStack spacing={1} color="green.600">
                          <Box as={FaDownload} />
                          <Text fontSize="10px" fontWeight="bold" letterSpacing="0.4px">
                            TORRENT
                          </Text>
                        </HStack>
                        <Text fontSize="xs" fontWeight="semibold" noOfLines={1}>
                          {val.quality}.{val.type}
                        </Text>
                        <Text fontSize="10px" opacity={0.75} noOfLines={1}>
                          {val.size}
                        </Text>
                      </Box>
                    );
                  })}
              </Wrap>
              <Divider />
              {movie["description_full"] && (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Description
                  </Heading>
                  <Text align="left" w="full">
                    {movie["description_full"]}
                  </Text>
                </>
              )}
              {topCast.length ? (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Cast
                  </Heading>
                  <Wrap spacing={3} w="full">
                    {topCast.map((person) =>
                      renderPersonTile(person, person.character || "Cast"),
                    )}
                  </Wrap>
                </>
              ) : null}
              {directors.length ? (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Directors
                  </Heading>
                  <Wrap spacing={3} w="full">
                    {directors.map((person) => renderPersonTile(person, "Director"))}
                  </Wrap>
                </>
              ) : null}
              {watchProviders.length ? (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Where to Watch
                  </Heading>
                  <Wrap spacing={3} w="full">
                    {watchProviders.slice(0, 8).map((provider) => (
                      <HStack key={provider.provider_id} spacing={2}>
                        <Image
                          boxSize="28px"
                          rounded="full"
                          src={buildTMDBImageURL(provider.logo_path, "w92")}
                          alt={provider.provider_name}
                          loading="lazy"
                        />
                        <Text fontSize="sm">{provider.provider_name}</Text>
                      </HStack>
                    ))}
                  </Wrap>
                </>
              ) : null}
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