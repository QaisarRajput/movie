import { useColorMode } from "@chakra-ui/react";
import React from "react";

const Logo = ({ colorMode }) => {
  return (
    <img
      src={colorMode === "dark" ? "/favicons/logo-light.png" : "/favicons/logo-dark.png"}
      alt="Logo"
    />
  );
};

const LogoModeToggle = () => {
  const { colorMode } = useColorMode();

  return (
      <Logo colorMode={colorMode} />
  );
};

export default LogoModeToggle;