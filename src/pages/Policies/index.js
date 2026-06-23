import React from "react";
import { Heading, Stack, Text } from "@chakra-ui/react";

const Policies = () => {
  return (
    <Stack spacing={4} align="start">
      <Heading as="h1" size="lg">
        Policies
      </Heading>
      <Text>
        We aim to keep listings accurate, but data from third-party providers may be
        delayed, incomplete, or unavailable.
      </Text>
      <Text>
        This website may use local storage to save preferences such as watchlist
        items and interface settings for a better user experience.
      </Text>
      <Text>
        We do not intentionally collect personal sensitive information through this
        frontend application. If analytics are enabled, they are used for aggregate
        performance and usage insights.
      </Text>
      <Text>
        For questions about data handling or policy updates, contact the site owner
        through the repository or project contact channels.
      </Text>
    </Stack>
  );
};

export default Policies;
