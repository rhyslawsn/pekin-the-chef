import { Flex, Heading, Stack, Button, Tag } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <Flex
      as="header"
      justifyContent="center"
      py="4"
      bg="white"
      boxShadow="sm"
      borderBottomWidth="1px"
    >
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        w="full"
        maxW="container.lg"
      >
        <Heading
          fontSize="xl"
          textTransform="uppercase"
          fontWeight="bold"
          as={Link}
          to="/"
        >
          Peking
          <br />
          the Chef
        </Heading>
        <Stack direction="row" spacing="4">
          <Button
            variant="outline"
            rightIcon={<Tag colorScheme="green">New!</Tag>}
          >
            Weekly Dinner Ideas
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};
