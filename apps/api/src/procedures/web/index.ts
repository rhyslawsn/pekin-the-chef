import { trpc } from "../../trpc";
import * as recipeProcedures from "./recipe/index";

export const router = trpc.router({
  ...recipeProcedures,
});

export type Router = typeof router;
