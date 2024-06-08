import { User } from "@prisma/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import * as trpc from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { supabase } from "./config/supabase.config";
import { prisma } from "./config/prisma.config";

type ContextOptions = CreateExpressContextOptions | CreateWSSContextFnOptions;

type ContextResult = {
  jwt?: string;
  supabaseUser?: SupabaseUser;
  user?: User;
};

const getJwt = (req: ContextOptions["req"]): string | undefined => {
  const jwtFromHeader = req?.headers?.authorization?.split(" ")?.[1];
  if (jwtFromHeader) return jwtFromHeader;

  const jwtFromQueryParam = new URLSearchParams(req?.url?.substring(2))?.get(
    "jwt"
  );
  if (jwtFromQueryParam) return jwtFromQueryParam;

  return;
};

export const createContext = async (
  opts: ContextOptions
): Promise<ContextResult> => {
  // Potentially we have a JWT in the request headers
  const jwt = getJwt(opts.req);

  // If not, we can't authenticate the user
  if (!jwt)
    return {
      jwt: undefined,
      user: undefined,
      supabaseUser: undefined,
    };

  // If we do have a JWT, find the Supabase User
  const { data, error } = await supabase.auth.getUser(jwt);
  const supabaseUser = data?.user;

  if (!!error || !supabaseUser?.id) {
    return {
      jwt: undefined,
      user: undefined,
      supabaseUser: undefined,
    };
  }

  // Find the user in our database + their associated accounts
  const user = await prisma.user.findUnique({
    where: { supabaseUserId: supabaseUser.id },
  });

  // Return the JWT, user, and account
  return { jwt, user, supabaseUser };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
