import { Container, Flex, FlexProps } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Header } from "./Header";

interface Props extends FlexProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  withHeader?: boolean;
}

export const Page = ({
  title,
  description,
  imageUrl,
  children,
  ...rest
}: Props) => {
  return (
    <Flex direction="column" h="100vh" flex={1} overflowY="hidden" {...rest}>
      <Helmet>
        <title>{title}</title>
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content={imageUrl} />

        {/* for Title */}
        <meta property="og:title" content={title} />
        <meta itemProp="name" content={title} />
        <meta name="twitter:title" content={title} />

        {/* for Description */}
        <meta property="og:description" content={description} />
        <meta itemProp="description" content={description} />
        <meta name="twitter:description" content={description} />

        {/* for Image */}
        <meta property="og:image" content={imageUrl} />
        <meta itemProp="image" content={imageUrl} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      <Header />
      <Container maxW="container.lg">{children}</Container>
    </Flex>
  );
};
