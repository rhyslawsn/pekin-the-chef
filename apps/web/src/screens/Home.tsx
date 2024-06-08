import {
  Container,
  Input,
  Stack,
  Image,
  Heading,
  Text,
  Wrap,
  Button,
} from "@chakra-ui/react";
import { Page } from "../components/Page";
import { Link } from "react-router-dom";
import { TrpcOutputs, trpc } from "../config/trpc";
import { name, normalizeSearch, recipeTitle } from "../utils/formatters";
import { ChangeEvent, useState } from "react";
import { useDebounce } from "usehooks-ts";

type Recipe = TrpcOutputs["getRecipes"][0];

export const Home = () => {
  const [search, setSearch] = useState<string>("");
  const query = useDebounce(search, 500);

  const { data: recipes } = trpc.getRecipes.useQuery({ query });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(normalizeSearch(e.target.value));
  };

  const renderResult = (result: Recipe) => {
    return (
      <Stack
        direction="column"
        spacing={2}
        bg="gray.200"
        borderRadius="md"
        w="fit-content"
        maxW="sm"
        as={Link}
        to={`/recipes/${result.id}`}
      >
        <Image
          src={result.imageUrls?.[0]}
          alt={result.title}
          objectFit="cover"
          borderTopRadius="md"
          w="sm"
          h="2xs"
        />
        <Stack m="2">
          <Heading size="sm">
            {recipeTitle(result.title)} by{" "}
            <Button
              as={Link}
              to={`/${result.authorId}`}
              variant="link"
              color="black"
            >
              {name(result.author)}
            </Button>
          </Heading>
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
              onChange={handleSearch}
            />
          </Stack>
        </Container>
        <Wrap spacing={4} mt={8} justify="space-evenly">
          {recipes?.map(renderResult)}
        </Wrap>
      </Container>
    </Page>
  );
};
