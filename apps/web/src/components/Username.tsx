import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

type Props = {
  children: string;
};
export const Username = ({ children }: Props) => {
  const username = children;
  return (
    <Button as={Link} to={`/${username}`} variant="link">
      @{username}
    </Button>
  );
};
