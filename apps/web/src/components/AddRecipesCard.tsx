import { Stack, Heading, Text, Button } from "@chakra-ui/react";

export const AddRecipesCard = () => {
  return (
    <Stack justify="center" align="center" py="4">
      <Heading size="lg">No recipes found</Heading>
      <Stack>
        <Button colorScheme="blue">Add a recipe</Button>
        <Text textAlign="center">or</Text>
        <Button colorScheme="blue" variant="outline">
          Add a menu
        </Button>
      </Stack>
    </Stack>
  );
};
