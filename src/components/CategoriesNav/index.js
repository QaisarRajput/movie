import {
  VStack,
  Heading,
  Box,
  Link,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React, { useEffect } from "react";
import categories from "../../data/categories";
import toProperCase from "../../functions/toProperCase";
import { FaTimes } from "react-icons/fa";
import NavOverlay from "./NavOverlay";

const CategoriesNav = ({ isOpen, toggleSideNav, setIsOpen }) => {
  useEffect(() => {
    if (isOpen === true) {
      document.getElementsByTagName("html")[0].classList.add("no-scroll");
    } else {
      document.getElementsByTagName("html")[0].classList.remove("no-scroll");
    }
  }, [isOpen]);

  return (
    <>
      <NavOverlay
        visibility={isOpen ? "visible" : "hidden"}
        setIsOpen={setIsOpen}
      />
      <VStack
        p={{ base: 4, md: 0 }}
        py={6}
        w={{ base: "220px", md: "full" }}
        align="start"
        transition="right 0.5s"
        boxShadow={{ base: "dark-lg", md: "none" }}
        spacing={6}
        pos={{ base: "fixed", md: "relative" }}
        zIndex="banner"
        overflowY="auto"
        h="100%"
        right={{ base: isOpen ? 0 : "-100%", md: 0 }}
        top={0}
        bg={useColorModeValue("white", "gray.800")}
      >
        <IconButton
          py={3}
          alignSelf="flex-end"
          onClick={() => toggleSideNav()}
          display={{ base: "flex", md: "none" }}
          icon={<FaTimes />}
        ></IconButton>
        <Heading textTransform="uppercase" as="h4" fontSize="md">
          Categories
        </Heading>
        <Box as="hr" w="full" />
        <VStack
          spacing={1}
          align="start"
          w="full"
          fontSize="md"
          fontWeight="normal"
        >
          <Link
            onClick={() => setIsOpen(false)}
            as={RouterLink}
            to="/movies/all"
          >
            All Movies
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            as={RouterLink}
            to="/movies/new"
          >
            New Releases
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            as={RouterLink}
            to="/movies/recent"
          >
            Recently Added
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            as={RouterLink}
            to="/movies/rating"
          >
            Top Rated
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            as={RouterLink}
            to="/movies/likes"
          >
            Top Likes
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            as={RouterLink}
            to="/movies/downloads"
          >
            Top Downloads
          </Link>
        </VStack>
        <Heading textTransform="uppercase" as="h4" fontSize="md">
          Genres
        </Heading>
        <Box as="hr" w="full" />
        <VStack
          spacing={1}
          align="start"
          w="full"
          fontSize="md"
          fontWeight="normal"
        >
          {categories.map((val, key) => {
            return (
              <Link
                onClick={() => setIsOpen(false)}
                as={RouterLink}
                to={"/movies/" + val}
                key={key}
              >
                {toProperCase(val)}
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </>
  );
};

export default React.memo(CategoriesNav);
