import { Container, Flex, FlexProps } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Header } from "./Header";

interface Props extends FlexProps {
  title?: string;
  withHeader?: boolean;
}

export const Page = ({ title, children, ...rest }: Props) => {
  return (
    <Flex direction="column" h="100vh" flex={1} overflowY="hidden" {...rest}>
      <Helmet>
        <title>{title ? `${title} • ` : ""}Peking the Chef</title>
      </Helmet>
      <Header />
      <Container maxW="container.lg">{children}</Container>
    </Flex>
  );
};
