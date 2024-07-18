import { useParams } from "react-router-dom";
import { Page } from "../components/Page";
import { trpc } from "../config/trpc";
import {
  AspectRatio,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Show } from "../components/Show";
import { DataMissing } from "../components/DataMissing";
import { Username } from "../components/Username";
import { useMemo } from "react";

export const Recipe = () => {
  const params = useParams<{ username: string; slug: string }>();

  const { data: recipe, isLoading } = trpc.getRecipe.useQuery(params);

  const title = useMemo(() => {
    return recipe?.title;
  }, [recipe?.title]);
  const author = useMemo(() => {
    return `@${params?.username}`;
  }, [params?.username]);
  const pageTitle = useMemo(() => {
    return `${recipe?.title} by @${params?.username}`;
  }, [title, author]);
  const firstImageUrl = useMemo(() => {
    return recipe?.imageUrls?.[0] || "";
  }, [recipe?.imageUrls]);
  const description = useMemo(() => {
    return recipe?.description;
  }, [recipe?.description]);

  const renderIngredient = (ingredients: string) => {
    return <Text>- {ingredients}</Text>;
  };

  const renderDirection = (direction: string) => {
    return <Text>{direction}</Text>;
  };

  if (isLoading) {
    return <Page title={pageTitle}>Loading...</Page>;
  }

  return (
    <Page
      title={pageTitle}
      description={description}
      imageUrl={firstImageUrl}
      overflowY="auto"
    >
      <Stack py="8" my="8" spacing="4">
        <AspectRatio ratio={1} maxH="lg">
          <Image src={firstImageUrl} alt={title} />
        </AspectRatio>
        <Stack>
          <Heading fontSize="2xl" color="gray.700">
            {title}
          </Heading>
          <Heading fontSize="md" color="gray.500">
            by <Username>{params?.username}</Username>
          </Heading>
        </Stack>
        <Text fontSize="lg">{description}</Text>
        <Stack>
          <Card>
            <CardHeader fontSize="lg" fontWeight="medium">
              Ingredients
            </CardHeader>
            <Divider color="gray.200" />
            <CardBody>
              <Stack>
                {recipe?.ingredients?.map(renderIngredient)}
                <Show if={!recipe?.ingredients?.length}>
                  <Stack align="center">
                    <DataMissing
                      title="No Ingredients Found"
                      description="Know the ingredients that are missing?"
                      maxW="sm"
                    >
                      <Button colorScheme="gray" isDisabled>
                        Add Ingredients
                      </Button>
                    </DataMissing>
                  </Stack>
                </Show>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader fontSize="lg" fontWeight="medium">
              Directions
            </CardHeader>
            <Divider color="gray.200" />
            <CardBody>
              <Stack>
                {recipe?.directions?.map(renderDirection)}
                <Show if={!recipe?.directions?.length}>
                  <Stack align="center">
                    <DataMissing
                      title="No Directions Found"
                      description="Know the directions that are missing?"
                      maxW="sm"
                    >
                      <Button colorScheme="gray" isDisabled>
                        Add Directions
                      </Button>
                    </DataMissing>
                  </Stack>
                </Show>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </Stack>
    </Page>
  );
};
