import {
  AspectRatio,
  Box,
  Button,
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
  Link as ChakraLink,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
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
  const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure();
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
          <Button size="md" onClick={onHelpOpen} display={{ base: "none", sm: "inline-flex" }}>
            How to download
          </Button>
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
                        onClick={() => history.push(`/movie/${val.id}`)}
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
      <Modal isOpen={isHelpOpen} onClose={onHelpClose}>
        <ModalOverlay />
        <ModalContent rounded="xl" p={3} mx={3}>
          <ModalHeader>How to download</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <Text>
                Use the magnet links on this site with a torrent client to download movies.
              </Text>
              <List spacing={3}>
                <ListItem>
                  <strong>Step 1:</strong> Download a torrent client such as{' '}
                  <ChakraLink href="https://www.qbittorrent.org/download" color="teal.500" isExternal>
                    qBittorrent
                  </ChakraLink>.
                </ListItem>
                <ListItem>
                  <strong>Step 2:</strong> Browse the site, choose a movie you like, and click the magnet link.
                </ListItem>
                <ListItem>
                  <strong>Step 3:</strong> Open the magnet link with your torrent client, then confirm the prompt and click OK to start downloading.
                </ListItem>
                <ListItem>
                  <strong>Step 4:</strong> Keep seeding for at least one day after the download finishes so other users can benefit too.
                </ListItem>
                <ListItem>
                  For mobile, you can use{' '}
                  <ChakraLink href="https://play.google.com/store/apps/details?id=com.utorrent.client&hl=en" color="teal.500" isExternal>
                    uTorrent
                  </ChakraLink>.
                </ListItem>
              </List>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SimpleGrid>
  );
};

export default Navbar;
