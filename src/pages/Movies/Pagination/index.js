import { IconButton, Button, ButtonGroup, Box } from "@chakra-ui/react";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({ setPage, page, movie_count, limit }) => {
  const totalPages = Math.ceil(movie_count / limit);

  const handlePageNav = (dir) => {
    setPage(page + dir);
  };

  return (
    <ButtonGroup isAttached boxShadow="xs" rounded="md">
      <IconButton
        onClick={() => handlePageNav(-1)}
        isDisabled={page === 1 ? true : false}
        size="sm"
        icon={<FaArrowLeft />}
      />
      {page !== 1 && (
        <Button
          size="sm"
          onClick={() => setPage(1)}
          isDisabled={page === 1 ? true : false}
        >
          1
        </Button>
      )}

      {page - 1 > 1 && <Box px={3}>...</Box>}
      <Button size="sm" colorScheme="green" isDisabled>
        {page}
      </Button>
      {page + 1 < totalPages && <Box px={3}>...</Box>}

      {page !== totalPages && (
        <Button
          size="sm"
          onClick={() => setPage(totalPages)}
          isDisabled={page === totalPages ? true : false}
        >
          {totalPages}
        </Button>
      )}
      <IconButton
        onClick={() => handlePageNav(+1)}
        isDisabled={page === totalPages ? true : false}
        size="sm"
        icon={<FaArrowRight />}
      />
    </ButtonGroup>
  );
};

export default Pagination;
