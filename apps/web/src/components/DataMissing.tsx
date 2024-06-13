import { Heading, Stack, StackProps, Text } from "@chakra-ui/react";

type Props = StackProps & {
  title: string;
  description: string;
  children?: React.ReactNode;
};
export const DataMissing = ({
  title,
  description,
  children,
  ...rest
}: Props) => {
  return (
    <Stack {...rest}>
      <Heading size="md">{title}</Heading>
      <Text>{description}</Text>
      {children}
    </Stack>
  );
};
