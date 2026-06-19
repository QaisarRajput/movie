import {
  HStack,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import categories from "./../../../data/categories";
import toProperCase from "../../../functions/toProperCase";
import React from "react";

const SortControls = ({
  quality,
  genre,
  orderBy,
  rating,
  setQuality,
  setGenre,
  setOrderBy,
  setRating,
  displayGenre,
}) => {
  return (
    <Stack spacing={3} w="full">
      <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
        <Select
          variant="filled"
          placeholder="Order By"
          size="sm"
          rounded="lg"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </Select>
        <Select
          variant="filled"
          placeholder="Quality"
          size="sm"
          rounded="lg"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
        >
          <option value="all">All Qualities</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
          <option value="2160p">2160p</option>
          <option value="3D">3D</option>
        </Select>
        {displayGenre && (
          <Select
            variant="filled"
            placeholder="Genre"
            value={genre}
            size="sm"
            rounded="lg"
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="all">All Genres</option>
            {categories.map((val, key) => {
              return (
                <option value={val} key={key}>
                  {toProperCase(val)}
                </option>
              );
            })}
          </Select>
        )}
      </Stack>
      <HStack spacing={6}>
        <Text>Rating</Text>
        <Slider
          colorScheme="green"
          value={rating}
          min={0}
          max={9}
          step={1}
          onChange={(val) => setRating(val)}
          onChangeEnd={(val) => setRating(val)}
        >
          <SliderTrack>
            <Box position="relative" right={10} />
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={4} />
        </Slider>
        <Text>{rating === 0 ? "Any" : `${rating}+`}</Text>
      </HStack>
    </Stack>
  );
};

export default SortControls;
