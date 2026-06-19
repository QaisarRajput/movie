import { Center, HStack, IconButton, Skeleton, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GoPrimitiveDot } from "react-icons/go";
import ReleaseCard from "./ReleaseCard";
import ReleaseHeader from "./ReleaseHeader";
import ErrorMessage from "../../../components/ErrorMessage";
import useAPIrequest from "../../../adapters/useAPIrequest";
import API_BASE_URL from "../../../config";

const NewRelease = () => {
  const { response, error } = useAPIrequest(
    `${API_BASE_URL}/list_movies.json?sort_by=year`,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [slides, setSlides] = useState([
    { show: true },
    { show: false },
    { show: false },
    { show: false },
    { show: false },
    { show: false },
  ]);

  const handlePageChange = (dir) => {
    if (dir === +1) {
      page === 6 ? setPage(1) : setPage(page + 1);
    } else {
      page === 1 ? setPage(6) : setPage(page - 1);
    }
  };

  useEffect(() => {
    const arr = [
      { show: true },
      { show: false },
      { show: false },
      { show: false },
      { show: false },
      { show: false },
    ];

    if (response && response !== null) {
      arr.map((item, index) => {
        return [
          (item.img = response.data.movies[index]["background_image_original"]),
          (item.title = response.data.movies[index]["title_long"]),
          (item.id = response.data.movies[index]["id"]),
          (item.youtube = response.data.movies[index]["yt_trailer_code"]),
        ];
      });

      arr.map((item) => {
        return (item.show = false);
      });
      arr[page - 1].show = true;
      setSlides(arr);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [response, page]);

  return (
    <VStack>
      <ReleaseHeader />
      {error ? <ErrorMessage title="New releases are unavailable" /> : null}
      <Skeleton rounded="xl" isLoaded={!isLoading} w="full">
        <Center overflow="hidden" w="full" pos="relative">
          {slides.map((item, key) => {
            return (
              <ReleaseCard
                show={item.show}
                key={key}
                isLoading={isLoading}
                img={item.img}
                title={item.title}
                id={item.id}
                youtube={item.youtube}
              />
            );
          })}

          <HStack spacing={0} pos="absolute" bottom={3} color="white">
            {[...Array(6)].map((e, i) => (
              <GoPrimitiveDot key={i} opacity={i + 1 === page ? 1 : 0.3} />
            ))}
          </HStack>
          <IconButton
            pos="absolute"
            left={3}
            bottom={3}
            onClick={() => handlePageChange(-1)}
            size="sm"
            icon={<FaArrowLeft />}
          />
          <IconButton
            pos="absolute"
            right={3}
            bottom={3}
            onClick={() => handlePageChange(+1)}
            size="sm"
            icon={<FaArrowRight />}
          />
        </Center>
      </Skeleton>
    </VStack>
  );
};
export default NewRelease;
