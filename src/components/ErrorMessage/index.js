import { Button, Icon, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FiWifiOff } from "react-icons/fi";

const ErrorMessage = ({
  title = "Could not load movies",
  message = "Check your connection and try again.",
  onRetry,
}) => {
  return (
    <VStack py={10} spacing={3} w="full" align="center">
      <Icon as={FiWifiOff} boxSize={8} color="red.400" />
      <Text fontWeight="semibold">{title}</Text>
      <Text color="gray.500" textAlign="center">
        {message}
      </Text>
      {onRetry ? (
        <Button onClick={onRetry} colorScheme="green" size="sm">
          Retry
        </Button>
      ) : null}
    </VStack>
  );
};

export default ErrorMessage;
