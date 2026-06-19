import {
  AspectRatio,
  Box,
  Button,
  Center,
  Heading,
  Image,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Fade } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import React from "react";
import { useNavigate } from "react-router-dom";
import YoutubeEmbedded from "../../../../components/YoutubeEmbedded";
import { getMoviePathFromParts } from "../../../../functions/movieUrl";

const ReleaseCard = ({ show, title, img, id, youtube }) => {
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      as={Fade}
      in={show}
      w="full"
      pos="relative"
      display={show ? "block" : "none"}
      color="white"
    >
      <AspectRatio ratio={{ base: 4 / 3, sm: 16 / 9 }}>
        <Image rounded="xl" src={img} loading="lazy" />
      </AspectRatio>
      <Center
        as={VStack}
        spacing={{ base: 3, sm: 6 }}
        pos="absolute"
        w="full"
        h="full"
        inset={0}
      >
        <Heading
          as="h1"
          fontSize={{ base: "xl", sm: "3xl" }}
          textAlign="center"
          textShadow="dark-lg"
        >
          {title}
        </Heading>
        <Button
          size="sm"
          onClick={() => navigate(getMoviePathFromParts({ id, title }))}
          colorScheme="green"
          boxShadow="dark-lg"
        >
          Download Now
        </Button>
        {youtube !== "" && (
          <Button
            size="sm"
            onClick={() => onOpen()}
            textColor="white"
            leftIcon={<FaPlay />}
            boxShadow="dark-lg"
            colorScheme="green"
            variant="outline"
          >
            Watch Trailer
          </Button>
        )}
      </Center>
      {youtube !== "" && (
        <YoutubeEmbedded
          isOpen={isOpen}
          onClose={onClose}
          videoID={youtube}
          title={title}
        />
      )}
    </Box>
  );
};

export default ReleaseCard;
