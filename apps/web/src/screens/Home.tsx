import {
  Container,
  Input,
  Stack,
  Image,
  Heading,
  Text,
  AspectRatio,
  Wrap,
} from "@chakra-ui/react";
import { Page } from "../components/Page";
import { Link } from "react-router-dom";
import { TrpcOutputs, trpc } from "../config/trpc";

type Recipe = TrpcOutputs["getRecipe"];

export const Home = () => {
  const { data: recipes } = trpc.getRecipes.useQuery();

  const renderResult = (result: Recipe) => {
    return (
      <Stack
        direction="column"
        spacing={2}
        bg="gray.200"
        borderRadius="md"
        w="fit-content"
        as={Link}
        to={`/recipes/${result.id}`}
      >
        <AspectRatio ratio={4 / 3} w="200px">
          <Image
            src={result.imageUrls[0]}
            alt={result.title}
            borderTopRadius="md"
          />
        </AspectRatio>
        <Stack m="2">
          <Heading size="md">{result.title}</Heading>
          <Text>{result.description}</Text>
        </Stack>
      </Stack>
    );
  };

  return (
    <Page>
      <Container maxW="container.lg" overflowY="auto">
        <Container maxW="container.sm" h="sm">
          <Stack spacing={4} h="full" justify="center">
            <Input
              placeholder="Find recipes from your favourite restaurants..."
              size="lg"
            />
          </Stack>
        </Container>
        <Wrap spacing={4} mt={8}>
          {recipes?.map(renderResult)}
        </Wrap>
      </Container>
    </Page>
  );
};
