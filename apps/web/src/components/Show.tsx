import { ReactNode } from "react";

interface Props {
  if?: boolean;
  children: ReactNode;
}

export const Show = ({ children, if: conditional }: Props) => {
  if (conditional) return <>{children}</>;
  return <></>;
};
