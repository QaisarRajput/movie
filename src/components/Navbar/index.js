import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link as ChakraLink,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  VStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMenu, IoSearchSharp } from "react-icons/io5";
import { BsBookmark } from "react-icons/bs";
import ColorModeToggle from "./ColorModeToggle";
import LogoModeToggle from "./LogoModeToggle";
import InputAsButton from "./InputAsButton";
import useAPIrequest from "../../adapters/useAPIrequest";
import API_BASE_URL from "../../config";
import { WATCHLIST_EVENT, getWatchlist } from "../../functions/watchlist";
import { getMoviePath } from "../../functions/movieUrl";

const RECENT_SEARCHES_KEY = "movieApp_recentSearches";
const MAX_RECENT = 5;

const Navbar = ({ toggleSideNav }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure();
  const [SearchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const syncWatchlistCount = () => setWatchlistCount(getWatchlist().length);
    syncWatchlistCount();

    window.addEventListener(WATCHLIST_EVENT, syncWatchlistCount);
    window.addEventListener("storage", syncWatchlistCount);

    return () => {
      window.removeEventListener(WATCHLIST_EVENT, syncWatchlistCount);
      window.removeEventListener("storage", syncWatchlistCount);
    };
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) { /* ignore */ }
  }, []);

  // Debounce search term (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(SearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [SearchTerm]);

  const { response, error, loading: searchLoading } = useAPIrequest(
    debouncedTerm.trim()
      ? `${API_BASE_URL}/list_movies.json?query_term=${debouncedTerm.toLowerCase()}`
      : null
  );

  const searchResults = response?.data?.movies || [];

  // Save recent search
  const saveRecentSearch = useCallback((term) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch (e) { /* ignore */ }
      return updated;
    });
  }, []);

  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch (e) { /* ignore */ }
      return updated;
    });
  };

  const handleSearchSelect = (movie) => {
    saveRecentSearch(movie?.title || movie?.title_english || movie?.title_long || SearchTerm);
    onClose();
    setSearchTerm("");
    setDebouncedTerm("");
    navigate(getMoviePath(movie));
  };

  const handleClose = () => {
    onClose();
    setSearchTerm("");
    setDebouncedTerm("");
    setActiveIndex(-1);
  };

  const handleSeeAllResults = () => {
    const term = SearchTerm.trim();
    if (!term) return;
    saveRecentSearch(term);
    handleClose();
    navigate(`/movies/all?search=${encodeURIComponent(term)}`);
  };

  const handleSearchInputKeyDown = (event) => {
    if (!searchResults.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % searchResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? searchResults.length - 1 : prev - 1
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const selected = searchResults[activeIndex];
      if (selected) {
        handleSearchSelect(selected);
      }
    }
  };

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedTerm, isOpen]);

  return (
    <SimpleGrid as="header" columns={5} row={1} spacing={3} mt={6} mb={9}>
      <GridItem colSpan={{ base: 3, lg: 1 }}>
        <HStack as={Link} to="/" fontSize="4xl" maxW="200px" w="full">
         <LogoModeToggle />
        </HStack>
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 3 }}>
        <InputAsButton onOpen={onOpen} />
      </GridItem>
      <GridItem
        colSpan={{ base: 2, lg: 1 }}
        colStart={{ base: 4, lg: 5 }}
        rowStart={1}
      >
        <HStack justify="flex-end">
          <Box position="relative">
            <IconButton
              as={Link}
              to="/watchlist"
              icon={<BsBookmark />}
              aria-label="Watchlist"
            />
            {watchlistCount > 0 ? (
              <Center
                position="absolute"
                top={-2}
                right={-2}
                minW="20px"
                h="20px"
                px={1}
                rounded="full"
                bg="green.500"
                color="white"
                fontSize="xs"
                fontWeight="bold"
              >
                {watchlistCount > 99 ? "99+" : watchlistCount}
              </Center>
            ) : null}
          </Box>
          <ColorModeToggle />
          <Button size="md" onClick={onHelpOpen} display={{ base: "none", sm: "inline-flex" }}>
            How to download
          </Button>
          <IconButton
            onClick={toggleSideNav}
            display={{ base: "flex", md: "none" }}
            icon={<IoMenu />}
          ></IconButton>
        </HStack>
      </GridItem>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        initialFocusRef={searchInputRef}
      >
        <ModalOverlay />
        <ModalContent rounded="xl" p={3} mx={3}>
          <ModalHeader p={0}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<IoSearchSharp />}
              />
              <Input
                ref={searchInputRef}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                onKeyDown={handleSearchInputKeyDown}
                type="text"
                placeholder="Search Movies"
                variant="filled"
              />
            </InputGroup>
          </ModalHeader>
          <ModalBody p={0} mt={6}>
            {SearchTerm === "" ? (
              <VStack align="start" spacing={4} w="full">
                <Text fontSize="sm" color="gray.500">
                  Recent searches
                </Text>
                <Wrap spacing={2} w="full">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((term) => (
                      <Tag
                        key={term}
                        size="md"
                        variant="subtle"
                        colorScheme="green"
                        cursor="pointer"
                        onClick={() => {
                          setSearchTerm(term);
                          setDebouncedTerm(term);
                        }}
                      >
                        <TagLabel>{term}</TagLabel>
                        <TagCloseButton onClick={(event) => {
                          event.stopPropagation();
                          removeRecentSearch(term);
                        }} />
                      </Tag>
                    ))
                  ) : (
                    <Text color="gray.500">No recent searches yet.</Text>
                  )}
                </Wrap>
              </VStack>
            ) : searchLoading ? (
              <Center w="full" py={4}>
                <Spinner />
              </Center>
            ) : error ? (
              <Center w="full" py={4}>
                <Text color="red.400">Unable to fetch movies. Please try again.</Text>
              </Center>
            ) : searchResults.length > 0 ? (
              <VStack w="full" spacing={3}>
                {searchResults.map((val, key) => {
                  return (
                    <Box
                      key={key}
                      w="full"
                      rounded="md"
                      bg={activeIndex === key ? "blackAlpha.100" : "transparent"}
                    >
                      <Divider mb={3} />
                      <HStack
                        cursor="pointer"
                        onClick={() => handleSearchSelect(val)}
                        spacing={6}
                      >
                        <AspectRatio ratio={2 / 3} w="10%" objectFit="cover">
                          <Image
                            alt={val.title}
                            fit="cover"
                            rounded="lg"
                            src={val["small_cover_image"]}
                            loading="lazy"
                          />
                        </AspectRatio>
                        <VStack align="start" spacing={1} maxW="80%">
                          <Heading as="h3" fontSize="xl" noOfLines={1}>
                            {val["title_long"]}
                          </Heading>
                          <Text fontSize="sm" color="gray.500">
                            {val.year || "Unknown year"} · {typeof val.rating === "number" ? `${val.rating.toFixed(1)} / 10` : "No rating"}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })}
                <Button
                  w="full"
                  colorScheme="green"
                  variant="outline"
                  onClick={handleSeeAllResults}
                >
                  See all results for "{SearchTerm.trim()}"
                </Button>
              </VStack>
            ) : (
              <Center w="full" py={4}>
                <Text color="gray.500">No movies found for “{SearchTerm}”.</Text>
              </Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isHelpOpen} onClose={onHelpClose}>
        <ModalOverlay />
        <ModalContent rounded="xl" p={3} mx={3}>
          <ModalHeader>How to download</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <Text>
                Use the magnet links on this site with a torrent client to download movies.
              </Text>
              <List spacing={3}>
                <ListItem>
                  <strong>Step 1:</strong> Download a torrent client such as{' '}
                  <ChakraLink href="https://www.qbittorrent.org/download" color="teal.500" isExternal>
                    qBittorrent
                  </ChakraLink>.
                </ListItem>
                <ListItem>
                  <strong>Step 2:</strong> Browse the site, choose a movie you like, and click the magnet link.
                </ListItem>
                <ListItem>
                  <strong>Step 3:</strong> Open the magnet link with your torrent client, then confirm the prompt and click OK to start downloading.
                </ListItem>
                <ListItem>
                  <strong>Step 4:</strong> Keep seeding for at least one day after the download finishes so other users can benefit too.
                </ListItem>
                <ListItem>
                  For mobile, you can use{' '}
                  <ChakraLink href="https://play.google.com/store/apps/details?id=com.utorrent.client&hl=en" color="teal.500" isExternal>
                    uTorrent
                  </ChakraLink>.
                </ListItem>
              </List>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SimpleGrid>
  );
};

export default Navbar;
