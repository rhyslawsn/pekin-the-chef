import { useToast } from "@chakra-ui/react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createWSClient,
  httpLink,
  splitLink,
  TRPCClientError,
  wsLink,
} from "@trpc/client";
import { ReactNode, useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

import { trpc } from "../config/trpc";
import { supabaseClient } from "../utils/supabaseClient";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_WS_API_URL = import.meta.env.VITE_WS_API_URL;

if (!VITE_API_BASE_URL) throw new Error("VITE_API_BASE_URL is not defined");
if (!VITE_WS_API_URL) throw new Error("VITE_WS_API_URL is not defined");

type Props = {
  children: ReactNode;
};

const buildUrl = (jwtToken?: string) => {
  const url = new URL(VITE_WS_API_URL);
  if (jwtToken) url.searchParams.append("jwt", jwtToken);

  return url.toString();
};

export const TRPC = ({ children }: Props) => {
  const errorToast = useToast({ status: "error" });
  const [jwtToken] = useLocalStorage("accessToken", "");

  const queryClient = useMemo(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: async (error) => {
          const isTrpcError = error instanceof TRPCClientError;
          if (!isTrpcError) return console.log(error);

          const { code } = error?.data || {};
          if (error?.message === "LOGOUT") {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/login";
            return;
          }
          const isUnauthorized = code === "UNAUTHORIZED";
          const isForbidden = code === "FORBIDDEN";

          if (isUnauthorized) return supabaseClient.auth.refreshSession();
          if (isForbidden) {
            errorToast({
              title: "Forbidden",
              description: `You don't have access to this.`,
            });
          }
        },
      }),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    });
  }, [errorToast]);

  const wsClient = useMemo(() => {
    return createWSClient({ url: buildUrl(jwtToken) });
  }, [jwtToken]);

  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        splitLink({
          condition: (op) => op.type === "subscription",
          true: wsLink({ client: wsClient }),
          false: httpLink({
            url: `${VITE_API_BASE_URL}trpc`,
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }),
        }),
      ],
      transformer: undefined,
    });
  }, [wsClient, jwtToken]);

  useEffect(() => {
    return () => wsClient.close();
  }, [wsClient]);

  if (!trpcClient) return null;

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
