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

type Result = {
  id: number;
  image: string;
  name: string;
  description: string;
};

const RECIPES: Result[] = [
  {
    id: 1,
    image: "https://bit.ly/2Z4KKcF",
    name: "Omelette",
    description: "A delicious omelette.",
  },
  {
    id: 2,
    image: "https://bit.ly/3A4eZ0M",
    name: "Pancakes",
    description: "A stack of delicious pancakes.",
  },
  {
    id: 3,
    image: "https://bit.ly/3kz9YfM",
    name: "Scrambled Eggs",
    description: "Perfectly scrambled eggs.",
  },
];

export const Home = () => {
  const renderResult = (result: Result) => {
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
          <Image src={result.image} alt={result.name} borderTopRadius="md" />
        </AspectRatio>
        <Stack m="2">
          <Heading size="md">{result.name}</Heading>
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
          {RECIPES.map(renderResult)}
        </Wrap>
      </Container>
    </Page>
  );
};
