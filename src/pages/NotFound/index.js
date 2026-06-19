import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFound = () => {
  const canonicalHref =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "https://movie.hubs.dpdns.org/404";

  return (
    <VStack
      spacing={6}
      justify="center"
      align="center"
      minH="60vh"
      textAlign="center"
    >
      <Helmet>
        <title>404 - Page Not Found | Movie Download Online</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href={canonicalHref} />
      </Helmet>
      <Box
        fontSize="8xl"
        fontWeight="bold"
        color="green.400"
        lineHeight="1"
      >
        404
      </Box>
      <Heading as="h1" fontSize="2xl">
        Page Not Found
      </Heading>
      <Text color="gray.500" maxW="md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Text>
      <Button as={Link} to="/" colorScheme="green" size="lg">
        Back to Home
      </Button>
    </VStack>
  );
};

export default NotFound;