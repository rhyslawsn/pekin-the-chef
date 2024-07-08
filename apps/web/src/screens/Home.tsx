import {
  Input,
  Stack,
  Image,
  Heading,
  Text,
  Wrap,
  Button,
  AspectRatio,
  Spinner,
} from "@chakra-ui/react";
import { Page } from "../components/Page";
import { Link, Outlet } from "react-router-dom";
import { TrpcOutputs, trpc } from "../config/trpc";
import { name, normalizeSearch, recipeTitle } from "../utils/formatters";
import { ChangeEvent, useState } from "react";
import { useDebounce } from "usehooks-ts";
import hero from "../assets/recipe-wiki-hero.jpg";
import { Show } from "../components/Show";

type Recipe = TrpcOutputs["getRecipes"][0];

export const Home = () => {
  const [search, setSearch] = useState<string>("");
  const query = useDebounce(search, 500);

  const { data: recipes, isLoading } = trpc.getRecipes.useQuery({ query });

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
        flex="1"
        minW="xs"
        as={Link}
        to={`/${result.author.username}/${result.slug}`}
      >
        <Image
          src={result.imageUrls?.[0]}
          alt={result.title}
          objectFit="cover"
          borderTopRadius="md"
          h="2xs"
        />
        <Stack m="2">
          <Heading size="sm">
            {recipeTitle(result.title)} by{" "}
            <Button
              as={Link}
              to={`/${result.author.username}`}
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
    <Page overflowY="auto">
      <Stack spacing={4} justify="center">
        <Stack spacing={2} direction="row" align="center">
          <Stack flex="2">
            <Heading size="2xl" color="gray.700">
              Dinner ideas from your favourite restaurants
            </Heading>
            <Heading size="md" color="gray.500">
              Find recipes from your favourite restaurants and chefs.
            </Heading>
          </Stack>
          <AspectRatio ratio={1} flex="1">
            <Image
              src={hero}
              alt="Credit: https://www.istockphoto.com/portfolio/gbh007"
            />
          </AspectRatio>
        </Stack>
        <Input
          placeholder="Find recipes from your favourite restaurants..."
          size="lg"
          onChange={handleSearch}
        />
      </Stack>
      <Wrap spacing={4} mt={8}>
        {recipes?.map(renderResult)}
      </Wrap>
      <Show if={isLoading}>
        <Stack align="center" mt={8}>
          <Spinner />
        </Stack>
      </Show>
    </Page>
  );
};
