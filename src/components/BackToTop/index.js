import { IconButton } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.pageYOffset > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <IconButton
      icon={<FaArrowUp />}
      position="fixed"
      bottom={6}
      right={6}
      zIndex="sticky"
      colorScheme="green"
      rounded="full"
      size="lg"
      shadow="lg"
      onClick={scrollToTop}
      opacity={visible ? 1 : 0}
      visibility={visible ? "visible" : "hidden"}
      transform={visible ? "scale(1)" : "scale(0.5)"}
      transition="all 0.25s ease-in-out"
      aria-label="Back to top"
    />
  );
};

export default BackToTop;