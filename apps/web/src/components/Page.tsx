import { Flex, FlexProps } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";

interface Props extends FlexProps {
  title?: string;
  withHeader?: boolean;
}

export const Page = ({ title, children, ...rest }: Props) => {
  return (
    <Flex direction="row" h="100vh" flex={1} overflowY="hidden" {...rest}>
      <Helmet>
        <title>{title ? `${title} • ` : ""}Recipe Wiki</title>
      </Helmet>
      {children}
    </Flex>
  );
};
