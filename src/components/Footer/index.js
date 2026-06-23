import { Center, HStack, Link, Wrap } from "@chakra-ui/react";

import { Link as RouterLink } from "react-router-dom";
import React from "react";
import LogoModeToggle from "../Navbar/LogoModeToggle";
const Footer = () => {
  return (
    <Wrap spacing={3} w="full" justify="center" align="center" mb={5}>
      <Center>
        <HStack as={RouterLink} to="/" fontSize="4xl" maxW="200px">
           <LogoModeToggle />
        </HStack>
      </Center>
      <Link as={RouterLink} to="/terms-and-conditions" fontSize="sm">
        Terms & Conditions
      </Link>
      <Link as={RouterLink} to="/policies" fontSize="sm">
        Policies
      </Link>
    </Wrap>
  );
};

export default Footer;
