import { Center, Container, GridItem, SimpleGrid, Spinner } from "@chakra-ui/react";
import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CategoriesNav from "./components/CategoriesNav";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import ReactGA from "react-ga4";

const Home = lazy(() => import("./pages/Home"));
const Movies = lazy(() => import("./pages/Movies"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MovieDetails = lazy(() => import("./components/MovieDetails"));

ReactGA.initialize("G-Z090Q2W49P");

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideNav = () => {
    setIsOpen(!isOpen);
  };

  const fallback = (
    <Center py={12} w="full">
      <Spinner />
    </Center>
  );

  return (
    <Container
      as="main"
      maxW={{
        xs: "full",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        xxl: "1320px",
      }}
    >
      <BrowserRouter>
        <ScrollToTop />
        <Navbar toggleSideNav={toggleSideNav} />
        <SimpleGrid columns={5} row={1} spacing={6}>
          <GridItem colSpan={{ base: 5, md: 4 }}>
            <Suspense fallback={fallback}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:slug" element={<Home />} />
                <Route path="/movies/*" element={<Movies />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </GridItem>
          <GridItem>
            <CategoriesNav
              isOpen={isOpen}
              toggleSideNav={toggleSideNav}
              setIsOpen={setIsOpen}
            />
          </GridItem>
        </SimpleGrid>
        <Suspense fallback={fallback}>
          <MovieDetails />
        </Suspense>
        <Footer />
        <BackToTop />
      </BrowserRouter>
    </Container>
  );
};

export default App;
