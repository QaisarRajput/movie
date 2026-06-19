import { Box } from "@chakra-ui/react";
import React from "react";

const NavOverlay = ({ visibility, setIsOpen }) => {
  return (
    <Box
      h="100%"
      w="100%"
      pos="fixed"
      top={0}
      left={0}
      zIndex="docked"
      bg="blackAlpha.400"
      sx={{
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={() => setIsOpen(false)}
      onTouchStart={() => setIsOpen(false)}
      opacity={visibility === "visible" ? 1 : 0}
      transition=".25s ease-in-out"
      visibility={visibility}
    ></Box>
  );
};

export default NavOverlay;
