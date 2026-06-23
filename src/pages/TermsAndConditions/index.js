import React from "react";
import { Heading, Stack, Text } from "@chakra-ui/react";

const TermsAndConditions = () => {
  return (
    <Stack spacing={4} align="start">
      <Heading as="h1" size="lg">
        Terms & Conditions
      </Heading>
      <Text>
        By using this website, you agree to use it only for lawful purposes and in
        compliance with local regulations.
      </Text>
      <Text>
        Content availability, metadata, and external links can change without notice.
        We do not guarantee uninterrupted access or permanent availability of any
        movie listing.
      </Text>
      <Text>
        You are responsible for your own use of this website and for ensuring your
        actions comply with applicable copyright and content laws in your region.
      </Text>
      <Text>
        We may update these terms periodically. Continued use of the website after
        updates means you accept the revised terms.
      </Text>
    </Stack>
  );
};

export default TermsAndConditions;
