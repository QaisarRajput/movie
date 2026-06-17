import {
  AspectRatio,
  Box,
  Center,
  Divider,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { IoMenu, IoSearchSharp } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import ColorModeToggle from "./ColorModeToggle";
import LogoModeToggle from "./LogoModeToggle";
import InputAsButton from "./InputAsButton";
import useAPIrequest from "../../adapters/useAPIrequest";
import API_BASE_URL from "../../config";

const Navbar = ({ toggleSideNav }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [SearchTerm, setSearchTerm] = useState("");
  const history = useHistory();

  const { response } = useAPIrequest(
    `${API_BASE_URL}/list_movies.json?query_term=${SearchTerm.toLowerCase()}`
  );

  return (
    <SimpleGrid as="header" columns={5} row={1} spacing={3} mt={6} mb={9}>
      <GridItem colSpan={{ base: 3, lg: 1 }}>
        <HStack as={Link} to="/" fontSize="4xl" maxW="200px" w="full">
         <LogoModeToggle />
        </HStack>
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 3 }}>
        <InputAsButton onOpen={onOpen} />
      </GridItem>
      <GridItem
        colSpan={{ base: 2, lg: 1 }}
        colStart={{ base: 4, lg: 5 }}
        rowStart={1}
      >
        <HStack justify="flex-end">
          <IconButton
            display={{ base: "flex", sm: "none" }}
            icon={<GoPerson />}
          ></IconButton>
          <ColorModeToggle />
          <IconButton
            onClick={toggleSideNav}
            display={{ base: "flex", md: "none" }}
            icon={<IoMenu />}
          ></IconButton>
        </HStack>
      </GridItem>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSearchTerm("");
        }}
      >
        <ModalOverlay />
        <ModalContent rounded="xl" p={3} mx={3}>
          <ModalHeader p={0}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<IoSearchSharp />}
              />
              <Input
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                type="text"
                placeholder="Search Movies"
                variant="filled"
              />
            </InputGroup>
          </ModalHeader>
          <ModalBody
            p={0}
            mt={6}
            display={SearchTerm === "" ? "none" : "block"}
          >
            {response && response.data.movies && (
              <VStack w="full" spacing={3}>
                {response.data.movies.map((val, key) => {
                  return (
                    <Box key={key} w="full">
                      <Divider mb={3} />
                      <HStack
                        cursor="pointer"
                        onClick={() => history.push("?movie_id=" + val.id)}
                        spacing={6}
                      >
                        <AspectRatio ratio={2 / 3} w="10%" objectFit="cover">
                          <Image
                            alt={val.title}
                            fit="cover"
                            rounded="lg"
                            src={val["small_cover_image"]}
                          />
                        </AspectRatio>
                        <Heading maxW="80%" as="h3" fontSize="xl">
                          {val["title_long"]}
                        </Heading>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            )}
            {response && !response.data.movies && (
              <Center w="full">
                <Spinner />
              </Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </SimpleGrid>
  );
};

export default Navbar;
