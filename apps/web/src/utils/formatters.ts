import { TrpcOutputs } from "../config/trpc";

type User = TrpcOutputs["getUser"];

export const name = (user: Partial<User>) =>
  `${user.firstName} ${user.lastName}`;

// Upper case the first letter of each word, lower case the rest
export const recipeTitle = (title: string) => {
  return title.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const normalizeSearch = (search: string) => {
  return search.toLowerCase().trim();
};
