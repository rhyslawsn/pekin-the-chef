import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import { TRPC } from "./components/TRPC";
import { theme } from "./config/theme";
import { Router } from "./Router";

import { ReactTagManager } from "react-gtm-ts";

ReactTagManager.init({
  code: "GTM-52K4Q9RL",
  debug: false,
  performance: true, // starts GTM only after user interaction (improve initial page load)
});

const App = () => {
  return (
    <HelmetProvider>
      <Router />
    </HelmetProvider>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider resetCSS theme={theme}>
    <BrowserRouter>
      <TRPC>
        <App />
      </TRPC>
    </BrowserRouter>
  </ChakraProvider>
);
