import {
  Stack,
  Heading,
  HStack,
  IconButton,
  Button,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GoPrimitiveDot } from "react-icons/go";
import React from "react";
import { Link } from "react-router-dom";

const TopMoviesHeader = ({ setPage, page, maxPage, language }) => {
  const isFirstPage = page === 1;
  const isLastPage = page >= maxPage;

  const handlePageNav = (dir) => {
    setPage(page + dir);
  };

  const languageLabel =
    language === "hi" ? "Hindi" : language === "fr" ? "French" : "English";

  const pageDots = Array.from({ length: Math.max(1, Math.min(3, maxPage)) });

  return (
    <Stack
      direction={{ base: "column", sm: "row" }}
      w="full"
      align={{ base: "start", sm: "center" }}
      py={6}
      spacing={6}
    >
      <Heading whiteSpace="nowrap" as="h2" fontSize="2xl">
        Top {languageLabel}
      </Heading>
      <Divider w="full" />
      <HStack w={{ base: "full", sm: "min" }}>
        <HStack spacing={0}>
          {pageDots.map((_, i) => (
            <GoPrimitiveDot key={i} opacity={i + 1 === page ? 1 : 0.3} />
          ))}
        </HStack>
        <Spacer display={{ base: "block", sm: "none" }} />
        <IconButton
          onClick={() => handlePageNav(-1)}
          isDisabled={isFirstPage}
          size="sm"
          icon={<FaArrowLeft />}
        />

        {!isLastPage && (
          <IconButton
            onClick={() => handlePageNav(+1)}
            size="sm"
            icon={<FaArrowRight />}
          />
        )}

        {page === maxPage && (
          <Button
            as={Link}
            to={
              "/movies/language/" +
              (language === "hi"
                ? "hindi"
                : language === "fr"
                ? "french"
                : "english")
            }
            size="sm"
            rightIcon={<FaArrowRight />}
          >
            See all
          </Button>
        )}
      </HStack>
    </Stack>
  );
};

export default TopMoviesHeader;
